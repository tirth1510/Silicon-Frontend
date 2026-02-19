/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProductModelService } from "@/services/product.api";
import { Loader2, Layers, ArrowRight, Info } from "lucide-react";
import { toast } from "sonner";

interface Props {
  productId: string;
  onSuccess: (modelId: string) => void;
}

export default function AddModelStep({ productId, onSuccess }: Props) {
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddModel = async () => {
    if (!modelName.trim()) {
      toast.error("Model name is required");
      return;
    }

    try {
      setLoading(true);
      const res = await addProductModelService(productId, {
        modelName: modelName.trim(),
      });

      toast.success("Basic model info saved!");
      onSuccess(res.data._id); // modelId
    } catch (err: any) {
      toast.error(err.message || "Failed to add model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full relative">
      <div className="flex-1 overflow-y-auto pr-2 scrollbar-hide">
        <div className="max-w-4xl mx-auto space-y-8 pb-32">
          
          {/* Header Info */}
          <div className="p-6 border-2 border-blue-50 bg-blue-50/30 rounded-[2rem] flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-900 flex items-center justify-center shrink-0 shadow-lg shadow-blue-900/20">
              <Layers className="text-white w-6 h-6" />
            </div>
            <div className="space-y-1">
              <h2 className="text-xl font-black text-blue-900 uppercase tracking-tight">Model Configuration</h2>
              <p className="text-sm text-slate-500 font-medium leading-relaxed">
                Enter the primary name for this variant. You can configure technical specifications and pricing in the next steps.
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-end">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase text-blue-900 tracking-widest ml-1 flex items-center gap-2">
                Model Name <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g. X-500 Pro / Deluxe Edition"
                value={modelName}
                onChange={(e) => setModelName(e.target.value)}
                className="w-full h-14 bg-white border-2 border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-50 transition-all font-bold text-slate-900 placeholder:font-medium"
              />
            </div>

            <div className="hidden md:flex items-center gap-2 text-slate-400 mb-4 italic">
              <Info size={16} />
              <p className="text-xs font-medium">Use a unique identifier for this model variant.</p>
            </div>
          </div>
        </div>
      </div>

      {/* Sticky Footer Action */}
      <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-md border-t border-slate-100 p-6 md:p-8 z-20 rounded-b-[2.5rem]">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <p className="hidden sm:block text-slate-400 text-[10px] font-black uppercase tracking-[0.2em]">
            Step 1: Identifying the variant
          </p>
          
          <Button 
            onClick={handleAddModel} 
            disabled={loading || !modelName.trim()}
            className="group bg-blue-900 hover:bg-slate-900 text-white shadow-2xl shadow-blue-900/30 transition-all duration-500 px-12 h-14 rounded-2xl font-black uppercase tracking-[0.2em] disabled:opacity-30 border-b-4 border-blue-950 active:border-b-0 active:translate-y-1 w-full sm:w-auto"
          >
            {loading ? (
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