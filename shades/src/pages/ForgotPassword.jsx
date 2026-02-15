import { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Lock, Check, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState(null);
    const [error, setError] = useState(null);
    const { resetPassword } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setMessage(null);

        try {
            await resetPassword(email);
            setMessage('Password reset email sent! Check your inbox for further instructions.');
        } catch (err) {
            console.error('Password reset error:', err);
            if (err.code === 'auth/user-not-found') {
                setError('No account found with this email address');
            } else if (err.code === 'auth/invalid-email') {
                setError('Invalid email address');
            } else {
                setError('Failed to send password reset email. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12">
            <div className="max-w-md w-full">
                <Link
                    to="/login"
                    className="inline-flex items-center text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                </Link>

                <div className="bg-white rounded-2xl shadow-xl p-8">
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <Lock className="w-8 h-8 text-gray-600" />
                        </div>
                        <h1 className="text-2xl font-bold text-gray-900">
                            Forgot Password
                        </h1>
                        <p className="text-gray-600 mt-2">
                            Enter your email to receive a password reset link
                        </p>
                    </div>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center gap-3 text-red-700">
                            <AlertCircle className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{error}</span>
                        </div>
                    )}

                    {message && (
                        <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center gap-3 text-green-700">
                            <Check className="w-5 h-5 flex-shrink-0" />
                            <span className="text-sm">{message}</span>
                        </div>
                    )}

                    {!message ? (
                        <form onSubmit={handleSubmit}>
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Email Address
                                </label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all"
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    ) : (
                        <div className="text-center">
                            <Link
                                to="/login"
                                className="inline-block w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors"
                            >
                                Go to Login
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
