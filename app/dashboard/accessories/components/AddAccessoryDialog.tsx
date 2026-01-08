/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Package, FileText, Palette } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from "@tanstack/react-query";
import { createProductService, CreateProductPayload, CreateProductFiles } from "@/services/accessory.service";
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
import { Label } from "@/components/ui/label";

interface AddAccessoryDialogProps {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

const categories = [
  { value: "1", label: "Category 1" },
  { value: "2", label: "Category 2" },
  { value: "3", label: "Category 3" },
  { value: "4", label: "Category 4" },
];

export default function AddAccessoryDialog({ open, onClose, onSuccess }: AddAccessoryDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");

  // Form state
  const [form, setForm] = useState<CreateProductPayload>({
    productCategory: "1",
    productTitle: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    specifications: "",
    warranty: "",
    productSpecifications: [],
  });

  const [productImages, setProductImages] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const mutation = useMutation({
    mutationFn: async () => {
      const files: CreateProductFiles = {
        productImages,
        galleryImages,
      };
      return createProductService(form, files);
    },
    onSuccess: () => {
      alert("Accessory created successfully!");
      onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      alert(error.message || "Failed to create accessory");
    },
  });

  const handleClose = () => {
    setActiveTab("basic");
    setForm({
      productCategory: "1",
      productTitle: "",
      description: "",
      price: 0,
      discount: 0,
      stock: 0,
      specifications: "",
      warranty: "",
      productSpecifications: [],
    });
    setProductImages([]);
    setGalleryImages([]);
    onClose();
  };

  const steps = [
    { value: "basic", label: "Basic Info", icon: Package, completed: false },
    { value: "details", label: "Details & Specs", icon: FileText, completed: false },
    { value: "images", label: "Images", icon: Palette, completed: false },
  ];

  const canProceedToDetails = form.productTitle && form.description && form.price > 0;
  const canSubmit = canProceedToDetails && productImages.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-5xl h-[60vh] overflow-hidden p-0 gap-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Add New Accessory</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-10 py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 flex-shrink-0">
          <h2 className="text-3xl font-bold text-gray-900">Add New Accessory</h2>
          <p className="text-sm text-gray-600 mt-2">
            Complete all steps to add a new accessory to your inventory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          {/* Step Indicator */}
          <div className="px-10 pt-6 pb-4 bg-gray-50/50 flex-shrink-0">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{
                    width: `${((steps.findIndex(s => s.value === activeTab) + 1) / steps.length) * 100}%`
                  }}
                />
              </div>

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeTab === step.value;
                const isPast = steps.findIndex(s => s.value === activeTab) > index;

                return (
                  <button
                    key={step.value}
                    onClick={() => setActiveTab(step.value)}
                    className={`flex flex-col items-center gap-2 flex-1 relative group cursor-pointer`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 scale-110'
                        : isPast
                          ? 'bg-green-500 shadow-md'
                          : 'bg-white border-2 border-gray-300 group-hover:border-blue-400'
                        }`}
                    >
                      {isPast ? (
                        <Check className="w-6 h-6 text-white" />
                      ) : (
                        <Icon
                          className={`w-6 h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                            }`}
                        />
                      )}
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-xs font-semibold ${isActive ? 'text-blue-600' : isPast ? 'text-green-600' : 'text-gray-500'
                          }`}
                      >
                        Step {index + 1}
                      </div>
                      <div
                        className={`text-sm font-medium mt-1 ${isActive ? 'text-gray-900' : 'text-gray-600'
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
          <div className="flex-1 overflow-hidden px-10 py-6 relative">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-0 h-full relative">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-6 pb-24">
                    {/* Category and Title - Equal Width */}
                    <div className="grid grid-cols-2 gap-6">
                      <div className="space-y-3">
                        <Label className="block text-sm font-semibold text-gray-700">
                          Product Category <span className="text-red-500">*</span>
                        </Label>
                        <Select
                          value={form.productCategory}
                          onValueChange={(value) => setForm({ ...form, productCategory: value })}
                        >
                          <SelectTrigger className="w-full !h-12 px-4 py-0 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((cat) => (
                              <SelectItem key={cat.value} value={cat.value} className="cursor-pointer hover:bg-blue-50">
                                {cat.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-3">
                        <Label className="block text-sm font-semibold text-gray-700">
                          Product Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Surgical Gloves Pack"
                          value={form.productTitle}
                          onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
                          className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Price, Discount, Stock in one row */}
                    <div className="grid grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <Label className="block text-sm font-semibold text-gray-700">
                          Price (₹) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.price || ""}
                          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                          className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="block text-sm font-semibold text-gray-700">
                          Discount (%)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.discount || ""}
                          onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
                          className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
                        />
                      </div>

                      <div className="space-y-3">
                        <Label className="block text-sm font-semibold text-gray-700">
                          Stock
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.stock || ""}
                          onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                          className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-3">
                      <Label className="block text-sm font-semibold text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        placeholder="Enter a detailed description..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full min-h-[140px] px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ({form.description.length} characters)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-10 py-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm text-gray-600">
                      Fields marked with <span className="text-red-500 font-semibold">*</span> are required
                    </p>
                    <Button
                      onClick={() => setActiveTab("details")}
                      disabled={!canProceedToDetails}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-10 py-3 h-12 font-semibold rounded-lg min-w-[200px]"
                    >
                      Next: Details <span className="ml-2">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Details Tab */}
            <TabsContent value="details" className="mt-0 h-full relative">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-6 pb-24">
                    <div className="space-y-3">
                      <Label className="block text-sm font-semibold text-gray-700">Specifications</Label>
                      <Textarea
                        placeholder="Enter specifications (one per line)..."
                        value={form.specifications}
                        onChange={(e) => setForm({ ...form, specifications: e.target.value })}
                        className="w-full min-h-[140px] px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                    </div>

                    <div className="space-y-3">
                      <Label className="block text-sm font-semibold text-gray-700">Warranty Information</Label>
                      <Textarea
                        placeholder="Enter warranty details..."
                        value={form.warranty}
                        onChange={(e) => setForm({ ...form, warranty: e.target.value })}
                        className="w-full min-h-[140px] px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-10 py-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                      className="px-8 py-3 h-12 border-2 border-gray-300 hover:bg-gray-100 rounded-lg"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => setActiveTab("images")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-10 py-3 h-12 font-semibold rounded-lg min-w-[200px]"
                    >
                      Next: Images <span className="ml-2">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="mt-0 h-full relative">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-6 pb-24">
                    <div className="space-y-3">
                      <Label className="block text-sm font-semibold text-gray-700">
                        Product Images <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setProductImages(Array.from(e.target.files || []))}
                        className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500">
                        {productImages.length} file(s) selected
                      </p>
                    </div>

                    <div className="space-y-3">
                      <Label className="block text-sm font-semibold text-gray-700">Gallery Images</Label>
                      <Input
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
                        className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 file:font-semibold hover:file:bg-blue-100"
                      />
                      <p className="text-xs text-gray-500">
                        {galleryImages.length} file(s) selected
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-10 py-4">
                  <div className="flex items-center justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("details")}
                      className="px-8 py-3 h-12 border-2 border-gray-300 hover:bg-gray-100 rounded-lg"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => mutation.mutate()}
                      disabled={!canSubmit || mutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-10 py-3 h-12 font-semibold rounded-lg min-w-[220px]"
                    >
                      {mutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Creating...
                        </>
                      ) : (
                        <>
                          Create Accessory <span className="ml-2">✓</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>
          </div>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}

