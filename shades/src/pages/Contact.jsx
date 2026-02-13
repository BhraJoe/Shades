import { useState } from 'react';
import { sendContact } from '../api';
import { Mail, Phone, MapPin, Clock, ArrowRight } from 'lucide-react';

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

    const contactInfo = [
        { icon: Mail, title: 'Email', primary: 'hello@shades.com', href: 'mailto:hello@shades.com' },
        { icon: Phone, title: 'Phone', primary: '+1 (555) 123-4567', secondary: 'Mon-Fri 9am-6pm EST', href: 'tel:+15551234567' },
        { icon: MapPin, title: 'Studio', primary: '123 Fashion Avenue', secondary: 'New York, NY 10001' },
        { icon: Clock, title: 'Hours', primary: 'Mon-Fri: 9am - 6pm', secondary: 'Sat: 10am - 4pm' },
    ];

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* ════════════════════════════════════════════
                Dark Hero Header
            ════════════════════════════════════════════ */}
            <div className="bg-[#0a0a0a] py-10 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-8">
                    <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Get In Touch</span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">Contact</h1>
                    <p className="text-white/50 mt-3 font-light text-sm md:text-base">
                        Have questions? We'd love to hear from you.
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 md:px-8 py-10 md:py-16">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 lg:gap-16">
                    {/* ════════════════════════════════════════════
                        Contact Info Cards
                    ════════════════════════════════════════════ */}
                    <div className="lg:col-span-1 space-y-6">
                        <div className="space-y-4">
                            {contactInfo.map((info, index) => {
                                const Wrapper = info.href ? 'a' : 'div';
                                return (
                                    <Wrapper
                                        key={index}
                                        href={info.href}
                                        className="flex items-start gap-4 p-5 border border-gray-100 hover:border-gray-200 transition-colors duration-200 group"
                                    >
                                        <div className="w-10 h-10 bg-[#0a0a0a] flex items-center justify-center flex-shrink-0 group-hover:bg-[#dc2626] transition-colors duration-200">
                                            <info.icon size={16} className="text-white" />
                                        </div>
                                        <div>
                                            <h3 className="text-xs font-bold tracking-[0.2em] uppercase mb-1 text-[#0a0a0a]">{info.title}</h3>
                                            <p className="text-gray-600 font-light text-sm">{info.primary}</p>
                                            {info.secondary && (
                                                <p className="text-gray-400 text-xs mt-0.5 font-light">{info.secondary}</p>
                                            )}
                                        </div>
                                    </Wrapper>
                                );
                            })}
                        </div>
                    </div>

                    {/* ════════════════════════════════════════════
                        Contact Form
                    ════════════════════════════════════════════ */}
                    <div className="lg:col-span-2">
                        {submitted ? (
                            <div className="bg-[#0a0a0a] p-8 md:p-12 text-center">
                                <div className="w-16 h-16 mx-auto mb-5 bg-emerald-500 rounded-full flex items-center justify-center">
                                    <Mail size={24} className="text-white" />
                                </div>
                                <h2 className="font-display text-2xl md:text-3xl text-white tracking-wider mb-3">Message Sent!</h2>
                                <p className="text-white/50 mb-6 font-light text-sm">
                                    Thank you for reaching out. We'll get back to you within 24 hours.
                                </p>
                                <button
                                    onClick={() => setSubmitted(false)}
                                    className="inline-flex items-center gap-2 px-8 py-3 bg-white text-[#0a0a0a] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] hover:text-white transition-colors duration-300"
                                >
                                    Send Another <ArrowRight size={14} />
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <h2 className="font-display text-2xl md:text-3xl tracking-wider mb-2">Send a Message</h2>
                                <p className="text-gray-400 font-light text-sm mb-6">All fields marked with * are required.</p>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                    <div>
                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">
                                            Name <span className="text-[#dc2626]">*</span>
                                        </label>
                                        <input
                                            type="text" name="name" value={formData.name} onChange={handleInputChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">
                                            Email <span className="text-[#dc2626]">*</span>
                                        </label>
                                        <input
                                            type="email" name="email" value={formData.email} onChange={handleInputChange}
                                            className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors"
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">
                                        Subject <span className="text-[#dc2626]">*</span>
                                    </label>
                                    <select
                                        name="subject" value={formData.subject} onChange={handleInputChange}
                                        className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors appearance-none"
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
                                    <label className="block text-xs font-bold tracking-[0.2em] uppercase mb-2">
                                        Message <span className="text-[#dc2626]">*</span>
                                    </label>
                                    <textarea
                                        name="message" value={formData.message} onChange={handleInputChange}
                                        rows="6"
                                        className="w-full px-4 py-3.5 border border-gray-200 bg-transparent text-sm focus:outline-none focus:border-[#0a0a0a] transition-colors resize-none"
                                        required
                                    />
                                </div>

                                <button
                                    type="submit"
                                    className="w-full md:w-auto px-10 py-4 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors duration-300 disabled:opacity-50"
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
