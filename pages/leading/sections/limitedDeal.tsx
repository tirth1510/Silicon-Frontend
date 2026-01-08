"use client";

import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, Flame, MessageCircle, ShoppingBag } from "lucide-react";
import { getSaleProductsService } from "@/services/sell.api";
import { SaleProductAPIItem, SaleProductUI } from "@/types/sell";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import DealCountdown from "./timer";

export default function SaleProductsPage() {
  const router = useRouter();

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["sale-products"],
    queryFn: getSaleProductsService,
  });

  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<SaleProductUI | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const WHATSAPP_NUMBER = "918160496588";

  const FALLBACK_IMAGE =
    "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg";

  if (isLoading) return <p></p>;
  /* ---------------- SAFE DATA ---------------- */
  const apiProducts: SaleProductAPIItem[] = data?.data ?? [];

  /* ---------------- NORMALIZE ---------------- */
  const visibleProducts: SaleProductUI[] = apiProducts.map((item) => {
    const firstColor = item.productModelDetails?.colors?.[0];
    const firstPrice = firstColor?.colorPrice?.[0];

    return {
      id: item.modelId,
      title: `${item.productTitle} - ${item.modelName}`,
      category: item.productCategory,
      price: firstPrice?.finalPrice ?? firstPrice?.price ?? 0,
      image: firstColor?.productImageUrl?.[0]?.url ?? FALLBACK_IMAGE,
    };
  });

  const sendWhatsApp = () => {
    if (!selectedProduct) return;

    const message = `
Hello Meditech,

Client Name: ${form.name}
Address: ${form.address}

Product Name: ${selectedProduct.title}
Product Image: ${selectedProduct.image}
    `;

    window.open(
      `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`,
      "_blank"
    );
    setOpen(false);
  };

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
            <Flame className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">
              Limited Time Deals
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Hot Deals Ending Soon
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
            Don&apos;t miss out on our exclusive deals with unbeatable prices
          </p>

          {/* CENTERED TIMER */}
          <div className="flex justify-center mt-8">
            <DealCountdown endDate="2025-12-31T23:59:59" />
          </div>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 
                         hover:border-blue-900 hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              {/* Image Section */}
              <div className="relative w-full h-56 bg-gray-50 overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-contain p-2 group-hover:scale-105 transition-transform duration-300"
                />

                {/* Deal Badge */}
                <div className="absolute top-3 left-3 z-10">
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 text-[10px] font-bold uppercase bg-red-600 text-white rounded-md shadow-lg">
                    <Flame className="w-3.5 h-3.5" />
                    Hot Deal
                  </span>
                </div>
              </div>

              {/* Content Section */}
              <div className="p-5 flex flex-col grow">
                {/* Title */}
                <h3 className="text-sm font-bold text-gray-900 mb-3 line-clamp-2 min-h-10">
                  {product.title}
                </h3>

                {/* Price */}
                <p className="text-2xl font-bold text-blue-900 mb-5">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-auto">
                  <button
                    onClick={() => router.push(`/shop/products/${product.id}`)}
                    className="flex-1 px-4 py-2.5 bg-blue-900 text-white text-xs font-semibold rounded-lg
                             hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-1.5
                             shadow-md hover:shadow-lg"
                  >
                    <Eye className="w-4 h-4" />
                    <span>View</span>
                  </button>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                    className="flex-1 px-4 py-2.5 border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-lg
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
      </div>

      {/* CONTACT DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border border-gray-200 shadow-xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold text-blue-900">
              Product Enquiry
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Product Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Product</p>
                <p className="font-bold text-blue-900">{selectedProduct.title}</p>
                <p className="text-xl font-bold text-blue-900 mt-2">
                  ₹{selectedProduct.price.toLocaleString("en-IN")}
                </p>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border-gray-300 focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Address
                  </label>
                  <Textarea
                    placeholder="Your address"
                    rows={3}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="border-gray-300 focus:border-blue-900 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={sendWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Send on WhatsApp
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full border-2 border-gray-300 hover:border-blue-900 hover:bg-blue-50 text-gray-700 hover:text-blue-900 font-semibold py-5 rounded-lg transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
