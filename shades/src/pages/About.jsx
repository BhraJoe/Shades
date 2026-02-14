import { Link } from 'react-router-dom';
import { Star, Award, Heart, Eye } from 'lucide-react';

export default function About() {
    const values = [
        { icon: Award, title: 'Premium Quality', desc: 'Every pair meets the highest standards of craftsmanship and materials.' },
        { icon: Eye, title: 'Clear Vision', desc: 'We believe style and function should never be compromised.' },
        { icon: Heart, title: 'Sustainable', desc: 'Committed to ethical sourcing and environmentally responsible practices.' },
        { icon: Star, title: 'Customer First', desc: 'Your satisfaction is our top priority with dedicated support.' },
    ];

    const stats = [
        { value: '50+', label: 'Premium Brands' },
        { value: '100K+', label: 'Happy Customers' },
        { value: '15+', label: 'Years Experience' },
        { value: '99%', label: 'Satisfaction Rate' },
    ];

    const team = [
        { name: 'Alexandra Chen', role: 'Founder & CEO', image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=400&q=80&fm=webp' },
        { name: 'Marcus Williams', role: 'Creative Director', image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&fm=webp' },
        { name: 'Sofia Rodriguez', role: 'Head of Buying', image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&fm=webp' },
    ];

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* ════════════════════════════════════════════
                Hero Banner
            ════════════════════════════════════════════ */}
            <section className="relative bg-[#0a0a0a] py-20 md:py-32 overflow-hidden">
                <div className="absolute inset-0 opacity-30">
                    <img
                        src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1920&q=80&auto=format&fit=crop"
                        alt=""
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Since 2009</span>
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wider mb-4">Our Story</h1>
                    <p className="text-white/50 max-w-2xl mx-auto font-light text-sm md:text-base leading-relaxed">
                        Born from a passion for exceptional design and uncompromising quality, CITYSHADES has been your trusted destination for premium designer sunglasses.
                    </p>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                Story Section
            ════════════════════════════════════════════ */}
            <section className="py-16 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 md:gap-16 items-center">
                        <div>
                            <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Where Style Meets Vision</span>
                            <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider mb-6 md:mb-8">The CITYSHADES Journey</h2>
                            <div className="space-y-5 text-gray-500 leading-relaxed font-light text-sm md:text-base">
                                <p>
                                    Founded in 2009, CITYSHADES began with a simple yet ambitious goal: to make
                                    premium eyewear accessible to everyone without compromising on quality or style.
                                </p>
                                <p>
                                    What started as a small boutique in New York City has grown into a curated
                                    destination for eyewear enthusiasts worldwide. We partner with the world's
                                    most respected designers and manufacturers to bring you collections that
                                    blend timeless elegance with contemporary innovation.
                                </p>
                                <p>
                                    Every pair of sunglasses in our collection is hand-selected for its
                                    exceptional craftsmanship, premium materials, and distinctive design.
                                    From iconic classics to cutting-edge designs, we offer only the finest.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-6 items-start">
                            <div className="relative group overflow-hidden rounded-2xl shadow-xl">
                                <img
                                    src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800&q=80"
                                    alt="Our Collection"
                                    className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="text-white text-[10px] font-bold tracking-widest uppercase font-bold">Our Collection</span>
                                </div>
                            </div>
                            <div className="relative group overflow-hidden rounded-2xl shadow-xl mt-12 md:mt-20">
                                <img
                                    src="https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=800&q=80"
                                    alt="Quality Craftsmanship"
                                    className="w-full h-80 md:h-96 object-cover group-hover:scale-110 transition-transform duration-1000"
                                />
                                <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/60 to-transparent">
                                    <span className="text-white text-[10px] font-bold tracking-widest uppercase font-bold">Quality Craftsmanship</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                Values
            ════════════════════════════════════════════ */}
            <section className="py-16 md:py-28 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10 md:mb-14">
                        <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">What We Stand For</span>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider">Our Values</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center p-6 md:p-8 bg-white border border-gray-100 hover:border-gray-200 transition-colors duration-300">
                                <div className="w-14 h-14 mx-auto mb-4 bg-[#0a0a0a] rounded-full flex items-center justify-center">
                                    <value.icon size={22} className="text-white" />
                                </div>
                                <h3 className="font-display text-lg md:text-xl tracking-wider mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-400 font-light leading-relaxed">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                Stats — Dark Banner
            ════════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <span className="text-4xl md:text-5xl lg:text-6xl font-display text-[#dc2626] block mb-2 tracking-wider">{stat.value}</span>
                                <span className="text-[10px] md:text-xs tracking-[0.25em] uppercase text-white/40">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                Team
            ════════════════════════════════════════════ */}
            <section className="py-16 md:py-28 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <div className="text-center mb-10 md:mb-14">
                        <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Meet The Team</span>
                        <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider">Our Leadership</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 md:gap-10 max-w-5xl mx-auto">
                        {team.map((member, index) => (
                            <div key={index} className="text-center group">
                                <div className="w-40 h-40 md:w-52 md:h-52 mx-auto mb-5 overflow-hidden rounded-full border-2 border-transparent group-hover:border-[#dc2626] transition-colors duration-300">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <h3 className="font-display text-xl tracking-wider">{member.name}</h3>
                                <p className="text-[10px] tracking-[0.25em] uppercase text-gray-400 mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                CTA
            ════════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-[#fafafa]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="font-display text-3xl md:text-4xl lg:text-5xl tracking-wider mb-4 md:mb-6">Ready to Find Your Perfect Pair?</h2>
                    <p className="text-gray-400 mb-8 max-w-xl mx-auto font-light text-sm md:text-base">
                        Discover our curated collection of premium sunglasses from the world's most renowned designers.
                    </p>
                    <Link
                        to="/shop"
                        className="inline-block px-10 py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300"
                    >
                        Shop the Collection
                    </Link>
                </div>
            </section>
        </div>
    );
}
