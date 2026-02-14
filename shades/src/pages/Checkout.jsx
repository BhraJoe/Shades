import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronDown, CreditCard, Check, ArrowLeft, Lock, Truck } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const [step, setStep] = useState('shipping');
    const [orderComplete, setOrderComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [formErrors, setFormErrors] = useState({});

    const shipping = cartTotal >= 150 ? 0 : 7.95;
    const estimatedTax = 0;
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

    const inputClasses = (fieldName) =>
        `w-full px-4 py-3.5 border bg-transparent text-sm focus:outline-none transition-colors ${formErrors[fieldName]
            ? 'border-[#dc2626]/50 bg-[#dc2626]/5'
            : 'border-gray-200 focus:border-[#0a0a0a]'
        }`;

    // ════════════════════════════════════════════
    // Empty Cart State
    // ════════════════════════════════════════════
    if (cart.length === 0 && !orderComplete) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen flex items-center justify-center px-4">
                <div className="text-center max-w-sm mx-auto w-full">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-50 rounded-full flex items-center justify-center">
                        <Truck size={28} className="text-gray-300" />
                    </div>
                    <h1 className="font-display text-3xl md:text-4xl tracking-wider mb-4">Your Bag is Empty</h1>
                    <p className="text-gray-400 mb-8 font-light text-sm">
                        Looks like you haven't added any sunglasses yet.
                    </p>
                    <Link to="/shop" className="block w-full py-4 bg-[#0a0a0a] text-white text-center text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════
    // Order Complete State
    // ════════════════════════════════════════════
    if (orderComplete) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen bg-[#0a0a0a] flex items-center justify-center px-4">
                <div className="text-center max-w-sm mx-auto w-full">
                    <div className="w-20 h-20 mx-auto mb-6 bg-emerald-500 rounded-full flex items-center justify-center animate-fade-in">
                        <Check size={36} className="text-white" />
                    </div>
                    <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-3">Order Confirmed!</h1>
                    <p className="text-white/50 mb-2 font-light text-sm">Thank you for your purchase</p>
                    <p className="text-white/30 text-xs tracking-[0.15em] mb-10">Order #: {orderNumber}</p>
                    <Link to="/shop" className="block w-full py-4 bg-white text-[#0a0a0a] text-center text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] hover:text-white transition-colors duration-300">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // ════════════════════════════════════════════
    // Checkout Form
    // ════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-white">
            {/* ════════════════════════════════════════════
                Dark Header with Step Indicator
            ════════════════════════════════════════════ */}
            <div className="pt-20 md:pt-[104px] bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                    <Link to="/cart" className="inline-flex items-center gap-2 text-white/40 hover:text-[#dc2626] transition-colors text-xs font-bold tracking-[0.15em] uppercase mb-6">
                        <ArrowLeft size={14} /> Back to Bag
                    </Link>
                    <h1 className="font-display text-4xl md:text-5xl text-white tracking-wider mb-6">Checkout</h1>

                    {/* Step Indicator */}
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'shipping' ? 'bg-[#dc2626] text-white' : 'bg-white text-[#0a0a0a]'
                                }`}>
                                {step === 'payment' ? <Check size={14} /> : '1'}
                            </div>
                            <span className={`text-xs font-bold tracking-[0.1em] uppercase ${step === 'shipping' ? 'text-white' : 'text-white/40'
                                }`}>Shipping</span>
                        </div>
                        <div className="w-12 h-px bg-white/20" />
                        <div className="flex items-center gap-2">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold ${step === 'payment' ? 'bg-[#dc2626] text-white' : 'bg-white/10 text-white/30'
                                }`}>
                                2
                            </div>
                            <span className={`text-xs font-bold tracking-[0.1em] uppercase ${step === 'payment' ? 'text-white' : 'text-white/30'
                                }`}>Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ════════════════════════════════════════════
                Form + Summary Grid
            ════════════════════════════════════════════ */}
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
                    {/* Form */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {step === 'shipping' && (
                                <div className="space-y-5">
                                    <h2 className="font-display text-2xl tracking-wider mb-2">Shipping Address</h2>

                                    <div>
                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Email</label>
                                        <input type="email" name="email" value={formData.email} onChange={handleInputChange} className={inputClasses('email')} placeholder="your@email.com" required />
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">First Name</label>
                                            <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className={inputClasses('firstName')} placeholder="First name" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Last Name</label>
                                            <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className={inputClasses('lastName')} placeholder="Last name" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Address</label>
                                        <input type="text" name="address" value={formData.address} onChange={handleInputChange} className={inputClasses('address')} placeholder="Street address" required />
                                    </div>

                                    <div className="grid grid-cols-3 gap-4">
                                        <div>
                                            <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">City</label>
                                            <input type="text" name="city" value={formData.city} onChange={handleInputChange} className={inputClasses('city')} placeholder="City" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">State</label>
                                            <input type="text" name="state" value={formData.state} onChange={handleInputChange} className={inputClasses('state')} placeholder="State" required />
                                        </div>
                                        <div>
                                            <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">ZIP</label>
                                            <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className={inputClasses('zip')} placeholder="ZIP" required />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Country</label>
                                        <div className="relative">
                                            <select name="country" value={formData.country} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors appearance-none" required>
                                                {countries.map(c => (
                                                    <option key={c.code} value={c.code}>{c.name}</option>
                                                ))}
                                            </select>
                                            <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-400">Phone (Optional)</label>
                                        <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="Phone number" />
                                    </div>

                                    <button type="submit" className="w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300 mt-4">
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="space-y-5">
                                    <h2 className="font-display text-2xl tracking-wider mb-2">Payment Method</h2>

                                    {/* Method Tabs */}
                                    <div className="grid grid-cols-4 gap-2">
                                        {paymentMethods.map((method) => (
                                            <button
                                                key={method.id}
                                                type="button"
                                                onClick={() => setPaymentMethod(method.id)}
                                                className={`p-3 border-2 text-center text-xs font-bold tracking-[0.1em] uppercase transition-all duration-200 ${paymentMethod === method.id
                                                    ? 'border-[#0a0a0a] bg-[#0a0a0a] text-white'
                                                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                                                    }`}
                                            >
                                                {method.name}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex items-center gap-2 text-xs text-gray-400 bg-gray-50 p-3">
                                        <Lock size={14} />
                                        Secure encrypted transaction
                                    </div>

                                    <div className="space-y-4">
                                        {paymentMethod === 'card' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Card Number</label>
                                                    <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="1234 5678 9012 3456" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Name on Card</label>
                                                    <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="Name on card" required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Expiry</label>
                                                        <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="MM/YY" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">CVV</label>
                                                        <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="123" required />
                                                    </div>
                                                </div>
                                            </>
                                        )}
                                        {paymentMethod === 'mobile_money' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Provider</label>
                                                    <div className="relative">
                                                        <select name="mobileMoneyProvider" value={formData.mobileMoneyProvider} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors appearance-none" required>
                                                            <option value="">Select Provider</option>
                                                            <option value="mtn">MTN Mobile Money</option>
                                                            <option value="vodafone">Vodafone Cash</option>
                                                            <option value="airteltigo">AirtelTigo</option>
                                                            <option value="mpesa">M-Pesa</option>
                                                        </select>
                                                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Phone Number</label>
                                                    <input type="tel" name="mobileMoneyNumber" value={formData.mobileMoneyNumber} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="+233 123 456 789" required />
                                                </div>
                                            </>
                                        )}
                                        {paymentMethod === 'paypal' && (
                                            <div>
                                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">PayPal Email</label>
                                                <input type="email" name="paypalEmail" value={formData.paypalEmail} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="your@email.com" required />
                                            </div>
                                        )}
                                        {paymentMethod === 'bank' && (
                                            <>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Bank Name</label>
                                                    <input type="text" name="bankName" value={formData.bankName} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="Bank name" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Account Number</label>
                                                    <input type="text" name="accountNumber" value={formData.accountNumber} onChange={handleInputChange} className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors" placeholder="Account number" required />
                                                </div>
                                            </>
                                        )}
                                    </div>

                                    <div className="flex flex-col sm:flex-row gap-3 mt-4">
                                        <button
                                            type="button"
                                            onClick={() => setStep('shipping')}
                                            className="px-8 py-4 border border-gray-200 text-sm font-bold tracking-[0.15em] uppercase text-[#0a0a0a] hover:border-[#0a0a0a] transition-colors"
                                        >
                                            Back
                                        </button>
                                        <button
                                            type="submit"
                                            className="flex-1 py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300 disabled:opacity-50"
                                            disabled={loading}
                                        >
                                            {loading ? 'Processing...' : `Pay ₵${orderTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* ════════════════════════════════════════════
                        Order Summary Sidebar
                    ════════════════════════════════════════════ */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-28 bg-[#fafafa] p-6">
                            <h2 className="font-display text-xl tracking-wider mb-6">Order Summary</h2>

                            <div className="space-y-3 mb-6">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.color}`} className="flex gap-3">
                                        <div className="w-16 h-16 bg-white flex-shrink-0 overflow-hidden">
                                            <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm truncate font-medium">{item.name}</p>
                                            <p className="text-xs text-gray-400 font-light">{item.color} • Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-sm font-display tracking-wider">₵{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="space-y-3 border-t border-gray-200 pt-4 mb-6">
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
                                    <span className="text-gray-400 font-light">Tax</span>
                                    <span className="font-medium">₵{estimatedTax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-3">
                                    <div className="flex justify-between font-display text-xl tracking-wider">
                                        <span>Total</span>
                                        <span>₵{orderTotal.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            {shipping > 0 && (
                                <div className="p-3 bg-white text-xs text-gray-500 font-light">
                                    Add <span className="font-bold text-[#dc2626]">₵{(150 - cartTotal).toFixed(2)}</span> more for free shipping
                                </div>
                            )}

                            <p className="text-[10px] text-gray-300 text-center mt-4 tracking-[0.1em]">
                                Secure checkout powered by Stripe
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
