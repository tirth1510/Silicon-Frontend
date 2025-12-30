"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addProductModelDetails } from "@/services/product.api";
import { ProductModelDetailsPayload } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  productId: string;
  modelId: string;
  onNext: () => void;
}

export default function Step2ModelDetails({ productId, modelId, onNext }: Props) {
  const [form, setForm] = useState<ProductModelDetailsPayload>({
    specifications: [{ points: "" }],
    productSpecifications: [{ key: "", value: "" }],
    productFeatures: [{ key: "", value: "" }],
    warranty: [{ points: "" }],
  });

  const mutation = useMutation({
    mutationFn: () => addProductModelDetails(productId, modelId, form),
    onSuccess: () => {
      onNext();
    },
  });

  /* ---------------- Helper Functions ---------------- */

  const updateArrayField = (
    field: keyof ProductModelDetailsPayload,
    index: number,
    key: string,
    value: string
  ) => {
    const arr = [...(form[field] ?? [])]; // Ensure array exists
    arr[index] = { ...(arr[index] ?? {}), [key]: value }; // Ensure object exists
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field: keyof ProductModelDetailsPayload, isPoints = false) => {
    const arr = [...(form[field] ?? [])];
    if (isPoints) {
      arr.push({ points: "" });
    } else {
      arr.push({ key: "", value: "" });
    }
    setForm({ ...form, [field]: arr });
  };

  /* ---------------- Render ---------------- */

  return (
    <div className="space-y-6">
      {/* Specifications */}
      <div>
        <label className="font-medium text-sm">Specifications</label>
        {(form.specifications ?? []).map((item, idx) => (
          <Input
            key={idx}
            placeholder="Enter specification"
            value={item.points}
            onChange={(e) => updateArrayField("specifications", idx, "points", e.target.value)}
            className="mb-2"
          />
        ))}
        <Button size="sm" onClick={() => addArrayItem("specifications", true)}>
          + Add Specification
        </Button>
      </div>

      {/* Product Specifications */}
      <div>
        <label className="font-medium text-sm">Product Specifications</label>
        {(form.productSpecifications ?? []).map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              placeholder="Key"
              value={item.key}
              onChange={(e) => updateArrayField("productSpecifications", idx, "key", e.target.value)}
            />
            <Input
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateArrayField("productSpecifications", idx, "value", e.target.value)}
            />
          </div>
        ))}
        <Button size="sm" onClick={() => addArrayItem("productSpecifications")}>
          + Add Product Specification
        </Button>
      </div>

      {/* Product Features */}
      <div>
        <label className="font-medium text-sm">Product Features</label>
        {(form.productFeatures ?? []).map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              placeholder="Key"
              value={item.key}
              onChange={(e) => updateArrayField("productFeatures", idx, "key", e.target.value)}
            />
            <Input
              placeholder="Value"
              value={item.value}
              onChange={(e) => updateArrayField("productFeatures", idx, "value", e.target.value)}
            />
          </div>
        ))}
        <Button size="sm" onClick={() => addArrayItem("productFeatures")}>
          + Add Feature
        </Button>
      </div>

      {/* Warranty */}
      <div>
        <label className="font-medium text-sm">Warranty</label>
        {(form.warranty ?? []).map((item, idx) => (
          <Input
            key={idx}
            placeholder="Enter warranty point"
            value={item.points}
            onChange={(e) => updateArrayField("warranty", idx, "points", e.target.value)}
            className="mb-2"
          />
        ))}
        <Button size="sm" onClick={() => addArrayItem("warranty", true)}>
          + Add Warranty Point
        </Button>
      </div>

      {/* Submit */}
      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Save & Continue
      </Button>
    </div>
  );
}
