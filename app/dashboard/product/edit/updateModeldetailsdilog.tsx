/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
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
    // eslint-disable-next-line react-hooks/set-state-in-effect
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

      if (!hasChanges) return;

      await updateModelDetailsBySection({
        productId,
        modelId,
        section,
        data: filtered,
      });

      onSuccess();
      onClose();
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  /* ---------- RENDER LIST ---------- */

  const renderList = (field: SectionKey) =>
    (data[field] || []).map((item: any, index: number) => (
      <div
        key={item._id || index}
        className="flex items-center gap-2 mb-2"
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
        >
          <Trash className="w-4 h-4 text-red-500" />
        </Button>
      </div>
    ));

  /* ---------- UI ---------- */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Model Details</DialogTitle>
        </DialogHeader>

        <Tabs
          value={activeSection}
          onValueChange={(v) =>
            setActiveSection(v as SectionKey)
          }
        >
          <TabsList className="grid grid-cols-4">
            <TabsTrigger value="specifications">
              Specifications
            </TabsTrigger>
            <TabsTrigger value="productSpecifications">
              Product Specs
            </TabsTrigger>
            <TabsTrigger value="productFeatures">
              Features
            </TabsTrigger>
            <TabsTrigger value="warranty">
              Warranty
            </TabsTrigger>
          </TabsList>

          {SECTIONS.map((field) => (
            <TabsContent key={field} value={field} className="mt-4">
              {renderList(field)}

              <Button
                variant="outline"
                className="mt-2"
                onClick={() => handleAdd(field)}
                disabled={(data[field]?.length || 0) >= MAX_ITEMS}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </TabsContent>
          ))}
        </Tabs>

        <div className="flex justify-end gap-3 mt-6">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save {activeSection}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
