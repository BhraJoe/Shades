import { readData, paths } from '../database.js';

const { PRODUCTS_FILE } = paths;

// Helper to safely parse JSON fields
const safeParse = (val) => {
    if (!val) return [];
    if (Array.isArray(val)) return val;
    if (typeof val !== 'string') return [];
    try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [parsed];
    } catch (e) {
        return [];
    }
};

// GET single product
export default async function handler(req, res) {
    try {
        const { id } = req.query;
        const products = await readData(PRODUCTS_FILE);
        const product = products.find(p => p.id === parseInt(id));

        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Parse JSON fields
        const parsedProduct = {
            ...product,
            images: safeParse(product.images),
            colors: safeParse(product.colors),
            sizes: safeParse(product.sizes)
        };

        res.status(200).json(parsedProduct);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ error: 'Failed to fetch product' });
    }
}
