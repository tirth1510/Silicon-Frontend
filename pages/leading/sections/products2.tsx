/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, Loader2, SendHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";

/* ---------- TYPES ---------- */
type ProductForList = {
  id: string;
  modelId: string;
  title: string;
  modelName: string;
  category: string;
  image: string;
};

export default function FeaturedProducts() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductForList[]>([]);
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(
    null,
  );

  // Form State aligned with your backend interface
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });

  const FALLBACK_IMAGE =
    "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products-with-models`,
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((product: any) => ({
            id: product._id,
            modelId: product.modelId,
            title: product.productTitle,
            modelName: product.modelName,
            category: product.productCategory,
            image:
              product.productModelDetails?.colors?.[0]?.imageUrl ||
              product.productModelDetails?.colors?.[0]?.productImageUrl?.[0]
                ?.url ||
              FALLBACK_IMAGE,
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  const randomProducts = useMemo(() => {
    return [...products].sort(() => 0.5 - Math.random()).slice(0, 8);
  }, [products]);

  // Handle Enquiry Submission via API
  const handleSubmitEnquiry = async () => {
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        productTitle: selectedProduct?.modelName,
        modelName: selectedProduct?.modelName,
        name: form.name,
        email: form.email,
        phone: form.phone,
        messageTitle: `Enquiry for ${selectedProduct?.modelName}`,
        message: `${form.address}`,
        enquiryType: "Product",
        productImageUrl: selectedProduct?.image || FALLBACK_IMAGE,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/product-enquiry`,
        payload,
      );

      if (res.data.success) {
        toast.success("Enquiry sent! Our team will contact you soon.");
        setOpen(false);
        setForm({ name: "", email: "", phone: "", address: "" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="bg-white py-20">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        {/* HEADER SECTION */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-full text-xs font-bold uppercase tracking-widest mb-6 border border-blue-100 shadow-sm">
            <ShoppingBag className="w-4 h-4" />
            Featured Collection
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-blue-900 mb-6 tracking-tight">
            Premium Medical Equipment
          </h2>
          <p className="text-slate-500 text-lg">
            High-end medical solutions designed for precision and hospital-grade
            durability.
          </p>
        </div>

        {/* PRODUCT GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {randomProducts.map((product) => (
            <div
              key={product.id}
              className="group bg-white rounded-3xl overflow-hidden border border-slate-100 hover:shadow-2xl hover:border-blue-900/20 transition-all duration-500"
            >
              <div className="relative h-60 bg-white overflow-hidden">
                <Image
                  src={product.image}
                  alt={product.modelName}
                  fill
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-700"
                  unoptimized
                />
              </div>
              <div className="p-6 border-t border-slate-50 text-center">
                <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-1">
                  {product.title}
                </p>
                <h4 className="text-lg font-bold text-blue-900 mb-6 h-12 line-clamp-2 leading-tight">
                  {product.modelName}
                </h4>
                <div className="flex flex-col gap-2">
                  <Button
                    className="w-full bg-blue-900 hover:bg-blue-800 h-11 rounded-xl font-bold"
                    onClick={() => router.push(`/products/${product.modelId}`)}
                  >
                    View Details
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full h-11 text-blue-900 font-bold bg-blue-50 hover:bg-blue-100 rounded-xl"
                    onClick={() => {
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                  >
                    Get Enquiry
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* VIEW ALL BUTTON */}
        <div className="mt-20 text-center">
          <Button
            size="lg"
            onClick={() => router.push("/products")}
            className="bg-blue-900 hover:bg-blue-950 text-white px-12 py-7 rounded-2xl font-bold text-lg shadow-xl group"
          >
            Explore All Products
            <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* ENQUIRY DIALOG (NOW USING API) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl p-6">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-blue-900 text-center">
              Request Quote
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-5 mt-4">
              <div className="flex items-center gap-4 bg-blue-50/50 p-4 rounded-2xl border border-blue-100">
                <div className="relative w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-blue-100 shadow-sm">
                  <Image
                    src={selectedProduct.image}
                    alt=""
                    fill
                    className="object-contain p-2"
                    unoptimized
                  />
                </div>
                <div>
                  <h4 className="font-bold text-blue-900 leading-snug">
                    {selectedProduct.modelName}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1">
                    {selectedProduct.title}
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                <Input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="rounded-xl border-slate-200 h-12"
                />
                <Input
                  placeholder="Email Address"
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="rounded-xl border-slate-200 h-12"
                />
                <Input
                  placeholder="Phone Number (e.g. 918160...)"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="rounded-xl border-slate-200 h-12"
                />
                <Textarea
                  placeholder="Delivery Address / Additional Requirements"
                  rows={3}
                  value={form.address}
                  onChange={(e) =>
                    setForm({ ...form, address: e.target.value })
                  }
                  className="rounded-xl border-slate-200 resize-none"
                />
              </div>

              <Button
                className="w-full bg-blue-900 hover:bg-blue-800 py-7 rounded-2xl font-bold gap-3 text-lg transition-all shadow-lg"
                onClick={handleSubmitEnquiry}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="animate-spin h-6 w-6" />
                ) : (
                  <SendHorizontal className="w-6 h-6" />
                )}
                {submitting ? "Sending..." : "Submit Enquiry"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
