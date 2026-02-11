import { useState } from 'react';
import { sendContact } from '../api';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function Contact() {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
        message: ''
    });
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await sendContact(formData);
            setSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' });
        } catch (error) {
            console.error('Error sending message:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e) => {
        setFormData(prev => ({
            ...prev,
            [e.target.name]: e.target.value
        }));
    };

    return (
        <div className="pt-[88px] md:pt-[104px]">
            {/* Header */}
            <div className="bg-[#f5f5f5] py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className="section-title">Contact</h1>
                    <p className="text-gray-500 mt-4 font-light">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-8">
                        <div>
                            <h2 className="font-display text-xl mb-6">Get in Touch</h2>
                            <p className="text-gray-600 mb-6 font-light">
                                Our team is here to help you find the perfect pair of sunglasses or answer any questions about your order.
                            </p>
                        </div>

                        <div className="space-y-6">
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#f5f5f5] flex items-center justify-center">
                                    <Mail size={18} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Email</h3>
                                    <p className="text-gray-600 font-light">hello@shades.com</p>
                                    <p className="text-gray-600 font-light">support@shades.com</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#f5f5f5] flex items-center justify-center">
                                    <Phone size={18} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Phone</h3>
                                    <p className="text-gray-600 font-light">+1 (555) 123-4567</p>
                                    <p className="text-gray-500 text-xs mt-1">Mon-Fri 9am-6pm EST</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#f5f5f5] flex items-center justify-center">
                                    <MapPin size={18} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Studio</h3>
                                    <p className="text-gray-600 font-light">123 Fashion Avenue</p>
                                    <p className="text-gray-600 font-light">New York, NY 10001</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 bg-[#f5f5f5] flex items-center justify-center">
                                    <Clock size={18} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Hours</h3>
                                    <p className="text-gray-600 font-light">Mon-Fri: 9am - 6pm</p>
                                    <p className="text-gray-600 font-light">Sat: 10am - 4pm</p>
                                    <p className="text-gray-600 font-light">Sun: Closed</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-[#f5f5f5] p-8">
                                <h2 className="font-display text-xl mb-4">Message Sent!</h2>
                                <p className="text-gray-600 mb-4 font-light">
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-primary"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="font-display text-xl mb-6">Send a Message</h2>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">Email</label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-field"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Subject</label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="input-field"
                                        required
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="order">Order Inquiry</option>
                                        <option value="product">Product Question</option>
                                        <option value="returns">Returns & Exchanges</option>
                                        <option value="wholesale">Wholesale</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">Message</label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="6"
                                        className="input-field resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="btn-primary"
                                    disabled={loading}
                                >
                                    {loading ? 'Sending...' : 'Send Message'}
                                </button>
                            </form>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
