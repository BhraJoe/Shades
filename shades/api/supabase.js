import { createClient } from '@supabase/supabase-js';

// Get environment variables and clean them
let supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '';
let supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_SERVICE_KEY || '';

// Clean the values - remove any whitespace or special characters
if (supabaseUrl) {
    supabaseUrl = supabaseUrl.replace(/[\s\n\r\t]/g, '');
}
if (supabaseServiceKey) {
    supabaseServiceKey = supabaseServiceKey.replace(/[\s\n\r\t]/g, '');
}

console.log('Supabase init - URL:', supabaseUrl ? 'set' : 'not set');
console.log('Supabase init - Key:', supabaseServiceKey ? 'set' : 'not set');

// Create Supabase client with service role key (for server-side operations)
export const supabase = supabaseUrl && supabaseServiceKey
    ? createClient(supabaseUrl, supabaseServiceKey)
    : null;

// Check if Supabase is configured
export const isSupabaseConfigured = !!(supabase && supabaseUrl && supabaseServiceKey);

// Product operations using Supabase
export const productService = {
    // Get all products
    async getAll() {
        if (!supabase) throw new Error('Supabase not configured');
        const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data;
    },

    // Get product by ID
    async getById(id) {
        if (!supabase) throw new Error('Supabase not configured');
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
        if (!supabase) throw new Error('Supabase not configured');
        const { data, error } = await supabase
            .from('products')
            .insert([{
                name: product.name,
                brand: product.brand,
                sku: product.sku || `SKU-${Date.now()}`,
                description: product.description,
                price: parseFloat(product.price) || 0,
                category: product.category || 'sunglasses',
                subcategory: product.subcategory || '',
                gender: product.gender || 'unisex',
                images: product.images || [],
                colors: product.colors || [],
                sizes: product.sizes || ['M'],
                stock: parseInt(product.stock) || 0,
                is_bestseller: !!product.is_bestseller,
                is_new: !!product.is_new,
            }])
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Update product
    async update(id, product) {
        if (!supabase) throw new Error('Supabase not configured');
        const { data, error } = await supabase
            .from('products')
            .update({
                name: product.name,
                brand: product.brand,
                sku: product.sku,
                description: product.description,
                price: parseFloat(product.price) || 0,
                category: product.category,
                subcategory: product.subcategory || '',
                gender: product.gender,
                images: product.images,
                colors: product.colors,
                sizes: product.sizes,
                stock: parseInt(product.stock) || 0,
                is_bestseller: !!product.is_bestseller,
                is_new: !!product.is_new,
            })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete product
    async delete(id) {
        if (!supabase) throw new Error('Supabase not configured');
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
        return true;
    }
};
