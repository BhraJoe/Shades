import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import {
    ensureDataDir,
    readData,
    writeData,
    initProducts,
    paths
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Destructure paths from database module
const { PRODUCTS_FILE, ORDERS_FILE, SUBSCRIBERS_FILE, MESSAGES_FILE } = paths;

// Middleware
app.use(cors());
app.use(express.json());

// Serve static files from React build
app.use(express.static(join(__dirname, '../dist')));

// ==================== API ROUTES ====================

// GET all products
app.get('/api/products', async (req, res) => {
    try {
        const { category, gender, bestseller, new: isNew, search, sort } = req.query;
        let products = await readData(PRODUCTS_FILE);

        if (category) {
            products = products.filter(p => p.category === category);
        }

        if (gender) {
            products = products.filter(p => p.gender === gender);
        }

        if (bestseller === 'true') {
            products = products.filter(p => p.is_bestseller === 1);
        }

        if (isNew === 'true') {
            products = products.filter(p => p.is_new === 1);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.brand.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower)
            );
        }

        // Sorting
        if (sort === 'price-low') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            products.sort((a, b) => b.price - a.price);
        } else if (sort === 'newest') {
            products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        } else {
            products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const products = await readData(PRODUCTS_FILE);
        const product = products.find(p => p.id === parseInt(id));

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// GET best sellers
app.get('/api/products/featured/bestsellers', async (req, res) => {
    try {
        const products = await readData(PRODUCTS_FILE);
        const bestsellers = products.filter(p => p.is_bestseller === 1).slice(0, 4);
        res.json(bestsellers);
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        res.status(500).json({ error: 'Failed to fetch best sellers' });
    }
});

// GET new arrivals
app.get('/api/products/featured/new', async (req, res) => {
    try {
        const products = await readData(PRODUCTS_FILE);
        const newArrivals = products.filter(p => p.is_new === 1).slice(0, 4);
        res.json(newArrivals);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({ error: 'Failed to fetch new arrivals' });
    }
});

// GET product categories with counts
app.get('/api/categories', async (req, res) => {
    try {
        const products = await readData(PRODUCTS_FILE);
        const categories = {};

        products.forEach(product => {
            if (!categories[product.category]) {
                categories[product.category] = 0;
            }
            categories[product.category]++;
        });

        const result = Object.entries(categories).map(([category, count]) => ({
            category,
            count
        }));

        res.json(result);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// POST create order
app.post('/api/orders', async (req, res) => {
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

        res.json({
            success: true,
            orderNumber,
            orderId: newOrder.id
        });
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ error: 'Failed to create order' });
    }
});

// GET order by number
app.get('/api/orders/:orderNumber', async (req, res) => {
    try {
        const { orderNumber } = req.params;
        const orders = await readData(ORDERS_FILE);
        const order = orders.find(o => o.order_number === orderNumber);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order:', error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

// POST subscribe to newsletter
app.post('/api/subscribe', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const subscribers = await readData(SUBSCRIBERS_FILE);

        const existing = subscribers.find(s => s.email === email);
        if (existing) {
            return res.status(400).json({ error: 'Already subscribed' });
        }

        subscribers.push({
            id: subscribers.length + 1,
            email,
            created_at: new Date().toISOString()
        });

        await writeData(SUBSCRIBERS_FILE, subscribers);
        res.json({ success: true, message: 'Successfully subscribed' });
    } catch (error) {
        console.error('Error subscribing:', error);
        res.status(500).json({ error: 'Failed to subscribe' });
    }
});

// POST contact message
app.post('/api/contact', async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;

        if (!name || !email || !subject || !message) {
            return res.status(400).json({ error: 'All fields are required' });
        }

        const messages = await readData(MESSAGES_FILE);

        messages.push({
            id: messages.length + 1,
            name,
            email,
            subject,
            message,
            created_at: new Date().toISOString()
        });

        await writeData(MESSAGES_FILE, messages);
        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// ==================== CATCH ALL FOR REACT ROUTING ====================
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

// Initialize data and start server
async function startServer() {
    try {
        await ensureDataDir();
        await initProducts();
        console.log('Database initialized successfully');

        app.listen(PORT, () => {
            console.log(`Server running on http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error('Failed to initialize data:', err);
        process.exit(1);
    }
}

startServer();
