/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateProductService } from "@/services/product.api";

const categories = [
  { value: "1", label: "Category 1" },
  { value: "2", label: "Category 2" },
  { value: "3", label: "Category 3" },
  { value: "7", label: "Category 4" },
];

interface UpdateProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  defaultValues: {
    productTitle: string;
    productCategory: string;
    description: string;
  };
  onSuccess: () => void;
}

export default function UpdateProductDialog({
  open,
  onClose,
  productId,
  defaultValues,
  onSuccess,
}: UpdateProductDialogProps) {
  const [form, setForm] = useState(defaultValues);

  const mutation = useMutation({
    mutationFn: async (data: any) => updateProductService(productId, data),
    onSuccess: () => {
      alert("Product updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      alert(error.message || "Failed to update product");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Edit Product Information</DialogTitle>
          <DialogDescription>
            Update the basic information for this product
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Product Category</label>
            <Select
              value={form.productCategory}
              onValueChange={(value) => setForm({ ...form, productCategory: value })}
            >
              <SelectTrigger>
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
            <label className="text-sm font-medium">Product Title</label>
            <Input
              placeholder="Enter product title"
              value={form.productTitle}
              onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Description</label>
            <Textarea
              placeholder="Enter description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={5}
            />
          </div>

          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={() => mutation.mutate(form)}
              disabled={mutation.isPending}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {mutation.isPending ? "Updating..." : "Update Product"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

