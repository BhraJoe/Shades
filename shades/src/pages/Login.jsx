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
        <div className="pt-[88px] md:pt-[104px] min-h-screen bg-[#f5f5f5]">
            <div className="max-w-md mx-auto px-4 md:px-6 py-16">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="section-title text-center mb-2">Welcome Back</h1>
                    <p className="text-gray-500 text-center mb-8 font-light">
                        Sign in to your account
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="input-field"
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
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-center justify-between">
                            <label className="flex items-center">
                                <input type="checkbox" className="mr-2" />
                                <span className="text-sm text-gray-600">Remember me</span>
                            </label>
                            <Link to="/forgot-password" className="text-sm text-[#dc2626] hover:underline">
                                Forgot password?
                            </Link>
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Sign In
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6 font-light">
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
