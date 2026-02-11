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
        <div className="pt-[130px] md:pt-[104px] min-h-screen bg-[#f5f5f5]">
            <div className="max-w-md mx-auto px-4 md:px-6 py-8 md:py-16">
                <div className="bg-white p-6 md:p-8 rounded-lg shadow-sm">
                    <h1 className="text-3xl md:text-4xl font-display text-center mb-2 tracking-wider">
                        Create Account
                    </h1>
                    <p className="text-gray-500 text-center mb-6 md:mb-8 font-light text-sm md:text-base">
                        Join CITYSHADES for exclusive offers
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                    First Name
                                </label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className="input-field w-full"
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
                                    className="input-field w-full"
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
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="input-field w-full"
                                placeholder="********"
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
                                className="input-field w-full"
                                placeholder="********"
                                required
                            />
                        </div>

                        <div className="flex items-start py-2 min-h-[48px]">
                            <input
                                type="checkbox"
                                className="mr-3 w-5 h-5 rounded border-gray-300 mt-0.5 text-[#dc2626] focus:ring-[#dc2626]"
                                required
                            />
                            <span className="text-sm text-gray-600">
                                I agree to the{' '}
                                <Link to="/terms" className="text-[#dc2626] hover:underline">Terms</Link>
                                {' '}and{' '}
                                <Link to="/privacy" className="text-[#dc2626] hover:underline">Privacy Policy</Link>
                            </span>
                        </div>

                        <button type="submit" className="btn-primary w-full py-4 md:py-3 text-base font-bold tracking-widest">
                            Create Account
                        </button>
                    </form>

                    <p className="text-center text-gray-500 mt-6 font-light text-sm">
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
