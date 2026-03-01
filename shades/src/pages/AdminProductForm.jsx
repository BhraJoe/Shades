import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { X, ChevronLeft, Upload, Eye, EyeOff } from 'lucide-react';

const COLORS = [
    { name: 'Black', code: '#000000' },
    { name: 'Gold', code: '#FFD700' },
    { name: 'Silver', code: '#C0C0C0' },
    { name: 'Brown', code: '#8B4513' },
    { name: 'Tortoise', code: '#B5651D' },
    { name: 'Red', code: '#DC2626' },
    { name: 'Blue', code: '#2563EB' },
    { name: 'Green', code: '#16A34A' },
    { name: 'Purple', code: '#9333EA' },
    { name: 'Pink', code: '#EC4899' },
    { name: 'White', code: '#FFFFFF' },
    { name: 'Gray', code: '#6B7280' }
];

export default function AdminProductForm() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        brand: '',
        price: '',
        description: '',
        category_id: '',
        stock: '',
        image: '',
        is_new: 0,
        is_bestseller: 0,
        colors: [],
        sizes: ['M']
    });
    const [categories, setCategories] = useState([]);
    const [imagePreview, setImagePreview] = useState(null);

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchProduct();
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
            const res = await fetch(`${API_BASE}/categories`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const data = await res.json();
                setCategories(data);
            }
        } catch (err) { console.error(err); }
    };

    const fetchProduct = async () => {
        try {
            const token = localStorage.getItem('adminToken');
            const res = await fetch(`http://localhost:3001/api/admin/products/${id}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                const p = await res.json();
                setFormData({
                    name: p.name || '',
                    brand: p.brand || '',
                    price: p.price || '',
                    description: p.description || '',
                    category_id: p.category || '',
                    stock: p.stock ?? '',
                    image: Array.isArray(p.images) ? (p.images[0] || '') : (p.image || ''),
                    is_new: p.is_new || 0,
                    is_bestseller: p.is_bestseller || 0,
                    colors: typeof p.colors === 'string' ? JSON.parse(p.colors) : (Array.isArray(p.colors) ? p.colors : []),
                    sizes: typeof p.sizes === 'string' ? JSON.parse(p.sizes) : (Array.isArray(p.sizes) ? p.sizes : ['M'])
                });
                const previewImage = Array.isArray(p.images) ? p.images[0] : (p.image || '');
                if (previewImage) setImagePreview(previewImage);
            }
        } catch (err) { console.error(err); }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const token = localStorage.getItem('adminToken');

            // Use FormData for file uploads
            const formDataToSend = new FormData();

            // Add all form fields
            formDataToSend.append('name', formData.name);
            formDataToSend.append('brand', formData.brand);
            formDataToSend.append('price', formData.price);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('category', formData.category_id);
            formDataToSend.append('stock', formData.stock);
            formDataToSend.append('is_bestseller', formData.is_bestseller || 0);
            formDataToSend.append('is_new', formData.is_new || 0);
            formDataToSend.append('colors', JSON.stringify(formData.colors));
            formDataToSend.append('sizes', JSON.stringify(formData.sizes));

            // Add image file if selected (it's stored as base64 in formData.image)
            if (formData.image && formData.image.startsWith('data:')) {
                // Convert base64 to blob and then to file
                const response = await fetch(formData.image);
                const blob = await response.blob();
                const ext = blob.type.split('/')[1] || 'jpg';
                const file = new File([blob], `product_${Date.now()}.${ext}`, { type: blob.type });
                formDataToSend.append('images', file);
            } else if (id && formData.image) {
                // For editing without new image, send existing image URL
                formDataToSend.append('images', formData.image);
            }

            const url = id
                ? `http://localhost:3001/api/admin/products/${id}`
                : 'http://localhost:3001/api/admin/products';
            const method = id ? 'PUT' : 'POST';

            const res = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formDataToSend
            });

            if (res.ok) {
                toast.success(id ? 'Product updated!' : 'Product created!');
                navigate('/admin/products');
            } else {
                const err = await res.json();
                toast.error(err.error || 'Failed to save product');
            }
        } catch (err) {
            console.error(err);
            toast.error('Something went wrong');
        } finally { setLoading(false); }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
                setFormData({ ...formData, image: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-10 pb-20">
            <div className="max-w-5xl mx-auto px-4">
                <button onClick={() => navigate('/admin/products')} className="flex items-center gap-2 text-gray-500 hover:text-[#dc2626] mb-6 transition-colors">
                    <ChevronLeft size={20} />
                    <span className="text-sm font-medium">Back to Products</span>
                </button>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="bg-[#0a0a0a] px-6 py-4 flex items-center justify-between">
                        <h1 className="text-white text-lg font-bold tracking-wide">{id ? 'Edit Product' : 'Add New Product'}</h1>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6 md:p-10 space-y-8">
                        {/* Basic Info */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Product Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                    placeholder="Enter product name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Brand</label>
                                <input
                                    type="text"
                                    value={formData.brand}
                                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                    placeholder="Enter brand name"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Price (GHS)</label>
                                <input
                                    type="number"
                                    step="0.01"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                    placeholder="0.00"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Description</label>
                            <textarea
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                rows={4}
                                className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors resize-none"
                                placeholder="Product description..."
                                required
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Category</label>
                                <select
                                    value={formData.category_id}
                                    onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                    required
                                >
                                    <option value="">Select Category</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Stock</label>
                                <input
                                    type="number"
                                    value={formData.stock}
                                    onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                    placeholder="0"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Image URL</label>
                                <input
                                    type="text"
                                    value={formData.image}
                                    onChange={(e) => {
                                        setFormData({ ...formData, image: e.target.value });
                                        if (e.target.value.startsWith('http')) setImagePreview(e.target.value);
                                    }}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                    placeholder="https://..."
                                />
                            </div>
                        </div>

                        {/* Image Upload */}
                        <div className="space-y-4">
                            <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Product Image</label>
                            <div className="flex items-start gap-6">
                                <div className="w-32 h-32 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                                    {imagePreview ? (
                                        <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center text-gray-400">
                                            <Upload size={24} />
                                        </div>
                                    )}
                                </div>
                                <div className="flex-1">
                                    <label className="inline-flex items-center px-4 py-2 bg-white border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 cursor-pointer transition-colors">
                                        <Upload size={16} className="mr-2" />
                                        Choose Image
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                    <p className="text-xs text-gray-400 mt-2">Or paste an image URL above</p>
                                </div>
                            </div>
                        </div>

                        {/* New Arrival Toggle */}
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox" className="hidden"
                                    checked={formData.is_new === 1}
                                    onChange={(e) => setFormData({ ...formData, is_new: e.target.checked ? 1 : 0 })}
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${formData.is_new ? 'bg-[#dc2626]' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${formData.is_new ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                                </div>
                            </label>
                            <label className="text-sm text-gray-600 font-medium">Mark as New Arrival</label>
                        </div>

                        {/* Best Seller Toggle */}
                        <div className="flex items-center gap-3">
                            <label className="relative inline-flex items-center cursor-pointer">
                                <input
                                    type="checkbox" className="hidden"
                                    checked={formData.is_bestseller === 1}
                                    onChange={(e) => setFormData({ ...formData, is_bestseller: e.target.checked ? 1 : 0 })}
                                />
                                <div className={`w-11 h-6 rounded-full transition-colors ${formData.is_bestseller ? 'bg-[#dc2626]' : 'bg-gray-200'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${formData.is_bestseller ? 'translate-x-5' : 'translate-x-0.5'} mt-0.5`} />
                                </div>
                            </label>
                            <label className="text-sm text-gray-600 font-medium">Mark as Best Seller</label>
                        </div>

                        {/* Colors Section */}
                        <div className="space-y-8 bg-white p-6 md:p-10 border border-gray-100 shadow-sm">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
                                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase">Color Options</h3>
                            </div>

                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                                {COLORS.map((color) => (
                                    <button
                                        key={color.name}
                                        type="button"
                                        onClick={() => {
                                            const newColors = formData.colors.includes(color.name)
                                                ? formData.colors.filter(c => c !== color.name)
                                                : [...formData.colors, color.name];
                                            setFormData({ ...formData, colors: newColors });
                                        }}
                                        className={`py-3 px-4 text-[10px] font-bold tracking-widest uppercase border transition-all flex items-center justify-center gap-2 ${formData.colors.includes(color.name)
                                            ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                                            : 'border-gray-200 text-gray-400 hover:border-[#0a0a0a]'
                                            }`}
                                    >
                                        <span className="w-3 h-3 rounded-full border border-gray-300" style={{ backgroundColor: color.code }} />
                                        {color.name}
                                    </button>
                                ))}
                            </div>

                            {formData.colors.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                    <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase">Selected:</span>
                                    {formData.colors.map((c) => (
                                        <span key={c} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 text-[8px] font-bold uppercase">
                                            {c}
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, colors: formData.colors.filter(x => x !== c) })}
                                                className="text-[#dc2626] hover:text-red-700"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Sizes Section */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-1.5 bg-[#dc2626] rounded-full" />
                                <h3 className="text-[10px] font-black tracking-[0.3em] uppercase">Size Options</h3>
                            </div>
                            <div className="flex flex-wrap gap-3">
                                {['XS', 'S', 'M', 'L', 'XL', 'XXL'].map((size) => (
                                    <button
                                        key={size}
                                        type="button"
                                        onClick={() => {
                                            const newSizes = formData.sizes.includes(size)
                                                ? formData.sizes.filter(s => s !== size)
                                                : [...formData.sizes, size];
                                            setFormData({ ...formData, sizes: newSizes });
                                        }}
                                        className={`w-12 h-12 text-xs font-bold uppercase border transition-all ${formData.sizes.includes(size)
                                            ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                                            : 'border-gray-200 text-gray-400 hover:border-[#0a0a0a]'
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                            {formData.sizes.length > 0 && (
                                <div className="flex flex-wrap gap-2 pt-4 border-t border-gray-100">
                                    <span className="text-[8px] font-bold text-gray-400 tracking-widest uppercase">Selected:</span>
                                    {formData.sizes.map((s) => (
                                        <span key={s} className="inline-flex items-center gap-1 bg-gray-100 px-2 py-1 text-[8px] font-bold uppercase">
                                            {s}
                                            <button
                                                type="button"
                                                onClick={() => setFormData({ ...formData, sizes: formData.sizes.filter(x => x !== s) })}
                                                className="text-[#dc2626] hover:text-red-700"
                                            >
                                                <X size={12} />
                                            </button>
                                        </span>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Submit Button */}
                        <div className="pt-6 border-t border-gray-100">
                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Saving...' : (id ? 'Update Product' : 'Create Product')}
                            </button>
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
