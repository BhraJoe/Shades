import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchProduct, fetchProducts } from '../api';
import { useCart } from '../context/CartContext';
import ProductCard from '../components/ProductCard';
import { ChevronLeft, Heart, Check } from 'lucide-react';

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
        async function loadProduct() {
            setLoading(true);
            try {
                const data = await fetchProduct(id);
                setProduct(data);
                setSelectedColor(data.colors[0]);
                setSelectedSize(data.sizes[0]);

                // Load related products
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

    const handleAddToCart = () => {
        if (!selectedColor || !selectedSize) return;

        // Double protection against double clicks
        if (isAddingRef.current) return;
        isAddingRef.current = true;

        // Extract color and size values (handle both string and object formats)
        const colorValue = typeof selectedColor === 'object' ? selectedColor.name : selectedColor;
        const sizeValue = typeof selectedSize === 'object' ? selectedSize.name : selectedSize;

        // Call addToCart with correct 4 parameters
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
                <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                        <div className="aspect-square md:aspect-[3/4] skeleton" />
                        <div className="space-y-4">
                            <div className="h-3 skeleton w-1/4" />
                            <div className="h-8 md:h-10 skeleton w-3/4" />
                            <div className="h-6 skeleton w-1/4" />
                            <div className="h-24 md:h-32 skeleton" />
                            <div className="h-12 skeleton w-1/3" />
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
                    <h1 className="font-display text-2xl md:text-3xl mb-4">Product Not Found</h1>
                    <Link to="/shop" className="btn-primary inline-block">Shop Now</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* Breadcrumb */}
            <div className="bg-[#f5f5f5] py-3 md:py-4">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <Link to="/shop" className="flex items-center gap-2 text-xs md:text-sm text-gray-500 hover:text-[#dc2626] transition-colors duration-200">
                        <ChevronLeft size={14} />
                        <span className="hidden md:inline">Back to Shop</span>
                        <span className="md:hidden">Back</span>
                    </Link>
                </div>
            </div>

            {/* Product Details */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
                    {/* Image Gallery */}
                    <div className="space-y-3 md:space-y-4">
                        <div className="aspect-square md:aspect-[3/4] bg-[#f5f5f5] overflow-hidden touch-none">
                            <img
                                src={product.images[mainImage]}
                                alt={product.name}
                                className="w-full h-full object-cover cursor-zoom-in"
                                fetchpriority="high"
                                decoding="async"
                            />
                        </div>
                        {/* Scrollable thumbnail gallery on mobile */}
                        <div className="md:hidden overflow-x-auto -mx-4 px-4">
                            <div className="flex gap-3 min-w-max pb-2">
                                {product.images.map((img, index) => (
                                    <button
                                        key={index}
                                        onClick={() => setMainImage(index)}
                                        className={`w-16 h-16 flex-shrink-0 overflow-hidden border-2 transition-colors duration-200 rounded-md ${mainImage === index ? 'border-[#0a0a0a]' : 'border-transparent'
                                            }`}
                                    >
                                        <img
                                            src={img}
                                            alt={`View ${index + 1}`}
                                            className="w-full h-full object-cover"
                                            loading="lazy"
                                            decoding="async"
                                        />
                                    </button>
                                ))}
                            </div>
                        </div>
                        {/* Desktop thumbnail gallery */}
                        <div className="hidden md:flex gap-4">
                            {product.images.map((img, index) => (
                                <button
                                    key={index}
                                    onClick={() => setMainImage(index)}
                                    className={`w-20 h-20 flex-shrink-0 overflow-hidden border-2 transition-colors duration-200 ${mainImage === index ? 'border-[#0a0a0a]' : 'border-transparent'
                                        }`}
                                >
                                    <img
                                        src={img}
                                        alt={`View ${index + 1}`}
                                        className="w-full h-full object-cover"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Product Info */}
                    <div className="space-y-5 md:space-y-6">
                        <div>
                            <p className="text-xs md:text-[10px] text-gray-500 tracking-widest uppercase mb-1 md:mb-2">{product.brand}</p>
                            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl leading-tight">{product.name}</h1>
                        </div>
                        <p className="text-xl md:text-2xl font-medium">₵{product.price.toLocaleString()}</p>

                        <p className="text-sm md:text-base text-gray-600 leading-relaxed font-light">{product.description}</p>

                        {/* Colors */}
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase mb-2 md:mb-3">Color: <span className="font-normal text-gray-600">{selectedColor}</span></p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {product.colors.map((color) => (
                                    <button
                                        key={color}
                                        onClick={() => setSelectedColor(color)}
                                        className={`filter-pill min-w-[44px] min-h-[44px] flex items-center justify-center ${selectedColor === color ? 'active' : ''
                                            }`}
                                    >
                                        {color}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Sizes */}
                        <div>
                            <p className="text-xs font-bold tracking-widest uppercase mb-2 md:mb-3">Size: <span className="font-normal text-gray-600">{selectedSize}</span></p>
                            <div className="flex flex-wrap gap-2 md:gap-3">
                                {product.sizes.map((size) => (
                                    <button
                                        key={size}
                                        onClick={() => setSelectedSize(size)}
                                        className={`size-btn min-w-[44px] min-h-[44px] flex items-center justify-center ${selectedSize === size ? 'active' : ''
                                            }`}
                                    >
                                        {size}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Add to Cart */}
                        <button
                            onClick={handleAddToCart}
                            disabled={added}
                            className={`btn-primary w-full py-4 md:py-3 min-h-[52px] md:min-h-[48px] ${added ? '!bg-[#22c55e] cursor-not-allowed' : ''}`}
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
                        <button className="btn-secondary w-full py-4 md:py-3 min-h-[52px] md:min-h-[48px] flex items-center justify-center gap-2">
                            <Heart size={18} />
                            Save for Later
                        </button>

                        {/* Details */}
                        <div className="pt-6 md:pt-8 border-t border-gray-200 space-y-3 md:space-y-4">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-light">Category</span>
                                <span className="capitalize">{product.category}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-light">Gender</span>
                                <span className="capitalize">{product.gender}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-500 font-light">Stock</span>
                                <span className={product.stock > 5 ? 'text-green-600' : 'text-[#dc2626]'}>
                                    {product.stock > 5 ? 'In Stock' : `Only ${product.stock} left`}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <section className="bg-[#f5f5f5] py-12 md:py-16">
                    <div className="max-w-7xl mx-auto px-4 md:px-6">
                        <h2 className="font-display text-2xl md:text-3xl lg:text-4xl mb-6 md:mb-8">You May Also Like</h2>
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {relatedProducts.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}
