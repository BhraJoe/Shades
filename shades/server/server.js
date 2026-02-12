import express from 'express';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import db, {
    ensureDataDir,
    initProducts,
    productOperations,
    orderOperations,
    subscriberOperations,
    messageOperations
} from './database.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

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
        let products = productOperations.getAll();

        // Parse JSON fields
        products = products.map(p => ({
            ...p,
            images: JSON.parse(p.images || '[]'),
            colors: JSON.parse(p.colors || '[]'),
            sizes: JSON.parse(p.sizes || '[]')
        }));

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
        const product = productOperations.getById(parseInt(id));

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse JSON fields
        product.images = JSON.parse(product.images || '[]');
        product.colors = JSON.parse(product.colors || '[]');
        product.sizes = JSON.parse(product.sizes || '[]');

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// GET best sellers
app.get('/api/products/featured/bestsellers', async (req, res) => {
    try {
        const products = productOperations.getAll()
            .filter(p => p.is_bestseller === 1)
            .slice(0, 4)
            .map(p => ({
                ...p,
                images: JSON.parse(p.images || '[]'),
                colors: JSON.parse(p.colors || '[]'),
                sizes: JSON.parse(p.sizes || '[]')
            }));
        res.json(products);
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        res.status(500).json({ error: 'Failed to fetch best sellers' });
    }
});

// GET new arrivals
app.get('/api/products/featured/new', async (req, res) => {
    try {
        const products = productOperations.getAll()
            .filter(p => p.is_new === 1)
            .slice(0, 4)
            .map(p => ({
                ...p,
                images: JSON.parse(p.images || '[]'),
                colors: JSON.parse(p.colors || '[]'),
                sizes: JSON.parse(p.sizes || '[]')
            }));
        res.json(products);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({ error: 'Failed to fetch new arrivals' });
    }
});

// GET product categories with counts
app.get('/api/categories', async (req, res) => {
    try {
        const products = productOperations.getAll();
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
            items: JSON.stringify(cart.map(item => ({
                product_id: item.id,
                product_name: item.name,
                product_color: item.color,
                product_size: item.size,
                quantity: item.quantity,
                price: item.price
            })))
        };

        orderOperations.create(newOrder);

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
        const order = orderOperations.getByNumber(orderNumber);

        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        // Parse JSON fields
        order.items = JSON.parse(order.items || '[]');

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

        const existing = subscriberOperations.exists(email);
        if (existing) {
            return res.status(400).json({ error: 'Already subscribed' });
        }

        subscriberOperations.create(email);

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

        messageOperations.create({ name, email, subject, message });

        res.json({ success: true, message: 'Message sent successfully' });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ error: 'Failed to send message' });
    }
});

// ==================== ADMIN API ROUTES ====================

// GET all products (admin)
app.get('/api/admin/products', async (req, res) => {
    try {
        const products = productOperations.getAll().map(p => ({
            ...p,
            images: JSON.parse(p.images || '[]'),
            colors: JSON.parse(p.colors || '[]'),
            sizes: JSON.parse(p.sizes || '[]')
        }));
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST create product (admin)
app.post('/api/admin/products', async (req, res) => {
    try {
        const product = req.body;

        // Ensure JSON fields are strings
        const productData = {
            name: product.name,
            brand: product.brand,
            description: product.description,
            price: product.price,
            category: product.category,
            gender: product.gender,
            images: JSON.stringify(product.images || []),
            colors: JSON.stringify(product.colors || []),
            sizes: JSON.stringify(product.sizes || []),
            stock: product.stock,
            is_bestseller: product.is_bestseller || 0,
            is_new: product.is_new || 0
        };

        const newProduct = productOperations.create(productData);

        // Return parsed fields
        newProduct.images = JSON.parse(newProduct.images || '[]');
        newProduct.colors = JSON.parse(newProduct.colors || '[]');
        newProduct.sizes = JSON.parse(newProduct.sizes || '[]');

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});

// PUT update product (admin)
app.put('/api/admin/products', async (req, res) => {
    try {
        const product = req.body;

        // Ensure JSON fields are strings
        const productData = {
            name: product.name,
            brand: product.brand,
            description: product.description,
            price: product.price,
            category: product.category,
            gender: product.gender,
            images: JSON.stringify(product.images || []),
            colors: JSON.stringify(product.colors || []),
            sizes: JSON.stringify(product.sizes || []),
            stock: product.stock,
            is_bestseller: product.is_bestseller || 0,
            is_new: product.is_new || 0
        };

        const updatedProduct = productOperations.update(product.id, productData);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Return parsed fields
        updatedProduct.images = JSON.parse(updatedProduct.images || '[]');
        updatedProduct.colors = JSON.parse(updatedProduct.colors || '[]');
        updatedProduct.sizes = JSON.parse(updatedProduct.sizes || '[]');

        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE product (admin)
app.delete('/api/admin/products', async (req, res) => {
    try {
        const { id } = req.body;

        if (!id) {
            return res.status(400).json({ error: 'Product ID required' });
        }

        const deleted = productOperations.delete(parseInt(id));

        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ==================== CATCH ALL FOR REACT ROUTING ====================
app.get('*', (req, res) => {
    res.sendFile(join(__dirname, '../dist/index.html'));
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('SQLite database initialized');
});
