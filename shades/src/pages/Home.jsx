import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchBestsellers, fetchNewArrivals, subscribe } from '../api';
import ProductCard from '../components/ProductCard';
import { ArrowRight, ChevronDown, Star } from 'lucide-react';

export default function Home() {
    const [bestsellers, setBestsellers] = useState([]);
    const [newArrivals, setNewArrivals] = useState([]);
    const [email, setEmail] = useState('');
    const [subscribed, setSubscribed] = useState(false);
    const [subscribeError, setSubscribeError] = useState('');

    useEffect(() => {
        async function loadData() {
            try {
                const bestData = await fetchBestsellers();
                const newData = await fetchNewArrivals();
                setBestsellers(bestData.slice(0, 4));
                setNewArrivals(newData.slice(0, 4));
            } catch (error) {
                console.error('Error loading home data:', error);
            }
        }
        loadData();
    }, []);

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
        <div className="bg-white selection:bg-[#dc2626] selection:text-white">
            {/* ════════════════════════════════════════════
                SECTION 01: THE CINEMATIC HERO (KEN BURNS)
            ════════════════════════════════════════════ */}
            <section className="relative h-screen flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 z-0 scale-110">
                    <img
                        src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=1920&q=90&fm=webp"
                        alt="Hero Eyewear"
                        className="w-full h-full object-cover filter brightness-[0.8] hero-zoom"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/40" />
                </div>

                <div className="relative z-10 text-center px-6">
                    <div className="space-y-8">
                        <span className="text-white text-[12px] font-bold tracking-[0.6em] uppercase drop-shadow-lg hero-stagger-1 block">
                            The New Archive
                        </span>
                        <h1 className="font-display text-[14vw] md:text-[10vw] text-white leading-[0.8] tracking-tighter drop-shadow-2xl hero-stagger-2">
                            EYE<br />VISION.
                        </h1>
                        <div className="pt-8 hero-stagger-3">
                            <Link
                                to="/shop"
                                className="inline-flex items-center gap-4 px-12 py-5 bg-white text-black text-xs font-bold tracking-[0.3em] uppercase hover:bg-[#dc2626] hover:text-white transition-all transform hover:scale-105 active:scale-95"
                            >
                                Browse Collections
                                <ArrowRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>

                <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-4 text-white/40 hero-stagger-4">
                    <span className="text-[10px] font-bold tracking-[0.4em] uppercase">Investigate</span>
                    <ChevronDown size={20} className="animate-bounce" />
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 02: EDITORIAL MANIFESTO
            ════════════════════════════════════════════ */}
            <section className="py-32 px-6 flex items-center justify-center text-center bg-white">
                <div className="max-w-4xl space-y-12">
                    <div className="w-12 h-px bg-[#dc2626] mx-auto" />
                    <h2 className="font-serif italic text-3xl md:text-5xl lg:text-6xl text-[#0a0a0a] leading-tight tracking-tight">
                        "We see the world not as it is, but as it could be. Our frames are designed for the eyes that dare to see differently."
                    </h2>
                    <span className="text-[10px] font-bold tracking-[0.5em] uppercase text-gray-400">— THE CITYSHADES PROTOCOL</span>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 03: THE BENTO GRID (COLLECTIONS)
            ════════════════════════════════════════════ */}
            <section className="pb-32 px-4 md:px-8 lg:px-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6 h-auto md:h-[800px]">
                    {/* Large Featured Block */}
                    <Link
                        to="/shop"
                        className="lg:col-span-8 relative group overflow-hidden rounded-3xl bg-gray-100 h-[500px] md:h-full"
                    >
                        <img
                            src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=1200&q=80"
                            alt="Main Collection"
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute bottom-12 left-12 text-white space-y-4">
                            <span className="text-[10px] font-bold tracking-[0.4em] uppercase opacity-70">Signature Series</span>
                            <h3 className="font-display text-5xl md:text-7xl tracking-tighter uppercase">The Visionary.</h3>
                            <span className="inline-block pb-1 border-b border-white text-[10px] font-bold tracking-[0.3em] uppercase">Explore Part I</span>
                        </div>
                    </Link>

                    {/* Smaller Stacked Blocks */}
                    <div className="lg:col-span-4 grid grid-cols-1 gap-6 h-full">
                        <Link
                            to="/shop?new=true"
                            className="relative group overflow-hidden rounded-3xl bg-gray-100 h-[300px] md:h-auto"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800&q=80"
                                alt="New Arrivals"
                                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000"
                            />
                            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center text-white space-y-4 w-full">
                                <h3 className="font-display text-4xl tracking-widest uppercase">New Arrivals</h3>
                                <span className="text-[10px] font-bold tracking-[0.5em] uppercase border border-white px-6 py-2 block w-max mx-auto">Recent Drops</span>
                            </div>
                        </Link>
                        <Link
                            to="/shop"
                            className="relative group overflow-hidden rounded-3xl h-[300px] md:h-auto bg-black"
                        >
                            <img
                                src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=800&q=80"
                                alt="Best Sellers Background"
                                className="w-full h-full object-cover opacity-30 group-hover:opacity-50 transition-opacity duration-1000 group-hover:scale-110 transition-transform"
                            />
                            <div className="absolute inset-0 flex items-center justify-center p-12 text-center flex-col space-y-6 z-10 drop-shadow-2xl">
                                <Star className="text-[#dc2626]" size={32} />
                                <h3 className="font-display text-4xl tracking-widest uppercase text-white">Best Sellers</h3>
                                <p className="text-white/80 text-xs font-light tracking-widest">THE MOST COVETED FRAMES IN THE ARCHIVE.</p>
                                <ArrowRight className="text-white group-hover:translate-x-2 transition-transform" />
                            </div>
                        </Link>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 04: THE BEST SELLER GRID
            ════════════════════════════════════════════ */}
            <section className="py-32 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="flex justify-between items-end mb-16 border-b border-black/5 pb-8">
                        <div className="space-y-2">
                            <span className="text-[#dc2626] text-[10px] font-bold tracking-[0.5em] uppercase">Trending Now</span>
                            <h2 className="font-display text-5xl tracking-tighter">THE ARCHIVE SELECTION</h2>
                        </div>
                        <Link to="/shop" className="text-[10px] font-bold tracking-[0.3em] uppercase hover:text-[#dc2626] transition-colors">View All +</Link>
                    </div>

                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {bestsellers.map((product) => (
                            <div key={product.id} className="animate-in fade-in duration-700">
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                SECTION 05: THE MAILING LIST
            ════════════════════════════════════════════ */}
            <section className="py-32 bg-[#f8f8f8] text-[#0a0a0a]">
                <div className="max-w-4xl mx-auto px-6 text-center space-y-12">
                    <div className="space-y-4">
                        <h2 className="font-display text-5xl md:text-7xl tracking-tighter uppercase leading-none text-black">JOIN THE<br />VISION.</h2>
                        <p className="text-gray-500 font-light text-lg tracking-widest">RECEIVE UPDATES ON RARE DROPS AND EVENTS.</p>
                    </div>

                    {subscribed ? (
                        <div className="py-12 border border-black/10 rounded-full animate-in zoom-in-95 bg-white shadow-sm">
                            <span className="text-xs font-bold tracking-[0.5em] uppercase text-[#dc2626]">Success / Archive Updated</span>
                        </div>
                    ) : (
                        <form onSubmit={handleSubscribe} className="max-w-xl mx-auto">
                            <div className="flex border-b border-black/10 hover:border-black transition-colors">
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="ENTER EMAIL ADDRESS"
                                    className="flex-1 bg-transparent py-6 text-xs font-bold tracking-[0.3em] focus:outline-none placeholder:text-black/20 uppercase"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="px-8 text-black hover:text-[#dc2626] transition-colors"
                                >
                                    <ArrowRight size={24} />
                                </button>
                            </div>
                        </form>
                    )}
                    {subscribeError && <p className="text-[#dc2626] text-[10px] tracking-widest uppercase italic">{subscribeError}</p>}
                </div>
            </section>
        </div >
    );
}
