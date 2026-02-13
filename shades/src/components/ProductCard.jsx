import { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingBag, Star } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function ProductCard({ product }) {
    const { addToWishlist, isInWishlist, addToCart } = useCart();
    const isWishlisted = isInWishlist(product.id);
    const [isAdding, setIsAdding] = useState(false);
    const lastClickRef = useRef(0);

    // Safe data extraction
    const images = Array.isArray(product.images) ? product.images : [];
    const colors = Array.isArray(product.colors) ? product.colors : [];
    const sizes = Array.isArray(product.sizes) ? product.sizes : [];
    const price = typeof product.price === 'number' ? product.price : parseFloat(product.price) || 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();

        const now = Date.now();
        if (now - lastClickRef.current < 1000) return;
        lastClickRef.current = now;

        setIsAdding(true);

        const firstColor = colors[0] ? (typeof colors[0] === 'object' ? colors[0].name : colors[0]) : 'Default';
        const firstSize = sizes[0] ? (typeof sizes[0] === 'object' ? sizes[0].name : sizes[0]) : 'M';

        addToCart(product, firstColor, firstSize, 1);

        setTimeout(() => setIsAdding(false), 500);
    };

    return (
        <div className="group">
            {/* Image Container */}
            <div className="relative aspect-[4/5] overflow-hidden bg-[#f5f5f5] mb-4">
                <Link to={`/product/${product.id}`}>
                    <img
                        src={images[0] || '/images/placeholder.svg'}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                        loading="lazy"
                    />
                </Link>

                {/* Badges */}
                <div className="absolute top-4 left-4 flex flex-col gap-2">
                    {product.is_new === 1 && (
                        <span className="px-3 py-1 bg-[#dc2626] text-white text-[10px] tracking-widest uppercase font-bold">
                            New
                        </span>
                    )}
                    {product.is_bestseller === 1 && (
                        <span className="px-3 py-1 bg-[#0a0a0a] text-white text-[10px] tracking-widest uppercase font-bold">
                            Best Seller
                        </span>
                    )}
                </div>

                {/* Quick Actions */}
                <div className="absolute top-4 right-4 flex flex-col gap-2">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addToWishlist(product);
                        }}
                        className={`p-3 bg-white shadow-md hover:bg-gray-50 transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center ${isWishlisted ? 'text-[#dc2626]' : 'text-[#0a0a0a]'
                            }`}
                    >
                        <Heart size={18} fill={isWishlisted ? 'currentColor' : 'none'} />
                    </button>
                </div>

                {/* Add to Cart Button */}
                <div className="absolute bottom-0 left-0 right-0 p-4">
                    <button
                        onClick={handleAddToCart}
                        disabled={isAdding}
                        className={`w-full py-4 md:py-3 text-xs tracking-widest uppercase transition-colors duration-200 flex items-center justify-center gap-2 font-bold ${isAdding
                            ? 'bg-green-600 text-white'
                            : 'bg-[#0a0a0a] text-white hover:bg-[#dc2626]'
                            }`}
                    >
                        <ShoppingBag size={16} />
                        {isAdding ? 'Added!' : 'Add to Cart'}
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div>
                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">{product.brand}</p>
                <Link to={`/product/${product.id}`}>
                    <h3 className="font-medium text-[#0a0a0a] group-hover:text-[#dc2626] transition-colors duration-200">
                        {product.name}
                    </h3>
                </Link>

                {/* Rating */}
                <div className="flex items-center gap-2 mt-2">
                    <div className="flex items-center text-[#dc2626]">
                        {[...Array(5)].map((_, i) => (
                            <Star
                                key={i}
                                size={12}
                                fill={i < Math.floor(product.rating || 5) ? 'currentColor' : 'none'}
                                className={i < Math.floor(product.rating || 5) ? '' : 'text-gray-300'}
                            />
                        ))}
                    </div>
                    <span className="text-[10px] text-gray-500">({product.reviews || 0})</span>
                </div>

                {/* Price */}
                <div className="mt-2 text-sm">
                    <span className="font-medium text-[#0a0a0a]">₵{price.toLocaleString()}</span>
                </div>

                {/* Color Options */}
                {colors.length > 1 && (
                    <div className="flex items-center gap-2 mt-3">
                        {colors.slice(0, 4).map((color, i) => (
                            <div
                                key={i}
                                className="w-4 h-4 rounded-full border border-gray-200"
                                style={{ backgroundColor: typeof color === 'object' ? color.hex : '#eee' }}
                                title={typeof color === 'object' ? color.name : color}
                            />
                        ))}
                        {colors.length > 4 && (
                            <span className="text-[10px] text-gray-500 ml-1">+{colors.length - 4}</span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
