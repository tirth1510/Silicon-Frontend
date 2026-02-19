/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { addProductModelDetails } from "@/services/product.api";
import { ProductModelDetailsPayload } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2, Plus, Loader2 } from "lucide-react";
import { toast } from "sonner";

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
      toast.success("Model details saved successfully!");
      onNext();
    },
    onError: (error) => {
      toast.error("Failed to save details");
      console.error(error);
    }
  });

  /* ---------------- Helper Functions ---------------- */

  const updateArrayField = (
    field: keyof ProductModelDetailsPayload,
    index: number,
    key: string,
    value: string
  ) => {
    const arr = [...(form[field] ?? [])] as any[];
    arr[index] = { ...arr[index], [key]: value };
    setForm({ ...form, [field]: arr });
  };

  const addArrayItem = (field: keyof ProductModelDetailsPayload, isPoints = false) => {
    const arr = [...(form[field] ?? [])] as any[];
    if (isPoints) {
      arr.push({ points: "" });
    } else {
      arr.push({ key: "", value: "" });
    }
    setForm({ ...form, [field]: arr });
  };

  const removeArrayItem = (field: keyof ProductModelDetailsPayload, index: number) => {
    const arr = [...(form[field] ?? [])] as any[];
    if (arr.length > 1) { // Kam se kam ek row rehni chahiye
      arr.splice(index, 1);
      setForm({ ...form, [field]: arr });
    }
  };

  /* ---------------- Render Helpers ---------------- */

  // Point-based fields (Specifications, Warranty)
  const renderPointField = (label: string, field: keyof ProductModelDetailsPayload) => (
    <div className="space-y-3 p-4 border rounded-xl bg-slate-50/50">
      <label className="font-bold text-blue-900 uppercase text-xs tracking-wider">{label}</label>
      {(form[field] as any[] ?? []).map((item, idx) => (
        <div key={idx} className="flex gap-2">
          <Input
            placeholder={`Enter ${label.toLowerCase()}`}
            value={item.points}
            onChange={(e) => updateArrayField(field, idx, "points", e.target.value)}
            className="bg-white"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700 shrink-0"
            onClick={() => removeArrayItem(field, idx)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 text-blue-700 border-blue-200" 
        onClick={() => addArrayItem(field, true)}
      >
        <Plus size={16} className="mr-1" /> Add {label}
      </Button>
    </div>
  );

  // Key-Value based fields (Product Specs, Features)
  const renderKeyValueField = (label: string, field: keyof ProductModelDetailsPayload) => (
    <div className="space-y-3 p-4 border rounded-xl bg-slate-50/50">
      <label className="font-bold text-blue-900 uppercase text-xs tracking-wider">{label}</label>
      {(form[field] as any[] ?? []).map((item, idx) => (
        <div key={idx} className="flex gap-2 items-center">
          <Input
            placeholder="Label (e.g. Color)"
            value={item.key}
            onChange={(e) => updateArrayField(field, idx, "key", e.target.value)}
            className="bg-white flex-1"
          />
          <Input
            placeholder="Value (e.g. Blue)"
            value={item.value}
            onChange={(e) => updateArrayField(field, idx, "value", e.target.value)}
            className="bg-white flex-1"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="text-red-500 hover:text-red-700 shrink-0"
            onClick={() => removeArrayItem(field, idx)}
          >
            <Trash2 size={18} />
          </Button>
        </div>
      ))}
      <Button 
        variant="outline" 
        size="sm" 
        className="mt-2 text-blue-700 border-blue-200" 
        onClick={() => addArrayItem(field)}
      >
        <Plus size={16} className="mr-1" /> Add {label}
      </Button>
    </div>
  );

  return (
    <div className="space-y-8 max-w-4xl mx-auto p-1">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {renderPointField("Specifications", "specifications")}
        {renderPointField("Warranty Points", "warranty")}
      </div>

      {renderKeyValueField("Product Features", "productFeatures")}

      <div className="pt-6 border-t flex justify-end">
        <Button 
          size="lg"
          className="bg-blue-900 hover:bg-blue-800 px-10 rounded-xl"
          onClick={() => mutation.mutate()} 
          disabled={mutation.isPending}
        >
          {mutation.isPending ? (
            <><Loader2 className="mr-2 animate-spin" size={18} /> Saving...</>
          ) : (
            "Save & Continue"
          )}
        </Button>
      </div>
    </div>
  );
}