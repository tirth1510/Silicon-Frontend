"use client";

import { useState, useEffect } from "react";
import { Search, ChevronRight, Package2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

type Product = {
  _id: string;
  productTitle: string;
  modelName: string;
  productModelDetails?: {
    colors?: {
      imageUrl?: string;
      productImageUrl?: { url: string }[];
      stock?: number;
    }[];
  };
};

export function SearchProducts() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  /* ---------------- Fetch Products ---------------- */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000"}/api/demo/products-with-models`
        );
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          setProducts(data.data);
        }
      } catch (error) {
        console.error("Fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  /* ---------------- Filter Logic ---------------- */
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredProducts([]);
      return;
    }

    const q = searchQuery.toLowerCase();
    setFilteredProducts(
      products.filter(
        (p) =>
          p.productTitle.toLowerCase().includes(q) ||
          p.modelName.toLowerCase().includes(q)
      )
    );
  }, [searchQuery, products]);

  /* ---------------- Navigation ---------------- */
  const handleProductClick = (productId: string) => {
    setOpen(false);
    router.push(`/product/${productId}`);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {/* ---------------- Trigger ---------------- */}
      <DialogTrigger asChild>
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-900/60" />
          <Input
            placeholder="Search products..."
            className="pl-10 h-12 cursor-pointer border-blue-100 hover:border-blue-900/30 bg-white transition-all"
            readOnly
            onClick={() => setOpen(true)}
          />
        </div>
      </DialogTrigger>

      {/* ---------------- Dialog ---------------- */}
      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
        {/* Header */}
        <div className="p-5 border-b mt-5  ">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              autoFocus
              placeholder="Type product name or model number..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12"
            />
          </div>
        </div>

        {/* ---------------- Results ---------------- */}
        <ScrollArea className="max-h-[50vh] min-h-[400px] bg-white">
          <div className="p-4">
            {/* INITIAL */}
            {!searchQuery && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-blue-900 opacity-40" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">
                  Search Products
                </h3>
                <p className="text-sm text-slate-500 max-w-[260px] mt-1">
                  Start typing to instantly find products by name or model.
                </p>
              </div>
            )}

            {/* LOADING */}
            {loading && searchQuery && (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-900" />
              </div>
            )}

            {/* NO RESULTS */}
            {!loading && searchQuery && filteredProducts.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package2 className="h-12 w-12 text-slate-200 mb-3" />
                <p className="font-medium text-slate-600">
                  No results for “{searchQuery}”
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  Try a different keyword or model name.
                </p>
              </div>
            )}

            {/* PRODUCT LIST */}
            <div className="space-y-3">
              {filteredProducts.map((product) => {
                const firstColor = product.productModelDetails?.colors?.[0];
                const imageUrl =
                  firstColor?.imageUrl ||
                  firstColor?.productImageUrl?.[0]?.url ||
                  "/placeholder.png";
                const stock = firstColor?.stock ?? 0;

                return (
                  <Card
                    key={product._id}
                    onClick={() => handleProductClick(product._id)}
                    className="
                      grid grid-cols-[72px_1fr_140px]
                      items-center gap-4
                      p-4
                      bg-white
                      border border-slate-100
                      rounded-xl
                      cursor-pointer
                      transition-all
                      hover:bg-blue-50/40
                      hover:border-blue-200
                      hover:shadow-md
                      group
                    "
                  >
                    {/* IMAGE */}
                    <div className="relative h-16 w-16 rounded-lg border bg-white overflow-hidden p-2">
                      <Image
                        src={imageUrl}
                        alt={product.productTitle}
                        fill
                        className="object-contain"
                        unoptimized
                      />
                    </div>

                    {/* INFO */}
                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                        Product
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {product.productTitle}
                      </h3>
                      <span className="text-xs font-medium text-slate-500 truncate">
                        Model: {product.modelName}
                      </span>
                    </div>

                    {/* STATUS */}
                    <div className="flex flex-col items-end gap-2">
                      {stock > 0 ? (
                        <Badge
                          variant="outline"
                          className="bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px] px-3 py-0.5 rounded-full"
                        >
                          {stock} In Stock
                        </Badge>
                      ) : (
                        <Badge
                          variant="outline"
                          className="bg-rose-50 text-rose-700 border-rose-200 text-[10px] px-3 py-0.5 rounded-full"
                        >
                          Out of Stock
                        </Badge>
                      )}

                      <ChevronRight className="h-4 w-4 text-slate-300 group-hover:text-blue-900 group-hover:translate-x-1 transition-all" />
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
