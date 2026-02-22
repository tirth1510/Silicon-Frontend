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
  CheckCircle,
  Award,
  Zap,
  Truck,
  FileText,
  Loader2,
  SendHorizontal
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import axios from "axios";
import { getAccessoryByIdService } from "@/services/accessory.service";

/* ================= COMPONENT ================= */

export default function AccessoryDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const accessoryId = params?.id as string;

  const [accessory, setAccessory] = useState<any | null>(null);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!accessoryId) return;
    const fetchAccessory = async () => {
      setLoading(true);
      try {
        const data = await getAccessoryByIdService(accessoryId);
        setAccessory(data);
        setActiveImageIndex(0);
      } catch (err) {
        console.error("Fetch error", err);
      } finally { setLoading(false); }
    };
    fetchAccessory();
  }, [accessoryId]);

  const accessoryImages = React.useMemo(() => {
    if (!accessory) return ["/placeholder.png"];
    const images: string[] = [];
    const productImgs = accessory.productImages || accessory.productImageUrl || [];
    productImgs.forEach((img: any) => img.url && images.push(img.url));
    const galleryImgs = accessory.galleryImages || accessory.productGallery || [];
    galleryImgs.forEach((img: any) => (img.url && !images.includes(img.url)) && images.push(img.url));
    return images.length > 0 ? images : ["/placeholder.png"];
  }, [accessory]);

  const handleSubmitEnquiry = async () => {
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        productId: accessory.productId ?? accessory._id,
        productTitle: accessory.productTitle,
        productImageUrl: accessoryImages[0] || "https://via.placeholder.com/400",
        name: form.name,
        email: form.email,
        phone: form.phone,
        message: form.address,
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/accessory-enquiry`,
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

  if (loading || !accessory) {
    return (
      <div className="h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-900"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white pb-24">
      {/* Responsive Top Padding */}
      <div className="max-w-7xl mx-auto px-4 pt-24 lg:pt-28">
        
        {/* Navigation */}
        <Button 
          variant="link" 
          onClick={() => router.push("/products/accessories")} 
          className="mb-6 lg:mb-8 p-0 text-blue-900 hover:no-underline font-semibold"
        >
          <ArrowLeft className="mr-2 h-4 w-4" /> Back to Accessories
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          
          {/* LEFT: IMAGE SECTION (Sticky on Desktop) */}
          <div className="lg:col-span-6">
            <div className="lg:sticky lg:top-32 space-y-4 sm:space-y-6">
              
              {/* Main Image - Height adjusted for mobile */}
              <div className="relative w-full h-[300px] sm:h-[400px] md:h-[480px] bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
                <Image
                  src={accessoryImages[activeImageIndex]}
                  alt={accessory.productTitle}
                  fill
                  unoptimized
                  className="object-contain p-4 sm:p-8"
                />
              </div>

              {/* Thumbnails */}
              {accessoryImages.length > 1 && (
                <div className="flex gap-2 sm:gap-3 overflow-x-auto pb-2 no-scrollbar justify-start sm:justify-center">
                  {accessoryImages.map((img, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveImageIndex(idx)}
                      className={`relative w-16 h-16 sm:w-20 sm:h-20 flex-shrink-0 rounded-xl border-2 transition-all bg-white ${
                        idx === activeImageIndex ? "border-blue-900 shadow-md" : "border-transparent opacity-60 hover:opacity-100"
                      }`}
                    >
                      <Image src={img} alt="thumb" fill unoptimized className="object-contain p-2" />
                    </button>
                  ))}
                </div>
              )}

              {/* Action Button */}
              <div className="pt-4 sm:pt-6 border-t border-slate-100 space-y-6">
                <Button 
                  onClick={() => setOpen(true)}
                  className="w-full h-14 sm:h-16 rounded-xl bg-blue-900 hover:bg-blue-800 text-white font-bold text-base sm:text-lg shadow-xl shadow-blue-50 transition-all active:scale-95"
                >
                  Fill Inquire Form
                </Button>
              </div>
            </div>
          </div>

          {/* RIGHT: DETAILS SECTION */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8">
            
            {/* Header Area */}
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-widest">
                {accessory.productCategory && (
                  <span className="bg-blue-50 text-blue-900 px-2 py-1 rounded">{accessory.productCategory}</span>
                )}
                <span className="bg-green-100 text-green-700 px-2 py-1 rounded italic">{accessory.status || "In Stock"}</span>
              </div>
              
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-slate-900 tracking-tight leading-tight">
                {accessory.productTitle}
              </h1>
              
              <div className="flex items-center gap-4 text-xs sm:text-sm font-medium">
                <div className="flex items-center text-amber-400 gap-1">
                  <Star size={16} fill="currentColor" className="sm:w-[18px] sm:h-[18px]" /> 4.0
                </div>
                <span className="text-slate-300">|</span>
                <span className="text-slate-500 underline underline-offset-4 cursor-pointer text-xs">Official Accessory</span>
              </div>

              {/* Conditionally show Overview only if description exists */}
              {accessory.description && (
                <div className="p-4 sm:p-5 mt-4 rounded-2xl bg-blue-50/50 border border-blue-100">
                  <h3 className="text-sm font-bold text-blue-900 mb-2 flex items-center gap-2 uppercase tracking-wider">
                    <FileText size={16} /> Overview
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
                    {accessory.description}
                  </p>
                </div>
              )}
            </div>

            {/* Service Badges */}
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              <div className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3 sm:gap-4">
                <div className="bg-white p-2 sm:p-2.5 rounded-lg text-blue-900 shadow-sm"><ShieldCheck className="w-5 h-5 sm:w-[22px] sm:h-[22px]"/></div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Warranty</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-tight">Standard Support</p>
                </div>
              </div>
              <div className="p-3 sm:p-4 rounded-xl border border-slate-100 bg-slate-50 flex items-center gap-3 sm:gap-4">
                <div className="bg-white p-2 sm:p-2.5 rounded-lg text-blue-900 shadow-sm"><Truck className="w-5 h-5 sm:w-[22px] sm:h-[22px]"/></div>
                <div>
                  <h4 className="text-xs sm:text-sm font-bold text-slate-900">Fast Shipping</h4>
                  <p className="text-[10px] sm:text-[11px] text-slate-500 font-medium tracking-tight">Safe Delivery</p>
                </div>
              </div>
            </div>

            {/* Features Checklist - Conditional Rendering */}
            {accessory.specifications && accessory.specifications.length > 0 && (
              <div className="pt-2 space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Award size={18} className="text-blue-900 sm:w-[20px] sm:h-[20px]" /> Key Features
                </h3>
                <div className="space-y-2 sm:space-y-3">
                  {accessory.specifications.map((spec: any, i: number) => (
                    <div key={i} className="flex items-start gap-2 sm:gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all">
                      <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">{spec.points || spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Technical Details - Conditional Rendering */}
            {accessory.productSpecifications && accessory.productSpecifications.length > 0 && (
              <div className="pt-2 space-y-3 sm:space-y-4">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2">
                  <Zap size={18} className="text-blue-900 sm:w-[20px] sm:h-[20px]" /> Technical Details
                </h3>
                <div className="grid grid-cols-1 gap-2">
                  {accessory.productSpecifications.map((f: any, i: number) => (
                    <div key={i} className="flex justify-between items-center p-3 sm:p-4 bg-white border border-slate-100 rounded-xl">
                      <span className="text-[9px] sm:text-[10px] font-extrabold text-slate-400 uppercase tracking-widest">{f.key}</span>
                      <span className="text-xs sm:text-sm font-bold text-slate-900 text-right ml-4">{f.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>

      {/* ENQUIRY DIALOG - Mobile Responsive Dialog Content */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md w-[95vw] sm:w-full rounded-3xl border-none shadow-2xl p-4 sm:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg sm:text-xl font-bold text-blue-900">Enquire for Accessory</DialogTitle>
          </DialogHeader>
          {accessory && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 sm:gap-4 bg-blue-50 p-3 rounded-2xl border border-blue-100">
                <div className="relative w-14 h-14 sm:w-16 sm:h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-blue-100">
                  <Image 
                    src={accessoryImages[0]} 
                    alt="" fill className="object-contain p-1" unoptimized 
                  />
                </div>
                <div>
                  <p className="text-[9px] sm:text-[10px] font-bold text-blue-600 uppercase">Selected Accessory</p>
                  <h4 className="font-bold text-sm sm:text-base text-blue-900 leading-tight line-clamp-2">{accessory.productTitle}</h4>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input 
                  placeholder="Full Name" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900 h-10 sm:h-11 text-sm"
                />
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900 h-10 sm:h-11 text-sm"
                />
                <Input 
                  placeholder="Phone Number" 
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900 h-10 sm:h-11 text-sm"
                />
                <Textarea 
                  placeholder="Delivery Address / Additional Requirements" 
                  rows={3} 
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900 resize-none text-sm p-3"
                />
              </div>
              <Button 
                className="w-full bg-blue-900 hover:bg-blue-800 py-5 sm:py-6 rounded-2xl font-bold gap-2 text-sm sm:text-md" 
                onClick={handleSubmitEnquiry}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="animate-spin h-4 w-4 sm:h-5 sm:w-5" />
                ) : (
                  <SendHorizontal className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                {submitting ? "Sending..." : "Submit Enquiry"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}