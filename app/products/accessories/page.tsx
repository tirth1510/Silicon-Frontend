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
import { useMutation } from "@tanstack/react-query";
import { submitAccessoryEnquiry } from "@/services/enquiry.api";

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
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
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
  const { mutate: submitEnquiry, isPending: isSubmitting } = useMutation({
    mutationFn: submitAccessoryEnquiry,
  });

  /* ---------- HANDLE SUBMIT ENQUIRY ---------- */
  /* ---------- HANDLE SUBMIT ENQUIRY ---------- */
  const handleSubmitEnquiry = () => {
    // 1️⃣ Validation: Check all fields since backend requires them
    if (!form.name || !form.phone || !form.email || !form.message) {
      toast.error("Please fill in all the required fields.");
      return;
    }

    const FALLBACK_IMAGE = "https://via.placeholder.com/400x400?text=No+Image";

    // 2️⃣ Prepare payload 
    // ✅ FIXED: Used correct properties from the `Product` type (productTitle, _id, productImages)
    const payload = {
      name: form.name,
      email: form.email,
      phone: form.phone,
      message: form.message,
      productTitle: selectedProduct?.productTitle || "Medical Accessory", 
      productId: selectedProduct?._id || selectedProduct?.id || "unknown", 
      productImageUrl: selectedProduct?.productImages?.[0]?.url || FALLBACK_IMAGE, 
    };

    submitEnquiry(payload, {
      onSuccess: () => {
        toast.success("Enquiry submitted successfully!");
        setOpen(false); // Close the dialog
        setForm({ name: "", email: "", phone: "", message: "" }); // Reset the form
      },
      onError: (error) => {
        console.error("Enquiry submission error:", error);
        toast.error("Failed to send enquiry. Please try again.");
      },
    });
  };


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-12 h-12 border-4 border-blue-900 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <section className="relative min-h-screen pb-20 pt-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2 capitalize">
            {categoryQuery ? categoryQuery : "Medical Accessories"}
          </h1>
          <p className="text-slate-500 text-sm italic">Showing {filteredProducts.length} accessories</p>
        </div>

        {/* TOP TOOLBAR - Sticky & Responsive */}
        <div className="sticky top-16 lg:top-20 z-40 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col gap-4 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            {/* SEARCH BAR */}
            <div className="relative w-full sm:flex-1 sm:max-w-[350px]" ref={searchContainerRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input 
                placeholder="Search accessories..." 
                className="pl-10 border border-slate-200 bg-slate-50 focus:ring-blue-900 rounded-xl w-full"
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

            {/* BUTTONS: Filters & Grid/List */}
            <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-start">
              <Button 
                variant="outline" 
                className={cn("rounded-xl gap-2 border-slate-200 flex-1 sm:flex-none", isFilterOpen && "bg-blue-50 border-blue-200 text-blue-900")}
                onClick={() => setIsFilterOpen(!isFilterOpen)}
              >
                <Filter className="w-4 h-4" />
                Filter Categories
                <ChevronDown className={cn("w-4 h-4 transition-transform", isFilterOpen && "rotate-180")} />
              </Button>

              <div className="flex bg-slate-100 p-1 rounded-xl shrink-0">
                <button 
                  onClick={() => { setLayout("grid"); toast.success("Grid view applied"); }} 
                  className={cn("p-2 rounded-lg transition-all", layout === "grid" ? "bg-white shadow-sm text-blue-900" : "text-slate-500")}
                >
                  <LayoutGrid className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => { setLayout("list"); toast.success("List view applied"); }} 
                  className={cn("p-2 rounded-lg transition-all", layout === "list" ? "bg-white shadow-sm text-blue-900" : "text-slate-500")}
                >
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
                onClick={() => { router.push("/products/accessories"); toast.info("Showing All Accessories"); }}
              >
                All Accessories
              </Button>
              {categoryList.map((cat) => (
                <Button 
                  key={cat}
                  variant={categoryQuery === cat ? "default" : "outline"} 
                  className={cn("rounded-full px-5 text-xs h-8", categoryQuery === cat ? "bg-blue-900" : "border-slate-200 text-slate-600")}
                  onClick={() => { router.push(`/products/accessories?category=${cat}`); toast.info(`Showing ${cat}`); }}
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
              <div key={categoryName} className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="flex items-center gap-3 mb-4 sm:mb-6">
                  <h2 className="text-lg sm:text-xl font-bold text-blue-900 uppercase tracking-tight">{categoryName}</h2>
                  <div className="h-[1px] flex-1 bg-slate-200" />
                  <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                    {items.length} ITEMS
                  </span>
                </div>

                <div className={cn(
                  layout === "grid" 
                    ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6" 
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
            <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-slate-200 animate-in zoom-in-95 duration-300">
              <ShoppingBag className="w-12 h-12 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600">No accessories found</h3>
            </div>
          )}
        </div>
      </div>

      {/* ENQUIRY DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl w-[95vw] sm:w-full">
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
               <p className="text-xs text-gray-500 my-2 text-center">
                All Fields are required
              </p>
              <div className="space-y-3">
                <Input 
                  placeholder="Enter Your Full Name" 
                  value={form.name}
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900"
                />
                <Input 
                  placeholder="Enter Your Email" 
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({...form, email: e.target.value})} 
                  className="rounded-xl border-slate-200 focus:ring-blue-900"
                />
                <Input 
                  placeholder="Enter Your Phone Number" 
                  value={form.phone}
                  onChange={(e) => {
                    // Replaces any non-digit character with an empty string
                    const onlyDigits = e.target.value.replace(/\D/g, "");
                    setForm({ ...form, phone: onlyDigits });
                  }}

                  className="rounded-xl border-slate-200 focus:ring-blue-900"
                />
                <Textarea 
                  placeholder="Enter Your Message" 
                  rows={3} 
                  value={form.message}
                  onChange={(e) => setForm({...form, message: e.target.value})} 
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

  // LIST VIEW
  if (layout === "list") {
    return (
      <div 
        onClick={() => router.push(`/products/accessories/${product.id}`)}
        className="group cursor-pointer bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 hover:border-blue-900 flex flex-row items-center gap-3 sm:gap-6 transition-all shadow-sm hover:shadow-md"
      >
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-xl shrink-0 overflow-hidden">
          <Image src={imageUrl} alt={product.productTitle} fill className="object-contain p-2" unoptimized />
        </div>
        
        <div className="flex-1 text-left min-w-0 flex flex-col justify-center">
          <p className="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest line-clamp-2 leading-tight">{product.productCategory}</p>
          <h4 className="font-bold text-blue-900 text-[11px] sm:text-lg leading-tight mt-1 mb-2 sm:mb-3 line-clamp-2">{product.productTitle}</h4>
          
          <div className="flex gap-2 w-full mt-auto">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg sm:rounded-xl border-slate-200 h-8 sm:h-10 text-[9px] sm:text-sm px-0 sm:px-4" 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/accessories/${product.id}`);
              }}
            >
              Details
            </Button>
            <Button 
              className="flex-1 bg-blue-900 rounded-lg sm:rounded-xl h-8 sm:h-10 px-0 sm:px-6 font-bold text-[9px] sm:text-sm text-white" 
              onClick={(e) => {
                e.stopPropagation();
                onContact();
              }}
            >
              Enquiry
            </Button>
          </div>
        </div>
      </div>
    );
  }

  // GRID VIEW
  return (
    <div 
      onClick={() => router.push(`/products/accessories/${product.id}`)}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-blue-900 transition-all duration-300"
    >
      <div className="relative h-32 sm:h-52 bg-white overflow-hidden shrink-0">
        <Image src={imageUrl} alt={product.productTitle} fill className="object-contain p-3 sm:p-6 group-hover:scale-105 transition-transform duration-500" unoptimized />
      </div>
      
      <div className="p-3 sm:p-5 border-t border-slate-50 flex flex-col flex-1">
        <div className="mb-2 sm:mb-4">
          <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-1 line-clamp-2 leading-tight">{product.productCategory}</p>
          <h4 className="text-[11px] sm:text-md font-bold text-blue-900 h-auto min-h-[30px] sm:h-10 line-clamp-2 leading-tight">{product.productTitle}</h4>
        </div>
        
        <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
          <Button 
            className="w-full bg-blue-900 hover:bg-blue-800 text-white h-7 sm:h-9 text-[9px] sm:text-xs font-bold rounded-lg sm:rounded-xl" 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/accessories/${product.id}`);
            }}
          >
            View Details
          </Button>
          <Button 
            variant="ghost" 
            className="w-full h-7 sm:h-9 text-blue-900 text-[9px] sm:text-xs font-bold bg-blue-50 hover:bg-blue-100 rounded-lg sm:rounded-xl gap-1 sm:gap-2 px-1" 
            onClick={(e) => {
              e.stopPropagation();
              onContact();
            }}
          >
            <MessageCircle className="w-3 h-3 sm:w-4 sm:h-4 shrink-0" />
            <span className="line-clamp-1">Get Enquiry</span>
          </Button>
        </div>
      </div>
    </div>
  );
}