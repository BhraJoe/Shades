import { readData, paths } from '../server/database.js';

const { PRODUCTS_FILE } = paths;

// GET single product
export default async function handler(req, res) {
    try {
        const { id } = req.query;
        const products = await readData(PRODUCTS_FILE);
        const product = products.find(p => p.id === parseInt(id));

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}
