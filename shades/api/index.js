import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';

const app = express();

// Configure multer for FormData FIRST (before express.json())
const upload = multer({
     storage: multer.memoryStorage(),
     limits: { fileSize: 10 * 1024 * 1024 } // 10MB limit
});

// Use multer for any FormData, then express.json for JSON
app.use(upload.any());
app.use(cors());
app.use(express.json({ limit: '10mb' }));

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';
const supabase = createClient(supabaseUrl, supabaseKey);

const JWT_SECRET = process.env.JWT_SECRET || 'shades_secret_2024_vision';

// ============ AUTH ============
app.post('/api/auth/login', async (req, res) => {
     try {
          const { username, password } = req.body;
          if (!username || !password) {
               return res.status(400).json({ error: 'Username and password required' });
          }

          // Check users in Supabase
          const { data: users, error } = await supabase
               .from('users')
               .select('*')
               .eq('username', username)
               .limit(1);

          if (error) throw error;

          const user = users?.[0];
          if (!user) {
               return res.status(401).json({ error: 'Invalid username or password' });
          }

          const passwordMatch = bcrypt.compareSync(password, user.password_hash);
          if (!passwordMatch) {
               return res.status(401).json({ error: 'Invalid username or password' });
          }

          const token = jwt.sign(
               { id: user.id, username: user.username, role: user.role },
               JWT_SECRET,
               { expiresIn: '24h' }
          );

          return res.status(200).json({
               token,
               user: {
                    id: user.id,
                    username: user.username,
                    email: user.email,
                    role: user.role
               }
          });
     } catch (error) {
          console.error('Login error:', error);
          return res.status(500).json({ error: 'Internal server error' });
     }
});

app.get('/api/auth/me', async (req, res) => {
     try {
          const authHeader = req.headers.authorization;
          if (!authHeader || !authHeader.startsWith('Bearer ')) {
               return res.status(401).json({ error: 'Unauthorized' });
          }

          const token = authHeader.split(' ')[1];
          const decoded = jwt.verify(token, JWT_SECRET);

          const { data: users, error } = await supabase
               .from('users')
               .select('*')
               .eq('id', decoded.id)
               .limit(1);

          if (error) throw error;

          const user = users?.[0];
          if (!user) {
               return res.status(404).json({ error: 'User not found' });
          }

          return res.status(200).json({
               id: user.id,
               username: user.username,
               email: user.email,
               role: user.role
          });
     } catch (error) {
          console.error('Auth error:', error);
          return res.status(401).json({ error: 'Invalid token' });
     }
});

// ============ PRODUCTS ============
app.get('/api/products', async (req, res) => {
     try {
          const { data, error } = await supabase
               .from('products')
               .select('*')
               .order('created_at', { ascending: false });

          if (error) throw error;
          res.json(data || []);
     } catch (error) {
          console.error('Products error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.get('/api/bestsellers', async (req, res) => {
     try {
          const { data, error } = await supabase
               .from('products')
               .select('*')
               .eq('is_bestseller', true)
               .limit(8);

          if (error) throw error;
          res.json(data || []);
     } catch (error) {
          console.error('Bestsellers error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.get('/api/newarrivals', async (req, res) => {
     try {
          const { data, error } = await supabase
               .from('products')
               .select('*')
               .eq('is_new', true)
               .limit(8);

          if (error) throw error;
          res.json(data || []);
     } catch (error) {
          console.error('New arrivals error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.get('/api/products/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const { data, error } = await supabase
               .from('products')
               .select('*')
               .eq('id', id)
               .single();

          if (error) throw error;
          res.json(data);
     } catch (error) {
          console.error('Product error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ CATEGORIES ============
app.get('/api/categories', async (req, res) => {
     try {
          const { data, error } = await supabase
               .from('categories')
               .select('*')
               .order('name');

          if (error) throw error;
          res.json(data || []);
     } catch (error) {
          console.error('Categories error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ ORDERS ============
app.get('/api/orders', async (req, res) => {
     try {
          const { email } = req.query;
          let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

          if (email) {
               query = query.eq('customer_email', email);
          }

          const { data, error } = await query;
          if (error) throw error;
          res.json(data || []);
     } catch (error) {
          console.error('Orders error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.post('/api/orders', async (req, res) => {
     try {
          const order = req.body;
          const { data, error } = await supabase
               .from('orders')
               .insert([order])
               .select();

          if (error) throw error;
          res.status(201).json(data[0]);
     } catch (error) {
          console.error('Order error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ SUBSCRIBERS ============
app.post('/api/subscribe', async (req, res) => {
     try {
          const { email } = req.body;

          if (!email) {
               return res.status(400).json({ error: 'Email is required' });
          }

          console.log('Subscribe attempt for:', email);

          const { data, error } = await supabase
               .from('subscribers')
               .upsert([{ email }], { onConflict: 'email', ignoreDuplicates: true })
               .select();

          if (error) {
               console.error('Subscribe Supabase error:', error);
               // Handle duplicate gracefully
               if (error.code === '23505') {
                    return res.status(200).json({ message: 'Already subscribed' });
               }
               throw error;
          }
          console.log('Subscribe success:', data);
          res.status(201).json({ message: 'Subscribed successfully' });
     } catch (error) {
          console.error('Subscribe catch error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ CONTACT ============
app.post('/api/contact', async (req, res) => {
     try {
          const { name, email, subject, message } = req.body;
          const { data, error } = await supabase
               .from('messages')
               .insert([{ name, email, subject, message }])
               .select();

          if (error) throw error;
          res.status(201).json({ message: 'Message sent successfully' });
     } catch (error) {
          console.error('Contact error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ ADMIN PRODUCTS ============
app.get('/api/admin/products/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const { data, error } = await supabase
               .from('products')
               .select('*')
               .eq('id', id)
               .single();

          if (error) throw error;
          res.json(data);
     } catch (error) {
          console.error('Admin product fetch error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.post('/api/admin/products', async (req, res) => {
     try {
          console.log('Request body:', req.body);

          const body = req.body;

          // Handle JSON or FormData
          const product = {
               name: body.name || body.Name || 'Unnamed Product',
               brand: body.brand || body.Brand || '',
               price: parseFloat(body.price || body.Price) || 0,
               description: body.description || body.Description || '',
               category: body.category || body.category_id || body.Category || 'sunglasses',
               stock: parseInt(body.stock || body.Stock) || 0,
               is_bestseller: body.is_bestseller === true || body.is_bestseller === 'true' || body.is_bestseller === '1',
               is_new: body.is_new === true || body.is_new === 'true' || body.is_new === '1',
               colors: body.colors ? (typeof body.colors === 'string' ? JSON.parse(body.colors) : body.colors) : [],
               sizes: body.sizes ? (typeof body.sizes === 'string' ? JSON.parse(body.sizes) : body.sizes) : ['M'],
          };

          // Handle image - store directly
          const imageField = body.image || body.images;
          if (imageField) {
               if (typeof imageField === 'string' && imageField.startsWith('data:')) {
                    // Base64 image from JSON - upload to Supabase Storage
                    try {
                         const base64Data = imageField.split(',')[1];
                         // Store base64 directly - frontend will handle displaying it\n                         product.images = [imageField];
                         const mimeType = imageField.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
                         const ext = mimeType.split('/')[1] || 'jpg';
                         const fileName = `products/${Date.now()}.${ext}`;

                         const { data: uploadData, error: uploadError } = await supabase.storage
                              .from('images')
                              .upload(fileName, imageField, {
                                   contentType: mimeType
                              });

                         if (uploadError) {
                              console.error('Image upload error:', uploadError);
                         } else {
                              const { data: { publicUrl } } = supabase.storage
                                   .from('images')
                                   .getPublicUrl(fileName);
                              product.images = [publicUrl];
                         }
                    } catch (imgErr) {
                         console.error('Image handling error:', imgErr);
                    }
               } else if (typeof imageField === 'string' && !imageField.startsWith('data:')) {
                    // URL string
                    product.images = [imageField];
               }
          }

          console.log('Product to insert:', product);

          const { data, error } = await supabase
               .from('products')
               .insert([product])
               .select();

          if (error) {
               console.error('Supabase insert error:', error);
               throw error;
          }
          res.status(201).json(data[0]);
     } catch (error) {
          console.error('Admin product error:', error);
          res.status(500).json({ error: error.message, details: error.details });
     }
});

app.put('/api/admin/products/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const body = req.body;

          // First fetch the existing product
          const { data: existingProduct, error: fetchError } = await supabase
               .from('products')
               .select('*')
               .eq('id', id)
               .single();

          if (fetchError) throw fetchError;
          if (!existingProduct) {
               return res.status(404).json({ error: 'Product not found' });
          }

          // Check if this is a partial update (only is_bestseller or is_new)
          const isPartialUpdate = Object.keys(body).length === 1 &&
               (body.is_bestseller !== undefined || body.is_new !== undefined);

          // Handle JSON or FormData
          const product = {
               name: body.name || body.Name || (isPartialUpdate ? existingProduct.name : '') || 'Unnamed Product',
               brand: body.brand || body.Brand || (isPartialUpdate ? existingProduct.brand : '') || '',
               price: parseFloat(body.price || body.Price) || (isPartialUpdate ? existingProduct.price : 0),
               description: body.description || body.Description || (isPartialUpdate ? existingProduct.description : ''),
               category: body.category || body.category_id || body.Category || (isPartialUpdate ? existingProduct.category : 'sunglasses'),
               stock: parseInt(body.stock || body.Stock) || (isPartialUpdate ? existingProduct.stock : 0),
               is_bestseller: body.is_bestseller !== undefined
                    ? (body.is_bestseller === true || body.is_bestseller === 'true' || body.is_bestseller === '1')
                    : (isPartialUpdate ? existingProduct.is_bestseller : false),
               is_new: body.is_new !== undefined
                    ? (body.is_new === true || body.is_new === 'true' || body.is_new === '1')
                    : (isPartialUpdate ? existingProduct.is_new : false),
               colors: body.colors ? (typeof body.colors === 'string' ? JSON.parse(body.colors) : body.colors) : (isPartialUpdate ? existingProduct.colors : []),
               sizes: body.sizes ? (typeof body.sizes === 'string' ? JSON.parse(body.sizes) : body.sizes) : (isPartialUpdate ? existingProduct.sizes : ['M']),
          };

          // Handle image - store directly
          const imageField = body.image || body.images;
          if (imageField) {
               if (typeof imageField === 'string' && imageField.startsWith('data:')) {
                    // Base64 image from JSON - upload to Supabase Storage
                    try {
                         const base64Data = imageField.split(',')[1];
                         // Store base64 directly - frontend will handle displaying it\n                         product.images = [imageField];
                         const mimeType = imageField.match(/data:([^;]+);/)?.[1] || 'image/jpeg';
                         const ext = mimeType.split('/')[1] || 'jpg';
                         const fileName = `products/${Date.now()}.${ext}`;

                         const { data: uploadData, error: uploadError } = await supabase.storage
                              .from('images')
                              .upload(fileName, imageField, {
                                   contentType: mimeType
                              });

                         if (uploadError) {
                              console.error('Image upload error:', uploadError);
                         } else {
                              const { data: { publicUrl } } = supabase.storage
                                   .from('images')
                                   .getPublicUrl(fileName);
                              product.images = [publicUrl];
                         }
                    } catch (imgErr) {
                         console.error('Image handling error:', imgErr);
                    }
               } else if (typeof imageField === 'string' && !imageField.startsWith('data:')) {
                    // URL string
                    product.images = [imageField];
               }
          }

          const { data, error } = await supabase
               .from('products')
               .update(product)
               .eq('id', id)
               .select();

          if (error) throw error;
          res.json(data[0]);
     } catch (error) {
          console.error('Admin product update error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.delete('/api/admin/products/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const { error } = await supabase
               .from('products')
               .delete()
               .eq('id', id);

          if (error) throw error;
          res.json({ message: 'Product deleted' });
     } catch (error) {
          console.error('Admin product delete error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ ADMIN CATEGORIES ============
app.post('/api/admin/categories', async (req, res) => {
     try {
          const category = req.body;
          const { data, error } = await supabase
               .from('categories')
               .insert([category])
               .select();

          if (error) throw error;
          res.status(201).json(data[0]);
     } catch (error) {
          console.error('Admin category error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.put('/api/admin/categories/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const category = req.body;
          const { data, error } = await supabase
               .from('categories')
               .update(category)
               .eq('id', id)
               .select();

          if (error) throw error;
          res.json(data[0]);
     } catch (error) {
          console.error('Admin category update error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.delete('/api/admin/categories/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const { error } = await supabase
               .from('categories')
               .delete()
               .eq('id', id);

          if (error) throw error;
          res.json({ message: 'Category deleted' });
     } catch (error) {
          console.error('Admin category delete error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ ADMIN ORDERS ============
app.get('/api/admin/orders', async (req, res) => {
     try {
          const { data, error } = await supabase
               .from('orders')
               .select('*')
               .order('created_at', { ascending: false });

          if (error) throw error;
          res.json(data || []);
     } catch (error) {
          console.error('Admin orders error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.put('/api/admin/orders/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const { status } = req.body;
          const { data, error } = await supabase
               .from('orders')
               .update({ status })
               .eq('id', id)
               .select();

          if (error) throw error;
          res.json(data[0]);
     } catch (error) {
          console.error('Admin order update error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.delete('/api/admin/orders/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const { error } = await supabase
               .from('orders')
               .delete()
               .eq('id', id);

          if (error) throw error;
          res.json({ message: 'Order deleted' });
     } catch (error) {
          console.error('Admin order delete error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ ADMIN SUBSCRIBERS ============
app.get('/api/admin/subscribers', async (req, res) => {
     try {
          const { data, error } = await supabase
               .from('subscribers')
               .select('*')
               .order('created_at', { ascending: false });

          if (error) {
               // Table might not exist, return empty array
               if (error.code === '42P01') {
                    return res.json([]);
               }
               throw error;
          }
          res.json(data || []);
     } catch (error) {
          console.error('Admin subscribers error:', error);
          res.status(500).json({ error: error.message });
     }
});

// ============ ADMIN MESSAGES ============
app.get('/api/admin/messages', async (req, res) => {
     try {
          const { data, error } = await supabase
               .from('messages')
               .select('*')
               .order('created_at', { ascending: false });

          if (error) {
               // Table might not exist, return empty array
               if (error.code === '42P01') {
                    return res.json([]);
               }
               throw error;
          }
          res.json(data || []);
     } catch (error) {
          console.error('Admin messages error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.delete('/api/admin/subscribers/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const { error } = await supabase
               .from('subscribers')
               .delete()
               .eq('id', id);

          if (error) throw error;
          res.json({ message: 'Subscriber deleted' });
     } catch (error) {
          console.error('Admin subscriber delete error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.delete('/api/admin/subscribers', async (req, res) => {
     try {
          const { error } = await supabase
               .from('subscribers')
               .delete()
               .neq('id', 0);

          if (error) throw error;
          res.json({ message: 'All subscribers deleted' });
     } catch (error) {
          console.error('Admin subscribers delete all error:', error);
          res.status(500).json({ error: error.message });
     }
});

export default app;


