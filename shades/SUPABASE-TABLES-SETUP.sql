-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/rofkykdunbsnubguoukv/sql
-- ===========================================
-- CATEGORIES TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS categories (
     id BIGSERIAL PRIMARY KEY,
     name TEXT NOT NULL UNIQUE,
     slug TEXT NOT NULL UNIQUE,
     description TEXT DEFAULT '',
     created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS for categories
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
-- Policy: Everyone can view categories
CREATE POLICY "Anyone can view categories" ON categories FOR
SELECT USING (true);
-- Policy: Authenticated users can manage categories
CREATE POLICY "Authenticated users can manage categories" ON categories FOR ALL USING (auth.role() = 'authenticated');
-- Seed default categories
INSERT INTO categories (name, slug, description)
VALUES (
          'Aviator',
          'aviator',
          'Classic aviator style sunglasses'
     ),
     (
          'Wayfarer',
          'wayfarer',
          'Iconic wayfarer style sunglasses'
     ),
     (
          'Clubmaster',
          'clubmaster',
          'Retro clubmaster browline sunglasses'
     ),
     (
          'Round',
          'round',
          'Vintage round frame sunglasses'
     ),
     (
          'Cat-Eye',
          'cat-eye',
          'Feminine cat-eye style sunglasses'
     ),
     (
          'Rectangular',
          'rectangular',
          'Modern rectangular frame sunglasses'
     ),
     (
          'Oversized',
          'oversized',
          'Bold oversized frame sunglasses'
     ),
     ('Sport', 'sport', 'Athletic sport sunglasses') ON CONFLICT (name) DO NOTHING;
-- ===========================================
-- ORDERS TABLE
-- ===========================================
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
-- Enable RLS for orders
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
-- Policy: Everyone can view orders
CREATE POLICY "Anyone can view orders" ON orders FOR
SELECT USING (true);
-- Policy: Everyone can insert orders
CREATE POLICY "Anyone can insert orders" ON orders FOR
INSERT WITH CHECK (true);