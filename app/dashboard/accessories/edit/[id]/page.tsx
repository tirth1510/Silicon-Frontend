"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from "react";
import Image from "next/image";
import { Trash2, RefreshCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import {
  updateAccessoriesDetailsService,
  getAccessoryByIdService,
} from "@/services/accessory.service";

export default function AccessoriesFormPage({
  productId,
}: {
  productId: string;
}) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  /* ---------- fetch product ---------- */
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await getAccessoryByIdService(productId);
        setProduct(res);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId]);

  /* ---------- handlers ---------- */
  const handleFieldChange = (field: string, value: any) => {
    setProduct((prev: any) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      await updateAccessoriesDetailsService(productId, {
        productCategory: product.productCategory,
        productTitle: product.productTitle,
        description: product.description,
        status: product.status,
        priceDetails: product.priceDetails,
        stock: product.stock,
      });
      alert("Product updated successfully");
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteSpecification = async (index: number) => {
    await updateAccessoriesDetailsService(productId, {
      deleteIndex: index,
    });
    setProduct((prev: any) => ({
      ...prev,
      productSpecifications: prev.productSpecifications.filter((_: any, i: number) => i !== index),
    }));
  };

  const handleReplaceGallery = async (index: number, file: File) => {
    await updateAccessoriesDetailsService(
      productId,
      { replaceGalleryIndex: index },
      { productGallery: [file] }
    );
  };

  /* ---------- render ---------- */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Edit Accessory</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Input
              value={product.productCategory || ""}
              onChange={(e) => handleFieldChange("productCategory", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Title</Label>
            <Input
              value={product.productTitle || ""}
              onChange={(e) => handleFieldChange("productTitle", e.target.value)}
            />
          </div>

          <div className="space-y-2 md:col-span-2">
            <Label>Description</Label>
            <Textarea
              value={product.description || ""}
              onChange={(e) => handleFieldChange("description", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Input
              value={product.status || ""}
              onChange={(e) => handleFieldChange("status", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label>Stock</Label>
            <Input
              type="number"
              value={product.stock || 0}
              onChange={(e) => handleFieldChange("stock", Number(e.target.value))}
            />
          </div>
        </CardContent>
      </Card>

      {/* Specifications */}
      <Card>
        <CardHeader>
          <CardTitle>Specifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {product.specifications?.map((spec: any, i: number) => (
            <div
              key={i}
              className="flex items-center justify-between border rounded-lg p-3"
            >
              <span className="text-sm">
                {spec.name}: {spec.value}
              </span>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteSpecification(i)}
              >
                <Trash2 className="w-4 h-4 text-red-600" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Gallery */}
      <Card>
        <CardHeader>
          <CardTitle>Gallery</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {product.productGallery?.map((img: any, i: number) => (
            <div key={i} className="space-y-2">
              <Image
                src={img.url}
                alt="gallery"
                width={200}
                height={200}
                className="rounded-lg object-cover"
              />
              <label className="block">
                <Input
                  type="file"
                  className="hidden"
                  onChange={(e) =>
                    e.target.files && handleReplaceGallery(i, e.target.files[0])
                  }
                />
                <Button variant="outline" size="sm" className="w-full">
                  <RefreshCcw className="w-4 h-4 mr-2" /> Replace
                </Button>
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
