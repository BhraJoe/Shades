import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronDown, CreditCard, Check, ShoppingBag, ArrowLeft, Lock } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState('shipping');
    const [orderComplete, setOrderComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formErrors, setFormErrors] = useState({});

    const shipping = cartTotal >= 150 ? 0 : 7.95;
    const estimatedTax = cartTotal * 0.08;
    const orderTotal = cartTotal + shipping + estimatedTax;

    const [formData, setFormData] = useState({
        email: '', firstName: '', lastName: '', address: '', city: '', state: '', zip: '',
        country: 'GH', phone: '', cardNumber: '', cardName: '', cardExpiry: '', cardCvv: '',
        mobileMoneyNumber: '', mobileMoneyProvider: '', mobileMoneyName: '', paypalEmail: '',
        bankName: '', accountNumber: '', accountName: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (formErrors[name]) {
            setFormErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validateForm = () => {
        const errors = {};
        if (step === 'shipping') {
            if (!formData.email) errors.email = 'Email is required';
            if (!formData.firstName) errors.firstName = 'First name is required';
            if (!formData.lastName) errors.lastName = 'Last name is required';
            if (!formData.address) errors.address = 'Address is required';
            if (!formData.city) errors.city = 'City is required';
            if (!formData.state) errors.state = 'State is required';
            if (!formData.zip) errors.zip = 'ZIP code is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (step === 'shipping') {
            if (validateForm()) {
                setStep('payment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            setLoading(true);
            setTimeout(() => {
                setOrderNumber('ORD-' + Date.now().toString().slice(-8));
                setOrderComplete(true);
                clearCart();
                setLoading(false);
            }, 2000);
        }
    };

    const paymentMethods = [
        { id: 'card', name: 'Card' },
        { id: 'mobile_money', name: 'Mobile' },
        { id: 'paypal', name: 'PayPal' },
        { id: 'bank', name: 'Bank' },
    ];

    const countries = [
        { code: 'GH', name: 'Ghana' },
        { code: 'US', name: 'United States' },
        { code: 'CA', name: 'Canada' },
        { code: 'UK', name: 'United Kingdom' },
        { code: 'NG', name: 'Nigeria' },
        { code: 'KE', name: 'Kenya' },
        { code: 'ZA', name: 'South Africa' },
        { code: 'AU', name: 'Australia' },
        { code: 'DE', name: 'Germany' },
        { code: 'FR', name: 'France' },
    ];

    if (cart.length === 0 && !orderComplete) {
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

    if (orderComplete) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-sm mx-auto w-full">
                    <div className="w-20 h-20 mx-auto mb-4 bg-green-500 rounded-full flex items-center justify-center">
                        <Check size={40} className="text-white" />
                    </div>
                    <h1 className="font-display text-2xl md:text-3xl mb-2">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-2 font-light text-sm">Thank you for your purchase</p>
                    <p className="text-sm text-gray-400 mb-8">Order #: {orderNumber}</p>
                    <Link to="/shop" className="btn-primary w-full block text-center py-3">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white min-h-screen">
            <div className="pt-32 md:pt-[140px] bg-gray-50">
                {/* Checkout Content */}
                <div className="max-w-7xl mx-auto px-4 md:px-6 pb-6 md:pb-12">
                    <div className="mb-6">
                        <Link to="/cart" className="text-[#0a0a0a] hover:text-[#dc2626] transition-colors duration-200 flex items-center gap-2 text-xs sm:text-sm font-bold tracking-widest uppercase py-2 mb-4 w-fit">
                            <ArrowLeft size={16} />
                            Back to Bag
                        </Link>
                        <h1 className="section-title">Checkout</h1>
                        <p className="text-gray-500 mt-2 md:mt-4 font-light text-sm">{step === 'shipping' ? 'Step 1 of 2' : 'Step 2 of 2'}</p>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                        {/* Form Section */}
                        <div className="lg:col-span-2">
                            <form onSubmit={handleSubmit}>
                                {step === 'shipping' && (
                                    <div className="bg-white border border-gray-200 p-4 sm:p-6">
                                        <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Shipping Address</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 font-light">Email</label>
                                                <input
                                                    type="email" name="email" value={formData.email} onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/20 ${formErrors.email ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                    placeholder="your@email.com" required
                                                />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 font-light">First Name</label>
                                                    <input
                                                        type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/20 ${formErrors.firstName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder="First name" required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 font-light">Last Name</label>
                                                    <input
                                                        type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/20 ${formErrors.lastName ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder="Last name" required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 font-light">Address</label>
                                                <input
                                                    type="text" name="address" value={formData.address} onChange={handleInputChange}
                                                    className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/20 ${formErrors.address ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                    placeholder="Street address" required
                                                />
                                            </div>
                                            <div className="grid grid-cols-3 gap-4">
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 font-light">City</label>
                                                    <input
                                                        type="text" name="city" value={formData.city} onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/20 ${formErrors.city ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder="City" required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 font-light">State</label>
                                                    <input
                                                        type="text" name="state" value={formData.state} onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/20 ${formErrors.state ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder="State" required
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 font-light">ZIP</label>
                                                    <input
                                                        type="text" name="zip" value={formData.zip} onChange={handleInputChange}
                                                        className={`w-full px-4 py-3 border focus:outline-none focus:ring-2 focus:ring-black/20 ${formErrors.zip ? 'border-red-300 bg-red-50' : 'border-gray-200'}`}
                                                        placeholder="ZIP" required
                                                    />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 font-light">Country</label>
                                                <div className="relative">
                                                    <select
                                                        name="country" value={formData.country} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 appearance-none"
                                                        required
                                                    >
                                                        {countries.map(c => (
                                                            <option key={c.code} value={c.code}>{c.name}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                </div>
                                            </div>
                                            <div>
                                                <label className="block text-xs text-gray-500 mb-1 font-light">Phone (Optional)</label>
                                                <input
                                                    type="tel" name="phone" value={formData.phone} onChange={handleInputChange}
                                                    className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                    placeholder="Phone number"
                                                />
                                            </div>
                                        </div>
                                        <button type="submit" className="btn-primary w-full text-center block py-3 sm:py-3.5 text-sm sm:text-base mt-6">
                                            Continue to Payment
                                        </button>
                                    </div>
                                )}

                                {step === 'payment' && (
                                    <div className="bg-white border border-gray-200 p-4 sm:p-6">
                                        <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Payment Method</h2>

                                        {/* Payment Methods */}
                                        <div className="grid grid-cols-4 gap-2 mb-6">
                                            {paymentMethods.map((method) => (
                                                <button
                                                    key={method.id}
                                                    type="button"
                                                    onClick={() => setPaymentMethod(method.id)}
                                                    className={`p-3 border-2 text-center ${paymentMethod === method.id ? 'border-[#0a0a0a] bg-gray-50' : 'border-gray-200'}`}
                                                >
                                                    <p className="text-xs font-semibold">{method.name}</p>
                                                </button>
                                            ))}
                                        </div>

                                        <div className="flex items-center gap-2 text-xs text-gray-500 bg-[#f5f5f5] p-3 rounded mb-4">
                                            <Lock size={14} />
                                            Secure encrypted transaction
                                        </div>

                                        <div className="space-y-4">
                                            {paymentMethod === 'card' && (
                                                <>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-light">Card Number</label>
                                                        <input
                                                            type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                            placeholder="1234 5678 9012 3456" required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-light">Name on Card</label>
                                                        <input
                                                            type="text" name="cardName" value={formData.cardName} onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                            placeholder="Name on card" required
                                                        />
                                                    </div>
                                                    <div className="grid grid-cols-2 gap-4">
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1 font-light">Expiry</label>
                                                            <input
                                                                type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange}
                                                                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                                placeholder="MM/YY" required
                                                            />
                                                        </div>
                                                        <div>
                                                            <label className="block text-xs text-gray-500 mb-1 font-light">CVV</label>
                                                            <input
                                                                type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange}
                                                                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                                placeholder="123" required
                                                            />
                                                        </div>
                                                    </div>
                                                </>
                                            )}
                                            {paymentMethod === 'mobile_money' && (
                                                <>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-light">Provider</label>
                                                        <div className="relative">
                                                            <select
                                                                name="mobileMoneyProvider" value={formData.mobileMoneyProvider} onChange={handleInputChange}
                                                                className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20 appearance-none"
                                                                required
                                                            >
                                                                <option value="">Select Provider</option>
                                                                <option value="mtn">MTN Mobile Money</option>
                                                                <option value="vodafone">Vodafone Cash</option>
                                                                <option value="airteltigo">AirtelTigo</option>
                                                                <option value="mpesa">M-Pesa</option>
                                                            </select>
                                                            <ChevronDown size={20} className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-light">Phone Number</label>
                                                        <input
                                                            type="tel" name="mobileMoneyNumber" value={formData.mobileMoneyNumber} onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                            placeholder="+233 123 456 789" required
                                                        />
                                                    </div>
                                                </>
                                            )}
                                            {paymentMethod === 'paypal' && (
                                                <div>
                                                    <label className="block text-xs text-gray-500 mb-1 font-light">PayPal Email</label>
                                                    <input
                                                        type="email" name="paypalEmail" value={formData.paypalEmail} onChange={handleInputChange}
                                                        className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                        placeholder="your@email.com" required
                                                    />
                                                </div>
                                            )}
                                            {paymentMethod === 'bank' && (
                                                <>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-light">Bank Name</label>
                                                        <input
                                                            type="text" name="bankName" value={formData.bankName} onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                            placeholder="Bank name" required
                                                        />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs text-gray-500 mb-1 font-light">Account Number</label>
                                                        <input
                                                            type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange}
                                                            className="w-full px-4 py-3 border border-gray-200 focus:outline-none focus:ring-2 focus:ring-black/20"
                                                            placeholder="Account number" required
                                                        />
                                                    </div>
                                                </>
                                            )}
                                        </div>

                                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                                            <button type="button" onClick={() => setStep('shipping')} className="px-6 py-3 border border-gray-200 text-[#0a0a0a] hover:bg-gray-50 transition-colors font-medium text-sm sm:text-base">
                                                Back
                                            </button>
                                            <button type="submit" className="flex-1 btn-primary text-center block py-3 sm:py-3.5 text-sm sm:text-base disabled:opacity-70" disabled={loading}>
                                                {loading ? 'Processing...' : `Pay ₵${orderTotal.toFixed(2)}`}
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </form>
                        </div>

                        {/* Order Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-20 bg-white border border-gray-200 p-4 sm:p-6">
                                <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h2>

                                <div className="space-y-3 mb-6">
                                    {cart.map((item) => (
                                        <div key={`${item.id}-${item.color}`} className="flex gap-3">
                                            <div className="w-16 h-16 bg-[#f5f5f5] flex-shrink-0">
                                                <img
                                                    src={item.image || item.images?.[0]}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm truncate">{item.name}</p>
                                                <p className="text-xs text-gray-500 font-light">{item.color} • Qty: {item.quantity}</p>
                                            </div>
                                            <p className="text-sm font-medium">₵{(item.price * item.quantity).toFixed(2)}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="space-y-3 mb-6 border-t border-gray-200 pt-4">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-light">Subtotal</span>
                                        <span>₵{cartTotal.toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-light">Shipping</span>
                                        <span>{shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600 font-light">Tax</span>
                                        <span>₵{estimatedTax.toFixed(2)}</span>
                                    </div>
                                    <div className="border-t pt-3">
                                        <div className="flex justify-between font-medium text-base sm:text-lg">
                                            <span>Total</span>
                                            <span>₵{orderTotal.toFixed(2)}</span>
                                        </div>
                                    </div>
                                </div>

                                {shipping > 0 && (
                                    <div className="bg-[#f5f5f5] p-3 mb-4">
                                        <p className="text-xs text-gray-600 font-light">
                                            Add <span className="font-bold">₵{(150 - cartTotal).toFixed(2)}</span> more for free shipping!
                                        </p>
                                    </div>
                                )}

                                <p className="text-[10px] text-gray-500 text-center mt-4 font-light">
                                    Secure checkout powered by Stripe
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
