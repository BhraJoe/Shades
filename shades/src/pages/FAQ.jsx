import { useState } from 'react';
import { ChevronDown, ChevronUp, Truck, RefreshCw, CreditCard, Package } from 'lucide-react';

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
        <div className="pt-[130px] md:pt-[104px]">
            {/* Hero */}
            <section className="bg-[#f5f5f5] py-8 md:py-16">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <span className="section-subtitle">Help Center</span>
                    <h1 className="section-title mt-2">Frequently Asked Questions</h1>
                    <p className="text-gray-500 mt-4 max-w-2xl mx-auto font-light">
                        Find answers to common questions about shipping, returns, payments, and more.
                    </p>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-12 md:py-24 bg-white">
                <div className="max-w-4xl mx-auto px-4 md:px-6">
                    <div className="space-y-12">
                        {faqCategories.map((category, categoryIndex) => (
                            <div key={categoryIndex}>
                                <div className="flex items-center gap-3 mb-6">
                                    <div className="w-10 h-10 bg-[#f5f5f5] rounded-full flex items-center justify-center">
                                        <category.icon size={20} className="text-[#dc2626]" />
                                    </div>
                                    <h2 className="font-display text-2xl">{category.title}</h2>
                                </div>
                                <div className="space-y-4">
                                    {category.faqs.map((faq, faqIndex) => {
                                        const key = `${categoryIndex}-${faqIndex}`;
                                        const isOpen = openFaqs[key];
                                        return (
                                            <div
                                                key={faqIndex}
                                                className="border border-gray-200 rounded-lg overflow-hidden"
                                            >
                                                <button
                                                    onClick={() => toggleFaq(categoryIndex, faqIndex)}
                                                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-[#f5f5f5] transition-colors duration-200"
                                                >
                                                    <span className="font-medium text-[#0a0a0a] text-sm">{faq.question}</span>
                                                    {isOpen ? (
                                                        <ChevronUp size={20} className="text-[#dc2626]" />
                                                    ) : (
                                                        <ChevronDown size={20} className="text-gray-400" />
                                                    )}
                                                </button>
                                                {isOpen && (
                                                    <div className="px-6 py-4 bg-[#f5f5f5] text-gray-600 leading-relaxed animate-fade-in font-light text-sm">
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

            {/* Contact CTA */}
            <section className="py-12 md:py-24 bg-[#f5f5f5]">
                <div className="max-w-7xl mx-auto px-4 md:px-6 text-center">
                    <h2 className="section-title mb-4">Still Have Questions?</h2>
                    <p className="text-gray-500 mb-8 max-w-2xl mx-auto font-light">
                        Our customer service team is here to help you with any questions or concerns.
                    </p>
                    <a href="/contact" className="btn-primary">
                        Contact Us
                    </a>
                </div>
            </section>
        </div>
    );
}
