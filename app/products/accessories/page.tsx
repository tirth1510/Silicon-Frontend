"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/accessory";
import { getAllAccessoriesService } from "@/services/accessory.service";

export default function AccessoriesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);

  /* ---------- FETCH API ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await getAllAccessoriesService();
      setProducts(res);
    };
    fetchProducts();
  }, []);

  /* ---------- GROUP BY CATEGORY (AUTO) ---------- */
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};

    products.forEach((product) => {
      const category = product.productCategory || "Others";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    });

    return groups;
  }, [products]);

  return (
    <div className="bg-white min-h-screen">
      <div className="max-w-[1500px] mx-auto px-4 py-10">

        {/* ===== LOOP CATEGORY SECTIONS ===== */}
        {Object.entries(groupedProducts).map(
          ([category, items]) =>
            items.length > 0 && (
              <section key={category} className="mb-16">
                {/* CATEGORY TITLE */}
                <h2 className="text-2xl font-bold text-blue-900 mb-6 border-b pb-2">
                  {category}
                </h2>

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((product) => (
                    <div
                      key={product.id}
                      className="border rounded-xl p-4 shadow hover:shadow-lg transition flex flex-col"
                    >
                      {/* IMAGE */}
                      <div className="relative h-40 mb-3">
                        <Image
                          src={
                            product.productImages?.[0]?.url ??
                            "/placeholder.png"
                          }
                          alt={product.productTitle}
                          fill
                          className="object-contain"
                        />
                      </div>

                      {/* PRICE (UNDER IMAGE ✔️) */}
                      <p className="text-blue-900 font-bold text-lg mb-1">
                        ₹{" "}
                        {(
                          product.finalPrice ??
                          product.price ??
                          0
                        ).toLocaleString("en-IN")}
                      </p>

                      {/* TITLE */}
                      <h3 className="text-sm font-semibold text-gray-800 mb-3">
                        {product.productTitle}
                      </h3>

                      {/* BUTTONS */}
                      <div className="mt-auto flex gap-2">
                        <button
                          onClick={() =>
                            router.push(
                              `/shop/accessories/${product.id}`
                            )
                          }
                          className="flex-1 py-2 rounded-md bg-blue-900 text-white text-sm font-semibold hover:bg-blue-800"
                        >
                          View Details
                        </button>

                        <a
                          href="#enquiry"
                          className="flex-1 py-2 rounded-md border border-blue-900 text-blue-900 text-sm font-semibold text-center hover:bg-blue-50"
                        >
                          Enquiry
                        </a>
                      </div>
                    </div>
                  ))}
                </div>
              </section>
            )
        )}

        {/* ENQUIRY SECTION */}
        <div id="enquiry" className="bg-gray-50 py-16 mt-20">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">
              Product Enquiry
            </h2>
            <p className="text-gray-600">
              Contact our sales team for bulk pricing and availability.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
