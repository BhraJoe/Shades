import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchProducts, fetchCategories } from '../api';

const categories = [
    { id: 'all', name: 'All' },
    { id: 'aviator', name: 'Aviator' },
    { id: 'wayfarer', name: 'Wayfarer' },
    { id: 'round', name: 'Round' },
    { id: 'cat-eye', name: 'Cat Eye' },
    { id: 'clubmaster', name: 'Clubmaster' },
    { id: 'rectangular', name: 'Rectangular' },
    { id: 'sport', name: 'Sport' },
    { id: 'oversized', name: 'Oversized' }
];

const sortOptions = [
    { id: 'newest', name: 'Newest' },
    { id: 'price-low', name: 'Price: Low to High' },
    { id: 'price-high', name: 'Price: High to Low' }
];

export default function Shop() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams, setSearchParams] = useSearchParams();
    const [displayedProducts, setDisplayedProducts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const PRODUCTS_PER_PAGE = 8;

    const [filters, setFilters] = useState({
        category: searchParams.get('category') || 'all',
        bestseller: searchParams.get('bestseller') === 'true' || false,
        new: searchParams.get('new') === 'true' || false,
        search: searchParams.get('search') || '',
        sort: 'newest'
    });

    useEffect(() => {
        async function loadProducts() {
            setLoading(true);
            setPage(1);
            setDisplayedProducts([]);
            try {
                const params = {};
                if (filters.category !== 'all') params.category = filters.category;
                if (filters.bestseller) params.bestseller = 'true';
                if (filters.new) params.new = 'true';
                if (filters.sort) params.sort = filters.sort;

                let data = await fetchProducts(params);

                // Client-side search filtering
                if (filters.search) {
                    const searchLower = filters.search.toLowerCase();
                    data = data.filter(product =>
                        product.name.toLowerCase().includes(searchLower) ||
                        product.brand.toLowerCase().includes(searchLower) ||
                        product.category.toLowerCase().includes(searchLower) ||
                        product.subcategory?.toLowerCase().includes(searchLower)
                    );
                }

                setProducts(data);
                // Show first batch of products
                setDisplayedProducts(data.slice(0, PRODUCTS_PER_PAGE));
                setHasMore(data.length > PRODUCTS_PER_PAGE);
            } catch (error) {
                console.error('Error loading products:', error);
            } finally {
                setLoading(false);
            }
        }
        loadProducts();
    }, [filters]);

    const loadMore = () => {
        const nextPage = page + 1;
        const nextProducts = products.slice(0, nextPage * PRODUCTS_PER_PAGE);
        setDisplayedProducts(nextProducts);
        setPage(nextPage);
        setHasMore(nextProducts.length < products.length);
    };

    const updateFilter = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));

        const newParams = new URLSearchParams(searchParams);
        if (key === 'category' && value !== 'all') {
            newParams.set('category', value);
        } else if (key === 'category') {
            newParams.delete('category');
        }
        setSearchParams(newParams);
    };

    return (
        <div className="pt-[130px] md:pt-[104px]">
            {/* Header */}
            <div className="bg-[#f5f5f5] py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className="section-title">
                        {filters.search ? `Search: "${filters.search}"` : 'Shop'}
                    </h1>
                    <p className="text-gray-500 mt-4 font-light">
                        {products.length} {products.length === 1 ? 'product' : 'products'} found
                        {filters.search && (
                            <button
                                onClick={() => {
                                    setFilters(prev => ({ ...prev, search: '' }));
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete('search');
                                    setSearchParams(newParams);
                                }}
                                className="ml-4 text-[#dc2626] hover:underline text-sm"
                            >
                                Clear search
                            </button>
                        )}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-8 mb-12">
                    {/* Categories */}
                    <div className="lg:w-64 flex-shrink-0">
                        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Category</h3>
                        <div className="flex flex-wrap lg:flex-col gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateFilter('category', cat.id)}
                                    className={`filter-pill text-left lg:text-sm ${filters.category === cat.id ? 'active' : ''
                                        }`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Special */}
                    <div className="lg:w-64 flex-shrink-0">
                        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Special</h3>
                        <div className="flex flex-wrap lg:flex-col gap-2">
                            <button
                                onClick={() => updateFilter('bestseller', !filters.bestseller)}
                                className={`filter-pill text-left lg:text-sm ${filters.bestseller ? 'active' : ''
                                    }`}
                            >
                                Best Sellers
                            </button>
                            <button
                                onClick={() => updateFilter('new', !filters.new)}
                                className={`filter-pill text-left lg:text-sm ${filters.new ? 'active' : ''
                                    }`}
                            >
                                New Arrivals
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Sort */}
                        <div className="flex justify-end mb-6">
                            <select
                                value={filters.sort}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                                className="input-field w-auto"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="product-card">
                                        <div className="aspect-[3/4] skeleton" />
                                        <div className="p-4 space-y-2">
                                            <div className="h-3 skeleton w-1/3" />
                                            <div className="h-4 skeleton w-2/3" />
                                            <div className="h-4 skeleton w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="font-display text-xl mb-2">No products found</h3>
                                <p className="text-gray-500 font-light">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {displayedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Load More Button */}
                                {hasMore && (
                                    <div className="flex justify-center mt-10">
                                        <button
                                            onClick={loadMore}
                                            className="btn-primary px-8"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}

                                {/* Showing indicator */}
                                {!hasMore && displayedProducts.length > 0 && (
                                    <p className="text-center text-gray-500 mt-10 font-light">
                                        Showing all {displayedProducts.length} products
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div >
    );
}
