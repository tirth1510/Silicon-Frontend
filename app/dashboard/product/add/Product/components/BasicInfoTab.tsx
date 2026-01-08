/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { createProductStep1 } from "@/services/product.api";
import { CreateProductStep1Payload } from "@/types/product";
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

interface Props {
  onSuccess: (productId: string, modelId: string) => void;
}

// Dropdown categories
const categories = [
  { value: "1", label: "Category 1" },
  { value: "2", label: "Category 2" },
  { value: "3", label: "Category 3" },
  { value: "4", label: "Category 4" },
];

export default function Step1BasicInfo({ onSuccess }: Props) {
  const [form, setForm] = useState<CreateProductStep1Payload>({
    productCategory: "1",
    productTitle: "",
    description: "",
    modelName: "",
  });

  const mutation = useMutation({
    mutationFn: createProductStep1,
    onSuccess: (res : any) => {
      const productId = res.data._id;
      const modelId = res.data.productModels[0]._id;
      onSuccess(productId, modelId);
    },
  });

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto pr-2">
        <div className="space-y-6 pb-24">
          {/* Category and Product Title - Equal Width Layout */}
          <div className="grid grid-cols-2 gap-6">
            {/* Category */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Product Category <span className="text-red-500">*</span>
              </label>
              <Select
                value={form.productCategory}
                onValueChange={(value) =>
                  setForm({ ...form, productCategory: value as "1" | "2" | "3" | "4" })
                }
              >
                <SelectTrigger className="w-full !h-12 px-4 py-0 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium">
                  <SelectValue placeholder="Select Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem 
                      key={cat.value} 
                      value={cat.value}
                      className="cursor-pointer hover:bg-blue-50"
                    >
                      {cat.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Product Title */}
            <div className="space-y-3">
              <label className="block text-sm font-semibold text-gray-700">
                Product Title <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="e.g., Patient Monitor X-500"
                value={form.productTitle}
                onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
                className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Model Name - Full Width */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Model Name <span className="text-red-500">*</span>
            </label>
            <Input
              placeholder="e.g., X-500 Pro"
              value={form.modelName}
              onChange={(e) => setForm({ ...form, modelName: e.target.value })}
              className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
            />
          </div>

          {/* Description - At Bottom */}
          <div className="space-y-3">
            <label className="block text-sm font-semibold text-gray-700">
              Description <span className="text-red-500">*</span>
            </label>
            <Textarea
              placeholder="Enter a detailed description of your product..."
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full min-h-[140px] px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
            />
            <p className="text-xs text-gray-500 mt-1">
              Provide key features and benefits ({form.description.length} characters)
            </p>
          </div>
        </div>
      </div>

      {/* Action Buttons - Fixed at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-white border-t-2 border-gray-200 px-10 py-4">
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-600">
            All fields marked with <span className="text-red-500 font-semibold">*</span> are required
          </p>
          <Button
            onClick={() => mutation.mutate(form)}
            disabled={mutation.isPending || !form.productTitle || !form.description || !form.modelName}
            className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg hover:shadow-xl transition-all duration-300 px-10 py-3 h-12 font-semibold rounded-lg disabled:opacity-50 disabled:cursor-not-allowed min-w-[200px]"
          >
            {mutation.isPending ? (
              <>
                <span className="animate-spin mr-2">⏳</span>
                Saving...
              </>
            ) : (
              <>
                Save & Continue
                <span className="ml-2">→</span>
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
