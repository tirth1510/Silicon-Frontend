/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState, useRef, Suspense } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Product } from "@/types/accessory";
import { getAllAccessoriesService } from "@/services/accessory.service";
import { 
  Package, 
  Eye, 
  MessageCircle, 
  ShoppingBag, 
  Search, 
  LayoutGrid, 
  List, 
  Filter, 
  ChevronDown,
  ChevronRight,
  Loader2,
  SendHorizontal
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

function AccessoriesContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams?.get("category") || null;

  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  /* ---------- FETCH API ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const res = await getAllAccessoriesService();
        setProducts(res);
      } catch (error) {
        console.error("Error fetching accessories:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  /* ---------- HANDLE CLICK OUTSIDE ---------- */
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  /* ---------- DYNAMIC CATEGORIES LIST ---------- */
  const categoryList = useMemo(() => {
    const cats = products.map((p) => p.productCategory).filter(Boolean);
    return Array.from(new Set(cats));
  }, [products]);

  /* ---------- SEARCH SUGGESTIONS LOGIC ---------- */
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter(p => p.productTitle.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5); // Limit to 5 results
  }, [searchQuery, products]);

  /* ---------- FILTER & SEARCH LOGIC ---------- */
  const filteredProducts = useMemo(() => {
    let result = products;
    if (categoryQuery) {
      result = result.filter((p) => p.productCategory === categoryQuery);
    }
    if (searchQuery) {
      result = result.filter((p) =>
        p.productTitle.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    return result;
  }, [products, categoryQuery, searchQuery]);

  /* ---------- GROUP BY CATEGORY ---------- */
  const groupedProducts = useMemo(() => {
    const groups: Record<string, Product[]> = {};
    filteredProducts.forEach((product) => {
      const category = product.productCategory || "Others";
      if (!groups[category]) groups[category] = [];
      groups[category].push(product);
    });
    return groups;
  }, [filteredProducts]);

  /* ---------- ENQUIRY HANDLER ---------- */
  const handleSubmitEnquiry = async () => {
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        productTitle: selectedProduct?.productTitle,
        modelName: selectedProduct?.productTitle,
        name: form.name,
        email: form.email,
        phone: form.phone,
        messageTitle: `Enquiry for ${selectedProduct?.productTitle}`,
        message: `${form.address}`,
        enquiryType: "Accessory",
        productImageUrl: selectedProduct?.productImages?.[0]?.url || "https://via.placeholder.com/400",
      };

      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/product-enquiry`,
        payload,
      );

      if (res.data.success) {
        toast.success("Enquiry sent! Our team will contact you soon.");
        setOpen(false);
        setForm({ name: "", email: "", phone: "", address: "" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative bg-slate-50 min-h-screen pb-20 pt-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-blue-900 mb-2">
            {categoryQuery ? categoryQuery : "Medical Accessories"}
          </h1>
          <p className="text-slate-500 text-sm">Showing {filteredProducts.length} accessories</p>
        </div>

        {/* TOP TOOLBAR: Search & Click to Filter */}
        <div className="bg-white p-3 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col gap-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            
            {/* SEARCH BAR WITH SUGGESTION DROPDOWN */}
            <div className="relative flex-1 min-w-[280px]" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search accessories..." 
                className="pl-10 border-none bg-slate-50 focus:ring-blue-900 rounded-xl"
                value={searchQuery}
                onFocus={() => setShowSuggestions(true)}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(true);
                }}
              />

              {/* SUGGESTIONS DROPDOWN */}
              {showSuggestions && searchSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                    Suggested Accessories
                  </div>
                  {searchSuggestions.map((item) => (
                    <button
                      key={item.id}
                      className="w-full flex items-center gap-4 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-none"
                      onClick={() => {
                        setSearchQuery(item.productTitle);
                        setShowSuggestions(false);
                      }}
                    >
                      <div className="relative w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                        <Image 
                          src={item.productImages?.[0]?.url || "https://via.placeholder.com/400"} 
                          alt="" fill className="object-contain p-1" unoptimized 
                        />
                      </div>
                      <div className="flex-1 overflow-hidden">
                        <p className="text-sm font-bold text-blue-900 truncate">{item.productTitle}</p>
                        <p className="text-[10px] text-slate-400 uppercase">{item.productCategory}</p>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Button 
                variant="outline" 
                className={cn("rounded-xl gap-2 border-slate-200", isFilterOpen && "bg-blue-50 border-blue-200 text-blue-900")}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4" />
                Filter Categories
                <ChevronDown className={cn("w-4 h-4 transition-transform", isFilterOpen && "rotate-180")} />
              </Button>

              <div className="flex bg-slate-100 p-1 rounded-xl">
                <button onClick={() => setLayout("grid")} className={cn("p-2 rounded-lg", layout === "grid" ? "bg-white shadow-sm text-blue-900" : "text-slate-500")}>
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button onClick={() => setLayout("list")} className={cn("p-2 rounded-lg", layout === "list" ? "bg-white shadow-sm text-blue-900" : "text-slate-500")}>
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* COLLAPSIBLE CATEGORIES */}
          {isFilterOpen && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
              <Button 
                variant={!categoryQuery ? "default" : "outline"} 
                className={cn("rounded-full px-5 text-xs h-8", !categoryQuery ? "bg-blue-900" : "border-slate-200 text-slate-600")}
                onClick={() => router.push("/products/accessories")}
              >
                All Accessories
              </Button>
              {categoryList.map((cat) => (
                <Button 
                  key={cat}
                  variant={categoryQuery === cat ? "default" : "outline"} 
                  className={cn("rounded-full px-5 text-xs h-8", categoryQuery === cat ? "bg-blue-900" : "border-slate-200 text-slate-600")}
                  onClick={() => router.push(`/products/accessories?category=${cat}`)}
                >
                  {cat}
                </Button>
              ))}
            </div>
          )}
        </div>

        {/* MAIN CONTENT AREA */}
        <div className="w-full">
          {Object.entries(groupedProducts).length > 0 ? (
            Object.entries(groupedProducts).map(([categoryName, items]) => (
              <div key={categoryName} className="mb-12">
                <div className="flex items-center gap-3 mb-6">
                  <h2 className="text-xl font-bold text-blue-900 uppercase tracking-tight">{categoryName}</h2>
                  <div className="h-[1px] flex-1 bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                    {items.length} ITEMS
                  </span>
                </div>

                <div className={cn(
                  layout === "grid" 
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6" 
                    : "space-y-4"
                )}>
                  {items.map((product, idx) => (
                    <ProductCard 
                      key={`${product.id}-${idx}`} 
                      product={product} 
                      layout={layout} 
                      onContact={() => { setSelectedProduct(product); setOpen(true); }}
                      router={router}
                    />
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600">No accessories found</h3>
            </div>
          )}
        </div>
      </div>

      {/* ENQUIRY DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-900">Enquire for Accessory</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-4 bg-blue-50 p-3 rounded-2xl border border-blue-100">
                <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-blue-100">
                  <Image 
                    src={selectedProduct.productImages?.[0]?.url || "https://via.placeholder.com/400"} 
                    alt="" fill className="object-contain p-1" unoptimized 
                  />
                </div>
                <div>
                  <p className="text-[10px] font-bold text-blue-600 uppercase">Selected Accessory</p>
                  <h4 className="font-bold text-blue-900 leading-tight">{selectedProduct.productTitle}</h4>
                </div>
              </div>
              
              <div className="space-y-3">
                <Input 
                  placeholder="Full Name" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900"
                />
                <Input 
                  placeholder="Email Address" 
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900"
                />
                <Input 
                  placeholder="Phone Number" 
                  value={form.phone}
                  onChange={(e) => setForm({...form, phone: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900"
                />
                <Textarea 
                  placeholder="Delivery Address" 
                  rows={3} 
                  value={form.address}
                  onChange={(e) => setForm({...form, address: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900 resize-none"
                />
              </div>
              <Button 
                className="w-full bg-blue-900 hover:bg-blue-800 py-6 rounded-2xl font-bold gap-2 text-md" 
                onClick={handleSubmitEnquiry}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  <SendHorizontal className="w-5 h-5" />
                )}
                {submitting ? "Sending..." : "Submit Enquiry"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function AccessoriesPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    }>
      <AccessoriesContent />
    </Suspense>
  );
}

/* ---------- HELPER CARD COMPONENT ---------- */
function ProductCard({ product, layout, onContact, router }: any) {
  const imageUrl = product.productImages?.[0]?.url || "https://via.placeholder.com/400";

  if (layout === "list") {
    return (
      <div className="group bg-white p-4 rounded-2xl border border-slate-200 hover:border-blue-900 flex flex-col sm:flex-row items-center gap-6 transition-all shadow-sm hover:shadow-md">
        <div className="relative w-24 h-24 bg-slate-50 rounded-xl shrink-0 overflow-hidden">
          <Image src={imageUrl} alt={product.productTitle} fill className="object-contain p-2" unoptimized />
        </div>
        <div className="flex-1 text-center sm:text-left">
          <p className="text-[10px] font-bold text-blue-600 uppercase tracking-widest">{product.productCategory}</p>
          <h4 className="font-bold text-blue-900 text-lg leading-tight">{product.productTitle}</h4>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button variant="outline" className="flex-1 rounded-xl border-slate-200 h-10" onClick={() => router.push(`/products/accessories/${product.id}`)}>
            Details
          </Button>
          <Button className="flex-1 bg-blue-900 rounded-xl h-10 px-6 font-bold" onClick={onContact}>
            Get Enquiry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="group bg-white rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-blue-900 transition-all duration-300">
      <div className="relative h-52 bg-white overflow-hidden">
        <Image src={imageUrl} alt={product.productTitle} fill className="object-contain p-6 group-hover:scale-105 transition-transform duration-500" unoptimized />
      </div>
      <div className="p-5 border-t border-slate-50">
        <p className="text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-1">{product.productCategory}</p>
        <h4 className="text-md font-bold text-blue-900 mb-4 h-10 line-clamp-2 leading-tight">{product.productTitle}</h4>
        <div className="flex flex-col gap-2">
          <Button className="w-full bg-blue-900 hover:bg-blue-800 h-9 text-xs font-bold rounded-xl" onClick={() => router.push(`/products/accessories/${product.id}`)}>
            View Details
          </Button>
          <Button variant="ghost" className="w-full h-9 text-blue-900 text-xs font-bold bg-blue-50 hover:bg-blue-100 rounded-xl gap-2" onClick={onContact}>
            <MessageCircle className="w-4 h-4" />
            Get Enquiry
          </Button>
        </div>
      </div>
    </div>
  );
}