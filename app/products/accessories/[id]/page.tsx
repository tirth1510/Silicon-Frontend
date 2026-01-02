/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  Info,
  Package,
  Truck,
  CheckCircle,
  Award,
} from "lucide-react";
import { getAccessoryByIdService } from "@/services/accessory.service";

/* ================= TYPES ================= */

type Point = {
  points: string;
  _id: string;
};

type ImageObj = { url: string; };

type PriceDetails = {
  currency?: string;
  price: number;
  discount: number;
  finalPrice: number;
};

type Accessory = {
  _id?: string;
  id?: string;
  productTitle: string;
  productCategory: string;
  description?: string;
  status?: string;
  // Support both API structures
  price?: number;
  discount?: number;
  finalPrice?: number;
  priceDetails?: PriceDetails;
  stock?: number;
  productImages?: ImageObj[];
  productImageUrl?: ImageObj[];
  galleryImages?: ImageObj[];
  productGallery?: ImageObj[];
  specifications?: Point[];
  productSpecifications?: Array<{ key: string; value: string; _id: string; }>;
  warranty?: Point[];
};

/* ================= COMPONENT ================= */

export default function AccessoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const accessoryId = params?.id as string;

  const [accessory, setAccessory] = useState<Accessory | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showRatingInfo, setShowRatingInfo] = useState(false);
  const [loading, setLoading] = useState(false);

  /* ================= API ================= */

  useEffect(() => {
    if (!accessoryId) return;

    const fetchAccessory = async () => {
      setLoading(true);
      try {
        const data = await getAccessoryByIdService(accessoryId);

        // Log which structure is being used
        if (data.priceDetails) {
          setAccessory(data);
        }
      } catch (error) {
        console.error("Failed to fetch accessory", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAccessory();
  }, [accessoryId]);

  // Get price details - supports both API structures
  const priceInfo = React.useMemo(() => {
    if (!accessory) return null;

    if (accessory.priceDetails) {
      return {
        price: accessory.priceDetails.price,
        discount: accessory.priceDetails.discount,
        finalPrice: accessory.priceDetails.finalPrice,
      };
    }

    return {
      price: accessory.price || 0,
      discount: accessory.discount || 0,
      finalPrice: accessory.finalPrice || accessory.price || 0,
    };
  }, [accessory]);

  // Get all images - supports both API structures
  const accessoryImages = React.useMemo(() => {
    if (!accessory) return ["/placeholder.png"];

    const images: string[] = [];

    // Add product images (try both field names)
    const productImgs = accessory.productImages || accessory.productImageUrl || [];
    if (productImgs.length) {
      productImgs.forEach((img) => {
        if (img.url) {
          images.push(img.url);
        }
      });
    }

    // Add gallery images (try both field names)
    const galleryImgs = accessory.galleryImages || accessory.productGallery || [];
    if (galleryImgs.length) {
      galleryImgs.forEach((img) => {
        if (img.url && !images.includes(img.url)) {
          images.push(img.url);
        }
      });
    }

    return images.length > 0 ? images : ["/placeholder.png"];
  }, [accessory]);

  useEffect(() => {
    setActiveImageIndex(0);
  }, [accessory]);

  if (loading || !accessory) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-900 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading accessory details...</p>
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
          onClick={() => router.push("/products/accessories")}
          className="mb-6 text-blue-900 hover:text-blue-700"
        >
          <ArrowLeft className="mr-2" /> Back to Accessories
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* LEFT - Image Gallery */}
          <div className="space-y-6">
            {/* Main Image */}
            <div className="relative w-full h-[500px] bg-gray-50 rounded-xl overflow-hidden border border-gray-200">
              <Image
                src={accessoryImages[activeImageIndex]}
                alt={accessory.productTitle}
                fill
                unoptimized
                className="object-contain p-4"
              />

              {/* Discount Badge */}
              {priceInfo && priceInfo.discount > 0 && (
                <div className="absolute top-4 right-4">
                  <span className="bg-red-600 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg">
                    {priceInfo.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            <div className="flex gap-3 flex-wrap">
              {accessoryImages.map((img, idx) => (
                <div
                  key={idx}
                  onClick={() => setActiveImageIndex(idx)}
                  className={`relative w-20 h-20 cursor-pointer rounded-lg overflow-hidden bg-white transition-all ${idx === activeImageIndex
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

          {/* RIGHT - Accessory Details */}
          <div className="space-y-6">
            {/* Product Title */}
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {accessory.productTitle}
              </h1>
              {accessory.description && (
                <p className="text-base text-gray-600 mb-3 leading-relaxed">
                  {accessory.description}
                </p>
              )}
              <span className="inline-block mt-2 px-3 py-1 bg-blue-50 text-blue-900 text-sm font-semibold rounded-md">
                Category: {accessory.productCategory}
              </span>
            </div>

            {/* Status & Rating Card */}
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
                  {accessory.status || 'In Stock'}
                </span>
              </div>

              {showRatingInfo && (
                <div className="bg-white border border-blue-200 rounded-lg p-3 text-sm text-gray-700">
                  ⭐ Ratings are collected from verified buyers and healthcare professionals.
                </div>
              )}
            </div>

            {/* Price Section */}
            {priceInfo && priceInfo.finalPrice !== undefined && (
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-900 rounded-xl p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Price</p>
                    <p className="text-4xl font-bold text-blue-900">
                      ₹ {priceInfo.finalPrice.toLocaleString("en-IN")}
                    </p>
                  </div>

                  {priceInfo.discount > 0 && (
                    <span className="bg-red-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                      Save {priceInfo.discount}%
                    </span>
                  )}
                </div>

                {priceInfo.discount > 0 && priceInfo.price !== undefined && (
                  <div className="flex items-center gap-2 mb-4">
                    <p className="text-sm text-gray-600">MRP:</p>
                    <span className="text-lg text-gray-500 line-through">
                      ₹ {priceInfo.price.toLocaleString("en-IN")}
                    </span>
                    <span className="text-sm text-green-700 font-semibold">
                      You save ₹{(priceInfo.price - priceInfo.finalPrice).toLocaleString("en-IN")}
                    </span>
                  </div>
                )}

                <div className="flex items-center gap-2 text-sm text-gray-700 pt-4 border-t border-blue-200">
                  <Package className="w-4 h-4" />
                  Stock: <span className="font-semibold">{accessory.stock || 0} units available</span>
                </div>

                <div className="flex items-center gap-2 text-sm text-gray-700 mt-2">
                  <Truck className="w-4 h-4" />
                  Free delivery in 3–5 business days
                </div>
              </div>
            )}

            {/* Product Specifications as Color Tags */}
            {accessory.productSpecifications && accessory.productSpecifications.length > 0 && (
              <div>
                <p className="font-semibold text-gray-900 mb-3">Product Details</p>
                <div className="flex gap-3 flex-wrap">
                  {accessory.productSpecifications.map((spec, idx) => (
                    <div
                      key={idx}
                      className="px-4 py-2 rounded-lg border-2 border-gray-300 bg-white"
                    >
                      <span className="text-xs text-gray-600 font-medium">{spec.key}</span>
                      <p className="text-sm font-semibold text-gray-900">{spec.value}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Warranty */}
            {accessory.warranty && accessory.warranty.length > 0 && (
              <div className="bg-gradient-to-br from-green-50 to-emerald-50 border-2 border-green-300 rounded-xl p-6 shadow-md">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 bg-green-600 rounded-lg">
                    <ShieldCheck className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="font-bold text-green-900 text-lg">Warranty Information</h3>
                </div>
                <ul className="space-y-3">
                  {accessory.warranty.map((w, i) => (
                    <li key={i} className="flex items-center gap-3 text-base text-green-900 font-medium">
                      <CheckCircle className="w-5 h-5 text-green-600" />
                      {w.points}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>


        {/* Product Specifications/Features List */}
        {accessory.specifications && accessory.specifications.length > 0 && (
          <div className="mt-8 bg-white border-2 border-gray-200 rounded-xl p-8 shadow-lg">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-600 rounded-lg">
                <Award className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">Product Features & Description</h3>
            </div>
            <ul className="space-y-4">
              {accessory.specifications.map((spec, i) => (
                <li key={i} className="flex items-start gap-3 p-3 rounded-lg hover:bg-gray-50 transition-all">
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
