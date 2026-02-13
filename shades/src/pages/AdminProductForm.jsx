import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { X, Upload, Trash2, Check, AlertCircle, ArrowLeft } from 'lucide-react';

const AdminProductForm = () => {
    console.log('AdminProductForm mounted');
    const { id } = useParams();
    const navigate = useNavigate();
    const isEditing = !!id;
    const [isLoading, setIsLoading] = useState(false);
    const [isFetching, setIsFetching] = useState(isEditing);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        sku: '',
        description: '',
        price: '',
        stock: '',
        category: 'aviator',
        gender: 'unisex',
        is_bestseller: 0,
        is_new: 0,
        colors: [],
        sizes: ['M'],
    });

    const [images, setImages] = useState([]);
    const [newFiles, setNewFiles] = useState([]);
    const [previews, setPreviews] = useState([]);
    const fileInputRef = useRef(null);

    useEffect(() => {
        if (isEditing) {
            fetchProduct();
        }
    }, [id]);

    const fetchProduct = async () => {
        try {
            const res = await axios.get(`/api/products/${id}`);
            const p = res.data;
            setFormData({
                name: p.name || '',
                brand: p.brand || '',
                sku: p.sku || '',
                description: p.description || '',
                price: p.price || '',
                stock: p.stock || '',
                category: p.category || 'aviator',
                gender: p.gender || 'unisex',
                is_bestseller: p.is_bestseller || 0,
                is_new: p.is_new || 0,
                colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (p.colors || []),
                sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (p.sizes || ['M']),
            });
            setImages(typeof p.images === 'string' ? JSON.parse(p.images) : (p.images || []));
        } catch (err) {
            console.error('Fetch error:', err);
            toast.error('Failed to load product data');
            navigate('/admin/products');
        } finally {
            setIsFetching(false);
        }
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setNewFiles([...newFiles, ...files]);

        const newPreviews = files.map(file => URL.createObjectURL(file));
        setPreviews([...previews, ...newPreviews]);
    };

    const removeNewFile = (index) => {
        const updatedFiles = [...newFiles];
        updatedFiles.splice(index, 1);
        setNewFiles(updatedFiles);

        const updatedPreviews = [...previews];
        URL.revokeObjectURL(updatedPreviews[index]);
        updatedPreviews.splice(index, 1);
        setPreviews(updatedPreviews);
    };

    const removeExistingImage = (index) => {
        const updatedImages = [...images];
        updatedImages.splice(index, 1);
        setImages(updatedImages);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // Send as JSON (no file uploads supported on Vercel)
            const data = {
                ...formData,
                images: images, // Use existing image URLs
            };

            if (isEditing) {
                await axios.put(`/api/admin/products/${id}`, data);
                toast.success('Product updated successfully');
            } else {
                await axios.post('/api/admin/products', data);
                toast.success('Product added to inventory');
            }
            navigate('/admin/products');
        } catch (err) {
            toast.error(err.response?.data?.error || 'Failed to save product');
        } finally {
            setIsLoading(false);
        }
    };

    if (isFetching) return <div className="p-12 text-center text-gray-500">Loading product details...</div>;

    return (
        <div className="max-w-6xl mx-auto space-y-12 pb-20 px-4 md:px-0">
            {/* Form Header */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 pb-12">
                <div className="flex items-center gap-6 md:gap-8">
                    <button
                        onClick={() => navigate('/admin/products')}
                        className="p-3 md:p-4 bg-white border border-gray-100 hover:border-[#0a0a0a] rounded-full transition-all group shrink-0"
                    >
                        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                    </button>
                    <div>
                        <h2 className="text-3xl md:text-5xl font-display tracking-tight text-[#0a0a0a]">
                            {isEditing ? 'REVISE VISION' : 'NEW OBJECT'}<span className="text-[#dc2626]">.</span>
                        </h2>
                        <p className="text-gray-400 text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase mt-2">
                            Product Specification Interface
                        </p>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto mt-8 lg:mt-0">
                    <button
                        type="button"
                        onClick={() => navigate('/admin/products')}
                        className="order-2 lg:order-1 px-8 py-4 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#0a0a0a] transition-all bg-gray-50 lg:bg-transparent"
                    >
                        Discard Changes
                    </button>
                    <button
                        form="product-form"
                        type="submit"
                        disabled={isLoading}
                        className="order-1 lg:order-2 bg-[#0a0a0a] text-white px-10 py-4 font-bold tracking-widest uppercase text-[10px] hover:bg-[#dc2626] transition-all shadow-xl disabled:opacity-50"
                    >
                        {isLoading ? 'Processing...' : (isEditing ? 'Sync with Archive' : 'Publish to Archive')}
                    </button>
                </div>
            </div>

            <form id="product-form" onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
                {/* Left: Core Specifications */}
                <div className="space-y-12">
                    <div className="space-y-8 bg-white p-6 md:p-10 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase">Identity & Classification</h3>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Object Name</label>
                                <input
                                    type="text" required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full bg-gray-50 border-b border-gray-100 focus:border-[#0a0a0a] py-3 text-sm focus:outline-none transition-all font-medium placeholder:text-gray-300"
                                    placeholder="e.g. Aviator Gold"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">SKU / Model ID</label>
                                <input
                                    type="text" required
                                    value={formData.sku}
                                    onChange={(e) => setFormData({ ...formData, sku: e.target.value })}
                                    className="w-full bg-gray-50 border-b border-gray-100 focus:border-[#0a0a0a] py-3 text-sm focus:outline-none transition-all font-mono tracking-tighter placeholder:text-gray-300"
                                    placeholder="CS-2026-F"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Valuation (₵)</label>
                                <input
                                    type="number" step="0.01" required
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full bg-gray-50 border-b border-gray-100 focus:border-[#0a0a0a] py-4 text-xl font-display focus:outline-none transition-all placeholder:text-gray-200"
                                    placeholder="00.00"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Inventory Count</label>
                                <input
                                    type="number" required
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full bg-gray-50 border-b border-gray-100 focus:border-[#0a0a0a] py-3 text-sm focus:outline-none transition-all font-medium placeholder:text-gray-300"
                                    placeholder="Total units"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 md:gap-8">
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Classification</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full bg-transparent border-b border-gray-100 focus:border-[#0a0a0a] py-3 text-[10px] font-bold tracking-widest uppercase focus:outline-none appearance-none cursor-pointer"
                                >
                                    {['aviator', 'wayfarer', 'clubmaster', 'round', 'cat-eye', 'rectangular'].map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>
                            <div className="space-y-3">
                                <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Brand Authority</label>
                                <input
                                    type="text" required
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full bg-gray-50 border-b border-gray-100 focus:border-[#0a0a0a] py-3 text-sm focus:outline-none transition-all font-medium placeholder:text-gray-300"
                                    placeholder="CITYSHADES EXCLUSIVE"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <label className="text-[9px] font-black tracking-widest uppercase text-gray-400 px-1">Curatorial Statement / Description</label>
                        <textarea
                            required
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full bg-white border border-gray-100 focus:border-[#0a0a0a] p-6 md:p-10 text-sm focus:outline-none transition-all min-h-[300px] md:min-h-[400px] resize-none leading-relaxed italic text-gray-600 shadow-sm"
                            placeholder="Articulate the vision, craftsmanship, and aesthetic intent behind this object..."
                        />
                    </div>
                </div>

                {/* Right: Curated Assets & Configuration */}
                <div className="space-y-12">
                    <div className="space-y-8 bg-white p-6 md:p-10 border border-gray-100 shadow-sm">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
                                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase">Visual Evidence</h3>
                            </div>
                            <span className="text-[8px] font-bold text-gray-300 tracking-widest uppercase">{images.length + newFiles.length} / 05</span>
                        </div>

                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 md:gap-6">
                            {images.map((img, i) => (
                                <div key={`existing-${i}`} className="relative group aspect-[3/4] bg-gray-50 border border-gray-100 overflow-hidden shadow-sm">
                                    <img src={img} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="absolute inset-0 bg-[#0a0a0a]/80 flex items-center justify-center transition-all text-white opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        <Trash2 size={24} strokeWidth={1} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeExistingImage(i)}
                                        className="md:hidden absolute top-2 right-2 bg-[#0a0a0a]/80 p-2 rounded-full text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}
                            {previews.map((url, i) => (
                                <div key={`new-${i}`} className="relative group aspect-[3/4] bg-gray-50 border border-[#dc2626] overflow-hidden shadow-sm">
                                    <img src={url} className="w-full h-full object-cover" />
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(i)}
                                        className="absolute inset-0 bg-[#dc2626]/90 flex items-center justify-center transition-all text-white opacity-100 md:opacity-0 md:group-hover:opacity-100"
                                    >
                                        <Trash2 size={24} strokeWidth={1} />
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => removeNewFile(i)}
                                        className="md:hidden absolute top-2 right-2 bg-[#dc2626]/90 p-2 rounded-full text-white"
                                    >
                                        <X size={14} />
                                    </button>
                                    <div className="absolute top-3 left-3 bg-[#dc2626] text-white p-1 rounded-sm shadow-lg">
                                        <Check size={8} />
                                    </div>
                                </div>
                            ))}
                            {(images.length + newFiles.length) < 5 && (
                                <button
                                    type="button"
                                    onClick={() => fileInputRef.current.click()}
                                    className="aspect-[3/4] border border-dashed border-gray-200 flex flex-col items-center justify-center gap-4 text-gray-300 hover:border-[#0a0a0a] hover:text-[#0a0a0a] hover:bg-gray-50 transition-all group"
                                >
                                    <Upload size={24} strokeWidth={1} className="group-hover:-translate-y-1 transition-transform" />
                                    <span className="text-[8px] font-black tracking-[0.4em] uppercase">Add Media</span>
                                </button>
                            )}
                        </div>
                        <input
                            type="file" multiple accept="image/*"
                            ref={fileInputRef}
                            onChange={handleFileChange}
                            className="hidden"
                        />
                        <div className="flex items-start gap-3 p-4 bg-gray-50/50 border border-gray-100">
                            <AlertCircle size={14} className="text-[#dc2626] mt-0.5 shrink-0" />
                            <p className="text-[9px] text-gray-400 font-medium leading-relaxed uppercase tracking-wider">
                                Visuals must represent high-fashion quality. Supported: JPG, PNG, WEBP. Max 5MB.
                            </p>
                        </div>
                    </div>

                    <div className="space-y-8 bg-white p-6 md:p-10 border border-gray-100 shadow-sm">
                        <div className="flex items-center gap-3 mb-6">
                            <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
                            <h3 className="text-[10px] font-black tracking-[0.3em] uppercase">Visibility Configuration</h3>
                        </div>

                        <div className="space-y-10">
                            <label className="flex items-center justify-between cursor-pointer group py-4 border-b border-gray-50">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-600 group-hover:text-[#0a0a0a]">Priority Access (Best Seller)</span>
                                    <p className="text-[8px] text-gray-400 uppercase tracking-widest">Pin to curated high-traffic sections</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-all duration-500 shrink-0 ${formData.is_bestseller ? 'bg-[#dc2626]' : 'bg-gray-100'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-500 shadow-sm ${formData.is_bestseller ? 'translate-x-6' : ''}`} />
                                </div>
                                <input
                                    type="checkbox" className="hidden"
                                    checked={formData.is_bestseller === 1}
                                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked ? 1 : 0 })}
                                />
                            </label>

                            <label className="flex items-center justify-between cursor-pointer group py-4 border-b border-gray-50">
                                <div className="space-y-1">
                                    <span className="text-[10px] font-black tracking-widest uppercase text-gray-600 group-hover:text-[#0a0a0a]">Contemporary Arrival</span>
                                    <p className="text-[8px] text-gray-400 uppercase tracking-widest">Mark as new visual contribution</p>
                                </div>
                                <div className={`w-12 h-6 rounded-full p-1 transition-all duration-500 shrink-0 ${formData.is_new ? 'bg-[#dc2626]' : 'bg-gray-100'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full transition-transform duration-500 shadow-sm ${formData.is_new ? 'translate-x-6' : ''}`} />
                                </div>
                                <input
                                    type="checkbox" className="hidden"
                                    checked={formData.is_new === 1}
                                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked ? 1 : 0 })}
                                />
                            </label>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default AdminProductForm;
