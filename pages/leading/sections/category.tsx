"use client";

import {
  Stethoscope,
  Activity,
  ShieldCheck,
  Settings,
  ArrowRight,
  Package,
  Wrench,
  Heart,
  Pill,
  Syringe,
  Microscope,
  CircleDot,
  LucideIcon,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useCategories } from "@/hooks/useCategories";
import { Providers } from "@/providers/providers";

const iconMap: Record<string, LucideIcon> = {
  stethoscope: Stethoscope,
  activity: Activity,
  "shield-check": ShieldCheck,
  settings: Settings,
  package: Package,
  wrench: Wrench,
  heart: Heart,
  pill: Pill,
  syringe: Syringe,
  microscope: Microscope,
  "circle-dot": CircleDot,
};

const DEFAULT_CATEGORY_IMAGE =
  "https://images.unsplash.com/photo-1579684385127-1ef15d508118?q=80&w=800&auto=format&fit=crop";

const getIconComponent = (iconName?: string): LucideIcon => {
  if (!iconName) return Package;
  const icon = iconMap[iconName.toLowerCase()];
  return icon || Package;
};

export default function ProductCategorySection() {
  const router = useRouter();
  const { categories: apiCategories, loading, error } = useCategories();

  return (
    <Providers>
    <section className="relative bg-white py-12 md:py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center mb-8 md:mb-14">
          <h2 className="text-3xl sm:text-5xl font-bold text-blue-900 mb-3">
            Product Categories
          </h2>
          <p className="text-sm sm:text-lg text-gray-600 max-w-2xl mx-auto px-4">
            Discover our comprehensive range of medical products and services
          </p>
        </div>

        {/* CATEGORY CARDS - CHANGE: grid-cols-2 for mobile */}
        {!loading && !error && apiCategories && apiCategories.length > 0 && (
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
            {apiCategories
              .slice()
              .sort((a, b) => Number(a.categoryId) - Number(b.categoryId))
              .map((item) => {
                const Icon = getIconComponent(item.icon);

                return (
                  <div
                    key={item._id}
                    onClick={() => {
                      if (Number(item.categoryId) === 4) {
                        router.push("/products/accessories");
                      } else if (item.categorySlug) {
                        router.push(`/products?category=${item.categorySlug}`);
                      }
                    }}
                    className="group relative cursor-pointer h-full"
                  >
                    <div
                      className="relative bg-white rounded-lg md:rounded-xl shadow-sm h-full
                                   transition-all duration-500 overflow-hidden flex flex-col
                                   group-hover:shadow-xl group-hover:-translate-y-1 border border-gray-100"
                    >
                      {/* Media Section - CHANGE: Reduced height on mobile */}
                      <div
                        className="relative px-3 md:px-6 pt-4 md:pt-8 pb-12 md:pb-20 bg-cover bg-center shrink-0"
                        style={{
                          backgroundImage: `url(${item.categoryImage || DEFAULT_CATEGORY_IMAGE})`,
                        }}
                      >
                        <div
                          className="absolute inset-0 bg-blue-900/70"
                          aria-hidden
                        />

                        {/* Icon - CHANGE: Smaller on mobile */}
                        <div className="relative z-10">
                          <div
                            className="w-10 h-10 md:w-16 md:h-16 rounded-lg md:rounded-2xl bg-white/10 backdrop-blur-sm
                                        flex items-center justify-center border border-white/20
                                        group-hover:bg-white/20 transition-all duration-500"
                          >
                            <Icon
                              className="w-5 h-5 md:w-8 md:h-8 text-white"
                              strokeWidth={2}
                            />
                          </div>
                        </div>
                      </div>

                      {/* Content Section - CHANGE: Reduced margins and padding */}
                      <div className="relative -mt-8 px-3 md:px-6 pb-4 grow flex flex-col">
                        <div className="bg-white rounded-md md:rounded-lg shadow-md p-2 md:p-4 mb-2 border border-gray-50">
                          <h3 className="text-sm md:text-lg font-bold text-gray-900 line-clamp-2 leading-tight min-h-[2.5rem] md:min-h-0">
                            {item.categoryName}
                          </h3>
                        </div>

                        {/* Description - CHANGE: Hidden or clamped on small mobile */}
                        <p className="text-[10px] md:text-sm text-gray-600 leading-tight mb-3 line-clamp-2 md:line-clamp-3 grow">
                          {item.description || "Explore our medical range"}
                        </p>

                        {/* CTA */}
                        <div className="flex items-center justify-between mt-auto">
                          <span className="text-[10px] md:text-sm font-semibold text-blue-900 flex items-center gap-1">
                            Explore{" "}
                            <ArrowRight className="w-3 h-3 md:w-4 md:h-4" />
                          </span>
                          <div className="text-[9px] md:text-xs text-gray-400 font-medium">
                            #{String(item.categoryId).padStart(2, "0")}
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
        {!loading &&
          !error &&
          (!apiCategories || apiCategories.length === 0) && (
            <div className="text-center py-20">
              <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No categories available</p>
            </div>
          )}
      </div>
    </section>
    </Providers>
  );
}
