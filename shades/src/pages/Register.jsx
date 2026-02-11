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
        // Handle register logic here
        console.log('Register:', formData);
    };

    return (
        <div className="pt-[88px] md:pt-[104px] min-h-screen bg-[#f5f5f5]">
            <div className="max-w-md mx-auto px-4 md:px-6 py-16">
                <div className="bg-white p-8 rounded-lg shadow-sm">
                    <h1 className="section-title text-center mb-2">Create Account</h1>
                    <p className="text-gray-500 text-center mb-8 font-light">
                        Join CITYSHADES for exclusive offers
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="John"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                    Last Name
                                </label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className="input-field"
                                    placeholder="Doe"
                                    required
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                Confirm Password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="input-field"
                                placeholder="••••••••"
                                required
                            />
                        </div>

                        <div className="flex items-start">
                            <input type="checkbox" className="mt-1 mr-2" required />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/terms" className="text-[#dc2626] hover:underline">
                                    Terms of Service
                                </Link>{' '}
                                and{' '}
                                <Link to="/privacy" className="text-[#dc2626] hover:underline">
                                    Privacy Policy
                                </Link>
                            </span>
                        </div>

                        <button type="submit" className="btn-primary w-full">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6 font-light">
                        Already have an account?{' '}
                        <Link to="/login" className="text-[#dc2626] font-bold hover:underline">
                            Sign In
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    );
}
