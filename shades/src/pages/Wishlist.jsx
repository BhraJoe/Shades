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
        <div className="min-h-screen bg-white pt-32 pb-16">
            <div className="max-w-7xl mx-auto px-4 md:px-6">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <h1 className="font-display text-4xl md:text-5xl tracking-wider mb-4">
                        WISHLIST
                    </h1>
                    <p className="text-gray-500 tracking-wide">
                        Your saved favorites
                    </p>
                </div>

                {wishlistProducts.length === 0 ? (
                    /* Empty State */
                    <div className="text-center py-16">
                        <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
                            <Heart size={32} className="text-gray-400" />
                        </div>
                        <h2 className="font-display text-2xl tracking-wide mb-4">
                            Your wishlist is empty
                        </h2>
                        <p className="text-gray-500 mb-8 tracking-wide">
                            Save your favorite styles to purchase later
                        </p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 btn-primary"
                        >
                            Continue Shopping
                            <ArrowRight size={16} />
                        </Link>
                    </div>
                ) : (
                    <>
                        {/* Wishlist Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {wishlistProducts.map((product) => (
                                <div key={product.id} className="product-card group">
                                    {/* Product Image */}
                                    <div className="relative aspect-[3/4] overflow-hidden bg-gray-50">
                                        <img
                                            src={product.images?.[0] || product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        />

                                        {/* Remove Button */}
                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="absolute top-4 right-4 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-md hover:bg-gray-100 transition-colors"
                                        >
                                            <Trash2 size={14} className="text-gray-600" />
                                        </button>

                                        {/* Quick Add Button */}
                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                removeFromWishlist(product.id);
                                            }}
                                            className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm py-3 text-xs font-bold tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white hover:text-[#dc2626]"
                                        >
                                            Add to Bag
                                        </button>
                                    </div>

                                    {/* Product Info */}
                                    <div className="p-4">
                                        <p className="text-xs text-gray-500 tracking-wider mb-1">
                                            {product.subcategory || product.category}
                                        </p>
                                        <h3 className="font-medium tracking-wide mb-2">
                                            {product.name}
                                        </h3>
                                        <p className="font-display text-lg tracking-wide">
                                            ₵{product.price.toLocaleString()}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Proceed to Checkout Button */}
                        <div className="mt-12 text-center">
                            <button
                                onClick={handleProceedToCheckout}
                                className="inline-flex items-center gap-2 btn-primary"
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
