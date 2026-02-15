import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { User, Package, Heart, MapPin, LogOut, Trash2, Plus, ArrowLeft, Edit3 } from 'lucide-react';

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

    useEffect(() => {
        if (!user) return;
        const load = (k, s) => {
            const v = localStorage.getItem(`${k}_${user.uid}`);
            if (v) s(JSON.parse(v));
        };
        load(`profile_${user.uid}`, setProfile);
        load(`orders_${user.uid}`, setOrders);
        load(`wishlist_${user.uid}`, setWishlist);
        load(`addresses_${user.uid}`, setAddresses);

        (async () => {
            try {
                const d = await getDoc(doc(db, 'users', user.uid));
                if (d.exists()) {
                    const data = d.data();
                    if (data.profile) { setProfile(data.profile); localStorage.setItem(`profile_${user.uid}`, JSON.stringify(data.profile)); }
                    if (data.orders) { setOrders(data.orders); localStorage.setItem(`orders_${user.uid}`, JSON.stringify(data.orders)); }
                    if (data.wishlist) { setWishlist(data.wishlist); localStorage.setItem(`wishlist_${user.uid}`, JSON.stringify(data.wishlist)); }
                    if (data.addresses) { setAddresses(data.addresses); localStorage.setItem(`addresses_${user.uid}`, JSON.stringify(data.addresses)); }
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

    if (authLoading || !user) return null;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Top Bar */}
            <div className="bg-white border-b border-gray-200 px-4 py-4">
                <div className="max-w-5xl mx-auto flex items-center justify-between">
                    <button onClick={() => navigate('/')} className="flex items-center gap-2 text-gray-600 hover:text-[#dc2626] transition-colors">
                        <ArrowLeft size={20} />
                        <span className="font-medium">Back</span>
                    </button>
                    <div className="flex items-center gap-4">
                        <span className="text-gray-600 text-sm">{user.email}</span>
                        <button onClick={logoutUser} className="text-gray-500 hover:text-red-500 transition-colors">
                            <LogOut size={20} />
                        </button>
                    </div>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Orders */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Package className="text-[#dc2626]" size={20} /> Orders
                            </h2>
                            <span className="bg-[#dc2626]/10 text-[#dc2626] text-sm font-medium px-3 py-1 rounded-full">{orders.length}</span>
                        </div>
                        {orders.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-gray-400 mb-3">No orders yet</p>
                                <Link to="/shop" className="text-[#dc2626] font-medium hover:underline">Start shopping</Link>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {orders.slice(0, 3).map(o => (
                                    <div key={o.id} className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                                        <div>
                                            <p className="font-bold text-[#dc2626]">#{o.id}</p>
                                            <p className="text-xs text-gray-500">{new Date(o.date).toLocaleDateString()}</p>
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

                    {/* Wishlist */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <Heart className="text-[#dc2626]" size={20} /> Wishlist
                            </h2>
                            <span className="bg-[#dc2626]/10 text-[#dc2626] text-sm font-medium px-3 py-1 rounded-full">{wishlist.length}</span>
                        </div>
                        {wishlist.length === 0 ? (
                            <div className="text-center py-6">
                                <p className="text-gray-400 mb-3">Your wishlist is empty</p>
                                <Link to="/shop" className="text-[#dc2626] font-medium hover:underline">Browse products</Link>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 gap-3">
                                {wishlist.slice(0, 4).map(item => (
                                    <div key={item.id} className="relative group">
                                        <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                            <img src={item.image || '/images/products/wayfarer.svg'} alt={item.name} className="w-full h-full object-cover" />
                                        </div>
                                        <button onClick={() => removeWishlist(item.id)} className="absolute top-2 right-2 p-1 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={12} className="text-red-500" />
                                        </button>
                                        <p className="text-xs font-medium mt-1 truncate">{item.name}</p>
                                        <p className="text-[#dc2626] font-bold text-sm">₵{item.price?.toFixed(2) || '0.00'}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-2xl p-6 shadow-sm md:col-span-2">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="font-bold text-lg flex items-center gap-2">
                                <MapPin className="text-[#dc2626]" size={20} /> Saved Addresses
                            </h2>
                            <button onClick={() => setShowForm(!showForm)} className="text-[#dc2626] text-sm font-medium hover:underline">
                                {showForm ? 'Cancel' : '+ Add Address'}
                            </button>
                        </div>
                        {showForm && (
                            <form onSubmit={addAddress} className="mb-4 p-4 bg-gray-50 rounded-lg grid grid-cols-2 gap-3">
                                <input type="text" placeholder="Name" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                                <input type="text" placeholder="Address" value={form.address} onChange={(e) => setForm({ ...form, address: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                                <input type="text" placeholder="City" value={form.city} onChange={(e) => setForm({ ...form, city: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                                <input type="text" placeholder="State" value={form.state} onChange={(e) => setForm({ ...form, state: e.target.value })} className="px-3 py-2 border rounded-lg text-sm" required />
                                <button type="submit" className="col-span-2 py-2 bg-[#dc2626] text-white rounded-lg text-sm">Save Address</button>
                            </form>
                        )}
                        {addresses.length === 0 ? (
                            <p className="text-gray-400 text-center py-4">No addresses saved</p>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {addresses.map(a => (
                                    <div key={a.id} className="p-4 bg-gray-50 rounded-lg flex justify-between group">
                                        <div>
                                            <p className="font-medium">{a.firstName}</p>
                                            <p className="text-sm text-gray-500">{a.address}</p>
                                            <p className="text-sm text-gray-500">{a.city}, {a.state}</p>
                                        </div>
                                        <button onClick={() => removeAddress(a.id)} className="text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
