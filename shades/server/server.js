import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import db, {
    productOperations,
    userOperations,
    orderOperations,
    subscriberOperations,
    messageOperations
} from './database.js';
import { authenticateToken, authorize, generateToken } from './middleware/auth.js';
import { upload } from './middleware/upload.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;

// Serve static files from React build
app.use(express.static(join(__dirname, '../dist')));
// Serve uploads
app.use('/uploads', express.static(join(__dirname, 'uploads')));

// Middleware
app.use(helmet({
    contentSecurityPolicy: false, // For development ease
}));
app.use(cors());
app.use(express.json());

// Sanitization utility
const sanitize = (text) => sanitizeHtml(text, {
    allowedTags: ['b', 'i', 'em', 'strong', 'a', 'p', 'br', 'ul', 'ol', 'li', 'div', 'span'],
    allowedAttributes: {
        'a': ['href'],
        '*': ['class', 'style']
    },
});

// Helper for deep JSON parsing (handles double-stringification)
const safeParse = (val) => {
    if (!val) return [];
    if (typeof val !== 'string') return val;
    try {
        let parsed = JSON.parse(val);
        // If the result is still a string (and looks like a JSON array/object), parse it again
        if (typeof parsed === 'string' && (parsed.startsWith('[') || parsed.startsWith('{'))) {
            return JSON.parse(parsed);
        }
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
        return [];
    }
};

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
            images: safeParse(p.images),
            colors: safeParse(p.colors),
            sizes: safeParse(p.sizes)
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
        product.images = safeParse(product.images);
        product.colors = safeParse(product.colors);
        product.sizes = safeParse(product.sizes);

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
                images: safeParse(p.images),
                colors: safeParse(p.colors),
                sizes: safeParse(p.sizes)
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
                images: safeParse(p.images),
                colors: safeParse(p.colors),
                sizes: safeParse(p.sizes)
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

// ==================== AUTH ROUTES ====================

// Login
app.post('/api/auth/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = userOperations.getByUsername(username);

        if (!user || !bcrypt.compareSync(password, user.password_hash)) {
            return res.status(401).json({ error: 'Invalid username or password' });
        }

        const token = generateToken(user);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

// GET current user
app.get('/api/auth/me', authenticateToken, async (req, res) => {
    try {
        const user = userOperations.getById(req.user.id);
        if (!user) return res.status(404).json({ error: 'User not found' });
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// ==================== ADMIN API ROUTES ====================

// GET all products (admin)
app.get('/api/admin/products', authenticateToken, authorize(['admin', 'editor']), async (req, res) => {
    try {
        const products = productOperations.getAll().map(p => ({
            ...p,
            images: safeParse(p.images),
            colors: safeParse(p.colors),
            sizes: safeParse(p.sizes)
        }));
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST create product (admin)
app.post('/api/admin/products', authenticateToken, authorize(['admin', 'editor']), upload.array('images', 5), async (req, res) => {
    try {
        const product = req.body;

        // Handle images from S3 or local fallback
        const imageUrls = req.files ? req.files.map(f => f.location || `/uploads/products/${f.filename}`) : (product.images || []);

        // Sanitize description
        const sanitizedDescription = sanitize(product.description || '');

        // Ensure JSON fields are strings
        const productData = {
            name: product.name,
            brand: product.brand,
            sku: product.sku,
            description: sanitizedDescription,
            price: parseFloat(product.price),
            category: product.category,
            gender: product.gender,
            images: (typeof product.images === 'string' && product.images.startsWith('[')) ? product.images : JSON.stringify(imageUrls),
            colors: (typeof product.colors === 'string' && product.colors.startsWith('[')) ? product.colors : JSON.stringify(product.colors || []),
            sizes: (typeof product.sizes === 'string' && product.sizes.startsWith('[')) ? product.sizes : JSON.stringify(product.sizes || []),
            stock: parseInt(product.stock),
            is_bestseller: parseInt(product.is_bestseller || 0),
            is_new: parseInt(product.is_new || 0)
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
app.put('/api/admin/products/:id', authenticateToken, authorize(['admin', 'editor']), upload.array('images', 5), async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;

        // Handle images
        let imageUrls = product.images || [];
        if (req.files && req.files.length > 0) {
            const newUrls = req.files.map(f => f.location || `/uploads/products/${f.filename}`);
            imageUrls = [...imageUrls, ...newUrls];
        }

        // Sanitize
        const sanitizedDescription = sanitize(product.description || '');

        const productData = {
            name: product.name,
            brand: product.brand,
            sku: product.sku,
            description: sanitizedDescription,
            price: parseFloat(product.price),
            category: product.category,
            gender: product.gender,
            images: (typeof product.images === 'string' && product.images.startsWith('[')) ? product.images : JSON.stringify(imageUrls),
            colors: (typeof product.colors === 'string' && product.colors.startsWith('[')) ? product.colors : JSON.stringify(product.colors || []),
            sizes: (typeof product.sizes === 'string' && product.sizes.startsWith('[')) ? product.sizes : JSON.stringify(product.sizes || []),
            stock: parseInt(product.stock),
            is_bestseller: parseInt(product.is_bestseller || 0),
            is_new: parseInt(product.is_new || 0)
        };

        const updatedProduct = productOperations.update(parseInt(id), productData);

        if (!updatedProduct) {
            return res.status(404).json({ error: 'Product not found' });
        }

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
app.delete('/api/admin/products/:id', authenticateToken, authorize('admin'), async (req, res) => {
    try {
        const { id } = req.params;

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
