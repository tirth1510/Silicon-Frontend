/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShoppingBag,
  Package,
  Eye,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

/* ---------- TYPES ---------- */

type ProductForList = {
  id: string;
  productname: string;
  category: string;
  productImage: string;
};

export default function FeaturedAccessories() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductForList[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(null);

  const [form, setForm] = useState({ name: "", address: "" });

  const WHATSAPP_NUMBER = "918160496588";
  const FALLBACK_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accessorize/all`,
        );

        const rawData = response.data.products || response.data.data || [];
        
        const mapped: ProductForList[] = rawData.map((item: any, index: number) => ({
          id: item._id || item.id || `acc-${index}`,
          productname: item.productTitle || "Medical Accessory",
          category: item.productCategory || "Accessories",
          productImage: item.productImages?.[0]?.url || FALLBACK_IMAGE,
        }));

        // Shuffle and take only top 8 for Home Page
        setProducts(mapped.sort(() => 0.5 - Math.random()).slice(0, 8));
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------- WHATSAPP SEND ---------- */
  const sendWhatsApp = () => {
    if (!selectedProduct) return;
    const message = `Hello Meditech,\n\nEnquiry for: ${selectedProduct.productname}\nClient: ${form.name}\nAddress: ${form.address}`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(url, "_blank");
    setOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* CENTERED HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">
            Premium Medical Accessories
          </h2>
          
          <p className="text-slate-500 text-lg leading-relaxed">
            Discover high-quality consumables and essential medical attachments designed 
            to complement your primary healthcare equipment.
          </p>
        </div>

        {/* PRODUCT GRID */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-[0_20px_50px_rgba(0,0,0,0.1)] hover:border-blue-900/20 transition-all duration-500"
              >
                {/* Image Section */}
                <div className="relative h-52 bg-slate-50 overflow-hidden">
                  <Image
                    src={product.productImage}
                    alt={product.productname}
                    fill
                    className="object-contain p-6 group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-2.5 py-1 text-[10px] font-bold text-white bg-blue-900 rounded-lg shadow-md uppercase">
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 text-center">
                  <h3 className="text-md font-bold text-blue-900 mb-4 h-10 line-clamp-2 leading-tight">
                    {product.productname}
                  </h3>

                  <div className="flex flex-col gap-2">
                    <Button
                      className="w-full bg-blue-900 hover:bg-blue-800 h-10 rounded-xl font-bold transition-all"
                      onClick={() => router.push(`/products/accessories/${product.id}`)}
                    >
                      <Eye className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-10 text-blue-900 font-bold bg-blue-50 hover:bg-blue-100 rounded-xl gap-2 transition-all"
                      onClick={() => {
                        setSelectedProduct(product);
                        setOpen(true);
                      }}
                    >
                      <MessageCircle className="w-4 h-4" />
                      Get Enquiry
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
            <p className="text-slate-500">No accessories found at the moment.</p>
          </div>
        )}

        {/* BOTTOM VIEW ALL BUTTON */}
        <div className="mt-20 text-center">
          <Button
            size="lg"
            onClick={() => router.push("/products/accessories")}
            className="bg-blue-900 hover:bg-blue-950 text-white px-12 py-7 rounded-2xl font-bold text-lg shadow-2xl shadow-blue-900/20 transition-all hover:-translate-y-1 group"
          >
            Explore All Accessories
            <ShoppingBag className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* ENQUIRY DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-900 text-center">Quick Enquiry</DialogTitle>
          </DialogHeader>
          
          {selectedProduct && (
            <div className="space-y-5 mt-4">
              <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-blue-100 shadow-sm">
                  <Image src={selectedProduct.productImage} alt="" fill className="object-contain p-2" unoptimized />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 leading-snug">{selectedProduct.productname}</h4>
                  <p className="text-xs text-slate-500 mt-1">{selectedProduct.category}</p>
                </div>
              </div>

              <div className="space-y-4">
                <Input
                  placeholder="Your Full Name"
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl border-slate-200 h-12 focus:ring-blue-900"
                />
                <Textarea
                  placeholder="Complete Delivery Address"
                  rows={3}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="rounded-xl border-slate-200 focus:ring-blue-900 resize-none"
                />
              </div>
              
              <Button 
                className="w-full bg-green-600 hover:bg-green-700 py-7 rounded-2xl font-bold gap-3 text-lg transition-all" 
                onClick={sendWhatsApp}
              >
                <MessageCircle className="w-6 h-6" />
                Connect on WhatsApp
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}