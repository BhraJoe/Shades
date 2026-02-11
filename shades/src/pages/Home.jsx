import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { fetchBestsellers, fetchNewArrivals, subscribe } from '../api';

export default function Home() {
    const [bestsellers, setBestsellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [loading, setLoading] = useState(true);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState('');

    // Pagination for infinite scroll
    const [displayedBestsellers, setDisplayedBestsellers] = useState([]);
    const BESTSELLERS_PER_PAGE = 4;

    const [displayedNewArrivals, setDisplayedNewArrivals] = useState([]);
    const NEWARRIVALS_PER_PAGE = 4;

    // Refs for intersection observer
    const bestsellersObserver = useRef(null);
    const newArrivalsObserver = useRef(null);
    const bestsellersLoadMoreRef = useRef(null);
    const newArrivalsLoadMoreRef = useRef(null);

    useEffect(() => {
        async function loadData() {
            try {
                const [bests, news] = await Promise.all([
                    fetchBestsellers(),
                    fetchNewArrivals()
                ]);
                setBestsellers(bests);
                setNewArrivals(news);
                setDisplayedBestsellers(bests.slice(0, BESTSELLERS_PER_PAGE));
                setDisplayedNewArrivals(news.slice(0, NEWARRIVALS_PER_PAGE));
            } catch (error) {
                console.error('Error loading data:', error);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Intersection Observer for automatic infinite scroll
    useEffect(() => {
        // Cleanup previous observers
        if (bestsellersObserver.current) bestsellersObserver.current.disconnect();
        if (newArrivalsObserver.current) newArrivalsObserver.current.disconnect();

        // Best Sellers observer
        bestsellersObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && displayedBestsellers.length < bestsellers.length) {
                setDisplayedBestsellers(prev => bestsellers.slice(0, prev.length + BESTSELLERS_PER_PAGE));
            }
        });
        if (bestsellersLoadMoreRef.current) {
            bestsellersObserver.current.observe(bestsellersLoadMoreRef.current);
        }

        // New Arrivals observer
        newArrivalsObserver.current = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting && displayedNewArrivals.length < newArrivals.length) {
                setDisplayedNewArrivals(prev => newArrivals.slice(0, prev.length + NEWARRIVALS_PER_PAGE));
            }
        });
        if (newArrivalsLoadMoreRef.current) {
            newArrivalsObserver.current.observe(newArrivalsLoadMoreRef.current);
        }

        return () => {
            if (bestsellersObserver.current) bestsellersObserver.current.disconnect();
            if (newArrivalsObserver.current) newArrivalsObserver.current.disconnect();
        };
    }, [displayedBestsellers, displayedNewArrivals, bestsellers, newArrivals]);

    const handleSubscribe = async (e) => {
        e.preventDefault();
        setSubscribeError('');
        try {
            await subscribe(email);
            setSubscribed(true);
            setEmail('');
        } catch (error) {
            setSubscribeError('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="pt-[88px] md:pt-[104px]">
            {/* Hero Section */}
            <section className="relative h-[70vh] md:h-[85vh] min-h-[500px] md:min-h-[600px] overflow-hidden">
                <img
                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&q=80&fm=webp"
                    alt="CITYSHADES Collection"
                    className="absolute inset-0 w-full h-full object-cover"
                    width="1920"
                    height="1080"
                    fetchpriority="high"
                    decoding="async"
                />
                <div className="hero-overlay" />

                <div className="relative z-10 h-full flex flex-col justify-center items-start max-w-7xl mx-auto px-4 md:px-6">
                    <span className="animate-fadeIn text-white text-xs tracking-[0.3em] uppercase mb-3 md:mb-4">
                        Premium Eyewear
                    </span>
                    <h1 className="animate-slideUp font-display text-4xl md:text-6xl lg:text-8xl text-white mb-4 md:mb-6 leading-none">
                        CITYSHADES
                    </h1>
                    <p className="animate-slideUp animation-delay-200 text-white/90 text-sm md:text-lg max-w-md md:max-w-xl mb-5 md:mb-6 font-light leading-relaxed">
                        Your destination for designer sunglasses and premium eyewear.
                    </p>
                    <div className="animate-slideUp animation-delay-300 mb-8 md:mb-10 grid grid-cols-2 gap-2 md:gap-4 text-xs md:text-sm">
                        <div className="flex items-center gap-2 text-white/80">
                            <span className="w-2 h-2 bg-[#dc2626] rounded-full"></span>
                            Designer Brands
                        </div>
                        <div className="flex items-center gap-2 text-white/80">
                            <span className="w-2 h-2 bg-[#dc2626] rounded-full"></span>
                            100% UV Protection
                        </div>
                    </div>
                    <Link
                        to="/shop"
                        className="animate-slideUp animation-delay-400 btn-primary bg-white text-[#0a0a0a] hover:bg-[#dc2626] hover:text-white border-none text-sm md:text-base"
                    >
                        Shop the Collection
                    </Link>
                </div>
            </section>

            {/* Featured Collections */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h2 className="section-title text-center mb-16">Collections</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {/* Men's Collection */}
                        <Link to="/shop?gender=men" className="collection-card aspect-[3/4] group">
                            <img
                                src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=600&q=80&fm=webp"
                                alt="Men's Collection"
                                className="w-full h-full object-cover"
                                width="600"
                                height="800"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                                <h3 className="font-display text-4xl text-white mb-2">Men</h3>
                                <span className="text-white text-xs tracking-widest uppercase group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all duration-300">
                                    Shop Now →
                                </span>
                            </div>
                        </Link>

                        {/* Women's Collection */}
                        <Link to="/shop?gender=women" className="collection-card aspect-[3/4] group">
                            <img
                                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80&fm=webp"
                                alt="Women's Collection"
                                className="w-full h-full object-cover"
                                width="600"
                                height="800"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                                <h3 className="font-display text-4xl text-white mb-2">Women</h3>
                                <span className="text-white text-xs tracking-widest uppercase group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all duration-300">
                                    Shop Now →
                                </span>
                            </div>
                        </Link>

                        {/* New Arrivals */}
                        <Link to="/shop?new=true" className="collection-card aspect-[3/4] group">
                            <img
                                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&fm=webp"
                                alt="New Arrivals"
                                className="w-full h-full object-cover"
                                width="600"
                                height="800"
                                loading="lazy"
                                decoding="async"
                            />
                            <div className="absolute inset-0 bg-black/30 flex flex-col items-center justify-center">
                                <span className="badge mb-3">Just In</span>
                                <h3 className="font-display text-4xl text-white mb-2">New Arrivals</h3>
                                <span className="text-white text-xs tracking-widest uppercase group-hover:text-[#dc2626] group-hover:translate-x-1 transition-all duration-300">
                                    Explore →
                                </span>
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Categories */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h2 className="section-title text-center mb-4">Shop by Style</h2>
                    <p className="text-gray-500 text-center mb-12 font-light">Find your perfect look</p>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                        {/* Aviators */}
                        <Link to="/shop?category=aviators" className="group">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80&fm=webp"
                                    alt="Aviators"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    width="400"
                                    height="533"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="text-xs tracking-widest uppercase font-medium text-gray-700 group-hover:text-[#dc2626] transition-colors duration-300">Aviators</span>
                        </Link>

                        {/* Wayfarers */}
                        <Link to="/shop?category=wayfarers" className="group">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80&fm=webp"
                                    alt="Wayfarers"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    width="400"
                                    height="533"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="text-xs tracking-widest uppercase font-medium text-gray-700 group-hover:text-[#dc2626] transition-colors duration-300">Wayfarers</span>
                        </Link>

                        {/* Cat-Eye */}
                        <Link to="/shop?category=cat-eye" className="group">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=400&q=80&fm=webp"
                                    alt="Cat-Eye"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    width="400"
                                    height="533"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="text-xs tracking-widest uppercase font-medium text-gray-700 group-hover:text-[#dc2626] transition-colors duration-300">Cat-Eye</span>
                        </Link>

                        {/* Round */}
                        <Link to="/shop?category=round" className="group">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=400&q=80&fm=webp"
                                    alt="Round"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    width="400"
                                    height="533"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="text-xs tracking-widest uppercase font-medium text-gray-700 group-hover:text-[#dc2626] transition-colors duration-300">Round</span>
                        </Link>

                        {/* Sport */}
                        <Link to="/shop?category=sport" className="group">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80&fm=webp"
                                    alt="Sport"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    width="400"
                                    height="533"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="text-xs tracking-widest uppercase font-medium text-gray-700 group-hover:text-[#dc2626] transition-colors duration-300">Sport</span>
                        </Link>

                        {/* Retro */}
                        <Link to="/shop?category=retro" className="group">
                            <div className="aspect-[3/4] overflow-hidden rounded-lg mb-3">
                                <img
                                    src="https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&q=80&fm=webp"
                                    alt="Retro"
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                    width="400"
                                    height="533"
                                    loading="lazy"
                                    decoding="async"
                                />
                            </div>
                            <span className="text-xs tracking-widest uppercase font-medium text-gray-700 group-hover:text-[#dc2626] transition-colors duration-300">Retro</span>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Best Sellers */}
            <section className="py-24 bg-[#f5f5f5]">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between mb-12">
                        <h2 className="section-title">Best Sellers</h2>
                        <Link to="/shop?bestseller=true" className="text-xs font-bold tracking-widest uppercase hover:text-[#dc2626] transition-colors duration-200">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="product-card">
                                    <div className="aspect-[3/4] skeleton" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-3 skeleton w-1/3" />
                                        <div className="h-4 skeleton w-2/3" />
                                        <div className="h-4 skeleton w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayedBestsellers.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Auto-load trigger for Best Sellers */}
                    {displayedBestsellers.length > 0 && displayedBestsellers.length < bestsellers.length && (
                        <div ref={bestsellersLoadMoreRef} className="h-20 flex items-center justify-center mt-4">
                            <span className="text-gray-400 text-sm font-light">Loading more...</span>
                        </div>
                    )}

                    {displayedBestsellers.length >= bestsellers.length && bestsellers.length > 0 && (
                        <p className="text-center text-gray-500 mt-8 font-light">
                            Showing all {displayedBestsellers.length} bestsellers
                        </p>
                    )}
                </div>
            </section>

            {/* New Arrivals */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="flex items-center justify-between mb-12">
                        <div>
                            <h2 className="section-title">New Arrivals</h2>
                            <p className="text-gray-500 mt-2 text-sm font-light">Fresh styles just dropped</p>
                        </div>
                        <Link to="/shop?new=true" className="text-xs font-bold tracking-widest uppercase hover:text-[#dc2626] transition-colors duration-200">
                            View All →
                        </Link>
                    </div>

                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {[...Array(4)].map((_, i) => (
                                <div key={i} className="product-card">
                                    <div className="aspect-[3/4] skeleton" />
                                    <div className="p-4 space-y-2">
                                        <div className="h-3 skeleton w-1/3" />
                                        <div className="h-4 skeleton w-2/3" />
                                        <div className="h-4 skeleton w-1/4" />
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {displayedNewArrivals.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>
                    )}

                    {/* Auto-load trigger for New Arrivals */}
                    {displayedNewArrivals.length > 0 && displayedNewArrivals.length < newArrivals.length && (
                        <div ref={newArrivalsLoadMoreRef} className="h-20 flex items-center justify-center mt-4">
                            <span className="text-gray-400 text-sm font-light">Loading more...</span>
                        </div>
                    )}

                    {displayedNewArrivals.length >= newArrivals.length && newArrivals.length > 0 && (
                        <p className="text-center text-gray-500 mt-8 font-light">
                            Showing all {displayedNewArrivals.length} new arrivals
                        </p>
                    )}
                </div>
            </section>

            {/* Brand Story */}
            <section className="py-24 bg-[#0a0a0a] text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="order-2 lg:order-1">
                            <span className="text-[#dc2626] text-xs tracking-[0.3em] uppercase mb-4 block">Our Story</span>
                            <h2 className="font-display text-4xl md:text-5xl mb-6">Crafted for the Bold</h2>
                            <p className="text-gray-400 mb-6 leading-relaxed font-light">
                                At CITYSHADES, we believe that eyewear is more than just a accessory—it's a statement.
                                Our curated collection brings together the world's finest designers, ensuring every pair
                                tells a story of craftsmanship, innovation, and timeless style.
                            </p>
                            <p className="text-gray-400 mb-8 leading-relaxed font-light">
                                From the streets of Milan to the boulevards of New York, our sunglasses are worn by those
                                who dare to stand out. Each piece in our collection is carefully selected to embody the
                                perfect balance of form and function.
                            </p>
                            <Link to="/about" className="btn-secondary border-white text-white hover:bg-white hover:text-[#0a0a0a]">
                                Discover Our Story
                            </Link>
                        </div>
                        <div className="order-1 lg:order-2 grid grid-cols-2 gap-4">
                            <img
                                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=600&q=80&fm=webp"
                                alt="Craftsmanship"
                                className="aspect-[3/4] object-cover"
                                width="600"
                                height="800"
                                loading="lazy"
                                decoding="async"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&q=80&fm=webp"
                                alt="Style"
                                className="aspect-[3/4] object-cover mt-8"
                                width="600"
                                height="800"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Newsletter */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="max-w-2xl mx-auto text-center">
                        <h2 className="section-title mb-4">Join the Club</h2>
                        <p className="text-gray-500 mb-8 font-light">
                            Subscribe to our newsletter for exclusive offers, new arrivals, and style inspiration.
                        </p>

                        {subscribed ? (
                            <div className="bg-[#f5f5f5] p-6">
                                <p className="text-[#dc2626] font-medium">✓ You're on the list!</p>
                                <p className="text-gray-500 text-sm mt-2 font-light">Keep an eye on your inbox for special offers.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-4">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="input-field flex-1"
                                    required
                                />
                                <button type="submit" className="btn-primary whitespace-nowrap">
                                    Subscribe
                                </button>
                            </form>
                        )}

                        {subscribeError && (
                            <p className="text-[#dc2626] text-sm mt-4">{subscribeError}</p>
                        )}

                        <p className="text-[10px] text-gray-400 mt-4 font-light">
                            By subscribing, you agree to our Privacy Policy and consent to receive updates.
                        </p>
                    </div>
                </div>
            </section>
        </div>
    );
}
