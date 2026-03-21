import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import multer from 'multer';
import { Resend } from 'resend';

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

// Resend configuration for emails
const resend = new Resend(process.env.RESEND_API_KEY);
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'josephatanga25@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Shades Store <onboarding@resend.dev>';
const STORE_NAME = process.env.STORE_NAME || 'Shades';

console.log('Email config:', { ADMIN_EMAIL, FROM_EMAIL, STORE_NAME, hasResendKey: !!process.env.RESEND_API_KEY });

// Email sending function
async function sendOrderEmails(order) {
     console.log('sendOrderEmails called with order:', order.order_number);

     if (!process.env.RESEND_API_KEY) {
          console.error('RESEND_API_KEY is not set!');
          return { success: false, error: 'RESEND_API_KEY not configured' };
     }

     const { customer_email, customer_name, order_number, total, items, shipping_address, shipping_city, shipping_phone } = order;
     console.log('Sending emails to:', customer_email, 'and admin:', ADMIN_EMAIL);

     // Format items for email
     const itemsList = items.map(item => `${item.name} x${item.quantity} - ₵${(item.price * item.quantity).toFixed(2)}`).join('\n');

     // Customer email confirmation
     const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ${STORE_NAME}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">${STORE_NAME}</h1>
        <p style="color: white; margin: 10px 0 0 0;">Order Confirmation</p>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p>Hello ${customer_name},</p>
        <p>Thank you for your order! We've received your purchase and are processing it now.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order_number}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Items Ordered</h3>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>${shipping_address}</p>
            <p>${shipping_city}</p>
            <p>Phone: ${shipping_phone}</p>
        </div>
        
        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">Total: ₵${parseFloat(total).toFixed(2)}</p>
        </div>
        
        <p>We'll notify you once your order has been shipped. Thank you for shopping with ${STORE_NAME}!</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
            ${STORE_NAME} - Quality Eyewear<br>
            This is an automated confirmation email. Please don't reply to this message.
        </p>
    </div>
</body>
</html>
    `;

     // Admin email notification
     const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order - ${STORE_NAME}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <div style="background: #dc2626; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">${STORE_NAME}</h1>
        <p style="color: white; margin: 10px 0 0 0;">🚨 NEW ORDER RECEIVED!</p>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Order #${order_number}</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${customer_name}</p>
            <p><strong>Email:</strong> ${customer_email}</p>
            <p><strong>Phone:</strong> ${shipping_phone}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>${shipping_address}</p>
            <p>${shipping_city}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Items Ordered</h3>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">Total: ₵${parseFloat(total).toFixed(2)}</p>
        </div>
        
        <p style="color: #666;">Please process this order as soon as possible.</p>
    </div>
</body>
</html>
    `;

     try {
          // Send customer confirmation email
          await resend.emails.send({
               from: FROM_EMAIL,
               to: customer_email,
               subject: `Order Confirmed - ${order_number} | ${STORE_NAME}`,
               html: customerEmailHtml
          });
          console.log('Customer confirmation email sent to:', customer_email);

          // Send admin notification email
          await resend.emails.send({
               from: FROM_EMAIL,
               to: ADMIN_EMAIL,
               subject: `🛒 New Order - ${order_number} - ₵${parseFloat(total).toFixed(2)}`,
               html: adminEmailHtml
          });
          console.log('Admin notification email sent to:', ADMIN_EMAIL);

          return { success: true };
     } catch (error) {
          console.error('Email sending error:', error);
          return { success: false, error: error.message };
     }
}

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
          console.log('POST /api/orders - Received order:', JSON.stringify(req.body, null, 2));
          const order = req.body;

          // Only include fields that exist in the database
          const orderData = {
               order_number: order.order_number,
               customer_email: order.customer_email,
               customer_name: order.customer_name,
               shipping_address: order.shipping_address,
               shipping_city: order.shipping_city,
               shipping_state: order.shipping_state,
               shipping_zip: order.shipping_zip,
               shipping_country: order.shipping_country,
               shipping_phone: order.shipping_phone,
               subtotal: order.subtotal,
               shipping: order.shipping,
               tax: order.tax,
               total: order.total,
               status: order.status || 'processing',
               items: order.items
          };

          const { data, error } = await supabase
               .from('orders')
               .insert([orderData])
               .select();

          if (error) {
               console.error('Supabase insert error:', error);
               throw error;
          }
          console.log('Order saved successfully:', data);

          // Send order confirmation emails (non-blocking)
          sendOrderEmails(order).catch(err => console.error('Email sending failed:', err));

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
          console.log('GET /api/admin/orders - Fetching all orders');
          const { data, error } = await supabase
               .from('orders')
               .select('*')
               .order('created_at', { ascending: false });

          if (error) {
               console.error('Supabase select error:', error);
               throw error;
          }
          console.log('Found orders:', data?.length || 0);
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


