/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ---------- TYPES ---------- */
type Color = {
  imageUrl?: string;
  productImageUrl?: { url: string }[];
};

type Specification = {
  points: string;
  _id: string;
};

type ProductFromAPI = {
  _id: string;
  productTitle: string;
  productCategory: string;
  description?: string;
  priceDetails?: { finalPrice?: number };
  colors?: Color[];
  specifications?: Specification[];
  warranty?: any[];
};

type ProductForList = {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
};

/* ---------- COMPONENT ---------- */
export default function ShopPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductForList[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const WHATSAPP_NUMBER = "918160496588"; // with country code

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      const res = await fetch("http://localhost:5000/api/demo/products-with-models");
      const data = await res.json();

      if (data.success) {
        const mapped = data.products.flatMap((product: ProductFromAPI) => {
          if (product.colors?.length) {
            return product.colors.map((color) => ({
              id: product._id,
              title: product.productTitle,
              category: product.productCategory,
              price: product.priceDetails?.finalPrice || 0,
              image:
                color.imageUrl ||
                color.productImageUrl?.[0]?.url ||
                "/placeholder.png",
            }));
          }

          return [
            {
              id: product._id,
              title: product.productTitle,
              category: product.productCategory,
              price: product.priceDetails?.finalPrice || 0,
              image: "/placeholder.png",
            },
          ];
        });

        setProducts(mapped);
      }
    };

    fetchProducts();
  }, []);

  /* ---------- WHATSAPP SEND ---------- */
  const sendWhatsApp = () => {
    if (!selectedProduct) return;

    const message = `
Hello Meditech,

Client Name: ${form.name}
Address: ${form.address}

Product Name: ${selectedProduct.title}
Product Image: ${selectedProduct.image}
    `;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
    setOpen(false);
  };

  const visibleProducts = products.slice(0, 8);

  return (
    <div>
      <section className="max-w-[1400px] mx-auto px-4 py-12">
        {/* ---------- PRODUCT GRID ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product, index) => (
            <Card
              key={`${product.id}-${index}`}
              onClick={() => router.push(`/shop/products/${product.id}`)}
              className="p-4 flex flex-col gap-3 shadow-lg rounded-xl cursor-pointer hover:-translate-y-1"
            >
              <div className="relative w-full h-48">
                <Image
                  src={product.image}
                  alt={product.title}
                  fill
                  className="object-contain"
                />
              </div>

              <h3 className="text-lg font-semibold text-blue-900">
                {product.title}
              </h3>

              <span className="font-bold text-blue-900">
                ₹ {product.price.toLocaleString("en-IN")}
              </span>

              <span className="text-sm text-gray-500">{product.category}</span>

              <div className="flex gap-3 mt-3">
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(`/shop/products/${product.id}`);
                  }}
                  className="flex-1 border-2 border-blue-900 bg-white text-blue-900"
                >
                  View Details
                </Button>

                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedProduct(product);
                    setOpen(true);
                  }}
                  className="flex-1 border-2 border-blue-900 bg-white text-blue-900"
                >
                  Contact
                </Button>
              </div>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------- CONTACT DIALOG ---------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="flex justify-between items-center">
            <DialogTitle>Product Enquiry</DialogTitle>
            <button
              onClick={() => setOpen(false)}
              className="text-xl text-gray-500 hover:text-red-600"
            >
              ✕
            </button>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              <p className="text-sm">
                <strong>Product:</strong> {selectedProduct.title}
              </p>

              <Input
                placeholder="Client Name"
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />

              <Textarea
                placeholder="Address"
                rows={3}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
              />

              <Button
                onClick={sendWhatsApp}
                className="w-full bg-green-600 text-white"
              >
                Send on WhatsApp
              </Button>

              <Button
                variant="outline"
                onClick={() => setOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
