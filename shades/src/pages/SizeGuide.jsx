import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function SizeGuide() {
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
                         <span className="text-[#dc2626] text-xs font-bold tracking-[0.25em] uppercase block mb-3">Guide</span>
                         <h1 className="font-display text-4xl md:text-5xl lg:text-6xl text-white tracking-wider">Size Guide</h1>
                    </div>
               </section>

               {/* Content */}
               <section className="py-16 md:py-24 bg-white">
                    <div className="max-w-4xl mx-auto px-4 md:px-8">
                         <div className="space-y-12">
                              {/* How to Measure */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">How to Find Your Perfect Fit</h2>
                                   <p className="text-gray-600 leading-relaxed mb-4">
                                        Getting the right size is essential for comfort and style. Here's how to measure yourself:
                                   </p>
                                   <ol className="list-decimal pl-6 text-gray-600 space-y-3">
                                        <li><strong>Frame Width:</strong> Measure across the front of the sunglasses from hinge to hinge</li>
                                        <li><strong>Lens Width:</strong> The horizontal diameter of each lens</li>
                                        <li><strong>Bridge Width:</strong> The distance between the two lenses</li>
                                        <li><strong>Temple Length:</strong> The arm of the sunglasses from hinge to tip</li>
                                   </ol>
                              </div>

                              {/* Size Chart */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-6">Standard Size Chart</h2>
                                   <div className="overflow-x-auto">
                                        <table className="w-full text-left border-collapse">
                                             <thead>
                                                  <tr className="border-b-2 border-gray-200">
                                                       <th className="py-3 px-4 text-sm font-bold text-[#0a0a0a] uppercase">Size</th>
                                                       <th className="py-3 px-4 text-sm font-bold text-[#0a0a0a] uppercase">Lens Width</th>
                                                       <th className="py-3 px-4 text-sm font-bold text-[#0a0a0a] uppercase">Bridge Width</th>
                                                       <th className="py-3 px-4 text-sm font-bold text-[#0a0a0a] uppercase">Temple Length</th>
                                                       <th className="py-3 px-4 text-sm font-bold text-[#0a0a0a] uppercase">Face Shape</th>
                                                  </tr>
                                             </thead>
                                             <tbody>
                                                  <tr className="border-b border-gray-100">
                                                       <td className="py-3 px-4 font-bold">Small</td>
                                                       <td className="py-3 px-4">50mm or less</td>
                                                       <td className="py-3 px-4">16-18mm</td>
                                                       <td className="py-3 px-4">130-135mm</td>
                                                       <td className="py-3 px-4">Narrow/Heart</td>
                                                  </tr>
                                                  <tr className="border-b border-gray-100">
                                                       <td className="py-3 px-4 font-bold">Medium</td>
                                                       <td className="py-3 px-4">51-54mm</td>
                                                       <td className="py-3 px-4">18-20mm</td>
                                                       <td className="py-3 px-4">135-140mm</td>
                                                       <td className="py-3 px-4">Oval/Round</td>
                                                  </tr>
                                                  <tr className="border-b border-gray-100">
                                                       <td className="py-3 px-4 font-bold">Large</td>
                                                       <td className="py-3 px-4">55-58mm</td>
                                                       <td className="py-3 px-4">18-22mm</td>
                                                       <td className="py-3 px-4">140-150mm</td>
                                                       <td className="py-3 px-4">Square/Heart</td>
                                                  </tr>
                                                  <tr>
                                                       <td className="py-3 px-4 font-bold">Extra Large</td>
                                                       <td className="py-3 px-4">59mm+</td>
                                                       <td className="py-3 px-4">20-24mm</td>
                                                       <td className="py-3 px-4">150mm+</td>
                                                       <td className="py-3 px-4">Large Oval/Square</td>
                                                  </tr>
                                             </tbody>
                                        </table>
                                   </div>
                              </div>

                              {/* Face Shapes */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-6">Choose by Face Shape</h2>
                                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="border border-gray-200 p-6 rounded-xl">
                                             <h3 className="font-bold text-lg mb-2">Round Face</h3>
                                             <p className="text-gray-600 text-sm">Angular frames like rectangular or square sunglasses add definition. Avoid small round frames.</p>
                                        </div>
                                        <div className="border border-gray-200 p-6 rounded-xl">
                                             <h3 className="font-bold text-lg mb-2">Square Face</h3>
                                             <p className="text-gray-600 text-sm">Round or oval frames soften strong jawlines. Avoid square frames.</p>
                                        </div>
                                        <div className="border border-gray-200 p-6 rounded-xl">
                                             <h3 className="font-bold text-lg mb-2">Oval Face</h3>
                                             <p className="text-gray-600 text-sm">Most frame styles work well! Try oversized or geometric frames.</p>
                                        </div>
                                        <div className="border border-gray-200 p-6 rounded-xl">
                                             <h3 className="font-bold text-lg mb-2">Heart Face</h3>
                                             <p className="text-gray-600 text-sm">Bottom-heavy frames or rimless styles complement wider foreheads.</p>
                                        </div>
                                   </div>
                              </div>

                              {/* Tips */}
                              <div>
                                   <h2 className="font-display text-2xl md:text-3xl text-[#0a0a0a] mb-4">Fit Tips</h2>
                                   <ul className="list-disc pl-6 text-gray-600 space-y-2">
                                        <li>Your sunglasses should sit comfortably on your nose without sliding down</li>
                                        <li>The top of the frames should align with your eyebrows</li>
                                        <li>There should be no pressure points on your temples</li>
                                        <li>If between sizes, choose the larger size for comfort</li>
                                   </ul>
                              </div>

                              {/* Contact */}
                              <div className="bg-gray-50 p-8 rounded-xl">
                                   <h3 className="font-bold text-lg mb-3">Need help choosing the right size?</h3>
                                   <p className="text-gray-600 mb-4">Our team is happy to assist you in finding your perfect fit!</p>
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
