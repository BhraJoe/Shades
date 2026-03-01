import { FileText, Scale, AlertCircle, Check, Truck, RefreshCw, Shield } from 'lucide-react';

export default function TermsOfService() {
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
                         <h1 className="font-display text-5xl md:text-6xl lg:text-7xl text-white tracking-wider mb-4">Terms of Service</h1>
                         <p className="text-white/50 max-w-2xl mx-auto font-light text-sm md:text-base leading-relaxed">
                              Please read these terms carefully before using our website and services.
                         </p>
                    </div>
               </section>

               {/* Content */}
               <section className="max-w-4xl mx-auto px-4 md:px-8 py-16 md:py-24">
                    <div className="prose prose-lg max-w-none">
                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <FileText className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Acceptance of Terms</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed">
                                   By accessing and using the CITYSHADES website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by these terms, please do not use this service.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Scale className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Use License</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   Permission is granted to temporarily use CITYSHADES for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not:
                              </p>
                              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                   <li>Modify or copy the materials</li>
                                   <li>Use the materials for any commercial purpose or public display</li>
                                   <li>Transfer the materials to another person or entity</li>
                                   <li>Attempt to reverse engineer any software contained on the website</li>
                              </ul>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <AlertCircle className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Product Information</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   We strive to provide accurate product descriptions and pricing. However, we cannot guarantee that all information is completely accurate, current, or error-free. If a product is listed at an incorrect price, we reserve the right to cancel orders placed at the incorrect price.
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                   All products are subject to availability. We reserve the right to discontinue any product at any time.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Truck className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Shipping & Delivery</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   Shipping times may vary depending on destination and availability of products. We are not responsible for delays caused by customs, weather, or other circumstances beyond our control.
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                   Risk of loss and title for items purchased pass to you upon delivery to the carrier.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <RefreshCw className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Returns & Refunds</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   We want you to be completely satisfied with your purchase. If for any reason you are not happy with your order, you may return unworn items in original packaging within 30 days of delivery for a full refund or exchange.
                              </p>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   To initiate a return:
                              </p>
                              <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                   <li>Contact our customer service to request a return authorization</li>
                                   <li>Items must be unused, unworn, and in original packaging</li>
                                   <li>Return shipping costs are the responsibility of the customer</li>
                                   <li>Refunds are processed within 5-7 business days of receiving the return</li>
                              </ul>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <div className="flex items-center gap-4 mb-6">
                                   <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center">
                                        <Shield className="w-6 h-6 text-[#dc2626]" />
                                   </div>
                                   <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a]">Account Responsibilities</h2>
                              </div>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   You are responsible for maintaining the confidentiality of your account and password. You agree to accept responsibility for all activities that occur under your account.
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                   You must notify us immediately of any unauthorized use of your account or any other breach of security.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">Limitation of Liability</h2>
                              <p className="text-gray-600 leading-relaxed mb-4">
                                   CITYSHADES shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use of or inability to use the website or products.
                              </p>
                              <p className="text-gray-600 leading-relaxed">
                                   Our total liability shall not exceed the amount paid by you for the products purchased.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">Governing Law</h2>
                              <p className="text-gray-600 leading-relaxed">
                                   These terms and conditions are governed by and construed in accordance with the laws of the State of New York, and you irrevocably submit to the exclusive jurisdiction of the courts in that State.
                              </p>
                         </div>

                         <div className="bg-white border border-gray-100 p-8 md:p-12 shadow-sm mb-8">
                              <h2 className="text-2xl font-display tracking-tight text-[#0a0a0a] mb-6">Changes to Terms</h2>
                              <p className="text-gray-600 leading-relaxed">
                                   We reserve the right to modify these terms at any time. Your continued use of the website following any changes indicates your acceptance of the new terms.
                              </p>
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
