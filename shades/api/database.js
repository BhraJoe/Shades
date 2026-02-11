import fs from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { existsSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data file paths - use /tmp for writable storage on Vercel
const isVercel = process.env.VERCEL === '1';
const DATA_DIR = isVercel ? '/tmp/data' : join(__dirname, '../server/data');
const DATA_DIR_LOCAL = join(__dirname, './data'); // For Vercel deployment
const FINAL_DATA_DIR = isVercel ? DATA_DIR : DATA_DIR_LOCAL;
const PRODUCTS_FILE = join(FINAL_DATA_DIR, 'products.json');
const ORDERS_FILE = join(FINAL_DATA_DIR, 'orders.json');
const SUBSCRIBERS_FILE = join(FINAL_DATA_DIR, 'subscribers.json');
const MESSAGES_FILE = join(FINAL_DATA_DIR, 'messages.json');

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
        await fs.mkdir(FINAL_DATA_DIR, { recursive: true });
    } catch (e) {
        // Directory exists
    }
}

// Read data files
export async function readData(file) {
    try {
        if (!existsSync(file)) {
            return [];
        }
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

// Export file paths
export const paths = {
    PRODUCTS_FILE,
    ORDERS_FILE,
    SUBSCRIBERS_FILE,
    MESSAGES_FILE
};

// Export localImages for use in product initialization
export { localImages };
