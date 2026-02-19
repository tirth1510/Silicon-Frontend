/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Layers, FileText, Palette, Sparkles, X } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Import components
import ModelBasicTab from "@/app/dashboard/product/add/model/[productId]/components/BasicInfoTab";
import ModelDetailsTab from "@/app/dashboard/product/add/model/[productId]/components/modelTab";
import ColorVariantTab from "@/app/dashboard/product/add/model/[productId]/components/colorTab";
import ProductIconsTab from "@/app/dashboard/product/add/model/[productId]/components/iconsTab";

interface AddModelDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  onSuccess: () => void;
}

export default function AddModelDialog({ open, onClose, productId, onSuccess }: AddModelDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [modelId, setModelId] = useState<string | null>(null);
  const [maxStepReached, setMaxStepReached] = useState<number>(0);

  const handleClose = () => {
    setActiveTab("basic");
    setModelId(null);
    setMaxStepReached(0);
    onClose();
  };

  const handleComplete = () => {
    onSuccess();
    handleClose();
  };

  const steps = [
    { value: "basic", label: "Model Info", icon: Layers, id: 0 },
    { value: "models", label: "Specifications", icon: FileText, id: 1, disabled: !modelId },
    { value: "colors", label: "Colors & Pricing", icon: Palette, id: 2, disabled: !modelId },
    { value: "icons", label: "Features", icon: Sparkles, id: 3, disabled: !modelId },
  ];

  const handleStepClick = (step: any, index: number) => {
    // Navigates only if the step is already unlocked/completed
    if (!step.disabled || index <= maxStepReached) {
      setActiveTab(step.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* MAX WIDTH SET TO 7XL FOR LARGE DESKTOP VIEW */}
      <DialogContent className="w-[98vw] max-w-7xl h-[92vh] overflow-hidden p-0 flex flex-col border-none shadow-2xl rounded-[2.5rem]">
        <VisuallyHidden>
          <DialogTitle>Add New Model</DialogTitle>
        </VisuallyHidden>

        {/* --- HEADER SECTION --- */}
        <div className="px-6 md:px-12 py-6 border-b bg-white flex justify-between items-center shrink-0">
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
              Add New <span className="text-blue-900">Model Variant</span>
            </h2>
            <p className="text-xs md:text-sm text-slate-500 font-medium mt-1 uppercase tracking-widest">
              Configuring variants for Product ID: {productId.slice(-6)}
            </p>
          </div>
          <button onClick={handleClose} className="p-3 hover:bg-slate-100 rounded-full transition-colors text-slate-400">
            <X size={24} />
          </button>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          
          {/* --- STEP INDICATOR AREA --- */}
          <div className="px-6 md:px-20 py-8 bg-slate-50/50 border-b shrink-0">
            <div className="flex items-center justify-between relative max-w-5xl mx-auto">
              
              {/* Progress Line Background */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full" />
              
              {/* Active Animated Progress Line */}
              <div 
                className="absolute top-6 left-0 h-1 bg-blue-600 -z-10 transition-all duration-700 ease-in-out rounded-full"
                style={{ width: `${(steps.findIndex(s => s.value === activeTab) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeTab === step.value;
                const isPast = steps.findIndex(s => s.value === activeTab) > index;
                const isCompleted = index < maxStepReached;
                const isDisabled = step.disabled && index > maxStepReached;

                return (
                  <button
                    key={step.value}
                    onClick={() => handleStepClick(step, index)}
                    disabled={isDisabled}
                    className={`flex flex-col items-center gap-3 relative transition-all duration-300 ${
                      isDisabled ? 'opacity-30 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                    }`}
                  >
                    {/* Step Circle */}
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                        isActive
                          ? 'bg-blue-900 border-blue-100 text-white shadow-2xl shadow-blue-900/30'
                          : (isPast || isCompleted)
                            ? 'bg-[#00B5AD] border-teal-50 text-white'
                            : 'bg-white border-slate-100 text-slate-300'
                      }`}
                    >
                      {(isPast || isCompleted) ? (
                        <Check className="w-6 h-6 stroke-[4px]" />
                      ) : (
                        <Icon className="w-6 h-6" />
                      )}
                    </div>

                    {/* Step Label (Hidden on smallest mobile) */}
                    <span className={`hidden md:block absolute -bottom-8 text-[10px] font-black uppercase tracking-[0.2em] whitespace-nowrap ${
                      isActive ? 'text-blue-900' : 'text-slate-400'
                    }`}>
                      {step.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* --- TAB CONTENT AREA --- */}
          <div className="flex-1 overflow-y-auto px-6 md:px-16 py-10 bg-white scrollbar-hide">
            <div className="max-w-6xl mx-auto">
              
              <TabsContent value="basic" className="m-0 outline-none animate-in fade-in zoom-in-95 duration-500">
                <ModelBasicTab
                  productId={productId}
                  onSuccess={(modId) => {
                    setModelId(modId);
                    setMaxStepReached(1);
                    setActiveTab("models");
                  }}
                />
              </TabsContent>

              <TabsContent value="models" className="m-0 outline-none animate-in fade-in slide-in-from-right-4 duration-500">
                {productId && modelId && (
                  <ModelDetailsTab
                    productId={productId}
                    modelId={modelId}
                    onNext={() => {
                      setMaxStepReached(2);
                      setActiveTab("colors");
                    }}
                  />
                )}
              </TabsContent>

              <TabsContent value="colors" className="m-0 outline-none animate-in fade-in slide-in-from-right-4 duration-500">
                {productId && modelId && (
                  <ColorVariantTab
                    productId={productId}
                    modelId={modelId}
                    onNext={() => {
                      setMaxStepReached(3);
                      setActiveTab("icons");
                    }}
                  />
                )}
              </TabsContent>

              <TabsContent value="icons" className="m-0 outline-none animate-in fade-in slide-in-from-right-4 duration-500">
                {productId && modelId && (
                  <ProductIconsTab
                    productId={productId}
                    modelId={modelId}
                    onNext={handleComplete}
                  />
                )}
              </TabsContent>

            </div>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}