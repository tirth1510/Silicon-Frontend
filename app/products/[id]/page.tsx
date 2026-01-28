/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Info,
  Tag,
  Package,
  Truck,
  CheckCircle,
  Zap,
  Award,
  FileText,
} from "lucide-react";

/* ================= TYPES ================= */

type ImageObj = { url: string };

type ColorPrice = {
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
};

type Color = {
  colorName: string;
  imageUrl: string;
  productImageUrl: ImageObj[];
  productGallery: ImageObj[];
  colorPrice: ColorPrice[];
  stock: number;
};

type ProductFeature = {
  key: string;
  value: string;
};

type WarrantyItem = {
  points: string;
};

type SpecificationItem = {
  points: string;
};

type Schem = {
  saleProduct: boolean;
  tradingProduct: boolean;
  companyProduct: boolean;
  valuableProduct: boolean;
  recommendedProduct: boolean;
  _id?: string;
};

type ProductModelDetails = {
  colors: Color[];
  specifications: SpecificationItem[];
  productSpecifications: any[];
  productFeatures: ProductFeature[];
  productFeaturesIcons: any[];
  standardParameters: any[];
  optiomalParameters: any[];
  warranty: WarrantyItem[];
  schem: Schem;
};

type ModelInfo = {
  modelId: string;
  modelName: string;
};

type Product = {
  productId: string;
  productTitle: string;
  description?: string;
  productCategory: string;
  modelId: string;
  modelName: string;
  status: string;
  productModelDetails: ProductModelDetails;
  allModels?: ModelInfo[];
};

/* ================= COMPONENT ================= */

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRatingInfo, setShowRatingInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= API ================= */

  useEffect(() => {
    if (!modelId) return;

    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products/model/${modelId}`
        );

        if (res.data?.success) {
          setProduct(res.data.data);
          setActiveColorIndex(0);
        }
      } catch (error) {
        console.error("Failed to fetch product", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [modelId]);

  const activeModel = product?.productModelDetails;
  const activeColor = activeModel?.colors?.[activeColorIndex];
  const activePrice = activeColor?.colorPrice?.[0];

  // Reset activeColorIndex if it's out of bounds
  useEffect(() => {
    if (activeModel?.colors && activeColorIndex >= activeModel.colors.length) {
      setActiveColorIndex(0);
    }
  }, [activeModel, activeColorIndex]);

  // Get product images from the active color
  const productImages = React.useMemo(() => {
    if (!activeColor) return ["/placeholder.png"];
    
    const images: string[] = [];
    
    // Add main image
    if (activeColor.imageUrl) {
      images.push(activeColor.imageUrl);
    }
    
    // Add product images
    if (activeColor.productImageUrl?.length) {
      activeColor.productImageUrl.forEach((img) => {
        if (img.url && !images.includes(img.url)) {
          images.push(img.url);
        }
      });
    }
    
    // Add gallery images
    if (activeColor.productGallery?.length) {
      activeColor.productGallery.forEach((img) => {
        if (img.url && !images.includes(img.url)) {
          images.push(img.url);
        }
      });
    }
    
    return images.length > 0 ? images : ["/placeholder.png"];
  }, [activeColor]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeColorIndex]);

  if (loading || !product || !activeModel) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading product details...</p>
        </div>
      </div>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 pt-28 pb-14">
        <Button
          variant="link"
          onClick={() => router.push("/products")}
          className="mb-6 text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2" /> Back to Products
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT - Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative w-full h-[500px] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={productImages[activeImageIndex]}
                alt={product.productTitle}
                fill
                unoptimized
                className="object-contain p-4"
              />
              
              {/* Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2">
                {activeModel.schem.saleProduct && (
                  <span className="bg-red-600 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    On Sale
                  </span>
                )}
                {activeModel.schem.recommendedProduct && (
                  <span className="bg-blue-900 text-white px-3 py-1 rounded-full text-xs font-semibold">
                    Recommended
                  </span>
                )}
              </div>

              {/* Discount Badge - Top Right */}
              {activePrice && activePrice.discount > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {activePrice.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 flex-wrap">
              {productImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 cursor-pointer rounded-lg overflow-hidden bg-white transition-all ${
                    idx === activeImageIndex
                      ? "ring-2 ring-blue-900 scale-105"
                      : "ring-1 ring-gray-300 hover:ring-gray-400"
                  }`}
                >
                  <Image 
                    src={img} 
                    alt={`Product view ${idx + 1}`} 
                    fill 
                    unoptimized
                    className="object-contain p-1" 
                  />
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT - Product Details */}
          <div className="space-y-6">
            {/* Product Title & Model */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {product.productTitle}
              </h1>
              <p className="text-lg text-gray-600 mb-2">Model: {product.modelName}</p>
              {product.description && (
                <p className="text-base text-gray-600 mb-3 italic">
                  {product.description}
                </p>
              )}
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-900 text-sm font-semibold rounded-md">
                Category: {product.productCategory}
              </span>
            </div>

            {/* Status & Rating Section */}
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-xl p-4">
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star
                        key={i}
                        size={18}
                        className={i <= 4 ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-gray-600">4.0 • 128 ratings</span>
                  <button 
                    onClick={() => setShowRatingInfo(!showRatingInfo)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <Info size={16} />
                  </button>
                </div>
                <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-full">
                  {product.status}
                </span>
              </div>

              {showRatingInfo && (
                <div className="bg-white border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
                  ⭐ Ratings are collected from verified buyers and healthcare professionals.
                </div>
              )}
            </div>

            {/* Price Section */}
            {/* {activePrice && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-900 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-4xl font-bold text-blue-900">
                      ₹ {activePrice.finalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>
                  
                  {activePrice.discount > 0 && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save {activePrice.discount}%
                    </span>
                  )}
                </div>

                {activePrice.discount > 0 && (
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-sm text-gray-600">MRP:</p>
                    <span className="text-lg text-gray-500 line-through">
                      ₹ {activePrice.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-green-700 font-semibold">
                      You save ₹{(activePrice.price - activePrice.finalPrice).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-700 pt-4 border-t border-blue-200">
                  <Package className="w-4 h-4" />
                  Stock: <span className="font-semibold">{activeColor.stock} units available</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <Truck className="w-4 h-4" />
                  Free delivery in 3–5 business days
                </div>
              </div>
            )} */}

            {/* Available Colors */}
            {activeModel.colors && activeModel.colors.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-3">Available Colors</p>
                <div className="flex gap-3 flex-wrap">
                  {activeModel.colors
                    .filter((c) => c && c.colorName) // Filter out null/undefined colors
                    .map((c, idx) => (
                      <button
                        key={c.colorName || idx}
                        onClick={() => setActiveColorIndex(idx)}
                        className={`px-5 py-2.5 rounded-lg border-2 font-medium transition-all ${
                          idx === activeColorIndex
                            ? "bg-blue-900 text-white border-blue-900 shadow-md"
                            : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"
                        }`}
                      >
                        {c.colorName}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Available Models */}
            {product.allModels && product.allModels.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-3">Available Models</p>
                <div className="flex gap-3 flex-wrap">
                  {product.allModels
                    .filter((model) => model && model.modelId && model.modelName) // Filter out null/undefined models
                    .map((model) => (
                      <button
                        key={model.modelId}
                        onClick={() => router.push(`/products/${model.modelId}`)}
                        className={`px-5 py-2.5 rounded-lg border-2 font-medium transition-all ${
                          model.modelId === product.modelId
                            ? "bg-blue-900 text-white border-blue-900 shadow-md"
                            : "border-gray-300 text-gray-700 hover:border-blue-900 hover:text-blue-900"
                        }`}
                      >
                        {model.modelName}
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Warranty */}
            {activeModel.warranty && activeModel.warranty.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-green-900 text-lg">Warranty Information</h3>
                </div>
                <ul className="space-y-3">
                  {activeModel.warranty
                    .filter((w) => w && w.points) // Filter out null/undefined items
                    .map((w, i) => (
                      <li key={w.points || i} className="flex items-center gap-3 text-base text-green-900 font-medium">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                        {w.points}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Product Features */}
        {activeModel.productFeatures && activeModel.productFeatures.length > 0 && (
          <div className="mt-12 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-200 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-900 rounded-lg">
                <Zap className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Technical Specifications</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {activeModel.productFeatures
                .filter((f) => f && f.key && f.value) // Filter out null/undefined items
                .map((f, i) => (
                  <div 
                    key={f.key || i} 
                    className="flex justify-between items-start p-4 bg-white rounded-lg border border-blue-200 hover:border-blue-400 transition-all shadow-sm hover:shadow-md"
                  >
                    <span className="font-semibold text-blue-900">{f.key}</span>
                    <span className="text-gray-900 font-medium text-right ml-4">{f.value}</span>
                  </div>
                ))}
            </div>
          </div>
        )}

        {/* Product Specifications/Features List */}
        {activeModel.specifications && activeModel.specifications.length > 0 && (
          <div className="mt-8 bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-600 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Product Features & Description</h3>
            </div>
            <ul className="space-y-4">
              {activeModel.specifications
                .filter((spec) => spec && spec.points) // Filter out null/undefined items
                .map((spec, i) => (
                  <li key={spec.points || i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
                    <CheckCircle className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700 leading-relaxed">{spec.points}</span>
                  </li>
                ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

