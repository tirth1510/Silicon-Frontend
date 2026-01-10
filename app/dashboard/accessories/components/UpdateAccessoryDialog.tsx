/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-img-element */
/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  Check,
  Package,
  FileText,
  Palette,
  Plus,
  Trash2,
  RefreshCw,
} from "lucide-react";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { useMutation } from "@tanstack/react-query";
import {
  updateAccessoriesDetailsService,
  UpdateAccessoriesPayload,
  UpdateAccessoriesFiles,
} from "@/services/accessory.service";
import { Product } from "@/types/accessory";
import { toast } from "sonner";

interface UpdateAccessoryDialogProps {
  open: boolean;
  onClose: () => void;
  accessory: Product;
  accessories: Product[];
  onSuccess: () => void;
}

export default function UpdateAccessoryDialog({
  open,
  onClose,
  accessory,
  accessories,
  onSuccess,
}: UpdateAccessoryDialogProps) {
  const [activeTab, setActiveTab] = useState<string>("basic");
  
  // Local state to track the accessory as we modify it (e.g. deleting images immediately)
  const [localAccessory, setLocalAccessory] = useState<Product>(accessory);

  const [form, setForm] = useState<any>({
    productCategory: "",
    productTitle: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
  });

  // Dynamic Lists State
  const [specsList, setSpecsList] = useState<string[]>([""]);
  const [warrantyList, setWarrantyList] = useState<string[]>([""]);
  const [productSpecsList, setProductSpecsList] = useState<
    { key: string; value: string }[]
  >([{ key: "", value: "" }]);

  // Images State (For NEW images only)
  const [newProductImages, setNewProductImages] = useState<File[]>([]);
  const [newGalleryImages, setNewGalleryImages] = useState<File[]>([]);

  // Refs for file replacement
  const replaceProductImageRef = useRef<HTMLInputElement>(null);
  const replaceGalleryImageRef = useRef<HTMLInputElement>(null);
  const [replaceIndex, setReplaceIndex] = useState<number | null>(null);

  // Extract unique categories
  const uniqueCategories = useMemo(() => {
    const categories = accessories
      .map((acc) => acc.productCategory)
      .filter(
        (cat, index, self) =>
          cat && cat !== "SPO2" && self.indexOf(cat) === index
      )
      .sort();
    return categories;
  }, [accessories]);

  // Initialize state when accessory changes
  useEffect(() => {
    if (accessory) {
      setLocalAccessory(accessory);
    }
  }, [accessory]);

  // Sync form and lists with localAccessory
  useEffect(() => {
    if (localAccessory) {
      setForm({
        productCategory:
          localAccessory.productCategory === "SPO2"
            ? ""
            : localAccessory.productCategory || "",
        productTitle: localAccessory.productTitle || "",
        description: localAccessory.description || "",
        price: (localAccessory as any).priceDetails?.price ?? localAccessory.price ?? 0,
        discount:
          (localAccessory as any).priceDetails?.discount ?? localAccessory.discount ?? 0,
        stock: localAccessory.stock || 0,
      });

      // Populate Lists
      if (localAccessory.specifications && Array.isArray(localAccessory.specifications)) {
        setSpecsList(
          localAccessory.specifications.map((s: any) => s.points || s).length
            ? localAccessory.specifications.map((s: any) => s.points || s)
            : [""]
        );
      } else {
        setSpecsList([""]);
      }

      if (localAccessory.warranty && Array.isArray(localAccessory.warranty)) {
        setWarrantyList(
          localAccessory.warranty.map((w: any) => w.points || w).length
            ? localAccessory.warranty.map((w: any) => w.points || w)
            : [""]
        );
      } else {
        setWarrantyList([""]);
      }

      if (
        localAccessory.productSpecifications &&
        Array.isArray(localAccessory.productSpecifications)
      ) {
        setProductSpecsList(
          localAccessory.productSpecifications.length
            ? localAccessory.productSpecifications.map((item) => ({
                key: item.key || "",
                value: item.value || "",
              }))
            : [{ key: "", value: "" }]
        );
      } else {
        setProductSpecsList([{ key: "", value: "" }]);
      }
    }
  }, [localAccessory]);

  const getImageUrl = (img: any) => {
    if (typeof img === 'string') return img;
    return img?.url || '';
  };

  // Generic mutation for updates (used for both immediate actions and final save)
  const updateMutation = useMutation({
    mutationFn: async ({
      payload,
      files,
    }: {
      payload: UpdateAccessoriesPayload;
      files?: UpdateAccessoriesFiles;
    }) => {
      return updateAccessoriesDetailsService(
        localAccessory.id || localAccessory._id,
        payload,
        files
      );
    },
    onSuccess: (updatedProduct) => {
      setLocalAccessory(updatedProduct);
      toast.success("Accessory updated successfully");
      onSuccess(); // Refresh parent list
    },
    onError: (error: any) => {
      console.error("Failed to update accessory:", error);
      toast.error(error.message || "Failed to update accessory");
    },
  });

  // --- Handlers for Immediate Actions ---

  const handleDeleteExistingImage = (index: number, type: "product" | "gallery") => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    
    const payload: UpdateAccessoriesPayload = type === "product" 
      ? { deleteImageIndex: index } 
      : { deleteGalleryIndex: index };
      
    updateMutation.mutate({ payload });
  };

  const handleReplaceExistingImage = (e: React.ChangeEvent<HTMLInputElement>, type: "product" | "gallery") => {
    if (e.target.files && e.target.files[0] && replaceIndex !== null) {
      const file = e.target.files[0];
      const payload: UpdateAccessoriesPayload = type === "product"
        ? { replaceImageIndex: replaceIndex }
        : { replaceGalleryIndex: replaceIndex };
      
      const files: UpdateAccessoriesFiles = type === "product"
        ? { productImageUrl: [file] }
        : { productGallery: [file] };

      updateMutation.mutate({ payload, files });
    }
    // Reset
    setReplaceIndex(null);
    e.target.value = "";
  };

  const handleDeleteExistingSpec = (index: number, type: "spec" | "warranty" | "productSpec") => {
    if (!confirm("Are you sure you want to delete this item?")) return;

    let payload: UpdateAccessoriesPayload = {};
    if (type === "spec") payload = { deleteSpecificationIndex: index };
    else if (type === "warranty") payload = { deleteWarrantyIndex: index };
    else if (type === "productSpec") payload = { deleteIndex: index }; // Assuming deleteIndex is for productSpecifications based on API structure

    updateMutation.mutate({ payload });
  };

  // --- Handlers for Local State (New Items) ---

  const handleAddNewImages = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "product" | "gallery"
  ) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      if (type === "product") {
        setNewProductImages((prev) => [...prev, ...newFiles]);
      } else {
        setNewGalleryImages((prev) => [...prev, ...newFiles]);
      }
    }
    e.target.value = "";
  };

  const handleRemoveNewImage = (index: number, type: "product" | "gallery") => {
    if (type === "product") {
      setNewProductImages((prev) => prev.filter((_, i) => i !== index));
    } else {
      setNewGalleryImages((prev) => prev.filter((_, i) => i !== index));
    }
  };

  // --- Main Save Handler ---

  const handleSave = () => {
    const payload: UpdateAccessoriesPayload = {
      productCategory: form.productCategory,
      productTitle: form.productTitle,
      description: form.description,
      stock: form.stock,
      priceDetails: {
        price: form.price,
        discount: form.discount || 0,
      },
    };

    // 1. Specifications Logic
    const originalSpecsCount = localAccessory.specifications?.length || 0;
    const specsToUpdate: any[] = [];
    const specIndexesToUpdate: number[] = [];
    const specsToAdd: any[] = [];

    specsList.forEach((spec, index) => {
      if (!spec.trim()) return;
      const val = { points: spec.trim() };
      
      if (index < originalSpecsCount) {
        // Check if changed
        const originalVal = localAccessory.specifications?.[index]?.points || localAccessory.specifications?.[index];
        if (originalVal !== spec.trim()) {
          specsToUpdate.push(val);
          specIndexesToUpdate.push(index);
        }
      } else {
        // New item
        specsToAdd.push(val);
      }
    });

    if (specsToUpdate.length > 0 || specsToAdd.length > 0) {
      // Combine updates and adds. 
      // Assumption: API handles [update1, update2, add1] with indexes [idx1, idx2] correctly (updates first 2, appends rest)
      payload.specifications = [...specsToUpdate, ...specsToAdd];
      if (specIndexesToUpdate.length > 0) {
        payload.specificationIndexes = specIndexesToUpdate;
      }
    }

    // 2. Warranty Logic
    const originalWarrantyCount = localAccessory.warranty?.length || 0;
    const warrantyToUpdate: any[] = [];
    const warrantyIndexesToUpdate: number[] = [];
    const warrantyToAdd: any[] = [];

    warrantyList.forEach((w, index) => {
      if (!w.trim()) return;
      const val = { points: w.trim() };

      if (index < originalWarrantyCount) {
        const originalVal = localAccessory.warranty?.[index]?.points || localAccessory.warranty?.[index];
        if (originalVal !== w.trim()) {
          warrantyToUpdate.push(val);
          warrantyIndexesToUpdate.push(index);
        }
      } else {
        warrantyToAdd.push(val);
      }
    });

    if (warrantyToUpdate.length > 0 || warrantyToAdd.length > 0) {
      payload.warranty = [...warrantyToUpdate, ...warrantyToAdd];
      if (warrantyIndexesToUpdate.length > 0) {
        payload.warrantyIndexes = warrantyIndexesToUpdate;
      }
    }

    // 3. Product Specifications Logic
    const originalProdSpecsCount = localAccessory.productSpecifications?.length || 0;
    const prodSpecsToUpdate: any[] = [];
    const prodSpecIndexesToUpdate: number[] = [];
    const prodSpecsToAdd: any[] = [];

    productSpecsList.forEach((item, index) => {
      if (!item.key.trim() && !item.value.trim()) return;
      
      if (index < originalProdSpecsCount) {
        const original = localAccessory.productSpecifications?.[index] || { key: '', value: '' };
        if (original.key !== item.key || original.value !== item.value) {
          prodSpecsToUpdate.push(item);
          prodSpecIndexesToUpdate.push(index);
        }
      } else {
        prodSpecsToAdd.push(item);
      }
    });

    if (prodSpecsToUpdate.length > 0 || prodSpecsToAdd.length > 0) {
      payload.productSpecifications = [...prodSpecsToUpdate, ...prodSpecsToAdd];
      if (prodSpecIndexesToUpdate.length > 0) {
        payload.specIndexes = prodSpecIndexesToUpdate;
      }
    }

    // 4. Files
    const files: UpdateAccessoriesFiles = {
      productImageUrl: newProductImages.length > 0 ? newProductImages : undefined,
      productGallery: newGalleryImages.length > 0 ? newGalleryImages : undefined,
    };

    updateMutation.mutate({ payload, files }, {
      onSuccess: () => onClose() // Close dialog only on full save
    });
  };

  const steps = [
    { value: "basic", label: "Basic Info", icon: Package },
    { value: "details", label: "Details & Specs", icon: FileText },
    { value: "images", label: "Images", icon: Palette },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-3xl lg:max-w-4xl xl:max-w-5xl h-[90vh] overflow-hidden p-0 gap-0 flex flex-col">
        <VisuallyHidden>
          <DialogTitle>Edit Accessory</DialogTitle>
        </VisuallyHidden>

        {/* Header */}
        <div className="px-4 sm:px-6 lg:px-10 py-4 sm:py-6 border-b bg-gradient-to-r from-blue-50 to-indigo-50 shrink-0">
          <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
            Edit Accessory
          </h2>
          <p className="text-xs sm:text-sm text-gray-600 mt-2">
            Update the accessory information
          </p>
        </div>

        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* Step Indicator */}
          <div className="px-4 sm:px-6 lg:px-10 pt-4 sm:pt-6 pb-3 sm:pb-4 bg-gray-50/50 shrink-0">
            <div className="flex items-center justify-between relative">
              <div className="absolute top-6 left-0 right-0 h-1 bg-gray-200 -z-10">
                <div
                  className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                  style={{
                    width: `${
                      ((steps.findIndex((s) => s.value === activeTab) + 1) /
                        steps.length) *
                      100
                    }%`,
                  }}
                />
              </div>

              {steps.map((step, index) => {
                const Icon = step.icon;
                const isActive = activeTab === step.value;
                const isPast =
                  steps.findIndex((s) => s.value === activeTab) > index;

                return (
                  <button
                    key={step.value}
                    onClick={() => setActiveTab(step.value)}
                    className={`flex flex-col items-center gap-1 sm:gap-2 flex-1 relative group cursor-pointer`}
                  >
                    <div
                      className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center transition-all duration-300 ${
                        isActive
                          ? "bg-gradient-to-br from-blue-500 to-indigo-600 shadow-lg shadow-blue-500/50 scale-110"
                          : isPast
                          ? "bg-green-500 shadow-md"
                          : "bg-white border-2 border-gray-300 group-hover:border-blue-400"
                      }`}
                    >
                      {isPast ? (
                        <Check className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-white" />
                      ) : (
                        <Icon
                          className={`w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 ${
                            isActive
                              ? "text-white"
                              : "text-gray-400 group-hover:text-blue-500"
                          }`}
                        />
                      )}
                    </div>

                    <div className="text-center">
                      <div
                        className={`text-[10px] sm:text-xs font-semibold ${
                          isActive
                            ? "text-blue-600"
                            : isPast
                            ? "text-green-600"
                            : "text-gray-500"
                        }`}
                      >
                        Step {index + 1}
                      </div>
                      <div
                        className={`text-[10px] sm:text-xs lg:text-sm font-medium mt-0.5 sm:mt-1 ${
                          isActive ? "text-gray-900" : "text-gray-600"
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Product Category
                        </Label>
                        <Select
                          value={form.productCategory}
                          onValueChange={(value) =>
                            setForm({ ...form, productCategory: value })
                          }
                        >
                          <SelectTrigger className="w-full !h-10 sm:!h-12 px-3 sm:px-4 py-0 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium text-xs sm:text-sm">
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {uniqueCategories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Product Title
                        </Label>
                        <Input
                          value={form.productTitle}
                          onChange={(e) =>
                            setForm({ ...form, productTitle: e.target.value })
                          }
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Price (₹)
                        </Label>
                        <Input
                          type="number"
                          value={form.price || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              price: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Discount (%)
                        </Label>
                        <Input
                          type="number"
                          value={form.discount || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              discount: parseFloat(e.target.value) || 0,
                            })
                          }
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>

                      <div className="space-y-2 sm:space-y-3">
                        <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                          Stock
                        </Label>
                        <Input
                          type="number"
                          value={form.stock || ""}
                          onChange={(e) =>
                            setForm({
                              ...form,
                              stock: parseInt(e.target.value) || 0,
                            })
                          }
                          className="w-full h-10 sm:h-12 px-3 sm:px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400 text-xs sm:text-sm"
                        />
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Description
                      </Label>
                      <Textarea
                        value={form.description}
                        onChange={(e) =>
                          setForm({ ...form, description: e.target.value })
                        }
                        className="w-full min-h-[100px] sm:min-h-[140px] px-3 sm:px-4 py-2 sm:py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none text-xs sm:text-sm"
                      />
                    </div>
                  </div>
                </div>

                <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-4 sm:px-6 lg:px-10 py-3 sm:py-4">
                  <div className="flex justify-end">
                    <Button
                      onClick={() => setActiveTab("details")}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 sm:px-10 py-2 sm:py-3 h-10 sm:h-12 font-semibold rounded-lg min-w-[160px] sm:min-w-[200px] text-xs sm:text-sm"
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
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Product Specifications (Key-Value)
                      </Label>
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
                                // If it's an existing item, delete via API immediately
                                if (index < (localAccessory.productSpecifications?.length || 0)) {
                                  handleDeleteExistingSpec(index, "productSpec");
                                } else {
                                  // Local delete for new items
                                  const newList = productSpecsList.filter((_, i) => i !== index);
                                  setProductSpecsList(newList.length ? newList : [{ key: "", value: "" }]);
                                }
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
                          onClick={() =>
                            setProductSpecsList([
                              ...productSpecsList,
                              { key: "", value: "" },
                            ])
                          }
                          className="w-full border-2 border-dashed border-gray-300 hover:border-blue-500 hover:bg-blue-50 text-gray-600 hover:text-blue-600 h-10"
                        >
                          <Plus className="h-4 w-4 mr-2" /> Add Key-Value Pair
                        </Button>
                      </div>
                    </div>

                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Specifications
                      </Label>
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
                                if (index < (localAccessory.specifications?.length || 0)) {
                                  handleDeleteExistingSpec(index, "spec");
                                } else {
                                  const newSpecs = specsList.filter((_, i) => i !== index);
                                  setSpecsList(newSpecs.length ? newSpecs : [""]);
                                }
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
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Warranty Information
                      </Label>
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
                                if (index < (localAccessory.warranty?.length || 0)) {
                                  handleDeleteExistingSpec(index, "warranty");
                                } else {
                                  const newWarranty = warrantyList.filter((_, i) => i !== index);
                                  setWarrantyList(newWarranty.length ? newWarranty : [""]);
                                }
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
                ref={replaceProductImageRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleReplaceExistingImage(e, "product")}
              />
              <input
                type="file"
                ref={replaceGalleryImageRef}
                className="hidden"
                accept="image/*"
                onChange={(e) => handleReplaceExistingImage(e, "gallery")}
              />
              <div className="flex flex-col h-full">
                <div className="flex-1 overflow-y-auto pr-2">
                  <div className="space-y-4 sm:space-y-6 pb-24">
                    {/* Existing Product Images */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Existing Product Images
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {localAccessory.productImages?.map(
                          (img: any, index: number) => (
                            <div
                              key={index}
                              className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                            >
                              <img
                                src={localAccessory.productImages && localAccessory.productImages[index] ? getImageUrl(localAccessory.productImages[index]) : ''}
                                alt={`Existing ${index}`}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button
                                  type="button"
                                  variant="secondary"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => {
                                    setReplaceIndex(index);
                                    replaceProductImageRef.current?.click();
                                  }}
                                >
                                  <RefreshCw className="h-4 w-4" />
                                </Button>
                                <Button
                                  type="button"
                                  variant="destructive"
                                  size="icon"
                                  className="h-8 w-8 rounded-full"
                                  onClick={() => handleDeleteExistingImage(index, "product")}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    {/* New Product Images */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Add New Product Images
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {newProductImages.map((file, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() =>
                                  handleRemoveNewImage(index, "product")
                                }
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
                          <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
                            Add Image
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleAddNewImages(e, "product")}
                          />
                        </label>
                      </div>
                    </div>

                    {/* Existing Gallery Images */}
                    {localAccessory.galleryImages &&
                      localAccessory.galleryImages.length > 0 && (
                        <div className="space-y-2 sm:space-y-3">
                          <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                            Existing Gallery Images
                          </Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {localAccessory.galleryImages?.map(
                              (img: any, index: number) => (
                                <div
                                  key={index}
                                  className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                                >
                                  <img
                                    src={localAccessory.galleryImages && localAccessory.galleryImages[index] ? getImageUrl(localAccessory.galleryImages[index]) : ''}
                                    alt={`Existing Gallery ${index}`}
                                    className="w-full h-full object-cover"
                                  />
                                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                    <Button
                                      type="button"
                                      variant="secondary"
                                      size="icon"
                                      className="h-8 w-8 rounded-full"
                                      onClick={() => {
                                        setReplaceIndex(index);
                                        replaceGalleryImageRef.current?.click();
                                      }}
                                    >
                                      <RefreshCw className="h-4 w-4" />
                                    </Button>
                                    <Button
                                      type="button"
                                      variant="destructive"
                                      size="icon"
                                      className="h-8 w-8 rounded-full"
                                      onClick={() => handleDeleteExistingImage(index, "gallery")}
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </div>
                                </div>
                              )
                            )}
                          </div>
                        </div>
                      )}

                    {/* New Gallery Images */}
                    <div className="space-y-2 sm:space-y-3">
                      <Label className="block text-xs sm:text-sm font-semibold text-gray-700">
                        Add New Gallery Images
                      </Label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                        {newGalleryImages.map((file, index) => (
                          <div
                            key={index}
                            className="relative group aspect-square rounded-lg overflow-hidden border border-gray-200 bg-gray-50"
                          >
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`New Gallery Preview ${index}`}
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                              <Button
                                type="button"
                                variant="destructive"
                                size="icon"
                                className="h-8 w-8 rounded-full"
                                onClick={() =>
                                  handleRemoveNewImage(index, "gallery")
                                }
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
                          <span className="text-xs font-medium text-gray-600 group-hover:text-blue-600">
                            Add Image
                          </span>
                          <input
                            type="file"
                            className="hidden"
                            multiple
                            accept="image/*"
                            onChange={(e) => handleAddNewImages(e, "gallery")}
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
                      onClick={handleSave}
                      disabled={updateMutation.isPending}
                      className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 px-6 sm:px-10 py-2 sm:py-3 h-10 sm:h-12 font-semibold rounded-lg min-w-[160px] sm:min-w-[220px] text-xs sm:text-sm"
                    >
                      {updateMutation.isPending ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Updating...
                        </>
                      ) : (
                        <>
                          Update Accessory <span className="ml-2">✓</span>
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
