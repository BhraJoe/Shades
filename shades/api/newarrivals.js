import { readData, paths } from '../server/database.js';

const { PRODUCTS_FILE } = paths;

// GET new arrivals
export default async function handler(req, res) {
    try {
        const products = await readData(PRODUCTS_FILE);
        const newArrivals = products.filter(p => p.is_new === 1).slice(0, 4);
        res.status(200).json(newArrivals);
    } catch (error) {
        console.error('Error fetching new arrivals:', error);
        res.status(500).json({ error: 'Failed to fetch new arrivals' });
    }
}
