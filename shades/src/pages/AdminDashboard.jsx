import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Search, Filter, Edit2, Trash2 } from 'lucide-react';

const AdminDashboard = () => {
    const [products, setProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');

    useEffect(() => {
        fetchProducts();
    }, []);

    // Timeout after 10 seconds
    const fetchProductsTimeout = setTimeout(() => {
        if (isLoading) {
            setIsLoading(false);
            setError('Connection timeout - please refresh');
        }
    }, 10000);

    const fetchProducts = async () => {
        try {
            console.log('Fetching products from /api/products...');
            const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
            const res = await axios.get(`${API_BASE}/products?limit=100`);
            const productsData = res.data.products || res.data;
            console.log('Products loaded:', productsData.length);
            setProducts(productsData || []);
            clearTimeout(fetchProductsTimeout);
        } catch (err) {
            console.error('Error loading products:', err);
            clearTimeout(fetchProductsTimeout);
            setError('Failed to load products - API may be unreachable');
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return;
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                toast.error('Please login as admin to delete products');
                return;
            }

            const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE}/admin/products/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${adminToken}`
                }
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to delete');
            }

            toast.success('Product removed');
            fetchProducts();
        } catch (err) {
            console.error('Delete error:', err);
            toast.error(err.message || 'Failed to delete product');
        }
    };

    const handleToggleBestseller = async (id, currentStatus) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                toast.error('Please login as admin');
                return;
            }

            const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE}/admin/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_bestseller: currentStatus ? 0 : 1 })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update');
            }

            toast.success(currentStatus ? 'Removed from Best Sellers' : 'Added to Best Sellers');
            fetchProducts();
        } catch (err) {
            console.error('Toggle bestseller error:', err);
            toast.error(err.message || 'Failed to update bestseller status');
        }
    };

    const handleToggleNewArrival = async (id, currentStatus) => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            if (!adminToken) {
                toast.error('Please login as admin');
                return;
            }

            const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
            const response = await fetch(`${API_BASE}/admin/products/${id}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `Bearer ${adminToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ is_new: currentStatus ? 0 : 1 })
            });

            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.error || 'Failed to update');
            }

            toast.success(currentStatus ? 'Removed from New Arrivals' : 'Added to New Arrivals');
            fetchProducts();
        } catch (err) {
            console.error('Toggle new arrival error:', err);
            toast.error(err.message || 'Failed to update new arrival status');
        }
    };

    const filteredProducts = products.filter(p => {
        const matchesSearch = p.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            p.sku?.toLowerCase().includes(searchTerm.toLowerCase());

        const isBestseller = p.is_bestseller === 1 || p.is_bestseller === true;
        const isNew = p.is_new === 1 || p.is_new === true;
        const hasStock = p.stock > 0;

        if (filterType === 'bestsellers') return matchesSearch && isBestseller;
        if (filterType === 'new') return matchesSearch && isNew;
        if (filterType === 'instock') return matchesSearch && hasStock;
        if (filterType === 'outofstock') return matchesSearch && !hasStock;
        return matchesSearch;
    });

    return (
        <div className="max-w-7xl mx-auto space-y-12 pb-12">
            {/* Page Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-4 md:px-0">
                <div className="space-y-2">
                    <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display tracking-tight text-[#0a0a0a] transform focus:outline-none">
                        INVENTORY<span className="text-[#dc2626]">.</span>
                    </h2>
                    <p className="text-gray-400 text-[9px] font-bold tracking-[0.5em] uppercase">Archive Control Terminal</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                    <div className="relative flex-1 sm:w-64 group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#dc2626] transition-colors" size={14} />
                        <input
                            type="text"
                            placeholder="SEARCH ARCHIVE..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-white border border-gray-100 py-4 pl-12 pr-6 text-[10px] font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-[#0a0a0a] transition-all shadow-sm"
                        />
                    </div>
                    <select
                        value={filterType}
                        onChange={(e) => setFilterType(e.target.value)}
                        className="bg-white border border-gray-100 py-4 px-4 text-[10px] font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-[#0a0a0a] transition-all shadow-sm cursor-pointer"
                    >
                        <option value="all">All Products</option>
                        <option value="bestsellers">Best Sellers</option>
                        <option value="new">New Arrivals</option>
                        <option value="instock">In Stock</option>
                        <option value="outofstock">Out of Stock</option>
                    </select>
                    <Link
                        to="/admin/products/new"
                        className="bg-[#0a0a0a] text-white px-10 py-4 font-bold tracking-[0.2em] uppercase text-[10px] flex items-center justify-center gap-4 hover:bg-[#dc2626] transition-all shadow-xl"
                    >
                        <Plus size={16} />
                        Register New
                    </Link>
                </div>
            </div>

            {/* Stats Overview */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-4 md:px-0">
                {[
                    { label: 'Total Objects', value: products.length },
                    { label: 'Active Stock', value: products.reduce((acc, p) => acc + (p.stock || 0), 0) },
                    { label: 'Categories', value: new Set(products.map(p => p.category)).size },
                    { label: 'Best Sellers', value: products.filter(p => p.is_bestseller === 1 || p.is_bestseller === true).length },
                ].map((stat, i) => (
                    <div key={i} className="bg-white p-8 border border-gray-100 shadow-sm relative group overflow-hidden">
                        <div className="absolute top-0 left-0 w-1 h-0 bg-[#dc2626] group-hover:h-full transition-all duration-500" />
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-4">{stat.label}</p>
                        <p className="text-4xl sm:text-5xl font-display text-[#0a0a0a] leading-none">{stat.value.toString().padStart(2, '0')}</p>
                    </div>
                ))}
            </div>

            {/* Inventory List */}
            <div className="bg-white border-y sm:border border-gray-100 shadow-sm mx-0 md:mx-0 overflow-hidden">
                {/* Loading State */}
                {isLoading && (
                    <div className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-8 h-8 border-2 border-gray-200 border-t-[#dc2626] rounded-full animate-spin" />
                            <span className="text-[10px] font-bold tracking-[0.5em] text-gray-400 uppercase">Synchronizing...</span>
                        </div>
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="px-4 py-16 text-center">
                        <div className="flex flex-col items-center gap-4">
                            <div className="w-12 h-1 bg-red-100" />
                            <span className="text-[10px] font-bold tracking-[0.3em] text-red-400 uppercase">{error}</span>
                            <button
                                onClick={fetchProducts}
                                className="text-[10px] font-bold tracking-[0.2em] uppercase text-[#dc2626] hover:underline"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                )}

                {/* Empty State */}
                {!isLoading && !error && filteredProducts.length === 0 && (
                    <div className="px-4 py-12 text-center">
                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-300">Archive matches zero nodes.</p>
                    </div>
                )}

                {/* Mobile Card View */}
                {!isLoading && !error && filteredProducts.length > 0 && (
                    <div className="md:hidden divide-y divide-gray-50">
                        {filteredProducts.map((p) => (
                            <div key={p.id} className="p-4 space-y-4">
                                <div className="flex gap-4">
                                    <div className="w-16 h-20 bg-gray-50 border border-gray-100 relative overflow-hidden flex-shrink-0">
                                        {p.images?.[0] ? (
                                            <img
                                                src={p.images[0]}
                                                alt=""
                                                className="w-full h-full object-cover grayscale opacity-70"
                                                loading="lazy"
                                                decoding="async"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-[8px] text-gray-300 font-bold bg-gray-50">NULL</div>
                                        )}
                                    </div>
                                    <div className="flex-1 min-w-0 space-y-2">
                                        <div>
                                            <p className="font-bold text-[#0a0a0a] text-base tracking-tighter leading-none truncate">{p.name}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-[9px] font-mono text-gray-400 uppercase tracking-tighter">{p.sku || 'SKU-NONE'}</span>
                                                <span className="w-2 h-[1px] bg-gray-200" />
                                                <span className="text-[8px] font-bold text-gray-300 uppercase tracking-widest">{p.brand}</span>
                                            </div>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 bg-gray-50 px-2 py-1">{p.category}</span>
                                            <span className="text-lg font-display text-[#0a0a0a]">₵{p.price?.toFixed(2)}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div className={`w-1.5 h-1.5 rounded-full ${p.stock > 0 ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                            <span className="text-[9px] font-black tracking-widest text-[#0a0a0a] uppercase">{p.stock} Units</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    {/* <button
                                        onClick={() => handleToggleBestseller(p.id, p.is_bestseller)}
                                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase transition-all rounded border ${p.is_bestseller ? 'text-[#dc2626] border-[#dc2626] bg-red-50' : 'text-gray-500 border-gray-200 hover:text-[#0a0a0a] hover:bg-gray-50'}`}
                                        title={p.is_bestseller ? 'Remove from Best Sellers' : 'Add to Best Sellers'}
                                    >
                                        {p.is_bestseller ? '★ Best Seller' : '☆ Best Seller'}
                                    </button>
                                    <button
                                        onClick={() => handleToggleNewArrival(p.id, p.is_new)}
                                        className={`flex-1 py-3 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase transition-all rounded border ${p.is_new ? 'text-blue-500 border-blue-500 bg-blue-50' : 'text-gray-500 border-gray-200 hover:text-blue-500 hover:border-blue-500'}`}
                                        title={p.is_new ? 'Remove from New Arrivals' : 'Add to New Arrivals'}
                                    >
                                        {p.is_new ? '● New' : '○ New'}
                                    </button> */}
                                    <Link
                                        to={`/admin/products/edit/${p.id}`}
                                        className="flex-1 py-3 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-[#0a0a0a] hover:bg-gray-50 border border-gray-200 transition-all rounded"
                                    >
                                        <Edit2 size={14} />
                                        Modify
                                    </Link>
                                    <button
                                        onClick={() => handleDelete(p.id)}
                                        className="flex-1 py-3 flex items-center justify-center gap-2 text-[9px] font-bold tracking-[0.2em] uppercase text-gray-500 hover:text-[#dc2626] hover:bg-gray-50 border border-gray-200 transition-all rounded"
                                    >
                                        <Trash2 size={14} />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Desktop Table View */}
                <div className="hidden md:block overflow-x-auto">
                    <table className="w-full text-left border-collapse min-w-[1000px]">
                        <thead>
                            <tr className="border-b border-gray-100">
                                <th className="px-10 py-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400">Object Identification</th>
                                <th className="px-10 py-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400">Classification</th>
                                <th className="px-10 py-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400">Valuation</th>
                                <th className="px-10 py-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400">Status</th>
                                <th className="px-10 py-8 text-[11px] font-bold tracking-[0.2em] uppercase text-gray-400 text-right">Settings</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {isLoading ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center">
                                        <div className="animate-pulse flex flex-col items-center gap-4">
                                            <div className="w-12 h-1 bg-gray-100" />
                                            <span className="text-[10px] font-bold tracking-[0.5em] text-gray-300 uppercase">Synchronizing...</span>
                                        </div>
                                    </td>
                                </tr>
                            ) : filteredProducts.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-10 py-24 text-center">
                                        <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-300">Archive matches zero nodes.</p>
                                    </td>
                                </tr>
                            ) : filteredProducts.map((p) => (
                                <tr key={p.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="px-10 py-10">
                                        <div className="flex items-center gap-10">
                                            <div className="w-20 h-24 bg-gray-50 border border-gray-100 relative overflow-hidden group/img">
                                                {p.images?.[0] ? (
                                                    <img
                                                        src={p.images[0]}
                                                        alt=""
                                                        className="w-full h-full object-cover grayscale opacity-70 group-hover/img:grayscale-0 group-hover/img:opacity-100 transition-all duration-700 scale-110 group-hover/img:scale-100"
                                                        loading="lazy"
                                                        decoding="async"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-[10px] text-gray-300 font-bold bg-gray-50">NULL</div>
                                                )}
                                            </div>
                                            <div className="space-y-2">
                                                <p className="font-bold text-[#0a0a0a] text-lg tracking-tighter leading-none">{p.name}</p>
                                                <div className="flex items-center gap-3">
                                                    <span className="text-[10px] font-mono text-gray-400 uppercase tracking-tighter">{p.sku || 'SKU-NONE'}</span>
                                                    <span className="w-3 h-[1px] bg-gray-200" />
                                                    <span className="text-[9px] font-bold text-gray-300 uppercase tracking-widest">{p.brand}</span>
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10">
                                        <div className="flex flex-col gap-2">
                                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-500 bg-gray-50 px-3 py-2 inline-block w-fit">{p.category}</span>
                                            <span className="text-[9px] font-bold tracking-widest text-gray-400 uppercase">{p.gender}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10">
                                        <div className="flex flex-col gap-1">
                                            <span className="text-3xl font-display text-[#0a0a0a]">₵{p.price?.toFixed(2)}</span>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10">
                                        <div className="flex flex-col gap-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-2 h-2 rounded-full ${p.stock > 0 ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]' : 'bg-red-500'}`} />
                                                <span className="text-[11px] font-black tracking-[0.2em] uppercase text-[#0a0a0a]">{p.stock} Units</span>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-10 py-10 text-right">
                                        <div className="flex items-center justify-end gap-3">
                                            {/* <button
                                                onClick={() => handleToggleBestseller(p.id, p.is_bestseller)}
                                                className={`p-4 transition-all border group/btn ${p.is_bestseller ? 'text-[#dc2626] border-[#dc2626] bg-red-50' : 'text-gray-400 border-gray-200 hover:text-[#dc2626] hover:border-[#dc2626]'}`}
                                                title={p.is_bestseller ? 'Remove from Best Sellers' : 'Add to Best Sellers'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={p.is_bestseller ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
                                            </button>
                                            <button
                                                onClick={() => handleToggleNewArrival(p.id, p.is_new)}
                                                className={`p-4 transition-all border group/btn ${p.is_new ? 'text-blue-500 border-blue-500 bg-blue-50' : 'text-gray-400 border-gray-200 hover:text-blue-500 hover:border-blue-500'}`}
                                                title={p.is_new ? 'Remove from New Arrivals' : 'Add to New Arrivals'}
                                            >
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill={p.is_new ? "currentColor" : "none"} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="group-hover/btn:scale-110 transition-transform"><path d="M12 2v4" /><path d="m16.2 7.8 2.9-2.9" /><path d="M18 12h4" /><path d="m16.2 16.2 2.9 2.9" /><path d="M12 18v4" /><path d="m4.9 19.1 2.9-2.9" /><path d="M2 12h4" /><path d="m4.9 4.9 2.9 2.9" /></svg>
                                            </button> */}
                                            <Link
                                                to={`/admin/products/edit/${p.id}`}
                                                className="p-4 text-gray-400 hover:text-[#0a0a0a] hover:bg-gray-50 transition-all border border-gray-200 hover:border-[#0a0a0a] group/btn"
                                                title="Modify"
                                            >
                                                <Edit2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            </Link>
                                            <button
                                                onClick={() => handleDelete(p.id)}
                                                className="p-4 text-gray-400 hover:text-[#dc2626] hover:bg-gray-50 transition-all border border-gray-200 hover:border-[#dc2626] group/btn"
                                                title="Delete"
                                            >
                                                <Trash2 size={16} className="group-hover/btn:scale-110 transition-transform" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
