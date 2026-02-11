import { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { ShoppingBag, Search, Menu, X, Heart, User, UserPlus } from 'lucide-react';
import { useCart } from '../context/CartContext';

const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Shop', path: '/shop' },
    // { name: 'Wishlist', path: '/wishlist' },
    // { name: 'Bag', path: '/cart' },
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

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50);
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
        <header
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white border-b border-gray-100' : 'bg-transparent'
                }`}
        >
            {/* Top Bar */}
            <div className="bg-[#dc2626] text-white text-xs font-bold tracking-[0.2em] text-center py-2">
                FREE SHIPPING ON ORDERS OVER $150 — FREE RETURNS
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6">
                <div className="flex items-center justify-between h-16 md:h-20">
                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 -ml-2"
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                    >
                        {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>

                    {/* Logo */}
                    <Link to="/" className="flex-shrink-0">
                        <h1 className="font-display text-3xl md:text-4xl tracking-wider">
                            CITYSHADES<span className="text-[#dc2626]">.</span>
                        </h1>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden md:flex items-center space-x-10">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `text-xs font-bold tracking-[0.15em] uppercase hover:text-[#dc2626] transition-colors duration-200 ${isActive ? 'text-[#dc2626]' : 'text-[#0a0a0a]'
                                    }`
                                }
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>

                    {/* Icons */}
                    <div className="flex items-center space-x-4 md:space-x-6">
                        {/* Search Bar */}
                        {isSearchOpen ? (
                            <form onSubmit={handleSearch} className="hidden md:flex items-center">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search sunglasses..."
                                    className="w-64 px-4 py-2 text-sm border border-gray-300 rounded-lg focus:outline-none focus:border-[#dc2626] transition-colors duration-200"
                                    autoFocus
                                />
                                <button
                                    type="button"
                                    onClick={() => setIsSearchOpen(false)}
                                    className="ml-2 p-2 hover:text-[#dc2626] transition-colors duration-200"
                                >
                                    <X size={20} />
                                </button>
                            </form>
                        ) : (
                            <button
                                onClick={() => setIsSearchOpen(true)}
                                className="hidden md:block p-2 hover:text-[#dc2626] transition-colors duration-200"
                            >
                                <Search size={20} />
                            </button>
                        )}

                        <Link
                            to="/wishlist"
                            className="p-2 hover:text-[#dc2626] transition-colors duration-200 relative"
                        >
                            <Heart size={20} />
                            {wishlist.length > 0 && (
                                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#dc2626] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                    {wishlist.length}
                                </span>
                            )}
                        </Link>

                        <Link
                            to="/cart"
                            className="p-2 hover:text-[#dc2626] transition-colors duration-200 relative"
                        >
                            <ShoppingBag size={20} />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#0a0a0a] text-white text-[10px] flex items-center justify-center rounded-full font-bold">
                                    {cartCount}
                                </span>
                            )}
                        </Link>

                        {/* User Icon with Dropdown */}
                        <div className="relative group ml-8">
                            <button className="p-2 hover:text-[#dc2626] transition-colors duration-200">
                                <User size={20} />
                            </button>
                            <div className="absolute right-0 top-full mt-2 w-40 bg-white shadow-lg rounded-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                                <Link to="/login" className="block px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase text-[#0a0a0a] hover:text-[#dc2626] hover:bg-[#f5f5f5] transition-colors duration-200">
                                    Login
                                </Link>
                                <Link to="/register" className="block px-4 py-2 text-xs font-bold tracking-[0.15em] uppercase text-[#dc2626] hover:bg-[#f5f5f5] transition-colors duration-200">
                                    Register
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMobileMenuOpen && (
                <div className="md:hidden bg-white border-t animate-slide-up">
                    <nav className="max-w-7xl mx-auto px-4 py-6 space-y-4">
                        {navItems.map((item) => (
                            <NavLink
                                key={item.name}
                                to={item.path}
                                className={({ isActive }) =>
                                    `block py-3 text-xs font-bold tracking-[0.15em] uppercase ${isActive ? 'text-[#dc2626]' : 'text-[#0a0a0a]'
                                    }`
                                }
                                onClick={() => setIsMobileMenuOpen(false)}
                            >
                                {item.name}
                            </NavLink>
                        ))}
                    </nav>
                </div>
            )}
        </header>
    );
}
