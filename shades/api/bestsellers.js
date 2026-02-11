import { readData, paths } from '../server/database.js';

const { PRODUCTS_FILE } = paths;

// GET best sellers
export default async function handler(req, res) {
    try {
        const products = await readData(PRODUCTS_FILE);
        const bestsellers = products.filter(p => p.is_bestseller === 1).slice(0, 4);
        res.status(200).json(bestsellers);
    } catch (error) {
        console.error('Error fetching best sellers:', error);
        res.status(500).json({ error: 'Failed to fetch best sellers' });
    }
}
