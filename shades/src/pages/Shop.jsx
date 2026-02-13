import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
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

    const activeFilterCount = [
        filters.category !== 'all',
        filters.bestseller,
        filters.new,
    ].filter(Boolean).length;

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* ════════════════════════════════════════════
                Dark Cinematic Header
            ════════════════════════════════════════════ */}
            <div className="bg-[#0a0a0a] py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">
                        {filters.search ? 'Search Results' : 'Collection'}
                    </span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">
                        {filters.search ? `"${filters.search}"` : 'Shop'}
                    </h1>
                    <p className="text-white/50 mt-3 font-light text-sm md:text-base">
                        {products.length} {products.length === 1 ? 'product' : 'products'} found
                        {filters.search && (
                            <button
                                onClick={() => {
                                    setFilters(prev => ({ ...prev, search: '' }));
                                    const newParams = new URLSearchParams(searchParams);
                                    newParams.delete('search');
                                    setSearchParams(newParams);
                                }}
                                className="ml-3 text-[#dc2626] hover:text-white text-sm transition-colors"
                            >
                                Clear search ×
                            </button>
                        )}
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                {/* ════════════════════════════════════════════
                    Mobile Filter Toggle
                ════════════════════════════════════════════ */}
                <button
                    onClick={() => setMobileFiltersOpen(true)}
                    className="lg:hidden w-full flex items-center justify-center gap-2 px-4 py-3.5 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.1em] uppercase mb-6 transition-colors hover:bg-[#dc2626]"
                >
                    <SlidersHorizontal size={16} />
                    Filters
                    {activeFilterCount > 0 && (
                        <span className="ml-1 w-5 h-5 bg-[#dc2626] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                            {activeFilterCount}
                        </span>
                    )}
                </button>

                {/* ════════════════════════════════════════════
                    Content: Sidebar + Grid
                ════════════════════════════════════════════ */}
                <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
                    {/* Mobile Filter Drawer */}
                    {mobileFiltersOpen && (
                        <div className="fixed inset-0 z-50 lg:hidden">
                            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setMobileFiltersOpen(false)} />
                            <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-white shadow-2xl overflow-y-auto animate-slide-in">
                                <div className="sticky top-0 bg-white z-10 px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                                    <h2 className="font-display text-xl tracking-wider">Filters</h2>
                                    <button
                                        onClick={() => setMobileFiltersOpen(false)}
                                        className="p-2 hover:text-[#dc2626] transition-colors"
                                    >
                                        <X size={20} />
                                    </button>
                                </div>
                                <div className="p-6 space-y-8">
                                    {/* Categories */}
                                    <div>
                                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[#0a0a0a]">Style</h3>
                                        <div className="flex flex-col gap-1">
                                            {categories.map((cat) => (
                                                <button
                                                    key={cat.id}
                                                    onClick={() => {
                                                        updateFilter('category', cat.id);
                                                        setMobileFiltersOpen(false);
                                                    }}
                                                    className={`text-left px-4 py-3 text-sm transition-all duration-200 ${filters.category === cat.id
                                                            ? 'bg-[#0a0a0a] text-white font-medium'
                                                            : 'text-gray-600 hover:bg-gray-50 hover:text-[#0a0a0a]'
                                                        }`}
                                                >
                                                    {cat.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Special */}
                                    <div>
                                        <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-4 text-[#0a0a0a]">Filter</h3>
                                        <div className="flex flex-col gap-1">
                                            <button
                                                onClick={() => updateFilter('bestseller', !filters.bestseller)}
                                                className={`text-left px-4 py-3 text-sm transition-all duration-200 ${filters.bestseller
                                                        ? 'bg-[#0a0a0a] text-white font-medium'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#0a0a0a]'
                                                    }`}
                                            >
                                                Best Sellers
                                            </button>
                                            <button
                                                onClick={() => updateFilter('new', !filters.new)}
                                                className={`text-left px-4 py-3 text-sm transition-all duration-200 ${filters.new
                                                        ? 'bg-[#0a0a0a] text-white font-medium'
                                                        : 'text-gray-600 hover:bg-gray-50 hover:text-[#0a0a0a]'
                                                    }`}
                                            >
                                                New Arrivals
                                            </button>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="pt-4 space-y-3 border-t border-gray-100">
                                        <button onClick={resetFilters} className="w-full py-3 border border-gray-200 text-sm font-bold tracking-[0.1em] uppercase text-gray-600 hover:border-[#0a0a0a] hover:text-[#0a0a0a] transition-colors">
                                            Reset
                                        </button>
                                        <button onClick={() => setMobileFiltersOpen(false)} className="w-full py-3 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.1em] uppercase hover:bg-[#dc2626] transition-colors">
                                            Apply
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* ════════════════════════════════════════════
                        Desktop Sidebar
                    ════════════════════════════════════════════ */}
                    <div className="hidden lg:block lg:w-56 flex-shrink-0">
                        <div className="sticky top-28">
                            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-5 text-[#0a0a0a]">Style</h3>
                            <div className="flex flex-col gap-0.5 mb-10">
                                {categories.map((cat) => (
                                    <button
                                        key={cat.id}
                                        onClick={() => updateFilter('category', cat.id)}
                                        className={`text-left px-4 py-2.5 text-sm transition-all duration-200 ${filters.category === cat.id
                                                ? 'bg-[#0a0a0a] text-white font-medium'
                                                : 'text-gray-500 hover:text-[#0a0a0a] hover:bg-gray-50'
                                            }`}
                                    >
                                        {cat.name}
                                    </button>
                                ))}
                            </div>

                            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-5 text-[#0a0a0a]">Filter</h3>
                            <div className="flex flex-col gap-0.5 mb-10">
                                <button
                                    onClick={() => updateFilter('bestseller', !filters.bestseller)}
                                    className={`text-left px-4 py-2.5 text-sm transition-all duration-200 ${filters.bestseller
                                            ? 'bg-[#0a0a0a] text-white font-medium'
                                            : 'text-gray-500 hover:text-[#0a0a0a] hover:bg-gray-50'
                                        }`}
                                >
                                    Best Sellers
                                </button>
                                <button
                                    onClick={() => updateFilter('new', !filters.new)}
                                    className={`text-left px-4 py-2.5 text-sm transition-all duration-200 ${filters.new
                                            ? 'bg-[#0a0a0a] text-white font-medium'
                                            : 'text-gray-500 hover:text-[#0a0a0a] hover:bg-gray-50'
                                        }`}
                                >
                                    New Arrivals
                                </button>
                            </div>

                            {activeFilterCount > 0 && (
                                <button
                                    onClick={resetFilters}
                                    className="text-xs text-[#dc2626] hover:text-[#0a0a0a] transition-colors font-bold tracking-[0.1em] uppercase"
                                >
                                    Clear All Filters
                                </button>
                            )}
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════
                        Products Grid
                    ════════════════════════════════════════════ */}
                    <div className="flex-1">
                        {/* Sort Bar */}
                        <div className="flex items-center justify-between mb-6 md:mb-8">
                            <p className="text-sm text-gray-400 font-light hidden md:block">
                                Showing {displayedProducts.length} of {products.length}
                            </p>
                            <div className="relative ml-auto">
                                <select
                                    value={filters.sort}
                                    onChange={(e) => updateFilter('sort', e.target.value)}
                                    className="appearance-none bg-transparent border border-gray-200 px-4 py-2.5 pr-10 text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors cursor-pointer"
                                >
                                    {sortOptions.map((opt) => (
                                        <option key={opt.id} value={opt.id}>
                                            {opt.name}
                                        </option>
                                    ))}
                                </select>
                                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                            </div>
                        </div>

                        {loading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                {[...Array(6)].map((_, i) => (
                                    <div key={i}>
                                        <div className="aspect-[4/5] bg-gray-100 animate-pulse" />
                                        <div className="mt-4 space-y-2">
                                            <div className="h-3 bg-gray-100 animate-pulse w-1/3" />
                                            <div className="h-4 bg-gray-100 animate-pulse w-2/3" />
                                            <div className="h-4 bg-gray-100 animate-pulse w-1/4" />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-20">
                                <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                                    <SlidersHorizontal size={28} className="text-gray-300" />
                                </div>
                                <h3 className="font-display text-2xl mb-2">No Products Found</h3>
                                <p className="text-gray-400 font-light text-sm mb-6">Try adjusting your filters</p>
                                <button onClick={resetFilters} className="text-sm font-bold tracking-[0.15em] uppercase text-[#dc2626] hover:text-[#0a0a0a] transition-colors">
                                    Reset Filters
                                </button>
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
                                    {displayedProducts.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Load More */}
                                {hasMore && (
                                    <div className="mt-10 md:mt-14 text-center">
                                        <button
                                            onClick={loadMore}
                                            className="inline-flex items-center gap-2 px-10 py-4 border border-[#0a0a0a] text-sm font-bold tracking-[0.15em] uppercase text-[#0a0a0a] hover:bg-[#0a0a0a] hover:text-white transition-all duration-300"
                                        >
                                            Load More
                                        </button>
                                    </div>
                                )}

                                {/* End indicator */}
                                {!hasMore && displayedProducts.length > 0 && (
                                    <p className="text-center text-gray-300 mt-10 md:mt-14 font-light text-xs tracking-[0.2em] uppercase">
                                        — Showing all {displayedProducts.length} products —
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
