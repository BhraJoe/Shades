import { readData, paths } from './database.js';

const { PRODUCTS_FILE } = paths;

// GET product categories with counts
export default async function handler(req, res) {
    try {
        const products = await readData(PRODUCTS_FILE);
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

        res.status(200).json(result);
    } catch (error) {
        console.error('Error fetching categories:', error);
        res.status(500).json({ error: 'Failed to fetch categories' });
    }
}
