// Products API for Vercel - combines products, bestsellers, and newarrivals

export default async function handler(req, res) {
    const { method } = req;

    // Parse path from URL
    let path = '/';
    let pathParts = [];
    try {
        const urlObj = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
        path = urlObj.pathname;
        pathParts = path.split('/').filter(p => p);
    } catch (e) {
        path = '/api/products';
    }

    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

    // Handle preflight
    if (method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Supabase credentials
    const supabaseUrl = 'https://rofkykdunbsnubguoukv.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvZmt5a2R1bmJzbnViZ3VvdWt2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTQ2MTY3NCwiZXhwIjoyMDg3MDM3Njc0fQ.49gxdzYRA8gtNUFe8GjdJabBWdv4Kge1XDz0qWtRVic';

    // GET bestsellers
    if (method === 'GET' && (path === '/api/bestsellers' || path === '/api/bestsellers/')) {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseKey);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_bestseller', true);

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data || []);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // GET new arrivals
    if (method === 'GET' && (path === '/api/newarrivals' || path === '/api/newarrivals/')) {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseKey);

            const { data, error } = await supabase
                .from('products')
                .select('*')
                .eq('is_new', true);

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data || []);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // GET all products or single product
    if (method === 'GET' && (path === '/api/products' || path === '/api/products/' || pathParts[1] === 'products' && pathParts[2])) {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseKey);

            // Check if getting a single product by ID
            const productId = pathParts[2];
            if (productId) {
                const { data, error } = await supabase
                    .from('products')
                    .select('*')
                    .eq('id', productId)
                    .single();

                if (error) {
                    console.error('Supabase error:', error);
                    return res.status(500).json({ error: error.message });
                }

                return res.status(200).json(data);
            }

            // Get all products
            const { data, error } = await supabase.from('products').select('*');

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data || []);
        } catch (error) {
            console.error('Error:', error);
            return res.status(500).json({ error: error.message });
        }
    }

    // 404 for unmatched routes
    return res.status(404).json({ error: 'Not found' });
}
