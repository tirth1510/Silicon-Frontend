/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  ShieldCheck,
  Star,
  CheckCircle,
  Zap,
  Award,
  Truck,
  FileText,
  Loader2,
  SendHorizontal,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { submitProductEnquiry } from "@/services/enquiry.api";

/* ================= TYPES ================= */
type ImageObj = { url: string };
type Color = {
  colorName: string;
  imageUrl: string;
  productImageUrl: ImageObj[];
  stock: number;
};
type ProductFeature = { key: string; value: string };
type SpecificationItem = { points: string };
type ProductModelDetails = {
  colors: Color[];
  productFeatures: ProductFeature[];
  specifications: SpecificationItem[];
  schem: { saleProduct: boolean; recommendedProduct: boolean };
};
type Product = {
  productId?: string;
  productTitle: string;
  modelName: string;
  modelId: string;
  status: string;
  productCategory: string;
  description: string;
  productModelDetails: ProductModelDetails;
  allModels?: { modelId: string; modelName: string }[];
};

export default function ProductDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const modelId = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [activeColorIndex, setActiveColorIndex] = useState(0);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!modelId) return;
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products/model/${modelId}`,
        );
        if (res.data?.success) {
          setProduct(res.data.data);
          setActiveColorIndex(0);
        }
      } catch (error) {
        console.error("Error", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [modelId]);

  const activeModel = product?.productModelDetails;
  const activeColor = activeModel?.colors?.[activeColorIndex];

  const productImages = React.useMemo(() => {
    if (!activeColor) return ["/placeholder.png"];
    const images: string[] = [];
    if (activeColor.imageUrl) images.push(activeColor.imageUrl);
    if (activeColor.productImageUrl?.length)
      activeColor.productImageUrl.forEach((img) => images.push(img.url));
    return images.length > 0 ? images : ["/placeholder.png"];
  }, [activeColor]);

  const handleSubmitEnquiry = async () => {
    if (!form.name?.trim() || !form.phone?.trim() || !form.email?.trim()) {
      toast.error("Please fill in Name, Email, and Phone");
      return;
    }
    if (!product) return;
    try {
      setSubmitting(true);
      const result = await submitProductEnquiry({
        productId: product.productId,
        modelId: product.modelId,
        productTitle: product.productTitle,
        modelName: product.modelName,
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim(),
        message: form.address?.trim() || "",
        productImageUrl: productImages[0] || "",
      });
      if (result.success) {
        toast.success("Enquiry sent successfully!");
        setOpen(false);
        setForm({ name: "", email: "", phone: "", address: "" });
      } else {
        toast.error(result.error || "Failed to send enquiry");
      }
    } catch {
      toast.error("Failed to send enquiry. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading || !product || !activeModel) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <Loader2 className="animate-spin h-10 w-10 text-blue-900" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-20">
      <div className="max-w-7xl mx-auto px-4 pt-8">
        <Button
          variant="link"
          onClick={() => router.push("/products")}
          className="mb-8 p-0 text-blue-900 hover:no-underline font-semibold"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Products
        </Button>

        {/* IMPORTANT: items-start prevents columns from stretching and breaking sticky */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* LEFT COLUMN: Sticky Wrapper */}
          <div className="lg:col-span-6 lg:sticky lg:top-32 z-10">
            <div className="flex flex-col gap-6">
              {/* Image Box */}
              <div className="relative w-full h-[350px] md:h-[480px] bg- rounded-2xl border border-slate-100 overflow-hidden">
                <Image
                  src={productImages[activeImageIndex]}
                  alt={product.productTitle}
                  fill
                  unoptimized
                  className="object-contain p-8"
                />
              </div>

              {/* Thumbnails */}
              <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar justify-center">
                {productImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative w-16 h-16 md:w-20 md:h-20 flex-shrink-0 rounded-xl border-2 transition-all bg-white ${
                      idx === activeImageIndex
                        ? "border-blue-900 shadow-md scale-105"
                        : "border-transparent opacity-60"
                    }`}
                  >
                    <Image
                      src={img}
                      alt="thumb"
                      fill
                      unoptimized
                      className="object-contain p-2"
                    />
                  </button>
                ))}
              </div>

              {/* Enquiry Button: Inside sticky wrapper so it scrolls WITH the image */}
              <Button
                onClick={() => setOpen(true)}
                className="w-full h-16 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-lg shadow-xl"
              >
                Inquire Now
              </Button>
            </div>
          </div>

          {/* RIGHT COLUMN: Details */}
          <div className="lg:col-span-6 space-y-8">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="bg-blue-50 text-blue-900 text-[10px] font-bold uppercase px-2 py-1 rounded">
                  {product.productCategory}
                </span>
                <span className="bg-green-100 text-green-700 text-[10px] font-bold uppercase px-2 py-1 rounded">
                  {product.status}
                </span>
              </div>
              <h1 className="text-3xl md:text-4xl font-bold text-slate-900 tracking-tight">
                {product.productTitle}
              </h1>
              <div className="flex items-center gap-4 text-sm font-medium">
                <div className="flex items-center text-amber-400 gap-1">
                  <Star size={18} fill="currentColor" /> 4.0
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 underline underline-offset-4 cursor-pointer">
                  128 Ratings
                </span>
                <span className="text-slate-300">|</span>
                <span className="text-slate-600 font-bold">
                  {product.modelName}
                </span>
              </div>
            </div>

            {/* Selection Grid */}
            <div className="space-y-6">
              {product.allModels && (
                <div className="space-y-3">
                  <p className="font-bold text-slate-900 text-sm">
                    Available Models
                  </p>
                  <div className="flex flex-wrap gap-3">
                    {product.allModels.map((m) => (
                      <button
                        key={m.modelId}
                        onClick={() => router.push(`/products/${m.modelId}`)}
                        className={`px-4 py-2 rounded-lg border-2 text-sm font-semibold transition-all ${m.modelId === product.modelId ? "bg-blue-900 text-white border-blue-900" : "border-gray-200 text-gray-700 hover:border-blue-900"}`}
                      >
                        {m.modelName}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Overview Box
            <div className="pt-6 border-t border-slate-100 space-y-4">
              <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                <FileText size={20} className="text-blue-900" /> Overview
              </h3>
              <div className="p-5 rounded-2xl bg-blue-50/50 border border-blue-100">
                <p className="text-sm text-slate-700 leading-relaxed italic">
                  &quot;{product.description}&quot;
                </p>
              </div>
            </div> */}

            {activeModel.specifications?.filter((s: any) => (typeof s === "string" ? s : s.points || s.value || s.label))?.length > 0 && (
              <div className="pt-6 space-y-4 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <ShieldCheck size={20} className="text-blue-900" />{" "}
                  Specifications
                </h3>
                <ul className="space-y-3">
                  {activeModel.specifications
                    .filter((s: any) => (typeof s === "string" ? s : s.points || s.value || s.label))
                    .map((s: any, i: number) => {
                      const content = typeof s === "string" ? s : s.points || s.value || s.label;

                      return (
                        <li
                          key={i}
                          className="flex items-start gap-3 text-sm text-slate-700"
                        >
                          <CheckCircle className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
                          <span>{content}</span>
                        </li>
                      );
                    })}
                </ul>
              </div>
            )}

            {/* Technical Details */}
            {activeModel.productFeatures?.length > 0 && (
              <div className="pt-6 space-y-4 border-t border-slate-100">
                <h3 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                  <Zap size={20} className="text-blue-900" /> Technical Details
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {activeModel.productFeatures.map((f, i) => (
                    <div
                      key={i}
                      className="flex justify-between items-start p-4 bg-white border border-slate-100 rounded-xl gap-10"
                    >
                      {/* LEFT: Key/Label (Fixed width taaki alignment barabar rahe) */}
                      <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-widest shrink-0 w-29 md:w-34 mt-1">
                        {f.key}
                      </span>

                      {/* RIGHT: Value (Flexible space, right aligned, automatic wrap) */}
                      <span className="text-sm font-bold text-slate-900 text-right leading-relaxed break-words flex-1">
                        {f.value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Specifications */}
          </div>
        </div>
      </div>

      {/* Enquiry Modal */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl">
          <DialogHeader>
            <DialogTitle className="text-blue-900 font-bold">
              Product Enquiry
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Your Name"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            <Input
              placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            <Input
              placeholder="Phone"
              value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            <Textarea
              placeholder="Address / Message"
              value={form.address}
              onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <Button
              onClick={handleSubmitEnquiry}
              disabled={submitting}
              className="w-full bg-blue-900 py-6 rounded-2xl"
            >
              {submitting ? (
                <Loader2 className="animate-spin" />
              ) : (
                <SendHorizontal className="mr-2" />
              )}
              {submitting ? "Sending..." : "Submit Enquiry"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
