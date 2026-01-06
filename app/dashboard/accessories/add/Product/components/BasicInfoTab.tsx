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
    <div className="space-y-4">
      {/* Category */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium text-sm">Product Category</label>
        <Select
          value={form.productCategory}
          onValueChange={(value) =>
            setForm({ ...form, productCategory: value as "1" | "2" | "3" | "4" })
          }
        >
          <SelectTrigger>
            <SelectValue placeholder="Select Category" />
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

      {/* Product Title */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium text-sm">Product Title</label>
        <Input
          placeholder="Enter product title"
          value={form.productTitle}
          onChange={(e) => setForm({ ...form, productTitle: e.target.value })}
        />
      </div>

      {/* Description */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium text-sm">Description</label>
        <Textarea
          placeholder="Enter description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />
      </div>

      {/* Model Name */}
      <div className="flex flex-col space-y-1">
        <label className="font-medium text-sm">Model Name</label>
        <Input
          placeholder="Enter model name"
          value={form.modelName}
          onChange={(e) => setForm({ ...form, modelName: e.target.value })}
        />
      </div>

      <Button
        onClick={() => mutation.mutate(form)}
        disabled={mutation.isPending}
      >
        Save & Continue
      </Button>
    </div>
  );
}
