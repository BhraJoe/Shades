import { readData, paths } from './database.js';
import { getAllProducts, getProductById } from './firestore.js';

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

// GET all products
export default async function handler(req, res) {
    try {
        const { category, gender, bestseller, new: isNew, search, sort } = req.query;

        // Try Firestore first
        let products = await getAllProducts();

        // If Firestore fails or returns null, fallback to JSON
        if (!products) {
            console.log('Firestore unavailable, falling back to JSON file');
            products = await readData(PRODUCTS_FILE);
        }

        // Ensure products is an array
        if (!products || !Array.isArray(products)) {
            products = [];
        }

        // Parse JSON fields
        products = products.map(p => ({
            ...p,
            images: safeParse(p.images),
            colors: safeParse(p.colors),
            sizes: safeParse(p.sizes)
        }));

        if (category) {
            // Check both category and subcategory (case-insensitive)
            const catLower = category.toLowerCase();
            products = products.filter(p =>
                p.category?.toLowerCase() === catLower ||
                p.subcategory?.toLowerCase() === catLower
            );
        }

        if (gender) {
            products = products.filter(p => p.gender === gender);
        }

        if (bestseller === 'true') {
            products = products.filter(p => p.is_bestseller === 1 || p.is_bestseller === true);
        }

        if (isNew === 'true') {
            products = products.filter(p => p.is_new === 1 || p.is_new === true);
        }

        if (search) {
            const searchLower = search.toLowerCase();
            products = products.filter(p =>
                p.name?.toLowerCase().includes(searchLower) ||
                p.brand?.toLowerCase().includes(searchLower) ||
                p.description?.toLowerCase().includes(searchLower)
            );
        }

        // Sorting
        if (sort === 'price-low') {
            products.sort((a, b) => (a.price || 0) - (b.price || 0));
        } else if (sort === 'price-high') {
            products.sort((a, b) => (b.price || 0) - (a.price || 0));
        } else {
            products.sort((a, b) => new Date(b.createdAt || b.created_at || 0) - new Date(a.createdAt || a.created_at || 0));
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        // Try fallback to JSON on error
        try {
            let products = await readData(PRODUCTS_FILE);
            products = products.map(p => ({
                ...p,
                images: safeParse(p.images),
                colors: safeParse(p.colors),
                sizes: safeParse(p.sizes)
            }));
            return res.status(200).json(products || []);
        } catch (fallbackError) {
            res.status(500).json({ error: 'Failed to fetch products' });
        }
    }
}
