"use client";

import { useState, ChangeEvent } from "react";
import { useMutation } from "@tanstack/react-query";
import { addColorVariant } from "@/services/product.api";
import { ColorVariantPayload } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Props {
  productId: string;
  modelId: string;
  onNext: () => void;
}

export default function Step3ColorVariant({ productId, modelId, onNext }: Props) {
  const [colorName, setColorName] = useState("");
  const [stock, setStock] = useState<number>(0);
  const [colorImage, setColorImage] = useState<File | null>(null);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [colorPrice, setColorPrice] = useState([{ currency: "INR", price: 0, discount: 0 }]);

  const mutation = useMutation({
    mutationFn: async () => {
      if (!colorImage) throw new Error("Main color image is required");

      const payload: ColorVariantPayload = {
        colorName,
        stock,
        colorImage,
        productImages,
        galleryImages,
        colorPrice: colorPrice.map((p) => ({ currency: p.currency, price: p.price, discount: p.discount })),
      };

      return addColorVariant(productId, modelId, payload);
    },
    onSuccess: () => {
      onNext();
    },
  });

  const handleFileChange =
    (setter: (files: File[]) => void, multiple = false) =>
    (e: ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        setter(multiple ? Array.from(e.target.files) : [e.target.files[0]]);
      }
    };

  return (
    <div className="space-y-4">
      {/* Color Name */}
      <div>
        <label className="font-medium text-sm">Color Name</label>
        <Input
          value={colorName}
          onChange={(e) => setColorName(e.target.value)}
          placeholder="Color Name"
        />
      </div>

      {/* Stock */}
      <div>
        <label className="font-medium text-sm">Stock</label>
        <Input
          type="number"
          value={stock}
          onChange={(e) => setStock(parseInt(e.target.value))}
          placeholder="Stock"
        />
      </div>

      {/* Color Image */}
      <div>
        <label className="font-medium text-sm">Color Image</label>
        <Input type="file" accept="image/*" onChange={handleFileChange((files) => setColorImage(files[0]))} />
      </div>

      {/* Product Images */}
      <div>
        <label className="font-medium text-sm">Product Images</label>
        <Input type="file" accept="image/*" multiple onChange={handleFileChange(setProductImages, true)} />
      </div>

      {/* Gallery Images */}
      <div>
        <label className="font-medium text-sm">Gallery Images</label>
        <Input type="file" accept="image/*" multiple onChange={handleFileChange(setGalleryImages, true)} />
      </div>

      {/* Color Price */}
      <div>
        <label className="font-medium text-sm">Price (INR)</label>
        {colorPrice.map((item, idx) => (
          <div key={idx} className="flex gap-2 mb-2">
            <Input
              type="number"
              placeholder="Price"
              value={item.price}
              onChange={(e) => {
                const newArr = [...colorPrice];
                newArr[idx].price = parseFloat(e.target.value);
                setColorPrice(newArr);
              }}
            />
            <Input
              type="number"
              placeholder="Discount"
              value={item.discount}
              onChange={(e) => {
                const newArr = [...colorPrice];
                newArr[idx].discount = parseFloat(e.target.value);
                setColorPrice(newArr);
              }}
            />
          </div>
        ))}
        <Button
          size="sm"
          onClick={() => setColorPrice([...colorPrice, { currency: "INR", price: 0, discount: 0 }])}
        >
          + Add Another Price
        </Button>
      </div>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Save & Continue
      </Button>
    </div>
  );
}
