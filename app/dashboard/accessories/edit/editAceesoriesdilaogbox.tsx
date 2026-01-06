/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trash2, RefreshCcw, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import {
  getAccessoryByIdService,
  updateAccessoriesDetailsService,
} from "@/services/accessory.service";

/* ---------------- Types ---------------- */

type Spec = { key?: string; value?: string; points?: string };
type ImageObj = { url: string };

type Product = {
  productCategory: string;
  productTitle: string;
  description: string;
  status: string;
  stock: number;

  productImageUrl: ImageObj[];
  productGallery: ImageObj[];

  productSpecifications: Spec[];
  specifications: Spec[];
  warranty: Spec[];
};

type Props = {
  productId: string;
  open: boolean;
  onClose: () => void;
};

const TABS = [
  "basic",
  "productImage",
  "productSpecifications",
  "specifications",
  "warranty",
  "gallery",
] as const;

/* ---------------- Component ---------------- */

export default function AccessoriesUpdateDialog({
  productId,
  open,
  onClose,
}: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("basic");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);

  const imageRef = useRef<HTMLInputElement | null>(null);
  const galleryRefs = useRef<(HTMLInputElement | null)[]>([]);

  /* ---------------- Fetch ---------------- */

  useEffect(() => {
    if (!open) return;

    (async () => {
      setLoading(true);
      const res = await getAccessoryByIdService(productId);
      setProduct(res);
      setActiveTab("basic");
      setLoading(false);
    })();
  }, [open, productId]);

  if (!open || loading || !product) return null;

  /* ---------------- BASIC SAVE ---------------- */

  const saveBasic = async () => {
    setSaving(true);
    await updateAccessoriesDetailsService(productId, {
      productCategory: product.productCategory,
      productTitle: product.productTitle,
      description: product.description,
      status: product.status,
      stock: product.stock,
    });
    setSaving(false);
    setActiveTab("productImage");
  };

  /* ---------------- IMAGE ---------------- */

  const replaceProductImage = async (file: File) => {
    const res = await updateAccessoriesDetailsService(
      productId,
      { replaceImageIndex: 0 },
      { productImageUrl: [file] }
    );
    setProduct(res);
  };

  /* ---------------- GALLERY ---------------- */

  const replaceGallery = async (index: number, file: File) => {
    const res = await updateAccessoriesDetailsService(
      productId,
      { replaceGalleryIndex: index },
      { productGallery: [file] }
    );
    setProduct(res);
  };

  const deleteGallery = async (index: number) => {
    await updateAccessoriesDetailsService(productId, {
      deleteGalleryIndex: index,
    });
    setProduct((p) =>
      p
        ? {
            ...p,
            productGallery: p.productGallery.filter((_, i) => i !== index),
          }
        : p
    );
  };

  const addGallery = async (file: File) => {
    const res = await updateAccessoriesDetailsService(
      productId,
      {},
      { productGallery: [file] }
    );
    setProduct(res);
  };

  /* ---------------- ARRAYS ---------------- */

  const deleteArrayItem = async (
    key: "productSpecifications" | "specifications" | "warranty",
    index: number
  ) => {
    const payloadMap: any = {
      productSpecifications: { deleteIndex: index },
      specifications: { deleteSpecificationIndex: index },
      warranty: { deleteWarrantyIndex: index },
    };

    await updateAccessoriesDetailsService(productId, payloadMap[key]);

    setProduct((p) =>
      p
        ? {
            ...p,
            [key]: p[key].filter((_: any, i: number) => i !== index),
          }
        : p
    );
  };

  const addArrayItem = async (
    key: "productSpecifications" | "specifications" | "warranty",
    value: Spec
  ) => {
    const updated = [...product[key], value];
    await updateAccessoriesDetailsService(productId, { [key]: updated });
    setProduct((p) => (p ? { ...p, [key]: updated } : p));
  };

  /* ---------------- Render ---------------- */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Accessory</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-6 gap-10 mb-4">
            {TABS.map((t) => (
              <TabsTrigger key={t} value={t}>
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ---------------- BASIC ---------------- */}
          <TabsContent value="basic" className="space-y-4">
            <Input
              value={product.productTitle}
              onChange={(e) =>
                setProduct({ ...product, productTitle: e.target.value })
              }
              placeholder="Title"
            />
            <Textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
            <Button onClick={saveBasic} disabled={saving}>
              Save & Next
            </Button>
          </TabsContent>

          {/* ---------------- MAIN IMAGE ---------------- */}
          <TabsContent value="productImage" className="space-y-3">
            <Image
              src={product.productImageUrl?.[0]?.url}
              width={250}
              height={250}
              alt=""
              className="rounded border"
            />
            <input
              hidden
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && replaceProductImage(e.target.files[0])
              }
            />
            <Button onClick={() => imageRef.current?.click()}>
              Replace Image
            </Button>
          </TabsContent>

          {/* ---------------- SPECS / WARRANTY ---------------- */}
          {(
            ["productSpecifications", "specifications", "warranty"] as const
          ).map((key) => (
            <TabsContent key={key} value={key} className="space-y-3">
              {product[key].map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between border rounded p-3"
                >
                  <span>{s.key || s.points}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteArrayItem(key, i)}
                  >
                    <Trash2 className="w-4 h-4 text-red-600" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => addArrayItem(key, { points: "New Item" })}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add
              </Button>
            </TabsContent>
          ))}

          {/* ---------------- GALLERY ---------------- */}
          <TabsContent value="gallery" className="grid grid-cols-4 gap-4">
            {product.productGallery.map((img, i) => (
              <div key={i}>
                <Image
                  src={img.url}
                  alt=""
                  width={200}
                  height={200}
                  className="rounded border"
                />
                <input
                  hidden
                  type="file"
                  ref={(el) => {
                    galleryRefs.current[i] = el;
                  }}
                  onChange={(e) =>
                    e.target.files && replaceGallery(i, e.target.files[0])
                  }
                />
                <div className="flex gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => galleryRefs.current[i]?.click()}
                  >
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteGallery(i)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <label className="border-dashed border-2 rounded flex items-center justify-center cursor-pointer">
              <input
                hidden
                type="file"
                onChange={(e) =>
                  e.target.files && addGallery(e.target.files[0])
                }
              />
              <Plus />
            </label>
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
