import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Package, ChevronRight, Clock } from 'lucide-react';

export default function Orders() {
    const { user, loading: authLoading } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authLoading && !user) {
            setLoading(false);
            return;
        }

        // Load orders from localStorage (simulated - in production use Firebase Firestore)
        const storedOrders = localStorage.getItem(`orders_${user?.uid}`);
        if (storedOrders) {
            setOrders(JSON.parse(storedOrders));
        }
        setLoading(false);
    }, [user, authLoading]);

    if (authLoading || loading) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen bg-[#f5f5f5] flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc2626]"></div>
            </div>
        );
    }

    if (!user) {
        return (
            <div className="pt-20 md:pt-[104px] min-h-screen bg-[#f5f5f5] flex items-center justify-center">
                <div className="text-center">
                    <h2 className="font-display text-2xl mb-4">Please log in to view your orders</h2>
                    <Link to="/login" className="text-[#dc2626] hover:underline">Sign in</Link>
                </div>
            </div>
        );
    }

    return (
        <div className="pt-20 md:pt-[104px] min-h-screen bg-[#f5f5f5]">
            <div className="max-w-7xl mx-auto px-4 md:px-8 py-12">
                <div className="mb-8">
                    <h1 className="font-display text-4xl md:text-5xl tracking-wider mb-2">My Orders</h1>
                    <p className="text-gray-500">Track and manage your orders</p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white rounded-2xl p-12 text-center">
                        <Package className="w-16 h-16 mx-auto mb-4 text-gray-300" />
                        <h2 className="font-display text-2xl mb-2">No orders yet</h2>
                        <p className="text-gray-500 mb-6">Once you place an order, it will appear here.</p>
                        <Link
                            to="/shop"
                            className="inline-block px-8 py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors"
                        >
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <div key={order.id} className="bg-white rounded-2xl p-6 shadow-sm">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-4 mb-2">
                                            <span className="text-xs font-bold tracking-[0.2em] uppercase text-[#dc2626]">
                                                Order #{order.id}
                                            </span>
                                            <span className={`px-3 py-1 text-xs font-bold tracking-[0.1em] uppercase rounded-full ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                    order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                                                        order.status === 'processing' ? 'bg-yellow-100 text-yellow-700' :
                                                            'bg-gray-100 text-gray-700'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2 text-gray-500 text-sm">
                                            <Clock size={14} />
                                            <span>{new Date(order.date).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'long',
                                                day: 'numeric'
                                            })}</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500 uppercase tracking-wider mb-1">Total</p>
                                            <p className="font-display text-xl">₵{order.total.toFixed(2)}</p>
                                        </div>
                                        <ChevronRight className="text-gray-300" size={20} />
                                    </div>
                                </div>

                                {/* Order Items Preview */}
                                <div className="mt-4 pt-4 border-t border-gray-100">
                                    <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">
                                        {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                                    </p>
                                    <div className="flex gap-2 overflow-x-auto pb-2">
                                        {order.items.map((item, idx) => (
                                            <div key={idx} className="flex-shrink-0 w-16 h-16 bg-gray-100 rounded-lg overflow-hidden">
                                                <img
                                                    src={item.image}
                                                    alt={item.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
