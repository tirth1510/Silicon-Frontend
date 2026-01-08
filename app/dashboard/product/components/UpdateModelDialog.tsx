/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { updateModelService } from "@/services/model.api";

interface UpdateModelDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  defaultValues: {
    modelName: string;
    status: string;
  };
  onSuccess: () => void;
}

export default function UpdateModelDialog({
  open,
  onClose,
  productId,
  modelId,
  defaultValues,
  onSuccess,
}: UpdateModelDialogProps) {
  const [form, setForm] = useState(defaultValues);

  const mutation = useMutation({
    mutationFn: async (data: any) => updateModelService(productId, modelId, data),
    onSuccess: () => {
      alert("Model updated successfully!");
      onSuccess();
      onClose();
    },
    onError: (error: any) => {
      alert(error.message || "Failed to update model");
    },
  });

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Model</DialogTitle>
          <DialogDescription>
            Update the model name and status
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Model Name</label>
            <Input
              placeholder="Enter model name"
              value={form.modelName}
              onChange={(e) => setForm({ ...form, modelName: e.target.value })}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <Select
              value={form.status}
              onValueChange={(value) => setForm({ ...form, status: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Padding">Padding</SelectItem>
                <SelectItem value="Live">Live</SelectItem>
                <SelectItem value="Enquiry">Enquiry</SelectItem>
              </SelectContent>
            </Select>
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
              {mutation.isPending ? "Updating..." : "Update Model"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

