"use client";

import { useEffect, useState, useRef } from "react";
import ProductTable from "./table";
import { getPaddingModelsWithProductInfo } from "@/services/model.api";
import { ModelWithProductDTO } from "@/types/model";

export default function ProductEditPage() {
  const [products, setProducts] = useState<ModelWithProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  // Prevent duplicate API calls in React Strict Mode
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already fetched
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getPaddingModelsWithProductInfo()
        .then(setProducts)
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="h-32 w-32 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return <ProductTable data={products} />;
}
