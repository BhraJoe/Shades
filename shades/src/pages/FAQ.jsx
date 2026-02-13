import { useState } from 'react';
import { ChevronDown, ChevronUp, Truck, RefreshCw, CreditCard, Package, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

const faqCategories = [
    {
        title: 'Shipping & Delivery',
        icon: Truck,
        faqs: [
            { question: 'How long does shipping take?', answer: 'Standard shipping within the US takes 3-5 business days. Express shipping (1-2 business days) is available at checkout. International shipping typically takes 7-14 business days depending on customs clearance.' },
            { question: 'Do you offer free shipping?', answer: 'Yes! We offer free standard shipping on all US orders over $150. For orders under $150, a flat rate of $7.95 applies.' },
            { question: 'Where do you ship to?', answer: 'We ship to the United States, Canada, United Kingdom, European Union, Australia, and select other countries. Check our shipping page for the full list.' },
            { question: 'How can I track my order?', answer: "Once your order ships, you'll receive an email with a tracking number. You can also track your order by logging into your account." }
        ]
    },
    {
        title: 'Returns & Exchanges',
        icon: RefreshCw,
        faqs: [
            { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for unworn, unused items in original condition with tags attached. Returns are free for US customers.' },
            { question: 'How do I initiate a return?', answer: 'Log into your account, go to Order History, and select the order you wish to return. Click "Start Return" and follow the instructions to print your prepaid shipping label.' },
            { question: 'Can I exchange my purchase?', answer: 'Yes! You can exchange your purchase for a different color or size. Select "Exchange" when initiating your return and choose your preferred replacement.' },
            { question: 'When will I receive my refund?', answer: 'Refunds are processed within 5-7 business days after we receive your return. You will receive an email confirmation once your refund is processed.' }
        ]
    },
    {
        title: 'Payment & Pricing',
        icon: CreditCard,
        faqs: [
            { question: 'What payment methods do you accept?', answer: 'We accept Visa, Mastercard, American Express, Discover, PayPal, Apple Pay, Google Pay, and CITYSHADES gift cards.' },
            { question: 'Is my payment information secure?', answer: 'Absolutely. All payments are processed through encrypted, secure connections. We never store your full credit card details.' },
            { question: 'Do you offer payment plans?', answer: 'Yes! We offer Afterpay and Klarna for US customers, allowing you to pay in 4 interest-free installments.' },
            { question: 'Are prices subject to change?', answer: 'Prices are as listed at the time of purchase. If a price changes after you add an item to your cart, the new price will be reflected at checkout.' }
        ]
    },
    {
        title: 'Product & Care',
        icon: Package,
        faqs: [
            { question: 'How do I care for my sunglasses?', answer: 'Use the provided cleaning cloth to clean lenses. Avoid using paper towels or clothing as they can scratch the lenses. Store in your case when not in use. Avoid extreme heat.' },
            { question: 'What is the warranty on your sunglasses?', answer: 'All sunglasses come with a 2-year warranty covering manufacturer defects. Accidental damage is not covered under warranty.' },
            { question: 'Do you offer prescription sunglasses?', answer: 'Yes! We offer prescription options for many of our styles. Select "Add Prescription" when viewing a product to explore options.' },
            { question: 'How do I find my size?', answer: 'Check our Size Guide for detailed measurements. Most of our styles are "One Size" or come in standard sizes. You can also visit us in-store for a professional fitting.' }
        ]
    }
];

export default function FAQ() {
    const [openFaqs, setOpenFaqs] = useState({});

    const toggleFaq = (categoryIndex, faqIndex) => {
        const key = `${categoryIndex}-${faqIndex}`;
        setOpenFaqs(prev => ({ ...prev, [key]: !prev[key] }));
    };

    return (
        <div className="pt-20 md:pt-[104px]">
            {/* ════════════════════════════════════════════
                Dark Hero Header
            ════════════════════════════════════════════ */}
            <section className="bg-[#0a0a0a] py-14 md:py-20">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Help Center</span>
                    <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider mb-4">Frequently Asked Questions</h1>
                    <p className="text-white/40 max-w-2xl mx-auto font-light text-sm md:text-base">
                        Find answers to common questions about shipping, returns, payments, and more.
                    </p>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                FAQ Content
            ════════════════════════════════════════════ */}
            <section className="py-12 md:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 md:px-8">
                    <div className="space-y-10 md:space-y-14">
                        {faqCategories.map((category, categoryIndex) => (
                            <div key={categoryIndex}>
                                <div className="flex items-center gap-3 mb-5 md:mb-6">
                                    <div className="w-10 h-10 bg-[#0a0a0a] rounded-full flex items-center justify-center flex-shrink-0">
                                        <category.icon size={16} className="text-white" />
                                    </div>
                                    <h2 className="font-display text-2xl md:text-3xl tracking-wider">{category.title}</h2>
                                </div>
                                <div className="space-y-3">
                                    {category.faqs.map((faq, faqIndex) => {
                                        const key = `${categoryIndex}-${faqIndex}`;
                                        const isOpen = openFaqs[key];
                                        return (
                                            <div
                                                key={faqIndex}
                                                className={`border transition-colors duration-200 ${isOpen ? 'border-[#0a0a0a]' : 'border-gray-100 hover:border-gray-200'}`}
                                            >
                                                <button
                                                    onClick={() => toggleFaq(categoryIndex, faqIndex)}
                                                    className="w-full px-5 md:px-6 py-4 text-left flex items-center justify-between min-h-[52px]"
                                                    aria-expanded={isOpen}
                                                >
                                                    <span className="font-medium text-[#0a0a0a] text-sm pr-4">{faq.question}</span>
                                                    <div className={`w-8 h-8 flex items-center justify-center flex-shrink-0 transition-colors duration-200 ${isOpen ? 'text-[#dc2626]' : 'text-gray-300'}`}>
                                                        {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                                                    </div>
                                                </button>
                                                {isOpen && (
                                                    <div className="px-5 md:px-6 pb-5 text-gray-500 leading-relaxed font-light text-sm animate-fade-in">
                                                        {faq.answer}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ════════════════════════════════════════════
                Contact CTA
            ════════════════════════════════════════════ */}
            <section className="py-16 md:py-24 bg-[#0a0a0a]">
                <div className="max-w-7xl mx-auto px-4 md:px-8 text-center">
                    <h2 className="font-display text-3xl md:text-4xl text-white tracking-wider mb-4">Still Have Questions?</h2>
                    <p className="text-white/40 mb-8 max-w-2xl mx-auto font-light text-sm md:text-base">
                        Our customer service team is here to help you with any questions or concerns.
                    </p>
                    <Link
                        to="/contact"
                        className="inline-flex items-center gap-2 px-10 py-4 bg-white text-[#0a0a0a] text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] hover:text-white transition-colors duration-300"
                    >
                        Contact Us <ArrowRight size={14} />
                    </Link>
                </div>
            </section>
        </div>
    );
}
