import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
    const navigate = useNavigate();
    const { wishlist, cart, removeFromWishlist, addToCart } = useCart();

    const wishlistProducts = wishlist.length > 0 ? wishlist : [];

    const handleProceedToCheckout = () => {
        wishlistProducts.forEach(product => {
            addToCart(product);
        });
        wishlist.forEach(product => removeFromWishlist(product.id));
        navigate('/checkout');
    };

    return (
        <div className="pt-20 md:pt-[104px] min-h-screen">
            {/* ════════════════════════════════════════════
                Dark Header
            ════════════════════════════════════════════ */}
            <div className="bg-[#0a0a0a] py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Saved Items</span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">Wishlist</h1>
                    <p className="text-white/40 mt-3 font-light text-sm">
                        {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-14">
                {wishlistProducts.length === 0 ? (
                    <div className="text-center py-16 md:py-24">
                        <div className="w-24 h-24 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                            <Heart size={32} className="text-gray-300" />
                        </div>
                        <h2 className="font-display text-3xl tracking-wider mb-3">Your Wishlist is Empty</h2>
                        <p className="text-gray-400 mb-8 font-light text-sm">Save your favorite styles to purchase later</p>
                        <Link
                            to="/shop"
                            className="inline-flex items-center gap-2 px-10 py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300"
                        >
                            Continue Shopping <ArrowRight size={14} />
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                            {wishlistProducts.map((product) => (
                                <div key={product.id} className="group">
                                    <div className="relative aspect-[3/4] overflow-hidden bg-[#f5f5f5]">
                                        <img
                                            src={product.images?.[0] || product.image}
                                            alt={product.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                                        />

                                        <button
                                            onClick={() => removeFromWishlist(product.id)}
                                            className="absolute top-3 right-3 w-9 h-9 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center hover:bg-[#dc2626] hover:text-white transition-colors duration-200"
                                            aria-label="Remove from wishlist"
                                        >
                                            <Trash2 size={14} />
                                        </button>

                                        <button
                                            onClick={() => {
                                                addToCart(product);
                                                removeFromWishlist(product.id);
                                            }}
                                            className="absolute bottom-0 left-0 right-0 bg-[#0a0a0a]/90 backdrop-blur-sm text-white py-3 text-xs font-bold tracking-[0.15em] uppercase text-center translate-y-full group-hover:translate-y-0 transition-transform duration-300"
                                        >
                                            Add to Bag
                                        </button>
                                    </div>

                                    <div className="pt-4 pb-2">
                                        <p className="text-[10px] text-[#dc2626] font-bold tracking-[0.2em] uppercase mb-1">
                                            {product.subcategory || product.category}
                                        </p>
                                        <h3 className="font-medium text-sm mb-1 truncate">{product.name}</h3>
                                        <p className="font-display text-lg tracking-wider">₵{product.price.toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-10 md:mt-14 text-center">
                            <button
                                onClick={handleProceedToCheckout}
                                className="inline-flex items-center gap-3 px-10 py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300"
                            >
                                <ShoppingBag size={16} />
                                Add All to Bag & Checkout
                                <ArrowRight size={14} />
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}
