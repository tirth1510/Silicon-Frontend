/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Check, Package, FileText, Palette, Plus, Trash2, RefreshCw } from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useMutation } from "@tanstack/react-query";
import { createProductService, CreateProductPayload, CreateProductFiles } from "@/services/accessory.service";
import { Product } from "@/types/accessory";
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
  accessories: Product[];
  onSuccess: () => void;
}

export default function AddAccessoryDialog({ open, onClose, accessories, onSuccess }: AddAccessoryDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [newCategory, setNewCategory] = useState("");

  // Extract unique categories from existing accessories - these are the valid enum values!
  const uniqueCategories = useMemo(() => {
    const categories = accessories
      .map(acc => acc.productCategory)
      .filter((cat, index, self) =>
        cat &&
        cat !== "SPO2" && // Filter out invalid "SPO2" category
        self.indexOf(cat) === index
      )
      .sort();
    return categories;
  }, [accessories]);

  // Form state
  const [form, setForm] = useState<CreateProductPayload>({
    productCategory: "",
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

  const [specsList, setSpecsList] = useState<string[]>([""]);
  const [warrantyList, setWarrantyList] = useState<string[]>([""]);
  const [productSpecsList, setProductSpecsList] = useState<{ key: string; value: string }[]>([{ key: "", value: "" }]);

  const replaceInputRef = useRef<HTMLInputElement>(null);
  const [replacingTarget, setReplacingTarget] = useState<{ index: number; type: 'product' | 'gallery' } | null>(null);

  const handleAddImages = (e: React.ChangeEvent<HTMLInputElement>, type: 'product' | 'gallery') => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (type === 'product') {
        setProductImages((prev) => [...prev, ...newFiles]);
      } else {
        setGalleryImages((prev) => [...prev, ...newFiles]);
      }
    }
    e.target.value = "";
  };

  const handleRemoveImage = (index: number, type: 'product' | 'gallery') => {
    if (type === 'product') {
      setProductImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setGalleryImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleReplaceClick = (index: number, type: 'product' | 'gallery') => {
    setReplacingTarget({ index, type });
    replaceInputRef.current?.click();
  };

  const handleReplaceFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && replacingTarget) {
      const file = e.target.files[0];
      if (replacingTarget.type === 'product') {
        setProductImages((prev) => {
          const newArr = [...prev];
          newArr[replacingTarget.index] = file;
          return newArr;
        });
      } else {
        setGalleryImages((prev) => {
          const newArr = [...prev];
          newArr[replacingTarget.index] = file;
          return newArr;
        });
      }
    }
    setReplacingTarget(null);
    e.target.value = "";
  };

  const mutation = useMutation({
    mutationFn: async () => {
      // Use new category if provided, otherwise use selected category
      const categoryToUse = newCategory.trim() || form.productCategory;

      // Prepare payload in the correct format
      const payload: any = {
        productCategory: categoryToUse,
        productTitle: form.productTitle,
        description: form.description,
        price: form.price,
        discount: form.discount || 0,
        stock: form.stock,
      };

      // Convert specifications string to JSON array format
      const specsArray = specsList
        .filter((line) => line.trim())
        .map((line) => ({ points: line.trim() }));
      if (specsArray.length > 0) {
        payload.specifications = JSON.stringify(specsArray);
      }

      // Convert warranty string to JSON array format
      const warrantyArray = warrantyList
        .filter((line) => line.trim())
        .map((line) => ({ points: line.trim() }));
      if (warrantyArray.length > 0) {
        payload.warranty = JSON.stringify(warrantyArray);
      }

      // Product Specifications (Key-Value)
      const productSpecsArray = productSpecsList.filter(
        (item) => item.key.trim() || item.value.trim()
      );
      if (productSpecsArray.length > 0) {
        payload.productSpecifications = productSpecsArray;
      }

      const files: CreateProductFiles = {
        productImages,
        galleryImages,
      };
      return createProductService(payload, files);
    },
    onSuccess: () => {
      onSuccess();
      handleClose();
    },
    onError: (error: any) => {
      console.error("Failed to create accessory:", error);
    },
  });

  const handleClose = () => {
    setActiveTab("basic");
    setForm({
      productCategory: "",
      productTitle: "",
      description: "",
      price: 0,
      discount: 0,
      stock: 0,
      specifications: "",
      warranty: "",
      productSpecifications: [],
    });
    setNewCategory("");
    setProductImages([]);
    setGalleryImages([]);
    setSpecsList([""]);
    setWarrantyList([""]);
    setProductSpecsList([{ key: "", value: "" }]);
    onClose();
  };

  const steps = [
    { value: "basic", label: "Basic Info", icon: Package, completed: false },
    { value: "details", label: "Details & Specs", icon: FileText, completed: false },
    { value: "images", label: "Images", icon: Palette, completed: false },
  ];

  const hasCategory = form.productCategory || newCategory.trim();
  const canProceedToDetails = hasCategory && form.productTitle && form.description && form.price > 0;
  const canSubmit = canProceedToDetails && productImages.length > 0;

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="w-[95vw] max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[90vh] overflow-hidden p-0 gap-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Add New Accessory</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Add New Accessory</h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Complete all steps to add a new accessory to your inventory
          </p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
          {/* Step Indicator */}
          <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-gray-50/50 shrink-0">
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
                    className={`flex flex-col items-center gap-1 sm:gap-2 flex-1 relative group cursor-pointer`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${isActive
                        ? 'bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 scale-110'
                        : isPast
                          ? 'bg-green-500 shadow-md'
                          : 'bg-white border-2 border-gray-300 group-hover:border-blue-400'
                        }`}
                    >
                      {isPast ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      ) : (
                        <Icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${isActive ? 'text-white' : 'text-gray-400 group-hover:text-blue-500'
                            }`}
                        />
                      )}
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-[10px] sm:text-xs font-semibold ${isActive ? 'text-blue-600' : isPast ? 'text-green-600' : 'text-gray-500'
                          }`}
                      >
                        Step {index + 1}
                      </div>
                      <div
                        className={`text-[10px] sm:text-xs lg:text-sm font-medium mt-0.5 sm:mt-1 ${isActive ? 'text-gray-900' : 'text-gray-600'
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
          <div className="flex-1 overflow-hidden px-4 sm:px-6 lg:px-10 py-4 sm:py-6 relative">
            {/* Basic Info Tab */}
            <TabsContent value="basic" className="mt-0 h-full relative">
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-4 sm:space-y-6 pb-24">
                    {/* Category and Title - Equal Width */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Product Category <span className="text-red-500">*</span>
                        </Label>
                        <div className="space-y-2">
                          <Select
                            value={form.productCategory}
                            onValueChange={(value) => {
                              setForm({ ...form, productCategory: value });
                              setNewCategory(""); // Clear new category when selecting existing
                            }}
                          >
                            <SelectTrigger className="w-full !h-10 sm:!h-12 px-3 sm:px-4 py-0 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium text-xs sm:text-sm">
                              <SelectValue placeholder="Select existing category" />
                            </SelectTrigger>
                            <SelectContent>
                              {uniqueCategories.map((category) => (
                                <SelectItem key={category} value={category} className="cursor-pointer hover:bg-blue-50">
                                  {category}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <div className="text-center text-xs text-gray-500">OR</div>
                          <Input
                            placeholder="Enter new category name"
                            value={newCategory}
                            onChange={(e) => {
                              setNewCategory(e.target.value);
                              if (e.target.value.trim()) {
                                setForm({ ...form, productCategory: "" }); // Clear selected category
                              }
                            }}
                            className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                          />
                        </div>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Product Title <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          placeholder="e.g., Surgical Gloves Pack"
                          value={form.productTitle}
                          onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Price, Discount, Stock in one row */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Price (₹) <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.price || ""}
                          onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Discount (%)
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.discount || ""}
                          onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Stock
                        </Label>
                        <Input
                          type="number"
                          placeholder="0"
                          value={form.stock || ""}
                          onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    {/* Description */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Description <span className="text-red-500">*</span>
                      </Label>
                      <Textarea
                        placeholder="Enter a detailed description..."
                        value={form.description}
                        onChange={(e) => setForm({ ...form, description: e.target.value })}
                        className="w-full min-h-[100px] sm:min-h-[140px] px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none text-xs sm:text-sm"
                      />
                      <p className="text-xs text-gray-500 mt-1">
                        ({form.description.length} characters)
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
                    <p className="text-xs sm:text-sm text-gray-600">
                      Fields marked with <span className="text-red-500 font-semibold">*</span> are required
                    </p>
                    <Button
                      onClick={() => setActiveTab("details")}
                      disabled={!canProceedToDetails}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 sm:px-10 py-2 sm:py-3 h-10 sm:h-12 font-semibold rounded-lg min-w-[160px] sm:min-w-[200px] text-xs sm:text-sm w-full sm:w-auto"
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
                  <div className="space-y-4 sm:space-y-6 pb-24">
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">Product Specifications (Key-Value)</Label>
                      <div className="space-y-2">
                        {productSpecsList.map((item, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Key (e.g., Color)"
                              value={item.key}
                              onChange={(e) => {
                                const newList = [...productSpecsList];
                                newList[index].key = e.target.value;
                                setProductSpecsList(newList);
                              }}
                              className="flex-1 h-10 px-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 text-xs sm:text-sm"
                            />
                            <Input
                              placeholder="Value (e.g., Red)"
                              value={item.value}
                              onChange={(e) => {
                                const newList = [...productSpecsList];
                                newList[index].value = e.target.value;
                                setProductSpecsList(newList);
                              }}
                              className="flex-1 h-10 px-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 text-xs sm:text-sm"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newList = productSpecsList.filter((_, i) => i !== index);
                                setProductSpecsList(newList.length ? newList : [{ key: "", value: "" }]);
                              }}
                              className="shrink-0 h-10 w-10 border-2 border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setProductSpecsList([...productSpecsList, { key: "", value: "" }])}
                          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 h-10"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Key-Value Pair
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">Specifications</Label>
                      <div className="space-y-2">
                        {specsList.map((spec, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter specification point"
                              value={spec}
                              onChange={(e) => {
                                const newSpecs = [...specsList];
                                newSpecs[index] = e.target.value;
                                setSpecsList(newSpecs);
                              }}
                              className="flex-1 h-10 px-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 text-xs sm:text-sm"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newSpecs = specsList.filter((_, i) => i !== index);
                                setSpecsList(newSpecs.length ? newSpecs : [""]);
                              }}
                              className="shrink-0 h-10 w-10 border-2 border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setSpecsList([...specsList, ""])}
                          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 h-10"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Specification
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">Warranty Information</Label>
                      <div className="space-y-2">
                        {warrantyList.map((warranty, index) => (
                          <div key={index} className="flex gap-2">
                            <Input
                              placeholder="Enter warranty point"
                              value={warranty}
                              onChange={(e) => {
                                const newWarranty = [...warrantyList];
                                newWarranty[index] = e.target.value;
                                setWarrantyList(newWarranty);
                              }}
                              className="flex-1 h-10 px-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 text-xs sm:text-sm"
                            />
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => {
                                const newWarranty = warrantyList.filter((_, i) => i !== index);
                                setWarrantyList(newWarranty.length ? newWarranty : [""]);
                              }}
                              className="shrink-0 h-10 w-10 border-2 border-gray-300 hover:bg-red-50 hover:border-red-200 hover:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => setWarrantyList([...warrantyList, ""])}
                          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 h-10"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Warranty Point
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("basic")}
                      className="px-4 sm:px-8 py-2 sm:py-3 h-10 sm:h-12 border-2 border-gray-300 hover:bg-gray-100 rounded-lg text-xs sm:text-sm"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => setActiveTab("images")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 sm:px-10 py-2 sm:py-3 h-10 sm:h-12 font-semibold rounded-lg min-w-[140px] sm:min-w-[200px] text-xs sm:text-sm"
                    >
                      Next: Images <span className="ml-2">→</span>
                    </Button>
                  </div>
                </div>
              </div>
            </TabsContent>

            {/* Images Tab */}
            <TabsContent value="images" className="mt-0 h-full relative">
              <input
                type="file"
                ref={replaceInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleReplaceFile}
              />
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-4 sm:space-y-6 pb-24">
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Product Images <span className="text-red-500">*</span>
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {productImages.map((file, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleReplaceClick(index, 'product')}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleRemoveImage(index, 'product')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                          <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                            <Plus className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Add Image</span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleAddImages(e, 'product')}
                          />
                        </label>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">Gallery Images</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {galleryImages.map((file, index) => (
                          <div key={index} className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Gallery Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="secondary"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleReplaceClick(index, 'gallery')}
                              >
                                <RefreshCw className="h-4 w-4" />
                              </Button>
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() => handleRemoveImage(index, 'gallery')}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}
                        <label className="flex flex-col items-center justify-center aspect-square rounded-lg border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 transition-all cursor-pointer group">
                          <div className="w-10 h-10 rounded-full bg-gray-100 group-hover:bg-blue-100 flex items-center justify-center mb-2 transition-colors">
                            <Plus className="h-5 w-5 text-gray-500 group-hover:text-blue-600" />
                          </div>
                          <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">Add Image</span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleAddImages(e, 'gallery')}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
                  <div className="flex items-center justify-between gap-2">
                    <Button
                      variant="outline"
                      onClick={() => setActiveTab("details")}
                      className="px-4 sm:px-8 py-2 sm:py-3 h-10 sm:h-12 border-2 border-gray-300 hover:bg-gray-100 rounded-lg text-xs sm:text-sm"
                    >
                      ← Back
                    </Button>
                    <Button
                      onClick={() => mutation.mutate()}
                      disabled={!canSubmit || mutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 sm:px-10 py-2 sm:py-3 h-10 sm:h-12 font-semibold rounded-lg min-w-[160px] sm:min-w-[220px] text-xs sm:text-sm"
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
