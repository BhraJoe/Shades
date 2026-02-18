import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

// Product operations using Supabase
export const productService = {
    // Get all products
    async getAll() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get product by ID
    async getById(id) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('id', id)
            .single();

        if (error) throw error;
        return data;
    },

    // Create new product
    async create(product) {
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                brand: product.brand,
                sku: product.sku || `SKU-${Date.now()}`,
                description: product.description,
                price: parseFloat(product.price) || 0,
                category: product.category || 'sunglasses',
                gender: product.gender || 'unisex',
                images: product.images || [],
                colors: product.colors || [],
                sizes: product.sizes || ['M'],
                stock: parseInt(product.stock) || 0,
                is_bestseller: product.is_bestseller || false,
                is_new: product.is_new || false,
            }])
            .select();

        if (error) throw error;
        return data[0];
    },

    // Update product
    async update(id, product) {
        const { data, error } = await supabase
            .from('products')
            .update({
                name: product.name,
                brand: product.brand,
                sku: product.sku,
                description: product.description,
                price: parseFloat(product.price) || 0,
                category: product.category,
                gender: product.gender,
                images: product.images,
                colors: product.colors,
                sizes: product.sizes,
                stock: parseInt(product.stock) || 0,
                is_bestseller: product.is_bestseller,
                is_new: product.is_new,
                updated_at: new Date().toISOString(),
            })
            .eq('id', id)
            .select();

        if (error) throw error;
        return data[0];
    },

    // Delete product
    async delete(id) {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    },

    // Get products by category
    async getByCategory(category) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('category', category)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get bestsellers
    async getBestsellers() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_bestseller', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get new arrivals
    async getNewArrivals() {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .eq('is_new', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Search products
    async search(query) {
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .or(`name.ilike.%${query}%,brand.ilike.%${query}%,description.ilike.%${query}%`)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    }
};

export default supabase;
