/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Package, FileText, Palette, Sparkles } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Import tab components
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

  const handleClose = () => {
    // Reset state
    setActiveTab("basic");
    setProductId(null);
    setModelId(null);
    onClose();
  };

  const handleComplete = () => {
    onSuccess();
    handleClose();
  };

  const steps = [
    { value: "basic", label: "Basic Info", icon: Package, completed: !!productId },
    { value: "models", label: "Specifications", icon: FileText, completed: false, disabled: !productId },
    { value: "colors", label: "Colors & Pricing", icon: Palette, completed: false, disabled: !modelId },
    { value: "icons", label: "Features", icon: Sparkles, completed: false, disabled: !modelId },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[90vh] overflow-hidden p-0 gap-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Add New Product</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Add New Product</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Complete all steps to add a new product to your inventory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Step Indicator */}
          <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-gray-50/50 shrink-0">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500 ease-out"
                  style={{
                    width: `${((steps.findIndex(s => s.value === activeTab) + 1) / steps.length) * 100}%`
                  }}
                />
              </div>

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeTab === step.value;
                const isCompleted = step.completed;
                const isPast = steps.findIndex(s => s.value === activeTab) > index;

                return (
                  <button
                    key={step.value}
                    onClick={() => !step.disabled && setActiveTab(step.value)}
                    disabled={step.disabled}
                    className={`flex flex-col items-center gap-1 sm:gap-2 flex-1 relative group ${step.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                  >
                    {/* Circle */}
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 scale-110'
                        : isPast || isCompleted
                          ? 'bg-green-500 shadow-md'
                          : 'bg-white border-2 border-gray-300 group-hover:border-blue-400'
                        }`}
                    >
                      {isPast || isCompleted ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      ) : (
                        <Icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                            }`}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <div
                        className={`text-[10px] sm:text-xs font-semibold transition-colors ${isActive
                          ? 'text-blue-600'
                          : isPast || isCompleted
                            ? 'text-green-600'
                            : 'text-gray-500'
                          }`}
                      >
                        Step {index + 1}
                      </div>
                      <div
                        className={`text-[10px] sm:text-xs lg:text-sm font-medium mt-0.5 sm:mt-1 transition-colors ${isActive
                          ? 'text-gray-900'
                          : 'text-gray-600'
                          }`}
                      >
                        {step.label}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tab Contents with smooth transitions */}
          <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative">
            <TabsContent value="basic" className="mt-0 h-full relative">
              <BasicInfoTab
                onSuccess={(prodId, modId) => {
                  setProductId(prodId);
                  setModelId(modId);
                  setActiveTab("models");
                }}
              />
            </TabsContent>

            <TabsContent value="models" className="mt-0 h-full relative">
              {productId && modelId && (
                <ModelDetailsTab
                  productId={productId}
                  modelId={modelId}
                  onNext={() => setActiveTab("colors")}
                />
              )}
            </TabsContent>

            <TabsContent value="colors" className="mt-0 h-full relative">
              {productId && modelId && (
                <ColorVariantTab
                  productId={productId}
                  modelId={modelId}
                  onNext={() => setActiveTab("icons")}
                />
              )}
            </TabsContent>

            <TabsContent value="icons" className="mt-0 h-full relative">
              {productId && modelId && (
                <ProductIconsTab
                  productId={productId}
                  modelId={modelId}
                  onNext={handleComplete}
                />
              )}
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

