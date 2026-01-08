/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Trash } from "lucide-react";
import { updateModelDetailsBySection } from "@/services/model.api";

/* ---------------- TYPES ---------------- */

type SpecificationItem = { points: string; _id?: string };
type KeyValueItem = { key: string; value: string; _id?: string };
type PointsItem = { points: string; _id?: string };

export interface ModelDetails {
  specifications?: SpecificationItem[];
  productSpecifications?: KeyValueItem[];
  productFeatures?: KeyValueItem[];
  warranty?: PointsItem[];
}

type SectionKey = keyof ModelDetails;

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  modelDetails: ModelDetails;
  onSuccess: () => void;
};

const MAX_ITEMS = 10;

const SECTIONS: SectionKey[] = [
  "specifications",
  "productSpecifications",
  "productFeatures",
  "warranty",
];

/* ---------------- COMPONENT ---------------- */

export default function UpdateModelDetailsDialog({
  open,
  onClose,
  productId,
  modelId,
  modelDetails,
  onSuccess,
}: Props) {
  const [activeSection, setActiveSection] =
    useState<SectionKey>("specifications");

  const [data, setData] = useState<ModelDetails>({
    specifications: [],
    productSpecifications: [],
    productFeatures: [],
    warranty: [],
  });

  /* ---------- INIT STATE ---------- */
  useEffect(() => {
    setData({
      specifications: modelDetails.specifications || [],
      productSpecifications: modelDetails.productSpecifications || [],
      productFeatures: modelDetails.productFeatures || [],
      warranty: modelDetails.warranty || [],
    });
  }, [modelDetails]);

  /* ---------- HANDLERS ---------- */

  const handleChange = (
    field: SectionKey,
    index: number,
    key: string,
    value: string
  ) => {
    const updated = [...(data[field] || [])];
    updated[index] = { ...updated[index], [key]: value };
    setData({ ...data, [field]: updated });
  };

  const handleAdd = (field: SectionKey) => {
    const updated = [...(data[field] || [])];
    if (updated.length >= MAX_ITEMS) return;

    if (field === "specifications" || field === "warranty") {
      updated.push({ points: "" });
    } else {
      updated.push({ key: "", value: "" });
    }

    setData({ ...data, [field]: updated });
  };

  const handleDelete = (field: SectionKey, index: number) => {
    const updated = [...(data[field] || [])];
    updated.splice(index, 1);
    setData({ ...data, [field]: updated });
  };

  /* ---------- SAVE (SECTION BASED) ---------- */

  const handleSave = async () => {
    try {
      const section = activeSection;
      const current = data[section] || [];
      const original = modelDetails[section] || [];

      let filtered: any[] = [];

      if (section === "specifications" || section === "warranty") {
        filtered = (current as PointsItem[]).filter(
          (i) => i.points?.trim() !== ""
        );
      } else {
        filtered = (current as KeyValueItem[]).filter(
          (i) => i.key?.trim() || i.value?.trim()
        );
      }

      const hasChanges =
        filtered.length !== original.length ||
        filtered.some((item, i) => {
          const orig = original[i] || {};
          if (section === "specifications" || section === "warranty") {
            return item.points !== (orig as PointsItem).points;
          }
          return (
            item.key !== (orig as KeyValueItem).key ||
            item.value !== (orig as KeyValueItem).value
          );
        });

      if (!hasChanges) {
        alert("No changes detected");
        return;
      }

      await updateModelDetailsBySection({
        productId,
        modelId,
        section,
        data: filtered,
      });

      alert("Updated successfully!");
      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update");
    }
  };

  /* ---------- RENDER LIST ---------- */

  const renderList = (field: SectionKey) =>
    (data[field] || []).map((item: any, index: number) => (
      <div
        key={item._id || index}
        className="flex items-center gap-2 mb-3 bg-gray-50 p-3 rounded"
      >
        {field === "specifications" || field === "warranty" ? (
          <Input
            value={item.points}
            placeholder={
              field === "warranty" ? "Warranty point" : "Specification"
            }
            onChange={(e) =>
              handleChange(field, index, "points", e.target.value)
            }
          />
        ) : (
          <>
            <Input
              value={item.key}
              placeholder="Key"
              onChange={(e) =>
                handleChange(field, index, "key", e.target.value)
              }
            />
            <Input
              value={item.value}
              placeholder="Value"
              onChange={(e) =>
                handleChange(field, index, "value", e.target.value)
              }
            />
          </>
        )}

        <Button
          variant="ghost"
          size="icon"
          onClick={() => handleDelete(field, index)}
          className="hover:bg-red-50"
        >
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    ));

  /* ---------- UI ---------- */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Specifications & Details</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update product specifications, features, and warranty information
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeSection}
          onValueChange={(v) =>
            setActiveSection(v as SectionKey)
          }
          className="mt-4"
        >
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="specifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="productSpecifications" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Product Specs
            </TabsTrigger>
            <TabsTrigger value="productFeatures" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Features
            </TabsTrigger>
            <TabsTrigger value="warranty" className="data-[state=active]:bg-blue-600 data-[state=active]:text-white">
              Warranty
            </TabsTrigger>
          </TabsList>

          {SECTIONS.map((field) => (
            <TabsContent key={field} value={field} className="mt-6 space-y-3">
              <div className="max-h-[400px] overflow-y-auto">
                {renderList(field)}
              </div>

              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={() => handleAdd(field)}
                disabled={(data[field]?.length || 0) >= MAX_ITEMS}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add New Item {(data[field]?.length || 0) >= MAX_ITEMS && "(Max limit reached)"}
              </Button>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-3 mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave} className="bg-blue-600 hover:bg-blue-700">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

