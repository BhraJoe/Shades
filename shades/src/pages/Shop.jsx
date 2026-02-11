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
    const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

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

    const resetFilters = () => {
        setFilters(prev => ({
            ...prev,
            category: 'all',
            bestseller: false,
            new: false,
            sort: 'newest'
        }));
        setSearchParams({});
    };

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* Header */}
            <div className="bg-[#f5f5f5] py-6 md:py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className="section-title">
                        {filters.search ? `Search: "${filters.search}"` : 'Shop'}
                    </h1>
                    <p className="text-gray-500 mt-2 font-light text-sm md:text-base">
                        {products.length} {products.length === 1 ? 'product' : 'products'} found
                        {filters.search && (
                            <button
                                onClick={() => {
                                    setFilters(prev => ({ ...prev, search: '' }));
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete('search');
                                    setSearchParams(newParams);
                                }}
                                className="ml-3 text-[#dc2626] hover:underline text-sm"
                            >
                                Clear search
                            </button>
                        )}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
                {/* Mobile Filter Toggle */}
                <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3 bg-white border border-gray-200 rounded-lg mb-4 touch-target"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                    </svg>
                    <span className="font-medium">Filters</span>
                </button>

                {/* Filters */}
                <div className="flex flex-col lg:flex-row gap-8 mb-8 md:mb-12">
                    {/* Mobile Filter Drawer */}
                    {mobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="fixed inset-0 bg-black/50" onClick={() => setMobileFiltersOpen(false)} />
                            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-xl overflow-y-auto">
                                <div className="sticky top-0 bg-white z-10 px-4 py-4 border-b border-gray-200 flex items-center justify-between">
                                    <h2 className="font-semibold text-lg">Filters</h2>
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="p-2 touch-target"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>
                                <div className="p-4 space-y-6">
                                    {/* Categories */}
                                    <div>
                                        <h3 className="text-xs font-bold tracking-widest uppercase mb-3">Category</h3>
                                        <div className="flex flex-col gap-2">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        updateFilter('category', cat.id);
                                                        setMobileFiltersOpen(false);
                                                    }}
                                                    className={`filter-pill text-left ${filters.category === cat.id ? 'active' : ''}`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Special */}
                                    <div>
                                        <h3 className="text-xs font-bold tracking-widest uppercase mb-3">Special</h3>
                                        <div className="flex flex-col gap-2">
                                            <button
                                                onClick={() => updateFilter('bestseller', !filters.bestseller)}
                                                className={`filter-pill text-left ${filters.bestseller ? 'active' : ''}`}
                                            >
                                                Best Sellers
                                            </button>
                                            <button
                                                onClick={() => updateFilter('new', !filters.new)}
                                                className={`filter-pill text-left ${filters.new ? 'active' : ''}`}
                                            >
                                                New Arrivals
                                            </button>
                                        </div>
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="pt-4 space-y-3">
                                        <button
                                            onClick={resetFilters}
                                            className="w-full btn-secondary"
                                        >
                                            Reset Filters
                                        </button>
                                        <button
                                            onClick={() => setMobileFiltersOpen(false)}
                                            className="w-full btn-primary"
                                        >
                                            Apply Filters
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Desktop Sidebar - Hidden on Mobile */}
                    <div className="hidden lg:block lg:w-64 flex-shrink-0">
                        <h3 className="text-xs font-bold tracking-widest uppercase mb-4">Category</h3>
                        <div className="flex flex-col gap-2">
                            {categories.map((cat) => (
                                <button
                                    key={cat.id}
                                    onClick={() => updateFilter('category', cat.id)}
                                    className={`filter-pill text-left ${filters.category === cat.id ? 'active' : ''}`}
                                >
                                    {cat.name}
                                </button>
                            ))}
                        </div>

                        <h3 className="text-xs font-bold tracking-widest uppercase mb-4 mt-8">Special</h3>
                        <div className="flex flex-col gap-2">
                            <button
                                onClick={() => updateFilter('bestseller', !filters.bestseller)}
                                className={`filter-pill text-left ${filters.bestseller ? 'active' : ''}`}
                            >
                                Best Sellers
                            </button>
                            <button
                                onClick={() => updateFilter('new', !filters.new)}
                                className={`filter-pill text-left ${filters.new ? 'active' : ''}`}
                            >
                                New Arrivals
                            </button>
                        </div>
                    </div>

                    {/* Products Grid */}
                    <div className="flex-1">
                        {/* Sort - Mobile: Full width, Desktop: Right aligned */}
                        <div className="flex justify-end mb-4 md:mb-6">
                            <select
                                value={filters.sort}
                                onChange={(e) => updateFilter('sort', e.target.value)}
                                className="input-field w-full md:w-auto"
                            >
                                {sortOptions.map((opt) => (
                                    <option key={opt.id} value={opt.id}>
                                        {opt.name}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i} className="product-card">
                                        <div className="aspect-[3/4] skeleton" />
                                        <div className="p-3 md:p-4 space-y-2">
                                            <div className="h-3 skeleton w-1/3" />
                                            <div className="h-4 skeleton w-2/3" />
                                            <div className="h-4 skeleton w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12">
                                <h3 className="font-display text-lg md:text-xl mb-2">No products found</h3>
                                <p className="text-gray-500 font-light">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-6">
                                    {displayedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Load More Button - Full width on mobile */}
                                {hasMore && (
                                    <div className="mt-6 md:mt-10">
                                        <button
                                            onClick={loadMore}
                                            className="w-full btn-primary md:w-auto md:px-8"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}

                                {/* Showing indicator */}
                                {!hasMore && displayedProducts.length > 0 && (
                                    <p className="text-center text-gray-500 mt-6 md:mt-10 font-light text-sm">
                                        Showing all {displayedProducts.length} products
                                    </p>
                                )}
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
