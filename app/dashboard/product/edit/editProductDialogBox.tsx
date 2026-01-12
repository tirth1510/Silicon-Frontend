/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  Loader2,
  Save
} from "lucide-react";

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
  updateProduct,
  updateModel,
  updateModelDetailsBySection,
  updateColorBySection,
} from "@/services/model.api";
import { ModelWithProductDTO } from "@/types/model";

/* ---------------- Types ---------------- */

type Spec = { key?: string; value?: string; points?: string };

type Product = {
  productId: string;
  modelId: string;
  productCategory: string;
  productTitle: string;
  productDescription: string;
  modelName: string;
  status: string;
  
  // From productModelDetails
  colorName: string;
  stock: number;
  price: number;
  discount: number;
  mainImageUrl: string;
  productImageUrls: { url: string }[];
  galleryImageUrls: { url: string }[];
  
  productSpecifications: Spec[];
  specifications: Spec[];
  warranty: Spec[];
  
  // Color ID for updates
  colorId: string;
};

type Props = {
  productId: string;
  modelId: string;
  open: boolean;
  onClose: () => void;
};

const TAB_CONFIG = [
  { id: "basic", label: "Basic", icon: Box },
  { id: "productImage", label: "Main Image", icon: ImageIcon },
  { id: "gallery", label: "Gallery", icon: LayoutGrid },
  { id: "productSpecifications", label: "Details", icon: List },
  { id: "specifications", label: "Specs", icon: FileText },
  { id: "warranty", label: "Warranty", icon: ShieldCheck },
] as const;

/* ---------------- Component ---------------- */

export default function ProductEditDialog({
  productId,
  modelId,
  open,
  onClose,
}: Props) {
  const [product, setProduct] = useState<Product | null>(null);
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
      try {
        // Fetch model with product info
        const res = await fetch(
          `http://localhost:5000/api/demo/products/${productId}/models/${modelId}`
        );
        const data = await res.json();
        
        if (data.success && data.data) {
          const modelData = data.data;
          const firstColor = modelData.productModelDetails?.colors?.[0];
          
          setProduct({
            productId,
            modelId,
            productCategory: modelData.productCategory || "",
            productTitle: modelData.productTitle || "",
            productDescription: modelData.productDescription || "",
            modelName: modelData.modelName || "",
            status: modelData.status || "Padding",
            
            colorName: firstColor?.colorName || "",
            stock: firstColor?.stock || 0,
            price: firstColor?.colorPrice?.[0]?.price || 0,
            discount: firstColor?.colorPrice?.[0]?.discount || 0,
            mainImageUrl: firstColor?.imageUrl || "",
            productImageUrls: firstColor?.productImageUrl || [],
            galleryImageUrls: firstColor?.productGallery || [],
            
            productSpecifications: modelData.productModelDetails?.productSpecifications || [],
            specifications: modelData.productModelDetails?.specifications || [],
            warranty: modelData.productModelDetails?.warranty || [],
            
            colorId: firstColor?._id || "",
          });
          setActiveTab("basic");
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, [open, productId, modelId]);

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
    try {
      // Update product info
      await updateProduct(productId, {
        productTitle: product.productTitle,
        productDescription: product.productDescription,
      });
      
      // Update model info
      await updateModel(productId, modelId, {
        modelName: product.modelName,
        status: product.status,
      });
      
      // Update color details
      if (product.colorId) {
        await updateColorBySection(productId, modelId, product.colorId, "details", {
          colorName: product.colorName,
          stock: product.stock,
          price: product.price,
          discount: product.discount,
        });
      }
      
      setActiveTab("productImage");
    } catch (error) {
      console.error(error);
    } finally {
      setSaving(false);
    }
  };

  /* ---------------- IMAGE ---------------- */

  const replaceProductImage = async (file: File) => {
    if (!product.colorId) return;
    
    setUploading(true);
    try {
      await updateColorBySection(productId, modelId, product.colorId, "images", {
        mainImage: file,
      });
      
      // Refresh data
      const res = await fetch(
        `http://localhost:5000/api/demo/products/${productId}/models/${modelId}`
      );
      const data = await res.json();
      const firstColor = data.data.productModelDetails?.colors?.[0];
      setProduct((prev) => prev ? {
        ...prev,
        mainImageUrl: firstColor?.imageUrl || prev.mainImageUrl,
      } : prev);
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- GALLERY ---------------- */

  const replaceGallery = async (index: number, file: File) => {
    if (!product.colorId) return;
    
    setUploading(true);
    try {
      await updateColorBySection(productId, modelId, product.colorId, "images", {
        galleryImages: [file],
        index,
      });
      
      // Refresh data
      const res = await fetch(
        `http://localhost:5000/api/demo/products/${productId}/models/${modelId}`
      );
      const data = await res.json();
      const firstColor = data.data.productModelDetails?.colors?.[0];
      setProduct((prev) => prev ? {
        ...prev,
        galleryImageUrls: firstColor?.productGallery || prev.galleryImageUrls,
      } : prev);
    } finally {
      setUploading(false);
    }
  };

  const deleteGallery = async (index: number) => {
    if (!product.colorId) return;
    
    try {
      await updateColorBySection(productId, modelId, product.colorId, "images", {
        deleteGalleryIndexes: [index],
      });
      
      setProduct((p) =>
        p
          ? {
              ...p,
              galleryImageUrls: p.galleryImageUrls.filter((_, i) => i !== index),
            }
          : p
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addGallery = async (files: File[]) => {
    if (!product.colorId) return;
    
    setUploading(true);
    try {
      await updateColorBySection(productId, modelId, product.colorId, "images", {
        galleryImages: files,
      });
      
      // Refresh data
      const res = await fetch(
        `http://localhost:5000/api/demo/products/${productId}/models/${modelId}`
      );
      const data = await res.json();
      const firstColor = data.data.productModelDetails?.colors?.[0];
      setProduct((prev) => prev ? {
        ...prev,
        galleryImageUrls: firstColor?.productGallery || prev.galleryImageUrls,
      } : prev);
    } finally {
      setUploading(false);
    }
  };

  /* ---------------- ARRAYS (Specs/Warranty) ---------------- */

  const deleteArrayItem = async (
    key: "productSpecifications" | "specifications" | "warranty",
    index: number
  ) => {
    try {
      const updatedArray = product[key].filter((_, i) => i !== index);
      
      await updateModelDetailsBySection({
        productId,
        modelId,
        section: key,
        data: { [key]: updatedArray },
      });

      setProduct((p) =>
        p
          ? {
              ...p,
              [key]: updatedArray,
            }
          : p
      );
    } catch (error) {
      console.error(error);
    }
  };

  const addArrayItem = async (
    key: "productSpecifications" | "specifications" | "warranty",
    value: Spec
  ) => {
    try {
      const updated = [...product[key], value];
      
      await updateModelDetailsBySection({
        productId,
        modelId,
        section: key,
        data: { [key]: updated },
      });
      
      setProduct((p) => (p ? { ...p, [key]: updated } : p));
    } catch (error) {
      console.error(error);
    }
  };

  /* ---------------- Render ---------------- */

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[95vw] max-w-4xl h-[85vh] flex flex-col p-0 gap-0 overflow-hidden bg-gray-50/50">
        <DialogHeader className="px-6 py-4 bg-white border-b shrink-0">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Box className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <DialogTitle className="text-xl font-bold text-gray-900">Edit Product</DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5">Update product, model and color details</p>
            </div>
          </div>
        </DialogHeader>

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
                
                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Model Name</Label>
                  <Input
                    value={product.modelName}
                    onChange={(e) =>
                      setProduct({ ...product, modelName: e.target.value })
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
                    <Label className="text-sm font-semibold text-gray-700">Status</Label>
                    <Input
                      value={product.status}
                      onChange={(e) =>
                        setProduct({ ...product, status: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
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
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Price</Label>
                    <Input
                      type="number"
                      value={product.price}
                      onChange={(e) =>
                        setProduct({ ...product, price: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold text-gray-700">Discount (%)</Label>
                    <Input
                      type="number"
                      value={product.discount}
                      onChange={(e) =>
                        setProduct({ ...product, discount: parseInt(e.target.value) || 0 })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-semibold text-gray-700">Description</Label>
                  <Textarea
                    value={product.productDescription}
                    onChange={(e) =>
                      setProduct({ ...product, productDescription: e.target.value })
                    }
                    className="min-h-[150px] resize-none"
                  />
                </div>

                <div className="pt-4">
                  <Button onClick={saveBasic} disabled={saving} className="bg-blue-600 hover:bg-blue-700 text-white">
                    {saving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                    Save Changes
                  </Button>
                </div>
              </TabsContent>

              {/* ---------------- MAIN IMAGE ---------------- */}
              <TabsContent value="productImage" className="mt-0 space-y-6">
                <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 flex flex-col items-center justify-center bg-gray-50/50">
                  {product.mainImageUrl ? (
                    <div className="relative group">
                      <Image
                        src={product.mainImageUrl}
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
                  accept="image/*"
                  onChange={(e) =>
                    e.target.files && replaceProductImage(e.target.files[0])
                  }
                />
                {uploading && <p className="text-sm text-blue-600 animate-pulse text-center">Uploading image...</p>}
              </TabsContent>

              {/* ---------------- GALLERY ---------------- */}
              <TabsContent value="gallery" className="mt-0">
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
                  {product.galleryImageUrls.map((img, i) => (
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
                {uploading && <p className="text-sm text-blue-600 animate-pulse mt-4">Uploading images...</p>}
              </TabsContent>

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

