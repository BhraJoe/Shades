import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data file paths
const DATA_DIR = join(__dirname, 'data');
const PRODUCTS_FILE = join(DATA_DIR, 'products.json');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const SUBSCRIBERS_FILE = join(DATA_DIR, 'subscribers.json');
const MESSAGES_FILE = join(__dirname, 'data/messages.json');

// Local sunglasses images
const localImages = {
    aviator: [
        '/images/products/aviator.svg',
        '/images/products/aviator.svg',
        '/images/products/aviator.svg'
    ],
    wayfarer: [
        '/images/products/wayfarer.svg',
        '/images/products/wayfarer.svg',
        '/images/products/wayfarer.svg'
    ],
    round: [
        '/images/products/round.svg',
        '/images/products/round.svg',
        '/images/products/round.svg'
    ],
    catEye: [
        '/images/products/cat-eye.svg',
        '/images/products/cat-eye.svg',
        '/images/products/cat-eye.svg'
    ],
    sport: [
        '/images/products/sport.svg',
        '/images/products/sport.svg',
        '/images/products/sport.svg'
    ],
    oversized: [
        '/images/products/oversized.svg',
        '/images/products/oversized.svg',
        '/images/products/oversized.svg'
    ],
    clubmaster: [
        '/images/products/clubmaster.svg',
        '/images/products/clubmaster.svg',
        '/images/products/clubmaster.svg'
    ],
    rectangular: [
        '/images/products/rectangular.svg',
        '/images/products/rectangular.svg',
        '/images/products/rectangular.svg'
    ]
};

// Ensure data directory exists
export async function ensureDataDir() {
    try {
        await fs.mkdir(DATA_DIR, { recursive: true });
    } catch (e) {
        // Directory exists
    }
}

// Read data files
export async function readData(file) {
    try {
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        return [];
    }
}

// Write data files
export async function writeData(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Initialize products
export async function initProducts() {
    await ensureDataDir();

    try {
        await fs.access(PRODUCTS_FILE);
        console.log('Products already exist');
        return;
    } catch {
        const products = [
            {
                id: 1,
                name: 'Aviator Classic',
                brand: 'Ray-Ban',
                description: 'The iconic aviator design that has been a symbol of cool for decades. Features precision metal frames, crystal lenses, and the unmistakable teardrop shape that flatters every face shape.',
                price: 169.00,
                category: 'aviator',
                gender: 'unisex',
                images: localImages.aviator,
                colors: ['Gold/Green', 'Silver/Blue', 'Black/Grey'],
                sizes: ['M', 'L'],
                stock: 25,
                is_bestseller: 1,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 2,
                name: 'Wayfarer Original',
                brand: 'Ray-Ban',
                description: 'The definitive style icon that changed everything. Wayfarers have graced the faces of rebels, icons, and visionaries for over 60 years.',
                price: 159.00,
                category: 'wayfarer',
                gender: 'unisex',
                images: localImages.wayfarer,
                colors: ['Black', 'Tortoise', 'Demi Blue'],
                sizes: ['S', 'M', 'L'],
                stock: 30,
                is_bestseller: 1,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 3,
                name: 'Clubmaster Acetate',
                brand: 'Ray-Ban',
                description: 'A sophisticated blend of retro and contemporary. The brow bar design with acetate rims creates a bold statement.',
                price: 189.00,
                category: 'clubmaster',
                gender: 'unisex',
                images: localImages.clubmaster,
                colors: ['Black', 'Tortoise', 'Clear'],
                sizes: ['M', 'L'],
                stock: 20,
                is_bestseller: 1,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 4,
                name: 'Round Metal',
                brand: 'Ray-Ban',
                description: 'Nostalgic yet unmistakably modern. The round metal frames evoke a vintage aesthetic while maintaining contemporary appeal.',
                price: 149.00,
                category: 'round',
                gender: 'unisex',
                images: localImages.round,
                colors: ['Gold', 'Silver', 'Gunmetal'],
                sizes: ['S', 'M'],
                stock: 18,
                is_bestseller: 0,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 5,
                name: 'Erika Gradient',
                brand: 'Ray-Ban',
                description: 'Bold and feminine, the Erika features oversized frames with gradient lenses for a glamorous yet functional look.',
                price: 159.00,
                category: 'cat-eye',
                gender: 'women',
                images: localImages.catEye,
                colors: ['Pink', 'Purple', 'Black'],
                sizes: ['M', 'L'],
                stock: 22,
                is_bestseller: 0,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 6,
                name: 'Justin Matte',
                brand: 'Oakley',
                description: 'A fresh take on the classic rectangular shape with a modern matte finish. Designed for those who appreciate comfort without compromising style.',
                price: 145.00,
                category: 'rectangular',
                gender: 'men',
                images: localImages.rectangular,
                colors: ['Matte Black', 'Matte Navy', 'Matte Grey'],
                sizes: ['M', 'L'],
                stock: 28,
                is_bestseller: 1,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 7,
                name: 'Holbrook Active',
                brand: 'Oakley',
                description: "Performance eyewear for the active lifestyle. Features Oakley's patented Three-Point Fit and HDO technology for unmatched clarity.",
                price: 155.00,
                category: 'sport',
                gender: 'men',
                images: localImages.sport,
                colors: ['Black', 'Polished White', 'Tortoise'],
                sizes: ['M', 'L'],
                stock: 24,
                is_bestseller: 0,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 8,
                name: 'Spatula Speed',
                brand: 'Oakley',
                description: 'Aerodynamic design meets maximum performance. The Spatula is engineered for speed with a wraparound profile.',
                price: 175.00,
                category: 'sport',
                gender: 'unisex',
                images: localImages.sport,
                colors: ['Matte Black', 'Silver', 'Team Red'],
                sizes: ['M', 'L'],
                stock: 15,
                is_bestseller: 0,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 9,
                name: 'The General',
                brand: 'Warby Parker',
                description: 'A modern interpretation of military-issue goggles from WWII. Bold, rectangular, and unapologetically stylish.',
                price: 145.00,
                category: 'rectangular',
                gender: 'unisex',
                images: localImages.rectangular,
                colors: ['Black', 'Tortoise', 'Olive'],
                sizes: ['M', 'L'],
                stock: 26,
                is_bestseller: 1,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 10,
                name: 'Dresden Acetate',
                brand: 'Warby Parker',
                description: 'A soft rectangular shape crafted from premium Italian acetate. Hand-finished details showcase exceptional craftsmanship.',
                price: 165.00,
                category: 'rectangular',
                gender: 'women',
                images: localImages.rectangular,
                colors: ['Black', 'Cognac', 'Midnight Blue'],
                sizes: ['S', 'M'],
                stock: 20,
                is_bestseller: 0,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 11,
                name: 'Jacques Monocle',
                brand: 'Warby Parker',
                description: 'A sophisticated single-lens design inspired by mid-century intellectuals. Perfect for making a bold fashion statement.',
                price: 135.00,
                category: 'round',
                gender: 'unisex',
                images: localImages.round,
                colors: ['Gold', 'Silver', 'Rose Gold'],
                sizes: ['M'],
                stock: 12,
                is_bestseller: 0,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 12,
                name: 'Daphne Cat-Eye',
                brand: 'Warby Parker',
                description: 'Flattering cat-eye shape with a retro feel. Features acetate frames and subtle hardware details for a touch of elegance.',
                price: 155.00,
                category: 'cat-eye',
                gender: 'women',
                images: localImages.catEye,
                colors: ['Black', 'Tortoise', 'Blonde'],
                sizes: ['M', 'L'],
                stock: 22,
                is_bestseller: 1,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 13,
                name: 'Julianna Oversized',
                brand: 'Maui Jim',
                description: 'Luxurious oversized frames with polarized lenses that cut glare and enhance colors. The ultimate statement piece.',
                price: 279.00,
                category: 'oversized',
                gender: 'women',
                images: localImages.oversized,
                colors: ['Black', 'Tortoise', 'Burgundy'],
                sizes: ['L'],
                stock: 18,
                is_bestseller: 0,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 14,
                name: 'Bamboo Reef',
                brand: 'Maui Jim',
                description: 'Inspired by the beauty of Hawaiian reefs. Features lightweight frames and advanced polarization technology.',
                price: 259.00,
                category: 'aviator',
                gender: 'unisex',
                images: localImages.aviator,
                colors: ['Black', 'Tortoise', 'Rose'],
                sizes: ['M', 'L'],
                stock: 16,
                is_bestseller: 1,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 15,
                name: 'Wellington Classic',
                brand: 'Persol',
                description: 'Italian craftsmanship meets timeless design. The Wellington features the iconic arrow symbol and handcrafted acetate.',
                price: 295.00,
                category: 'wayfarer',
                gender: 'unisex',
                images: localImages.wayfarer,
                colors: ['Black', 'Havana', 'Crystal Grey'],
                sizes: ['M', 'L'],
                stock: 14,
                is_bestseller: 1,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 16,
                name: '649 Classic',
                brand: 'Persol',
                description: "The original 649 was designed for tram drivers in 1957. Today, it's a symbol of Italian style and engineering excellence.",
                price: 265.00,
                category: 'round',
                gender: 'unisex',
                images: localImages.round,
                colors: ['Black', 'Havana', 'Green'],
                sizes: ['M', 'L'],
                stock: 16,
                is_bestseller: 0,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 17,
                name: 'Wayfarer Folding',
                brand: 'Ray-Ban',
                description: 'The iconic Wayfarer design, now foldable. Perfect for travel and on-the-go lifestyles.',
                price: 189.00,
                category: 'wayfarer',
                gender: 'unisex',
                images: localImages.wayfarer,
                colors: ['Black', 'Demi Brown'],
                sizes: ['M'],
                stock: 20,
                is_bestseller: 0,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 18,
                name: 'Twist 304',
                brand: 'Persol',
                description: 'The iconic arrow motif meets modern style. Features the signature Meflecto temples for all-day comfort.',
                price: 245.00,
                category: 'round',
                gender: 'unisex',
                images: localImages.round,
                colors: ['Black', 'Havana', 'Blue'],
                sizes: ['M'],
                stock: 18,
                is_bestseller: 0,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 19,
                name: 'Gauge 8',
                brand: 'Maui Jim',
                description: 'Ultra-lightweight performance with maximum coverage. Features polarized Plus+ technology.',
                price: 289.00,
                category: 'sport',
                gender: 'men',
                images: localImages.sport,
                colors: ['Matte Black', 'Shiny Black', 'Tortoise'],
                sizes: ['M', 'L'],
                stock: 22,
                is_bestseller: 1,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 20,
                name: 'Cathedral',
                brand: 'Warby Parker',
                description: 'A bold rectangular shape inspired by Gothic architecture. Features premium acetate construction.',
                price: 155.00,
                category: 'rectangular',
                gender: 'unisex',
                images: localImages.rectangular,
                colors: ['Black', 'Tortoise', 'Crystal'],
                sizes: ['M', 'L'],
                stock: 24,
                is_bestseller: 0,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 21,
                name: 'Wick',
                brand: 'Oakley',
                description: 'Sleek half-rim design with Unobtanium earsocks. Perfect for high-performance activities.',
                price: 165.00,
                category: 'sport',
                gender: 'men',
                images: localImages.sport,
                colors: ['Black', 'White', 'Red'],
                sizes: ['M', 'L'],
                stock: 20,
                is_bestseller: 0,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 22,
                name: 'Knox',
                brand: 'Warby Parker',
                description: 'A bold cat-eye shape with a modern twist. Features vintage-inspired details and premium materials.',
                price: 145.00,
                category: 'cat-eye',
                gender: 'women',
                images: localImages.catEye,
                colors: ['Black', 'Tortoise', 'Burgundy'],
                sizes: ['S', 'M'],
                stock: 18,
                is_bestseller: 1,
                is_new: 1,
                created_at: new Date().toISOString()
            },
            {
                id: 23,
                name: 'Large Metal',
                brand: 'Ray-Ban',
                description: 'A oversized take on the classic round shape. Features signature Ray-Ban craftsmanship.',
                price: 175.00,
                category: 'round',
                gender: 'women',
                images: localImages.round,
                colors: ['Gold', 'Silver', 'Rose Gold'],
                sizes: ['L'],
                stock: 15,
                is_bestseller: 0,
                is_new: 0,
                created_at: new Date().toISOString()
            },
            {
                id: 24,
                name: 'Drop 2.0',
                brand: 'Maui Jim',
                description: 'Modern cat-eye shape with island-inspired styling. Features SuperThin glass lenses.',
                price: 249.00,
                category: 'cat-eye',
                gender: 'women',
                images: localImages.catEye,
                colors: ['Black', 'Tortoise', 'Pink'],
                sizes: ['M'],
                stock: 16,
                is_bestseller: 0,
                is_new: 1,
                created_at: new Date().toISOString()
            }
        ];

        await writeData(PRODUCTS_FILE, products);
        console.log('Products data initialized with', products.length, 'products');
    }
}

// Export file paths for use in server.js
export const paths = {
    PRODUCTS_FILE,
    ORDERS_FILE,
    SUBSCRIBERS_FILE,
    MESSAGES_FILE
};
