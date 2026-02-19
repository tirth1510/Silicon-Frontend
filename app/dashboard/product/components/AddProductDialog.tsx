/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Package, FileText, Palette, Sparkles } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

import BasicInfoTab from "@/app/dashboard/product/add/Product/components/BasicInfoTab";
import ModelDetailsTab from "@/app/dashboard/product/add/Product/components/modelTab";
import ColorVariantTab from "@/app/dashboard/product/add/Product/components/colorTab";
import ProductIconsTab from "@/app/dashboard/product/add/Product/components/iconsTab";

interface AddProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddProductDialog({ open, onClose, onSuccess }: AddProductDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [productId, setProductId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);
  const [maxStepReached, setMaxStepReached] = useState<number>(0);

  const handleClose = () => {
    setActiveTab("basic");
    setProductId(null);
    setModelId(null);
    setMaxStepReached(0);
    onClose();
  };

  const handleComplete = () => {
    onSuccess();
    handleClose();
  };

  const steps = [
    { value: "basic", label: "Basic Info", icon: Package, id: 0 },
    { value: "models", label: "Specifications", icon: FileText, id: 1, disabled: !productId },
    { value: "colors", label: "Colors & Pricing", icon: Palette, id: 2, disabled: !modelId },
    { value: "icons", label: "Features", icon: Sparkles, id: 3, disabled: !modelId },
  ];

  const handleStepClick = (step: any, index: number) => {
    if (!step.disabled || index <= maxStepReached) {
      setActiveTab(step.value);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      {/* WIDTH INCREASED: w-[98vw] and max-w-7xl for maximum desktop span */}
      <DialogContent className="w-[98vw] max-w-7xl h-[92vh] overflow-hidden p-0 flex flex-col border-none shadow-2xl rounded-[2.5rem]">
        <VisuallyHidden>
          <DialogTitle>Add New Product</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-6 md:px-12 py-6 border-b bg-white shrink-0">
          <h2 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter">
            Add New <span className="text-blue-900">Product</span>
          </h2>
          <p className="text-sm text-slate-500 font-medium">Step-by-step product configuration and inventory setup</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Step Indicator - Center Aligned and Wider Spacing */}
          <div className="px-6 md:px-20 py-8 bg-slate-50/50 border-b shrink-0">
            <div className="flex items-center justify-between relative max-w-5xl mx-auto">
              {/* Progress Line Background */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-slate-200 -z-10 rounded-full" />
              
              {/* Active Progress Line */}
              <div 
                className="absolute top-6 left-0 h-1 bg-blue-600 -z-10 transition-all duration-700 ease-in-out rounded-full"
                style={{ width: `${(steps.findIndex(s => s.value === activeTab) / (steps.length - 1)) * 100}%` }}
              />

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeTab === step.value;
                const isPast = steps.findIndex(s => s.value === activeTab) > index;
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
                    <div
                      className={`w-12 h-12 md:w-14 md:h-14 rounded-2xl flex items-center justify-center transition-all duration-500 border-4 ${
                        isActive
                          ? 'bg-blue-600 border-blue-100 text-white shadow-xl shadow-blue-200'
                          : isPast
                            ? 'bg-[#00B5AD] border-teal-50 text-white'
                            : 'bg-white border-slate-100 text-slate-400'
                      }`}
                    >
                      {isPast ? <Check className="w-6 h-6 stroke-[4px]" /> : <Icon className="w-5 h-5 md:w-6 md:h-6" />}
                    </div>

                    <div className="absolute -bottom-8 w-max">
                      <span className={`text-[10px] md:text-[11px] font-black uppercase tracking-wider ${
                        isActive ? 'text-blue-600' : 'text-slate-400'
                      }`}>
                        {step.label}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Contents - Using wider padding for large modal */}
          <div className="flex-1 overflow-y-auto px-6 md:px-16 py-10 scrollbar-hide bg-white">
            <div className="max-w-6xl mx-auto"> {/* Inner container for better readability */}
              <TabsContent value="basic" className="m-0 outline-none animate-in fade-in zoom-in-95 duration-500">
                <BasicInfoTab
                  onSuccess={(prodId, modId) => {
                    setProductId(prodId);
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