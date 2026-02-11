import { Link } from 'react-router-dom';
import { Trash2, Minus, Plus, ArrowRight } from 'lucide-react';
import { useCart } from '../context/CartContext';

export default function Cart() {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const shipping = cartTotal >= 150 ? 0 : 7.95;
    const estimatedTax = cartTotal * 0.08;
    const orderTotal = cartTotal + shipping + estimatedTax;

    if (cart.length === 0) {
        return (
            <div className="pt-[130px] md:pt-[104px] min-h-screen flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <h1 className="font-display text-3xl mb-4">Your Bag is Empty</h1>
                    <p className="text-gray-500 mb-8 font-light">
                        Looks like you haven't added any sunglasses yet. Start shopping to find your perfect pair!
                    </p>
                    <Link to="/shop" className="btn-primary">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[130px] md:pt-[104px]">
            {/* Header */}
            <div className="bg-[#f5f5f5] py-8 md:py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className="section-title">Shopping Bag</h1>
                    <p className="text-gray-500 mt-4 font-light">{cart.length} items in your bag</p>
                </div>
            </div>

            {/* Cart Content */}
            <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Cart Items */}
                    <div className="lg:col-span-2">
                        <div className="space-y-6">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-6 p-6 bg-white border border-gray-200">
                                    {/* Image */}
                                    <div className="w-24 h-24 flex-shrink-0 bg-[#f5f5f5]">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>

                                    {/* Details */}
                                    <div className="flex-1">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="text-[10px] text-gray-500 tracking-widest uppercase mb-1">{item.brand}</p>
                                                <h3 className="font-medium">{item.name}</h3>
                                            </div>
                                            <p className="font-medium">₵{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>

                                        <div className="flex items-center gap-4 text-xs text-gray-500 mb-4 font-light">
                                            <span>{item.color}</span>
                                            <span>|</span>
                                            <span>{item.size}</span>
                                        </div>

                                        <div className="flex items-center justify-between">
                                            {/* Quantity */}
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                                                    className="p-2 hover:text-[#dc2626] transition-colors duration-200"
                                                >
                                                    <Minus size={14} />
                                                </button>
                                                <span className="px-4 text-xs">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                                                    className="p-2 hover:text-[#dc2626] transition-colors duration-200"
                                                >
                                                    <Plus size={14} />
                                                </button>
                                            </div>

                                            {/* Remove */}
                                            <button
                                                onClick={() => removeFromCart(item.id, item.color, item.size)}
                                                className="text-xs text-gray-500 hover:text-[#dc2626] transition-colors duration-200 flex items-center gap-1"
                                            >
                                                <Trash2 size={14} />
                                                Remove
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Continue Shopping */}
                        <div className="mt-8">
                            <Link to="/shop" className="text-[#0a0a0a] hover:text-[#dc2626] transition-colors duration-200 flex items-center gap-2 text-xs font-bold tracking-widest uppercase">
                                <ArrowRight size={16} className="rotate-180" />
                                Continue Shopping
                            </Link>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-[120px] bg-white border border-gray-200 p-6">
                            <h2 className="font-display text-xl mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-light">Subtotal</span>
                                    <span>₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-light">Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-light">Estimated Tax</span>
                                    <span>₵{estimatedTax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-medium text-lg">
                                        <span>Total</span>
                                        <span>₵{orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {cartTotal < 150 && (
                                <div className="bg-[#f5f5f5] p-4 mb-6">
                                    <p className="text-xs text-gray-600 font-light">
                                        Add <span className="font-bold">₵{(150 - cartTotal).toFixed(2)}</span> more for free shipping!
                                    </p>
                                </div>
                            )}

                            <Link to="/checkout" className="btn-primary w-full text-center">
                                Proceed to Checkout
                            </Link>

                            <p className="text-[10px] text-gray-500 text-center mt-4 font-light">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
