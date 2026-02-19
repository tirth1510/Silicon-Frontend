/* eslint-disable react/no-unescaped-entities */
/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { updateValuableSchemeService } from "@/services/model.api";
import { Star, Loader2, Save, X, Info, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  currentScheme: any;
  onSuccess: () => void;
  children?: React.ReactNode; // Parent se renderDialogHeader receive karne ke liye
}

export default function UpdateValuableDialog({
  open,
  onClose,
  productId,
  modelId,
  currentScheme,
  onSuccess,
  children,
}: Props) {
  // Local state to track the selection (true/false)
  const [isValuable, setIsValuable] = useState<boolean>(false);

  // Jab dialog open ho, tab database se aayi value set karein
  useEffect(() => {
    if (open) {
      setIsValuable(currentScheme?.valuableProduct || false);
    }
  }, [open, currentScheme]);

  const mutation = useMutation({
    mutationFn: (value: boolean) => updateValuableSchemeService(productId, modelId, value),
    onSuccess: () => {
      toast.success("Catalog synchronization complete!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to update catalog status");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-xl border-none shadow-2xl rounded-[2.5rem] p-0 overflow-hidden bg-white">
        
        {/* --- DYNAMIC HEADER --- */}
        <div className="px-8 py-6 bg-blue-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Star className={`w-6 h-6 ${isValuable ? "fill-yellow-400 text-yellow-400" : "text-blue-300"}`} />
            </div>
            <div>
              <DialogTitle className="text-xl font-black tracking-tight uppercase leading-none">Valuable Scheme</DialogTitle>
              <DialogDescription className="text-blue-200/60 text-[10px] font-bold uppercase tracking-widest mt-1.5">
                Visibility Configuration
              </DialogDescription>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
            <X size={20} />
          </button>
        </div>

        <div className="p-8 space-y-6">
          {/* --- PRODUCT PREVIEW (Injected via children) --- */}
          {children}

          {/* --- SELECTION AREA --- */}
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">
              Select Promotion Status
            </label>
            
            <div className="grid grid-cols-2 gap-4">
              {/* TRUE OPTION */}
              <button
                type="button"
                onClick={() => setIsValuable(true)}
                className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-4 transition-all duration-300 ${
                  isValuable 
                    ? "bg-yellow-50 border-yellow-400 shadow-xl shadow-yellow-500/10 scale-[1.02]" 
                    : "bg-slate-50 border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <CheckCircle2 className={`w-8 h-8 mb-2 ${isValuable ? "text-yellow-600" : "text-slate-400"}`} />
                <span className={`font-black text-sm uppercase tracking-tighter ${isValuable ? "text-yellow-700" : "text-slate-600"}`}>
                  Make Valuable
                </span>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Active Badge</p>
              </button>

              {/* FALSE OPTION */}
              <button
                type="button"
                onClick={() => setIsValuable(false)}
                className={`flex flex-col items-center justify-center p-6 rounded-[2rem] border-4 transition-all duration-300 ${
                  !isValuable 
                    ? "bg-slate-100 border-slate-400 shadow-xl scale-[1.02]" 
                    : "bg-slate-50 border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <XCircle className={`w-8 h-8 mb-2 ${!isValuable ? "text-slate-700" : "text-slate-400"}`} />
                <span className={`font-black text-sm uppercase tracking-tighter ${!isValuable ? "text-slate-800" : "text-slate-600"}`}>
                  Regular Item
                </span>
                <p className="text-[9px] font-bold text-slate-400 mt-1 uppercase">Standard View</p>
              </button>
            </div>
          </div>

          {/* --- INFO FOOTER --- */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 border border-blue-100 rounded-2xl">
            <AlertTriangle size={18} className="text-blue-600 mt-0.5 shrink-0" />
            <p className="text-[10px] font-bold text-blue-900/60 uppercase leading-relaxed tracking-wider">
              Note: Marking a product as "Valuable" will automatically prioritize its placement in the featured section and search rankings.
            </p>
          </div>

          {/* --- FINAL ACTIONS --- */}
          <div className="flex gap-4 pt-6 border-t border-slate-100">
            <Button 
              variant="ghost" 
              onClick={onClose}
              className="flex-1 h-14 rounded-2xl font-black uppercase text-[10px] tracking-widest text-slate-400"
            >
              Cancel
            </Button>
            
            <Button
              onClick={() => mutation.mutate(isValuable)}
              disabled={mutation.isPending}
              className="flex-[2] bg-blue-900 hover:bg-slate-950 text-white shadow-2xl shadow-blue-900/30 h-14 rounded-2xl font-black uppercase text-[10px] tracking-[0.2em] border-b-4 border-blue-950 active:border-b-0 active:translate-y-1 transition-all"
            >
              {mutation.isPending ? (
                <div className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Save className="w-5 h-5" />
                  <span>Update Catalog</span>
                </div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}