// Simple in-memory storage for products
// Note: This doesn't persist across serverless function calls
// For production, use a real database like Supabase, MongoDB Atlas, or Firebase

const products = [];

export async function getAllProducts() {
    return products;
}

export async function getProductById(id) {
    return products.find(p => p.id === id) || null;
}

export async function addProduct(productData) {
    const newProduct = {
        id: 'prod_' + Date.now(),
        ...productData,
        createdAt: new Date().toISOString()
    };
    products.push(newProduct);
    console.log('Product added:', newProduct.id);
    return newProduct;
}

export async function updateProduct(id, productData) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return null;
    products[index] = { ...products[index], ...productData };
    return products[index];
}

export async function deleteProduct(id) {
    const index = products.findIndex(p => p.id === id);
    if (index === -1) return false;
    products.splice(index, 1);
    return true;
}

export const isFirestoreAvailable = false;
export const db = null;
