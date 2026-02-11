import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
    const navigate = useNavigate();
    const { wishlist, cart, removeFromWishlist, addToCart } = useCart();

    // Get wishlist products - use wishlist items directly
    const wishlistProducts = wishlist.length > 0 ? wishlist : [];

    const handleProceedToCheckout = () => {
        // Add all wishlist items to cart first
        wishlistProducts.forEach(product => {
            addToCart(product);
        });
        // Clear wishlist
        wishlist.forEach(product => removeFromWishlist(product.id));
        // Navigate to checkout
        navigate('/checkout');
    };

    return (
        <div className="pt-[130px] md:pt-[104px] min-h-screen bg-white pb-8">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Page Header */}
                <div className="text-center mb-8 md:mb-16">
                    <h1 className="font-display text-3xl md:text-4xl tracking-wider mb-2 md:mb-4">
                        WISHLIST
                    </h1>
                    <p className="text-gray-500 tracking-wide text-sm md:text-base">
                        {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>

                {wishlistProducts.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-12 md:py-16">
                        <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 bg-gray-100 rounded-full mb-6">
                            <Heart size={28} className="text-gray-400 md:w-8 md:h-8" />
                        </div>
                        <h2 className="font-display text-2xl tracking-wide mb-4">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 mb-8 tracking-wide text-sm md:text-base">
                            Save your favorite styles to purchase later
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center justify-center gap-2 btn-primary w-full sm:w-auto"
                        >
                            Continue Shopping
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Wishlist Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 lg:gap-8">
                            {wishlistProducts.map((product) => (
                                <div key={product.id} className="product-card group">
                                    {/* Product Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                        <img
                                            src={product.images?.[0] || product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Remove Button - Larger touch target on mobile */}
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="absolute top-3 right-3 w-9 h-9 md:w-8 md:h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors touch-manipulation"
                                            aria-label="Remove from wishlist"
                                        >
                                            <Trash2 size={14} className="text-gray-600" />
                                        </button>

                                        {/* Quick Add Button - Always visible on mobile */}
                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                removeFromWishlist(product.id);
                                            }}
                                            className="absolute bottom-3 left-3 right-3 bg-white/90 backdrop-blur-sm py-2.5 md:py-3 text-xs font-bold tracking-[0.1em] uppercase transition-all duration-300 hover:bg-white hover:text-[#dc2626] touch-manipulation opacity-100"
                                        >
                                            Add to Bag
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-3 md:p-4">
                                        <p className="text-xs text-gray-500 tracking-wider mb-1">
                                            {product.subcategory || product.category}
                                        </p>
                                        <h3 className="font-medium tracking-wide mb-1 text-sm md:text-base">
                                            {product.name}
                                        </h3>
                                        <p className="font-display text-base md:text-lg tracking-wide">
                                            ₵{product.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Proceed to Checkout Button */}
                        <div className="mt-8 md:mt-12 text-center">
                            <button
                                onClick={handleProceedToCheckout}
                                className="inline-flex items-center justify-center gap-2 btn-primary w-full sm:w-auto py-3 md:py-3"
                            >
                                <ShoppingBag size={18} />
                                Proceed to Checkout
                                <ArrowRight size={16} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
