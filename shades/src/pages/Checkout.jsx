import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronRight, CreditCard, Lock, Check, ShoppingBag, ArrowLeft } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState('shipping');
    const [orderComplete, setOrderComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');
    const [showOrderSummary, setShowOrderSummary] = useState(true);

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

    // Show/hide order summary on mobile based on scroll
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
            <div className="pt-[88px] md:pt-[104px] min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <ShoppingBag size={40} className="text-gray-400" />
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl mb-4">Your Bag is Empty</h1>
                    <p className="text-gray-500 mb-8 font-light text-sm sm:text-base">
                        Add some sunglasses to continue with checkout.
                    </p>
                    <Link to="/shop" className="btn-primary inline-block">
                        Shop Now
                    </Link>
                </div>
            </div>
        );
    }

    if (orderComplete) {
        return (
            <div className="pt-[88px] md:pt-[104px] min-h-screen bg-white flex items-center justify-center">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 mx-auto mb-6 bg-gray-100 rounded-full flex items-center justify-center">
                        <Check size={40} className="text-red-600" />
                    </div>
                    <h1 className="font-display text-2xl sm:text-3xl mb-4">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8 font-light text-sm sm:text-base">
                        Thank you for your purchase. We have sent a confirmation email with your order details.
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 mb-8">
                        Order #: {orderNumber}
                    </p>
                    <Link to="/shop" className="btn-primary inline-block">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[88px] md:pt-[104px] bg-white min-h-screen">
            {/* Mobile-optimized Header */}
            <div className="bg-white border-b border-gray-100 sticky top-[88px] md:top-[104px] z-40">
                <div className="px-4 py-4 md:py-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            <Link to="/cart" className="lg:hidden p-2 -ml-2">
                                <ArrowLeft size={20} className="text-gray-600" />
                            </Link>
                            <h1 className="font-display text-xl sm:text-2xl">Checkout</h1>
                        </div>
                        {/* Mobile-friendly Progress Steps */}
                        <div className="flex items-center gap-1 sm:gap-2 overflow-x-auto pb-1">
                            <Link to="/cart" className="flex items-center gap-1 text-xs sm:text-sm text-gray-500 hover:text-red-600 whitespace-nowrap">
                                <ShoppingBag size={14} className="sm:size-16" />
                                <span className="hidden sm:inline">Cart</span>
                            </Link>
                            <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
                            <button
                                onClick={() => step === 'payment' && setStep('shipping')}
                                className={`flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap ${step === 'shipping' ? 'text-red-600 font-bold' : 'text-gray-500'}`}
                            >
                                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${step === 'shipping' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>1</span>
                                <span className="hidden sm:inline">Shipping</span>
                            </button>
                            <ChevronRight size={12} className="text-gray-400 flex-shrink-0" />
                            <span className={`flex items-center gap-1 text-xs sm:text-sm whitespace-nowrap ${step === 'payment' ? 'text-red-600 font-bold' : 'text-gray-500'}`}>
                                <span className={`w-5 h-5 sm:w-6 sm:h-6 rounded-full flex items-center justify-center text-[10px] sm:text-xs ${step === 'payment' ? 'bg-red-600 text-white' : 'bg-gray-200'}`}>2</span>
                                <span className="hidden sm:inline">Payment</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-10">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                    {/* Main Form Section */}
                    <div className="lg:col-span-2 order-2 lg:order-1">
                        <form onSubmit={handleSubmit}>
                            {step === 'shipping' && (
                                <div className="space-y-6">
                                    {/* Contact Information */}
                                    <div className="bg-white">
                                        <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Contact Information</h2>
                                        <div className="space-y-4">
                                            <div>
                                                <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Email</label>
                                                <input
                                                    type="email"
                                                    name="email"
                                                    value={formData.email}
                                                    onChange={handleInputChange}
                                                    className="input-field min-h-[48px] text-base"
                                                    placeholder="your@email.com"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    <div className="bg-white">
                                        <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Shipping Address</h2>
                                        <div className="space-y-4">
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">First Name</label>
                                                    <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Last Name</label>
                                                    <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required />
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Address</label>
                                                    <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">City</label>
                                                    <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required />
                                                </div>
                                                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">State</label>
                                                        <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">ZIP Code</label>
                                                        <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required />
                                                    </div>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Country</label>
                                                    <select name="country" value={formData.country} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required>
                                                        <option value="">Select Country</option>
                                                        <option value="United States">United States</option>
                                                        <option value="Canada">Canada</option>
                                                        <option value="United Kingdom">United Kingdom</option>
                                                        <option value="Australia">Australia</option>
                                                        <option value="Germany">Germany</option>
                                                        <option value="France">France</option>
                                                        <option value="Italy">Italy</option>
                                                        <option value="Spain">Spain</option>
                                                        <option value="Netherlands">Netherlands</option>
                                                        <option value="Belgium">Belgium</option>
                                                        <option value="Sweden">Sweden</option>
                                                        <option value="Norway">Norway</option>
                                                        <option value="Denmark">Denmark</option>
                                                        <option value="Finland">Finland</option>
                                                        <option value="Austria">Austria</option>
                                                        <option value="Switzerland">Switzerland</option>
                                                        <option value="Portugal">Portugal</option>
                                                        <option value="Ireland">Ireland</option>
                                                        <option value="New Zealand">New Zealand</option>
                                                        <option value="Japan">Japan</option>
                                                        <option value="South Korea">South Korea</option>
                                                        <option value="Singapore">Singapore</option>
                                                        <option value="Hong Kong">Hong Kong</option>
                                                        <option value="UAE">UAE</option>
                                                        <option value="Saudi Arabia">Saudi Arabia</option>
                                                        <option value="Mexico">Mexico</option>
                                                        <option value="Brazil">Brazil</option>
                                                        <option value="Argentina">Argentina</option>
                                                        <option value="Chile">Chile</option>
                                                        <option value="Colombia">Colombia</option>
                                                        <option value="South Africa">South Africa</option>
                                                        <option value="Egypt">Egypt</option>
                                                        <option value="Israel">Israel</option>
                                                        <option value="India">India</option>
                                                        <option value="China">China</option>
                                                        <option value="Taiwan">Taiwan</option>
                                                        <option value="Thailand">Thailand</option>
                                                        <option value="Vietnam">Vietnam</option>
                                                        <option value="Malaysia">Malaysia</option>
                                                        <option value="Indonesia">Indonesia</option>
                                                        <option value="Philippines">Philippines</option>
                                                        <option value="Poland">Poland</option>
                                                        <option value="Czech Republic">Czech Republic</option>
                                                        <option value="Hungary">Hungary</option>
                                                        <option value="Greece">Greece</option>
                                                        <option value="Turkey">Turkey</option>
                                                        <option value="Russia">Russia</option>
                                                        <option value="Ukraine">Ukraine</option>
                                                        <option value="Romania">Romania</option>
                                                        <option value="Bulgaria">Bulgaria</option>
                                                        <option value="Croatia">Croatia</option>
                                                        <option value="Slovenia">Slovenia</option>
                                                        <option value="Slovakia">Slovakia</option>
                                                        <option value="Luxembourg">Luxembourg</option>
                                                        <option value="Iceland">Iceland</option>
                                                        <option value="Malta">Malta</option>
                                                        <option value="Cyprus">Cyprus</option>
                                                        <option value="Estonia">Estonia</option>
                                                        <option value="Latvia">Latvia</option>
                                                        <option value="Lithuania">Lithuania</option>
                                                        <option value="Nigeria">Nigeria</option>
                                                        <option value="Ghana">Ghana</option>
                                                        <option value="Ivory Coast">Ivory Coast</option>
                                                        <option value="Senegal">Senegal</option>
                                                        <option value="Cameroon">Cameroon</option>
                                                        <option value="Mali">Mali</option>
                                                        <option value="Burkina Faso">Burkina Faso</option>
                                                        <option value="Niger">Niger</option>
                                                        <option value="Guinea">Guinea</option>
                                                        <option value="Togo">Togo</option>
                                                        <option value="Benin">Benin</option>
                                                        <option value="Sierra Leone">Sierra Leone</option>
                                                        <option value="Liberia">Liberia</option>
                                                        <option value="Gambia">Gambia</option>
                                                        <option value="Guinea-Bissau">Guinea-Bissau</option>
                                                        <option value="Mauritania">Mauritania</option>
                                                        <option value="Cape Verde">Cape Verde</option>
                                                    </select>
                                                </div>
                                                <div className="sm:col-span-2">
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Phone</label>
                                                    <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field min-h-[48px] text-base" placeholder="+1 (555) 000-0000" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Continue Button - Full width on mobile */}
                                    <button type="submit" className="btn-primary w-full min-h-[52px] text-base sm:text-lg font-bold">
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="space-y-6">
                                    {/* Payment Section */}
                                    <div className="bg-white">
                                        <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Payment</h2>

                                        {/* Payment Method Selection - Single column on mobile for better touch targets */}
                                        <div className="mb-6">
                                            <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-3 text-gray-700">Select Payment Method</label>
                                            <div className="grid grid-cols-2 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('card')}
                                                    className={`p-4 sm:p-5 border-2 rounded-xl text-left transition-all min-h-[80px] sm:min-h-[90px] ${paymentMethod === 'card'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                >
                                                    <CreditCard size={24} className={`mb-2 ${paymentMethod === 'card' ? 'text-red-600' : 'text-gray-600'}`} />
                                                    <p className="font-semibold text-sm sm:text-base">Credit Card</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block">Visa, MC, Amex</p>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('mobile_money')}
                                                    className={`p-4 sm:p-5 border-2 rounded-xl text-left transition-all min-h-[80px] sm:min-h-[90px] ${paymentMethod === 'mobile_money'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                >
                                                    <div className="w-8 h-8 mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className={`text-sm font-bold ${paymentMethod === 'mobile_money' ? 'text-red-600' : 'text-gray-600'}`}>M</span>
                                                    </div>
                                                    <p className="font-semibold text-sm sm:text-base">Mobile Money</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block">M-Pesa, MoMo</p>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('paypal')}
                                                    className={`p-4 sm:p-5 border-2 rounded-xl text-left transition-all min-h-[80px] sm:min-h-[90px] ${paymentMethod === 'paypal'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                >
                                                    <div className="w-8 h-8 mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className={`text-sm font-bold ${paymentMethod === 'paypal' ? 'text-red-600' : 'text-gray-600'}`}>P</span>
                                                    </div>
                                                    <p className="font-semibold text-sm sm:text-base">PayPal</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block">PayPal, Venmo</p>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('bank')}
                                                    className={`p-4 sm:p-5 border-2 rounded-xl text-left transition-all min-h-[80px] sm:min-h-[90px] ${paymentMethod === 'bank'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300 bg-white'
                                                        }`}
                                                >
                                                    <div className="w-8 h-8 mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className={`text-sm font-bold ${paymentMethod === 'bank' ? 'text-red-600' : 'text-gray-600'}`}>B</span>
                                                    </div>
                                                    <p className="font-semibold text-sm sm:text-base">Bank Transfer</p>
                                                    <p className="text-xs text-gray-500 hidden sm:block">Direct Deposit</p>
                                                </button>
                                            </div>
                                        </div>

                                        {/* Security Notice */}
                                        <div className="bg-gray-50 p-4 mb-6 rounded-lg">
                                            <p className="text-xs sm:text-sm text-gray-600 flex items-center gap-2">
                                                <Lock size={14} className="text-red-600 flex-shrink-0" />
                                                <span>All transactions are secure and encrypted</span>
                                            </p>
                                        </div>

                                        {/* Credit Card Form */}
                                        {paymentMethod === 'card' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Card Number</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="cardNumber"
                                                            value={formData.cardNumber}
                                                            onChange={handleInputChange}
                                                            className="input-field pl-12 min-h-[48px] text-base"
                                                            placeholder="1234 5678 9012 3456"
                                                            required={paymentMethod === 'card'}
                                                        />
                                                        <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Name on Card</label>
                                                    <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required={paymentMethod === 'card'} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Expiry Date</label>
                                                        <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} className="input-field min-h-[48px] text-base" placeholder="MM/YY" required={paymentMethod === 'card'} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">CVV</label>
                                                        <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} className="input-field min-h-[48px] text-base" placeholder="123" required={paymentMethod === 'card'} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mobile Money Form */}
                                        {paymentMethod === 'mobile_money' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Mobile Money Provider</label>
                                                    <select name="mobileMoneyProvider" value={formData.mobileMoneyProvider} onChange={handleInputChange} className="input-field min-h-[48px] text-base" required={paymentMethod === 'mobile_money'}>
                                                        <option value="">Select Provider</option>
                                                        <option value="mtn-momo">MTN Mobile Money (Ghana)</option>
                                                        <option value="vodafone-cash">Vodafone Cash (Ghana)</option>
                                                        <option value="airtel-tigo">AirtelTigo Money (Ghana)</option>
                                                        <option value="m-pesa">M-Pesa</option>
                                                        <option value="airtel-money">Airtel Money</option>
                                                        <option value="orange-money">Orange Money</option>
                                                        <option value="warid">Warid Pesa</option>
                                                        <option value="bima">Bima</option>
                                                        <option value="other">Other</option>
                                                    </select>
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="mobileMoneyNumber"
                                                        value={formData.mobileMoneyNumber}
                                                        onChange={handleInputChange}
                                                        className="input-field min-h-[48px] text-base"
                                                        placeholder="+233 50 123 4567"
                                                        required={paymentMethod === 'mobile_money'}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">Enter the phone number registered with your mobile money account</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Account Holder Name</label>
                                                    <input type="text" name="mobileMoneyName" value={formData.mobileMoneyName} onChange={handleInputChange} className="input-field min-h-[48px] text-base" placeholder="John Doe" required={paymentMethod === 'mobile_money'} />
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-blue-700">
                                                        <strong>How it works:</strong> You will receive a prompt on your phone to authorize the payment. Enter your PIN to complete the transaction.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* PayPal Form */}
                                        {paymentMethod === 'paypal' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">PayPal Email</label>
                                                    <input
                                                        type="email"
                                                        name="paypalEmail"
                                                        value={formData.paypalEmail}
                                                        onChange={handleInputChange}
                                                        className="input-field min-h-[48px] text-base"
                                                        placeholder="your@email.com"
                                                        required={paymentMethod === 'paypal'}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">We'll send you a PayPal request for the order amount.</p>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-blue-700">
                                                        <strong>How it works:</strong> You will receive a payment request via PayPal. Complete the payment using your PayPal balance or linked bank card.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bank Transfer Form */}
                                        {paymentMethod === 'bank' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        name="bankName"
                                                        value={formData.bankName}
                                                        onChange={handleInputChange}
                                                        className="input-field min-h-[48px] text-base"
                                                        placeholder="e.g., First National Bank"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Account Name</label>
                                                    <input
                                                        type="text"
                                                        name="accountName"
                                                        value={formData.accountName}
                                                        onChange={handleInputChange}
                                                        className="input-field min-h-[48px] text-base"
                                                        placeholder="Name on the account"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs sm:text-sm font-bold tracking-wider uppercase mb-2 text-gray-700">Account Number</label>
                                                    <input
                                                        type="text"
                                                        name="accountNumber"
                                                        value={formData.accountNumber}
                                                        onChange={handleInputChange}
                                                        className="input-field min-h-[48px] text-base"
                                                        placeholder="1234567890"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div className="bg-yellow-50 p-4 rounded-lg">
                                                    <p className="text-xs sm:text-sm text-yellow-700">
                                                        <strong>Important:</strong> After placing your order, you will receive bank transfer instructions via email. Your order will be processed once payment is confirmed.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    {/* Action Buttons */}
                                    <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                                        <button type="button" onClick={() => setStep('shipping')} className="btn-secondary min-h-[48px] flex items-center justify-center">
                                            Back
                                        </button>
                                        <button type="submit" className="btn-primary flex-1 min-h-[52px] text-base sm:text-lg font-bold" disabled={loading}>
                                            {loading ? 'Processing...' : `Place Order - ₵${orderTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    {/* Order Summary - Collapsible on mobile */}
                    <div className="lg:col-span-1 order-1 lg:order-2">
                        {/* Mobile Order Summary Toggle */}
                        <button
                            type="button"
                            className="lg:hidden w-full bg-white border border-gray-200 p-4 rounded-lg mb-4 flex items-center justify-between"
                            onClick={() => setShowOrderSummary(!showOrderSummary)}
                        >
                            <span className="font-semibold flex items-center gap-2">
                                <ShoppingBag size={18} />
                                Order Summary ({cart.length} items)
                            </span>
                            <span className="font-bold">₵{orderTotal.toFixed(2)}</span>
                        </button>

                        {/* Order Summary Panel */}
                        <div className={`${showOrderSummary ? 'block' : 'hidden lg:block'}`}>
                            <div className="bg-white border border-gray-200 rounded-lg lg:sticky lg:top-[120px]">
                                <div className="p-4 sm:p-6">
                                    <h2 className="font-display text-lg sm:text-xl mb-4 sm:mb-6">Order Summary</h2>

                                    {/* Cart Items */}
                                    <div className="space-y-4 mb-6">
                                        {cart.map((item) => (
                                            <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-3 sm:gap-4">
                                                <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 flex-shrink-0 rounded-md overflow-hidden">
                                                    <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm sm:text-base font-medium truncate">{item.name}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">{item.color}</p>
                                                    <p className="text-xs sm:text-sm text-gray-500">Qty: {item.quantity}</p>
                                                </div>
                                                <p className="text-sm sm:text-base font-semibold whitespace-nowrap">₵{(item.price * item.quantity).toFixed(2)}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Totals */}
                                    <div className="border-t border-gray-100 pt-4 space-y-3">
                                        <div className="flex justify-between text-sm sm:text-base">
                                            <span className="text-gray-600">Subtotal</span>
                                            <span>₵{cartTotal.toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm sm:text-base">
                                            <span className="text-gray-600">Shipping</span>
                                            <span>{shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}</span>
                                        </div>
                                        <div className="flex justify-between text-sm sm:text-base">
                                            <span className="text-gray-600">Tax (8%)</span>
                                            <span>₵{estimatedTax.toFixed(2)}</span>
                                        </div>
                                        <div className="border-t border-gray-200 pt-3">
                                            <div className="flex justify-between items-center">
                                                <span className="text-base sm:text-lg font-bold">Total</span>
                                                <span className="text-lg sm:text-xl font-bold text-red-600">₵{orderTotal.toFixed(2)}</span>
                                            </div>
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
