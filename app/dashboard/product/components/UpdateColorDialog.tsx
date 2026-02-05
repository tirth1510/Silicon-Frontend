/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { updateColorBySection } from "@/services/model.api";
import { FaTrash, FaEdit } from "react-icons/fa";
import { Label } from "@/components/ui/label";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  colorId: string;
  colorData: any;
  onSuccess: () => void;
}

export default function UpdateColorDialog({
  open,
  onClose,
  productId,
  modelId,
  colorId,
  colorData,
  onSuccess,
}: Props) {
  const [colorName, setColorName] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);

  const [mainImage, setMainImage] = useState<File | undefined>(undefined);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const [deleteProductIndexes, setDeleteProductIndexes] = useState<number[]>([]);
  const [deleteGalleryIndexes, setDeleteGalleryIndexes] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  /* RESET STATE WHEN COLOR CHANGES */
  useEffect(() => {
    if (open && colorData) {
      setColorName(colorData.colorName || "");
      setPrice(colorData.colorPrice?.[0]?.price || 0);
      setDiscount(colorData.colorPrice?.[0]?.discount || 0);
      setStock(colorData.stock || 0);

      setMainImage(undefined);
      setProductImages([]);
      setGalleryImages([]);
      setDeleteProductIndexes([]);
      setDeleteGalleryIndexes([]);
    }
  }, [colorData, open]);

  /* ---------- SUBMIT ---------- */
  const handleSubmit = async () => {
    setLoading(true);
    try {
      // Update details
      await updateColorBySection(productId, modelId, colorId, "details", {
        colorName,
        price,
        discount,
        stock,
      });

      // Update images if needed
      if (
        mainImage ||
        productImages.length ||
        galleryImages.length ||
        deleteProductIndexes.length ||
        deleteGalleryIndexes.length
      ) {
        await updateColorBySection(productId, modelId, colorId, "images", {
          mainImage,
          productImages,
          galleryImages,
          deleteProductIndexes,
          deleteGalleryIndexes,
        });
      }

      alert("Color updated successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  const finalPrice = price - (price * discount / 100);

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">Edit Color & Pricing</DialogTitle>
          <DialogDescription className="text-sm text-gray-500">
            Update color details, pricing, and product images
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="mt-4">
          <TabsList className="grid grid-cols-4 w-full">
            <TabsTrigger value="info">Basic Info</TabsTrigger>
            {/* <TabsTrigger value="price">Pricing</TabsTrigger> */}
            <TabsTrigger value="main">Main Image</TabsTrigger>
            <TabsTrigger value="product">Product Images</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* BASIC */}
          <TabsContent value="info" className="space-y-4 mt-4">
            <div className="space-y-2">
              <Label>Color Name</Label>
              <Input
                value={colorName}
                onChange={(e) => setColorName(e.target.value)}
                placeholder="Enter color name (e.g., Midnight Black)"
                disabled={loading}
              />
            </div>
            <div className="space-y-2">
              <Label>Stock Quantity</Label>
              <Input
                type="number"
                value={stock}
                onChange={(e) => setStock(+e.target.value)}
                placeholder="Available stock"
                disabled={loading}
              />
            </div>
          </TabsContent>

          {/* PRICE */}
          {/* <TabsContent value="price" className="space-y-4 mt-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Original Price (₹)</Label>
                <Input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(+e.target.value)}
                  placeholder="0"
                  disabled={loading}
                />
              </div>
              <div className="space-y-2">
                <Label>Discount (%)</Label>
                <Input
                  type="number"
                  value={discount}
                  onChange={(e) => setDiscount(+e.target.value)}
                  placeholder="0"
                  disabled={loading}
                  max={100}
                  min={0}
                />
              </div>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">Final Price:</span>
                <span className="text-2xl font-bold text-blue-600">₹{finalPrice.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <p className="text-xs text-gray-500 mt-1">
                  You save ₹{(price * discount / 100).toFixed(2)} ({discount}% off)
                </p>
              )}
            </div>
          </TabsContent> */}

          {/* MAIN IMAGE */}
          <TabsContent value="main" className="space-y-4 mt-4">
            <Label>Main Product Image</Label>
            <div className="flex gap-6 items-start">
              {colorData.imageUrl && (
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-sm text-gray-600 font-medium">Current Image</span>
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-gray-200 shadow-sm">
                    <Image
                      src={colorData.imageUrl}
                      alt="Main product image"
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                </div>
              )}
              {mainImage && (
                <div className="flex flex-col items-center space-y-2">
                  <span className="text-sm text-green-600 font-medium">New Image Preview</span>
                  <div className="relative w-48 h-48 rounded-lg overflow-hidden border-2 border-green-500 shadow-sm">
                    <Image
                      src={URL.createObjectURL(mainImage)}
                      alt="New main image preview"
                      fill
                      className="object-cover"
                      sizes="192px"
                    />
                  </div>
                </div>
              )}
            </div>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files?.[0])}
              disabled={loading}
            />
          </TabsContent>

          {/* PRODUCT IMAGES */}
          <TabsContent value="product" className="space-y-4 mt-4">
            <Label>Product Images</Label>
            <div className="grid grid-cols-4 gap-4">
              {colorData.productImageUrl?.map((img: any, i: number) => (
                <div
                  key={img._id || img.url || i}
                  className="relative group"
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg">
                    <Image
                      src={img.url}
                      fill
                      alt={`Product image ${i + 1}`}
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        updateColorBySection(productId, modelId, colorId, "images", {
                          deleteProductIndexes: [i],
                        });
                      }}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                    >
                      <FaTrash size={14} />
                    </button>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg">
                      <FaEdit size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const newFiles = [...productImages];
                            newFiles[i] = file;
                            setProductImages(newFiles);
                            updateColorBySection(productId, modelId, colorId, "images", {
                              productImages: [file],
                              index: i,
                            });
                          }
                        }}
                      />
                    </label>
                  </div>
                  <span className="text-xs text-gray-500 text-center block mt-1">Image {i + 1}</span>
                </div>
              ))}
            </div>
            <div>
              <Label>Add New Product Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setProductImages(Array.from(e.target.files || []))}
                disabled={loading}
                className="mt-2"
              />
            </div>
          </TabsContent>

          {/* GALLERY */}
          <TabsContent value="gallery" className="space-y-4 mt-4">
            <Label>Gallery Images</Label>
            <div className="grid grid-cols-4 gap-4">
              {colorData.productGallery?.map((img: any, i: number) => (
                <div
                  key={img._id || img.url || i}
                  className="relative group"
                >
                  <div className="relative w-full aspect-square rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm hover:shadow-lg">
                    <Image
                      src={img.url}
                      fill
                      alt={`Gallery image ${i + 1}`}
                      className="object-cover group-hover:scale-110 transition-transform duration-300"
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
                    />
                  </div>
                  <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => setDeleteGalleryIndexes((p) => [...p, i])}
                      className="bg-red-600 hover:bg-red-700 text-white rounded-full w-8 h-8 flex items-center justify-center shadow-lg"
                    >
                      <FaTrash size={14} />
                    </button>
                    <label className="bg-blue-600 hover:bg-blue-700 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer shadow-lg">
                      <FaEdit size={14} />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            const newFiles = [...galleryImages];
                            newFiles[i] = file;
                            setGalleryImages(newFiles);
                          }
                        }}
                      />
                    </label>
                  </div>
                  <span className="text-xs text-gray-500 text-center block mt-1">Gallery {i + 1}</span>
                </div>
              ))}
            </div>
            <div>
              <Label>Add New Gallery Images</Label>
              <Input
                type="file"
                multiple
                accept="image/*"
                onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
                disabled={loading}
                className="mt-2"
              />
            </div>
          </TabsContent>
        </Tabs>

        <DialogFooter className="mt-6 pt-4 border-t">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading} className="bg-blue-600 hover:bg-blue-700">
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

