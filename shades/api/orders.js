import { readData, writeData, paths } from '../server/database.js';
import { v4 as uuidv4 } from 'uuid';

const { ORDERS_FILE } = paths;

// POST create order
export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { customer, cart, subtotal, shipping, tax, total } = req.body;

        if (!customer || !cart || cart.length === 0) {
            return res.status(400).json({ error: 'Invalid order data' });
        }

        const orderNumber = `SHADES-${uuidv4().substring(0, 8).toUpperCase()}`;
        const orders = await readData(ORDERS_FILE);

        const newOrder = {
            id: orders.length + 1,
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

        orders.push(newOrder);
        await writeData(ORDERS_FILE, orders);

        res.status(200).json({
            success: true,
            orderNumber,
            orderId: newOrder.id
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
}
