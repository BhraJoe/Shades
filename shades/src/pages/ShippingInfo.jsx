import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function ShippingInfo() {
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
                         <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">Shipping Info</h1>
                    </div>
               </section>

               {/* Content */}
               <section className="py-16 md:py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-4 md:px-8">
                         <div className="space-y-12">
                              {/* Standard Shipping */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Standard Shipping</h2>
                                   <p className="text-gray-600 leading-relaxed mb-4">
                                        Our standard shipping typically takes 3-5 business days within Ghana. Orders are processed within 1-2 business days.
                                   </p>
                                   <p className="text-gray-600 leading-relaxed">
                                        <strong>Cost:</strong> Free on orders over ₵500 | ₵20 for orders under ₵500
                                   </p>
                              </div>

                              {/* Express Shipping */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Express Shipping</h2>
                                   <p className="text-gray-600 leading-relaxed mb-4">
                                        Express shipping delivers your order within 1-2 business days. Perfect for when you need your sunglasses quickly!
                                   </p>
                                   <p className="text-gray-600 leading-relaxed">
                                        <strong>Cost:</strong> ₵50 (Available in Greater Accra only)
                                   </p>
                              </div>

                              {/* International Shipping */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">International Shipping</h2>
                                   <p className="text-gray-600 leading-relaxed mb-4">
                                        We ship internationally to select countries. Delivery times vary by location:
                                   </p>
                                   <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                        <li>West Africa: 7-14 business days</li>
                                        <li>Europe & UK: 10-21 business days</li>
                                        <li>USA & Canada: 14-21 business days</li>
                                   </ul>
                                   <p className="text-gray-600 leading-relaxed mt-4">
                                        <strong>Cost:</strong> Calculated at checkout based on destination
                                   </p>
                              </div>

                              {/* Tracking */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Tracking Your Order</h2>
                                   <p className="text-gray-600 leading-relaxed">
                                        Once your order ships, you'll receive an email with tracking information. You can also track your order by logging into your account or contacting our customer service team.
                                   </p>
                              </div>

                              {/* Contact */}
                              <div className="bg-gray-50 p-8 rounded-xl">
                                   <h3 className="font-bold text-lg mb-3">Have questions about shipping?</h3>
                                   <p className="text-gray-600 mb-4">Our team is here to help!</p>
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
