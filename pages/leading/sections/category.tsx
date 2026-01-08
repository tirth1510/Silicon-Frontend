"use client";

import {
  Stethoscope,
  Activity,
  ShieldCheck,
  Settings,
  ArrowRight,
  TrendingUp,
  Package,
  Wrench,
  Heart,
  Pill,
  Syringe,
  Microscope,
  CircleDot,
  LucideIcon
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";

// Icon mapping based on category icon name from backend
const iconMap: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  activity: Activity,
  'shield-check': ShieldCheck,
  settings: Settings,
  package: Package,
  wrench: Wrench,
  heart: Heart,
  pill: Pill,
  syringe: Syringe,
  microscope: Microscope,
  'circle-dot': CircleDot,
};

// Helper function to get icon component
const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Package; // Default icon
  const icon = iconMap[iconName.toLowerCase()];
  return icon || Package; // Fallback to Package icon
};

export default function ProductCategorySection() {
  const router = useRouter();
  const { categories: apiCategories, loading, error } = useCategories();

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
        {!loading && !error && apiCategories && apiCategories.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {apiCategories.map((item, index) => {
              const Icon = getIconComponent(item.icon);

              return (
                <div
                  key={item._id}
                  onClick={() => router.push(`/products?category=${item.categorySlug}`)}
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
                          {item.categoryName}
                        </h3>
                        <div className="flex items-center gap-2 text-xs text-blue-900 font-semibold">
                          <div className="w-1 h-1 rounded-full bg-blue-900"></div>
                          <span>{item.metadata?.productCount || 0} Products</span>
                        </div>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-600 leading-relaxed mb-4 grow">
                        {item.categoryDescription || 'Explore our range of quality medical products'}
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
        )}

        {/* Empty State */}
        {!loading && !error && (!apiCategories || apiCategories.length === 0) && (
          <div className="text-center py-20">
            <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-lg text-gray-600">No categories available at the moment</p>
          </div>
        )}
      </div>
    </section>
  );
}
