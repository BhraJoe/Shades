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
                        className={`w-full py-4 bg-[#0a0a0a] text-white text-[10px] font-bold tracking-[0.2em] uppercase transition-all duration-300 flex items-center justify-center gap-3 hover:bg-[#dc2626] disabled:opacity-70 disabled:cursor-not-allowed shadow-xl ${isAdding ? 'translate-y-0' : 'translate-y-16 group-hover:translate-y-0'
                            }`}
                    >
                        {isAdding ? (
                            <>
                                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                <span>Adding...</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag size={16} />
                                <span>Add to Cart</span>
                            </>
                        )}
                    </button>
                </div>
            </div>

            {/* Product Info */}
            <div className="space-y-3">
                <div className="flex items-start justify-between gap-4">
                    <div>
                        <h3 className="font-bold text-[#0a0a0a] text-lg tracking-tight leading-none group-hover:text-[#dc2626] transition-colors">
                            {product.name}
                        </h3>
                        <p className="text-[#0a0a0a] text-xs tracking-widest uppercase mt-1 opacity-60">
                            {product.brand}
                        </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                        <span className="block font-display text-2xl text-[#0a0a0a] tracking-tight">
                            ₵{price.toFixed(2)}
                        </span>
                    </div>
                </div>

                {/* Color Options */}
                {colors.length > 0 && (
                    <div className="flex items-center gap-2">
                        {colors.slice(0, 4).map((color, i) => (
                            <div
                                key={i}
                                className="w-5 h-5 rounded-full border border-gray-200 shadow-sm"
                                style={{
                                    backgroundColor: typeof color === 'object' ? color.hex : '#' + Math.floor(Math.random() * 16777215).toString(16),
                                }}
                                title={typeof color === 'object' ? color.name : color}
                            />
                        ))}
                        {colors.length > 4 && (
                            <span className="text-[8px] uppercase tracking-wider text-gray-400 ml-1">
                                +{colors.length - 4} more
                            </span>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}
