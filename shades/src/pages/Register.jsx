import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Register() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Register:', formData);
    };

    return (
        <div className="pt-20 md:pt-[104px] min-h-screen bg-[#f5f5f5]">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-104px)]">
                {/* ════════════════════════════════════════════
                    Left — Fashion Image
                ════════════════════════════════════════════ */}
                <div className="hidden lg:block relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1577803645773-f96470509666?w=1200&q=80&auto=format&fit=crop"
                        alt="Designer sunglasses"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f5f5f5]/80" />
                    <div className="absolute bottom-12 left-12 right-12">
                        <p className="text-white/60 font-light text-sm leading-relaxed max-w-sm">
                            "Elegance is not about being noticed, it's about being remembered."
                        </p>
                        <p className="text-white/30 text-xs mt-2 tracking-[0.2em] uppercase">— Giorgio Armani</p>
                    </div>
                </div>

                {/* ════════════════════════════════════════════
                    Right — Register Form
                ════════════════════════════════════════════ */}
                <div className="flex items-center justify-center px-6 py-12 md:py-16">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Join Us</span>
                            <h1 className="font-display text-4xl md:text-5xl text-[#0a0a0a] tracking-wider mb-3">Create Account</h1>
                            <p className="text-gray-400 font-light text-sm">Join CITYSHADES for exclusive offers</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">First Name</label>
                                    <input
                                        type="text" name="firstName" value={formData.firstName} onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder-gray-300"
                                        placeholder="John" required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Last Name</label>
                                    <input
                                        type="text" name="lastName" value={formData.lastName} onChange={handleChange}
                                        className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder-gray-300"
                                        placeholder="Doe" required
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Email</label>
                                <input
                                    type="email" name="email" value={formData.email} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder-gray-300"
                                    placeholder="your@email.com" required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Password</label>
                                <input
                                    type="password" name="password" value={formData.password} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder-gray-300"
                                    placeholder="••••••••" required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">Confirm Password</label>
                                <input
                                    type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder-gray-300"
                                    placeholder="••••••••" required
                                />
                            </div>

                            <div className="flex items-start">
                                <input type="checkbox" className="mr-3 w-4 h-4 mt-0.5 accent-[#dc2626]" required />
                                <span className="text-sm text-gray-500">
                                    I agree to the{' '}
                                    <Link to="/terms" className="text-[#dc2626] hover:text-[#0a0a0a] transition-colors">Terms</Link>
                                    {' '}and{' '}
                                    <Link to="/privacy" className="text-[#dc2626] hover:text-[#0a0a0a] transition-colors">Privacy Policy</Link>
                                </span>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300"
                            >
                                Create Account
                            </button>
                        </form>

                        <p className="text-center text-gray-400 mt-8 font-light text-sm">
                            Already have an account?{' '}
                            <Link to="/login" className="text-[#0a0a0a] font-bold hover:text-[#dc2626] transition-colors">
                                Sign In
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
