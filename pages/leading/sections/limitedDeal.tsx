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

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>{(error as Error).message}</p>;

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
    <section className="relative bg-white py-20">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="mb-14">
          <div className="flex flex-col lg:flex-row items-center lg:items-end justify-between gap-6">
            {/* LEFT SIDE — TITLE */}
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-red-50 rounded-lg mb-4 border border-red-100">
                <ShoppingBag className="w-4 h-4 text-red-700" />
                <span className="text-sm font-semibold text-red-700">
                  Limited Time Deals
                </span>
              </div>

              <h2 className="text-4xl sm:text-4xl font-bold text-blue-700 leading-tight">
                Hot Deals Ending Soon
              </h2>
            </div>

            {/* RIGHT SIDE — TIMER */}
            <div className="flex justify-center lg:justify-end">
              <DealCountdown endDate="2025-12-31T23:59:59" />
            </div>
          </div>
        </div>

        {/* GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-xl border border-gray-200 hover:shadow-lg"
            >
              <div className="relative h-48">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 z-10">
                  <span
                    className="inline-flex items-center gap-1.5 px-3 py-1.5
               text-[11px] font-bold uppercase
               bg-red-50 text-red-700
               rounded-full shadow-md border border-red-200"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Deal of the Day
                  </span>
                </div>
              </div>

              <div className="p-4">
                <h3 className="font-bold text-sm mb-2 line-clamp-2">
                  {product.title}
                </h3>

                <p className="text-xl font-bold text-blue-900 mb-4">
                  ₹{product.price.toLocaleString("en-IN")}
                </p>

                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/shop/products/${product.id}`)}
                    className="flex-1 bg-blue-900 text-white text-xs py-2 rounded-lg"
                  >
                    <Eye className="inline w-4 h-4" /> View
                  </button>

                  <button
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                    className="flex-1 border border-blue-900 text-blue-900 text-xs py-2 rounded-lg"
                  >
                    <MessageCircle className="inline w-4 h-4" /> Contact
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Product Enquiry</DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <>
              <p className="font-bold">{selectedProduct.title}</p>
              <p className="text-xl font-bold">
                ₹{selectedProduct.price.toLocaleString("en-IN")}
              </p>

              <Input
                placeholder="Name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
              <Textarea
                placeholder="Address"
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <Button onClick={sendWhatsApp}>Send WhatsApp</Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
