/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Trash2, RefreshCcw, Plus } from "lucide-react";
import { 
  Trash2, 
  RefreshCcw, 
  Plus, 
  Upload, 
  Box, 
  ImageIcon, 
  LayoutGrid, 
  List, 
  FileText, 
  ShieldCheck,
  Loader2
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

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
const TAB_CONFIG = [
  { id: "basic", label: "Basic", icon: Box },
  { id: "productImage", label: "Image", icon: ImageIcon },
  { id: "gallery", label: "Gallery", icon: LayoutGrid },
  { id: "productSpecifications", label: "Details", icon: List },
  { id: "specifications", label: "Specs", icon: FileText },
  { id: "warranty", label: "Warranty", icon: ShieldCheck },
] as const;

/* ---------------- Component ---------------- */

export default function AccessoriesUpdateDialog({
  productId,
  open,
  onClose,
}: Props) {
  const [product, setProduct] = useState<Product | null>(null);
  const [activeTab, setActiveTab] = useState<(typeof TABS)[number]>("basic");
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

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
      try {
        const res = await getAccessoryByIdService(productId);
        setProduct(res);
        setActiveTab("basic");
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, productId]);

  if (!open || loading || !product) return null;
  if (!open) return null;
  if (loading || !product) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="flex items-center justify-center h-40">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        </DialogContent>
      </Dialog>
    );
  }

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
    try {
      await updateAccessoriesDetailsService(productId, {
        productCategory: product.productCategory,
        productTitle: product.productTitle,
        description: product.description,
        status: product.status,
        stock: product.stock,
      });
      setActiveTab("productImage");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- IMAGE ---------------- */

  const replaceProductImage = async (file: File) => {
    const res = await updateAccessoriesDetailsService(
      productId,
      { replaceImageIndex: 0 },
      { productImageUrl: [file] }
    );
    setProduct(res);
    setUploading(true);
    try {
      const res = await updateAccessoriesDetailsService(
        productId,
        { replaceImageIndex: 0 },
        { productImageUrl: [file] }
      );
      setProduct(res);
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- GALLERY ---------------- */

  const replaceGallery = async (index: number, file: File) => {
    const res = await updateAccessoriesDetailsService(
      productId,
      { replaceGalleryIndex: index },
      { productGallery: [file] }
    );
    setProduct(res);
    setUploading(true);
    try {
      const res = await updateAccessoriesDetailsService(
        productId,
        { replaceGalleryIndex: index },
        { productGallery: [file] }
      );
      setProduct(res);
    } finally {
      setUploading(false);
    }
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
    try {
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
    } catch (error) {
      console.error(error);
    }
  };

  const addGallery = async (file: File) => {
    const res = await updateAccessoriesDetailsService(
      productId,
      {},
      { productGallery: [file] }
    );
    setProduct(res);
  const addGallery = async (files: File[]) => {
    setUploading(true);
    try {
      const res = await updateAccessoriesDetailsService(
        productId,
        {},
        { productGallery: files }
      );
      setProduct(res);
    } finally {
      setUploading(false);
    }
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
      <DialogContent className="w-[95vw] max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-gray-50/50">
        <DialogHeader className="px-6 py-4 bg-white border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Box className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Edit Accessory</DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5">Update product details and images</p>
            </div>
          </div>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="grid grid-cols-3 sm:grid-cols-6 gap-1 sm:gap-2 lg:gap-10 mb-3 sm:mb-4 h-auto">
            {TABS.map((t) => (
              <TabsTrigger key={t} value={t} className="text-[10px] sm:text-xs lg:text-sm py-2 px-1 sm:px-2">
                {t}
              </TabsTrigger>
            ))}
          </TabsList>
        <div className="flex-1 overflow-hidden flex flex-col md:flex-row">
          {/* Sidebar Tabs */}
          <div className="w-full md:w-64 bg-white border-r overflow-y-auto shrink-0">
            <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="h-full">
              <TabsList className="flex flex-col h-auto bg-transparent p-2 gap-1 w-full justify-start">
                {TAB_CONFIG.map((t) => (
                  <TabsTrigger 
                    key={t.id} 
                    value={t.id} 
                    className="w-full justify-start px-3 py-2.5 text-sm font-medium data-[state=active]:bg-blue-50 data-[state=active]:text-blue-700 rounded-md transition-all"
                  >
                    <t.icon className="w-4 h-4 mr-3 opacity-70" />
                    {t.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

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
          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-6 bg-white">
            <Tabs value={activeTab} className="w-full">
              {/* ---------------- BASIC ---------------- */}
              <TabsContent value="basic" className="mt-0 space-y-5">
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Product Title</Label>
                  <Input
                    value={product.productTitle}
                    onChange={(e) =>
                      setProduct({ ...product, productTitle: e.target.value })
                    }
                    className="h-11"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Category</Label>
                    <Input
                      value={product.productCategory}
                      disabled
                      className="bg-gray-50"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Stock</Label>
                    <Input
                      type="number"
                      value={product.stock}
                      onChange={(e) =>
                        setProduct({ ...product, stock: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

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
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Description</Label>
                  <Textarea
                    value={product.description}
                    onChange={(e) =>
                      setProduct({ ...product, description: e.target.value })
                    }
                    className="min-h-[150px] resize-none"
                  />
                </div>

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
                <div className="pt-4">
                  <Button onClick={saveBasic} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              ))}
              </TabsContent>

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
              {/* ---------------- MAIN IMAGE ---------------- */}
              <TabsContent value="productImage" className="mt-0 space-y-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50">
                  {product.productImageUrl?.[0]?.url ? (
                    <div className="relative group">
                      <Image
                        src={product.productImageUrl[0].url}
                        width={300}
                        height={300}
                        alt="Product"
                        className="rounded-lg shadow-sm object-contain bg-white p-2 border"
                      />
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center">
                        <Button 
                          variant="secondary" 
                          size="sm"
                          onClick={() => imageRef.current?.click()}
                        >
                          <RefreshCcw className="w-4 h-4 mr-2" />
                          Change Image
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center p-8">
                      <ImageIcon className="w-12 h-12 text-gray-300 mx-auto mb-3" />
                      <p className="text-gray-500 text-sm">No main image set</p>
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="mt-4"
                        onClick={() => imageRef.current?.click()}
                      >
                        Upload Image
                      </Button>
                    </div>
                  )}
                </div>
                <input
                  hidden
                  ref={imageRef}
                  type="file"
                  ref={(el) => {
                    galleryRefs.current[i] = el;
                  }}
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && replaceGallery(i, e.target.files[0])
                    e.target.files && replaceProductImage(e.target.files[0])
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
                {uploading && <p className="text-sm text-blue-600 animate-pulse text-center">Uploading image...</p>}
              </TabsContent>

              {/* ---------------- GALLERY ---------------- */}
              <TabsContent value="gallery" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.productGallery.map((img, i) => (
                    <div key={i} className="group relative aspect-square bg-gray-100 rounded-lg border overflow-hidden">
                      <Image
                        src={img.url}
                        alt=""
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
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
                        <Button
                          size="icon"
                          variant="secondary"
                          className="h-8 w-8"
                          onClick={() => galleryRefs.current[i]?.click()}
                        >
                          <RefreshCcw className="w-4 h-4" />
                        </Button>
                        <Button
                          size="icon"
                          variant="destructive"
                          className="h-8 w-8"
                          onClick={() => deleteGallery(i)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}

                  <label className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all group">
                    <input
                      hidden
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={(e) =>
                        e.target.files && addGallery(Array.from(e.target.files))
                      }
                    />
                    <div className="p-3 bg-gray-100 rounded-full group-hover:bg-blue-100 transition-colors mb-2">
                      <Upload className="w-6 h-6 text-gray-400 group-hover:text-blue-600" />
                    </div>
                    <span className="text-xs font-medium text-gray-500 group-hover:text-blue-600">Add Images</span>
                  </label>
                </div>
              </div>
            ))}
                {uploading && <p className="text-sm text-blue-600 animate-pulse mt-4">Uploading images...</p>}
              </TabsContent>

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
              {/* ---------------- SPECS / WARRANTY ---------------- */}
              {(
                ["productSpecifications", "specifications", "warranty"] as const
              ).map((key) => (
                <TabsContent key={key} value={key} className="mt-0 space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-semibold text-gray-900 capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </h3>
                    <Button
                      size="sm"
                      onClick={() => addArrayItem(key, { points: "New Item" })}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Add Item
                    </Button>
                  </div>

        <DialogFooter className="mt-4 sm:mt-6">
          <Button variant="outline" onClick={onClose} className="text-xs sm:text-sm">
                  <div className="space-y-3">
                    {product[key].length === 0 ? (
                      <div className="text-center py-10 border-2 border-dashed rounded-lg">
                        <p className="text-gray-500 text-sm">No items added yet</p>
                      </div>
                    ) : (
                      product[key].map((s, i) => (
                        <div
                          key={i}
                          className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg border group hover:border-blue-200 transition-colors"
                        >
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />
                          <div className="flex-1 text-sm text-gray-700 pt-0.5">
                            {s.key && <span className="font-semibold mr-2">{s.key}:</span>}
                            {s.value || s.points}
                          </div>
                          <Button
                            size="icon"
                            variant="ghost"
                            onClick={() => deleteArrayItem(key, i)}
                            className="h-8 w-8 text-gray-400 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      ))
                    )}
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          </div>
        </div>

        <DialogFooter className="px-6 py-4 border-t bg-gray-50 shrink-0">
          <Button variant="outline" onClick={onClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
