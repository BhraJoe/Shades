// Simpler products API using Supabase

export default async function handler(req, res) {
    const { method } = req;

    // Parse path from URL
    let path = '/';
    try {
        const urlObj = new URL(req.url || '/', `http://${req.headers?.host || 'localhost'}`);
        path = urlObj.pathname;
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

    // Get products - GET /api/products
    if (method === 'GET' && (path === '/api/products' || path === '/api/products/')) {
        try {
            // Use Supabase from @supabase/supabase-js
            const { createClient } = await import('@supabase/supabase-js');

            // Hardcoded for testing - replace with env vars in production
            const supabaseUrl = 'https://llyjnqdhxxnrqgraicuh.supabase.co';
            const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxseWpucWRoeHhucnFncmFpY3VoIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3MTI2NDYxNCwiZXhwIjoyMDg2ODQwNjE0fQ.YgF6VxgPDQU79DRzh8d1jAGWr98Aoj1iZcgJGNE0Cgo';

            console.log('Using Supabase URL:', supabaseUrl);

            const supabase = createClient(supabaseUrl, supabaseKey);

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
