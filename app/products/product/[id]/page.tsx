/* eslint-disable react/jsx-no-undef */
"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ArrowLeft,
  ShieldCheck,
  HeartPulse,
  Truck,
  CheckCircle,
  Info,
  Star,
  Award,
} from "lucide-react";
import ProductsPage from "@/pages/leading/sections/products2";
import { iconMap } from "./icons";

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

type ProductModelDetails = {
  colors: Color[];
  specifications: { points: string }[];
  productFeatures: ProductFeature[];
  productFeaturesIcons: { iconName: string }[];
  standardParameters: { iconName: string }[];
  warranty: { points: string }[];
};

type Product = {
  productId: string;
  productTitle: string;
  description: string;
  modelId: string;
  modelName: string;
  productModelDetails: ProductModelDetails;
};

/* ================= COMPONENT ================= */

export default function ProductDetailsPage() {
  const router = useRouter();
  const pathname = usePathname();

  const modelId = useMemo(() => {
    if (!pathname) return null;
    const segments = pathname.split("/").filter(Boolean);
    return segments.at(-1) || null;
  }, [pathname]);

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
          `http://localhost:5000/api/demo/model/${modelId}`
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

  const productImages = useMemo(() => {
    if (!activeColor) return ["/placeholder.png"];
    return activeColor.productImageUrl?.length
      ? activeColor.productImageUrl.map((img) => img.url)
      : [activeColor.imageUrl];
  }, [activeColor]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [activeColorIndex]);

  if (loading || !product || !activeModel) {
    return (
      <p className="pt-32 text-center text-gray-500">
        Loading product details...
      </p>
    );
  }

  /* ================= UI ================= */

  return (
    <div className="max-w-7xl mx-auto px-4 pt-28 pb-14">
      <Button
        variant="link"
        onClick={() => router.push("/products/product")}
        className="mb-6"
      >
        <ArrowLeft className="mr-2" /> Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* LEFT */}
        <div className="space-y-10">
          <div className="relative w-full h-[420px]">
            <Image
              src={productImages[activeImageIndex]}
              alt={product.productTitle}
              fill
              className="object-contain"
            />
          </div>

          <div className="flex gap-3 flex-wrap justify-center">
            {productImages.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative w-16 h-16 cursor-pointer rounded-md ${
                  idx === activeImageIndex
                    ? "ring-2 ring-blue-700"
                    : "ring-1 ring-gray-300"
                }`}
              >
                <Image src={img} alt="thumb" fill className="object-cover" />
              </div>
            ))}
          </div>

          <div className="bg-gray-50 border rounded-xl p-6">
            <h3 className="font-semibold mb-3">Why Choose This Product</h3>
            <p className="text-gray-700">{product.description}</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="space-y-7">
          <h1 className="text-2xl font-bold text-gray-700">
            {product.productTitle}
          </h1>

          <div className="flex items-center gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <Star
                key={i}
                size={16}
                className={i <= 4 ? "fill-yellow-400 text-yellow-400" : ""}
              />
            ))}
            <span className="text-sm text-gray-600">4.0 • 128 ratings</span>
            <button onClick={() => setShowRatingInfo(!showRatingInfo)}>
              <Info size={16} />
            </button>
          </div>

          {showRatingInfo && (
            <div className="bg-gray-50 border rounded-lg p-4 text-sm">
              ⭐ Ratings are collected from verified buyers.
            </div>
          )}

          {/* PRICE */}
          <div className="border-2 border-blue-900 rounded-xl p-6 max-w-md">
            {/* {activePrice?.discount > 0 && (
              <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-xs">
                Save {activePrice.discount}%
              </span>
            )}

            <p className="text-4xl font-bold text-blue-900 mt-3">
              ₹ {activePrice?.finalPrice.toLocaleString("en-IN")}
            </p>

            {activePrice?.discount > 0 && (
              <p className="text-sm text-gray-500">
                MRP{" "}
                <span className="line-through">
                  ₹ {activePrice.price.toLocaleString("en-IN")}
                </span>
              </p>
            )} */}

            <div className="flex items-center gap-2 text-sm text-gray-600 mt-3">
              <Truck className="w-4 h-4" />
              Free delivery in 3–5 business days
            </div>
          </div>

          {/* COLORS */}
          <div>
            <p className="font-medium mb-2">Available Colors</p>
            <div className="flex gap-3">
              {activeModel.colors.map((c, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveColorIndex(idx)}
                  className={`px-4 py-2 rounded-full border ${
                    idx === activeColorIndex
                      ? "bg-blue-900 text-white"
                      : "border-gray-300"
                  }`}
                >
                  {c.colorName}
                </button>
              ))}
            </div>
          </div>

          {/* FEATURES */}
          <div className="border rounded-xl p-5">
            <h3 className="font-semibold mb-3">Product Features</h3>
            <table className="w-full">
              <tbody>
                {activeModel.productFeatures.map((f, i) => (
                  <tr key={i}>
                    <td className="py-2 font-medium">{f.key}</td>
                    <td className="py-2">{f.value}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

    </div>
  );
}
