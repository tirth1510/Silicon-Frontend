/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo, Suspense, useRef } from "react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { 
  ShoppingBag, Eye, MessageCircle, X, Search, 
  LayoutGrid, List, ChevronRight, Filter, ChevronDown,
  Loader2, SendHorizontal, Star
} from "lucide-react";
import { toast } from "sonner";
import axios from "axios";
import { useCategoryBySlug, useCategories } from "@/hooks/useCategories";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

/* ---------- TYPES ---------- */
type ProductForList = {
  id: string;
  modelId: string;
  title: string;
  modelName: string;
  category: string;
  image: string;
  valuble: boolean; 
};

function ProductsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categorySlug = searchParams?.get("category") || null;

  const [products, setProducts] = useState<ProductForList[]>([]);
  const [displayedProducts, setDisplayedProducts] = useState<ProductForList[]>([]);
  const [isFiltering, setIsFiltering] = useState(true); // Loader State
  
  const [layout, setLayout] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [open, setOpen] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(null);
  const [form, setForm] = useState({ name: "", email: "", phone: "", address: "" });
  const [submitting, setSubmitting] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);

  const { category, loading: categoryLoading } = useCategoryBySlug(categorySlug || undefined);
  const { categories } = useCategories();

  const FALLBACK_IMAGE = "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg";

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products-with-models`);
        const data = await res.json();
        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((product: any) => ({
            id: product._id,
            modelId: product.modelId,
            title: product.productTitle,
            modelName: product.modelName,
            category: product.productCategory,
            valuble: product.valuble || product.valuable === true, 
            image: product.productModelDetails?.colors?.[0]?.imageUrl || 
                   product.productModelDetails?.colors?.[0]?.productImageUrl?.[0]?.url || 
                   FALLBACK_IMAGE,
          }));
          setProducts(mapped);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Filtering Logic with Timeout for Loader
  useEffect(() => {
    setIsFiltering(true);
    
    const timer = setTimeout(() => {
      // Jab tak category load nahi ho jaati, tab tak process mat aage badhao
      if (categorySlug && categorySlug !== "premium" && categoryLoading) {
        return;
      }

      let result = products;
      
      if (categorySlug === "premium") {
        result = result.filter((p) => p.valuble === true);
      } 
      else if (categorySlug && category) {
        result = result.filter((p) => String(p.category) === String(category.categoryId));
      }
      
      if (searchQuery) {
        result = result.filter((p) => 
          p.modelName.toLowerCase().includes(searchQuery.toLowerCase()) || 
          p.title.toLowerCase().includes(searchQuery.toLowerCase())
        );
      }
      
      setDisplayedProducts(result);
      setIsFiltering(false);
    }, 400); // 400ms ka delay loader show karne ke liye

    return () => clearTimeout(timer);
  }, [products, category, categorySlug, searchQuery, categoryLoading]);

  // Suggestions search query se hi chalegi taaki autocomplete fast rahe
  const searchSuggestions = useMemo(() => {
    if (!searchQuery.trim()) return [];
    return products
      .filter(p => p.modelName.toLowerCase().includes(searchQuery.toLowerCase()))
      .slice(0, 5);
  }, [searchQuery, products]);

  // Display hone wale products ko group karna
  const groupedProducts = useMemo(() => {
    const groups: Record<string, ProductForList[]> = {};
    displayedProducts.forEach((p) => {
      if (!groups[p.title]) groups[p.title] = [];
      groups[p.title].push(p);
    });
    return groups;
  }, [displayedProducts]);

  const handleSubmitEnquiry = async () => {
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      setSubmitting(true);

      const payload = {
        productTitle: selectedProduct?.modelName,
        modelName: selectedProduct?.modelName,
        name: form.name,
        email: form.email,
        phone: form.phone,
        messageTitle: `Enquiry for ${selectedProduct?.modelName}`,
        message: `${form.address}`,
        enquiryType: "Product",
        productImageUrl: selectedProduct?.image || FALLBACK_IMAGE,
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

  return (
    <section className="bg-slate-50 min-h-screen pb-20 pt-28">
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-blue-900 mb-2 capitalize">
                {categorySlug === "premium" ? "Premium Products" : (category ? category.categoryName : "Medical Equipment Catalog")}
            </h1>
            <p className="text-slate-500 text-sm italic">
                {isFiltering ? "Loading products..." : `Showing ${displayedProducts.length} items`}
            </p>
        </div>

        <div className="sticky top-16 lg:top-20 z-40 bg-white/95 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-200 mb-6 flex flex-col gap-4 transition-all duration-300">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            
            <div className="relative w-full sm:max-w-[350px] " ref={searchContainerRef}>
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input 
                  placeholder="Search by model name..." 
                  className="pl-10 border border-slate-200 bg-slate-50 focus:ring-blue-900 rounded-xl w-full"
                  value={searchQuery}
                  onFocus={() => setShowSuggestions(true)}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setShowSuggestions(true);
                  }}
                />

                {showSuggestions && searchSuggestions.length > 0 && (
                  <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-slate-100 shadow-xl rounded-2xl z-[100] overflow-hidden animate-in fade-in slide-in-from-top-2">
                    <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                      Suggested Results
                    </div>
                    {searchSuggestions.map((item) => (
                      <button
                        key={item.id}
                        className="w-full flex items-center gap-4 px-4 py-3 hover:bg-blue-50 transition-colors text-left border-b border-slate-50 last:border-none"
                        onClick={() => {
                          setSearchQuery(item.modelName);
                          setShowSuggestions(false);
                        }}
                      >
                        <div className="relative w-10 h-10 bg-slate-100 rounded-lg overflow-hidden shrink-0">
                          <Image src={item.image} alt="" fill className="object-contain p-1" unoptimized />
                        </div>
                        <div className="flex-1 overflow-hidden">
                          <p className="text-sm font-bold text-blue-900 truncate">{item.modelName}</p>
                          <p className="text-[10px] text-slate-400 uppercase">{item.title}</p>
                        </div>
                        <ChevronRight className="w-4 h-4 text-slate-300" />
                      </button>
                    ))}
                  </div>
                )}
            </div>

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

          {isFilterOpen && (
            <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-2 animate-in fade-in slide-in-from-top-2">
                <Button 
                    variant={!categorySlug ? "default" : "outline"} 
                    className={cn("rounded-full px-5 text-xs h-8", !categorySlug ? "bg-blue-900" : "border-slate-200 text-slate-600")}
                    onClick={() => { router.push("/products"); toast.info("Showing All Collections"); }}
                >
                    All Collection
                </Button>
                
                <Button 
                    variant={categorySlug === "premium" ? "default" : "outline"} 
                    className={cn("rounded-full px-5 text-xs h-8", categorySlug === "premium" ? "bg-blue-900" : "border-slate-200 text-slate-600")}
                    onClick={() => { router.push("/products?category=premium"); toast.success("Showing Premium Products"); }}
                >
                    Premium Products
                </Button>

                {categories?.filter((cat: any) => String(cat.categoryId) !== "4").map((cat: any) => (
                    <Button 
                        key={cat._id}
                        variant={categorySlug === cat.categorySlug ? "default" : "outline"} 
                        className={cn("rounded-full px-5 text-xs h-8", categorySlug === cat.categorySlug ? "bg-blue-900" : "border-slate-200 text-slate-600")}
                        onClick={() => { router.push(`/products?category=${cat.categorySlug}`); toast.info(`Showing ${cat.categoryName}`); }}
                    >
                        {cat.categoryName}
                    </Button>
                ))}
            </div>
          )}
        </div>

        <div className="w-full">
            {isFiltering ? (
                /* LOADER ANIMATION */
                <div className="flex flex-col items-center justify-center py-32 opacity-80 animate-in fade-in duration-500">
                    <Loader2 className="w-10 h-10 text-blue-900 animate-spin mb-4" />
                    <p className="text-slate-500 font-bold tracking-widest text-xs uppercase">Applying Filters...</p>
                </div>
            ) : Object.keys(groupedProducts).length > 0 ? (
                Object.entries(groupedProducts).map(([title, items]) => (
                <div key={title} className="mb-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="flex items-center gap-3 mb-4 sm:mb-6">
                    <h2 className="text-lg sm:text-xl font-bold text-blue-900 uppercase tracking-tight">{title}</h2>
                    <div className="h-[1px] flex-1 bg-slate-200" />
                    <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full shrink-0">
                        {items.length} MODELS
                    </span>
                    </div>

                    <div className={cn(
                    layout === "grid" 
                        ? "grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-6" 
                        : "space-y-4"
                    )}>
                    {items.map((product) => (
                        <ProductCard 
                        key={product.id} 
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
                  <h3 className="text-lg font-semibold text-slate-600 tracking-tight">No equipment found matching your criteria</h3>
                </div>
            )}
        </div>
      </div>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-3xl border-none shadow-2xl w-[95vw] sm:w-full">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold text-blue-900">Enquire for Equipment</DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 mt-2">
                <div className="flex items-center gap-4 bg-blue-50 p-3 rounded-2xl border border-blue-100">
                    <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden shrink-0 border border-blue-100">
                        <Image src={selectedProduct.image} alt="" fill className="object-contain p-1" unoptimized />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-blue-600 uppercase">Product Details</p>
                        <h4 className="font-bold text-blue-900">{selectedProduct.modelName}</h4>
                        <p className="text-xs text-slate-500 line-clamp-2">{selectedProduct.title}</p>
                    </div>
                </div>
                
                <div className="space-y-3">
                    <Input 
                        placeholder="Full Name" 
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
                        placeholder="Delivery Address / Additional Requirements" 
                        rows={3} 
                        value={form.address}
                        onChange={(e) => setForm({...form, address: e.target.value})} 
                        className="rounded-xl border-slate-200 focus:ring-blue-900 resize-none"
                    />
                </div>
                <Button className="w-full bg-blue-900 hover:bg-blue-800 py-6 rounded-2xl font-bold gap-2 text-md" onClick={handleSubmitEnquiry} disabled={submitting}>
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

function ProductCard({ product, layout, onContact, router }: any) {
  // LIST VIEW
  if (layout === "list") {
    return (
      <div 
        onClick={() => router.push(`/products/${product.modelId}`)}
        className="group cursor-pointer bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 hover:border-blue-900 flex flex-row items-center gap-3 sm:gap-6 transition-all shadow-sm hover:shadow-md"
      >
        <div className="relative w-24 h-24 sm:w-32 sm:h-32 bg-slate-50 rounded-xl shrink-0 overflow-hidden">
          <Image src={product.image} alt={product.modelName} fill className="object-contain p-2" unoptimized />
        </div>
        
        <div className="flex-1 text-left min-w-0 flex flex-col justify-center">
          
          {product.valuble && (
            <div className="mb-1 w-max bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] sm:text-[8px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 shadow-sm">
                <Star className="w-2 h-2" fill="currentColor" /> Premium
            </div>
          )}
          
          <p className="text-[8px] sm:text-[10px] font-bold text-blue-600 uppercase tracking-widest line-clamp-2 leading-tight">{product.title}</p>
          <h4 className="font-bold text-blue-900 text-[11px] sm:text-lg leading-tight mt-1 mb-2 sm:mb-3 line-clamp-2">{product.modelName}</h4>
          
          <div className="flex gap-2 w-full mt-auto">
            <Button 
              variant="outline" 
              className="flex-1 rounded-lg sm:rounded-xl border-slate-200 h-8 sm:h-10 text-[9px] sm:text-sm px-0 sm:px-4" 
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.modelId}`);
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
      onClick={() => router.push(`/products/${product.modelId}`)}
      className="group cursor-pointer flex flex-col bg-white rounded-2xl sm:rounded-3xl overflow-hidden border border-slate-200 hover:shadow-xl hover:border-blue-900 transition-all duration-300"
    >
      <div className="relative h-32 sm:h-52 bg-white overflow-hidden shrink-0">
        <Image src={product.image} alt={product.modelName} fill className="object-contain p-3 sm:p-6 group-hover:scale-105 transition-transform duration-500" unoptimized />
      </div>
      
      <div className="p-3 sm:p-5 border-t border-slate-50 flex flex-col flex-1">
        
        {product.valuble && (
            <div className="mb-1.5 sm:mb-2 w-max bg-gradient-to-r from-amber-500 to-orange-500 text-white text-[7px] sm:text-[10px] font-bold px-1.5 sm:px-2 py-0.5 rounded-md flex items-center gap-1 shadow-sm">
                <Star className="w-2 h-2 sm:w-3 sm:h-3" fill="currentColor" /> Premium
            </div>
        )}

        <div className="mb-2 sm:mb-4">
            <p className="text-[8px] sm:text-[10px] uppercase tracking-widest text-blue-600 font-bold mb-1 line-clamp-2 leading-tight">{product.title}</p>
            <h4 className="text-[11px] sm:text-md font-bold text-blue-900 h-auto min-h-[30px] sm:h-10 line-clamp-2 leading-tight">{product.modelName}</h4>
        </div>

        <div className="flex flex-col gap-1.5 sm:gap-2 mt-auto">
          <Button 
            className="w-full bg-blue-900 hover:bg-blue-800 text-white h-7 sm:h-9 text-[9px] sm:text-xs font-bold rounded-lg sm:rounded-xl" 
            onClick={(e) => {
              e.stopPropagation();
              router.push(`/products/${product.modelId}`);
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

export default function AllProductsPage() {
  return (
    <Suspense fallback={<div className="flex justify-center items-center min-h-screen"><Loader2 className="animate-spin h-8 w-8 text-blue-900" /></div>}>
      <ProductsContent />
    </Suspense>
  );
}