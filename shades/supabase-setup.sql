-- ===========================================
-- SUPABASE DATABASE SETUP FOR SHADES STORE
-- ===========================================
-- Run this SQL in your Supabase SQL Editor
-- https://app.supabase.com/project/YOUR_PROJECT/sql
-- Create products table
CREATE TABLE IF NOT EXISTS products (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    sku TEXT UNIQUE,
    description TEXT NOT NULL DEFAULT '',
    price REAL NOT NULL DEFAULT 0,
    category TEXT NOT NULL DEFAULT 'sunglasses',
    subcategory TEXT NOT NULL DEFAULT '',
    gender TEXT NOT NULL DEFAULT 'unisex',
    images TEXT [] DEFAULT '{}',
    colors TEXT [] DEFAULT '{}',
    sizes TEXT [] DEFAULT '{M}',
    stock INTEGER NOT NULL DEFAULT 0,
    is_bestseller BOOLEAN DEFAULT false,
    is_new BOOLEAN DEFAULT false,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);
-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_gender ON products(gender);
CREATE INDEX IF NOT EXISTS idx_products_bestseller ON products(is_bestseller);
CREATE INDEX IF NOT EXISTS idx_products_new ON products(is_new);
CREATE INDEX IF NOT EXISTS idx_products_created_at ON products(created_at DESC);
-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
-- Create policy for public read access
CREATE POLICY "Products are viewable by everyone" ON products FOR
SELECT USING (true);
-- Create policy for authenticated users to insert
CREATE POLICY "Authenticated users can insert products" ON products FOR
INSERT TO authenticated WITH CHECK (true);
-- Create policy for authenticated users to update
CREATE POLICY "Authenticated users can update products" ON products FOR
UPDATE TO authenticated USING (true);
-- Create policy for authenticated users to delete
CREATE POLICY "Authenticated users can delete products" ON products FOR DELETE TO authenticated USING (true);
-- ===========================================
-- ORDERS TABLE (Optional - if you want to store orders in Supabase)
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
-- Policy: Users can only see their own orders
CREATE POLICY "Users can view their own orders" ON orders FOR
SELECT USING (auth.uid()::text = customer_email);
-- Policy: Service role can manage all orders
CREATE POLICY "Service role can manage orders" ON orders FOR ALL USING (auth.role() = 'service_role');
-- ===========================================
-- SUBSCRIBERS TABLE
-- ===========================================
CREATE TABLE IF NOT EXISTS subscribers (
    id BIGSERIAL PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE subscribers ENABLE ROW LEVEL SECURITY;
-- Policy: Everyone can subscribe
CREATE POLICY "Anyone can subscribe" ON subscribers FOR
INSERT WITH CHECK (true);
-- Policy: Everyone can view subscribers
CREATE POLICY "Anyone can view subscribers" ON subscribers FOR
SELECT USING (true);
-- ===========================================
-- MESSAGES TABLE (Contact form)
-- ===========================================
CREATE TABLE IF NOT EXISTS messages (
    id BIGSERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    subject TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
-- Enable RLS
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
-- Policy: Everyone can submit messages
CREATE POLICY "Anyone can submit messages" ON messages FOR
INSERT WITH CHECK (true);
-- Policy: Authenticated users can view messages
CREATE POLICY "Authenticated users can view messages" ON messages FOR
SELECT USING (auth.role() = 'authenticated');
-- ===========================================
-- SEED DATA - Sample Products
-- ===========================================
INSERT INTO products (
        name,
        brand,
        sku,
        description,
        price,
        category,
        gender,
        images,
        colors,
        sizes,
        stock,
        is_bestseller,
        is_new
    )
VALUES (
        'Aviator Classic',
        'Ray-Ban',
        'RB-AV-001',
        'The iconic aviator design that has been a symbol of cool for decades.',
        169.00,
        'aviator',
        'unisex',
        ARRAY ['/images/products/aviator.svg'],
        ARRAY ['Gold/Green', 'Silver/Blue', 'Black/Grey'],
        ARRAY ['M', 'L'],
        25,
        true,
        false
    ),
    (
        'Wayfarer Original',
        'Ray-Ban',
        'RB-WF-001',
        'The definitive style icon that changed everything.',
        159.00,
        'wayfarer',
        'unisex',
        ARRAY ['/images/products/wayfarer.svg'],
        ARRAY ['Black', 'Tortoise', 'Demi Blue'],
        ARRAY ['S', 'M', 'L'],
        30,
        true,
        false
    ),
    (
        'Clubmaster Acetate',
        'Ray-Ban',
        'RB-CM-001',
        'A sophisticated blend of retro and contemporary.',
        189.00,
        'clubmaster',
        'unisex',
        ARRAY ['/images/products/clubmaster.svg'],
        ARRAY ['Black', 'Tortoise', 'Clear'],
        ARRAY ['M', 'L'],
        20,
        true,
        true
    ),
    (
        'Round Metal',
        'Ray-Ban',
        'RB-RM-001',
        'Nostalgic yet unmistakably modern.',
        149.00,
        'round',
        'unisex',
        ARRAY ['/images/products/round.svg'],
        ARRAY ['Gold', 'Silver', 'Gunmetal'],
        ARRAY ['S', 'M'],
        18,
        false,
        true
    ),
    (
        'Erika Gradient',
        'Ray-Ban',
        'RB-EG-001',
        'Bold and feminine, the Erika features oversized frames with gradient lenses.',
        159.00,
        'cat-eye',
        'women',
        ARRAY ['/images/products/cat-eye.svg'],
        ARRAY ['Pink', 'Purple', 'Black'],
        ARRAY ['M', 'L'],
        22,
        false,
        true
    ),
    (
        'Justin Matte',
        'Oakley',
        'OK-JM-001',
        'A fresh take on the classic rectangular shape with a modern matte finish.',
        145.00,
        'rectangular',
        'men',
        ARRAY ['/images/products/rectangular.svg'],
        ARRAY ['Matte Black', 'Matte Navy', 'Matte Grey'],
        ARRAY ['M', 'L'],
        28,
        true,
        false
    ) ON CONFLICT (sku) DO NOTHING;
-- ===========================================
-- STORAGE SETUP (for product images)
-- ===========================================
-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public)
VALUES ('product-images', 'product-images', true) ON CONFLICT (id) DO NOTHING;
-- Create storage policy for public access
CREATE POLICY "Public Access to Product Images" ON storage.objects FOR
SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Authenticated Upload to Product Images" ON storage.objects FOR
INSERT WITH CHECK (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Authenticated Update to Product Images" ON storage.objects FOR
UPDATE USING (
        bucket_id = 'product-images'
        AND auth.role() = 'authenticated'
    );
CREATE POLICY "Authenticated Delete from Product Images" ON storage.objects FOR DELETE USING (
    bucket_id = 'product-images'
    AND auth.role() = 'authenticated'
);