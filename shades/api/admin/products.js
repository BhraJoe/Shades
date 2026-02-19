// Admin products API using dynamic imports

export default async function handler(req, res) {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (req.method === 'OPTIONS') {
        console.log('OPTIONS request received');
        return res.status(200).end();
    }

    console.log('Request method:', req.method, 'URL:', req.url);
    console.log('Request headers:', JSON.stringify(req.headers));

    // Parse path from URL
    let path = '/';
    try {
        const urlObj = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
        path = urlObj.pathname;
    } catch (e) {
        path = '/api/admin/products';
    }

    console.log('Admin Products API - Path:', path, 'Method:', req.method);

    // Import Supabase dynamically
    const { createClient } = await import('@supabase/supabase-js');

    const supabaseUrl = 'https://llyjnqdhxxnrqgraicuh.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseWpucWRoeHhucnFncmFpY3VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI2NDYxNCwiZXhwIjoyMDg2ODQwNjE0fQ.YgF6VxgPDQU79DRzh8d1jAGWr98Aoj1iZcgJGNE0Cgo';

    const supabase = createClient(supabaseUrl, supabaseKey);

    // GET /api/admin/products - get all products
    if (req.method === 'GET' && (path === '/api/admin/products' || path === '/admin/products')) {
        try {
            const { data, error } = await supabase.from('products').select('*').order('id', { ascending: false });

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data || []);
        } catch (error) {
            console.error('Error fetching products:', error);
            return res.status(500).json({ error: 'Failed to fetch products' });
        }
    }

    // POST /api/admin/products - create product
    if (req.method === 'POST' && (path === '/api/admin/products' || path === '/admin/products')) {
        try {
            let product = req.body;
            if (!product) {
                return res.status(400).json({ error: 'No product data provided' });
            }

            if (typeof product === 'string') {
                try {
                    product = JSON.parse(product);
                } catch (e) {
                    return res.status(400).json({ error: 'Invalid JSON' });
                }
            }

            console.log('Creating product:', product);

            const newProduct = {
                name: product.name || 'Unnamed Product',
                brand: product.brand || '',
                sku: product.sku || `SKU-${Date.now()}`,
                description: product.description || '',
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
            };

            const { data, error } = await supabase
                .from('products')
                .insert([newProduct])
                .select()
                .single();

            if (error) {
                console.error('Supabase insert error:', error);
                return res.status(500).json({ error: error.message });
            }

            console.log('Product created:', data.id);
            return res.status(201).json(data);
        } catch (error) {
            console.error('Error creating product:', error);
            return res.status(500).json({ error: 'Failed to create product: ' + error.message });
        }
    }

    // 404 for unmatched routes
    return res.status(404).json({ error: 'Not found' });
}
