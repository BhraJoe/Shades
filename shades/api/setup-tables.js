const express = require('express');
const { createClient } = require('@supabase/supabase-js');

const router = express.Router();

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_KEY || process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// Create categories table
router.post('/create-categories-table', async (req, res) => {
     try {
          // Create categories table using SQL
          const { data, error } = await supabase.rpc('exec_sql', {
               query: `
        CREATE TABLE IF NOT EXISTS categories (
          id BIGSERIAL PRIMARY KEY,
          name TEXT NOT NULL UNIQUE,
          slug TEXT NOT NULL UNIQUE,
          description TEXT DEFAULT '',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
          });

          if (error) throw error;

          // Enable RLS
          await supabase.rpc('exec_sql', {
               query: `ALTER TABLE categories ENABLE ROW LEVEL SECURITY;`
          });

          // Create policy
          await supabase.rpc('exec_sql', {
               query: `CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);`
          });

          // Seed default categories
          const categories = [
               { name: 'Aviator', slug: 'aviator', description: 'Classic aviator style sunglasses' },
               { name: 'Wayfarer', slug: 'wayfarer', description: 'Iconic wayfarer style sunglasses' },
               { name: 'Clubmaster', slug: 'clubmaster', description: 'Retro clubmaster browline sunglasses' },
               { name: 'Round', slug: 'round', description: 'Vintage round frame sunglasses' },
               { name: 'Cat-Eye', slug: 'cat-eye', description: 'Feminine cat-eye style sunglasses' },
               { name: 'Rectangular', slug: 'rectangular', description: 'Modern rectangular frame sunglasses' },
               { name: 'Oversized', slug: 'oversized', description: 'Bold oversized frame sunglasses' },
               { name: 'Sport', slug: 'sport', description: 'Athletic sport sunglasses' }
          ];

          for (const cat of categories) {
               await supabase.from('categories').upsert(cat, { onConflict: 'name' });
          }

          res.json({ message: 'Categories table created successfully', data });
     } catch (error) {
          console.error('Error creating categories table:', error);
          res.status(500).json({ error: error.message });
     }
});

// Create orders table
router.post('/create-orders-table', async (req, res) => {
     try {
          // Create orders table using SQL
          const { data, error } = await supabase.rpc('exec_sql', {
               query: `
        CREATE TABLE IF NOT EXISTS orders (
          id BIGSERIAL PRIMARY KEY,
          order_number TEXT NOT NULL UNIQUE,
          customer_email TEXT NOT NULL,
          customer_name TEXT NOT NULL,
          shipping_address TEXT,
          shipping_city TEXT,
          shipping_state TEXT,
          shipping_zip TEXT,
          shipping_country TEXT,
          shipping_phone TEXT,
          subtotal REAL NOT NULL DEFAULT 0,
          shipping REAL NOT NULL DEFAULT 0,
          tax REAL NOT NULL DEFAULT 0,
          total REAL NOT NULL DEFAULT 0,
          status TEXT DEFAULT 'confirmed',
          items JSONB NOT NULL DEFAULT '[]',
          created_at TIMESTAMPTZ DEFAULT NOW()
        );
      `
          });

          if (error) throw error;

          // Enable RLS
          await supabase.rpc('exec_sql', {
               query: `ALTER TABLE orders ENABLE ROW LEVEL SECURITY;`
          });

          // Create policies
          await supabase.rpc('exec_sql', {
               query: `CREATE POLICY "Anyone can view orders" ON orders FOR SELECT USING (true);`
          });

          await supabase.rpc('exec_sql', {
               query: `CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);`
          });

          res.json({ message: 'Orders table created successfully', data });
     } catch (error) {
          console.error('Error creating orders table:', error);
          res.status(500).json({ error: error.message });
     }
});

module.exports = router;
