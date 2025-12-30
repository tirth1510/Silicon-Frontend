"use client";

import { Stethoscope, Activity, ShieldCheck, Settings } from "lucide-react";
import { useRouter } from "next/navigation";

const categories = [
  {
    title: "Medical Devices",
    description: "Advanced diagnostic and monitoring medical equipment",
    icon: Stethoscope,
    category: "medical",
  },
  {
    title: "Hospital Equipment",
    description: "Reliable equipment for clinics and hospitals",
    icon: Activity,
    category: "equipment",
  },
  {
    title: "Accessories",
    description: "Essential accessories and consumables",
    icon: ShieldCheck,
    category: "accessories",
  },
  {
    title: "Services",
    description: "Installation, maintenance and technical support",
    icon: Settings,
    category: "services",
  },
];

export default function ProductCategorySection() {
  const router = useRouter();

  return (
    <section className="bg-gray-50/50  py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* SECTION HEADER */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">
            Explore Product Categories
          </h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Discover our wide range of medical products and professional services.
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
                className="group cursor-pointer bg-white rounded-2xl border border-blue-200 p-6
                           transition-all duration-300 hover:-translate-y-2
                           hover:shadow-xl hover:border-blue-600"
              >
                {/* ICON */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl
                                bg-blue-100 text-blue-700 mb-6
                                group-hover:bg-blue-600 group-hover:text-white
                                transition-colors">
                  <Icon size={28} />
                </div>

                {/* TEXT */}
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {item.title}
                </h3>

                <p className="text-gray-600 text-sm leading-relaxed">
                  {item.description}
                </p>

                {/* CTA */}
                <div className="mt-5 text-blue-600 font-medium text-sm group-hover:underline">
                  View Products →
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
