// Orders API for Vercel using Supabase

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
        path = '/api/orders';
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

    // POST create order
    if (method === 'POST' && (path === '/api/orders' || path === '/orders')) {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseKey);

            const { customer, cart, subtotal, shipping, tax, total } = req.body;

            if (!customer || !cart || cart.length === 0) {
                return res.status(400).json({ error: 'Invalid order data' });
            }

            const orderNumber = `SHADES-${Date.now().toString(36).toUpperCase()}`;

            const newOrder = {
                order_number: orderNumber,
                customer_email: customer.email,
                customer_name: customer.firstName + ' ' + customer.lastName,
                shipping_address: customer.address,
                shipping_city: customer.city,
                shipping_state: customer.state,
                shipping_zip: customer.zip,
                shipping_country: customer.country,
                shipping_phone: customer.phone,
                subtotal,
                shipping,
                tax,
                total,
                status: 'confirmed',
                items: cart.map(item => ({
                    product_id: item.id,
                    product_name: item.name,
                    product_color: item.color,
                    product_size: item.size,
                    quantity: item.quantity,
                    price: item.price
                })),
                created_at: new Date().toISOString()
            };

            const { data, error } = await supabase
                .from('orders')
                .insert([newOrder])
                .select();

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ error: error.message });
            }

            res.status(200).json({
                success: true,
                orderNumber,
                orderId: data[0]?.id
            });
        } catch (error) {
            console.error('Error creating order:', error);
            res.status(500).json({ error: 'Failed to create order' });
        }
    }

    // GET single order
    if (method === 'GET' && pathParts[1] === 'orders' && pathParts[2]) {
        try {
            const { createClient } = await import('@supabase/supabase-js');
            const supabase = createClient(supabaseUrl, supabaseKey);

            const orderNumber = pathParts[2];

            const { data, error } = await supabase
                .from('orders')
                .select('*')
                .eq('order_number', orderNumber)
                .single();

            if (error) {
                console.error('Supabase error:', error);
                return res.status(500).json({ error: error.message });
            }

            return res.status(200).json(data);
        } catch (error) {
            console.error('Error fetching order:', error);
            return res.status(500).json({ error: 'Failed to fetch order' });
        }
    }

    // 404 for unmatched routes
    return res.status(404).json({ error: 'Not found' });
}
