import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import axios from 'axios';
import { ArrowLeft, Package, Search, Eye, Check, X, Truck, Clock, Trash2 } from 'lucide-react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

const AdminOrders = () => {
     const [orders, setOrders] = useState([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState('');
     const [selectedOrder, setSelectedOrder] = useState(null);
     const navigate = useNavigate();

     useEffect(() => {
          fetchOrders();
     }, []);

     const fetchOrders = async () => {
          try {
               const token = localStorage.getItem('adminToken');
               console.log('Fetching orders from:', `${API_BASE}/admin/orders`);
               const res = await axios.get(`${API_BASE}/admin/orders`, {
                    headers: { Authorization: `Bearer ${token}` }
               });
               console.log('Orders response:', res.data);
               setOrders(res.data || []);
          } catch (err) {
               console.error('Error loading orders:', err);
               console.error('Error response:', err.response?.data);
               toast.error('Failed to load orders: ' + (err.response?.data?.error || err.message));
          } finally {
               setLoading(false);
          }
     };

     const updateOrderStatus = async (orderId, newStatus) => {
          try {
               const token = localStorage.getItem('adminToken');
               await axios.put(`${API_BASE}/admin/orders/${orderId}`,
                    { status: newStatus },
                    { headers: { Authorization: `Bearer ${token}` } }
               );
               toast.success(`Order marked as ${newStatus}`);
               fetchOrders();
               setSelectedOrder(null);
          } catch (err) {
               console.error('Error updating order:', err);
               toast.error('Failed to update order status');
          }
     };

     const deleteOrder = async (orderId) => {
          if (!window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
               return;
          }
          try {
               const token = localStorage.getItem('adminToken');
               await axios.delete(`${API_BASE}/admin/orders/${orderId}`, {
                    headers: { Authorization: `Bearer ${token}` }
               });
               toast.success('Order deleted successfully');
               fetchOrders();
               setSelectedOrder(null);
          } catch (err) {
               console.error('Error deleting order:', err);
               toast.error('Failed to delete order');
          }
     };

     const filteredOrders = orders.filter(order =>
          order.order_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase())
     ).filter(order => order.status !== 'pending_payment').map((order, index) => ({ ...order, displayNumber: index + 1 }));

     const getStatusColor = (status) => {
          switch (status) {
               case 'processing': return 'bg-blue-100 text-blue-700';
               case 'shipped': return 'bg-purple-100 text-purple-700';
               case 'delivered': return 'bg-green-100 text-green-700';
               case 'cancelled': return 'bg-red-100 text-red-700';
               default: return 'bg-gray-100 text-gray-700';
          }
     };

     if (loading) {
          return (
               <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc2626]"></div>
               </div>
          );
     }

     return (
          <div className="max-w-7xl mx-auto space-y-8 pb-20 px-4 md:px-0">
               {/* Header */}
               <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 border-b border-gray-100 pb-12">
                    <div className="flex items-center gap-6 md:gap-8">
                         <Link
                              to="/admin"
                              className="p-3 md:p-4 bg-white border border-gray-100 hover:border-[#0a0a0a] rounded-full transition-all group"
                         >
                              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                         </Link>
                         <div>
                              <h2 className="text-3xl md:text-5xl font-display tracking-tight text-[#0a0a0a]">
                                   ORDERS<span className="text-[#dc2626]">.</span>
                              </h2>
                              <p className="text-gray-400 text-[9px] md:text-[10px] font-bold tracking-[0.4em] uppercase mt-2">
                                   Customer Order Management
                              </p>
                         </div>
                    </div>
                    <div className="flex items-center gap-4">
                         <span className="text-[10px] font-bold text-gray-400 tracking-widest uppercase">
                              {orders.length} Orders
                         </span>
                    </div>
               </div>

               {/* Search */}
               <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input
                         type="text"
                         placeholder="Search orders by order number, email or name..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full pl-12 pr-4 py-4 border border-gray-200 focus:outline-none focus:border-[#0a0a0a] transition-colors"
                    />
               </div>

               {/* Orders List */}
               {filteredOrders.length === 0 ? (
                    <div className="text-center py-20">
                         <Package size={48} className="mx-auto text-gray-300 mb-4" />
                         <p className="text-gray-400 text-sm">No orders found</p>
                    </div>
               ) : (
                    <div className="space-y-4">
                         {filteredOrders.map((order) => (
                              <div key={order.id} className="bg-white border border-gray-100 p-6 hover:border-gray-300 transition-all">
                                   <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                             <div className="flex items-center gap-4 mb-2">
                                                  <span className="font-mono text-sm font-bold">#{order.displayNumber}</span>
                                                  <span className={`px-3 py-1 text-[10px] font-bold uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                       {order.status || 'pending'}
                                                  </span>
                                             </div>
                                             <div className="text-sm text-gray-500 mb-1">
                                                  {order.customer_name} • {order.customer_email} • {order.shipping_phone || order.phone || 'No phone'}
                                             </div>
                                             <div className="flex items-center gap-4 text-xs text-gray-400">
                                                  <span>{order.items?.length || 0} items</span>
                                                  <span>•</span>
                                                  <span>{new Date(order.created_at).toLocaleDateString()}</span>
                                             </div>
                                        </div>
                                        <div className="flex items-center gap-6">
                                             <div>
                                                  <span className="text-gray-400 block uppercase tracking-wider">Total</span>
                                                  <span className="font-bold text-[#dc2626]">₵{parseFloat(order.total || 0).toFixed(2)}</span>
                                             </div>
                                             <button
                                                  onClick={() => setSelectedOrder(order)}
                                                  className="flex items-center justify-center gap-2 px-6 py-3 bg-[#0a0a0a] text-white text-[9px] font-bold tracking-widest uppercase hover:bg-[#dc2626] transition-all"
                                             >
                                                  <Eye size={14} />
                                                  View Details
                                             </button>
                                        </div>
                                   </div>
                              </div>
                         ))}
                    </div>
               )}

               {/* Order Details Modal */}
               {selectedOrder && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                         <div className="bg-white max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                              <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                                   <div>
                                        <h3 className="text-xl font-display">Order Details</h3>
                                        <p className="text-sm font-mono text-gray-500">{selectedOrder.order_number}</p>
                                   </div>
                                   <button
                                        onClick={() => setSelectedOrder(null)}
                                        className="p-2 hover:bg-gray-100 rounded-full"
                                   >
                                        <X size={20} />
                                   </button>
                              </div>
                              <div className="p-6 space-y-6">
                                   {/* Customer Info */}
                                   <div>
                                        <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">Customer Information</h4>
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                             <div>
                                                  <span className="text-gray-400 block text-xs">Name</span>
                                                  <span className="font-medium">{selectedOrder.customer_name}</span>
                                             </div>
                                             <div>
                                                  <span className="text-gray-400 block text-xs">Email</span>
                                                  <span className="font-medium">{selectedOrder.customer_email}</span>
                                             </div>
                                             <div>
                                                  <span className="text-gray-400 block text-xs">Phone</span>
                                                  <span className="font-medium">{selectedOrder.shipping_phone || selectedOrder.phone || 'N\/A'}</span>
                                             </div>
                                        </div>
                                   </div>

                                   {/* Shipping Address */}
                                   <div>
                                        <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">Shipping Address</h4>
                                        <p className="text-sm">
                                             {selectedOrder.shipping_address}<br />
                                             {selectedOrder.shipping_city}, {selectedOrder.shipping_state} {selectedOrder.shipping_zip}<br />
                                             {selectedOrder.shipping_country}
                                        </p>
                                   </div>

                                   {/* Order Items */}
                                   <div>
                                        <h4 className="text-[10px] font-black tracking-widest uppercase text-gray-400 mb-3">Order Items</h4>
                                        <div className="space-y-3">
                                             {selectedOrder.items?.map((item, i) => (
                                                  <div key={i} className="flex items-center gap-4 p-3 bg-gray-50">
                                                       <div className="w-16 h-16 bg-gray-200 flex-shrink-0">
                                                            {item.image && <img src={item.image} alt={item.name} className="w-full h-full object-cover" />}
                                                       </div>
                                                       <div className="flex-1">
                                                            <p className="font-medium text-sm">{item.name}</p>
                                                            {item.color && <p className="text-xs text-gray-500">Color: {item.color}</p>}
                                                            {item.size && <p className="text-xs text-gray-500">Size: {item.size}</p>}
                                                            <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                                                       </div>
                                                       <p className="font-bold">₵{(item.price * item.quantity).toFixed(2)}</p>
                                                  </div>
                                             ))}
                                        </div>
                                   </div>

                                   {/* Order Summary */}
                                   <div className="border-t border-gray-100 pt-4">
                                        <div className="flex justify-between text-sm mb-2">
                                             <span className="text-gray-500">Subtotal</span>
                                             <span>₵{parseFloat(selectedOrder.subtotal || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                             <span className="text-gray-500">Shipping</span>
                                             <span>₵{parseFloat(selectedOrder.shipping || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-sm mb-2">
                                             <span className="text-gray-500">Tax</span>
                                             <span>₵{parseFloat(selectedOrder.tax || 0).toFixed(2)}</span>
                                        </div>
                                        <div className="flex justify-between text-lg font-bold border-t border-gray-100 pt-2">
                                             <span>Total</span>
                                             <span className="text-[#dc2626]">₵{parseFloat(selectedOrder.total || 0).toFixed(2)}</span>
                                        </div>
                                   </div>

                                   {/* Status Update Buttons */}
                                   <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                                        <button
                                             onClick={() => updateOrderStatus(selectedOrder.id, 'processing')}
                                             className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white text-xs font-bold uppercase hover:bg-blue-600"
                                        >
                                             <Clock size={14} /> Mark Processing
                                        </button>
                                        <button
                                             onClick={() => updateOrderStatus(selectedOrder.id, 'shipped')}
                                             className="flex items-center gap-2 px-4 py-2 bg-purple-500 text-white text-xs font-bold uppercase hover:bg-purple-600"
                                        >
                                             <Truck size={14} /> Mark Shipped
                                        </button>
                                        <button
                                             onClick={() => updateOrderStatus(selectedOrder.id, 'delivered')}
                                             className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white text-xs font-bold uppercase hover:bg-green-600"
                                        >
                                             <Check size={14} /> Mark Delivered
                                        </button>
                                        <button
                                             onClick={() => {
                                                  if (window.confirm('Are you sure you want to delete this order? This action cannot be undone.')) {
                                                       deleteOrder(selectedOrder.id);
                                                  }
                                             }}
                                             className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white text-xs font-bold uppercase hover:bg-red-600 ml-auto"
                                        >
                                             <Trash2 size={14} /> Delete Order
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default AdminOrders;
