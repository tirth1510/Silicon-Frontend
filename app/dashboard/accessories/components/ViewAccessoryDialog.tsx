/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Product } from "@/types/accessory";
import { Badge } from "@/components/ui/badge";

interface ViewAccessoryDialogProps {
  open: boolean;
  onClose: () => void;
  accessory: Product;
}

export default function ViewAccessoryDialog({ open, onClose, accessory }: ViewAccessoryDialogProps) {
  if (!accessory) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">{accessory.productTitle}</DialogTitle>
          <DialogDescription className="text-xs sm:text-sm">
            Detailed information about this accessory
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 sm:space-y-6 py-3 sm:py-4">
          {/* Images */}
          {accessory.productImageUrl && accessory.productImageUrl.length > 0 && (
            <div className="space-y-2 sm:space-y-3">
              <h3 className="font-semibold text-base sm:text-lg">Product Images</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {accessory.productImageUrl.map((img: any, idx: number) => (
                  <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg group">
                    <Image
                      src={img.url}
                      alt={`Product ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Basic Info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-1">Category</h4>
              <p className="text-gray-900 text-sm sm:text-base">{accessory.productCategory}</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-1">Status</h4>
              <Badge className={accessory.status === "Live" ? "bg-green-500" : "bg-yellow-500"}>
                {accessory.status}
              </Badge>
            </div>
          </div>

          {/* Price Info */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-1">Price</h4>
              <p className="text-gray-900 font-bold text-sm sm:text-base">₹{accessory.priceDetails?.price || 0}</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-1">Discount</h4>
              <p className="text-gray-900 text-sm sm:text-base">{accessory.priceDetails?.discount || 0}%</p>
            </div>
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-1">Final Price</h4>
              <p className="text-green-600 font-bold text-base sm:text-lg">₹{accessory.priceDetails?.finalPrice || 0}</p>
            </div>
          </div>

          {/* Stock */}
          <div>
            <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-1">Stock</h4>
            <p className="text-gray-900 text-sm sm:text-base">{accessory.stock || 0} units</p>
          </div>

          {/* Description */}
          <div>
            <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-2">Description</h4>
            <p className="text-gray-700 whitespace-pre-wrap text-xs sm:text-sm">{accessory.description}</p>
          </div>

          {/* Specifications */}
          {accessory.specifications && accessory.specifications.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-2">Specifications</h4>
              <ul className="list-disc list-inside space-y-1">
                {accessory.specifications.map((spec: any, idx: number) => (
                  <li key={idx} className="text-gray-700 text-xs sm:text-sm">{spec.points || spec}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Warranty */}
          {accessory.warranty && accessory.warranty.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-2">Warranty</h4>
              <ul className="list-disc list-inside space-y-1">
                {accessory.warranty.map((item: any, idx: number) => (
                  <li key={idx} className="text-gray-700 text-xs sm:text-sm">{item.points || item}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Gallery */}
          {accessory.productGallery && accessory.productGallery.length > 0 && (
            <div>
              <h4 className="font-semibold text-xs sm:text-sm text-gray-600 mb-2">Gallery</h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
                {accessory.productGallery.map((img: any, idx: number) => (
                  <div key={idx} className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg group">
                    <Image
                      src={img.url}
                      alt={`Gallery ${idx + 1}`}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

