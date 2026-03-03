import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export default function AdminSubscribers() {
     const [subscribers, setSubscribers] = useState([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState('');
     const [showActions, setShowActions] = useState(false);

     useEffect(() => {
          fetchSubscribers();
     }, []);

     const fetchSubscribers = async () => {
          try {
               const token = localStorage.getItem('adminToken');
               const response = await fetch(`${API_BASE}/admin/subscribers`, {
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });
               if (response.ok) {
                    const data = await response.json();
                    setSubscribers(data);
               }
          } catch (error) {
               console.error('Error fetching subscribers:', error);
          } finally {
               setLoading(false);
          }
     };

     const filteredSubscribers = subscribers.filter(sub =>
          sub.email.toLowerCase().includes(searchTerm.toLowerCase())
     );

     const exportToCSV = () => {
          const headers = ['ID', 'Email', 'Subscribed At'];
          const rows = filteredSubscribers.map(sub => [
               sub.id,
               sub.email,
               new Date(sub.created_at).toLocaleString()
          ]);

          const csvContent = [
               headers.join(','),
               ...rows.map(row => row.map(cell => `"${cell}"`).join(','))
          ].join('\n');

          const blob = new Blob([csvContent], { type: 'text/csv' });
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `subscribers_${new Date().toISOString().split('T')[0]}.csv`;
          a.click();
     };

     const handleDelete = async (id) => {
          if (!window.confirm('Are you sure you want to delete this subscriber?')) return;

          try {
               const token = localStorage.getItem('adminToken');
               const response = await fetch(`${API_BASE}/admin/subscribers/${id}`, {
                    method: 'DELETE',
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });
               if (response.ok) {
                    setSubscribers(subscribers.filter(s => s.id !== id));
               }
          } catch (error) {
               console.error('Error deleting subscriber:', error);
          }
     };

     const handleDeleteAll = async () => {
          if (!window.confirm('Are you sure you want to delete ALL subscribers?')) return;

          try {
               const token = localStorage.getItem('adminToken');
               const response = await fetch(`${API_BASE}/admin/subscribers`, {
                    method: 'DELETE',
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });
               if (response.ok) {
                    setSubscribers([]);
               }
          } catch (error) {
               console.error('Error deleting all subscribers:', error);
          }
     };

     const handleSendEmail = () => {
          if (subscribers.length === 0) {
               alert('No subscribers to send email to.');
               return;
          }
          const emails = subscribers.map(s => s.email).join(',');
          const subject = encodeURIComponent('Newsletter from CityShades');
          const body = encodeURIComponent('Hello,\n\nCheck out our latest collection!');
          window.location.href = `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;
     };

     if (loading) {
          return (
               <div className="flex items-center justify-center h-screen">
                    <div className="text-gray-500">Loading...</div>
               </div>
          );
     }

     return (
          <div className="min-h-screen bg-gray-50">
               {/* Header */}
               <div className="bg-white shadow-sm sticky top-0 z-10">
                    <div className="px-4 py-4">
                         <h1 className="text-lg font-bold text-gray-900">Subscribers</h1>
                         <p className="text-sm text-gray-500">{subscribers.length} total</p>
                    </div>
               </div>

               {/* Search */}
               <div className="px-4 py-3 bg-white">
                    <input
                         type="text"
                         placeholder="Search by email..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full px-4 py-2.5 bg-gray-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                    />
               </div>

               {/* Action Buttons */}
               <div className="px-4 py-3 bg-white border-b">
                    <div className="flex gap-2 overflow-x-auto pb-1">
                         <button
                              onClick={exportToCSV}
                              className="flex-shrink-0 px-4 py-2 bg-green-600 text-white rounded-lg text-sm font-medium"
                         >
                              Export
                         </button>
                         <button
                              onClick={handleSendEmail}
                              className="flex-shrink-0 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium"
                         >
                              Email All
                         </button>
                         <button
                              onClick={handleDeleteAll}
                              className="flex-shrink-0 px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-medium"
                         >
                              Clear All
                         </button>
                    </div>
               </div>

               {/* Subscriber List - Mobile Card Style */}
               <div className="p-4 space-y-3">
                    {filteredSubscribers.length > 0 ? (
                         filteredSubscribers.map((subscriber, index) => (
                              <div
                                   key={subscriber.id}
                                   className="bg-white rounded-xl p-4 shadow-sm border border-gray-100"
                              >
                                   <div className="flex justify-between items-start">
                                        <div className="flex-1 min-w-0">
                                             <p className="text-sm font-semibold text-gray-900 truncate">
                                                  {subscriber.email}
                                             </p>
                                             <p className="text-xs text-gray-500 mt-1">
                                                  #{String(index + 1).padStart(3, '0')} • {new Date(subscriber.created_at).toLocaleDateString()}
                                             </p>
                                        </div>
                                        <button
                                             onClick={() => handleDelete(subscriber.id)}
                                             className="ml-3 p-2 text-red-600 hover:bg-red-50 rounded-lg"
                                             title="Delete"
                                        >
                                             <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                             </svg>
                                        </button>
                                   </div>
                              </div>
                         ))
                    ) : (
                         <div className="text-center py-12">
                              <div className="text-gray-400 mb-2">
                                   <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                   </svg>
                              </div>
                              <p className="text-gray-500">No subscribers found</p>
                              {searchTerm && (
                                   <button
                                        onClick={() => setSearchTerm('')}
                                        className="mt-2 text-blue-600 text-sm"
                                   >
                                        Clear search
                                   </button>
                              )}
                         </div>
                    )}
               </div>

               {/* Results Count */}
               {filteredSubscribers.length > 0 && (
                    <div className="px-4 pb-4">
                         <p className="text-sm text-gray-500">
                              Showing {filteredSubscribers.length} of {subscribers.length}
                         </p>
                    </div>
               )}
          </div>
     );
}
