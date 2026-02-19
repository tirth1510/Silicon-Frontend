/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateProductService } from "@/services/product.api";
import { Loader2, Save, X, Info } from "lucide-react";
import { toast } from "sonner";

const categories = [
  { value: "1", label: "Operating Theater" },
  { value: "2", label: "ICU Products" },
  { value: "3", label: "NICU Products" },
];

interface UpdateProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  defaultValues: {
    productTitle: string;
    productCategory: string;
    description: string;
  };
  onSuccess: () => void;
}

export default function UpdateProductDialog({
  open,
  onClose,
  productId,
  defaultValues,
  onSuccess,
}: UpdateProductDialogProps) {
  const [form, setForm] = useState(defaultValues);

  const mutation = useMutation({
    mutationFn: async (data: any) => updateProductService(productId, data),
    onSuccess: () => {
      toast.success("Product updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update product");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
        {/* --- HEADER --- */}
        <div className="px-8 py-6 bg-blue-900 text-white">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Edit3 className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight">Edit Identity</DialogTitle>
              <DialogDescription className="text-blue-100/70 font-medium">
                Update core brand information for Product ID: {productId.slice(-6)}
              </DialogDescription>
            </div>
          </div>
        </div>

        <div className="p-8 space-y-6 bg-white">
          {/* Category & Title Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-[0.2em] ml-1">
                Product Category
              </label>
              <Select
                value={form.productCategory}
                onValueChange={(value) => setForm({ ...form, productCategory: value })}
              >
                <SelectTrigger className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold focus:ring-blue-900/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-xl border-slate-100 shadow-xl">
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value} className="font-medium py-2.5">
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-[0.2em] ml-1">
                Product Title
              </label>
              <Input
                placeholder="Enter product title"
                value={form.productTitle}
                onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
                className="h-12 bg-slate-50 border-slate-200 rounded-xl font-bold focus:ring-blue-900/10"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <label className="text-[10px] font-black uppercase text-blue-900 tracking-[0.2em] ml-1">
              Main Description
            </label>
            <Textarea
              placeholder="Detailed description..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="min-h-[160px] bg-slate-50 border-slate-200 rounded-[1.5rem] p-4 font-medium resize-none focus:ring-blue-900/10 leading-relaxed"
            />
            <div className="flex justify-end pr-2">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest italic flex items-center gap-1">
                    <Info size={10} /> Length: {form.description.length} chars
                </span>
            </div>
          </div>

          {/* --- FOOTER ACTIONS --- */}
          <div className="flex justify-end items-center gap-3 pt-4 border-t border-slate-100">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="px-6 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-100"
            >
              Discard Changes
            </Button>
            <Button
              onClick={() => mutation.mutate(form)}
              disabled={mutation.isPending || !form.productTitle}
              className="bg-blue-900 hover:bg-slate-900 text-white shadow-xl shadow-blue-900/20 px-8 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-b-4 border-blue-950 active:border-b-0 active:translate-y-1 transition-all"
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Saving...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-4 h-4" />
                  <span>Update Changes</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// Missing Lucide Icon Import for Edit3
import { Edit3 } from "lucide-react";