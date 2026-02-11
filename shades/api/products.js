import { readData, paths } from './database.js';

const { PRODUCTS_FILE } = paths;

// GET all products
export default async function handler(req, res) {
    try {
        const { category, gender, bestseller, new: isNew, search, sort } = req.query;
        let products = await readData(PRODUCTS_FILE);

        if (category) {
            products = products.filter(p => p.category === category);
        }

        if (gender) {
            products = products.filter(p => p.gender === gender);
        }

        if (bestseller === 'true') {
            products = products.filter(p => p.is_bestseller === 1);
        }

        if (isNew === 'true') {
            products = products.filter(p => p.is_new === 1);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(searchLower) ||
                p.brand.toLowerCase().includes(searchLower) ||
                p.description.toLowerCase().includes(searchLower)
            );
        }

        // Sorting
        if (sort === 'price-low') {
            products.sort((a, b) => a.price - b.price);
        } else if (sort === 'price-high') {
            products.sort((a, b) => b.price - a.price);
        } else {
            products.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
}
