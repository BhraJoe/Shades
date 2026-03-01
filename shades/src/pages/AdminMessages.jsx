import { useState, useEffect } from 'react';

export default function AdminMessages() {
     const [messages, setMessages] = useState([]);
     const [loading, setLoading] = useState(true);
     const [searchTerm, setSearchTerm] = useState('');
     const [selectedMessage, setSelectedMessage] = useState(null);

     useEffect(() => {
          fetchMessages();
     }, []);

     const fetchMessages = async () => {
          try {
               const token = localStorage.getItem('adminToken');
               const response = await fetch('http://localhost:3001/api/admin/messages', {
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });
               if (response.ok) {
                    const data = await response.json();
                    setMessages(data);
               }
          } catch (error) {
               console.error('Error fetching messages:', error);
          } finally {
               setLoading(false);
          }
     };

     const handleDelete = async (id) => {
          if (!window.confirm('Are you sure you want to delete this message?')) return;

          try {
               const token = localStorage.getItem('adminToken');
               const response = await fetch(`http://localhost:3001/api/admin/messages/${id}`, {
                    method: 'DELETE',
                    headers: {
                         'Authorization': `Bearer ${token}`
                    }
               });
               if (response.ok) {
                    setMessages(messages.filter(m => m.id !== id));
                    toast.success('Message deleted successfully');
               }
          } catch (error) {
               console.error('Error deleting message:', error);
               toast.error('Failed to delete message');
          }
     };

     const filteredMessages = messages.filter(msg =>
          msg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          msg.subject.toLowerCase().includes(searchTerm.toLowerCase())
     );

     const getStatusColor = (msg) => {
          // Show as unread if no read_at timestamp
          if (!msg.read_at) {
               return 'bg-blue-100 text-blue-800';
          }
          return 'bg-gray-100 text-gray-800';
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
               <h1 className="text-2xl font-bold text-gray-800 mb-6">Contact Messages</h1>

               <div className="mb-4">
                    <input
                         type="text"
                         placeholder="Search by name, email, or subject..."
                         value={searchTerm}
                         onChange={(e) => setSearchTerm(e.target.value)}
                         className="w-full max-w-md px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
               </div>

               <div className="grid gap-4">
                    {filteredMessages.length === 0 ? (
                         <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
                              No messages found
                         </div>
                    ) : (
                         filteredMessages.map((msg) => (
                              <div
                                   key={msg.id}
                                   className={`bg-white rounded-lg shadow p-4 ${!msg.read_at ? 'border-l-4 border-blue-500' : ''}`}
                              >
                                   <div className="flex justify-between items-start mb-2">
                                        <div>
                                             <h3 className="font-semibold text-lg">{msg.subject}</h3>
                                             <p className="text-sm text-gray-600">
                                                  From: {msg.name} ({msg.email})
                                             </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                             <span className={`px-2 py-1 rounded text-xs ${getStatusColor(msg)}`}>
                                                  {!msg.read_at ? 'New' : 'Read'}
                                             </span>
                                             <button
                                                  onClick={() => setSelectedMessage(msg)}
                                                  className="text-blue-600 hover:text-blue-800 text-sm"
                                             >
                                                  View
                                             </button>
                                             <button
                                                  onClick={() => handleDelete(msg.id)}
                                                  className="text-red-600 hover:text-red-800 text-sm"
                                             >
                                                  Delete
                                             </button>
                                        </div>
                                   </div>
                                   <p className="text-sm text-gray-500">
                                        {new Date(msg.created_at).toLocaleString()}
                                   </p>
                              </div>
                         ))
                    )}
               </div>

               <div className="mt-4 text-sm text-gray-600">
                    Total messages: {filteredMessages.length}
               </div>

               {/* Message Detail Modal */}
               {selectedMessage && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                         <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                              <div className="p-6">
                                   <div className="flex justify-between items-start mb-4">
                                        <h2 className="text-xl font-bold">{selectedMessage.subject}</h2>
                                        <button
                                             onClick={() => setSelectedMessage(null)}
                                             className="text-gray-500 hover:text-gray-700"
                                        >
                                             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                             </svg>
                                        </button>
                                   </div>
                                   <div className="mb-4">
                                        <p className="text-sm text-gray-600">
                                             <span className="font-medium">From:</span> {selectedMessage.name} ({selectedMessage.email})
                                        </p>
                                        <p className="text-sm text-gray-600">
                                             <span className="font-medium">Date:</span> {new Date(selectedMessage.created_at).toLocaleString()}
                                        </p>
                                   </div>
                                   <div className="border-t pt-4">
                                        <p className="whitespace-pre-wrap">{selectedMessage.message}</p>
                                   </div>
                                   <div className="mt-6 flex justify-end">
                                        <a
                                             href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`}
                                             className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mr-2"
                                        >
                                             Reply
                                        </a>
                                        <button
                                             onClick={() => {
                                                  handleDelete(selectedMessage.id);
                                                  setSelectedMessage(null);
                                             }}
                                             className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
                                        >
                                             Delete
                                        </button>
                                   </div>
                              </div>
                         </div>
                    </div>
               )}
          </div>
     );
}
