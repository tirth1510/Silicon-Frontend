"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";

/* ---------- API TYPES ---------- */

type ProductColor = {
  name: string;
  images?: { url: string }[];
};

type ProductFromAPI = {
  _id: string;
  productTitle: string;
  productCategory: string;
  priceDetails: {
    price: number;
    discount?: number;
    finalPrice?: number;
  };
  colors?: ProductColor[];
};

type ProductsAPIResponse = {
  success: boolean;
  data: ProductFromAPI[];
};

/* ---------- UI TYPE ---------- */

type ProductForList = {
  id: string;
  productname: string;
  category: string;
  price: number;
  finalPrice: number;
  discount: number;
  productImage: string;
  color?: string;
};

/* ---------- UTILS ---------- */

const shuffleArray = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

/* ---------- COMPONENT ---------- */

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductForList[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get<ProductsAPIResponse>(
          `http://localhost:5000/api/accessorize/all`
        );

        if (!data.success || !Array.isArray(data.data)) {
          console.error("Invalid API response", data);
          return;
        }

        const mapped: ProductForList[] = data.data.flatMap(
          (product) => {
            const price = product.priceDetails.price;
            const discount = product.priceDetails.discount ?? 0;
            const finalPrice =
              product.priceDetails.finalPrice ??
              Math.round(price - (price * discount) / 100);

            // If product has colors → multiple cards
            if (product.colors?.length) {
              return product.colors.map((color) => ({
                id: product._id,
                productname: product.productTitle,
                category: product.productCategory,
                price,
                finalPrice,
                discount,
                color: color.name,
                productImage:
                  color.images?.[0]?.url ?? "/placeholder.png",
              }));
            }

            // Fallback → single card
            return [
              {
                id: product._id,
                productname: product.productTitle,
                category: product.productCategory,
                price,
                finalPrice,
                discount,
                productImage: "/placeholder.png",
              },
            ];
          }
        );

        setProducts(shuffleArray(mapped).slice(0, 8));
      } catch (err) {
        console.error("Product fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="text-center py-20 text-gray-500">
        Loading products...
      </div>
    );
  }

  return (
    <section className="max-w-[1400px] mx-auto px-4 py-12">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-10">
        <h2 className="text-2xl font-bold text-blue-900">
          Accessories
        </h2>
        <button
          onClick={() => router.push("/shop/products")}
          className="text-blue-900 font-semibold hover:underline"
        >
          View All
        </button>
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product, index) => (
          <Card
            key={`${product.id}-${index}`}
            className="p-4 rounded-xl shadow-lg hover:shadow-xl transition-all hover:-translate-y-1"
          >
            {/* IMAGE */}
            <div
              className="relative w-full h-48 bg-white rounded-lg cursor-pointer"
              onClick={() =>
                router.push(`/shop/accessories/${product.id}`)
              }
            >
              <Image
                src={product.productImage}
                alt={product.productname}
                fill
                className="object-contain"
                sizes="(max-width:768px) 100vw, 25vw"
              />
            </div>

            <h3 className="mt-3 text-lg font-semibold text-gray-800">
              {product.productname}
            </h3>

            <p className="text-sm text-gray-500">
              {product.category}
              {product.color && ` • ${product.color}`}
            </p>

            {/* PRICE */}
            <div className="mt-2">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-900">
                  ₹ {product.finalPrice.toLocaleString("en-IN")}
                </span>

                {product.discount > 0 && (
                  <span className="text-sm text-gray-500 line-through">
                    ₹ {product.price.toLocaleString("en-IN")}
                  </span>
                )}
              </div>

              {product.discount > 0 && (
                <span className="text-sm font-semibold text-green-600">
                  {product.discount}% OFF
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="flex gap-3 mt-4">
              <Button
                onClick={() =>
                  router.push(`/shop/accessories/${product.id}`)
                }
                className="flex-1 bg-white text-blue-900 border-2 border-blue-900 hover:bg-blue-900 hover:text-white"
              >
                View Details
              </Button>

              <Button
                variant="outline"
                className="flex-1 border-2 border-blue-900 text-blue-900 hover:bg-blue-900 hover:text-white"
              >
                Contact
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </section>
  );
}
