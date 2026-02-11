import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronRight, CreditCard, Lock, Check, ShoppingBag, ArrowLeft, Shield } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState('shipping');
    const [orderComplete, setOrderComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showOrderSummary, setShowOrderSummary] = useState(false);

    const shipping = cartTotal >= 150 ? 0 : 7.95;
    const estimatedTax = cartTotal * 0.08;
    const orderTotal = cartTotal + shipping + estimatedTax;

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        address: '',
        city: '',
        state: '',
        zip: '',
        country: '',
        phone: '',
        cardNumber: '',
        cardName: '',
        cardExpiry: '',
        cardCvv: '',
        mobileMoneyNumber: '',
        mobileMoneyProvider: '',
        mobileMoneyName: '',
        paypalEmail: '',
        bankName: '',
        accountNumber: '',
        accountName: ''
    });

    useEffect(() => {
        if (window.innerWidth >= 1024) {
            setShowOrderSummary(true);
        }
    }, []);

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 'shipping') {
            setStep('payment');
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
            setLoading(true);
            setTimeout(() => {
                setOrderNumber('ORD-' + Date.now().toString().slice(-8));
                setOrderComplete(true);
                clearCart();
                setLoading(false);
            }, 1500);
        }
    };

    if (cart.length === 0 && !orderComplete) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-sm mx-auto px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-200 rounded-full flex items-center justify-center">
                        <ShoppingBag size={28} className="text-gray-400" />
                    </div>
                    <h1 className="font-display text-xl mb-3">Your Bag is Empty</h1>
                    <p className="text-gray-500 text-sm mb-6">
                        Add some sunglasses to continue with checkout.
                    </p>
                    <Link to="/shop" className="btn-primary inline-block text-sm">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="pt-20 min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center max-w-sm mx-auto px-4">
                    <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                        <Check size={28} className="text-green-600" />
                    </div>
                    <h1 className="font-display text-xl mb-3">Order Confirmed!</h1>
                    <p className="text-gray-500 text-sm mb-4">
                        Thank you for your purchase.
                    </p>
                    <p className="text-xs text-gray-400 mb-6">
                        Order #: {orderNumber}
                    </p>
                    <Link to="/shop" className="btn-primary inline-block text-sm">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-16 bg-gray-50 min-h-screen">
            {/* Header */}
            <div className="bg-white border-b border-gray-200 sticky top-0 z-40">
                <div className="px-4 py-3">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <Link to="/cart" className="p-1 -ml-1">
                                <ArrowLeft size={22} className="text-gray-700" />
                            </Link>
                            <h1 className="font-display text-lg">Checkout</h1>
                        </div>
                        {/* Progress indicator */}
                        <div className="flex items-center gap-2">
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'shipping' ? 'bg-black text-white' : 'bg-green-500 text-white'}`}>
                                {step === 'shipping' ? '1' : '✓'}
                            </div>
                            <span className="text-sm font-medium">Shipping</span>
                            <span className="text-gray-400 mx-1">→</span>
                            <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-black text-white' : 'bg-gray-200'}`}>
                                2
                            </div>
                            <span className="text-sm font-medium">Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Order Summary Toggle */}
            <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3">
                <button
                    type="button"
                    className="w-full bg-gray-100 p-3 rounded-lg flex items-center justify-between"
                    onClick={() => setShowOrderSummary(!showOrderSummary)}
                >
                    <span className="flex items-center gap-2 text-sm font-medium">
                        <ShoppingBag size={18} />
                        {cart.length} {cart.length === 1 ? 'item' : 'items'} • ₵{orderTotal.toFixed(2)}
                    </span>
                    <span className={`transform transition-transform ${showOrderSummary ? 'rotate-180' : ''}`}>
                        <ChevronRight size={18} className="-rotate-90" />
                    </span>
                </button>
            </div>

            <div className="max-w-6xl mx-auto px-4 py-4">
                <div className="lg:grid lg:grid-cols-3 lg:gap-8">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {step === 'shipping' && (
                                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                                    {/* Contact Information */}
                                    <div className="mb-6">
                                        <h2 className="font-display text-lg mb-4">Contact Information</h2>
                                        <div>
                                            <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="input-field w-full"
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="mb-6">
                                        <h2 className="font-display text-lg mb-4">Shipping Address</h2>
                                        <div className="grid grid-cols-2 gap-3">
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">First Name</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field w-full" required />
                                            </div>
                                            <div className="col-span-2 sm:col-span-1">
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Last Name</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field w-full" required />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Address</label>
                                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-field w-full" required />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">City</label>
                                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field w-full" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">State</label>
                                                <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="input-field w-full" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">ZIP Code</label>
                                                <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="input-field w-full" required />
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Country</label>
                                                <select name="country" value={formData.country} onChange={handleInputChange} className="input-field w-full" required>
                                                    <option value="">Select Country</option>
                                                    <option value="United States">United States</option>
                                                    <option value="Canada">Canada</option>
                                                    <option value="United Kingdom">United Kingdom</option>
                                                    <option value="Australia">Australia</option>
                                                    <option value="Germany">Germany</option>
                                                    <option value="France">France</option>
                                                    <option value="Ghana">Ghana</option>
                                                    <option value="Nigeria">Nigeria</option>
                                                    <option value="Kenya">Kenya</option>
                                                    <option value="South Africa">South Africa</option>
                                                    <option value="India">India</option>
                                                    <option value="China">China</option>
                                                    <option value="Japan">Japan</option>
                                                    <option value="Singapore">Singapore</option>
                                                    <option value="Malaysia">Malaysia</option>
                                                    <option value="Philippines">Philippines</option>
                                                    <option value="Indonesia">Indonesia</option>
                                                    <option value="Thailand">Thailand</option>
                                                    <option value="Vietnam">Vietnam</option>
                                                </select>
                                            </div>
                                            <div className="col-span-2">
                                                <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Phone</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field w-full" placeholder="+1 (555) 000-0000" />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Continue Button */}
                                    <button type="submit" className="btn-primary w-full py-3.5 text-sm font-bold">
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="bg-white rounded-xl p-4 sm:p-6 shadow-sm">
                                    {/* Payment Section */}
                                    <div className="mb-6">
                                        <h2 className="font-display text-lg mb-4">Payment Method</h2>

                                        {/* Payment Method Selection */}
                                        <div className="grid grid-cols-2 gap-2.5 mb-5">
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('card')}
                                                className={`p-3 border-2 rounded-lg text-center transition-all ${paymentMethod === 'card'
                                                    ? 'border-black bg-gray-50'
                                                    : 'border-gray-200 bg-white'
                                                    }`}
                                            >
                                                <CreditCard size={20} className={`mx-auto mb-1.5 ${paymentMethod === 'card' ? 'text-black' : 'text-gray-500'}`} />
                                                <p className="text-xs font-semibold">Card</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('mobile_money')}
                                                className={`p-3 border-2 rounded-lg text-center transition-all ${paymentMethod === 'mobile_money'
                                                    ? 'border-black bg-gray-50'
                                                    : 'border-gray-200 bg-white'
                                                    }`}
                                            >
                                                <div className="w-6 h-6 mx-auto mb-1.5 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold">M</span>
                                                </div>
                                                <p className="text-xs font-semibold">Mobile</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('paypal')}
                                                className={`p-3 border-2 rounded-lg text-center transition-all ${paymentMethod === 'paypal'
                                                    ? 'border-black bg-gray-50'
                                                    : 'border-gray-200 bg-white'
                                                    }`}
                                            >
                                                <div className="w-6 h-6 mx-auto mb-1.5 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold">P</span>
                                                </div>
                                                <p className="text-xs font-semibold">PayPal</p>
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setPaymentMethod('bank')}
                                                className={`p-3 border-2 rounded-lg text-center transition-all ${paymentMethod === 'bank'
                                                    ? 'border-black bg-gray-50'
                                                    : 'border-gray-200 bg-white'
                                                    }`}
                                            >
                                                <div className="w-6 h-6 mx-auto mb-1.5 bg-gray-200 rounded-full flex items-center justify-center">
                                                    <span className="text-xs font-bold">B</span>
                                                </div>
                                                <p className="text-xs font-semibold">Bank</p>
                                            </button>
                                        </div>

                                        {/* Security Badge */}
                                        <div className="flex items-center gap-2 text-xs text-gray-500 mb-4 p-2.5 bg-gray-50 rounded-lg">
                                            <Shield size={14} className="text-green-600" />
                                            <span>Secure encrypted transaction</span>
                                        </div>

                                        {/* Credit Card Form */}
                                        {paymentMethod === 'card' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Card Number</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="cardNumber"
                                                            value={formData.cardNumber}
                                                            onChange={handleInputChange}
                                                            className="input-field w-full pl-10"
                                                            placeholder="1234 5678 9012 3456"
                                                            required={paymentMethod === 'card'}
                                                        />
                                                        <CreditCard size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Name on Card</label>
                                                    <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="input-field w-full" required={paymentMethod === 'card'} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3">
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Expiry</label>
                                                        <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} className="input-field w-full" placeholder="MM/YY" required={paymentMethod === 'card'} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">CVV</label>
                                                        <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} className="input-field w-full" placeholder="123" required={paymentMethod === 'card'} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mobile Money Form */}
                                        {paymentMethod === 'mobile_money' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Provider</label>
                                                    <select name="mobileMoneyProvider" value={formData.mobileMoneyProvider} onChange={handleInputChange} className="input-field w-full" required={paymentMethod === 'mobile_money'}>
                                                        <option value="">Select Provider</option>
                                                        <option value="mtn-momo">MTN Mobile Money</option>
                                                        <option value="vodafone-cash">Vodafone Cash</option>
                                                        <option value="airtel-tigo">AirtelTigo Money</option>
                                                        <option value="m-pesa">M-Pesa</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="mobileMoneyNumber"
                                                        value={formData.mobileMoneyNumber}
                                                        onChange={handleInputChange}
                                                        className="input-field w-full"
                                                        placeholder="+233 50 123 4567"
                                                        required={paymentMethod === 'mobile_money'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Account Name</label>
                                                    <input type="text" name="mobileMoneyName" value={formData.mobileMoneyName} onChange={handleInputChange} className="input-field w-full" placeholder="John Doe" required={paymentMethod === 'mobile_money'} />
                                                </div>
                                            </div>
                                        )}

                                        {/* PayPal Form */}
                                        {paymentMethod === 'paypal' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">PayPal Email</label>
                                                    <input
                                                        type="email"
                                                        name="paypalEmail"
                                                        value={formData.paypalEmail}
                                                        onChange={handleInputChange}
                                                        className="input-field w-full"
                                                        placeholder="your@email.com"
                                                        required={paymentMethod === 'paypal'}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        {/* Bank Transfer Form */}
                                        {paymentMethod === 'bank' && (
                                            <div className="space-y-3">
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        name="bankName"
                                                        value={formData.bankName}
                                                        onChange={handleInputChange}
                                                        className="input-field w-full"
                                                        placeholder="e.g., First National Bank"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Account Name</label>
                                                    <input
                                                        type="text"
                                                        name="accountName"
                                                        value={formData.accountName}
                                                        onChange={handleInputChange}
                                                        className="input-field w-full"
                                                        placeholder="Name on account"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold uppercase mb-1.5 text-gray-700">Account Number</label>
                                                    <input
                                                        type="text"
                                                        name="accountNumber"
                                                        value={formData.accountNumber}
                                                        onChange={handleInputChange}
                                                        className="input-field w-full"
                                                        placeholder="1234567890"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col gap-2.5">
                                        <button type="button" onClick={() => setStep('shipping')} className="btn-secondary w-full py-3 text-sm">
                                            ← Back
                                        </button>
                                        <button type="submit" className="btn-primary w-full py-3.5 text-sm font-bold" disabled={loading}>
                                            {loading ? 'Processing...' : `Pay ₵${orderTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Order Summary - Sidebar on desktop */}
                    <div className={`lg:col-span-1 ${showOrderSummary ? 'block' : 'hidden lg:block'}`}>
                        <div className="bg-white rounded-xl shadow-sm sticky top-24">
                            <div className="p-4">
                                <h2 className="font-display text-lg mb-4">Order Summary</h2>

                                {/* Cart Items */}
                                <div className="space-y-3 mb-4">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-3">
                                            <div className="w-14 h-14 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                                                <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500">{item.color}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-semibold">₵{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                {/* Totals */}
                                <div className="border-t border-gray-100 pt-3 space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>₵{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">Tax</span>
                                        <span>₵{estimatedTax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t border-gray-200 pt-2 mt-2">
                                        <div className="flex justify-between items-center">
                                            <span className="font-bold">Total</span>
                                            <span className="font-bold text-red-600">₵{orderTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
