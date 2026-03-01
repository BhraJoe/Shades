import { Shield, Lock, Eye, Mail, Phone, MapPin } from 'lucide-react';

export default function PrivacyPolicy() {
     return (
          <div className="pt-20 md:pt-[104px]">
               {/* Hero Banner */}
               <section className="relative bg-[#0a0a0a] py-20 md:py-32 overflow-hidden">
                    <div className="absolute inset-0 opacity-30">
                         <img
                              src="https://images.unsplash.com/photo-1556306535-0f09a537f0a3?w=1920&q=80&auto=format&fit=crop"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                         />
                         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 md:px-8 text-center">
                         <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Legal</span>
                         <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wider mb-4">Privacy Policy</h1>
                         <p className="text-white/50 max-w-2xl mx-auto font-light text-sm md:text-base leading-relaxed">
                              Your privacy is important to us. This policy explains how we collect, use, and protect your information.
                         </p>
                    </div>
               </section>

               {/* Content */}
               <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
                    <div className="prose prose-lg max-w-none">
                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Information We Collect</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   We collect information you provide directly to us, including:
                              </p>
                              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                   <li>Name, email address, and phone number when you create an account</li>
                                   <li>Shipping and billing addresses for order fulfillment</li>
                                   <li>Payment information (processed securely through our payment partners)</li>
                                   <li>Communication preferences and customer service interactions</li>
                              </ul>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">How We Use Your Information</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   We use the information we collect to:
                              </p>
                              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                   <li>Process and fulfill your orders</li>
                                   <li>Communicate with you about your orders, products, and services</li>
                                   <li>Provide customer support and respond to your inquiries</li>
                                   <li>Send you marketing communications (with your consent)</li>
                                   <li>Improve our website and services</li>
                                   <li>Prevent fraud and ensure security</li>
                              </ul>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Lock className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Data Security</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                   We implement appropriate technical and organizational measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. All payment transactions are encrypted and processed through secure payment gateways.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">Cookies and Tracking Technologies</h2>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   We use cookies and similar tracking technologies to enhance your browsing experience. You can control cookies through your browser settings, but disabling them may affect certain features of our website.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">Third-Party Services</h2>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   We may share your information with third-party service providers who assist us in operating our website, conducting our business, or servicing you. These parties are obligated to maintain the confidentiality of your information.
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                   Our payment processing is handled by Paystack, which has its own privacy policy governing the handling of payment information.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">Your Rights</h2>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   You have the right to:
                              </p>
                              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                   <li>Access the personal information we hold about you</li>
                                   <li>Request correction of inaccurate personal information</li>
                                   <li>Request deletion of your personal information</li>
                                   <li>Opt-out of marketing communications at any time</li>
                                   <li>Request portability of your personal information</li>
                              </ul>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">Contact Us</h2>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   If you have any questions about this Privacy Policy, please contact us:
                              </p>
                              <div className="space-y-3">
                                   <div className="flex items-center gap-3 text-gray-600">
                                        <Mail className="w-5 h-5 text-[#dc2626]" />
                                        <span>support@cityshades.com</span>
                                   </div>
                                   <div className="flex items-center gap-3 text-gray-600">
                                        <Phone className="w-5 h-5 text-[#dc2626]" />
                                        <span>+1 (555) 123-4567</span>
                                   </div>
                                   <div className="flex items-center gap-3 text-gray-600">
                                        <MapPin className="w-5 h-5 text-[#dc2626]" />
                                        <span>123 Fashion Avenue, New York, NY 10001</span>
                                   </div>
                              </div>
                         </div>

                         <div className="bg-gray-50 border border-gray-100 p-8 md:p-12">
                              <p className="text-gray-500 text-sm leading-relaxed">
                                   Last updated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
                              </p>
                         </div>
                    </div>
               </section>
          </div>
     );
}
