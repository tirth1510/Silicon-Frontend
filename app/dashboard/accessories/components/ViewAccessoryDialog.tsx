/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Product } from "@/types/accessory";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableRow } from "@/components/ui/table";

interface ViewAccessoryDialogProps {
  open: boolean;
  onClose: () => void;
  accessory: Product;
}

export default function ViewAccessoryDialog({
  open,
  onClose,
  accessory,
}: ViewAccessoryDialogProps) {
  const [activeImage, setActiveImage] = useState<string>("");

  // Combine all images into a single array for easier handling
   const allImages = accessory
    ? [
        ...(accessory.productImages || [] as any[]),
        ...(accessory.galleryImages || [] as any[]),
        // Fallback for other potential property names if API varies
        ...(accessory.productImages || [] as any[]),
      ]
        .filter((img: { url?: string }) => img?.url)
        .map((img: { url: string }) => img.url)
    : [];

  // Remove duplicates
  const uniqueImages = Array.from(new Set(allImages));

  const productImgList = accessory
    ? ((accessory.productImages as any[]) || (accessory.productImageUrl as any[]) || [])
        .filter((img: { url?: string }) => img?.url)
        .map((img: { url: string }) => img.url)
    : [];

  const galleryImgList = accessory
    ? ((accessory.galleryImages as any[]) || (accessory.productGallery as any[]) || [])
        .filter((img: { url?: string }) => img?.url)
        .map((img: { url: string }) => img.url)
    : [];

  useEffect(() => {
    if (open && uniqueImages.length > 0) {
      setActiveImage(uniqueImages[0]);
    } else {
      setActiveImage("");
    }
  }, [open, accessory]);

  if (!accessory) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-7xl h-[90vh] flex flex-col p-0 overflow-hidden bg-white rounded-xl shadow-2xl border-0">
        {/* Header */}
        <div className="bg-white px-6 py-5 border-b shrink-0 z-10">
          <DialogHeader>
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
              <div>
                <DialogTitle className="text-2xl sm:text-3xl font-bold text-gray-900">
                  {accessory.productTitle}
                </DialogTitle>
                <DialogDescription className="mt-2 flex flex-wrap items-center gap-3">
                  <span className="font-mono text-xs bg-gray-100 px-2.5 py-1 rounded-md text-gray-600 border border-gray-200">
                    ID: {accessory.id || accessory._id}
                  </span>
                  <Badge
                    className={
                      accessory.status === "Live"
                        ? "bg-green-500 hover:bg-green-600 text-white border-0"
                        : "bg-yellow-500 hover:bg-yellow-600 text-white border-0"
                    }
                  >
                    {accessory.status}
                  </Badge>
                </DialogDescription>
              </div>
              <div className="text-left sm:text-right">
                <div className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-1">
                  Category
                </div>
                <div className="font-bold text-gray-900 text-lg bg-gray-50 px-3 py-1 rounded-lg inline-block">
                  {accessory.productCategory}
                </div>
              </div>
            </div>
          </DialogHeader>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto bg-gray-50/30">
          <div className="p-6 sm:p-8 space-y-8">
            {/* Top Section: Images & Key Stats */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
              {/* Left: Images */}
              <div className="lg:col-span-5 space-y-4">
                <div className="bg-white rounded-2xl border border-gray-200 p-4 shadow-sm">
                  <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-gray-50">
                    {activeImage ? (
                      <Image
                        src={activeImage}
                        alt={accessory.productTitle}
                        fill
                        className="object-contain hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="flex flex-col items-center justify-center h-full text-gray-400 bg-gray-100">
                        <span className="text-4xl mb-2">📷</span>
                        <span className="text-sm font-medium">
                          No Image Available
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <p className="text-gray-500 font-semibold pb-2">PRODUCT IMAGES :</p>
                  <div>
                    {productImgList.length > 0 && (
                      <div className="grid grid-cols-5 gap-3">
                        {productImgList.map((img, idx) => (
                          <div
                            key={idx}
                            onMouseEnter={() => setActiveImage(img)}
                            className={`relative aspect-square rounded-lg border-2 overflow-hidden bg-white cursor-pointer transition-all duration-200 ${
                              activeImage === img
                                ? "border-blue-600 ring-2 ring-blue-100 scale-105 z-10"
                                : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`View ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <p className="text-gray-500 font-semibold pb-2">GALLERY IMAGES :</p>
                  <div>
                    {galleryImgList.length > 0 && (
                      <div className="grid grid-cols-5 gap-3">
                        {galleryImgList.map((img, idx) => (
                          <div
                            key={idx}
                            onMouseEnter={() => setActiveImage(img)}
                            className={`relative aspect-square rounded-lg border-2 overflow-hidden bg-white cursor-pointer transition-all duration-200 ${
                              activeImage === img
                                ? "border-blue-600 ring-2 ring-blue-100 scale-105 z-10"
                                : "border-gray-200 hover:border-blue-400 hover:shadow-md"
                            }`}
                          >
                            <Image
                              src={img}
                              alt={`View ${idx + 1}`}
                              fill
                              className="object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Right: Details */}
              <div className="lg:col-span-7 space-y-6">
                {/* Pricing & Inventory Card */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm hover:shadow-md transition-shadow duration-300">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    Pricing & Inventory
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 font-medium">
                        Base Price
                      </div>
                      <div className="text-xl font-semibold text-gray-900">
                        ₹{accessory.price?.toLocaleString() ?? 0}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 font-medium">
                        Discount
                      </div>
                      <div className="text-xl font-semibold text-green-600">
                        {accessory.discount ?? 0}%
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 font-medium">
                        Final Price
                      </div>
                      <div className="text-2xl font-bold text-blue-600">
                        ₹{accessory.finalPrice?.toLocaleString() ?? 0}
                      </div>
                    </div>
                    <div className="space-y-1">
                      <div className="text-xs text-gray-500 font-medium">
                        Stock
                      </div>
                      <div className="text-xl font-semibold text-gray-900 flex items-center gap-2">
                        {accessory.stock ?? 0}
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
                          units
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm">
                  <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Description
                  </h3>
                  <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">
                    {accessory.description || (
                      <span className="text-gray-400 italic">
                        No description available.
                      </span>
                    )}
                  </p>
                </div>

                {/* Product Specifications (Key-Value) */}
                <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b bg-gray-50/50 flex items-center justify-between">
                    <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>
                      Product Specifications
                    </h3>
                    <span className="text-xs text-gray-400 font-medium">
                      {accessory.productSpecifications?.length || 0} items
                    </span>
                  </div>
                  {accessory.productSpecifications &&
                  accessory.productSpecifications.length > 0 ? (
                    <Table>
                      <TableBody>
                        {accessory.productSpecifications.map(
                          (spec: any, idx: number) => (
                            <TableRow
                              key={idx}
                              className="hover:bg-blue-50/30 transition-colors"
                            >
                              <TableCell className="font-medium text-gray-600 w-1/3 bg-gray-50/30 py-3 pl-6 border-r border-gray-100">
                                {spec.key}
                              </TableCell>
                              <TableCell className="text-gray-900 py-3 pl-6 font-medium">
                                {spec.value}
                              </TableCell>
                            </TableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="p-8 text-center text-gray-400 text-sm italic bg-gray-50/10">
                      No product specifications available.
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 w-full" />

            {/* Bottom Section: Technical Specs & Warranty */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Technical Specifications */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full flex flex-col">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                  Technical Specifications
                </h3>
                {accessory.specifications &&
                accessory.specifications.length > 0 ? (
                  <ul className="space-y-3 flex-1">
                    {accessory.specifications.map((spec: any, idx: number) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-3 group"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-blue-500 transition-colors shrink-0" />
                        <span className="leading-relaxed">
                          {spec.points || spec}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-sm text-gray-400 italic border-2 border-dashed border-gray-100 rounded-xl">
                    No technical specifications listed.
                  </div>
                )}
              </div>

              {/* Warranty Information */}
              <div className="bg-white rounded-2xl border border-gray-200 p-6 shadow-sm h-full flex flex-col">
                <h3 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-5 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500"></span>
                  Warranty Information
                </h3>
                {accessory.warranty && accessory.warranty.length > 0 ? (
                  <ul className="space-y-3 flex-1">
                    {accessory.warranty.map((item: any, idx: number) => (
                      <li
                        key={idx}
                        className="text-sm text-gray-700 flex items-start gap-3 group"
                      >
                        <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-green-500 transition-colors shrink-0" />
                        <span className="leading-relaxed">
                          {item.points || item}
                        </span>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="flex-1 flex items-center justify-center p-4 text-sm text-gray-400 italic border-2 border-dashed border-gray-100 rounded-xl">
                    No warranty information listed.
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
