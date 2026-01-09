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
      <DialogContent className="w-[95vw] max-w-3xl lg:max-w-4xl xl:max-w-5xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
        <DialogHeader>
          <DialogTitle className="text-xl sm:text-2xl">Edit Accessory</DialogTitle>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 lg:gap-10 mb-3 sm:mb-4 h-auto">
            {TABS.map((t) => (
              <TabsTrigger key={t} value={t} className="text-[10px] sm:text-xs lg:text-sm py-2 px-1 sm:px-2">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* ---------------- BASIC ---------------- */}
          <TabsContent value="basic" className="space-y-3 sm:space-y-4">
            <Input
              value={product.productTitle}
              onChange={(e) =>
                setProduct({ ...product, productTitle: e.target.value })
              }
              placeholder="Title"
              className="text-xs sm:text-sm h-10 sm:h-12"
            />
            <Textarea
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
              className="text-xs sm:text-sm min-h-[80px] sm:min-h-[100px]"
            />
            <Button onClick={saveBasic} disabled={saving} className="text-xs sm:text-sm">
              Save & Next
            </Button>
          </TabsContent>

          {/* ---------------- MAIN IMAGE ---------------- */}
          <TabsContent value="productImage" className="space-y-3">
            <div className="flex justify-center">
              <Image
                src={product.productImageUrl?.[0]?.url}
                width={200}
                height={200}
                alt=""
                className="rounded border w-full max-w-[200px] sm:max-w-[250px] h-auto"
              />
            </div>
            <input
              hidden
              ref={imageRef}
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files && replaceProductImage(e.target.files[0])
              }
            />
            <Button onClick={() => imageRef.current?.click()} className="w-full sm:w-auto text-xs sm:text-sm">
              Replace Image
            </Button>
          </TabsContent>

          {/* ---------------- SPECS / WARRANTY ---------------- */}
          {(
            ["productSpecifications", "specifications", "warranty"] as const
          ).map((key) => (
            <TabsContent key={key} value={key} className="space-y-2 sm:space-y-3">
              {product[key].map((s, i) => (
                <div
                  key={i}
                  className="flex justify-between items-center border rounded p-2 sm:p-3 gap-2"
                >
                  <span className="text-xs sm:text-sm flex-1 break-words">{s.key || s.points}</span>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => deleteArrayItem(key, i)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4 text-red-600" />
                  </Button>
                </div>
              ))}

              <Button
                variant="outline"
                onClick={() => addArrayItem(key, { points: "New Item" })}
                className="w-full sm:w-auto text-xs sm:text-sm"
              >
                <Plus className="w-3 h-3 sm:w-4 sm:h-4 mr-2" />
                Add
              </Button>
            </TabsContent>
          ))}

          {/* ---------------- GALLERY ---------------- */}
          <TabsContent value="gallery" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2 sm:gap-4">
            {product.productGallery.map((img, i) => (
              <div key={i}>
                <Image
                  src={img.url}
                  alt=""
                  width={200}
                  height={200}
                  className="rounded border w-full h-auto"
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
                <div className="flex gap-1 sm:gap-2 mt-2">
                  <Button
                    size="sm"
                    onClick={() => galleryRefs.current[i]?.click()}
                    className="flex-1 text-xs"
                  >
                    Replace
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => deleteGallery(i)}
                    className="shrink-0"
                  >
                    <Trash2 className="w-3 h-3 sm:w-4 sm:h-4" />
                  </Button>
                </div>
              </div>
            ))}

            <label className="border-dashed border-2 rounded flex items-center justify-center cursor-pointer min-h-[100px] sm:min-h-[150px]">
              <input
                hidden
                type="file"
                onChange={(e) =>
                  e.target.files && addGallery(e.target.files[0])
                }
              />
              <Plus className="w-6 h-6 sm:w-8 sm:h-8" />
            </label>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-4 sm:mt-6">
          <Button variant="outline" onClick={onClose} className="text-xs sm:text-sm">
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
