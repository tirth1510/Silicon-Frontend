/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addProductModelDetails } from "@/services/product.api";
import { ProductModelDetailsPayload } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string;
  modelId: string;
  onNext: () => void;
}

export default function Step2ModelDetails({ productId, modelId, onNext }: Props) {
  const [form, setForm] = useState<ProductModelDetailsPayload>({
    specifications: [{ points: "" }],
    productSpecifications: [{ key: "", value: "" }],
    productFeatures: [{ key: "", value: "" }],
    warranty: [{ points: "" }],
  });

  const mutation = useMutation({
    mutationFn: () => addProductModelDetails(productId, modelId, form),
    onSuccess: () => {
      toast.success("Specifications saved successfully");
      onNext();
    },
    onError: () => {
      toast.error("Failed to save specifications");
    }
  });

  /* ---------------- Helper Functions ---------------- */

  const updateArrayField = (
    field: keyof ProductModelDetailsPayload,
    index: number,
    key: string,
    value: string
  ) => {
    const arr = [...(form[field] ?? [])] as any[];
    arr[index] = { ...arr[index], [key]: value };
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field: keyof ProductModelDetailsPayload, isPoints = false) => {
    const arr = [...(form[field] ?? [])] as any[];
    if (isPoints) {
      arr.push({ points: "" });
    } else {
      arr.push({ key: "", value: "" });
    }
    setForm({ ...form, [field]: arr });
  };

  const removeArrayItem = (field: keyof ProductModelDetailsPayload, index: number) => {
    const arr = [...(form[field] ?? [])] as any[];
    if (arr.length > 1) {
      arr.splice(index, 1);
      setForm({ ...form, [field]: arr });
    }
  };

  /* ---------------- Render Helpers ---------------- */

  const renderSectionHeader = (label: string) => (
    <label className="text-xs font-black uppercase text-blue-900 tracking-widest mb-4 block flex items-center gap-2">
      <CheckCircle2 size={14} className="text-blue-600" /> {label}
    </label>
  );

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pr-4 scrollbar-hide">
        <div className="max-w-5xl mx-auto space-y-10 pb-32">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* 1. Specifications (Points) */}
            <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
              {renderSectionHeader("General Specifications")}
              <div className="space-y-3">
                {form.specifications?.map((item, idx) => (
                  <div key={idx} className="flex gap-2 group">
                    <Input
                      placeholder="e.g. Lightweight and portable"
                      value={item.points}
                      onChange={(e) => updateArrayField("specifications", idx, "points", e.target.value)}
                      className="h-11 bg-white border-slate-200 rounded-xl focus:ring-blue-900/10"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem("specifications", idx)} className="text-slate-400 hover:text-red-600 rounded-xl">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem("specifications", true)} className="mt-2 rounded-xl text-blue-900 border-blue-200 font-bold">
                  <Plus size={16} className="mr-1" /> Add Specification
                </Button>
              </div>
            </div>

            {/* 2. Warranty (Points) */}
            <div className="p-6 bg-slate-50/50 border border-slate-100 rounded-[2rem]">
              {renderSectionHeader("Warranty Details")}
              <div className="space-y-3">
                {form.warranty?.map((item, idx) => (
                  <div key={idx} className="flex gap-2 group">
                    <Input
                      placeholder="e.g. 1 Year standard warranty"
                      value={item.points}
                      onChange={(e) => updateArrayField("warranty", idx, "points", e.target.value)}
                      className="h-11 bg-white border-slate-200 rounded-xl focus:ring-blue-900/10"
                    />
                    <Button variant="ghost" size="icon" onClick={() => removeArrayItem("warranty", idx)} className="text-slate-400 hover:text-red-600 rounded-xl">
                      <Trash2 size={18} />
                    </Button>
                  </div>
                ))}
                <Button variant="outline" size="sm" onClick={() => addArrayItem("warranty", true)} className="mt-2 rounded-xl text-blue-900 border-blue-200 font-bold">
                  <Plus size={16} className="mr-1" /> Add Warranty Point
                </Button>
              </div>
            </div>
          </div>

          {/* 3. Product Specifications (Key-Value) */}
         

          {/* 4. Product Features (Key-Value) */}
          <div className="p-6 bg-white border-2 border-blue-50 rounded-[2rem] shadow-sm">
            {renderSectionHeader("Key Features")}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {form.productFeatures?.map((item, idx) => (
                <div key={idx} className="flex gap-2 items-center bg-slate-50 p-2 rounded-2xl border border-slate-100 group">
                  <Input
                    placeholder="Feature (e.g. Battery)"
                    value={item.key}
                    onChange={(e) => updateArrayField("productFeatures", idx, "key", e.target.value)}
                    className="flex-1 h-10 bg-white border-none rounded-xl font-bold text-xs"
                  />
                  <Input
                    placeholder="Detail (e.g. 4 Hours backup)"
                    value={item.value}
                    onChange={(e) => updateArrayField("productFeatures", idx, "value", e.target.value)}
                    className="flex-1 h-10 bg-white border-none rounded-xl text-xs"
                  />
                  <Button variant="ghost" size="icon" onClick={() => removeArrayItem("productFeatures", idx)} className="text-slate-300 hover:text-red-500">
                    <Trash2 size={16} />
                  </Button>
                </div>
              ))}
            </div>
            <Button variant="outline" size="sm" onClick={() => addArrayItem("productFeatures")} className="mt-6 rounded-xl text-blue-900 border-blue-200 font-black uppercase text-[10px] tracking-widest">
              <Plus size={14} className="mr-1" /> Add Feature Item
            </Button>
          </div>
        </div>
      </div>

      {/* STICKY FOOTER ACTION */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-8 z-20 rounded-b-[2.5rem]">
        <div className="max-w-5xl mx-auto flex items-center justify-end">
          <Button 
            size="lg"
            onClick={() => mutation.mutate()} 
            disabled={mutation.isPending}
            className="group bg-blue-900 hover:bg-slate-900 text-white shadow-2xl shadow-blue-900/30 transition-all duration-500 px-12 h-14 rounded-2xl font-black uppercase tracking-[0.2em] border-b-4 border-blue-950 active:border-b-0 active:translate-y-1"
          >
            {mutation.isPending ? (
              <div className="flex items-center gap-3"><Loader2 className="w-5 h-5 animate-spin" /><span>Saving Details...</span></div>
            ) : (
              <div className="flex items-center gap-3"><span>Save & Continue</span></div>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}