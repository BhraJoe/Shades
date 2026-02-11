import { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle login logic here
        console.log('Login:', { email, password });
    };

    return (
        <div className="pt-[130px] md:pt-[104px] min-h-screen bg-[#f5f5f5]">
            <div className="max-w-md mx-auto px-4 md:px-6 py-8 md:py-16">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-display text-center mb-2 tracking-wider">
                        Welcome Back
                    </h1>
                    <p className="text-gray-500 text-center mb-6 md:mb-8 font-light text-sm md:text-base">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field w-full"
                                placeholder="your@email.com"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="input-field w-full"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex flex-col gap-4">
                            <label className="flex items-center py-2 min-h-[48px]">
                                <input
                                    type="checkbox"
                                    className="mr-3 w-5 h-5 rounded border-gray-300 text-[#dc2626] focus:ring-[#dc2626]"
                                />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-[#dc2626] hover:underline py-2 min-h-[48px] flex items-center">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="btn-primary w-full py-4 md:py-3 text-base font-bold tracking-widest">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6 font-light text-sm">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-[#dc2626] font-bold hover:underline">
                            Register
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
