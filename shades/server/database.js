import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, 'data');

// Ensure data directory exists
await fs.mkdir(DATA_DIR, { recursive: true });

const DB_PATH = join(DATA_DIR, 'shades.db');
const db = new Database(DB_PATH);

// Initialize database tables
db.exec(`
    CREATE TABLE IF NOT EXISTS products (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        brand TEXT NOT NULL,
        description TEXT NOT NULL,
        price REAL NOT NULL,
        category TEXT NOT NULL,
        gender TEXT NOT NULL,
        images TEXT NOT NULL,
        colors TEXT NOT NULL,
        sizes TEXT NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        is_bestseller INTEGER DEFAULT 0,
        is_new INTEGER DEFAULT 0,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_number TEXT NOT NULL UNIQUE,
        customer_email TEXT NOT NULL,
        customer_name TEXT NOT NULL,
        shipping_address TEXT,
        shipping_city TEXT,
        shipping_state TEXT,
        shipping_zip TEXT,
        shipping_country TEXT,
        shipping_phone TEXT,
        subtotal REAL NOT NULL,
        shipping REAL NOT NULL,
        tax REAL NOT NULL,
        total REAL NOT NULL,
        status TEXT DEFAULT 'confirmed',
        items TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS subscribers (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        email TEXT NOT NULL UNIQUE,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        email TEXT NOT NULL,
        subject TEXT NOT NULL,
        message TEXT NOT NULL,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
    );
`);

// Initialize products if empty
const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get();
if (productCount.count === 0) {
    const initialProducts = [
        {
            name: 'Aviator Classic',
            brand: 'Ray-Ban',
            description: 'The iconic aviator design that has been a symbol of cool for decades.',
            price: 169.00,
            category: 'aviator',
            gender: 'unisex',
            images: JSON.stringify(['/images/products/aviator.svg', '/images/products/aviator.svg', '/images/products/aviator.svg']),
            colors: JSON.stringify(['Gold/Green', 'Silver/Blue', 'Black/Grey']),
            sizes: JSON.stringify(['M', 'L']),
            stock: 25,
            is_bestseller: 1,
            is_new: 0
        },
        {
            name: 'Wayfarer Original',
            brand: 'Ray-Ban',
            description: 'The definitive style icon that changed everything.',
            price: 159.00,
            category: 'wayfarer',
            gender: 'unisex',
            images: JSON.stringify(['/images/products/wayfarer.svg', '/images/products/wayfarer.svg', '/images/products/wayfarer.svg']),
            colors: JSON.stringify(['Black', 'Tortoise', 'Demi Blue']),
            sizes: JSON.stringify(['S', 'M', 'L']),
            stock: 30,
            is_bestseller: 1,
            is_new: 0
        },
        {
            name: 'Clubmaster Acetate',
            brand: 'Ray-Ban',
            description: 'A sophisticated blend of retro and contemporary.',
            price: 189.00,
            category: 'clubmaster',
            gender: 'unisex',
            images: JSON.stringify(['/images/products/clubmaster.svg', '/images/products/clubmaster.svg', '/images/products/clubmaster.svg']),
            colors: JSON.stringify(['Black', 'Tortoise', 'Clear']),
            sizes: JSON.stringify(['M', 'L']),
            stock: 20,
            is_bestseller: 1,
            is_new: 1
        },
        {
            name: 'Round Metal',
            brand: 'Ray-Ban',
            description: 'Nostalgic yet unmistakably modern.',
            price: 149.00,
            category: 'round',
            gender: 'unisex',
            images: JSON.stringify(['/images/products/round.svg', '/images/products/round.svg', '/images/products/round.svg']),
            colors: JSON.stringify(['Gold', 'Silver', 'Gunmetal']),
            sizes: JSON.stringify(['S', 'M']),
            stock: 18,
            is_bestseller: 0,
            is_new: 1
        },
        {
            name: 'Erika Gradient',
            brand: 'Ray-Ban',
            description: 'Bold and feminine, the Erika features oversized frames with gradient lenses.',
            price: 159.00,
            category: 'cat-eye',
            gender: 'women',
            images: JSON.stringify(['/images/products/cat-eye.svg', '/images/products/cat-eye.svg', '/images/products/cat-eye.svg']),
            colors: JSON.stringify(['Pink', 'Purple', 'Black']),
            sizes: JSON.stringify(['M', 'L']),
            stock: 22,
            is_bestseller: 0,
            is_new: 1
        },
        {
            name: 'Justin Matte',
            brand: 'Oakley',
            description: 'A fresh take on the classic rectangular shape with a modern matte finish.',
            price: 145.00,
            category: 'rectangular',
            gender: 'men',
            images: JSON.stringify(['/images/products/rectangular.svg', '/images/products/rectangular.svg', '/images/products/rectangular.svg']),
            colors: JSON.stringify(['Matte Black', 'Matte Navy', 'Matte Grey']),
            sizes: JSON.stringify(['M', 'L']),
            stock: 28,
            is_bestseller: 1,
            is_new: 0
        }
    ];

    const insert = db.prepare(`
        INSERT INTO products (name, brand, description, price, category, gender, images, colors, sizes, stock, is_bestseller, is_new)
        VALUES (@name, @brand, @description, @price, @category, @gender, @images, @colors, @sizes, @stock, @is_bestseller, @is_new)
    `);

    for (const product of initialProducts) {
        insert.run(product);
    }
    console.log('Initial products added to database');
}

// Product operations
export const productOperations = {
    getAll: () => db.prepare('SELECT * FROM products ORDER BY created_at DESC').all(),

    getById: (id) => db.prepare('SELECT * FROM products WHERE id = ?').get(id),

    create: (product) => {
        const stmt = db.prepare(`
            INSERT INTO products (name, brand, description, price, category, gender, images, colors, sizes, stock, is_bestseller, is_new)
            VALUES (@name, @brand, @description, @price, @category, @gender, @images, @colors, @sizes, @stock, @is_bestseller, @is_new)
        `);
        const result = stmt.run(product);
        return { id: result.lastInsertRowid, ...product };
    },

    update: (id, product) => {
        const stmt = db.prepare(`
            UPDATE products SET
                name = @name,
                brand = @brand,
                description = @description,
                price = @price,
                category = @category,
                gender = @gender,
                images = @images,
                colors = @colors,
                sizes = @sizes,
                stock = @stock,
                is_bestseller = @is_bestseller,
                is_new = @is_new,
                updated_at = CURRENT_TIMESTAMP
            WHERE id = @id
        `);
        stmt.run({ id, ...product });
        return productOperations.getById(id);
    },

    delete: (id) => {
        const stmt = db.prepare('DELETE FROM products WHERE id = ?');
        const result = stmt.run(id);
        return result.changes > 0;
    }
};

// Order operations
export const orderOperations = {
    getAll: () => db.prepare('SELECT * FROM orders ORDER BY created_at DESC').all(),
    getByNumber: (orderNumber) => db.prepare('SELECT * FROM orders WHERE order_number = ?').get(orderNumber),
    create: (order) => {
        const stmt = db.prepare(`
            INSERT INTO orders (order_number, customer_email, customer_name, shipping_address, shipping_city, shipping_state, shipping_zip, shipping_country, shipping_phone, subtotal, shipping, tax, total, status, items)
            VALUES (@order_number, @customer_email, @customer_name, @shipping_address, @shipping_city, @shipping_state, @shipping_zip, @shipping_country, @shipping_phone, @subtotal, @shipping, @tax, @total, @status, @items)
        `);
        const result = stmt.run(order);
        return { id: result.lastInsertRowid, ...order };
    }
};

// Subscriber operations
export const subscriberOperations = {
    getAll: () => db.prepare('SELECT * FROM subscribers ORDER BY created_at DESC').all(),
    create: (email) => {
        const stmt = db.prepare('INSERT INTO subscribers (email) VALUES (?)');
        const result = stmt.run(email);
        return { id: result.lastInsertRowid, email };
    },
    exists: (email) => db.prepare('SELECT id FROM subscribers WHERE email = ?').get(email)
};

// Message operations
export const messageOperations = {
    getAll: () => db.prepare('SELECT * FROM messages ORDER BY created_at DESC').all(),
    create: (message) => {
        const stmt = db.prepare(`
            INSERT INTO messages (name, email, subject, message)
            VALUES (@name, @email, @subject, @message)
        `);
        const result = stmt.run(message);
        return { id: result.lastInsertRowid, ...message };
    }
};

export default db;
