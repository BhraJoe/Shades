import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { auth } from '../firebase';
import { ChevronDown, CreditCard, Check, ArrowLeft, Lock, Truck } from 'lucide-react';
import { initializePaystackPayment, generatePaymentReference, convertToSmallestUnit, isPaystackAvailable } from '../paystack';

export default function Checkout() {
    const { cart, cartTotal, clearCart } = useCart();
    const { user, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [step, setStep] = useState('shipping');
    const [orderComplete, setOrderComplete] = useState(false);
    const [loading, setLoading] = useState(false);
    const [orderNumber, setOrderNumber] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('paystack');
    const [formErrors, setFormErrors] = useState({});
    const [paymentRef, setPaymentRef] = useState('');
    const [searchParams] = useSearchParams();

    // Check for payment success from Paystack redirect
    const paymentStatus = searchParams.get('payment');
    const paymentRefFromUrl = searchParams.get('reference') || searchParams.get('ref') || searchParams.get('trxref');

    const shipping = 0; // Always free shipping
    const estimatedTax = 0;
    const orderTotal = cartTotal + shipping + estimatedTax;

    // Redirect to login if not authenticated
    useEffect(() => {
        if (!authLoading && !user) {
            navigate('/login', { state: { from: '/checkout', message: 'Please login to complete your checkout' } });
        }
    }, [user, authLoading, navigate]);

    // Check for payment success and verify
    useEffect(() => {
        console.log('Payment redirect detected:', { paymentStatus, paymentRefFromUrl, paymentRef, user, authLoading });

        // Restore form data from localStorage if available
        const savedFormData = localStorage.getItem('checkout_form_data');
        if (savedFormData) {
            try {
                const parsed = JSON.parse(savedFormData);
                setFormData(prev => ({ ...prev, ...parsed }));
                console.log('Restored form data from localStorage');
            } catch (e) {
                console.error('Error restoring form data:', e);
            }
        }

        // Wait for auth to load before processing payment
        if (authLoading) {
            console.log('Auth still loading, waiting...');
            return;
        }

        // If no user after auth loads, redirect to login
        if (!user && !authLoading) {
            console.log('No user found after payment redirect');
            navigate('/login', { state: { from: '/checkout', message: 'Please login to complete your order' } });
            return;
        }

        const ref = paymentRefFromUrl || paymentRef;
        if (paymentStatus === 'success' && ref) {
            verifyPaystackPayment(ref);
        }
    }, [paymentStatus, paymentRef, paymentRefFromUrl, user, authLoading, navigate]);

    // Verify Paystack payment
    const verifyPaystackPayment = async (ref) => {
        console.log('Verifying payment for reference:', ref);
        setLoading(true);
        try {
            const response = await fetch(`/api/paystack/verify/${ref}`);
            const data = await response.json();
            console.log('Payment verification response:', data);

            if (data.verified) {
                // Payment successful, complete the order
                completeOrder(ref);
            } else {
                // Check if it's a pending mobile money transaction
                if (data.status === 'pending' || data.status === 'send_otp') {
                    alert('Payment is being processed. You will receive an OTP on your mobile money account. Please complete the payment and try again, or contact support.');
                } else {
                    alert(`Payment verification failed: ${data.message || 'Please contact support.'}`);
                }
                setLoading(false);
            }
        } catch (error) {
            console.error('Payment verification error:', error);
            alert('Error verifying payment. Please contact support.');
            setLoading(false);
        }
    };

    // Complete the order after successful payment
    const completeOrder = async (paymentReference = null) => {
        console.log('completeOrder called with paymentReference:', paymentReference, 'user:', user);

        const newOrderNumber = 'ORD-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        setOrderNumber(newOrderNumber);

        // Even if user is temporarily null after redirect, try to get the current user
        let currentUser = user;
        if (!currentUser && auth) {
            // Try to get current user from Firebase auth
            try {
                const currentAuthUser = auth.currentUser;
                if (currentAuthUser) {
                    currentUser = { uid: currentAuthUser.uid, email: currentAuthUser.email };
                    console.log('Got user from auth.currentUser:', currentUser);
                }
            } catch (e) {
                console.error('Error getting current user:', e);
            }
        }

        if (!currentUser) {
            console.error('No user available for order - saving order reference for later recovery');
            // Save order reference to localStorage so it can be recovered after login
            const pendingOrderRef = {
                orderNumber: newOrderNumber,
                paymentReference,
                timestamp: Date.now()
            };
            localStorage.setItem('pending_order', JSON.stringify(pendingOrderRef));
            alert('Order payment verified but session expired. Please log in to complete your order.');
            navigate('/login', { state: { from: '/profile', message: 'Your order was completed but please log in to view it' } });
            return;
        }

        if (currentUser) {
            const order = {
                order_number: newOrderNumber,
                date: new Date().toISOString(),
                status: 'processing',
                total: orderTotal,
                paymentMethod: paymentMethod,
                paymentReference: paymentReference,
                customer_email: currentUser.email,
                customer_name: `${formData.firstName} ${formData.lastName}`,
                shipping_address: formData.address,
                shipping_city: formData.city,
                shipping_state: formData.state,
                shipping_zip: formData.zip,
                shipping_country: formData.country,
                shipping_phone: formData.phone,
                items: cart.map(item => ({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    quantity: item.quantity,
                    image: item.image,
                    color: item.color,
                    size: item.size
                })),
                subtotal: orderTotal,
                shipping: 0,
                tax: 0
            };

            // Save to localStorage for user's order history
            const existingOrders = JSON.parse(localStorage.getItem(`orders_${currentUser.uid}`) || '[]');
            existingOrders.unshift(order);
            localStorage.setItem(`orders_${currentUser.uid}`, JSON.stringify(existingOrders));

            // Save to Supabase database
            try {
                const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
                console.log('Saving order to API:', `${API_BASE}/orders`);
                console.log('Order data:', JSON.stringify(order, null, 2));
                const response = await axios.post(`${API_BASE}/orders`, order);
                console.log('Order saved successfully:', response.data);
            } catch (err) {
                console.error('Error saving order to database:', err);
                console.error('Error response:', err.response?.data);
            }
        }

        clearCart();
        setLoading(false);

        // Redirect to home page after successful payment
        navigate('/', { replace: true });
    };

    // Handle Paystack payment
    const handlePaystackPayment = async () => {
        if (!isPaystackAvailable()) {
            alert('Paystack is not loaded. Please refresh the page and try again.');
            return;
        }

        setLoading(true);

        try {
            // Generate our own reference to track
            const ref = 'ORD-' + Date.now() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
            setPaymentRef(ref);

            // Convert amount to pesewas (smallest currency unit for GHS)
            const amountInKobo = convertToSmallestUnit(orderTotal, 'GHS'); // Ghana Cedis

            // Initialize payment with backend - send our reference
            console.log('Initializing payment with:', {
                email: formData.email,
                amount: amountInKobo,
                currency: 'GHS',
                reference: ref
            });
            const response = await fetch('/api/paystack/initialize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: formData.email,
                    amount: amountInKobo,
                    currency: 'GHS',
                    reference: ref,
                    metadata: {
                        customerName: `${formData.firstName} ${formData.lastName}`,
                        phone: formData.phone,
                        orderTotal: orderTotal
                    }
                })
            });

            const data = await response.json();
            console.log('Payment init response:', data);

            if (data.authorization_url) {
                // Redirect to Paystack payment page
                window.location.href = data.authorization_url;
            } else {
                console.error('Payment init error:', data);
                throw new Error(data.error || 'Failed to initialize payment');
            }
        } catch (error) {
            console.error('Paystack error:', error);

            // Even if payment fails, save the order to database
            if (user) {
                const newOrderNumber = 'ORD-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 6).toUpperCase();
                const order = {
                    order_number: newOrderNumber,
                    date: new Date().toISOString(),
                    status: 'pending_payment',
                    total: orderTotal,
                    paymentMethod: paymentMethod,
                    paymentReference: 'payment_failed',
                    customer_email: user.email,
                    customer_name: `${formData.firstName} ${formData.lastName}`,
                    shipping_address: formData.address,
                    shipping_city: formData.city,
                    shipping_state: formData.state,
                    shipping_zip: formData.zip,
                    shipping_country: formData.country,
                    shipping_phone: formData.phone,
                    items: cart.map(item => ({
                        id: item.id,
                        name: item.name,
                        price: item.price,
                        quantity: item.quantity,
                        image: item.image,
                        color: item.color,
                        size: item.size
                    })),
                    subtotal: orderTotal,
                    shipping: 0,
                    tax: 0
                };

                try {
                    const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
                    await axios.post(`${API_BASE}/orders`, order);
                    alert('Order saved! Payment failed but you can retry payment later.');
                } catch (err) {
                    console.error('Error saving order:', err);
                }
            }

            alert('Payment initialization failed: ' + error.message);
            setLoading(false);
        }
    };

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
            if (!formData.phone) errors.phone = 'Phone number is required for delivery';
            if (!formData.address) errors.address = 'Address is required';
            if (!formData.city) errors.city = 'City is required';
            if (!formData.state) errors.state = 'State is required';
            if (!formData.zip) errors.zip = 'ZIP code is required';
        }
        setFormErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (step === 'shipping') {
            if (validateForm()) {
                // Save form data to localStorage for recovery after payment redirect
                localStorage.setItem('checkout_form_data', JSON.stringify(formData));
                setStep('payment');
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }
        } else {
            // Handle Paystack payment
            if (paymentMethod === 'paystack') {
                await handlePaystackPayment();
                return;
            }

            // Handle other payment methods (mock)
            setLoading(true);
            setTimeout(async () => {
                const newOrderNumber = 'ORD-' + Date.now().toString() + '-' + Math.random().toString(36).substring(2, 8).toUpperCase();
                setOrderNumber(newOrderNumber);
                setOrderComplete(true);

                // Save order to localStorage for logged-in users
                if (user) {
                    const order = {
                        order_number: newOrderNumber,
                        date: new Date().toISOString(),
                        status: 'processing',
                        total: orderTotal,
                        paymentMethod: paymentMethod,
                        customer_email: user.email,
                        customer_name: `${formData.firstName} ${formData.lastName}`,
                        items: cart.map(item => ({
                            id: item.id,
                            name: item.name,
                            price: item.price,
                            quantity: item.quantity,
                            image: item.image
                        })),
                        shipping: {
                            firstName: formData.firstName,
                            lastName: formData.lastName,
                            address: formData.address,
                            city: formData.city,
                            state: formData.state,
                            zip: formData.zip
                        }
                    };

                    const existingOrders = JSON.parse(localStorage.getItem(`orders_${user.uid}`) || '[]');
                    existingOrders.unshift(order);
                    localStorage.setItem(`orders_${user.uid}`, JSON.stringify(existingOrders));

                    // Save to Supabase database
                    try {
                        const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';
                        await axios.post(`${API_BASE}/orders`, order);
                    } catch (err) {
                        console.error('Error saving order to database:', err);
                    }
                }

                clearCart();
                setLoading(false);
                // Redirect to home page after successful payment
                navigate('/', { replace: true });
            }, 2000);
        }
    };

    const paymentMethods = [
        { id: 'paystack', name: 'Paystack (Test Mode)' },
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
                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">Phone <span className="text-red-500">*</span></label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleInputChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                            placeholder="Phone number"
                                            required
                                        />
                                    </div>

                                    <button type="submit" className="w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300 mt-4">
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 'payment' && (
                                <div className="space-y-5">
                                    <h2 className="font-display text-2xl tracking-wider mb-2">Payment</h2>

                                    <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
                                        <div className="flex items-center gap-3 mb-4">
                                            <CreditCard size={24} className="text-blue-600" />
                                            <span className="text-lg font-medium text-blue-800">Paystack Secure Payment</span>
                                        </div>
                                        <p className="text-sm text-blue-600 mb-4">
                                            You'll be redirected to Paystack's secure payment page to complete your purchase using your preferred payment method.
                                        </p>
                                        <div className="flex flex-wrap gap-3 text-xs text-blue-700">
                                            <span className="bg-blue-100 px-3 py-1 rounded-full">💳 Card</span>
                                            <span className="bg-blue-100 px-3 py-1 rounded-full">📱 Mobile Money</span>
                                            <span className="bg-blue-100 px-3 py-1 rounded-full">🏦 Bank Transfer</span>
                                        </div>
                                        {isPaystackAvailable() ? (
                                            <div className="mt-4 text-xs text-emerald-600 flex items-center gap-1">
                                                <Check size={14} /> Paystack is ready
                                            </div>
                                        ) : (
                                            <div className="mt-4 text-xs text-amber-600">
                                                Loading Paystack... Please wait
                                            </div>
                                        )}
                                    </div>

                                    <div className="space-y-4">
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

                            {shipping === 0 && (
                                <div className="p-3 bg-white text-xs text-gray-500 font-light">
                                    Free shipping on all orders
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
