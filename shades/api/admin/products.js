import { getAllProducts, addProduct, updateProduct, deleteProduct, getProductById } from '../firestore.js';

// CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Parse URL
function parseUrl(url) {
    const [path, query] = url.split('?');
    return { path, query };
}

export default async function handler(req, res) {
    // Handle CORS preflight
    if (req.method === 'OPTIONS') {
        setCorsHeaders(res);
        return res.status(200).end();
    }

    setCorsHeaders(res);

    const { path } = parseUrl(req.url || req.uri || '');

    console.log('Admin Products API - Path:', path, 'Method:', req.method);

    // GET /api/admin/products - get all products
    if (path === '/api/admin/products' || path === '/admin/products') {
        if (req.method === 'GET') {
            try {
                const products = await getAllProducts();
                if (products) {
                    return res.status(200).json(products);
                }
                return res.status(200).json([]);
            } catch (error) {
                console.error('Error fetching products:', error);
                return res.status(500).json({ error: 'Failed to fetch products' });
            }
        }

        if (req.method === 'POST') {
            try {
                let product = req.body;
                if (typeof req.body === 'string') {
                    product = JSON.parse(req.body);
                }

                if (!product || typeof product !== 'object') {
                    return res.status(400).json({ error: 'No product data provided' });
                }

                // Handle images
                let images = [];
                if (product.images) {
                    if (typeof product.images === 'string') {
                        images = [product.images];
                    } else if (Array.isArray(product.images)) {
                        images = product.images;
                    }
                }

                const newProduct = {
                    name: product.name || 'Unnamed Product',
                    brand: product.brand || '',
                    sku: product.sku || `SKU-${Date.now()}`,
                    description: product.description || '',
                    price: parseFloat(product.price) || 0,
                    category: product.category || 'sunglasses',
                    subcategory: product.subcategory || '',
                    gender: product.gender || 'unisex',
                    images: images,
                    colors: Array.isArray(product.colors) ? product.colors : [],
                    sizes: Array.isArray(product.sizes) ? product.sizes : ['M'],
                    stock: parseInt(product.stock) || 0,
                    is_bestseller: parseInt(product.is_bestseller) || 0,
                    is_new: parseInt(product.is_new) || 0,
                };

                const result = await addProduct(newProduct);

                if (result) {
                    console.log('Product created:', result.id);
                    return res.status(201).json(result);
                }

                return res.status(500).json({ error: 'Failed to save product to database' });
            } catch (error) {
                console.error('Error creating product:', error);
                return res.status(500).json({ error: 'Failed to create product: ' + error.message });
            }
        }
    }

    // PUT or DELETE /api/admin/products/:id
    const idMatch = path.match(/^\/api\/admin\/products\/([^/]+)$/) || path.match(/^\/admin\/products\/([^/]+)$/);
    if (idMatch) {
        const productId = idMatch[1];

        if (req.method === 'PUT') {
            try {
                let product = req.body;
                if (typeof req.body === 'string') {
                    product = JSON.parse(req.body);
                }

                const result = await updateProduct(productId, product);

                if (result) {
                    return res.status(200).json(result);
                }

                return res.status(404).json({ error: 'Product not found' });
            } catch (error) {
                console.error('Error updating product:', error);
                return res.status(500).json({ error: 'Failed to update product' });
            }
        }

        if (req.method === 'DELETE') {
            try {
                const success = await deleteProduct(productId);

                if (success) {
                    return res.status(200).json({ message: 'Product deleted' });
                }

                return res.status(404).json({ error: 'Product not found' });
            } catch (error) {
                console.error('Error deleting product:', error);
                return res.status(500).json({ error: 'Failed to delete product' });
            }
        }
    }

    return res.status(404).json({ error: 'Not found' });
}
