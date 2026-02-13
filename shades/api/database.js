import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data file paths - always use local data folder for Vercel serverless
const DATA_DIR = join(__dirname, './data');
const PRODUCTS_FILE = join(DATA_DIR, 'products.json');
const ORDERS_FILE = join(DATA_DIR, 'orders.json');
const SUBSCRIBERS_FILE = join(DATA_DIR, 'subscribers.json');
const MESSAGES_FILE = join(DATA_DIR, 'messages.json');
const USERS_FILE = join(DATA_DIR, 'users.json');

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

// Read data files
export async function readData(file) {
    try {
        if (!existsSync(file)) {
            console.log('File not found:', file);
            return [];
        }
        const data = await fs.readFile(file, 'utf-8');
        return JSON.parse(data);
    } catch (e) {
        console.error('Error reading file:', file, e.message);
        return [];
    }
}

// Write data files
export async function writeData(file, data) {
    await fs.writeFile(file, JSON.stringify(data, null, 2));
}

// Export file paths
export const paths = {
    PRODUCTS_FILE,
    ORDERS_FILE,
    SUBSCRIBERS_FILE,
    MESSAGES_FILE,
    USERS_FILE
};

// Export localImages for use in product initialization
export { localImages };
