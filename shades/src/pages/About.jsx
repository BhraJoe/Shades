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
        <div className="pt-[100px] md:pt-[104px]">
            {/* Story Section */}
            <section className="py-10 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-16 items-start">
                        <div>
                            <span className="section-subtitle">Our Story</span>
                            <h2 className="section-title mt-2 mb-4 md:mb-6">Where Style Meets Vision</h2>
                            <div className="space-y-4 text-gray-600 leading-relaxed font-light text-sm md:text-base">
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
                                    From iconic classics to cutting-edge designs, we offer only
                                    the finest.
                                </p>
                            </div>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                            <img
                                src="https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=400&q=80&fm=webp"
                                alt="Our Collection"
                                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg"
                                width="400"
                                height="256"
                                loading="lazy"
                                decoding="async"
                            />
                            <img
                                src="https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=400&q=80&fm=webp"
                                alt="Quality Craftsmanship"
                                className="w-full h-48 sm:h-56 md:h-64 object-cover rounded-lg sm:mt-4 md:mt-8"
                                width="400"
                                height="256"
                                loading="lazy"
                                decoding="async"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values */}
            <section className="py-10 md:py-24 bg-[#f5f5f5]">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <span className="section-subtitle">What We Stand For</span>
                        <h2 className="section-title mt-2">Our Values</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {values.map((value, index) => (
                            <div key={index} className="text-center p-4 md:p-6">
                                <div className="w-14 h-14 md:w-16 md:h-16 mx-auto mb-3 md:mb-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                                    <value.icon size={24} md:size={28} className="text-[#dc2626]" />
                                </div>
                                <h3 className="font-display text-lg md:text-xl mb-2">{value.title}</h3>
                                <p className="text-sm text-gray-500 font-light">{value.desc}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-10 md:py-24 bg-[#0a0a0a] text-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
                        {stats.map((stat, index) => (
                            <div key={index} className="text-center">
                                <span className="text-3xl md:text-4xl lg:text-5xl font-display text-[#dc2626] block mb-2 tracking-wide">{stat.value}</span>
                                <span className="text-xs tracking-[0.2em] uppercase text-gray-400">{stat.label}</span>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="py-10 md:py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <div className="text-center mb-8 md:mb-12">
                        <span className="section-subtitle">Meet The Team</span>
                        <h2 className="section-title mt-2">Our Leadership</h2>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {team.map((member, index) => (
                            <div key={index} className="text-center px-2">
                                <div className="w-36 h-36 sm:w-40 sm:h-40 md:w-48 md:h-48 mx-auto mb-4 overflow-hidden rounded-full">
                                    <img
                                        src={member.image}
                                        alt={member.name}
                                        className="w-full h-full object-cover"
                                        width="192"
                                        height="192"
                                        loading="lazy"
                                        decoding="async"
                                    />
                                </div>
                                <h3 className="font-display text-lg md:text-xl">{member.name}</h3>
                                <p className="text-xs tracking-[0.2em] uppercase text-gray-500 mt-1">{member.role}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-10 md:py-24 bg-[#f5f5f5]">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="section-title mb-4 md:mb-6">Ready to Find Your Perfect Pair?</h2>
                    <p className="text-gray-500 mb-6 md:mb-8 max-w-xl mx-auto font-light text-sm md:text-base">
                        Discover our curated collection of premium sunglasses from the world's most renowned designers.
                    </p>
                    <Link
                        to="/shop"
                        className="btn-primary inline-block w-full md:w-auto min-h-[48px] md:min-h-auto"
                    >
                        Shop the Collection
                    </Link>
                </div>
            </section>
        </div>
    );
}
