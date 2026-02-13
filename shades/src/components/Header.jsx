import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate, useLocation } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, User, SearchIcon } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    { name: 'About', path: '/about' },
    { name: 'FAQ', path: '/faq' },
    { name: 'Contact', path: '/contact' },
];

export default function Header() {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSearchOpen, setIsSearchOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const { cartCount, wishlist } = useCart();
    const navigate = useNavigate();
    const location = useLocation();

    const isCheckout = location.pathname === '/checkout';

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/shop?search=${encodeURIComponent(searchQuery.trim())}`);
            setIsSearchOpen(false);
            setSearchQuery('');
        }
    };

    return (
        <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 w-full overflow-x-hidden">
            {/* ════════════════════════════════════════════
                Top Announcement Bar
            ════════════════════════════════════════════ */}
            <div className={`bg-[#0a0a0a] text-white text-[10px] font-bold tracking-[0.2em] text-center py-2.5 uppercase transition-all duration-500 overflow-hidden ${isScrolled ? 'h-0 py-0 opacity-0' : 'h-auto opacity-100'}`}>
                Free Express Shipping on Orders Over ₵150
            </div>

            {/* ════════════════════════════════════════════
                Main Navigation Row
            ════════════════════════════════════════════ */}
            <div className={`w-full transition-all duration-300 ${(isScrolled || isCheckout) ? 'bg-white shadow-sm' : 'bg-white md:bg-transparent'}`}>
                <div className="max-w-7xl mx-auto px-4 md:px-8 flex items-center justify-between h-16 md:h-20">

                    {/* LEFT: Logo */}
                    <div className="flex-shrink-0">
                        <Link to="/" className="group">
                            <h1 className="font-display text-2xl md:text-3xl tracking-tight text-[#0a0a0a] group-hover:text-[#dc2626] transition-colors">
                                CITYSHADES<span className="text-[#dc2626]">.</span>
                            </h1>
                        </Link>
                    </div>

                    {/* CENTER: Navigation Links */}
                    <nav className="hidden md:flex items-center space-x-10">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `text-xs font-bold tracking-[0.1em] uppercase transition-colors relative pb-1 ${isActive
                                        ? 'text-[#dc2626] border-b-2 border-[#dc2626]'
                                        : 'text-[#0a0a0a] hover:text-[#dc2626]'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* RIGHT: Tools & Icons */}
                    <div className="flex items-center space-x-2 md:space-x-5">
                        {/* Search Desktop */}
                        <div className="hidden lg:flex items-center relative group">
                            <form onSubmit={handleSearch} className="relative">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search..."
                                    className="w-32 lg:w-48 bg-gray-50 border border-gray-100 px-4 py-2 text-xs rounded-full focus:outline-none focus:ring-1 focus:ring-[#0a0a0a] transition-all"
                                />
                                <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 group-hover:text-[#0a0a0a]">
                                    <Search size={14} />
                                </button>
                            </form>
                        </div>

                        {/* Search Mobile Trigger */}
                        <button className="lg:hidden p-2 text-[#0a0a0a] hover:text-[#dc2626]" onClick={() => setIsSearchOpen(!isSearchOpen)}>
                            <Search size={20} />
                        </button>

                        {/* Wishlist */}
                        <Link to="/wishlist" className="p-2 text-[#0a0a0a] hover:text-[#dc2626] transition-colors relative">
                            <Heart size={20} />
                            {wishlist.length > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#dc2626] text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        {/* Account */}
                        <Link to="/login" className="hidden sm:flex p-2 text-[#0a0a0a] hover:text-[#dc2626] transition-colors">
                            <User size={20} />
                        </Link>

                        {/* Bag / Cart */}
                        <Link to="/cart" className="p-2 text-[#0a0a0a] hover:text-[#dc2626] transition-colors relative">
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute top-1 right-1 w-4 h-4 bg-[#0a0a0a] text-white text-[9px] flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* Mobile Menu Toggle */}
                        <button className="md:hidden p-2 text-[#0a0a0a]" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                            {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>

                {/* Mobile Search Bar Expansion */}
                {isSearchOpen && (
                    <div className="lg:hidden px-4 pb-4 animate-in slide-in-from-top duration-300">
                        <form onSubmit={handleSearch} className="relative">
                            <input
                                type="text"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                placeholder="SEARCH FOR SUNGLASSES..."
                                className="w-full bg-gray-50 border border-gray-100 px-6 py-4 text-xs font-bold rounded-xl focus:outline-none"
                                autoFocus
                            />
                            <button type="button" onClick={() => setIsSearchOpen(false)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
                                <X size={18} />
                            </button>
                        </form>
                    </div>
                )}
            </div>

            {/* Mobile Sidebar Navigation */}
            <div className={`fixed inset-0 bg-black/60 z-50 transition-opacity duration-500 md:hidden ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={() => setIsMobileMenuOpen(false)}>
                <div
                    className={`absolute left-0 top-0 bottom-0 w-[80%] max-w-sm bg-white p-8 transition-transform duration-500 ease-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="flex items-center justify-between mb-12">
                        <h1 className="font-display text-2xl tracking-tight text-[#0a0a0a]">
                            CITYSHADES<span className="text-[#dc2626]">.</span>
                        </h1>
                        <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 text-gray-400">
                            <X size={24} />
                        </button>
                    </div>

                    <nav className="flex flex-col space-y-6">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `text-xl font-display tracking-widest uppercase pb-2 ${isActive ? 'text-[#dc2626] border-b-2 border-[#dc2626]' : 'text-[#0a0a0a]'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    <div className="absolute bottom-12 left-8 right-8 pt-8 border-t border-gray-100">
                        <div className="grid grid-cols-2 gap-4">
                            <Link to="/login" className="px-4 py-4 bg-[#0a0a0a] text-white text-[10px] font-bold text-center tracking-widest uppercase" onClick={() => setIsMobileMenuOpen(false)}>Login</Link>
                            <Link to="/register" className="px-4 py-4 bg-[#dc2626] text-white text-[10px] font-bold text-center tracking-widest uppercase" onClick={() => setIsMobileMenuOpen(false)}>Join</Link>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}
