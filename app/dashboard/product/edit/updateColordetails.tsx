/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { updateColorBySection } from "@/services/model.api";
import { FaTrash, FaEdit } from "react-icons/fa";

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

  const [deleteProductIndexes, setDeleteProductIndexes] = useState<number[]>(
    []
  );
  const [deleteGalleryIndexes, setDeleteGalleryIndexes] = useState<number[]>(
    []
  );

  const [loading, setLoading] = useState(false);

  /* 🔥 RESET STATE WHEN COLOR CHANGES */
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

      onSuccess();
      onClose();
    } catch (err: any) {
      console.error(err);
      alert(err.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Edit Color</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="info">
          <TabsList>
            <TabsTrigger value="info">Basic</TabsTrigger>
            <TabsTrigger value="price">Price</TabsTrigger>
            <TabsTrigger value="main">Main Image</TabsTrigger>
            <TabsTrigger value="product">Product Images</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>

          {/* BASIC */}
          <TabsContent value="info">
            <input
              className="border p-2 w-full"
              value={colorName}
              onChange={(e) => setColorName(e.target.value)}
              placeholder="Color name"
              disabled={loading}
            />
          </TabsContent>

          {/* PRICE */}
          <TabsContent value="price">
            <input
              type="number"
              className="border p-2 w-full mb-2"
              value={price}
              onChange={(e) => setPrice(+e.target.value)}
              placeholder="Price"
              disabled={loading}
            />
            <input
              type="number"
              className="border p-2 w-full mb-2"
              value={discount}
              onChange={(e) => setDiscount(+e.target.value)}
              placeholder="Discount %"
              disabled={loading}
            />
            <input
              type="number"
              className="border p-2 w-full"
              value={stock}
              onChange={(e) => setStock(+e.target.value)}
              placeholder="Stock"
              disabled={loading}
            />
          </TabsContent>
          <TabsContent value="main">
            <label className="block font-medium mb-2">Main Image</label>
            <div className="flex gap-4 items-center">
              {colorData.imageUrl && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">Current</span>
                  <Image
                    src={colorData.imageUrl}
                    alt="Main product image"
                    width={120}
                    height={120}
                    className="rounded border"
                  />
                </div>
              )}
              {mainImage && (
                <div className="flex flex-col items-center">
                  <span className="text-sm text-gray-600">New</span>
                  <Image
                    src={URL.createObjectURL(mainImage)}
                    alt="New main image preview"
                    width={120}
                    height={120}
                    className="rounded border"
                  />
                </div>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setMainImage(e.target.files?.[0])}
              disabled={loading}
              className="mt-2"
            />
          </TabsContent>

          {/* PRODUCT IMAGES */}
         <TabsContent value="product">
  <label className="block font-medium mb-2">Product Images</label>
  <div className="flex gap-4 flex-wrap">
    {colorData.productImageUrl?.map((img: any, i: number) => (
      <div
        key={img._id || img.url || i}
        className="relative flex flex-col items-center"
      >
        <span className="text-xs text-gray-600 mb-1">Index {i}</span>
        <Image
          src={img.url}
          width={80}
          height={80}
          alt={`Product image ${i + 1}`}
          className="rounded border"
        />
        <div className="absolute top-0 right-0 flex gap-1">
          {/* Delete icon */}
          <button
            type="button"
            aria-label={`Remove product image ${i + 1}`}
            onClick={() => {
              // call API to delete immediately
              updateColorBySection(productId, modelId, colorId, "images", {
                deleteProductIndexes: [i],
              });
            }}
            className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
          >
            <FaTrash size={12} />
          </button>

          {/* Update icon */}
          <label className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
            <FaEdit size={12} />
            <input
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  // update preview in local state
                  const newFiles = [...productImages];
                  newFiles[i] = file;
                  setProductImages(newFiles);

                  // call API to replace at index
                  updateColorBySection(productId, modelId, colorId, "images", {
                    productImages: [file],
                    index: i,
                  });
                }
              }}
            />
          </label>
        </div>
      </div>
    ))}

    {/* New uploads preview */}
    {productImages.map((file, i) => (
      <div key={i} className="flex flex-col items-center">
        <span className="text-xs text-gray-600">New</span>
        <Image
          src={URL.createObjectURL(file)}
          width={80}
          height={80}
          alt="New product image preview"
          className="rounded border"
        />
      </div>
    ))}
  </div>

  {/* Add new images */}
  <input
    type="file"
    multiple
    onChange={(e) => setProductImages(Array.from(e.target.files || []))}
    disabled={loading}
    className="mt-2"
  />
</TabsContent>


          {/* GALLERY */}
          <TabsContent value="gallery">
            <label className="block font-medium mb-2">Gallery Images</label>
            <div className="flex gap-4 flex-wrap">
              {colorData.productGallery?.map((img: any, i: number) => (
                <div
                  key={img._id || img.url || i}
                  className="relative flex flex-col items-center"
                >
                  <span className="text-xs text-gray-600 mb-1">Index {i}</span>
                  <Image
                    src={img.url}
                    width={80}
                    height={80}
                    alt={`Gallery image ${i + 1}`}
                    className="rounded border"
                  />
                  <div className="absolute top-0 right-0 flex gap-1">
                    {/* Delete icon */}
                    <button
                      type="button"
                      aria-label={`Remove gallery image ${i + 1}`}
                      onClick={() => setDeleteGalleryIndexes((p) => [...p, i])}
                      className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center"
                    >
                      🗑️
                    </button>
                    {/* Update icon */}
                    <label className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center cursor-pointer">
                      ✏️
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
                </div>
              ))}

              {/* New uploads preview */}
              {galleryImages.map((file, i) => (
                <div key={i} className="flex flex-col items-center">
                  <span className="text-xs text-gray-600">New</span>
                  <Image
                    src={URL.createObjectURL(file)}
                    width={80}
                    height={80}
                    alt="New gallery image preview"
                    className="rounded border"
                  />
                </div>
              ))}
            </div>
            <input
              type="file"
              multiple
              onChange={(e) =>
                setGalleryImages(Array.from(e.target.files || []))
              }
              disabled={loading}
              className="mt-2"
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
