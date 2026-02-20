/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import axios from "axios";
import { ShoppingBag, Eye, MessageCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { toast } from "sonner"; // Ensure sonner is installed

/* ---------- TYPES ---------- */
type ProductForList = {
  id: string;
  productname: string;
  category: string;
  productImage: string;
};

export default function FeaturedAccessories({ preFetchedAccessories }: { preFetchedAccessories?: any }) {
  const router = useRouter();
  const [products, setProducts] = useState<ProductForList[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false); // Added missing state
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(null);
  
  // Updated form state to match your dialog inputs
  const [form, setForm] = useState({ 
    name: "", 
    email: "", 
    phone: "", 
    address: "" 
  });

  const WHATSAPP_NUMBER = "918160496588";
  const FALLBACK_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

  useEffect(() => {
    if (preFetchedAccessories) {
      const rawData = preFetchedAccessories.products || preFetchedAccessories.data || [];
      const mapped: ProductForList[] = rawData.map((item: any, index: number) => ({
        id: item._id || item.id || `acc-${index}`,
        productname: item.productTitle || "Medical Accessory",
        category: item.productCategory || "Accessories",
        productImage: item.productImages?.[0]?.url || FALLBACK_IMAGE,
      }));
      setProducts(mapped.sort(() => 0.5 - Math.random()).slice(0, 8));
      setLoading(false);
      return;
    }
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/accessorize/all`);
        const rawData = response.data.products || response.data.data || [];
        const mapped: ProductForList[] = rawData.map((item: any, index: number) => ({
          id: item._id || item.id || `acc-${index}`,
          productname: item.productTitle || "Medical Accessory",
          category: item.productCategory || "Accessories",
          productImage: item.productImages?.[0]?.url || FALLBACK_IMAGE,
        }));
        setProducts(mapped.sort(() => 0.5 - Math.random()).slice(0, 8));
      } catch (error) {
        console.error("❌ Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [preFetchedAccessories]);

  // Added missing handleSubmitEnquiry function
  const handleSubmitEnquiry = async () => {
    if (!form.name || !form.phone) {
      toast.error("Please fill in your name and phone number");
      return;
    }

    try {
      setSubmitting(true);
      // Replace with your actual API endpoint if needed
      const payload = {
        productTitle: selectedProduct?.productname,
        ...form
      };
      
      // Example API call
      // await axios.post(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/enquiry`, payload);
      
      // WhatsApp fallback as per your previous logic
      const message = `Hello Meditech,\n\nEnquiry for: ${selectedProduct?.productname}\nClient: ${form.name}\nEmail: ${form.email}\nPhone: ${form.phone}\nAddress: ${form.address}`;
      const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
      window.open(url, "_blank");
      
      toast.success("Enquiry request initiated!");
      setOpen(false);
      setForm({ name: "", email: "", phone: "", address: "" });
    } catch (error) {
      toast.error("Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center bg-white">
        <Loader2 className="animate-spin h-10 w-10 text-blue-900" />
      </div>
    );
  }

  return (
    <section className="relative bg-white py-10 md:py-5  overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none">
        <div className="absolute inset-0" style={{ backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`, backgroundSize: "40px 40px" }} />
      </div>

      <div className="relative max-w-[1400px] mx-auto px-3 md:px-8">
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-extrabold text-blue-900 mb-3 tracking-tight">
            Medical Accessories
          </h2>
          <p className="text-slate-500 text-[11px] md:text-lg leading-relaxed px-4">
            High-quality consumables designed for healthcare excellence.
          </p>
        </div>

        {/* PRODUCT GRID */}
        {products.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
            {products.map((product) => (
              <div
                key={product.id}
                onClick={() => router.push(`/products/accessories/${product.id}`)}
                className="group bg-white rounded-xl md:rounded-3xl overflow-hidden border border-slate-100 hover:border-blue-900 shadow-sm hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
              >
                <div className="relative h-32 sm:h-48 md:h-60 bg-slate-50/50 overflow-hidden shrink-0">
                  <Image
                    src={product.productImage}
                    alt={product.productname}
                    fill
                    className="object-contain p-2 md:p-6 group-hover:scale-105 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute top-1.5 left-1.5">
                    <span className="px-1.5 py-0.5 text-[8px] md:text-[10px] font-bold text-white bg-blue-900/90 rounded-md uppercase">
                      Accessories & Consumables
                    </span>
                  </div>
                </div>

                <div className="p-2.5 md:p-6 text-center flex flex-col flex-1">
                  <p className="text-[9px] md:text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-1">
                     {product.category}
                  </p>
                  <h4 className="text-[11px] md:text-lg font-bold text-blue-900 mb-2 md:mb-6 line-clamp-2 leading-snug min-h-[1.8rem] md:min-h-[3rem]">
                    {product.productname}
                  </h4>
                  
                  <div className="flex flex-col gap-1.5 mt-auto">
                    <Button
                      className="w-full bg-blue-900 hover:bg-blue-800 h-7 md:h-10 rounded-lg text-[10px] md:text-sm font-bold"
                      onClick={(e) => {
                        e.stopPropagation();
                        router.push(`/products/accessories/${product.id}`);
                      }}
                    >
                      <Eye className="w-3 h-3 mr-1 md:mr-2" />
                      View
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full h-7 md:h-10 text-blue-900 text-[10px] md:text-sm font-bold bg-blue-50 hover:bg-blue-100 rounded-lg gap-1"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedProduct(product);
                        setOpen(true);
                      }}
                    >
                      <MessageCircle className="w-3 h-3" />
                      Enquiry
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
            <p className="text-slate-500 text-xs">No Accessories found.</p>
          </div>
        )}

        {/* VIEW ALL BUTTON */}
        <div className="mt-10 md:mt-20 text-center">
          <Button
            onClick={() => router.push("/products/accessories")}
            className="bg-blue-900 hover:bg-blue-950 text-white px-6 md:px-12 py-4 md:py-7 rounded-xl font-bold text-xs md:text-lg transition-all group"
          >
            View All Accessories
            <ShoppingBag className="ml-2 w-3 h-3 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* FIXED ENQUIRY DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-md rounded-2xl border-none shadow-2xl p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-2xl font-bold text-blue-900 text-center">
              Request Quote
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 bg-blue-50/30 p-3 rounded-xl">
                <div className="relative w-14 h-14 bg-white rounded-lg shrink-0 border">
                  <Image 
                    src={selectedProduct.productImage} // Fixed property name
                    alt="" 
                    fill 
                    className="object-contain p-1" 
                    unoptimized 
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-blue-900 text-xs md:text-base truncate">
                    {selectedProduct.productname} {/* Fixed property name */}
                  </h4>
                  <p className="text-[10px] text-slate-500 uppercase">
                    {selectedProduct.category}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <Input 
                  placeholder="Full Name" 
                  value={form.name} 
                  onChange={(e) => setForm({ ...form, name: e.target.value })} 
                  className="h-10 md:h-12 text-xs md:text-sm" 
                />
                <Input 
                  placeholder="Email" 
                  type="email"
                  value={form.email} 
                  onChange={(e) => setForm({ ...form, email: e.target.value })} 
                  className="h-10 md:h-12 text-xs md:text-sm" 
                />
                <Input 
                  placeholder="Phone" 
                  value={form.phone} 
                  onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                  className="h-10 md:h-12 text-xs md:text-sm" 
                />
                <Textarea 
                  placeholder="Address" 
                  rows={2} 
                  value={form.address} 
                  onChange={(e) => setForm({ ...form, address: e.target.value })} 
                  className="text-xs md:text-sm" 
                />
              </div>

              <Button 
                className="w-full bg-blue-900 hover:bg-blue-800 py-6 md:py-7 rounded-xl font-bold text-sm md:text-lg" 
                onClick={handleSubmitEnquiry} 
                disabled={submitting}
              >
                {submitting ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : "Submit Enquiry"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}