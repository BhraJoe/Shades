const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
const supabaseServiceKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

const supabase = createClient(supabaseUrl, supabaseServiceKey, {
     auth: {
          autoRefreshToken: false,
          persistSession: false
     }
});

async function createCategoriesTable() {
     console.log('Creating categories table...');

     // First check if table exists
     const { data: checkData, error: checkError } = await supabase
          .from('categories')
          .select('*')
          .limit(1);

     if (!checkError) {
          console.log('Categories table already exists');
          return true;
     }

     // Table doesn't exist, try to create via postgrest
     console.log('Categories table does not exist. Please create it in Supabase dashboard.');
     console.log('Run this SQL in your Supabase SQL Editor:');
     console.log(`
-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  slug TEXT NOT NULL UNIQUE,
  description TEXT DEFAULT '',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Policy for public read
CREATE POLICY "Anyone can view categories" ON categories FOR SELECT USING (true);

-- Seed categories
INSERT INTO categories (name, slug, description) VALUES
  ('Aviator', 'aviator', 'Classic aviator style sunglasses'),
  ('Wayfarer', 'wayfarer', 'Iconic wayfarer style sunglasses'),
  ('Clubmaster', 'clubmaster', 'Retro clubmaster browline sunglasses'),
  ('Round', 'round', 'Vintage round frame sunglasses'),
  ('Cat-Eye', 'cat-eye', 'Feminine cat-eye style sunglasses'),
  ('Rectangular', 'rectangular', 'Modern rectangular frame sunglasses'),
  ('Oversized', 'oversized', 'Bold oversized frame sunglasses'),
  ('Sport', 'sport', 'Athletic sport sunglasses')
ON CONFLICT (name) DO NOTHING;
  `);

     return false;
}

async function createOrdersTable() {
     console.log('Creating orders table...');

     // First check if table exists
     const { data: checkData, error: checkError } = await supabase
          .from('orders')
          .select('*')
          .limit(1);

     if (!checkError) {
          console.log('Orders table already exists');
          return true;
     }

     console.log('Orders table does not exist. Please create it in Supabase dashboard.');
     console.log('Run this SQL in your Supabase SQL Editor:');
     console.log(`
-- Create orders table
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

-- Enable RLS
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Policy for public read/insert
CREATE POLICY "Anyone can view orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Anyone can insert orders" ON orders FOR INSERT WITH CHECK (true);
  `);

     return false;
}

async function main() {
     console.log('=== Supabase Table Setup ===\n');

     const categoriesResult = await createCategoriesTable();
     console.log('');

     const ordersResult = await createOrdersTable();
     console.log('');

     if (categoriesResult && ordersResult) {
          console.log('All tables are ready!');
     } else {
          console.log('Please create the missing tables in Supabase dashboard.');
     }
}

main().catch(console.error);
