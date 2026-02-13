import { readData, writeData, paths } from '../database.js';

const { PRODUCTS_FILE } = paths;

// CORS headers
function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
}

// Parse URL to get path and query
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
                const products = await readData(PRODUCTS_FILE);
                console.log('GET products - found:', products.length);
                return res.status(200).json(products);
            } catch (error) {
                console.error('Error fetching products:', error);
                return res.status(500).json({ error: 'Failed to fetch products' });
            }
        }

        if (req.method === 'POST') {
            console.log('POST request received');
            console.log('Body:', JSON.stringify(req.body).substring(0, 500));

            try {
                let product = req.body;

                // If body is string, parse it
                if (typeof product === 'string') {
                    product = JSON.parse(product);
                }

                console.log('Parsed product:', JSON.stringify(product).substring(0, 500));

                // Parse images if they're sent as a string
                let images = [];
                if (product.images) {
                    if (typeof product.images === 'string' && product.images.startsWith('[')) {
                        images = JSON.parse(product.images);
                    } else if (Array.isArray(product.images)) {
                        images = product.images;
                    }
                }

                const products = await readData(PRODUCTS_FILE);
                console.log('Current products count:', products.length);

                const newProduct = {
                    id: products.length > 0 ? Math.max(...products.map(p => p.id)) + 1 : 1,
                    name: product.name || 'Unnamed Product',
                    brand: product.brand || '',
                    sku: product.sku || `SKU-${Date.now()}`,
                    description: product.description || '',
                    price: parseFloat(product.price) || 0,
                    category: product.category || 'sunglasses',
                    gender: product.gender || 'unisex',
                    images: images,
                    colors: product.colors ? (typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors) : [],
                    sizes: product.sizes ? (typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes) : ['M'],
                    stock: parseInt(product.stock) || 0,
                    is_bestseller: parseInt(product.is_bestseller) || 0,
                    is_new: parseInt(product.is_new) || 0,
                    created_at: new Date().toISOString()
                };

                products.push(newProduct);
                await writeData(PRODUCTS_FILE, products);

                console.log('Product created successfully:', newProduct.id);
                return res.status(201).json(newProduct);
            } catch (error) {
                console.error('Error creating product:', error);
                return res.status(500).json({ error: 'Failed to create product: ' + error.message });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });
    }

    // PUT or DELETE /api/admin/products/:id
    if (path.match(/^\/api\/admin\/products\/\d+$/) || path.match(/^\/admin\/products\/\d+$/)) {
        const id = parseInt(path.split('/').pop());

        if (req.method === 'PUT') {
            try {
                const product = req.body;
                const products = await readData(PRODUCTS_FILE);
                const index = products.findIndex(p => p.id === id);

                if (index === -1) {
                    return res.status(404).json({ error: 'Product not found' });
                }

                let images = products[index].images || [];
                if (product.images) {
                    if (typeof product.images === 'string' && product.images.startsWith('[')) {
                        images = JSON.parse(product.images);
                    } else if (Array.isArray(product.images)) {
                        images = product.images;
                    }
                }

                const updatedProduct = {
                    ...products[index],
                    name: product.name !== undefined ? product.name : products[index].name,
                    brand: product.brand !== undefined ? product.brand : products[index].brand,
                    sku: product.sku !== undefined ? product.sku : products[index].sku,
                    description: product.description !== undefined ? product.description : products[index].description,
                    price: product.price !== undefined ? parseFloat(product.price) : products[index].price,
                    category: product.category !== undefined ? product.category : products[index].category,
                    gender: product.gender !== undefined ? product.gender : products[index].gender,
                    images: images,
                    colors: product.colors ? (typeof product.colors === 'string' ? JSON.parse(product.colors) : product.colors) : products[index].colors,
                    sizes: product.sizes ? (typeof product.sizes === 'string' ? JSON.parse(product.sizes) : product.sizes) : products[index].sizes,
                    stock: product.stock !== undefined ? parseInt(product.stock) : products[index].stock,
                    is_bestseller: product.is_bestseller !== undefined ? parseInt(product.is_bestseller) : products[index].is_bestseller,
                    is_new: product.is_new !== undefined ? parseInt(product.is_new) : products[index].is_new,
                    updated_at: new Date().toISOString()
                };

                products[index] = updatedProduct;
                await writeData(PRODUCTS_FILE, products);

                return res.status(200).json(updatedProduct);
            } catch (error) {
                console.error('Error updating product:', error);
                return res.status(500).json({ error: 'Failed to update product' });
            }
        }

        if (req.method === 'DELETE') {
            try {
                const products = await readData(PRODUCTS_FILE);
                const index = products.findIndex(p => p.id === id);

                if (index === -1) {
                    return res.status(404).json({ error: 'Product not found' });
                }

                products.splice(index, 1);
                await writeData(PRODUCTS_FILE, products);

                return res.status(200).json({ message: 'Product deleted successfully' });
            } catch (error) {
                console.error('Error deleting product:', error);
                return res.status(500).json({ error: 'Failed to delete product' });
            }
        }

        return res.status(405).json({ error: 'Method not allowed' });
    }

    // Default - not found
    return res.status(404).json({ error: 'Not found' });
}
