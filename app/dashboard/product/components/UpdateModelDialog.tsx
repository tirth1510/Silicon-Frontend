/* eslint-disable react/no-unescaped-entities */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateModelService } from "@/services/model.api";
import { Loader2, Save, X, Layers, Activity, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

interface UpdateModelDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  defaultValues: {
    modelName: string;
    status: string;
  };
  onSuccess: () => void;
}

export default function UpdateModelDialog({
  open,
  onClose,
  productId,
  modelId,
  defaultValues,
  onSuccess,
}: UpdateModelDialogProps) {
  const [form, setForm] = useState(defaultValues);

  const mutation = useMutation({
    mutationFn: async (data: any) => updateModelService(productId, modelId, data),
    onSuccess: () => {
      toast.success("Model variant updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update model");
    },
  });

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-2xl border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden">
        
        {/* --- HEADER --- */}
        <div className="px-8 py-6 bg-blue-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Layers className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">Update Model Info</DialogTitle>
              <DialogDescription className="text-blue-100/70 font-bold uppercase text-[10px] tracking-widest mt-1">
                Product ID: {productId.slice(-6)} | Model ID: {modelId.slice(-6)}
              </DialogDescription>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-8 space-y-8 bg-white">
          {/* Main Inputs Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Model Name */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-[0.2em] ml-1 flex items-center gap-2">
                <Layers size={12} /> Model Name
              </label>
              <Input
                placeholder="e.g. X-500 Deluxe"
                value={form.modelName}
                onChange={(e) => setForm({ ...form, modelName: e.target.value })}
                className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold text-slate-900 focus:ring-blue-900/10 transition-all"
              />
            </div>

            {/* Visibility Status */}
            <div className="space-y-3">
              <label className="text-[10px] font-black uppercase text-blue-900 tracking-[0.2em] ml-1 flex items-center gap-2">
                <Activity size={12} /> Visibility Status
              </label>
              <Select
                value={form.status}
                onValueChange={(value) => setForm({ ...form, status: value })}
              >
                <SelectTrigger className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold focus:ring-blue-900/10">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="rounded-2xl border-slate-100 shadow-xl font-bold">
                  <SelectItem value="Padding" className="text-amber-600 py-3">Pending / Padding</SelectItem>
                  <SelectItem value="Live" className="text-green-600 py-3">Live on Catalog</SelectItem>
                  <SelectItem value="Enquiry" className="text-purple-600 py-3">Enquiry Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Status Message Info */}
          <div className="p-4 bg-blue-50/50 border border-blue-100 rounded-2xl flex items-start gap-3">
             <div className="mt-0.5"><CheckCircle2 className="w-4 h-4 text-blue-600" /></div>
             <p className="text-xs font-medium text-slate-500 leading-relaxed">
               Updating the status to <span className="font-bold text-blue-900">"Live"</span> will make this model immediately visible to customers on the main storefront.
             </p>
          </div>

          {/* --- FOOTER ACTIONS --- */}
          <div className="flex justify-end items-center gap-4 pt-6 border-t border-slate-100">
            <Button 
              variant="ghost" 
              onClick={onClose}
              disabled={mutation.isPending}
              className="px-8 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-all"
            >
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate(form)}
              disabled={mutation.isPending || !form.modelName}
              className="bg-blue-900 hover:bg-slate-900 text-white shadow-xl shadow-blue-900/20 px-10 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-b-4 border-blue-950 active:border-b-0 active:translate-y-1 transition-all flex items-center gap-2"
            >
              {mutation.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Syncing...</span>
                </>
              ) : (
                <>
                  <Save className="w-4 h-4" />
                  <span>Apply Changes</span>
                </>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}