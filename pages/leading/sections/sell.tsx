/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCT_SCHEMES, ProductSchemeKey } from "@/constants/schemes";
import { fetchProductsByScheme } from "@/services/sell.api";
import { Eye, MessageCircle, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";

type ProductModel = {
  modelId: string;
  modelName: string;
  productModelDetails: any;
};

type ProductResponse = {
  productId: string;
  productTitle: string;
  productCategory: string;
  description: string;
  models: ProductModel[];
};

export default function ShopPage() {
  const [activeScheme, setActiveScheme] = useState<ProductSchemeKey>("recommendedProduct");
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const fetchProducts = async (scheme: ProductSchemeKey) => {
    try {
      setLoading(true);
      setActiveScheme(scheme);
      const data = await fetchProductsByScheme(scheme);
      setProducts(data || []);
    } catch (err) {
      console.error("Fetch failed:", err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts("recommendedProduct");
  }, []);

  const activeSchemeData = PRODUCT_SCHEMES.find((s) => s.key === activeScheme);

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-5 border border-blue-100">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">
              Curated Selection
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            {activeSchemeData?.title || "Products"}
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Discover our handpicked collection of premium medical equipment
          </p>

          {/* TABS */}
          <div className="flex justify-center mt-8">
            <Tabs value={activeScheme} className="w-full max-w-4xl">
              <TabsList className="w-full h-auto bg-gray-100 p-2 rounded-xl flex flex-wrap gap-2 justify-center">
                {PRODUCT_SCHEMES.map((scheme) => (
                  <TabsTrigger
                    key={scheme.key}
                    value={scheme.key}
                    onClick={() => fetchProducts(scheme.key)}
                    className="px-6 py-3 rounded-lg font-semibold text-sm transition-all duration-200
                             data-[state=active]:bg-blue-900 data-[state=active]:text-white data-[state=active]:shadow-lg
                             data-[state=inactive]:bg-transparent data-[state=inactive]:text-gray-700 
                             hover:bg-blue-50"
                  >
                    {scheme.title}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>

        {/* PRODUCTS */}
        {loading ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-lg text-gray-600 font-medium">
                Loading products...
              </p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="min-h-[400px] flex items-center justify-center">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4">
                <Sparkles className="w-10 h-10 text-blue-900" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Products Available
              </h3>
              <p className="text-gray-600">
                Check back soon for new products in this category
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {products.map((product) => (
              <div key={product.productId}>
                {/* Product Title */}
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {product.productTitle}
                  </h3>
                  <div className="h-1 w-20 bg-blue-900 rounded-full"></div>
                </div>

                {/* Product Models Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {product.models.map((model, idx) => {
                    const FALLBACK_IMAGE =
                      "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg";

                    const image =
                      model.productModelDetails?.colors?.[0]?.imageUrl ||
                      model.productModelDetails?.colors?.[0]?.productImageUrl?.[0]?.url ||
                      FALLBACK_IMAGE;

                    const price =
                      model.productModelDetails?.colors?.[0]?.colorPrice?.[0]?.finalPrice || 0;

                    return (
                      <div
                        key={`${product.productId}-${idx}`}
                        className="group bg-white rounded-xl overflow-hidden border border-gray-200 
                                   hover:border-blue-900 hover:shadow-xl transition-all duration-300 flex flex-col"
                      >
                        {/* Image Section */}
                        <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
                          <Image
                            src={image}
                            alt={model.modelName}
                            fill
                            unoptimized
                            className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                          />

                          {/* Category Badge */}
                          <div className="absolute top-3 left-3">
                            <span className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white bg-blue-900 rounded-md shadow-md">
                              {product.productCategory}
                            </span>
                          </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-5 flex flex-col grow">
                          {/* Title */}
                          <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 min-h-10">
                            {model.modelName}
                          </h3>

                          {/* Price */}
                          <p className="text-2xl font-bold text-blue-900 mb-5">
                            ₹{price.toLocaleString("en-IN")}
                          </p>

                          {/* Action Buttons */}
                          <div className="flex gap-2 mt-auto">
                            <button
                              onClick={() =>
                                router.push(`/products/${model.modelId}`)
                              }
                              className="flex-1 px-4 py-2.5 bg-blue-900 text-white text-xs font-semibold rounded-lg
                                       hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-1.5
                                       shadow-md hover:shadow-lg"
                            >
                              <Eye className="w-4 h-4" />
                              <span>View</span>
                            </button>

                            <button
                              onClick={(e) => e.stopPropagation()}
                              className="flex-1 px-4 py-2.5 border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-lg
                                       hover:bg-blue-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                            >
                              <MessageCircle className="w-4 h-4" />
                              <span>Contact</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
