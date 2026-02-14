import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, fetchProducts } from '../api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, Heart, Check, Shield, RefreshCw, Truck } from 'lucide-react';

export default function ProductDetail() {
    const { id } = useParams();
    const { addToCart } = useCart();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [selectedColor, setSelectedColor] = useState('');
    const [selectedSize, setSelectedSize] = useState('');
    const [quantity, setQuantity] = useState(1);
    const [added, setAdded] = useState(false);
    const [relatedProducts, setRelatedProducts] = useState([]);
    const [mainImage, setMainImage] = useState(0);
    const lastClickRef = useRef(0);
    const isAddingRef = useRef(false);

    useEffect(() => {
        // Scroll to top when navigating to this page
        window.scrollTo(0, 0);

        async function loadProduct() {
            setLoading(true);
            try {
                const data = await fetchProduct(id);
                setProduct(data);

                // Handle empty colors/sizes arrays
                if (data.colors && data.colors.length > 0) {
                    setSelectedColor(data.colors[0]);
                }
                if (data.sizes && data.sizes.length > 0) {
                    setSelectedSize(data.sizes[0]);
                }

                const related = await fetchProducts({ category: data.category });
                setRelatedProducts(related.filter(p => p.id !== data.id).slice(0, 4));
            } catch (error) {
                console.error('Error loading product:', error);
            } finally {
                setLoading(false);
            }
        }
        loadProduct();
    }, [id]);

    // Safe data extraction
    const images = Array.isArray(product?.images) ? product.images : [];
    const colors = Array.isArray(product?.colors) ? product.colors : [];
    const sizes = Array.isArray(product?.sizes) ? product.sizes : [];
    const price = typeof product?.price === 'number' ? product.price : parseFloat(product?.price) || 0;

    const handleAddToCart = () => {
        // Allow adding if no color/size required, or if selected
        if ((colors.length > 0 && !selectedColor) || (sizes.length > 0 && !selectedSize)) return;
        if (isAddingRef.current) return;
        isAddingRef.current = true;

        const colorValue = typeof selectedColor === 'object' ? selectedColor.name : selectedColor;
        const sizeValue = typeof selectedSize === 'object' ? selectedSize.name : selectedSize;

        addToCart(product, colorValue, sizeValue, quantity);

        setAdded(true);
        setTimeout(() => {
            setAdded(false);
            isAddingRef.current = false;
        }, 2000);
    };

    if (loading) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                        <div className="aspect-square md:aspect-[3/4] bg-gray-100 animate-pulse" />
                        <div className="space-y-5">
                            <div className="h-3 bg-gray-100 animate-pulse w-1/4" />
                            <div className="h-10 bg-gray-100 animate-pulse w-3/4" />
                            <div className="h-7 bg-gray-100 animate-pulse w-1/4" />
                            <div className="h-28 bg-gray-100 animate-pulse" />
                            <div className="h-14 bg-gray-100 animate-pulse w-1/3" />
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen flex items-center justify-center">
                <div className="text-center px-4">
                    <h1 className="font-display text-3xl md:text-4xl mb-4">Product Not Found</h1>
                    <Link to="/shop" className="btn-primary inline-block">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* ════════════════════════════════════════════
                Breadcrumb
            ════════════════════════════════════════════ */}
            <div className="bg-[#0a0a0a] py-3 md:py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <Link to="/shop" className="flex items-center gap-2 text-xs md:text-sm text-white/50 hover:text-[#dc2626] transition-colors duration-200">
                        <ChevronLeft size={14} />
                        <span className="hidden md:inline">Back to Shop</span>
                        <span className="md:hidden">Back</span>
                    </Link>
                </div>
            </div>

            {/* ════════════════════════════════════════════
                Product Section
            ════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square md:aspect-[3/4] bg-[#f5f5f5] overflow-hidden group">
                            <img
                                src={images[mainImage] || '/images/placeholder.svg'}
                                alt={product.name}
                                className="w-full h-full object-cover cursor-zoom-in transition-transform duration-700 group-hover:scale-105"
                                fetchpriority="high"
                            />
                        </div>
                        {/* Mobile thumbnail strip */}
                        <div className="md:hidden overflow-x-auto -mx-4 px-4">
                            <div className="flex gap-3 min-w-max pb-2">
                                {images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(index)}
                                        className={`w-16 h-16 flex-shrink-0 overflow-hidden transition-all duration-200 ${mainImage === index
                                            ? 'ring-2 ring-[#0a0a0a] ring-offset-2'
                                            : 'opacity-60 hover:opacity-100'
                                            }`}
                                    >
                                        <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Desktop thumbnails */}
                        <div className="hidden md:flex gap-3">
                            {images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(index)}
                                    className={`w-20 h-20 flex-shrink-0 overflow-hidden transition-all duration-200 ${mainImage === index
                                        ? 'ring-2 ring-[#0a0a0a] ring-offset-2'
                                        : 'opacity-50 hover:opacity-100'
                                        }`}
                                >
                                    <img src={img} alt={`View ${index + 1}`} className="w-full h-full object-cover" loading="lazy" />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-6 md:space-y-8">
                        <div>
                            <p className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase mb-2">{product.brand}</p>
                            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight tracking-wider">{product.name}</h1>
                        </div>

                        <p className="text-2xl md:text-3xl font-display tracking-wider">₵{price.toLocaleString()}</p>

                        <p className="text-sm md:text-base text-gray-500 leading-relaxed font-light">{product.description}</p>

                        {/* Colors */}
                        <div>
                            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3">
                                Color: <span className="font-normal text-gray-500">{typeof selectedColor === 'object' ? selectedColor.name : selectedColor}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {colors.map((color, idx) => {
                                    const colorName = typeof color === 'object' ? color.name : color;
                                    const isSelected = (typeof selectedColor === 'object' ? selectedColor.name : selectedColor) === colorName;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedColor(color)}
                                            className={`px-5 py-2.5 text-sm border transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center ${isSelected
                                                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                                                : 'border-gray-200 text-gray-600 hover:border-[#0a0a0a]'
                                                }`}
                                        >
                                            {colorName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <p className="text-xs font-bold tracking-[0.2em] uppercase mb-3">
                                Size: <span className="font-normal text-gray-500">{typeof selectedSize === 'object' ? selectedSize.name : selectedSize}</span>
                            </p>
                            <div className="flex flex-wrap gap-2">
                                {sizes.map((size, idx) => {
                                    const sizeName = typeof size === 'object' ? size.name : size;
                                    const isSelected = (typeof selectedSize === 'object' ? selectedSize.name : selectedSize) === sizeName;
                                    return (
                                        <button
                                            key={idx}
                                            onClick={() => setSelectedSize(size)}
                                            className={`px-5 py-2.5 text-sm border transition-all duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center ${isSelected
                                                ? 'bg-[#0a0a0a] text-white border-[#0a0a0a]'
                                                : 'border-gray-200 text-gray-600 hover:border-[#0a0a0a]'
                                                }`}
                                        >
                                            {sizeName}
                                        </button>
                                    );
                                })}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={added}
                            className={`w-full py-4 text-sm font-bold tracking-[0.15em] uppercase transition-all duration-300 min-h-[52px] ${added
                                ? 'bg-emerald-500 text-white cursor-not-allowed'
                                : 'bg-[#0a0a0a] text-white hover:bg-[#dc2626]'
                                }`}
                        >
                            {added ? (
                                <span className="flex items-center justify-center gap-2">
                                    <Check size={18} /> Added to Bag
                                </span>
                            ) : (
                                'Add to Bag'
                            )}
                        </button>


                        {/* Wishlist */}
                        <button className="w-full py-4 border border-gray-200 text-sm font-bold tracking-[0.15em] uppercase text-[#0a0a0a] hover:border-[#0a0a0a] transition-all duration-200 flex items-center justify-center gap-2 min-h-[52px]">
                            <Heart size={18} />
                            Save for Later
                        </button>

                        {/* ════════════════════════════════════════════
                            Trust Badges
                        ════════════════════════════════════════════ */}
                        <div className="grid grid-cols-3 gap-4 py-6 border-t border-b border-gray-100">
                            <div className="text-center">
                                <div className="w-10 h-10 mx-auto mb-2 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Truck size={16} className="text-[#0a0a0a]" />
                                </div>
                                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500">Free Shipping</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 mx-auto mb-2 bg-gray-50 rounded-full flex items-center justify-center">
                                    <RefreshCw size={16} className="text-[#0a0a0a]" />
                                </div>
                                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500">30-Day Returns</p>
                            </div>
                            <div className="text-center">
                                <div className="w-10 h-10 mx-auto mb-2 bg-gray-50 rounded-full flex items-center justify-center">
                                    <Shield size={16} className="text-[#0a0a0a]" />
                                </div>
                                <p className="text-[10px] font-bold tracking-[0.1em] uppercase text-gray-500">2-Year Warranty</p>
                            </div>
                        </div>

                        {/* Details */}
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-light">Category</span>
                                <span className="capitalize">{product.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-light">Gender</span>
                                <span className="capitalize">{product.gender}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400 font-light">Stock</span>
                                <span className={product.stock > 5 ? 'text-emerald-600' : 'text-[#dc2626]'}>
                                    {product.stock > 5 ? 'In Stock' : `Only ${product.stock} left`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════
                Related Products
            ════════════════════════════════════════════ */}
            {relatedProducts.length > 0 && (
                <section className="bg-[#0a0a0a] py-16 md:py-24">
                    <div className="max-w-7xl mx-auto px-4 md:px-8">
                        <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">You May Also Like</span>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl text-white tracking-wider mb-8 md:mb-10">Complete the Look</h2>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
