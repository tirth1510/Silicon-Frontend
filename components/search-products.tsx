/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect, useMemo, useDeferredValue } from "react";
import { Search, ChevronRight, Package2 } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { getAllAccessoriesService } from "@/services/accessory.service";

type Item = {
  _id: string;
  finalId: string;
  productTitle: string;
  modelName: string;
  type: "product" | "accessory";
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
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  // 1. Keyboard Shortcut (Ctrl+K)
  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((prev) => !prev);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  // 2. Combined Fetch Logic (Products + Accessories)
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        // Dono API ko ek saath call kar rahe hain
        const [prodRes, accRes] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products-with-models`),
          getAllAccessoriesService() // Service call
        ]);

        const prodData = await prodRes.json();
        
        // Products Mapping
        const mappedProducts = (prodData.success ? prodData.data : []).map((p: any) => ({
          ...p,
          type: "product",
          finalId: p.modelid || p.modelId || p._id
        }));

        // Accessories Mapping (Service response handle karna)
        // Note: Assuming accRes has data in accRes.data or directly as array
        const accessoriesList = Array.isArray(accRes) ? accRes : (accRes as any)?.data || [];
        const mappedAccessories = accessoriesList.map((a: any) => ({
          ...a,
          type: "accessory",
          finalId: a.id || a._id, // Accessories ke liye usually _id hi route hota hai
          // Accessories structure mapping agar API different ho:
          productTitle: a.name || a.title || a.productTitle,
          modelName: a.modelNumber || a.modelName || "Standard"
        }));

        setItems([...mappedProducts, ...mappedAccessories]);
      } catch (error) {
        console.error("Fetch Error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // 3. Filter Logic
  const deferredQuery = useDeferredValue(searchQuery);
  const filteredResults = useMemo(() => {
    const q = deferredQuery.toLowerCase().trim();
    if (!q) return [];
    return items.filter(
      (item) =>
        (item.productTitle || "").toLowerCase().includes(q) ||
        (item.modelName || "").toLowerCase().includes(q)
    );
  }, [deferredQuery, items]);

  // 4. Navigation
  const handleNavigation = (id: string, type: "product" | "accessory") => {
    setOpen(false);
    setSearchQuery("");
    const path = type === "accessory" ? `/products/accessories/${id}` : `/products/${id}`;
    router.push(path);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <div className="relative w-full max-w-md mx-auto">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-blue-900/60" />
          <Input
            placeholder="Search products... (Ctrl+K)"
            className="pl-10 h-12 cursor-pointer border-blue-100 hover:border-blue-900/30 bg-white transition-all"
            readOnly
            onClick={() => setOpen(true)}
          />
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-2xl p-0 overflow-hidden border-none shadow-2xl rounded-3xl bg-white">
        <div className="p-5 border-b mt-5">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              autoFocus
              placeholder="Search products or accessories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-11 h-12"
            />
          </div>
        </div>

        <ScrollArea className="max-h-[50vh] min-h-[400px] bg-white">
          <div className="p-4">
            {!searchQuery && !loading && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <div className="h-16 w-16 bg-blue-50 rounded-full flex items-center justify-center mb-4">
                  <Search className="h-8 w-8 text-blue-900 opacity-40" />
                </div>
                <h3 className="text-lg font-semibold text-blue-900">Search Everything</h3>
                <p className="text-sm text-slate-500 mt-1">Laptops, Phones and Accessories.</p>
              </div>
            )}

            {loading && (
              <div className="flex justify-center py-20">
                <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-blue-900" />
              </div>
            )}

            {!loading && searchQuery && filteredResults.length === 0 && (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package2 className="h-12 w-12 text-slate-200 mb-3" />
                <p className="font-medium text-slate-600">No results for “{searchQuery}”</p>
              </div>
            )}

            <div className="space-y-3">
              {filteredResults.map((item) => {
                // Handling different image structures between products and accessories
                const firstColor = item.productModelDetails?.colors?.[0];
                const imageUrl = (item as any).image || (item as any).thumbnail || (item as any).productImages?.[0]?.url || firstColor?.imageUrl || firstColor?.productImageUrl?.[0]?.url || "/placeholder.png";
                const stock = (item as any).stock ?? firstColor?.stock ?? 0;

                return (
                  <Card
                    key={`${item.type}-${item.finalId}`}
                    onClick={() => handleNavigation(item.finalId, item.type)}
                    className="grid grid-cols-[72px_1fr_140px] items-center gap-4 p-4 bg-white border border-slate-100 rounded-xl cursor-pointer transition-all hover:bg-blue-50/40 hover:border-blue-200 hover:shadow-md group"
                  >
                    <div className="relative h-16 w-16 rounded-lg border bg-white overflow-hidden p-2">
                      <Image src={imageUrl} alt={item.productTitle} fill className="object-contain" unoptimized />
                    </div>

                    <div className="flex flex-col overflow-hidden">
                      <span className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide">
                        {item.type}
                      </span>
                      <h3 className="text-sm font-bold text-slate-900 truncate">
                        {item.productTitle}
                      </h3>
                      <span className="text-xs font-medium text-slate-500 truncate">
                        Model: {item.modelName}
                      </span>
                    </div>

                    <div className="flex flex-col items-end gap-2">
                      <Badge
                        variant="outline"
                        className={`${stock > 0 ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-rose-50 text-rose-700 border-rose-200"} text-[10px] px-3 py-0.5 rounded-full`}
                      >
                        {stock > 0 ? `${stock} In Stock` : "Out of Stock"}
                      </Badge>
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