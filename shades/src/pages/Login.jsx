import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('Login:', { email, password });
    };

    return (
        <div className="pt-20 md:pt-[104px] min-h-screen bg-[#f5f5f5]">
            <div className="grid grid-cols-1 lg:grid-cols-2 min-h-[calc(100vh-80px)] md:min-h-[calc(100vh-104px)]">
                {/* ════════════════════════════════════════════
                    Left — Fashion Image
                ════════════════════════════════════════════ */}
                <div className="hidden lg:block relative overflow-hidden">
                    <img
                        src="https://images.unsplash.com/photo-1508296695146-257a814070b4?w=1200&q=80&auto=format&fit=crop"
                        alt="Premium sunglasses"
                        className="w-full h-full object-cover"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#f5f5f5]/80" />
                    <div className="absolute bottom-12 left-12 right-12">
                        <p className="text-white/60 font-light text-sm leading-relaxed max-w-sm">
                            "Style is a way to say who you are without having to speak."
                        </p>
                        <p className="text-white/30 text-xs mt-2 tracking-[0.2em] uppercase">— Rachel Zoe</p>
                    </div>
                </div>

                {/* ════════════════════════════════════════════
                    Right — Login Form
                ════════════════════════════════════════════ */}
                <div className="flex items-center justify-center px-6 py-12 md:py-16">
                    <div className="w-full max-w-md">
                        <div className="text-center mb-10">
                            <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Account</span>
                            <h1 className="font-display text-4xl md:text-5xl text-[#0a0a0a] tracking-wider mb-3">Welcome Back</h1>
                            <p className="text-gray-400 font-light text-sm">Sign in to your account</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder-gray-300"
                                    placeholder="your@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2 text-gray-500">
                                    Password
                                </label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3.5 bg-white border border-gray-200 text-[#0a0a0a] text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors placeholder-gray-300"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <div className="flex items-center justify-between">
                                <label className="flex items-center cursor-pointer">
                                    <input type="checkbox" className="mr-2 w-4 h-4 accent-[#dc2626]" />
                                    <span className="text-sm text-gray-500">Remember me</span>
                                </label>
                                <Link to="/forgot-password" className="text-sm text-[#dc2626] hover:text-[#0a0a0a] transition-colors">
                                    Forgot password?
                                </Link>
                            </div>

                            <button
                                type="submit"
                                className="w-full py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300"
                            >
                                Sign In
                            </button>
                        </form>

                        <p className="text-center text-gray-400 mt-8 font-light text-sm">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-[#0a0a0a] font-bold hover:text-[#dc2626] transition-colors">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
