/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createProductStep1 } from "@/services/product.api";
import { CreateProductStep1Payload } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowRight, Loader2, Info } from "lucide-react";

interface Props {
  onSuccess: (productId: string, modelId: string) => void;
}

// Updated Categories with more options if needed
const categories = [
  { value: "1", label: "Operating Theater" },
  { value: "2", label: "ICU Products" },
  { value: "3", label: "NICU Products" },
  { value: "4", label: "Accessories" },
];

export default function Step1BasicInfo({ onSuccess }: Props) {
  const [form, setForm] = useState<CreateProductStep1Payload>({
    productCategory: "1",
    productTitle: "",
    description: "",
    modelName: "",
  });

  const mutation = useMutation({
    mutationFn: createProductStep1,
    onSuccess: (res: any) => {
      const productId = res.data._id;
      const modelId = res.data.productModels[0]._id;
      onSuccess(productId, modelId);
    },
  });

  const isFormValid = form.productTitle && form.description && form.modelName;

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-8 pb-32">
          
          {/* TOP SECTION: Category & Title */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Category Selection */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-blue-900 tracking-widest">
                Product Category <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.productCategory}
                onValueChange={(value) =>
                  setForm({ ...form, productCategory: value as any })
                }
              >
                <SelectTrigger className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all text-slate-900 font-bold">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-200 shadow-2xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="font-medium py-3 rounded-xl">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Title */}
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-blue-900 tracking-widest">
                Product Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., High-End Patient Monitor"
                value={form.productTitle}
                onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
                className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold placeholder:font-medium"
              />
            </div>
          </div>

          {/* Model Name */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-blue-900 tracking-widest">
              Model Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., X-500 Pro Series"
              value={form.modelName}
              onChange={(e) => setForm({ ...form, modelName: e.target.value })}
              className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold"
            />
          </div>

          {/* Description */}
          <div className="space-y-3">
            <label className="text-xs font-black uppercase text-blue-900 tracking-widest">
              Detailed Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Describe the product's core technology and medical benefits..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full min-h-[180px] bg-white border-2 border-slate-200 rounded-[2rem] p-6 focus:ring-4 focus:ring-blue-50 transition-all font-medium leading-relaxed resize-none"
            />
            <div className="flex items-center gap-2 text-slate-400 mt-2 ml-2">
              <Info size={14} />
              <p className="text-[10px] font-bold uppercase tracking-wider">
                Current Length: {form.description.length} characters
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* STICKY FOOTER ACTION */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 md:p-8 z-20 rounded-b-[2.5rem]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="hidden md:block">
            <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
              Step 1 of 4: Basic Product Identity
            </p>
          </div>
          
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !isFormValid}
            className="group bg-blue-900 hover:bg-slate-900 text-white shadow-2xl shadow-blue-900/30 transition-all duration-500 px-12 h-14 font-black uppercase tracking-[0.2em] rounded-2xl disabled:opacity-30 disabled:cursor-not-allowed w-full md:w-auto border-b-4 border-blue-950 active:border-b-0 active:translate-y-1"
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-3">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Processing...</span>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <span>Save & Continue</span>
                <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-2" />
              </div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}