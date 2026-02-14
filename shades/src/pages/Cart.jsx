import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight, Truck } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const shipping = cartTotal >= 150 ? 0 : 7.95;
    const estimatedTax = 0;
    const orderTotal = cartTotal + shipping + estimatedTax;
    const freeShippingProgress = Math.min((cartTotal / 150) * 100, 100);

    if (cart.length === 0) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-sm mx-auto w-full">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                        <Truck size={28} className="text-gray-300" />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl tracking-wider mb-4">Your Bag is Empty</h1>
                    <p className="text-gray-400 mb-8 font-light text-sm">
                        Looks like you haven't added any sunglasses yet. Start shopping to find your perfect pair!
                    </p>
                    <Link to="/shop" className="inline-block w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300 text-center">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* ════════════════════════════════════════════
                Dark Header
            ════════════════════════════════════════════ */}
            <div className="bg-[#0a0a0a] py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Your Selection</span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">Shopping Bag</h1>
                    <p className="text-white/50 mt-3 font-light text-sm">{cart.length} {cart.length === 1 ? 'item' : 'items'} in your bag</p>
                </div>
            </div>

            {/* ════════════════════════════════════════════
                Cart Content
            ════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.color}-${item.size}`} className="flex flex-col sm:flex-row gap-5 p-5 sm:p-6 bg-white border border-gray-100 hover:border-gray-200 transition-colors duration-200">
                                    <div className="w-full sm:w-28 sm:h-28 flex-shrink-0 bg-[#f5f5f5] overflow-hidden">
                                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-2">
                                            <div className="pr-4">
                                                <p className="text-[#dc2626] text-[10px] font-bold tracking-[0.2em] uppercase mb-1">{item.brand}</p>
                                                <h3 className="font-display text-lg tracking-wider truncate">{item.name}</h3>
                                            </div>
                                            <p className="font-display text-lg tracking-wider whitespace-nowrap">₵{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-400 mb-5 font-light">
                                            <span>{item.color}</span>
                                            <span className="text-gray-200">|</span>
                                            <span>{item.size}</span>
                                        </div>

                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                                                    className="p-3 hover:text-[#dc2626] transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-5 text-sm font-display tracking-wider min-w-[40px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                                                    className="p-3 hover:text-[#dc2626] transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id, item.color, item.size)}
                                                className="text-xs text-gray-400 hover:text-[#dc2626] transition-colors duration-200 flex items-center gap-1.5 py-2"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={14} />
                                                <span>Remove</span>
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="mt-8">
                            <Link to="/shop" className="inline-flex items-center gap-2 text-sm font-bold tracking-[0.15em] uppercase text-[#0a0a0a] hover:text-[#dc2626] transition-colors duration-200">
                                <ArrowRight size={14} className="rotate-180" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════
                        Order Summary
                    ════════════════════════════════════════════ */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        <div className="sticky top-28 bg-white border border-gray-100 p-6">
                            <h2 className="font-display text-xl tracking-wider mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-light">Subtotal</span>
                                    <span className="font-medium">₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-light">Shipping</span>
                                    <span className={shipping === 0 ? 'text-emerald-600 font-medium' : 'font-medium'}>
                                        {shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400 font-light">Estimated Tax</span>
                                    <span className="font-medium">₵{estimatedTax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3 mt-3">
                                    <div className="flex justify-between font-display text-xl tracking-wider">
                                        <span>Total</span>
                                        <span>₵{orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Free Shipping Progress */}
                            {cartTotal < 150 && (
                                <div className="mb-6 p-4 bg-[#fafafa]">
                                    <div className="flex justify-between text-xs mb-2">
                                        <span className="text-gray-500 font-light">Free shipping at ₵150</span>
                                        <span className="font-bold text-[#dc2626]">₵{(150 - cartTotal).toFixed(2)} away</span>
                                    </div>
                                    <div className="w-full h-1.5 bg-gray-200 overflow-hidden">
                                        <div
                                            className="h-full bg-[#dc2626] transition-all duration-500"
                                            style={{ width: `${freeShippingProgress}%` }}
                                        />
                                    </div>
                                </div>
                            )}

                            <Link
                                to="/checkout"
                                className="block w-full py-4 bg-[#0a0a0a] text-white text-center text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300"
                            >
                                Proceed to Checkout
                            </Link>

                            <p className="text-[10px] text-gray-300 text-center mt-4 font-light tracking-[0.1em]">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
