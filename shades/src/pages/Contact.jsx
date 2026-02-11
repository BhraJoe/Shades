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
        <div className="pt-[100px] md:pt-[104px]">
            {/* Header */}
            <div className="bg-[#f5f5f5] py-4 md:py-12">
                <div className="max-w-7xl mx-auto px-4 md:px-6">
                    <h1 className="section-title text-2xl md:text-4xl lg:text-5xl">Contact</h1>
                    <p className="text-gray-500 mt-2 md:mt-4 font-light text-sm md:text-base">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 md:py-12">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-12">
                    {/* Contact Info */}
                    <div className="lg:col-span-1 space-y-4 lg:space-y-8">
                        <div>
                            <h2 className="font-display text-lg md:text-xl mb-4 md:mb-6">Get in Touch</h2>
                            <p className="text-gray-600 mb-4 md:mb-6 font-light text-sm md:text-base">
                                Our team is here to help you find the perfect pair of sunglasses or answer any questions about your order.
                            </p>
                        </div>

                        <div className="space-y-3 md:space-y-6">
                            {/* Email */}
                            <a
                                href="mailto:hello@shades.com"
                                className="flex items-center gap-3 p-3 md:p-0 rounded-lg md:rounded-none touch-target min-h-[60px]"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                                    <Mail size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Email</h3>
                                    <p className="text-gray-600 font-light text-sm">hello@shades.com</p>
                                </div>
                            </a>

                            {/* Phone */}
                            <a
                                href="tel:+15551234567"
                                className="flex items-center gap-3 p-3 md:p-0 rounded-lg md:rounded-none touch-target min-h-[60px]"
                            >
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                                    <Phone size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Phone</h3>
                                    <p className="text-gray-600 font-light text-sm">+1 (555) 123-4567</p>
                                    <p className="text-gray-500 text-xs mt-0.5">Mon-Fri 9am-6pm EST</p>
                                </div>
                            </a>

                            {/* Address */}
                            <div className="flex items-center gap-3 p-3 md:p-0 min-h-[60px]">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                                    <MapPin size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Studio</h3>
                                    <p className="text-gray-600 font-light text-sm">123 Fashion Avenue</p>
                                    <p className="text-gray-600 font-light text-sm">New York, NY 10001</p>
                                </div>
                            </div>

                            {/* Hours */}
                            <div className="flex items-center gap-3 p-3 md:p-0 min-h-[60px]">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-[#f5f5f5] flex items-center justify-center flex-shrink-0">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <h3 className="text-xs font-bold tracking-widest uppercase mb-1">Hours</h3>
                                    <p className="text-gray-600 font-light text-sm">Mon-Fri: 9am - 6pm</p>
                                    <p className="text-gray-600 font-light text-sm">Sat: 10am - 4pm</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-[#f5f5f5] p-5 md:p-8 rounded-lg">
                                <h2 className="font-display text-lg md:text-xl mb-4">Message Sent!</h2>
                                <p className="text-gray-600 mb-5 md:mb-6 font-light text-sm md:text-base">
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="btn-primary w-full md:w-auto h-12 md:h-10"
                                >
                                    Send Another Message
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-5 md:space-y-6">
                                <h2 className="font-display text-lg md:text-xl mb-4 md:mb-6">Send a Message</h2>

                                {/* Name & Email Row */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 md:gap-6">
                                    <div className="touch-target">
                                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                            Name <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="input-field w-full h-12 px-3"
                                            required
                                            aria-required="true"
                                        />
                                    </div>
                                    <div className="touch-target">
                                        <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                            Email <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="input-field w-full h-12 px-3"
                                            required
                                            aria-required="true"
                                        />
                                    </div>
                                </div>

                                {/* Subject */}
                                <div className="touch-target">
                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                        Subject <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleInputChange}
                                        className="input-field w-full h-12 px-3"
                                        required
                                        aria-required="true"
                                    >
                                        <option value="">Select a subject</option>
                                        <option value="order">Order Inquiry</option>
                                        <option value="product">Product Question</option>
                                        <option value="returns">Returns & Exchanges</option>
                                        <option value="wholesale">Wholesale</option>
                                        <option value="other">Other</option>
                                    </select>
                                </div>

                                {/* Message */}
                                <div className="touch-target">
                                    <label className="block text-xs font-bold tracking-widest uppercase mb-2">
                                        Message <span className="text-red-500">*</span>
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        rows="5"
                                        className="input-field w-full resize-none px-3 py-3"
                                        required
                                        aria-required="true"
                                    />
                                </div>

                                {/* Submit Button */}
                                <button
                                    type="submit"
                                    className="btn-primary w-full h-12 md:w-auto md:px-8"
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
