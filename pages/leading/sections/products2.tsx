/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, Loader2, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { toast } from "sonner";
import axios from "axios";
import {
  getAllModelsWithProductInfo,
  getValuableProductsService,
} from "@/services/model.api";
import { useCategories } from "@/hooks/useCategories";
import { Providers } from "@/providers/providers";

/* ---------- TYPES ---------- */
type ProductForList = {
  id: string;
  modelId: string;
  title: string;
  modelName: string;
  category: string;
  image: string;
};

function FeaturedProductsContent({
  preFetchedValuable,
  preFetchedAllModels,
}: {
  preFetchedValuable?: any;
  preFetchedAllModels?: any;
}) {
  const router = useRouter();
  const { categories } = useCategories();
  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(
    null,
  );

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  const FALLBACK_IMAGE =
    "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg";

  // Fetch Valuable (Flagged) Products
  const { data: valuableData, isLoading: isLoadingValuable } = useQuery({
    queryKey: ["valuable-products"],
    queryFn: () => getValuableProductsService(),
    enabled: !preFetchedValuable,
    initialData: preFetchedValuable,
  });

  // Fetch All Products for Random Section
  const { data: allModelsData, isLoading: isLoadingAll } = useQuery({
    queryKey: ["all-models-info"],
    queryFn: () => getAllModelsWithProductInfo(),
    enabled: !preFetchedAllModels,
    initialData: preFetchedAllModels,
  });

  const { valuableProducts, randomProducts } = useMemo(() => {
    // Logic for Valuable Products (Using flat response from GET API)
    const valuableList: ProductForList[] = Array.isArray(valuableData)
      ? valuableData.map((item: any) => ({
          id: item.productId,
          modelId: item.modelId,
          title: item.productTitle,
          modelName: item.modelName,
          category: item.productCategory,
          image: item.details?.colors?.[0]?.imageUrl || FALLBACK_IMAGE,
        }))
      : [];

    const top4Valuable = valuableList.slice(0, 4);
    const valuableModelIds = new Set(top4Valuable.map((p) => p.modelId));

    // Logic for All Models (Standard source)
    let allList: ProductForList[] = [];
    const sourceData = Array.isArray(allModelsData)
      ? allModelsData
      : (allModelsData as any)?.data || [];

    if (Array.isArray(sourceData)) {
      allList = sourceData.map((item: any) => ({
        id: item.productId || item._id,
        modelId: item.modelId || item._id,
        title: item.productTitle,
        modelName: item.modelName,
        category: item.productCategory,
        image:
          item.productModelDetails?.colors?.[0]?.imageUrl || FALLBACK_IMAGE,
      }));
    }

    const filteredRandom = allList.filter(
      (item) => !valuableModelIds.has(item.modelId),
    );
    const random8 = filteredRandom.sort(() => 0.5 - Math.random()).slice(0, 8);

    return { valuableProducts: top4Valuable, randomProducts: random8 };
  }, [valuableData, allModelsData]);

  const handleSubmitEnquiry = async () => {
    if (!form.name || !form.phone || !form.email) {
      toast.error("Please fill in all required fields");
      return;
    }
    try {
      setSubmitting(true);
      const payload = {
        productId: selectedProduct?.id, // <-- Add this
        modelId: selectedProduct?.modelId,
        productTitle: selectedProduct?.title,
        modelName: selectedProduct?.modelName,
        name: form.name,
        email: form.email,
        phone: form.phone,
        messageTitle: `Enquiry for ${selectedProduct?.modelName}`,
        message: `${form.message}`,
        enquiryType: "Product",
        productImageUrl: selectedProduct?.image || FALLBACK_IMAGE,
      };
      const res = await axios.post(
        `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/contact/product-enquiry`,
        payload,
      );
      if (res.data.success) {
        toast.success("Enquiry sent!");
        setOpen(false);
        setForm({ name: "", email: "", phone: "", message: "" });
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to send enquiry");
    } finally {
      setSubmitting(false);
    }
  };

  const renderProductCard = (product: ProductForList) => {
    const categoryName = categories?.find(
      (c: any) => String(c.categoryId) === String(product.category),
    )?.categoryName;

    return (
      <div
        key={`${product.id}-${product.modelId}`}
        onClick={() => router.push(`/products/${product.modelId}`)}
        className="group bg-white rounded-xl md:rounded-3xl overflow-hidden border border-slate-200 hover:border-blue-900  hover:shadow-xl transition-all duration-500 cursor-pointer flex flex-col h-full"
      >
        {/* Old Card Image Section */}
        <div className="relative h-32 sm:h-48 md:h-60 bg-white overflow-hidden shrink-0">
          <Image
            src={product.image}
            alt={product.modelName}
            fill
            quality={100}
            className="object-contain p-3 md:p-8 group-hover:scale-105 transition-transform duration-700"
            unoptimized
          />
          <div className="absolute top-2 left-2">
            <span className="px-1.5 py-0.5 text-[8px] md:text-[10px] font-bold text-white bg-blue-900 rounded-md shadow-sm uppercase">
              {categoryName || "Medical"}
            </span>
          </div>
        </div>

        {/* Old Card Content Section */}
        <div className="p-2.5 md:p-6 border-t border-slate-50 text-center flex flex-col flex-1">
          <p className="text-[8px] md:text-[10px] uppercase tracking-wider text-blue-600 font-bold mb-1">
            {product.title}
          </p>
          <h4 className="text-[11px] md:text-lg font-bold text-blue-900 mb-3 md:mb-6 line-clamp-2 leading-tight min-h-[1.8rem] md:min-h-[3rem]">
            {product.modelName}
          </h4>

          <div className="flex flex-col gap-1.5 mt-auto">
            <Button
              className="w-full bg-blue-900 hover:bg-blue-800 h-7 md:h-11 rounded-lg md:rounded-xl text-[10px] md:text-sm font-bold"
              onClick={(e) => {
                e.stopPropagation();
                router.push(`/products/${product.modelId}`);
              }}
            >
              View Details
            </Button>
            <Button
              variant="ghost"
              className="w-full h-7 md:h-11 text-blue-900 text-[10px] md:text-sm font-bold bg-blue-50 hover:bg-blue-100 rounded-lg md:rounded-xl"
              onClick={(e) => {
                e.stopPropagation();
                setSelectedProduct(product);
                setOpen(true);
              }}
            >
              Get Enquiry
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="bg-white py-10 md:py-20">
      <div className="max-w-[1400px] mx-auto px-3 md:px-8">
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-8 md:mb-16">
          <h2 className="text-2xl md:text-5xl font-extrabold text-blue-900 mb-3 tracking-tight">
            Premium Equipment
          </h2>
          <p className="text-slate-500 text-[11px] md:text-lg px-4">
            High-end medical solutions designed for hospital-grade durability.
          </p>
        </div>

        {isLoadingValuable || isLoadingAll ? (
          <div className="flex justify-center py-20">
            <Loader2 className="animate-spin h-8 w-8 text-blue-900" />
          </div>
        ) : (
          <div className="space-y-12 md:space-y-20">
            {/* Valuable Items Grid */}
            {valuableProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                {valuableProducts.map(renderProductCard)}
              </div>
            )}
            <div className="text-center max-w-3xl mx-auto mb-8  md:mb-16">
              <h2 className="text-2xl md:text-5xl font-extrabold text-blue-900 mb-3 tracking-tight">
                Medical Equipment
              </h2>
              <p className="text-slate-500 text-[11px] md:text-lg px-4">
                medical solutions designed for hospital-grade durability.
              </p>
            </div>
            {/* Random Items Grid */}
            {randomProducts.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-8">
                {randomProducts.map(renderProductCard)}
              </div>
            )}
          </div>
        )}

        {/* VIEW ALL BUTTON */}
        <div className="mt-12 md:mt-20 text-center">
          <Button
            onClick={() => router.push("/products")}
            className="bg-blue-900 hover:bg-blue-800 text-white px-8 md:px-12 py-5 md:py-7 rounded-xl md:rounded-2xl font-bold text-xs md:text-lg shadow-xl group"
          >
            <span className="mx-2">View All Medical Equipment</span>
            <ArrowRight className="ml-2 w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>

      {/* ENQUIRY DIALOG */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="w-[92vw] max-w-md rounded-2xl border-none shadow-2xl p-4 md:p-6">
          <DialogHeader>
            <DialogTitle className="text-lg md:text-2xl font-bold text-blue-900 text-center">
              Request Quote
            </DialogTitle>
          </DialogHeader>
          {selectedProduct && (
            <div className="space-y-4 mt-2">
              <div className="flex items-center gap-3 bg-blue-50/30 p-3 rounded-xl">
                <div className="relative w-14 h-14 bg-white rounded-lg shrink-0 border">
                  <Image
                    src={selectedProduct.image}
                    alt=""
                    fill
                    className="object-contain p-1"
                    unoptimized
                  />
                </div>
                <div className="min-w-0">
                  <h4 className="font-bold text-blue-900 text-xs md:text-base truncate">
                    {selectedProduct.modelName}
                  </h4>
                  <p className="text-[10px] text-slate-500 uppercase">
                    {selectedProduct.title}
                  </p>
                </div>
              </div>

              <div className="space-y-2.5">
                <Input
                  placeholder="Full Name"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="h-10 md:h-12 text-xs md:text-sm"
                />
                <Input
                  placeholder="Email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  className="h-10 md:h-12 text-xs md:text-sm"
                />
                <Input
                  placeholder="Phone"
                  value={form.phone}
                  onChange={(e) => setForm({ ...form, phone: e.target.value })}
                  className="h-10 md:h-12 text-xs md:text-sm"
                />
                <Textarea
                  placeholder="Message"
                  rows={2}
                  value={form.message}
                  onChange={(e) =>
                    setForm({ ...form, message: e.target.value })
                  }
                  className="text-xs md:text-sm"
                />
              </div>

              <Button
                className="w-full bg-blue-900 hover:bg-blue-800 py-6 md:py-7 rounded-xl font-bold text-sm md:text-lg"
                onClick={handleSubmitEnquiry}
                disabled={submitting}
              >
                {submitting ? (
                  <Loader2 className="animate-spin h-5 w-5" />
                ) : (
                  "Submit Enquiry"
                )}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}

export default function FeaturedProducts(props: {
  preFetchedValuable?: any;
  preFetchedAllModels?: any;
}) {
  return (
    <Providers>
      <FeaturedProductsContent {...props} />
    </Providers>
  );
}
