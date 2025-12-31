/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PRODUCT_SCHEMES, ProductSchemeKey } from "@/constants/schemes";
import { fetchProductsByScheme } from "@/services/sell.api";
import { Eye, MessageCircle } from "lucide-react";
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

  const activeSchemeTitle = PRODUCT_SCHEMES.find((s) => s.key === activeScheme)?.title;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">{activeSchemeTitle}</h1>

      {/* Tabs */}
      <Tabs value={activeScheme}>
        <TabsList className="flex flex-wrap gap-2 mb-8">
          {PRODUCT_SCHEMES.map((scheme) => (
            <TabsTrigger
              key={scheme.key}
              value={scheme.key}
              onClick={() => fetchProducts(scheme.key)}
              className="data-[state=active]:bg-blue-900 data-[state=active]:text-white"
            >
              {scheme.title}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* Products */}
      {loading ? (
        <p className="text-gray-500">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-500">No products found.</p>
      ) : (
        <div className="space-y-10">
          {products.map((product) => (
            <div key={product.productId}>
              <h2 className="text-xl font-semibold mb-4">{product.productTitle}</h2>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
                      className="group bg-white rounded-xl overflow-hidden border border-gray-200 hover:border-blue-900 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="relative h-48 bg-gray-50 overflow-hidden">
                        <Image
                          src={image}
                          alt={model.modelName}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-110 transition-transform duration-300"
                        />
                        <div className="absolute top-2 left-2">
                          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white bg-blue-900 rounded-md shadow-md">
                            {product.productCategory}
                          </span>
                        </div>
                      </div>

                      <div className="p-4">
                        <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 h-10">
                          {model.modelName}
                        </h3>
                        <p className="text-xl font-bold text-blue-900 mb-4">
                          ₹{price.toLocaleString("en-IN")}
                        </p>
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              router.push(`/products/product/${model.modelId}`)
                            }
                            className="flex-1 px-3 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            View
                          </button>
                          <button
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 px-3 py-2 border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-lg hover:bg-blue-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            Contact
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
  );
}
