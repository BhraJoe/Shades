import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, Package, Heart, MapPin, LogOut, Trash2, Plus, ArrowLeft, Edit3, Bell, Mail, Eye, MessageSquare, Settings, ChevronRight } from 'lucide-react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export default function Profile() {
    const { user, logout: authLogout, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState({ firstName: '', lastName: '', phone: '' });
    const [orders, setOrders] = useState([]);
    const [wishlist, setWishlist] = useState([]);
    const [addresses, setAddresses] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ firstName: '', lastName: '', address: '', city: '', state: '', zip: '', country: 'GH' });
    const [editing, setEditing] = useState(false);
    const [newsletter, setNewsletter] = useState(false);
    const [recentlyViewed, setRecentlyViewed] = useState([]);
    const [notifications, setNotifications] = useState({ email: true, sms: false, orders: true, promotions: true });
    const [activeTab, setActiveTab] = useState('overview');
    const [selectedOrder, setSelectedOrder] = useState(null);

    useEffect(() => {
        if (!user) return;

        // Load data from localStorage
        const load = (k, s) => {
            const v = localStorage.getItem(`${k}_${user.uid}`);
            if (v) s(JSON.parse(v));
        };
        load(`profile_${user.uid}`, setProfile);
        load(`orders_${user.uid}`, setOrders);
        load(`wishlist_${user.uid}`, setWishlist);
        load(`addresses_${user.uid}`, setAddresses);
        load(`newsletter_${user.uid}`, setNewsletter);
        load(`recentlyViewed_${user.uid}`, setRecentlyViewed);
        load(`notifications_${user.uid}`, setNotifications);

        // Fetch orders from Supabase API
        const fetchUserOrders = async () => {
            if (!user || !user.email) {
                console.log('No user email available for fetching orders');
                return;
            }
            try {
                const response = await axios.get(`${API_BASE}/orders?email=${user.email}`);
                console.log('Orders from API:', response.data);
                if (response.data && response.data.length > 0) {
                    // Add displayNumber to each order based on position
                    const ordersWithDisplayNumber = response.data.map((order, index) => ({
                        ...order,
                        displayNumber: index + 1
                    }));
                    setOrders(ordersWithDisplayNumber);
                    localStorage.setItem(`orders_${user.uid}`, JSON.stringify(ordersWithDisplayNumber));
                }
            } catch (error) {
                console.error('Error fetching orders:', error);
            }
        };
        fetchUserOrders();

        (async () => {
            try {
                const d = await getDoc(doc(db, 'users', user.uid));
                if (d.exists()) {
                    const data = d.data();
                    if (data.profile) { setProfile(data.profile); localStorage.setItem(`profile_${user.uid}`, JSON.stringify(data.profile)); }
                    if (data.orders) { setOrders(data.orders); localStorage.setItem(`orders_${user.uid}`, JSON.stringify(data.orders)); }
                    if (data.wishlist) { setWishlist(data.wishlist); localStorage.setItem(`wishlist_${user.uid}`, JSON.stringify(data.wishlist)); }
                    if (data.addresses) { setAddresses(data.addresses); localStorage.setItem(`addresses_${user.uid}`, JSON.stringify(data.addresses)); }
                    if (data.newsletter !== undefined) { setNewsletter(data.newsletter); localStorage.setItem(`newsletter_${user.uid}`, JSON.stringify(data.newsletter)); }
                    if (data.notifications) { setNotifications(data.notifications); localStorage.setItem(`notifications_${user.uid}`, JSON.stringify(data.notifications)); }
                }
            } catch (e) { console.log(e); }
        })();
    }, [user]);

    const save = async (k, v) => {
        if (!user) return;
        localStorage.setItem(`${k}_${user.uid}`, JSON.stringify(v));
        try { await setDoc(doc(db, 'users', user.uid), { [k]: v }, { merge: true }); } catch (e) { }
    };

    const saveProfile = () => { save('profile', profile); setEditing(false); };
    const addAddress = (e) => {
        e.preventDefault();
        const a = { ...form, id: Date.now() };
        const u = [...addresses, a];
        setAddresses(u);
        save('addresses', u);
        setForm({ firstName: '', lastName: '', address: '', city: '', state: '', zip: '', country: 'GH' });
        setShowForm(false);
    };
    const removeAddress = (id) => { const u = addresses.filter(a => a.id !== id); setAddresses(u); save('addresses', u); };
    const removeWishlist = (id) => { const u = wishlist.filter(i => i.id !== id); setWishlist(u); save('wishlist', u); };
    const logoutUser = async () => { await authLogout(); navigate('/'); };
    const toggleNewsletter = () => { const v = !newsletter; setNewsletter(v); save('newsletter', v); };
    const toggleNotification = (key) => { const n = { ...notifications, [key]: !notifications[key] }; setNotifications(n); save('notifications', n); };

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#dc2626] mx-auto mb-4"></div>
                    <p className="text-gray-500">Loading...</p>
                </div>
            </div>
        );
    }

    if (!user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-[#dc2626] transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </button>
                    {/* <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">{user.email}</span>
                        <button onClick={logoutUser} className="text-gray-500 hover:text-red-500 transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div> */}
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-4 py-8">
                {/* User Header */}
                <div className="bg-white rounded-2xl p-8 mb-6 shadow-sm">
                    <div className="flex items-center gap-6">
                        <div className="w-20 h-20 bg-[#dc2626] rounded-full flex items-center justify-center">
                            <User className="text-white" size={40} />
                        </div>
                        <div className="flex-1">
                            <div className="flex items-center gap-3">
                                <h1 className="text-2xl font-bold text-gray-800">{profile.firstName || 'Welcome'} {profile.lastName}</h1>
                                <button onClick={() => setEditing(!editing)} className="text-gray-400 hover:text-[#dc2626]">
                                    <Edit3 size={18} />
                                </button>
                            </div>
                            <p className="text-gray-500">{user.email}</p>
                            {profile.phone && <p className="text-gray-600 mt-1">{profile.phone}</p>}
                        </div>
                    </div>

                    {editing && (
                        <div className="mt-6 pt-6 border-t border-gray-100 grid grid-cols-1 md:grid-cols-3 gap-4">
                            <input type="text" placeholder="First Name" value={profile.firstName} onChange={(e) => setProfile({ ...profile, firstName: e.target.value })}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#dc2626] focus:outline-none" />
                            <input type="text" placeholder="Last Name" value={profile.lastName} onChange={(e) => setProfile({ ...profile, lastName: e.target.value })}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#dc2626] focus:outline-none" />
                            <input type="tel" placeholder="Phone" value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                                className="px-4 py-2 border border-gray-200 rounded-lg focus:border-[#dc2626] focus:outline-none" />
                            <button onClick={saveProfile} className="md:col-span-3 py-2 bg-[#dc2626] text-white rounded-lg hover:bg-[#b91c1c]">Save Profile</button>
                        </div>
                    )}
                </div>

                {/* Navigation Tabs */}
                <div className="flex gap-2 mb-6 overflow-x-auto">
                    {['overview', 'orders', 'addresses', 'settings'].map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap ${activeTab === tab ? 'bg-[#dc2626] text-white' : 'bg-white text-gray-600 hover:bg-gray-100'}`}>
                            {tab.charAt(0).toUpperCase() + tab.slice(1)}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Orders */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="font-bold text-lg flex items-center gap-2">
                                    <Package className="text-[#dc2626]" size={20} /> Orders
                                </h2>
                                <button onClick={() => setActiveTab('orders')} className="text-[#dc2626] text-sm font-medium hover:underline flex items-center gap-1">
                                    View All <ChevronRight size={16} />
                                </button>
                            </div>
                            {orders.length === 0 ? (
                                <div className="text-center py-6">
                                    <p className="text-gray-400 mb-3">No orders yet</p>
                                    <Link to="/shop" className="text-[#dc2626] font-medium hover:underline">Start shopping</Link>
                                </div>
                            ) : (
                                <div className="space-y-3">
                                    {orders.slice(0, 3).map((o, index) => (
                                        <div key={o.id || o.order_number} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                            <div>
                                                <p className="font-bold text-[#dc2626]">{o.order_number || `Order #${index + 1}`}</p>
                                                <p className="text-xs text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-bold">₵{o.total?.toFixed(2) || '0.00'}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>{o.status}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Recently Viewed */}
                        {recentlyViewed.length > 0 && (
                            <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
                                <div className="flex items-center justify-between mb-4">
                                    <h2 className="font-bold text-lg flex items-center gap-2">
                                        <Eye className="text-[#dc2626]" size={20} /> Recently Viewed
                                    </h2>
                                </div>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {recentlyViewed.slice(0, 4).map(item => (
                                        <Link key={item.id} to={`/product/${item.id}`} className="group">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <img src={item.image || '/images/products/wayfarer.svg'} alt={item.name} className="w-full h-full object-cover" />
                                            </div>
                                            <p className="text-xs font-medium mt-1 truncate group-hover:text-[#dc2626]">{item.name}</p>
                                            <p className="text-[#dc2626] font-bold text-sm">₵{item.price?.toFixed(2) || '0.00'}</p>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Quick Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
                            <h2 className="font-bold text-lg mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <button onClick={() => navigate('/contact')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <MessageSquare className="mx-auto text-[#dc2626] mb-2" size={24} />
                                    <span className="text-sm font-medium">Contact Support</span>
                                </button>
                                <button onClick={() => setActiveTab('settings')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <Settings className="mx-auto text-[#dc2626] mb-2" size={24} />
                                    <span className="text-sm font-medium">Settings</span>
                                </button>
                                <Link to="/shop" className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <Package className="mx-auto text-[#dc2626] mb-2" size={24} />
                                    <span className="text-sm font-medium">Shop Now</span>
                                </Link>
                                <button onClick={() => navigate('/faq')} className="p-4 bg-gray-50 rounded-lg text-center hover:bg-gray-100 transition-colors">
                                    <Bell className="mx-auto text-[#dc2626] mb-2" size={24} />
                                    <span className="text-sm font-medium">FAQ</span>
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Orders Tab */}
                {activeTab === 'orders' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        {selectedOrder ? (
                            <div>
                                <button onClick={() => setSelectedOrder(null)} className="flex items-center gap-2 text-[#dc2626] font-medium mb-4 hover:underline">
                                    <ArrowLeft size={18} /> Back to Orders
                                </button>
                                <h2 className="font-bold text-xl mb-4">Order Details</h2>

                                {/* Order Header */}
                                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                                    <div className="flex justify-between items-start mb-3">
                                        <div>
                                            <p className="font-bold text-[#dc2626] text-lg">{selectedOrder.order_number || `Order #${selectedOrder.displayNumber}`}</p>
                                            <p className="text-sm text-gray-500">{selectedOrder.date ? new Date(selectedOrder.date).toLocaleDateString() : selectedOrder.created_at ? new Date(selectedOrder.created_at).toLocaleDateString() : 'N/A'}</p>
                                        </div>
                                        <span className={`px-3 py-1 rounded-full text-sm ${selectedOrder.status === 'delivered' ? 'bg-green-100 text-green-700' : selectedOrder.status === 'processing' ? 'bg-blue-100 text-blue-700' : selectedOrder.status === 'pending_payment' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                            {selectedOrder.status === 'pending_payment' ? 'Payment Pending' : selectedOrder.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Customer Information */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg mb-3">Customer Information</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">Name</p>
                                            <p className="font-medium">{selectedOrder.customer_name || selectedOrder.shipping_name || selectedOrder.name || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg">
                                            <p className="text-sm text-gray-500 mb-1">Phone</p>
                                            <p className="font-medium">{selectedOrder.shipping_phone || selectedOrder.phone || 'N/A'}</p>
                                        </div>
                                        <div className="p-4 bg-gray-50 rounded-lg md:col-span-2">
                                            <p className="text-sm text-gray-500 mb-1">Email</p>
                                            <p className="font-medium">{selectedOrder.customer_email || selectedOrder.email || 'N/A'}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Shipping Address */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg mb-3">Shipping Address</h3>
                                    <div className="p-4 bg-gray-50 rounded-lg">
                                        <p className="font-medium">{selectedOrder.shipping_address || selectedOrder.address || 'N/A'}</p>
                                        <p className="text-gray-500">{selectedOrder.shipping_city ? `${selectedOrder.shipping_city}, ${selectedOrder.shipping_state || ''} ${selectedOrder.shipping_zip || ''}` : 'N/A'}</p>
                                        <p className="text-gray-500">{selectedOrder.shipping_country || 'Ghana'}</p>
                                    </div>
                                </div>

                                {/* Order Items */}
                                <div className="mb-4">
                                    <h3 className="font-bold text-lg mb-3">Order Items</h3>
                                    <div className="space-y-3">
                                        {selectedOrder.items && selectedOrder.items.length > 0 ? (
                                            selectedOrder.items.map((item, idx) => (
                                                <div key={idx} className="p-4 border border-gray-200 rounded-lg flex items-center gap-4">
                                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center overflow-hidden">
                                                        {item.image ? (
                                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                                        ) : (
                                                            <Package className="text-gray-400" size={24} />
                                                        )}
                                                    </div>
                                                    <div className="flex-1">
                                                        <p className="font-medium">{item.name || 'Product'}</p>
                                                        <p className="text-sm text-gray-500">Qty: {item.quantity || 1}</p>
                                                    </div>
                                                    <p className="font-bold">₵{((item.price || 0) * (item.quantity || 1)).toFixed(2)}</p>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="text-gray-500">No items found</p>
                                        )}
                                    </div>
                                </div>

                                {/* Order Summary */}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Subtotal</span>
                                        <span>₵{(selectedOrder.subtotal || selectedOrder.total || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Shipping</span>
                                        <span>₵{(selectedOrder.shipping || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between mb-2">
                                        <span className="text-gray-600">Tax</span>
                                        <span>₵{(selectedOrder.tax || 0).toFixed(2)}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-lg pt-2 border-t">
                                        <span>Total</span>
                                        <span className="text-[#dc2626]">₵{(selectedOrder.total || selectedOrder.subtotal || 0).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <>
                                <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                    <Package className="text-[#dc2626]" size={20} /> My Orders
                                </h2>
                                {orders.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Package className="mx-auto text-gray-300 mb-4" size={48} />
                                        <p className="text-gray-400 mb-3">No orders yet</p>
                                        <Link to="/shop" className="text-[#dc2626] font-medium hover:underline">Start shopping</Link>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {orders.map((o, index) => (
                                            <div key={o.id || o.order_number} className="p-4 border border-gray-200 rounded-lg">
                                                <div className="flex justify-between items-start mb-3">
                                                    <div>
                                                        <p className="font-bold text-[#dc2626] text-lg">{o.order_number || `Order #${index + 1}`}</p>
                                                        <p className="text-sm text-gray-500">{o.created_at ? new Date(o.created_at).toLocaleDateString() : 'N/A'}</p>
                                                    </div>
                                                    <span className={`px-3 py-1 rounded-full text-sm ${o.status === 'delivered' ? 'bg-green-100 text-green-700' : o.status === 'processing' ? 'bg-blue-100 text-blue-700' : o.status === 'pending_payment' ? 'bg-orange-100 text-orange-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                        {o.status === 'pending_payment' ? 'Payment Pending' : o.status}
                                                    </span>
                                                </div>
                                                <div className="flex justify-between items-center">
                                                    <p className="font-bold text-lg">₵{o.total?.toFixed(2) || '0.00'}</p>
                                                    <button onClick={() => setSelectedOrder(o)} className="text-[#dc2626] text-sm font-medium hover:underline flex items-center gap-1">
                                                        <Eye size={16} /> View Details
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </>
                        )}
                    </div>
                )}

                {/* Addresses Tab */}
                {activeTab === 'addresses' && (
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <MapPin className="text-[#dc2626]" size={20} /> Saved Addresses
                            </h2>
                            <button onClick={() => setShowForm(!showForm)} className="text-[#dc2626] text-sm font-medium hover:underline">
                                {showForm ? 'Cancel' : '+ Add Address'}
                            </button>
                        </div>
                        {showForm && (
                            <form onSubmit={addAddress} className="mb-6 p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                                <input type="text" placeholder="Phone" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                                <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="col-span-2 px-3 py-2 border rounded-lg text-sm" required />
                                <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                                <input type="text" placeholder="State/Region" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                                <input type="text" placeholder="ZIP Code" value={form.zip} onChange={(e) => setForm({ ...form, zip: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" />
                                <button type="submit" className="col-span-2 py-2 bg-[#dc2626] text-white rounded-lg text-sm">Save Address</button>
                            </form>
                        )}
                        {addresses.length === 0 ? (
                            <p className="text-gray-400 text-center py-8">No addresses saved</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {addresses.map(a => (
                                    <div key={a.id} className="p-4 bg-gray-50 rounded-lg flex justify-between group">
                                        <div>
                                            <p className="font-medium">{a.firstName}</p>
                                            <p className="text-sm text-gray-500">{a.address}</p>
                                            <p className="text-sm text-gray-500">{a.city}, {a.state} {a.zip}</p>
                                        </div>
                                        <button onClick={() => removeAddress(a.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity h-fit">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Settings Tab */}
                {activeTab === 'settings' && (
                    <div className="space-y-6">
                        {/* Newsletter */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Mail className="text-[#dc2626]" size={20} /> Newsletter
                            </h2>
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="font-medium">Subscribe to newsletter</p>
                                    <p className="text-sm text-gray-500">Get updates on new products and promotions</p>
                                </div>
                                <button onClick={toggleNewsletter} className={`w-12 h-6 rounded-full transition-colors ${newsletter ? 'bg-[#dc2626]' : 'bg-gray-300'}`}>
                                    <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${newsletter ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                </button>
                            </div>
                        </div>

                        {/* Notifications */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
                                <Bell className="text-[#dc2626]" size={20} /> Notification Preferences
                            </h2>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Order Updates</p>
                                        <p className="text-sm text-gray-500">Get notified about order status changes</p>
                                    </div>
                                    <button onClick={() => toggleNotification('orders')} className={`w-12 h-6 rounded-full transition-colors ${notifications.orders ? 'bg-[#dc2626]' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications.orders ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">Promotional Emails</p>
                                        <p className="text-sm text-gray-500">Receive promotional offers and discounts</p>
                                    </div>
                                    <button onClick={() => toggleNotification('promotions')} className={`w-12 h-6 rounded-full transition-colors ${notifications.promotions ? 'bg-[#dc2626]' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications.promotions ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="font-medium">SMS Notifications</p>
                                        <p className="text-sm text-gray-500">Receive SMS for order updates</p>
                                    </div>
                                    <button onClick={() => toggleNotification('sms')} className={`w-12 h-6 rounded-full transition-colors ${notifications.sms ? 'bg-[#dc2626]' : 'bg-gray-300'}`}>
                                        <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-transform ${notifications.sms ? 'translate-x-6' : 'translate-x-0.5'}`} />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Account Actions */}
                        <div className="bg-white rounded-2xl p-6 shadow-sm">
                            <h2 className="font-bold text-lg mb-4">Account</h2>
                            <div className="space-y-3">
                                <button onClick={() => navigate('/forgot-password')} className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center">
                                    <span>Change Password</span>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </button>
                                <button onClick={() => navigate('/contact')} className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors flex justify-between items-center">
                                    <span>Contact Support</span>
                                    <ChevronRight size={18} className="text-gray-400" />
                                </button>
                                <button onClick={logoutUser} className="w-full text-left p-3 bg-red-50 text-red-600 rounded-lg hover:bg-red-100 transition-colors flex justify-between items-center">
                                    <span>Logout</span>
                                    <LogOut size={18} />
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div >
    );
}
