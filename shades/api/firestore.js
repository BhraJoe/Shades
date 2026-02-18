// Supabase-based product storage
// Uses Supabase as the database backend for product persistence
// Fallback to in-memory storage if Supabase is not configured

import { supabase, productService, isSupabaseConfigured } from './supabase.js';

// In-memory fallback (for development without Supabase)
let products = [];

export async function getAllProducts() {
    if (isSupabaseConfigured) {
        try {
            return await productService.getAll();
        } catch (error) {
            console.error('Supabase error, falling back to in-memory:', error.message);
        }
    }
    return products;
}

export async function getProductById(id) {
    if (isSupabaseConfigured) {
        try {
            return await productService.getById(id);
        } catch (error) {
            console.error('Supabase error, falling back to in-memory:', error.message);
        }
    }
    return products.find(p => p.id === id) || null;
}

export async function addProduct(productData) {
    const newProduct = {
        id: 'prod_' + Date.now(),
        ...productData,
        createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured) {
        try {
            const result = await productService.create(productData);
            console.log('Product added to Supabase:', result.id);
            return result;
        } catch (error) {
            console.error('Supabase error, falling back to in-memory:', error.message);
        }
    }

    products.push(newProduct);
    console.log('Product added to in-memory:', newProduct.id);
    return newProduct;
}

export async function updateProduct(id, productData) {
    if (isSupabaseConfigured) {
        try {
            const result = await productService.update(id, productData);
            console.log('Product updated in Supabase:', id);
            return result;
        } catch (error) {
            console.error('Supabase error, falling back to in-memory:', error.message);
        }
    }

    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...productData };
    return products[index];
}

export async function deleteProduct(id) {
    if (isSupabaseConfigured) {
        try {
            await productService.delete(id);
            console.log('Product deleted from Supabase:', id);
            return true;
        } catch (error) {
            console.error('Supabase error, falling back to in-memory:', error.message);
        }
    }

    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
}

export { isSupabaseConfigured, supabase };
export const db = null;
