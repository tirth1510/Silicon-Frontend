"use client";

import { Stethoscope, Activity, ShieldCheck, Settings, ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  {
    title: "Medical Devices",
    description: "Advanced diagnostic and monitoring medical equipment",
    icon: Stethoscope,
    category: "medical",
    stats: "500+ Products",
    count: "500+",
  },
  {
    title: "Hospital Equipment",
    description: "Reliable equipment for clinics and hospitals",
    icon: Activity,
    category: "equipment",
    stats: "350+ Items",
    count: "350+",
  },
  {
    title: "Accessories",
    description: "Essential accessories and consumables",
    icon: ShieldCheck,
    category: "accessories",
    stats: "200+ Options",
    count: "200+",
  },
  {
    title: "Services",
    description: "Installation, maintenance and technical support",
    icon: Settings,
    category: "services",
    stats: "24/7 Support",
    count: "24/7",
  },
];

export default function ProductCategorySection() {
  const router = useRouter();

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-5 border border-blue-100">
            <TrendingUp className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">Premium Medical Solutions</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Product Categories
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of medical products and services
          </p>
        </div>

        {/* CATEGORY CARDS */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((item, index) => {
            const Icon = item.icon;

            return (
              <div
                key={index}
                onClick={() => router.push(`/shop/products`)}
                className="group relative cursor-pointer h-full"
              >
                {/* Main Card */}
                <div className="relative bg-white rounded-xl shadow-md h-full
                               transition-all duration-500 overflow-hidden flex flex-col
                               group-hover:shadow-2xl group-hover:-translate-y-1">

                  {/* Blue Header Section */}
                  <div className="relative bg-blue-900 px-6 pt-8 pb-20 
                                  transition-all duration-500 group-hover:pb-24 shrink-0">
                    {/* Decorative Dots */}
                    <div className="absolute top-4 right-4 flex gap-1.5">
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/30"></div>
                      <div className="w-1.5 h-1.5 rounded-full bg-white/50"></div>
                    </div>

                    {/* Icon */}
                    <div className="relative z-10">
                      <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm
                                      flex items-center justify-center
                                      border border-white/20
                                      group-hover:bg-white/20 group-hover:scale-110
                                      transition-all duration-500">
                        <Icon className="w-8 h-8 text-white" strokeWidth={2} />
                      </div>
                    </div>

                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-0 right-0 w-32 h-32 
                                      bg-white rounded-full blur-2xl transform translate-x-8 -translate-y-8"></div>
                      <div className="absolute bottom-0 left-0 w-24 h-24 
                                      bg-white rounded-full blur-2xl transform -translate-x-4 translate-y-4"></div>
                    </div>
                  </div>

                  {/* White Content Section */}
                  <div className="relative -mt-12 px-6 pb-6 grow flex flex-col">
                    {/* Title Card */}
                    <div className="bg-white rounded-lg shadow-lg p-4 mb-4 
                                    border border-gray-100
                                    group-hover:shadow-xl transition-shadow duration-500">
                      <h3 className="text-lg font-bold text-gray-900 mb-1">
                        {item.title}
                      </h3>
                      <div className="flex items-center gap-2 text-xs text-blue-900 font-semibold">
                        <div className="w-1 h-1 rounded-full bg-blue-900"></div>
                        <span>{item.count}</span>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-gray-600 leading-relaxed mb-4 grow">
                      {item.description}
                    </p>

                    {/* CTA */}
                    <div className="flex items-center justify-between mt-auto">
                      <button className="text-sm font-semibold text-blue-900 
                                       flex items-center gap-2 
                                       group-hover:gap-3 transition-all duration-300">
                        <span>Explore</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>

                      <div className="text-xs text-gray-400 font-medium">
                        #{String(index + 1).padStart(2, '0')}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom CTA Section */}
        <div className="text-center mt-16 pt-12 border-t border-gray-100">
          <div className="max-w-xl mx-auto">
            <p className="text-gray-600 mb-6">
              Can&apos;t find what you&apos;re looking for?
            </p>
            <button
              onClick={() => router.push('/shop/products')}
              className="inline-flex items-center gap-3 px-8 py-4 
                         bg-blue-900 text-white 
                         font-semibold rounded-xl hover:bg-blue-800 
                         transition-all duration-300 shadow-lg hover:shadow-xl
                         hover:-translate-y-0.5">
              <span>Browse All Products</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
