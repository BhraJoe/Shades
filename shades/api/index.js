import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const app = express();
app.use(cors());
app.use(express.json());

// Supabase configuration
const supabaseUrl = process.env.SUPABASE_URL || 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';
const supabase = createClient(supabaseUrl, supabaseKey);

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
          const { data, error } = await supabase
               .from('subscribers')
               .insert([{ email }])
               .select();

          if (error) throw error;
          res.status(201).json({ message: 'Subscribed successfully' });
     } catch (error) {
          console.error('Subscribe error:', error);
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
app.post('/api/admin/products', async (req, res) => {
     try {
          const product = req.body;
          const { data, error } = await supabase
               .from('products')
               .insert([product])
               .select();

          if (error) throw error;
          res.status(201).json(data[0]);
     } catch (error) {
          console.error('Admin product error:', error);
          res.status(500).json({ error: error.message });
     }
});

app.put('/api/admin/products/:id', async (req, res) => {
     try {
          const { id } = req.params;
          const product = req.body;
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

          if (error) throw error;
          res.json(data || []);
     } catch (error) {
          console.error('Admin subscribers error:', error);
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
