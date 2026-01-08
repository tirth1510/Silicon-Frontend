/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react";
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
  onSuccess: () => void;
}

const categories = [
  { value: "1", label: "Category 1" },
  { value: "2", label: "Category 2" },
  { value: "3", label: "Category 3" },
  { value: "4", label: "Category 4" },
];

export default function UpdateAccessoryDialog({ open, onClose, accessory, onSuccess }: UpdateAccessoryDialogProps) {
  const [form, setForm] = useState<CreateProductPayload>({
    productCategory: "1",
    productTitle: "",
    description: "",
    price: 0,
    discount: 0,
    stock: 0,
    specifications: "",
    warranty: "",
  });

  useEffect(() => {
    if (accessory) {
      setForm({
        productCategory: accessory.productCategory || "1",
        productTitle: accessory.productTitle || "",
        description: accessory.description || "",
        price: accessory.priceDetails?.price || 0,
        discount: accessory.priceDetails?.discount || 0,
        stock: accessory.stock || 0,
        specifications: accessory.specifications?.map(s => s.points).join("\n") || "",
        warranty: accessory.warranty?.map(w => w.points).join("\n") || "",
      });
    }
  }, [accessory]);

  const mutation = useMutation({
    mutationFn: async () => {
      return updateProductService(accessory.id || accessory._id, form);
    },
    onSuccess: () => {
      alert("Accessory updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      alert(error.message || "Failed to update accessory");
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
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat.value} value={cat.value}>
                      {cat.label}
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

