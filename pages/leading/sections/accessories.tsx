"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingBag, Package, Eye, MessageCircle, Sparkles } from "lucide-react";

/* ---------- API TYPES ---------- */

type ProductColor = {
  name: string;
  images?: { url: string; }[];
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
      console.log("🔄 Fetching accessories from API...");

      try {
        const response = await axios.get<ProductsAPIResponse>(
          `http://localhost:5000/api/accessorize/all`,
          {
            timeout: 10000, // 10 second timeout
            headers: {
              'Content-Type': 'application/json',
            }
          }
        );

        console.log("✅ API Response received:", response.data);

        if (!response.data.success || !Array.isArray(response.data.data)) {
          console.error("❌ Invalid API response structure:", response.data);
          setLoading(false);
          return;
        }

        if (response.data.data.length === 0) {
          console.warn("⚠️ No accessories found in the API response");
          setProducts([]);
          setLoading(false);
          return;
        }

        const mapped: ProductForList[] = response.data.data.flatMap(
          (product) => {
            const price = product.priceDetails?.price ?? 0;
            const discount = product.priceDetails?.discount ?? 0;
            const finalPrice =
              product.priceDetails?.finalPrice ??
              Math.round(price - (price * discount) / 100);

            // If product has colors → multiple cards
            if (product.colors?.length) {
              return product.colors.map((color) => ({
                id: product._id,
                productname: product.productTitle,
                category: product.productCategory || "Accessories",
                price,
                finalPrice,
                discount,
                color: color.name,
                productImage:
                  color.images?.[0]?.url ?? "https://via.placeholder.com/400x400?text=No+Image",
              }));
            }

            // Fallback → single card
            return [
              {
                id: product._id,
                productname: product.productTitle,
                category: product.productCategory || "Accessories",
                price,
                finalPrice,
                discount,
                productImage: "https://via.placeholder.com/400x400?text=No+Image",
              },
            ];
          }
        );

        console.log(`✅ Mapped ${mapped.length} products successfully`);

        // Show 8 random products
        const shuffled = shuffleArray(mapped).slice(0, 8);
        setProducts(shuffled);

      } catch (err) {
        if (axios.isAxiosError(err)) {
          if (err.code === 'ECONNABORTED') {
            console.error("❌ API Request timeout - Server took too long to respond");
          } else if (err.response) {
            console.error(`❌ API Error ${err.response.status}:`, err.response.data);
          } else if (err.request) {
            console.error("❌ No response from server. Is the backend running on http://localhost:5000?");
          } else {
            console.error("❌ Request setup error:", err.message);
          }
        } else {
          console.error("❌ Unexpected error:", err);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">Loading accessories...</p>
        </div>
      </div>
    );
  }

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
            <Package className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">Essential Medical Accessories</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Premium Accessories
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of medical accessories and consumables for all your healthcare needs
          </p>
        </div>

        {/* No Products Message */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4">
              <Package className="w-10 h-10 text-blue-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No Accessories Available</h3>
            <p className="text-gray-600 mb-6">Check back soon for new products</p>
            <Button
              onClick={() => router.push("/shop/products")}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Browse All Products
            </Button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 
                           hover:border-blue-900 hover:shadow-2xl transition-all duration-300
                           hover:-translate-y-1"
              >
                {/* Image Section */}
                <div className="relative h-56 bg-gradient-to-br from-blue-50 to-white overflow-hidden">
                  <Image
                    src={product.productImage}
                    alt={product.productname}
                    fill
                    className="object-contain p-4 group-hover:scale-110 transition-transform duration-500"
                    sizes="(max-width:768px) 100vw, 25vw"
                  />

                  {/* Discount Badge */}
                  {product.discount > 0 && (
                    <div className="absolute top-3 left-3">
                      <div className="flex items-center gap-1 px-2.5 py-1 bg-green-600 text-white 
                                    text-xs font-bold rounded-md shadow-lg">
                        <Sparkles className="w-3 h-3" />
                        <span>{product.discount}% OFF</span>
                      </div>
                    </div>
                  )}

                  {/* Category Badge */}
                  {product.color && (
                    <div className="absolute top-3 right-3">
                      <span className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white bg-blue-900 
                                     rounded-md shadow-md">
                        {product.color}
                      </span>
                    </div>
                  )}

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-blue-900/0 group-hover:bg-blue-900/5 transition-colors duration-300"></div>
                </div>

                {/* Content Section */}
                <div className="p-5">
                  {/* Title */}
                  <h3 className="text-base font-bold text-gray-900 mb-2 line-clamp-2 h-12 group-hover:text-blue-900 transition-colors">
                    {product.productname}
                  </h3>

                  {/* Category */}
                  <p className="text-xs text-gray-500 mb-3 font-medium">
                    {product.category}
                  </p>

                  {/* Price Section */}
                  <div className="mb-4 pb-4 border-b border-gray-100">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-2xl font-bold text-blue-900">
                        ₹{product.finalPrice.toLocaleString("en-IN")}
                      </span>
                      {product.discount > 0 && (
                        <span className="text-sm text-gray-400 line-through">
                          ₹{product.price.toLocaleString("en-IN")}
                        </span>
                      )}
                    </div>
                    {product.discount > 0 && (
                      <p className="text-xs text-green-600 font-semibold">
                        Save ₹{(product.price - product.finalPrice).toLocaleString("en-IN")}
                      </p>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() => router.push(`/shop/accessories/${product.id}`)}
                      className="flex-1 px-3 py-2.5 bg-blue-900 text-white text-xs font-semibold rounded-lg
                               hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-1.5
                               shadow-md hover:shadow-lg"
                    >
                      <Eye className="w-4 h-4" />
                      <span>View Details</span>
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        // Add contact functionality here
                        router.push(`/shop/accessories/${product.id}`);
                      }}
                      className="flex-1 px-3 py-2.5 border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-lg
                               hover:bg-blue-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                    >
                      <MessageCircle className="w-4 h-4" />
                      <span>Contact</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push("/shop/products")}
              className="inline-flex items-center gap-2 px-8 py-4 
                         bg-blue-900 text-white font-semibold rounded-xl 
                         hover:bg-blue-800 transition-all duration-300 
                         shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View All Products</span>
            </Button>
          </div>
        )}
      </div>
    </section>
  );
}
