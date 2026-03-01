import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ReturnsExchanges() {
     return (
          <div className="pt-20 md:pt-[104px]">
               {/* Header */}
               <section className="relative bg-[#0a0a0a] py-14 md:py-20 overflow-hidden">
                    <div className="absolute inset-0 opacity-20">
                         <img
                              src="https://images.unsplash.com/photo-1572635196237-14b3f281503f?w=1920&q=80&auto=format&fit=crop"
                              alt=""
                              className="w-full h-full object-cover"
                              loading="lazy"
                         />
                         <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
                    </div>
                    <div className="relative max-w-7xl mx-auto px-4 md:px-8">
                         <Link
                              to="/shop"
                              className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
                         >
                              <ArrowLeft size={18} />
                              <span className="text-sm font-medium">Back to Shop</span>
                         </Link>
                         <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Information</span>
                         <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">Returns & Exchanges</h1>
                    </div>
               </section>

               {/* Content */}
               <section className="py-16 md:py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-4 md:px-8">
                         <div className="space-y-12">
                              {/* Our Policy */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Our Return Policy</h2>
                                   <p className="text-gray-600 leading-relaxed mb-4">
                                        We want you to love your new sunglasses! If you're not completely satisfied, you may return or exchange your purchase within 14 days of delivery.
                                   </p>
                                   <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                        <li>Items must be unworn and in original condition</li>
                                        <li>All tags and packaging must be intact</li>
                                        <li>Proof of purchase required</li>
                                   </ul>
                              </div>

                              {/* What to Do */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">How to Return</h2>
                                   <p className="text-gray-600 leading-relaxed mb-4">
                                        To initiate a return, please follow these steps:
                                   </p>
                                   <ol className="list-decimal pl-6 text-gray-600 space-y-2">
                                        <li>Contact our customer service team to request a return authorization</li>
                                        <li>Package the item securely in original packaging</li>
                                        <li>Ship the item back to us using our provided return label</li>
                                        <li>Refunds are processed within 5-7 business days of receiving the return</li>
                                   </ol>
                              </div>

                              {/* Exchanges */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Exchanges</h2>
                                   <p className="text-gray-600 leading-relaxed">
                                        Need a different size or style? We offer free exchanges for size issues. Simply contact us to request an exchange, and we'll ship your new item as soon as we receive your return.
                                   </p>
                              </div>

                              {/* Defective Items */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Defective or Damaged Items</h2>
                                   <p className="text-gray-600 leading-relaxed">
                                        If your sunglasses arrive defective or damaged, please contact us immediately. We'll arrange a replacement or full refund at no cost to you. Please include photos of the damage when contacting us.
                                   </p>
                              </div>

                              {/* Refunds */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Refunds</h2>
                                   <p className="text-gray-600 leading-relaxed">
                                        Refunds are issued to your original payment method. Please allow 5-7 business days for the refund to appear in your account after processing.
                                   </p>
                              </div>

                              {/* Contact */}
                              <div className="bg-gray-50 p-8 rounded-xl">
                                   <h3 className="font-bold text-lg mb-3">Need help with a return?</h3>
                                   <p className="text-gray-600 mb-4">Our team is here to help make the process easy!</p>
                                   <Link
                                        to="/contact"
                                        className="inline-block px-6 py-3 bg-[#0a0a0a] text-white text-sm font-bold tracking-[0.15em] uppercase hover:bg-[#dc2626] transition-colors"
                                   >
                                        Contact Us
                                   </Link>
                              </div>
                         </div>
                    </div>
               </section>
          </div>
     );
}
