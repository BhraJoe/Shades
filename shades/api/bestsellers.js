import { getAllProducts } from './firestore.js';
import { readData, paths } from './database.js';

const { PRODUCTS_FILE } = paths;

// GET best sellers
export default async function handler(req, res) {
    try {
        // Try Firestore first
        let products = await getAllProducts();

        // If Firestore fails or returns null, fallback to JSON
        if (!products) {
            console.log('Firestore unavailable, falling back to JSON file');
            products = await readData(PRODUCTS_FILE);
        }

        if (!products || !Array.isArray(products)) {
            products = [];
        }

        const bestsellers = products.filter(p => p.is_bestseller === 1 || p.is_bestseller === true).slice(0, 4);
        res.status(200).json(bestsellers);
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        // Try fallback
        try {
            const products = await readData(PRODUCTS_FILE);
            const bestsellers = products.filter(p => p.is_bestseller === 1).slice(0, 4);
            return res.status(200).json(bestsellers || []);
        } catch (fallbackError) {
            res.status(500).json({ error: 'Failed to fetch best sellers' });
        }
    }
}
