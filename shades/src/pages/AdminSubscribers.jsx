import { useState, useEffect } from 'react';

const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

export default function AdminSubscribers() {
     const [subscribers, setSubscribers] = useState([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState('');

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
          if (!window.confirm('Are you sure you want to delete ALL subscribers? This will reset the ID counter to 1.')) return;

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
               <div className="flex items-center justify-center h-64">
                    <div className="text-gray-500">Loading...</div>
               </div>
          );
     }

     return (
          <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Newsletter Subscribers</h1>
                    <div className="flex gap-2">
                         <button
                              onClick={exportToCSV}
                              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                         >
                              Export CSV
                         </button>
                         <button
                              onClick={handleSendEmail}
                              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                         >
                              Send Email
                         </button>
                         <button
                              onClick={handleDeleteAll}
                              className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                         >
                              Delete All
                         </button>
                    </div>
               </div>

               <div className="mb-4">
                    <input
                         type="text"
                         placeholder="Search subscribers..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full px-4 py-2 border rounded-lg"
                    />
               </div>

               <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border">
                         <thead>
                              <tr className="bg-gray-100">
                                   <th className="px-6 py-3 text-left">ID</th>
                                   <th className="px-6 py-3 text-left">Email</th>
                                   <th className="px-6 py-3 text-left">Subscribed At</th>
                                   <th className="px-6 py-3 text-left">Actions</th>
                              </tr>
                         </thead>
                         <tbody>
                              {filteredSubscribers.length > 0 ? (
                                   filteredSubscribers.map((subscriber) => (
                                        <tr key={subscriber.id} className="border-t">
                                             <td className="px-6 py-4">{subscriber.id}</td>
                                             <td className="px-6 py-4">{subscriber.email}</td>
                                             <td className="px-6 py-4">
                                                  {new Date(subscriber.created_at).toLocaleString()}
                                             </td>
                                             <td className="px-6 py-4">
                                                  <button
                                                       onClick={() => handleDelete(subscriber.id)}
                                                       className="text-red-600 hover:text-red-800"
                                                  >
                                                       Delete
                                                  </button>
                                             </td>
                                        </tr>
                                   ))
                              ) : (
                                   <tr>
                                        <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                             No subscribers found
                                        </td>
                                   </tr>
                              )}
                         </tbody>
                    </table>
               </div>

               <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredSubscribers.length} of {subscribers.length} subscribers
               </div>
          </div>
     );
}
