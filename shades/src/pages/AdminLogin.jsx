import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-hot-toast';
import { Eye, EyeOff } from 'lucide-react';

const AdminLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname || '/admin';

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            await login(username, password);
            toast.success('Welcome back, Admin');
            navigate(from, { replace: true });
        } catch (err) {
            toast.error(err.response?.data?.error || 'Login failed');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center p-8">
            <div className="max-w-md w-full bg-white border border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.5)] relative overflow-hidden">
                {/* Decorative Accent */}
                <div className="absolute top-0 left-0 w-full h-1 bg-[#dc2626]" />

                <div className="p-8 sm:p-12 md:p-16 space-y-10 sm:space-y-12">
                    <div className="text-center space-y-4">
                        <h1 className="font-display text-4xl tracking-tighter text-[#0a0a0a]">
                            CITYSHADES<span className="text-[#dc2626]">.</span>
                        </h1>
                        <div className="flex items-center justify-center gap-3">
                            <div className="h-[1px] w-4 bg-gray-200" />
                            <p className="text-gray-400 font-black tracking-[0.4em] uppercase text-[9px]">Admin Portal</p>
                            <div className="h-[1px] w-4 bg-gray-200" />
                        </div>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 px-1">Username</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    required
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-100 focus:border-[#0a0a0a] py-4 pr-4 text-sm focus:outline-none transition-all placeholder:text-gray-200 font-medium"
                                    placeholder="Enter username"
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[9px] font-black tracking-[0.2em] uppercase text-gray-400 px-1">Password</label>
                            <div className="relative group">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    required
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full bg-transparent border-b border-gray-100 focus:border-[#0a0a0a] py-4 pr-12 text-sm focus:outline-none transition-all placeholder:text-gray-200 font-mono tracking-tighter"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-0 top-1/2 -translate-y-1/2 text-gray-300 hover:text-[#0a0a0a] transition-colors"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full bg-[#0a0a0a] text-white py-5 font-bold tracking-[0.3em] uppercase hover:bg-[#dc2626] transition-all disabled:opacity-50 disabled:cursor-not-allowed text-[10px] shadow-lg hover:-translate-y-1 active:translate-y-0"
                        >
                            {isLoading ? 'Accessing...' : 'Access Dashboard'}
                        </button>
                    </form>

                    <div className="pt-6 text-center border-t border-gray-50">
                        <p className="text-[8px] text-gray-300 uppercase tracking-[0.5em] font-bold">
                            Secure Encrypted Session
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminLogin;
