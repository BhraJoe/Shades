import React, { useState } from 'react';
import { Navigate, Outlet, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutDashboard, ShoppingBag, LogOut, User, Menu, X } from 'lucide-react';

const AdminLayout = () => {
    const { user, logout, loading } = useAuth();
    const location = useLocation();

    const [isMenuOpen, setIsMenuOpen] = useState(false);

    if (loading) return <div>Loading...</div>;
    if (!user) return <Navigate to="/admin/login" state={{ from: location }} replace />;

    const navItems = [
        { name: 'Inventory', path: '/admin', icon: LayoutDashboard },
        { name: 'Products', path: '/admin/products', icon: ShoppingBag },
    ];

    const SidebarContent = () => (
        <>
            <div className="p-10">
                <h1 className="text-xl font-display tracking-tight leading-tight">
                    CITYSHADES<br />
                    <span className="text-gray-500 text-xs font-bold tracking-[0.2em]">ADMINISTRATION</span>
                </h1>
            </div>

            <nav className="mt-12 space-y-1 px-6">
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path || (item.path === '/admin' && location.pathname === '/admin/products');
                    return (
                        <Link
                            key={item.name}
                            to={item.path}
                            onClick={() => setIsMenuOpen(false)}
                            className={`flex items-center gap-4 px-5 py-4 transition-all duration-300 group ${isActive ? 'text-white border-l border-[#dc2626] bg-white/5' : 'text-gray-500 hover:text-white hover:bg-white/5 border-l border-transparent'
                                }`}
                        >
                            <Icon size={18} className={isActive ? 'text-[#dc2626]' : 'group-hover:text-white'} />
                            <span className="text-[10px] font-bold tracking-[0.2em] uppercase">{item.name}</span>
                        </Link>
                    );
                })}
            </nav>

            <div className="absolute bottom-12 left-0 w-full px-10">
                <button
                    onClick={logout}
                    className="flex items-center gap-4 text-gray-500 hover:text-[#dc2626] transition-all group"
                >
                    <LogOut size={18} />
                    <span className="text-[10px] font-bold tracking-[0.2em] uppercase">Logout</span>
                </button>
            </div>
        </>
    );

    return (
        <div className="flex min-h-screen bg-white">
            {/* Desktop Sidebar */}
            <aside className="w-64 bg-[#0a0a0a] text-white hidden md:block border-r border-white/5 relative">
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar Overlay */}
            <div
                className={`fixed inset-0 bg-black/60 z-50 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={() => setIsMenuOpen(false)}
            />

            {/* Mobile Sidebar */}
            <aside
                className={`fixed top-0 left-0 bottom-0 w-64 bg-[#0a0a0a] text-white z-50 md:hidden transition-transform duration-300 transform ${isMenuOpen ? 'translate-x-0' : '-translate-x-full'
                    }`}
            >
                <div className="absolute top-6 right-6">
                    <button onClick={() => setIsMenuOpen(false)} className="text-white/60 hover:text-white transition-colors">
                        <X size={24} />
                    </button>
                </div>
                <SidebarContent />
            </aside>

            {/* Main Content */}
            <main className="flex-1 flex flex-col">
                <header className="sticky top-0 z-30 h-20 md:h-24 bg-white border-b border-gray-100 px-6 md:px-12 flex items-center justify-between md:justify-end">
                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(true)}
                        className="md:hidden p-2 -ml-2 text-[#0a0a0a] hover:text-[#dc2626] transition-colors"
                    >
                        <Menu size={24} />
                    </button>

                    <div className="flex items-center gap-4 md:gap-6">
                        <div className="text-right flex-shrink min-w-0">
                            <p className="text-[9px] sm:text-[10px] font-bold tracking-[0.2em] text-[#0a0a0a] uppercase truncate max-w-[100px] sm:max-w-none">{user.username}</p>
                            <p className="text-[8px] sm:text-[9px] text-[#dc2626] font-black uppercase tracking-widest mt-0.5">{user.role}</p>
                        </div>
                        <div className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 bg-[#0a0a0a] rounded-full flex items-center justify-center text-white shadow-lg overflow-hidden border-2 border-white shrink-0">
                            <User size={18} />
                        </div>
                    </div>
                </header>
                <div className="p-6 md:p-12 flex-1 bg-[#fafafa]">
                    <div className="max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default AdminLayout;
