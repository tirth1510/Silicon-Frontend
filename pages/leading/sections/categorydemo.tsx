"use client";

import {
  Stethoscope, Activity, ShieldCheck, Settings, ArrowRight,
  TrendingUp, Package, Wrench, Heart, Pill, Syringe,
  Microscope, CircleDot, LucideIcon, Plus
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";

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

const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Package;
  const icon = iconMap[iconName.toLowerCase()];
  return icon || Package;
};

export default function ProductCategorySection() {
  const router = useRouter();
  const { categories: apiCategories, loading, error } = useCategories();

  // Vibrant medical color palette
  const medicalThemes = [
    { bg: "bg-[#00B5AD]", text: "text-white", btn: "bg-white text-gray-900" }, // Teal
    { bg: "bg-[#FFB800]", text: "text-gray-900", btn: "bg-gray-900 text-white" }, // Yellow
    { bg: "bg-[#DBE3ED]", text: "text-gray-900", btn: "bg-gray-800 text-white" }, // Clinical Grey
    { bg: "bg-[#3B82F6]", text: "text-white", btn: "bg-white text-blue-600" }, // Blue
  ];

  const defaultImg = "./care.png";

  return (
    <section className="bg-white py-20 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="mb-12">
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">
            Shop by <span className="text-blue-600">Category</span>
          </h2>
        </div>

        {/* Categories Grid */}
        {!loading && !error && apiCategories && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {apiCategories.map((item, index) => {
              const theme = medicalThemes[index % medicalThemes.length];
              const Icon = getIconComponent(item.icon);

              return (
                <div
                  key={item._id}
                  onClick={() => router.push(`/products?category=${item.categorySlug}`)}
                  className={`group relative ${theme.bg} rounded-[2.5rem] p-8 h-[250px] cursor-pointer 
                             transition-all duration-500 hover:shadow-2xl hover:-translate-y-1 
                             overflow-visible flex items-center`}
                >
                  {/* Background Decoration */}
                  <div className="absolute top-6 right-8 opacity-10 pointer-events-none">
                    <Plus className={`w-24 h-24 ${theme.text}`} strokeWidth={4} />
                  </div>

                  {/* LEFT CONTENT: Text & Button */}
                  <div className="relative z-10 w-[60%] h-full flex flex-col justify-between">
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                         <Icon className={`w-5 h-5 ${theme.text} opacity-80`} />
                         <span className={`text-[10px] font-black uppercase tracking-widest ${theme.text} opacity-70`}>
                           {item.metadata?.productCount || 0} Products
                         </span>
                      </div>
                      <h3 className={`text-2xl font-black leading-[1.1] tracking-tight ${theme.text}`}>
                        {item.categoryName}
                      </h3>
                      <p className={`text-xs font-medium leading-snug opacity-90 line-clamp-2 ${theme.text}`}>
                        {item.categoryDescription || "Professional medical essentials for your facility."}
                      </p>
                    </div>

                    <button className={`w-fit px-7 py-3 rounded-2xl font-black text-xs uppercase tracking-widest 
                                     shadow-lg transition-transform active:scale-95 ${theme.btn}`}>
                      Order Now
                    </button>
                  </div>

                  {/* RIGHT CONTENT: Image Pop-out */}
                  <div className="absolute -right-4 bottom-0 w-[48%] h-[115%] flex items-end justify-end pointer-events-none">

                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}