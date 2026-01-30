"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Product } from "@/types/accessory";
import { getAllAccessoriesService } from "@/services/accessory.service";
import { Package, Eye, MessageCircle, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function AccessoriesPage() {
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const WHATSAPP_NUMBER = "918160496588";

  /* ---------- FETCH API ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllAccessoriesService();
        setProducts(res);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ---------- GROUP BY CATEGORY (AUTO) ---------- */
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};

    products.forEach((product) => {
      const category = product.productCategory || "Others";
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(product);
    });

    return groups;
  }, [products]);

  /* ---------- WHATSAPP HANDLER ---------- */
  const sendWhatsApp = () => {
    if (!selectedProduct) return;

    const message = `Hello! I'm interested in:\n\n📦 Product: ${selectedProduct.productTitle}\n👤 Name: ${form.name}\n📍 Address: ${form.address}`;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  /* ---------- LOADING STATE ---------- */
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading accessories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative bg-white min-h-screen py-20 overflow-hidden">
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

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-5 border border-blue-100">
            <ShoppingBag className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">
              Complete Accessories Collection
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Medical Accessories
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Browse our complete range of premium medical accessories and consumables
          </p>
        </div>

        {/* No Products Message */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4">
              <Package className="w-10 h-10 text-blue-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Accessories Available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new products
            </p>
          </div>
        )}

        {/* ===== LOOP CATEGORY SECTIONS ===== */}
        {Object.entries(groupedProducts).map(
          ([category, items]) =>
            items.length > 0 && (
              <div key={category} className="mb-16">
                {/* CATEGORY TITLE */}
                <div className="mb-8">
                  <h3 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2">
                    {category}
                  </h3>
                  <div className="h-1 w-20 bg-blue-900 rounded-full"></div>
                </div>

                {/* PRODUCTS GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {items.map((product, index) => (
                    <div
                      key={`${product.id}-${index}`}
                      className="group bg-white rounded-xl overflow-hidden border border-gray-200 
                                 hover:border-blue-900 hover:shadow-xl transition-all duration-300 flex flex-col"
                    >
                      {/* Image Section */}
                      <div className="relative h-48 bg-gray-50 overflow-hidden">
                        <Image
                          src={
                            product.productImages?.[0]?.url ||
                            "https://via.placeholder.com/400x400?text=No+Image"
                          }
                          alt={product.productTitle}
                          fill
                          unoptimized
                          className="object-contain p-4 group-hover:scale-110 transition-transform duration-300"
                        />

                        {/* Category Badge */}
                        <div className="absolute top-2 left-2">
                          <span className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white bg-blue-900 
                                         rounded-md shadow-md">
                            {category}
                          </span>
                        </div>
                      </div>

                      {/* Content Section */}
                      <div className="p-4 flex flex-col flex-grow">
                        {/* Title */}
                        <h3 className="text-sm font-bold text-gray-900 mb-4 line-clamp-2 h-10">
                          {product.productTitle}
                        </h3>

                        {/* Action Buttons */}
                        <div className="flex gap-2 mt-auto">
                          <button
                            onClick={() =>
                              router.push(`/products/accessories/${product.id}`)
                            }
                            className="flex-1 px-3 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg
                                     hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>View</span>
                          </button>

                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProduct(product);
                              setOpen(true);
                            }}
                            className="flex-1 px-3 py-2 border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-lg
                                     hover:bg-blue-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                          >
                            <MessageCircle className="w-3.5 h-3.5" />
                            <span>Contact</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>

      {/* ---------- CONTACT DIALOG ---------- */}
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
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <p className="text-sm font-semibold text-gray-700 mb-1">
                  Selected Product:
                </p>
                <p className="text-base font-bold text-blue-900">
                  {selectedProduct.productTitle}
                </p>
              </div>

              {/* Form Fields */}
              <div>
                <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                  Name
                </label>
                <Input
                  placeholder="Your name"
                  value={form.name}
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
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="border-gray-300 focus:border-blue-900 resize-none"
                />
              </div>

              {/* Action Button */}
              <Button
                onClick={sendWhatsApp}
                disabled={!form.name || !form.address}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg
                           flex items-center justify-center gap-2 transition-all duration-200
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Continue on WhatsApp</span>
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
