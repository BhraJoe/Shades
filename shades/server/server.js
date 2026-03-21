import express from 'express';
import cors from 'cors';
import axios from 'axios';
import helmet from 'helmet';
import sanitizeHtml from 'sanitize-html';
import bcrypt from 'bcryptjs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import { Resend } from 'resend';

// Load .env file manually
const envPath = join(dirname(fileURLToPath(import.meta.url)), '.env');
if (fs.existsSync(envPath)) {
    const envContent = fs.readFileSync(envPath, 'utf-8');
    envContent.split('\n').forEach(line => {
        const [key, ...valueParts] = line.split('=');
        if (key && valueParts.length > 0) {
            process.env[key.trim()] = valueParts.join('=').trim();
        }
    });
}

import db, {
    productOperations,
    userOperations,
    orderOperations,
    subscriberOperations,
    messageOperations,
    categoryOperations
} from './database.js';
import { authenticateToken, authorize, generateToken } from './middleware/auth.js';
import { upload } from './middleware/upload.js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = supabaseUrl && supabaseServiceKey ? createClient(supabaseUrl, supabaseServiceKey) : null;
const useSupabase = !!supabase;

// Resend configuration for emails
const resend = new Resend(process.env.RESEND_API_KEY || 're_123456789');
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'josephatanga25@gmail.com';
const FROM_EMAIL = process.env.FROM_EMAIL || 'Shades Store <onboarding@resend.dev>';
const STORE_NAME = process.env.STORE_NAME || 'Shades';

// Email sending function
async function sendOrderEmails(order) {
    const { customer_email, customer_name, order_number, total, items, shipping_address, shipping_city, shipping_phone } = order;

    // Parse items if they're stored as JSON string
    let parsedItems = items;
    if (typeof items === 'string') {
        try {
            parsedItems = JSON.parse(items);
        } catch (e) {
            parsedItems = [];
        }
    }

    // Format items for email
    const itemsList = parsedItems.map(item => `${item.product_name || item.name || 'Product'} x${item.quantity || 1} - ₵${((item.price || 0) * (item.quantity || 1)).toFixed(2)}`).join('\n');

    // Customer email confirmation
    const customerEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Order Confirmation - ${STORE_NAME}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <div style="background: linear-gradient(135deg, #dc2626 0%, #991b1b 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">${STORE_NAME}</h1>
        <p style="color: white; margin: 10px 0 0 0;">Order Confirmation</p>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <p>Hello ${customer_name},</p>
        <p>Thank you for your order! We've received your purchase and are processing it now.</p>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Order Details</h3>
            <p><strong>Order Number:</strong> ${order_number}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleDateString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Items Ordered</h3>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>${shipping_address}</p>
            <p>${shipping_city}</p>
            <p>Phone: ${shipping_phone}</p>
        </div>
        
        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">Total: ₵${parseFloat(total).toFixed(2)}</p>
        </div>
        
        <p>We'll notify you once your order has been shipped. Thank you for shopping with ${STORE_NAME}!</p>
        
        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
        <p style="color: #666; font-size: 12px; text-align: center;">
            ${STORE_NAME} - Quality Eyewear<br>
            This is an automated confirmation email. Please don't reply to this message.
        </p>
    </div>
</body>
</html>
    `;

    // Admin email notification
    const adminEmailHtml = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Order - ${STORE_NAME}</title>
</head>
<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">
    <div style="background: #dc2626; padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
        <h1 style="color: white; margin: 0;">${STORE_NAME}</h1>
        <p style="color: white; margin: 10px 0 0 0;">🚨 NEW ORDER RECEIVED!</p>
    </div>
    <div style="background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px;">
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #dc2626;">Order #${order_number}</h3>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Customer Information</h3>
            <p><strong>Name:</strong> ${customer_name}</p>
            <p><strong>Email:</strong> ${customer_email}</p>
            <p><strong>Phone:</strong> ${shipping_phone}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Shipping Address</h3>
            <p>${shipping_address}</p>
            <p>${shipping_city}</p>
        </div>
        
        <div style="background: white; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Items Ordered</h3>
            <pre style="white-space: pre-wrap; font-family: Arial, sans-serif;">${itemsList}</pre>
        </div>
        
        <div style="background: #dc2626; color: white; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
            <p style="margin: 0; font-size: 24px; font-weight: bold;">Total: ₵${parseFloat(total).toFixed(2)}</p>
        </div>
        
        <p style="color: #666;">Please process this order as soon as possible.</p>
    </div>
</body>
</html>
    `;

    try {
        // Send customer confirmation email
        await resend.emails.send({
            from: FROM_EMAIL,
            to: customer_email,
            subject: `Order Confirmed - ${order_number} | ${STORE_NAME}`,
            html: customerEmailHtml
        });
        console.log('Customer confirmation email sent to:', customer_email);

        // Send admin notification email
        await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_EMAIL,
            subject: `🛒 New Order - ${order_number} - ₵${parseFloat(total).toFixed(2)}`,
            html: adminEmailHtml
        });
        console.log('Admin notification email sent to:', ADMIN_EMAIL);

        return { success: true };
    } catch (error) {
        console.error('Email sending error:', error);
        return { success: false, error: error.message };
    }
}

// Helper to convert image to base64 data URL
// Stores image directly in database as base64 (no external storage needed)
const uploadImageToSupabase = async (file) => {
    if (!file) return null;
    try {
        // Convert buffer to base64
        const base64 = file.buffer.toString('base64');
        // Create data URL
        const dataUrl = `data:${file.mimetype};base64,${base64}`;
        console.log('Image converted to base64, size:', base64.length, 'bytes');
        return dataUrl;
    } catch (err) {
        console.error('Image base64 conversion failed:', err);
        return null;
    }
};

// Helper to timeout Supabase requests - increased to 30 seconds for reliability
const supabaseWithTimeout = async (promise, timeoutMs = 30000) => {
    let timeoutId;
    const timeoutPromise = new Promise((_, reject) => {
        timeoutId = setTimeout(() => reject(new Error('Supabase timeout')), timeoutMs);
    });
    try {
        const result = await Promise.race([promise, timeoutPromise]);
        clearTimeout(timeoutId);
        return result;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
};

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
app.use(express.json({ limit: '50mb' }));

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
        const { category, gender, bestseller, new: isNew, search, sort, page, limit } = req.query;
        const pageNum = parseInt(page) || 1;
        const limitNum = Math.min(parseInt(limit) || 12, 50); // Default 12, max 50
        let products = [];

        // Use Supabase if available, otherwise fallback to SQLite
        if (useSupabase && supabase) {
            try {
                const { data, error } = await supabaseWithTimeout(
                    supabase.from('products').select('*')
                );
                if (error) throw error;
                products = data || [];
            } catch (supabaseError) {
                console.log('Supabase unavailable, using SQLite:', supabaseError.message);
                products = productOperations.getAll() || [];
                products = products.map(p => ({
                    ...p,
                    images: safeParse(p.images),
                    colors: safeParse(p.colors),
                    sizes: safeParse(p.sizes)
                }));
            }
        } else {
            products = productOperations.getAll() || [];
            // Parse JSON fields for SQLite
            products = products.map(p => ({
                ...p,
                images: safeParse(p.images),
                colors: safeParse(p.colors),
                sizes: safeParse(p.sizes)
            }));
        }

        if (category) {
            products = products.filter(p => p.category === category);
        }

        if (gender) {
            products = products.filter(p => p.gender === gender);
        }

        if (bestseller === 'true') {
            products = products.filter(p => p.is_bestseller === 1 || p.is_bestseller === true);
        }

        if (isNew === 'true') {
            products = products.filter(p => p.is_new === 1 || p.is_new === true);
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

        // Pagination
        const totalProducts = products.length;
        const totalPages = Math.ceil(totalProducts / limitNum);
        const startIndex = (pageNum - 1) * limitNum;
        const endIndex = startIndex + limitNum;
        const paginatedProducts = products.slice(startIndex, endIndex);

        res.json({
            products: paginatedProducts,
            pagination: {
                page: pageNum,
                limit: limitNum,
                totalProducts,
                totalPages,
                hasMore: pageNum < totalPages
            }
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET single product
app.get('/api/products/:id', async (req, res) => {
    try {
        const { id } = req.params;
        let product;

        // Use Supabase if available, otherwise fallback to SQLite
        if (useSupabase && supabase) {
            try {
                const { data, error } = await supabaseWithTimeout(
                    supabase.from('products').select('*').eq('id', parseInt(id)).single()
                );
                if (error) throw error;
                product = data;
            } catch (supabaseError) {
                console.log('Supabase unavailable, using SQLite:', supabaseError.message);
                product = productOperations.getById(parseInt(id));
                if (product) {
                    product.images = safeParse(product.images);
                    product.colors = safeParse(product.colors);
                    product.sizes = safeParse(product.sizes);
                }
            }
        } else {
            product = productOperations.getById(parseInt(id));
            if (product) {
                product.images = safeParse(product.images);
                product.colors = safeParse(product.colors);
                product.sizes = safeParse(product.sizes);
            }
        }

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

// GET bestsellers (redirect to products endpoint)
app.get('/api/bestsellers', async (req, res) => {
    try {
        const products = productOperations.getAll()
            .filter(p => p.is_bestseller === 1 || p.is_bestseller === true)
            .slice(0, 4)
            .map(p => ({
                ...p,
                images: safeParse(p.images),
                colors: safeParse(p.colors),
                sizes: safeParse(p.sizes)
            }));
        res.json(products);
    } catch (error) {
        console.error('Error fetching bestsellers:', error);
        res.status(500).json({ error: 'Failed to fetch bestsellers' });
    }
});

// GET newarrivals (redirect to products endpoint)
app.get('/api/newarrivals', async (req, res) => {
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
        console.error('Error fetching newarrivals:', error);
        res.status(500).json({ error: 'Failed to fetch newarrivals' });
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

// GET all categories from categories table (public)
app.get('/api/categories', async (req, res) => {
    try {
        const categories = categoryOperations.getAll();
        res.json(categories);
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

        // Send order confirmation emails (non-blocking)
        sendOrderEmails(newOrder).catch(err => console.error('Email sending failed:', err));

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

// GET all orders (admin)
app.get('/api/admin/orders', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        const orders = orderOperations.getAll();

        // Parse JSON fields for each order
        const parsedOrders = orders.map(order => ({
            ...order,
            items: JSON.parse(order.items || '[]')
        }));

        res.json(parsedOrders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
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

// GET all subscribers (admin)
app.get('/api/admin/subscribers', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        const subscribers = subscriberOperations.getAll();
        res.json(subscribers);
    } catch (error) {
        console.error('Error fetching subscribers:', error);
        res.status(500).json({ error: 'Failed to fetch subscribers' });
    }
});

// DELETE subscriber (admin)
app.delete('/api/admin/subscribers/:id', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        subscriberOperations.delete(parseInt(id));
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting subscriber:', error);
        res.status(500).json({ error: 'Failed to delete subscriber' });
    }
});

// DELETE all subscribers (admin)
app.delete('/api/admin/subscribers', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        subscriberOperations.deleteAll();
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting all subscribers:', error);
        res.status(500).json({ error: 'Failed to delete all subscribers' });
    }
});

// GET all messages (admin)
app.get('/api/admin/messages', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        const messages = messageOperations.getAll();
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Failed to fetch messages' });
    }
});

// DELETE message (admin)
app.delete('/api/admin/messages/:id', authenticateToken, authorize(['admin']), async (req, res) => {
    try {
        const { id } = req.params;
        messageOperations.delete(parseInt(id));
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting message:', error);
        res.status(500).json({ error: 'Failed to delete message' });
    }
});

// ==================== PAYSTACK PAYMENT ROUTES ====================

// Paystack secret key
const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Initialize Paystack payment
app.post('/api/paystack/initialize', async (req, res) => {
    try {
        const { email, amount, currency = 'NGN', reference, metadata } = req.body;

        if (!email || !amount || !reference) {
            return res.status(400).json({
                error: 'Missing required fields: email, amount, reference'
            });
        }

        const response = await axios.post(
            `${PAYSTACK_BASE_URL}/transaction/initialize`,
            {
                email,
                amount: Math.round(amount),
                currency,
                reference,
                metadata: metadata || {},
                callback_url: `${process.env.FRONTEND_URL}/?payment=success`
            },
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return res.status(200).json(response.data.data);
    } catch (error) {
        console.error('Paystack initialize error:', error.response?.data || error.message);
        return res.status(500).json({
            error: error.response?.data?.message || 'Failed to initialize payment'
        });
    }
});

// Verify Paystack payment
app.get('/api/paystack/verify/:reference', async (req, res) => {
    try {
        const { reference } = req.params;

        if (!reference) {
            return res.status(400).json({
                error: 'Payment reference is required'
            });
        }

        const response = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`
                }
            }
        );

        const paymentData = response.data.data;

        if (paymentData.status === 'success') {
            return res.status(200).json({
                verified: true,
                status: paymentData.status,
                amount: paymentData.amount,
                currency: paymentData.currency,
                customer: paymentData.customer,
                reference: paymentData.reference
            });
        } else {
            return res.status(400).json({
                verified: false,
                status: paymentData.status,
                message: 'Payment not successful'
            });
        }
    } catch (error) {
        console.error('Paystack verify error:', error.response?.data || error.message);
        return res.status(500).json({
            error: error.response?.data?.message || 'Failed to verify payment'
        });
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
        let products;
        if (useSupabase && supabase) {
            try {
                const { data, error } = await supabaseWithTimeout(
                    supabase.from('products').select('*').order('id', { ascending: false })
                );
                if (error) throw error;
                products = data;
            } catch (supabaseError) {
                console.log('Supabase unavailable, using SQLite');
                products = productOperations.getAll().map(p => ({
                    ...p,
                    images: safeParse(p.images),
                    colors: safeParse(p.colors),
                    sizes: safeParse(p.sizes)
                }));
            }
        } else {
            products = productOperations.getAll().map(p => ({
                ...p,
                images: safeParse(p.images),
                colors: safeParse(p.colors),
                sizes: safeParse(p.sizes)
            }));
        }
        res.json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// GET single product (admin)
app.get('/api/admin/products/:id', authenticateToken, authorize(['admin', 'editor']), async (req, res) => {
    try {
        const { id } = req.params;
        let product;

        if (useSupabase && supabase) {
            try {
                const { data, error } = await supabaseWithTimeout(
                    supabase.from('products').select('*').eq('id', parseInt(id)).single()
                );
                if (error) throw error;
                product = data;
            } catch (supabaseError) {
                console.log('Supabase unavailable, using SQLite');
                product = productOperations.getById(parseInt(id));
            }
        } else {
            product = productOperations.getById(parseInt(id));
        }

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse JSON fields
        if (typeof product.images === 'string') {
            product.images = safeParse(product.images);
        }
        if (typeof product.colors === 'string') {
            product.colors = safeParse(product.colors);
        }
        if (typeof product.sizes === 'string') {
            product.sizes = safeParse(product.sizes);
        }

        res.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});

// POST create product (admin)
app.post('/api/admin/products', authenticateToken, authorize(['admin', 'editor']), upload.array('images', 5), async (req, res) => {
    try {
        const product = req.body;
        console.log('POST product body:', product);
        console.log('POST req.files:', req.files);

        // Generate SKU if not provided
        let sku = product.sku;
        if (!sku || sku.trim() === '') {
            sku = `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        }

        // Handle images - from files or from body
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Upload to Supabase Storage first, fallback to local
            for (const file of req.files) {
                const supabaseUrl = await uploadImageToSupabase(file);
                if (supabaseUrl) {
                    imageUrls.push(supabaseUrl);
                } else {
                    // Fallback to local storage - save buffer to file
                    const uploadDir = join(__dirname, 'uploads/products');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    const ext = file.originalname?.split('.').pop() || 'jpg';
                    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
                    const filepath = join(uploadDir, filename);
                    if (file.buffer) {
                        fs.writeFileSync(filepath, file.buffer);
                    }
                    imageUrls.push(`/uploads/products/${filename}`);
                }
            }
        } else if (product.images) {
            // Try parsing as JSON array or use as single image
            try {
                const parsed = JSON.parse(product.images);
                imageUrls = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                imageUrls = [product.images];
            }
        }

        // Sanitize description
        const sanitizedDescription = sanitize(product.description || '');

        // Parse arrays
        let colors = [];
        let sizes = ['M'];
        try {
            colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : (Array.isArray(product.colors) ? product.colors : []);
        } catch { colors = []; }
        try {
            sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : (Array.isArray(product.sizes) ? product.sizes : ['M']);
        } catch { sizes = ['M']; }

        let newProduct;
        if (useSupabase && supabase) {
            try {
                const { data, error } = await supabaseWithTimeout(
                    supabase.from('products').insert([{
                        name: product.name,
                        brand: product.brand || '',
                        sku: sku,
                        description: sanitizedDescription,
                        price: parseFloat(product.price) || 0,
                        category: product.category || 'sunglasses',
                        gender: product.gender || 'unisex',
                        images: imageUrls.length > 0 ? imageUrls : ['/images/products/aviator.svg'],
                        colors: colors,
                        sizes: sizes,
                        stock: parseInt(product.stock) || 0,
                        is_bestseller: !!(parseInt(product.is_bestseller || 0)),
                        is_new: !!(parseInt(product.is_new || 0))
                    }]).select().single()
                );
                if (error) throw error;
                newProduct = data;
            } catch (supabaseError) {
                console.log('Supabase error, using SQLite:', supabaseError.message);
                const productData = {
                    name: product.name,
                    brand: product.brand || '',
                    sku: sku,
                    description: sanitizedDescription,
                    price: parseFloat(product.price) || 0,
                    category: product.category || 'sunglasses',
                    gender: product.gender || 'unisex',
                    images: JSON.stringify(imageUrls.length > 0 ? imageUrls : ['/images/products/aviator.svg']),
                    colors: JSON.stringify(colors),
                    sizes: JSON.stringify(sizes),
                    stock: parseInt(product.stock) || 0,
                    is_bestseller: parseInt(product.is_bestseller || 0),
                    is_new: parseInt(product.is_new || 0)
                };
                newProduct = productOperations.create(productData);
                newProduct.images = JSON.parse(newProduct.images || '[]');
                newProduct.colors = JSON.parse(newProduct.colors || '[]');
                newProduct.sizes = JSON.parse(newProduct.sizes || '[]');
            }
        } else {
            // Use SQLite
            const productData = {
                name: product.name,
                brand: product.brand || '',
                sku: sku,
                description: sanitizedDescription,
                price: parseFloat(product.price) || 0,
                category: product.category || 'sunglasses',
                gender: product.gender || 'unisex',
                images: JSON.stringify(imageUrls.length > 0 ? imageUrls : ['/images/products/aviator.svg']),
                colors: JSON.stringify(colors),
                sizes: JSON.stringify(sizes),
                stock: parseInt(product.stock) || 0,
                is_bestseller: parseInt(product.is_bestseller || 0),
                is_new: parseInt(product.is_new || 0)
            };
            newProduct = productOperations.create(productData);
            newProduct.images = JSON.parse(newProduct.images || '[]');
            newProduct.colors = JSON.parse(newProduct.colors || '[]');
            newProduct.sizes = JSON.parse(newProduct.sizes || '[]');
        }

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product: ' + error.message });
    }
});

// PUT update product (admin)
app.put('/api/admin/products/:id', authenticateToken, authorize(['admin', 'editor']), upload.array('images', 5), async (req, res) => {
    try {
        const { id } = req.params;
        const product = req.body;
        console.log('PUT product body:', product);
        console.log('PUT req.files:', req.files);

        // Check if this is a partial update (only is_bestseller or is_new)
        const isPartialUpdate = Object.keys(product).length === 1 &&
            (product.is_bestseller !== undefined || product.is_new !== undefined);

        // If partial update, fetch existing product first
        let existingProduct = null;
        if (isPartialUpdate && useSupabase && supabase) {
            const { data: existing } = await supabase
                .from('products')
                .select('*')
                .eq('id', parseInt(id))
                .single();
            existingProduct = existing;
        } else if (isPartialUpdate) {
            // SQLite fallback
            const stmt = db.prepare('SELECT * FROM products WHERE id = ?');
            existingProduct = stmt.get(parseInt(id));
        }

        // Generate SKU if not provided
        let sku = product.sku;
        if (!sku || sku.trim() === '') {
            sku = isPartialUpdate && existingProduct?.sku
                ? existingProduct.sku
                : `SKU-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
        }

        // Handle images - from files or from body
        let imageUrls = [];
        if (req.files && req.files.length > 0) {
            // Upload to Supabase Storage first, fallback to local
            for (const file of req.files) {
                const supabaseUrl = await uploadImageToSupabase(file);
                if (supabaseUrl) {
                    imageUrls.push(supabaseUrl);
                } else {
                    // Fallback to local storage - save buffer to file
                    const uploadDir = join(__dirname, 'uploads/products');
                    if (!fs.existsSync(uploadDir)) {
                        fs.mkdirSync(uploadDir, { recursive: true });
                    }
                    const ext = file.originalname?.split('.').pop() || 'jpg';
                    const filename = `${Date.now()}-${Math.random().toString(36).substring(7)}.${ext}`;
                    const filepath = join(uploadDir, filename);
                    if (file.buffer) {
                        fs.writeFileSync(filepath, file.buffer);
                    }
                    imageUrls.push(`/uploads/products/${filename}`);
                }
            }
        } else if (product.images) {
            // Try parsing as JSON array or use as single image string
            try {
                const parsed = JSON.parse(product.images);
                imageUrls = Array.isArray(parsed) ? parsed : [parsed];
            } catch {
                // It's a plain string URL, use it directly
                imageUrls = [product.images];
            }
        } else if (isPartialUpdate && existingProduct?.images) {
            imageUrls = existingProduct.images;
        }

        // Sanitize
        const sanitizedDescription = sanitize(product.description || (isPartialUpdate ? existingProduct?.description : '') || '');

        // Parse arrays from string if needed
        let colors = [];
        let sizes = ['M'];
        try {
            colors = typeof product.colors === 'string' ? JSON.parse(product.colors) : (Array.isArray(product.colors) ? product.colors : []);
            if (colors.length === 0 && isPartialUpdate && existingProduct?.colors) {
                colors = existingProduct.colors;
            }
        } catch {
            colors = isPartialUpdate && existingProduct?.colors ? existingProduct.colors : [];
        }
        try {
            sizes = typeof product.sizes === 'string' ? JSON.parse(product.sizes) : (Array.isArray(product.sizes) ? product.sizes : ['M']);
            if ((sizes.length === 0 || (sizes.length === 1 && sizes[0] === 'M')) && isPartialUpdate && existingProduct?.sizes) {
                sizes = existingProduct.sizes;
            }
        } catch {
            sizes = isPartialUpdate && existingProduct?.sizes ? existingProduct.sizes : ['M'];
        }

        // Use Supabase if available, otherwise fallback to SQLite
        if (useSupabase && supabase) {
            try {
                // For Supabase, we need to pass arrays directly, not JSON strings
                const updateData = {
                    name: product.name || (isPartialUpdate ? existingProduct?.name : '') || '',
                    brand: product.brand || (isPartialUpdate ? existingProduct?.brand : '') || '',
                    sku: sku,
                    description: sanitizedDescription,
                    price: parseFloat(product.price) || (isPartialUpdate ? existingProduct?.price : 0) || 0,
                    category: product.category || (isPartialUpdate ? existingProduct?.category : 'sunglasses') || 'sunglasses',
                    gender: product.gender || (isPartialUpdate ? existingProduct?.gender : 'unisex') || 'unisex',
                    images: imageUrls,
                    colors: colors,
                    sizes: sizes,
                    stock: parseInt(product.stock) || (isPartialUpdate ? existingProduct?.stock : 0) || 0,
                    is_bestseller: (() => {
                        const val = product.is_bestseller !== undefined ? product.is_bestseller : (isPartialUpdate ? (existingProduct?.is_bestseller ? 1 : 0) : 0);
                        return !!(parseInt(val));
                    })(),
                    is_new: (() => {
                        const val = product.is_new !== undefined ? product.is_new : (isPartialUpdate ? (existingProduct?.is_new ? 1 : 0) : 0);
                        return !!(parseInt(val));
                    })()
                };

                console.log('Supabase update data:', updateData);

                const { data, error } = await supabase
                    .from('products')
                    .update(updateData)
                    .eq('id', parseInt(id))
                    .select()
                    .single();

                if (error) {
                    console.error('Supabase update error:', error);
                    return res.status(500).json({ error: error.message });
                }

                if (!data) {
                    return res.status(404).json({ error: 'Product not found' });
                }

                return res.json(data);
            } catch (supabaseError) {
                console.error('Supabase error, using SQLite:', supabaseError.message);
            }
        }

        // Use SQLite
        const productData = {
            name: product.name,
            brand: product.brand || '',
            sku: sku,
            description: sanitizedDescription,
            price: parseFloat(product.price) || 0,
            category: product.category || 'sunglasses',
            gender: product.gender || 'unisex',
            images: JSON.stringify(imageUrls),
            colors: JSON.stringify(colors),
            sizes: JSON.stringify(sizes),
            stock: parseInt(product.stock) || 0,
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
        res.status(500).json({ error: 'Failed to update product: ' + error.message });
    }
});

// DELETE product (admin)
app.delete('/api/admin/products/:id', authenticateToken, authorize(['admin', 'editor']), async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Delete request for product:', id);
        console.log('User role:', req.user?.role);

        let deleted = false;

        // Try Supabase first if available
        if (useSupabase && supabase) {
            try {
                const { error } = await supabase
                    .from('products')
                    .delete()
                    .eq('id', parseInt(id));

                if (error) throw error;
                deleted = true;
                console.log('Deleted from Supabase');
            } catch (supabaseError) {
                console.log('Supabase delete failed:', supabaseError.message);
            }
        }

        // Fallback to SQLite if not deleted yet
        if (!deleted) {
            deleted = productOperations.delete(parseInt(id));
            console.log('Deleted from SQLite:', deleted);
        }

        if (!deleted) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

// ==================== CATEGORIES API ====================

// GET all categories (public - for product form)
app.get('/api/categories', async (req, res) => {
    try {
        const categories = categoryOperations.getAll();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// GET all categories (admin)
app.get('/api/admin/categories', authenticateToken, authorize(['admin', 'editor']), async (req, res) => {
    try {
        const categories = categoryOperations.getAll();
        res.json(categories);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
});

// POST create category (admin)
app.post('/api/admin/categories', authenticateToken, authorize(['admin', 'editor']), async (req, res) => {
    try {
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: 'Name and slug are required' });
        }

        const newCategory = categoryOperations.create({ name, slug, description: description || '' });
        res.status(201).json(newCategory);
    } catch (error) {
        console.error('Error creating category:', error);
        res.status(500).json({ error: 'Failed to create category' });
    }
});

// PUT update category (admin)
app.put('/api/admin/categories/:id', authenticateToken, authorize(['admin', 'editor']), async (req, res) => {
    try {
        const { id } = req.params;
        const { name, slug, description } = req.body;

        if (!name || !slug) {
            return res.status(400).json({ error: 'Name and slug are required' });
        }

        const updated = categoryOperations.update(id, { name, slug, description: description || '' });
        if (!updated) {
            return res.status(404).json({ error: 'Category not found' });
        }
        res.json(updated);
    } catch (error) {
        console.error('Error updating category:', error);
        res.status(500).json({ error: 'Failed to update category' });
    }
});

// DELETE category (admin)
app.delete('/api/admin/categories/:id', authenticateToken, authorize(['admin', 'editor']), async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = categoryOperations.delete(parseInt(id));

        if (!deleted) {
            return res.status(404).json({ error: 'Category not found' });
        }

        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting category:', error);
        res.status(500).json({ error: 'Failed to delete category' });
    }
});

// ==================== API ROUTES ONLY ====================
// Non-API routes return 404 - use port 5173 for frontend

// Start server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    console.log('SQLite database initialized');
});
