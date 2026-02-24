import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Plus, Search, Edit2, Trash2, ArrowLeft, Tag } from 'lucide-react';

// API base URL - works on both local and Vercel
const API_BASE = import.meta.env.PROD ? '/api' : 'http://localhost:3001/api';

const AdminCategories = () => {
     const [categories, setCategories] = useState([]);
     const [isLoading, setIsLoading] = useState(true);
     const [error, setError] = useState(null);
     const [searchTerm, setSearchTerm] = useState('');
     const [isModalOpen, setIsModalOpen] = useState(false);
     const [editingCategory, setEditingCategory] = useState(null);
     const [formData, setFormData] = useState({
          name: '',
          slug: '',
          description: ''
     });

     useEffect(() => {
          fetchCategories();
     }, []);

     // Timeout after 10 seconds
     useEffect(() => {
          const timeout = setTimeout(() => {
               if (isLoading) {
                    setIsLoading(false);
                    setError('Connection timeout - please refresh');
               }
          }, 10000);

          return () => clearTimeout(timeout);
     }, [isLoading]);

     const fetchCategories = async () => {
          try {
               const res = await axios.get(`${API_BASE}/categories`);
               setCategories(res.data || []);
          } catch (err) {
               console.error('Error loading categories:', err);
               setError('Failed to load categories - API may be unreachable');
          } finally {
               setIsLoading(false);
          }
     };

     const handleDelete = async (id) => {
          if (!window.confirm('Are you sure you want to delete this category?')) return;

          try {
               const adminToken = localStorage.getItem('adminToken');
               if (!adminToken) {
                    toast.error('Please login as admin to delete categories');
                    return;
               }

               const response = await fetch(`${API_BASE}/admin/categories/${id}`, {
                    method: 'DELETE',
                    headers: {
                         'Authorization': `Bearer ${adminToken}`
                    }
               });

               const data = await response.json();
               if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                         localStorage.removeItem('adminToken');
                         localStorage.removeItem('adminUser');
                         toast.error('Session expired - please login again');
                         window.location.href = '/admin/login';
                         return;
                    }
                    throw new Error(data.error || 'Failed to delete');
               }

               toast.success('Category removed');
               fetchCategories();
          } catch (err) {
               console.error('Delete error:', err);
               toast.error(err.message || 'Failed to delete category');
          }
     };

     const openModal = (category = null) => {
          if (category) {
               setEditingCategory(category);
               setFormData({
                    name: category.name,
                    slug: category.slug,
                    description: category.description || ''
               });
          } else {
               setEditingCategory(null);
               setFormData({
                    name: '',
                    slug: '',
                    description: ''
               });
          }
          setIsModalOpen(true);
     };

     const closeModal = () => {
          setIsModalOpen(false);
          setEditingCategory(null);
          setFormData({ name: '', slug: '', description: '' });
     };

     const handleSubmit = async (e) => {
          e.preventDefault();

          try {
               const adminToken = localStorage.getItem('adminToken');
               if (!adminToken) {
                    toast.error('Please login as admin');
                    return;
               }

               const url = editingCategory
                    ? `${API_BASE}/admin/categories/${editingCategory.id}`
                    : `${API_BASE}/admin/categories`;

               const response = await fetch(url, {
                    method: editingCategory ? 'PUT' : 'POST',
                    headers: {
                         'Content-Type': 'application/json',
                         'Authorization': `Bearer ${adminToken}`
                    },
                    body: JSON.stringify(formData)
               });

               const data = await response.json();
               if (!response.ok) {
                    if (response.status === 401 || response.status === 403) {
                         localStorage.removeItem('adminToken');
                         localStorage.removeItem('adminUser');
                         toast.error('Session expired - please login again');
                         window.location.href = '/admin/login';
                         return;
                    }
                    throw new Error(data.error || 'Failed to save');
               }

               toast.success(editingCategory ? 'Category updated' : 'Category created');
               closeModal();
               fetchCategories();
          } catch (err) {
               console.error('Save error:', err);
               toast.error(err.message || 'Failed to save category');
          }
     };

     const filteredCategories = categories.filter(cat =>
          cat.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          cat.slug?.toLowerCase().includes(searchTerm.toLowerCase())
     );

     if (isLoading) {
          return (
               <div className="flex items-center justify-center min-h-[400px]">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#dc2626]"></div>
               </div>
          );
     }

     return (
          <div className="max-w-7xl mx-auto space-y-12 pb-12">
               {/* Page Header */}
               <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 px-4 md:px-0">
                    <div className="flex items-center gap-6 md:gap-8">
                         <Link
                              to="/admin"
                              className="p-3 md:p-4 bg-white border border-gray-100 hover:border-[#0a0a0a] rounded-full transition-all group shrink-0"
                         >
                              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
                         </Link>
                         <div>
                              <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-7xl font-display tracking-tight text-[#0a0a0a] transform focus:outline-none">
                                   CATEGORIES<span className="text-[#dc2626]">.</span>
                              </h2>
                              <p className="text-gray-400 text-[9px] font-bold tracking-[0.5em] uppercase">Classification Registry</p>
                         </div>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 w-full lg:w-auto">
                         <div className="relative flex-1 sm:w-64 group">
                              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#dc2626] transition-colors" size={14} />
                              <input
                                   type="text"
                                   placeholder="SEARCH CATEGORIES..."
                                   value={searchTerm}
                                   onChange={(e) => setSearchTerm(e.target.value)}
                                   className="w-full bg-white border border-gray-100 py-4 pl-12 pr-6 text-[10px] font-bold tracking-[0.2em] uppercase focus:outline-none focus:border-[#0a0a0a] transition-all shadow-sm"
                              />
                         </div>
                         <button
                              onClick={() => openModal()}
                              className="bg-[#0a0a0a] text-white px-8 py-4 font-bold tracking-widest uppercase text-[10px] hover:bg-[#dc2626] transition-all shadow-xl flex items-center gap-3 justify-center"
                         >
                              <Plus size={16} />
                              Add Category
                         </button>
                    </div>
               </div>

               {/* Error Message */}
               {error && (
                    <div className="mx-4 md:mx-0 bg-red-50 border border-red-200 text-red-600 px-6 py-4 text-sm">
                         {error}
                    </div>
               )}

               {/* Categories Grid */}
               {filteredCategories.length === 0 ? (
                    <div className="text-center py-20">
                         <Tag className="mx-auto h-16 w-16 text-gray-200 mb-4" />
                         <p className="text-gray-400 text-sm tracking-widest uppercase">No categories found</p>
                    </div>
               ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 px-4 md:px-0">
                         {filteredCategories.map((category) => (
                              <div
                                   key={category.id}
                                   className="bg-white border border-gray-100 p-6 shadow-sm hover:shadow-xl transition-all group"
                              >
                                   <div className="flex items-start justify-between mb-4">
                                        <div className="w-12 h-12 bg-gray-50 flex items-center justify-center">
                                             <Tag className="text-gray-400 group-hover:text-[#dc2626] transition-colors" size={24} />
                                        </div>
                                        <div className="flex gap-2">
                                             <button
                                                  onClick={() => openModal(category)}
                                                  className="p-2 text-gray-400 hover:text-[#0a0a0a] transition-colors"
                                             >
                                                  <Edit2 size={16} />
                                             </button>
                                             <button
                                                  onClick={() => handleDelete(category.id)}
                                                  className="p-2 text-gray-400 hover:text-[#dc2626] transition-colors"
                                             >
                                                  <Trash2 size={16} />
                                             </button>
                                        </div>
                                   </div>
                                   <h3 className="text-lg font-display tracking-tight text-[#0a0a0a] mb-1">
                                        {category.name}
                                   </h3>
                                   <p className="text-[10px] font-mono text-gray-400 uppercase tracking-wider mb-3">
                                        /{category.slug}
                                   </p>
                                   {category.description && (
                                        <p className="text-sm text-gray-500 line-clamp-2">
                                             {category.description}
                                        </p>
                                   )}
                              </div>
                         ))}
                    </div>
               )}

               {/* Add/Edit Modal */}
               {isModalOpen && (
                    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
                         <div className="bg-white w-full max-w-md p-8 shadow-2xl">
                              <h3 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">
                                   {editingCategory ? 'Edit Category' : 'New Category'}
                              </h3>
                              <form onSubmit={handleSubmit} className="space-y-6">
                                   <div className="space-y-2">
                                        <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Category Name</label>
                                        <input
                                             type="text"
                                             required
                                             value={formData.name}
                                             onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                             className="w-full bg-gray-50 border-b border-gray-100 focus:border-[#0a0a0a] py-3 text-sm focus:outline-none transition-all"
                                             placeholder="e.g. Aviator"
                                        />
                                   </div>
                                   <div className="space-y-2">
                                        <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Slug</label>
                                        <input
                                             type="text"
                                             required
                                             value={formData.slug}
                                             onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })}
                                             className="w-full bg-gray-50 border-b border-gray-100 focus:border-[#0a0a0a] py-3 text-sm focus:outline-none transition-all font-mono"
                                             placeholder="e.g. aviator"
                                        />
                                   </div>
                                   <div className="space-y-2">
                                        <label className="text-[9px] font-black tracking-widest uppercase text-gray-400">Description</label>
                                        <textarea
                                             value={formData.description}
                                             onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                             className="w-full bg-gray-50 border border-gray-100 focus:border-[#0a0a0a] p-4 text-sm focus:outline-none transition-all resize-none"
                                             rows={3}
                                             placeholder="Optional description..."
                                        />
                                   </div>
                                   <div className="flex gap-4 pt-4">
                                        <button
                                             type="button"
                                             onClick={closeModal}
                                             className="flex-1 px-6 py-3 text-[10px] font-bold tracking-widest uppercase text-gray-400 hover:text-[#0a0a0a] transition-all border border-gray-100"
                                        >
                                             Cancel
                                        </button>
                                        <button
                                             type="submit"
                                             className="flex-1 bg-[#0a0a0a] text-white px-6 py-3 font-bold tracking-widest uppercase text-[10px] hover:bg-[#dc2626] transition-all"
                                        >
                                             {editingCategory ? 'Update' : 'Create'}
                                        </button>
                                   </div>
                              </form>
                         </div>
                    </div>
               )}
          </div>
     );
};

export default AdminCategories;
