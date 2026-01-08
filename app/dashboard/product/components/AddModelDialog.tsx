"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Layers, FileText, Palette, Sparkles } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

// Import components from add/model/[productId]
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

  const handleClose = () => {
    setActiveTab("basic");
    setModelId(null);
    onClose();
  };

  const handleComplete = () => {
    onSuccess();
    handleClose();
  };

  const steps = [
    { value: "basic", label: "Model Info", icon: Layers, completed: !!modelId },
    { value: "models", label: "Specifications", icon: FileText, completed: false, disabled: !modelId },
    { value: "colors", label: "Colors & Pricing", icon: Palette, completed: false, disabled: !modelId },
    { value: "icons", label: "Features", icon: Sparkles, completed: false, disabled: !modelId },
  ];

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[90vh] overflow-hidden p-0 gap-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Add New Model</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-10 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <h2 className="text-3xl font-bold text-gray-900">Add New Model</h2>
          <p className="text-sm text-gray-600 mt-2">
            Add a new model variant to the existing product
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          {/* Enhanced Step Indicator */}
          <div className="px-10 pt-6 pb-4 bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center justify-between relative">
              {/* Progress Line */}
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-gradient-to-r from-purple-500 to-pink-500 transition-all duration-500 ease-out"
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
                    className={`flex flex-col items-center gap-2 flex-1 relative group ${step.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'
                      }`}
                  >
                    {/* Circle */}
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-500/50 scale-110'
                        : isPast || isCompleted
                          ? 'bg-green-500 shadow-md'
                          : 'bg-white border-2 border-gray-300 group-hover:border-purple-400'
                        }`}
                    >
                      {isPast || isCompleted ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon
                          className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-purple-500'
                            }`}
                        />
                      )}
                    </div>

                    {/* Label */}
                    <div className="text-center">
                      <div
                        className={`text-xs font-semibold transition-colors ${isActive
                          ? 'text-purple-600'
                          : isPast || isCompleted
                            ? 'text-green-600'
                            : 'text-gray-500'
                          }`}
                      >
                        Step {index + 1}
                      </div>
                      <div
                        className={`text-sm font-medium mt-1 transition-colors ${isActive
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

          {/* Tab Contents */}
          <div className="flex-1 overflow-y-auto px-10 py-6">
            <TabsContent value="basic" className="mt-0 h-full">
              <ModelBasicTab
                productId={productId}
                onSuccess={(modId) => {
                  setModelId(modId);
                  setActiveTab("models");
                }}
              />
            </TabsContent>

            <TabsContent value="models" className="mt-0 h-full">
              {productId && modelId && (
                <ModelDetailsTab
                  productId={productId}
                  modelId={modelId}
                  onNext={() => setActiveTab("colors")}
                />
              )}
            </TabsContent>

            <TabsContent value="colors" className="mt-0 h-full">
              {productId && modelId && (
                <ColorVariantTab
                  productId={productId}
                  modelId={modelId}
                  onNext={() => setActiveTab("icons")}
                />
              )}
            </TabsContent>

            <TabsContent value="icons" className="mt-0 h-full">
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

