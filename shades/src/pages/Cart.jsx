import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, Heart } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const shipping = cartTotal >= 150 ? 0 : 7.95;
    const estimatedTax = cartTotal * 0.08;
    const orderTotal = cartTotal + shipping + estimatedTax;

    if (cart.length === 0) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-sm mx-auto w-full">
                    <h1 className="font-display text-2xl md:text-3xl mb-4">Your Bag is Empty</h1>
                    <p className="text-gray-500 mb-8 font-light text-sm">
                        Looks like you haven't added any sunglasses yet. Start shopping to find your perfect pair!
                    </p>
                    <Link to="/shop" className="btn-primary w-full block text-center py-3">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* Header */}
            <div className="bg-[#f5f5f5] py-6 md:py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className="section-title">Shopping Bag</h1>
                    <p className="text-gray-500 mt-2 md:mt-4 font-light text-sm">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag</p>
                </div>
            </div>

            {/* Cart Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.color}-${item.size}`} className="flex flex-col sm:flex-row gap-4 p-4 sm:p-6 bg-white border border-gray-200">
                                    {/* Image */}
                                    <div className="w-full sm:w-24 sm:h-24 flex-shrink-0 bg-[#f5f5f5]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="pr-4">
                                                <p className="text-xs text-gray-500 tracking-widest uppercase mb-1">{item.brand}</p>
                                                <h3 className="font-medium text-sm sm:text-base truncate">{item.name}</h3>
                                            </div>
                                            <p className="font-medium text-sm sm:text-base whitespace-nowrap">₵{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 font-light">
                                            <span>{item.color}</span>
                                            <span>|</span>
                                            <span>{item.size}</span>
                                        </div>

                                        {/* Quantity & Actions Row */}
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            {/* Quantity Controls */}
                                            <div className="flex items-center border border-gray-200 w-fit">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                                                    className="p-3 hover:text-[#dc2626] transition-colors duration-200 active:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-4 text-sm font-medium min-w-[40px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                                                    className="p-3 hover:text-[#dc2626] transition-colors duration-200 active:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="flex items-center gap-3">
                                                <button
                                                    onClick={() => removeFromCart(item.id, item.color, item.size)}
                                                    className="text-xs text-gray-500 hover:text-[#dc2626] transition-colors duration-200 flex items-center gap-1.5 px-2 py-2 min-w-[44px] min-h-[44px]"
                                                    aria-label="Remove item"
                                                >
                                                    <Trash2 size={18} />
                                                    <span className="hidden sm:inline">Remove</span>
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-6">
                            <Link to="/shop" className="text-[#0a0a0a] hover:text-[#dc2626] transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase py-2">
                                <ArrowRight size={16} className="rotate-180" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="sticky top-20 bg-white border border-gray-200 p-4 sm:p-6">
                            <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-light">Subtotal</span>
                                    <span>₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-light">Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600 font-light">Estimated Tax</span>
                                    <span>₵{estimatedTax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-medium text-base sm:text-lg">
                                        <span>Total</span>
                                        <span>₵{orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {cartTotal < 150 && (
                                <div className="bg-[#f5f5f5] p-3 mb-4 sm:mb-6">
                                    <p className="text-xs text-gray-600 font-light">
                                        Add <span className="font-bold">₵{(150 - cartTotal).toFixed(2)}</span> more for free shipping!
                                    </p>
                                </div>
                            )}

                            <Link to="/checkout" className="btn-primary w-full text-center block py-3 sm:py-3.5 text-sm sm:text-base">
                                Proceed to Checkout
                            </Link>

                            <p className="text-[10px] text-gray-500 text-center mt-3 sm:mt-4 font-light">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
