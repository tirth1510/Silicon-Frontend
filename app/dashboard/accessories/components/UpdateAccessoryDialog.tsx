/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
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
import { updateProductService, CreateProductPayload } from "@/services/accessory.service";
import { Product } from "@/types/accessory";

interface UpdateAccessoryDialogProps {
  open: boolean;
  onClose: () => void;
  accessory: Product;
  accessories: Product[];
  onSuccess: () => void;
}

export default function UpdateAccessoryDialog({ open, onClose, accessory, accessories, onSuccess }: UpdateAccessoryDialogProps) {
  const [form, setForm] = useState<CreateProductPayload>({
    productCategory: "",
    productTitle: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    specifications: "",
    warranty: "",
  });

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
    console.log("📋 Available categories:", categories);
    return categories;
  }, [accessories]);

  // Populate form when accessory data loads
  useEffect(() => {
    if (accessory) {
      console.log("🔄 Loading accessory category:", accessory.productCategory);
      
      // If product has invalid "SPO2" category, set to empty to force user to select valid one
      const categoryValue = accessory.productCategory === "SPO2" ? "" : accessory.productCategory || "";
      
      setForm({
        productCategory: categoryValue,
        productTitle: accessory.productTitle || "",
        description: accessory.description || "",
        price: accessory.priceDetails?.price || 0,
        discount: accessory.priceDetails?.discount || 0,
        stock: accessory.stock || 0,
        specifications: accessory.specifications?.map((s: any) => s.points).join("\n") || "",
        warranty: accessory.warranty?.map((w: any) => w.points).join("\n") || "",
      });
    }
  }, [accessory]);

  const mutation = useMutation({
    mutationFn: async () => {
      // Prepare payload - send price and discount as separate fields, not as priceDetails object
      const payload: any = {
        productCategory: form.productCategory,
        productTitle: form.productTitle,
        description: form.description,
        price: form.price,
        discount: form.discount || 0,
        stock: form.stock,
      };

      console.log("📤 Sending productCategory:", form.productCategory);
      console.log("📦 Full payload:", payload);

      // Convert specifications string to JSON array format
      if (form.specifications) {
        const specsArray = form.specifications
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => ({ points: line.trim() }));
        payload.specifications = JSON.stringify(specsArray);
      }

      // Convert warranty string to JSON array format
      if (form.warranty) {
        const warrantyArray = form.warranty
          .split("\n")
          .filter((line) => line.trim())
          .map((line) => ({ points: line.trim() }));
        payload.warranty = JSON.stringify(warrantyArray);
      }

      return updateProductService(accessory.id || accessory._id, payload);
    },
    onSuccess: () => {
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      console.error("Failed to update accessory:", error);
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Accessory</DialogTitle>
          <DialogDescription>
            Update the accessory information
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-5 py-4">
          {/* Category and Title */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Product Category</Label>
              <Select
                value={form.productCategory}
                onValueChange={(value) => setForm({ ...form, productCategory: value })}
              >
                <SelectTrigger className="w-full !h-12 px-4 py-0 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium">
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

            <div className="space-y-2">
              <Label className="font-semibold">Product Title</Label>
              <Input
                value={form.productTitle}
                onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
                className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Price, Discount, Stock */}
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label className="font-semibold">Price (₹)</Label>
              <Input
                type="number"
                value={form.price || ""}
                onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
                className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Discount (%)</Label>
              <Input
                type="number"
                value={form.discount || ""}
                onChange={(e) => setForm({ ...form, discount: parseFloat(e.target.value) || 0 })}
                className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
              />
            </div>

            <div className="space-y-2">
              <Label className="font-semibold">Stock</Label>
              <Input
                type="number"
                value={form.stock || ""}
                onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
                className="w-full h-12 px-4 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 font-medium placeholder:text-gray-400"
              />
            </div>
          </div>

          {/* Description */}
          <div className="space-y-2">
            <Label className="font-semibold">Description</Label>
            <Textarea
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              className="w-full min-h-[100px] px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Specifications */}
          <div className="space-y-2">
            <Label className="font-semibold">Specifications</Label>
            <Textarea
              value={form.specifications}
              onChange={(e) => setForm({ ...form, specifications: e.target.value })}
              placeholder="One per line..."
              className="w-full min-h-[80px] px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          {/* Warranty */}
          <div className="space-y-2">
            <Label className="font-semibold">Warranty</Label>
            <Textarea
              value={form.warranty}
              onChange={(e) => setForm({ ...form, warranty: e.target.value })}
              placeholder="Warranty information..."
              className="w-full min-h-[80px] px-4 py-3 bg-white border-2 border-gray-300 rounded-lg hover:border-blue-500 focus:border-blue-600 focus:ring-2 focus:ring-blue-100 transition-all duration-200 text-gray-900 placeholder:text-gray-400 resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate()}
              disabled={mutation.isPending}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
            >
              {mutation.isPending ? "Updating..." : "Update Accessory"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

