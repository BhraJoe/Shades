import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { ChevronRight, CreditCard, Lock, Check } from 'lucide-react';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const navigate = useNavigate();
    const [step, setStep] = useState('shipping');
    const [orderComplete, setOrderComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('card');

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
                    <h1 className="font-display text-3xl mb-4">Your Bag is Empty</h1>
                    <p className="text-gray-500 mb-8 font-light">
                        Add some sunglasses to continue with checkout.
                    </p>
                    <Link to="/shop" className="btn-primary">
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
                    <h1 className="font-display text-3xl mb-4">Order Confirmed!</h1>
                    <p className="text-gray-500 mb-8 font-light">
                        Thank you for your purchase. We have sent a confirmation email with your order details.
                    </p>
                    <p className="text-xs text-gray-400 mb-8">
                        Order #: {orderNumber}
                    </p>
                    <Link to="/shop" className="btn-primary">
                        Continue Shopping
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-[88px] md:pt-[104px] bg-white">
            <div className="bg-gray-50 py-8">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between">
                        <h1 className="section-title">Checkout</h1>
                        <div className="flex items-center gap-2 text-xs tracking-widest uppercase font-light">
                            <Link to="/cart" className="hover:text-red-600">Cart</Link>
                            <ChevronRight size={12} />
                            <span className={step === 'shipping' ? 'text-red-600 font-bold' : 'text-gray-500'}>Shipping</span>
                            <ChevronRight size={12} />
                            <span className={step === 'payment' ? 'text-red-600 font-bold' : 'text-gray-500'}>Payment</span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit}>
                            {step === 'shipping' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="font-display text-xl mb-6">Contact Information</h2>
                                        <div>
                                            <label className="block text-xs font-bold tracking-widest uppercase mb-2">Email</label>
                                            <input
                                                type="email"
                                                name="email"
                                                value={formData.email}
                                                onChange={handleInputChange}
                                                className="input-field"
                                                placeholder="your@email.com"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div>
                                        <h2 className="font-display text-xl mb-6">Shipping Address</h2>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">First Name</label>
                                                <input type="text" name="firstName" value={formData.firstName} onChange={handleInputChange} className="input-field" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Last Name</label>
                                                <input type="text" name="lastName" value={formData.lastName} onChange={handleInputChange} className="input-field" required />
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Address</label>
                                                <input type="text" name="address" value={formData.address} onChange={handleInputChange} className="input-field" required />
                                            </div>
                                            <div>
                                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">City</label>
                                                <input type="text" name="city" value={formData.city} onChange={handleInputChange} className="input-field" required />
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">State</label>
                                                    <input type="text" name="state" value={formData.state} onChange={handleInputChange} className="input-field" required />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">ZIP Code</label>
                                                    <input type="text" name="zip" value={formData.zip} onChange={handleInputChange} className="input-field" required />
                                                </div>
                                            </div>
                                            <div className="sm:col-span-2">
                                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Country</label>
                                                <select name="country" value={formData.country} onChange={handleInputChange} className="input-field" required>
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
                                                    {/* West Africa */}
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
                                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">Phone</label>
                                                <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="input-field" placeholder="+1 (555) 000-0000" />
                                            </div>
                                        </div>
                                    </div>

                                    <button type="submit" className="btn-primary w-full sm:w-auto">
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="space-y-8">
                                    <div>
                                        <h2 className="font-display text-xl mb-6">Payment</h2>

                                        {/* Payment Method Selection */}
                                        <div className="mb-6">
                                            <label className="block text-xs font-bold tracking-widest uppercase mb-3">Select Payment Method</label>
                                            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('card')}
                                                    className={`p-4 border rounded-lg text-left transition-all ${paymentMethod === 'card'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <CreditCard size={24} className={`mb-2 ${paymentMethod === 'card' ? 'text-red-600' : 'text-gray-600'}`} />
                                                    <p className="font-medium text-sm">Credit Card</p>
                                                    <p className="text-xs text-gray-500">Visa, MC, Amex</p>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('mobile_money')}
                                                    className={`p-4 border rounded-lg text-left transition-all ${paymentMethod === 'mobile_money'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-6 h-6 mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className={`text-sm font-bold ${paymentMethod === 'mobile_money' ? 'text-red-600' : 'text-gray-600'}`}>M</span>
                                                    </div>
                                                    <p className="font-medium text-sm">Mobile Money</p>
                                                    <p className="text-xs text-gray-500">M-Pesa, MoMo</p>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('paypal')}
                                                    className={`p-4 border rounded-lg text-left transition-all ${paymentMethod === 'paypal'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-6 h-6 mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className={`text-sm font-bold ${paymentMethod === 'paypal' ? 'text-red-600' : 'text-gray-600'}`}>P</span>
                                                    </div>
                                                    <p className="font-medium text-sm">PayPal</p>
                                                    <p className="text-xs text-gray-500">PayPal, Venmo</p>
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => setPaymentMethod('bank')}
                                                    className={`p-4 border rounded-lg text-left transition-all ${paymentMethod === 'bank'
                                                        ? 'border-red-600 bg-red-50'
                                                        : 'border-gray-200 hover:border-gray-300'
                                                        }`}
                                                >
                                                    <div className="w-6 h-6 mb-2 bg-gray-200 rounded-full flex items-center justify-center">
                                                        <span className={`text-sm font-bold ${paymentMethod === 'bank' ? 'text-red-600' : 'text-gray-600'}`}>B</span>
                                                    </div>
                                                    <p className="font-medium text-sm">Bank Transfer</p>
                                                    <p className="text-xs text-gray-500">Direct Deposit</p>
                                                </button>
                                            </div>
                                        </div>

                                        <div className="bg-gray-50 p-4 mb-6">
                                            <p className="text-xs text-gray-600 flex items-center gap-2">
                                                <Lock size={14} className="text-red-600" />
                                                All transactions are secure and encrypted
                                            </p>
                                        </div>

                                        {/* Credit Card Form */}
                                        {paymentMethod === 'card' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Card Number</label>
                                                    <div className="relative">
                                                        <input
                                                            type="text"
                                                            name="cardNumber"
                                                            value={formData.cardNumber}
                                                            onChange={handleInputChange}
                                                            className="input-field pl-12"
                                                            placeholder="1234 5678 9012 3456"
                                                            required={paymentMethod === 'card'}
                                                        />
                                                        <CreditCard size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                                    </div>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Name on Card</label>
                                                    <input type="text" name="cardName" value={formData.cardName} onChange={handleInputChange} className="input-field" required={paymentMethod === 'card'} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4">
                                                    <div>
                                                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Expiry Date</label>
                                                        <input type="text" name="cardExpiry" value={formData.cardExpiry} onChange={handleInputChange} className="input-field" placeholder="MM/YY" required={paymentMethod === 'card'} />
                                                    </div>
                                                    <div>
                                                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">CVV</label>
                                                        <input type="text" name="cardCvv" value={formData.cardCvv} onChange={handleInputChange} className="input-field" placeholder="123" required={paymentMethod === 'card'} />
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Mobile Money Form */}
                                        {paymentMethod === 'mobile_money' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Mobile Money Provider</label>
                                                    <select name="mobileMoneyProvider" value={formData.mobileMoneyProvider} onChange={handleInputChange} className="input-field" required={paymentMethod === 'mobile_money'}>
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
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Phone Number</label>
                                                    <input
                                                        type="tel"
                                                        name="mobileMoneyNumber"
                                                        value={formData.mobileMoneyNumber}
                                                        onChange={handleInputChange}
                                                        className="input-field"
                                                        placeholder="+233 50 123 4567"
                                                        required={paymentMethod === 'mobile_money'}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">Enter the phone number registered with your mobile money account</p>
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Account Holder Name</label>
                                                    <input type="text" name="mobileMoneyName" value={formData.mobileMoneyName} onChange={handleInputChange} className="input-field" placeholder="John Doe" required={paymentMethod === 'mobile_money'} />
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <p className="text-xs text-blue-700">
                                                        <strong>How it works:</strong> You will receive a prompt on your phone to acess my phone to authorize the payment. Enter your PIN to complete the transaction.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* PayPal Form */}
                                        {paymentMethod === 'paypal' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">PayPal Email</label>
                                                    <input
                                                        type="email"
                                                        name="paypalEmail"
                                                        value={formData.paypalEmail}
                                                        onChange={handleInputChange}
                                                        className="input-field"
                                                        placeholder="your@email.com"
                                                        required={paymentMethod === 'paypal'}
                                                    />
                                                    <p className="text-xs text-gray-500 mt-1">We'll send you a PayPal request for the order amount.</p>
                                                </div>
                                                <div className="bg-blue-50 p-4 rounded-lg">
                                                    <p className="text-xs text-blue-700">
                                                        <strong>How it works:</strong> You will receive a payment request via PayPal. Complete the payment using your PayPal balance or linked bank card.
                                                    </p>
                                                </div>
                                            </div>
                                        )}

                                        {/* Bank Transfer Form */}
                                        {paymentMethod === 'bank' && (
                                            <div className="space-y-4">
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Bank Name</label>
                                                    <input
                                                        type="text"
                                                        name="bankName"
                                                        value={formData.bankName}
                                                        onChange={handleInputChange}
                                                        className="input-field"
                                                        placeholder="e.g., First National Bank"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Account Name</label>
                                                    <input
                                                        type="text"
                                                        name="accountName"
                                                        value={formData.accountName}
                                                        onChange={handleInputChange}
                                                        className="input-field"
                                                        placeholder="Name on the account"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Account Number</label>
                                                    <input
                                                        type="text"
                                                        name="accountNumber"
                                                        value={formData.accountNumber}
                                                        onChange={handleInputChange}
                                                        className="input-field"
                                                        placeholder="1234567890"
                                                        required={paymentMethod === 'bank'}
                                                    />
                                                </div>
                                                <div className="bg-yellow-50 p-4 rounded-lg">
                                                    <p className="text-xs text-yellow-700">
                                                        <strong>Important:</strong> After placing your order, you will receive bank transfer instructions via email. Your order will be processed once payment is confirmed.
                                                    </p>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex gap-4">
                                        <button type="button" onClick={() => setStep('shipping')} className="btn-secondary">
                                            Back
                                        </button>
                                        <button type="submit" className="btn-primary flex-1" disabled={loading}>
                                            {loading ? 'Processing...' : `Place Order - ₵${orderTotal.toFixed(2)}`}
                                        </button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-[120px] bg-white border border-gray-200 p-6">
                            <h2 className="font-display text-xl mb-6">Order Summary</h2>

                            <div className="space-y-4 mb-6">
                                {cart.map((item) => (
                                    <div key={`${item.id}-${item.color}-${item.size}`} className="flex gap-4">
                                        <div className="w-16 h-16 bg-gray-100 flex-shrink-0">
                                            <img src={item.image || item.images?.[0]} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-xs font-medium">{item.name}</p>
                                            <p className="text-[10px] text-gray-500">{item.color}</p>
                                            <p className="text-[10px] text-gray-500">Qty: {item.quantity}</p>
                                        </div>
                                        <p className="text-xs">₵{(item.price * item.quantity).toFixed(2)}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t pt-4 space-y-2">
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-light">Subtotal</span>
                                    <span>₵{cartTotal.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-light">Shipping</span>
                                    <span>{shipping === 0 ? 'FREE' : `₵${shipping.toFixed(2)}`}</span>
                                </div>
                                <div className="flex justify-between text-xs">
                                    <span className="text-gray-600 font-light">Tax</span>
                                    <span>₵{estimatedTax.toFixed(2)}</span>
                                </div>
                                <div className="border-t pt-2">
                                    <div className="flex justify-between font-medium text-lg">
                                        <span>Total</span>
                                        <span>₵{orderTotal.toFixed(2)}</span>
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
