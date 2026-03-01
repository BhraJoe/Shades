import { useState, useEffect } from 'react';

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
               const response = await fetch('http://localhost:3001/api/admin/subscribers', {
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
               const response = await fetch(`http://localhost:3001/api/admin/subscribers/${id}`, {
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
               const response = await fetch('http://localhost:3001/api/admin/subscribers', {
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
          const body = encodeURIComponent('Write your message here...');
          window.location.href = `mailto:?bcc=${emails}&subject=${subject}&body=${body}`;
     };

     if (loading) {
          return (
               <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
               </div>
          );
     }

     return (
          <div className="p-6">
               <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Newsletter Subscribers</h1>
                    <div className="flex gap-2">
                         {subscribers.length > 0 && (
                              <>
                                   <button
                                        onClick={handleSendEmail}
                                        className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2"
                                   >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                        Send Email
                                   </button>
                                   <button
                                        onClick={handleDeleteAll}
                                        className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 flex items-center gap-2"
                                   >
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                        Delete All
                                   </button>
                              </>
                         )}
                         <button
                              onClick={exportToCSV}
                              className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
                         >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              Export CSV
                         </button>
                    </div>
               </div>

               <div className="mb-4">
                    <input
                         type="text"
                         placeholder="Search by email..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
               </div>

               <div className="bg-white rounded-lg shadow overflow-hidden">
                    <div className="overflow-x-auto">
                         <table className="min-w-full divide-y divide-gray-200">
                              <thead className="bg-gray-50">
                                   <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subscribed At</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                   </tr>
                              </thead>
                              <tbody className="bg-white divide-y divide-gray-200">
                                   {filteredSubscribers.length === 0 ? (
                                        <tr>
                                             <td colSpan="4" className="px-6 py-8 text-center text-gray-500">
                                                  No subscribers found
                                             </td>
                                        </tr>
                                   ) : (
                                        filteredSubscribers.map((sub) => (
                                             <tr key={sub.id} className="hover:bg-gray-50">
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.id}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{sub.email}</td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                       {new Date(sub.created_at).toLocaleString()}
                                                  </td>
                                                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                                                       <button
                                                            onClick={() => handleDelete(sub.id)}
                                                            className="text-red-600 hover:text-red-800"
                                                       >
                                                            Delete
                                                       </button>
                                                  </td>
                                             </tr>
                                        ))
                                   )}
                              </tbody>
                         </table>
                    </div>
               </div>

               <div className="mt-4 text-sm text-gray-600">
                    Showing {filteredSubscribers.length} of {subscribers.length} subscribers
               </div>
          </div>
     );
}
