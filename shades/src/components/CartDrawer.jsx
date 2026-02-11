import { X, Trash2, Plus, Minus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';

export default function CartDrawer({ isOpen, onClose }) {
    const { cart, removeFromCart, updateQuantity, cartTotal } = useCart();

    const shipping = cartTotal >= 150 ? 0 : 7.95;

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[1000]">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-black/50 transition-opacity duration-300"
                onClick={onClose}
            />

            {/* Drawer */}
            <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl transform transition-transform duration-300 ease-in-out flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200">
                    <h2 className="font-display text-lg sm:text-xl">Shopping Bag</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-[#f5f5f5] transition-colors duration-200 min-w-[44px] min-h-[44px] flex items-center justify-center"
                        aria-label="Close cart"
                    >
                        <X size={20} />
                    </button>
                </div>

                {/* Cart Items */}
                <div className="flex-1 overflow-y-auto p-4 sm:p-6">
                    {cart.length === 0 ? (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-6 font-light">Your bag is empty</p>
                            <button
                                onClick={onClose}
                                className="btn-primary w-full py-3"
                            >
                                Continue Shopping
                            </button>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {cart.map((item) => (
                                <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4">
                                    <div className="w-20 h-20 bg-[#f5f5f5] flex-shrink-0">
                                        <img
                                            src={item.image}
                                            alt={item.name}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-start mb-1">
                                            <h3 className="text-sm font-medium pr-2 truncate">{item.name}</h3>
                                            <p className="text-sm font-medium whitespace-nowrap">₵{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                        <p className="text-xs text-gray-500 mb-3">{item.color}</p>

                                        <div className="flex items-center justify-between gap-2">
                                            <div className="flex items-center border border-gray-200">
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity - 1)}
                                                    className="p-2.5 hover:text-[#dc2626] transition-colors duration-200 active:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Decrease quantity"
                                                >
                                                    <Minus size={16} />
                                                </button>
                                                <span className="px-3 text-sm font-medium min-w-[36px] text-center">{item.quantity}</span>
                                                <button
                                                    onClick={() => updateQuantity(item.id, item.color, item.size, item.quantity + 1)}
                                                    className="p-2.5 hover:text-[#dc2626] transition-colors duration-200 active:bg-gray-100 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                    aria-label="Increase quantity"
                                                >
                                                    <Plus size={16} />
                                                </button>
                                            </div>

                                            <button
                                                onClick={() => removeFromCart(item.id, item.color, item.size)}
                                                className="text-gray-400 hover:text-[#dc2626] transition-colors duration-200 p-2 min-w-[44px] min-h-[44px] flex items-center justify-center"
                                                aria-label="Remove item"
                                            >
                                                <Trash2 size={18} />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Footer */}
                {cart.length > 0 && (
                    <div className="border-t border-gray-200 p-4 sm:p-6 space-y-4">
                        {/* Free Shipping Progress */}
                        {cartTotal < 150 && (
                            <div className="bg-[#f5f5f5] p-3">
                                <div className="flex justify-between text-xs mb-2 font-light">
                                    <span>Add ₵{(150 - cartTotal).toFixed(2)} for free shipping</span>
                                </div>
                                <div className="w-full bg-gray-200 h-1">
                                    <div
                                        className="bg-[#dc2626] h-1 transition-all duration-300"
                                        style={{ width: `${(cartTotal / 150) * 100}%` }}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Summary */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-light">Subtotal</span>
                                <span>₵{cartTotal.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-600 font-light">Shipping</span>
                                <span>{shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}</span>
                            </div>
                        </div>

                        {/* Buttons */}
                        <div className="space-y-3">
                            <Link
                                to="/checkout"
                                onClick={onClose}
                                className="btn-primary w-full text-center block py-3"
                            >
                                Checkout
                            </Link>
                            <Link
                                to="/cart"
                                onClick={onClose}
                                className="btn-secondary w-full text-center block py-3"
                            >
                                View Bag
                            </Link>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}
