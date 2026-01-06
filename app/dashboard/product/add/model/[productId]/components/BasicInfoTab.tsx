/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { addProductModelService } from "@/services/product.api";

interface Props {
  productId: string;
  onSuccess: (modelId: string) => void;
}

export default function AddModelStep({ productId, onSuccess }: Props) {
  const [modelName, setModelName] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAddModel = async () => {
    if (!modelName.trim()) {
      alert("Model name is required");
      return;
    }

    try {
      setLoading(true);

      const res = await addProductModelService(productId, {
        modelName: modelName.trim(),
      });

      onSuccess(res.data._id); // modelId
    } catch (err: any) {
      alert(err.message || "Failed to add model");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Add New Model</h2>

      <div className="space-y-1">
        <label className="text-sm font-medium">Model Name</label>
        <Input
          placeholder="Enter model name"
          value={modelName}
          onChange={(e) => setModelName(e.target.value)}
        />
      </div>

      <Button onClick={handleAddModel} disabled={loading}>
        {loading ? "Saving..." : "Save & Continue"}
      </Button>
    </div>
  );
}
