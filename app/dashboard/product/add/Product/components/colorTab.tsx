/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { addColorVariant } from "@/services/product.api";
import { ColorVariantPayload } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2, Upload, Trash2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string;
  modelId: string;
  onNext: () => void;
}

export default function Step3ColorVariant({ productId, modelId, onNext }: Props) {
  const [colorName, setColorName] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [colorImage, setColorImage] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [price, setPrice] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);

  const mutation = useMutation({
    mutationFn: async () => {
      // Logic Validation
      if (!colorName) throw new Error("Color name is required");
      if (!colorImage) throw new Error("Main color image is required");

      const payload: ColorVariantPayload = {
        colorName,
        stock,
        colorImage,
        productImages,
        galleryImages,
      };

      return addColorVariant(productId, modelId, payload);
    },
    onSuccess: () => {
      toast.success("Color variant added successfully!");
      onNext();
    },
    onError: (error: any) => {
      toast.error(error.message || "Something went wrong");
    }
  });

  const handleFileChange =
    (setter: (files: File[]) => void, multiple = false) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setter(multiple ? Array.from(e.target.files) : [e.target.files[0]]);
      }
    };

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-1">
      {/* Basic Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-blue-900 tracking-widest">Color Name *</label>
          <Input
            value={colorName}
            onChange={(e) => setColorName(e.target.value)}
            placeholder="e.g. Midnight Blue"
            className="rounded-xl border-slate-200"
          />
        </div>
        <div className="space-y-2">
          <label className="text-xs font-black uppercase text-blue-900 tracking-widest">Initial Stock</label>
          <Input
            type="number"
            value={stock}
            onChange={(e) => setStock(parseInt(e.target.value))}
            placeholder="0"
            className="rounded-xl border-slate-200"
          />
        </div>
      </div>

      {/* Pricing Section - Single Default Entry */}
     

      {/* Image Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Main Color Image */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-blue-900">Main Color Image *</label>
          <div className={`relative border-2 border-dashed rounded-2xl p-4 transition-all ${colorImage ? 'border-green-400 bg-green-50' : 'border-slate-200 hover:border-blue-400'}`}>
            <Input 
              type="file" 
              accept="image/*" 
              onChange={handleFileChange((files) => setColorImage(files[0]))}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="text-center space-y-2">
              <Upload className={`mx-auto ${colorImage ? 'text-green-600' : 'text-slate-400'}`} size={24} />
              <p className="text-[10px] font-medium text-slate-500">
                {colorImage ? colorImage.name : "Click to upload main image"}
              </p>
            </div>
          </div>
        </div>

        {/* Product Images */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-blue-900">Product Images</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-blue-400 transition-all">
            <Input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange(setProductImages, true)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="text-center space-y-2">
              <Upload className="mx-auto text-slate-400" size={24} />
              <p className="text-[10px] font-medium text-slate-500">
                {productImages.length > 0 ? `${productImages.length} files selected` : "Upload variant views"}
              </p>
            </div>
          </div>
        </div>

        {/* Gallery Images */}
        <div className="space-y-3">
          <label className="text-xs font-black uppercase text-blue-900">Gallery Images</label>
          <div className="relative border-2 border-dashed border-slate-200 rounded-2xl p-4 hover:border-blue-400 transition-all">
            <Input 
              type="file" 
              accept="image/*" 
              multiple 
              onChange={handleFileChange(setGalleryImages, true)}
              className="absolute inset-0 opacity-0 cursor-pointer z-10"
            />
            <div className="text-center space-y-2">
              <Upload className="mx-auto text-slate-400" size={24} />
              <p className="text-[10px] font-medium text-slate-500">
                {galleryImages.length > 0 ? `${galleryImages.length} files selected` : "Upload gallery/usage photos"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-8 border-t flex justify-end">
        <Button 
          onClick={() => mutation.mutate()} 
          disabled={mutation.isPending}
          className="bg-blue-900 hover:bg-blue-800 px-12 py-6 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl shadow-blue-900/20"
        >
          {mutation.isPending ? (
            <><Loader2 className="mr-2 animate-spin" size={20} /> Uploading...</>
          ) : (
            "Save Variant & Finish"
          )}
        </Button>
      </div>
    </div>
  );
}