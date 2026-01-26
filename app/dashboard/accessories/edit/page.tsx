// pages/accessories/AccessoriesPage.tsx
"use client";

import { useEffect, useState, useRef } from "react";
import AccessoriesTable from "./table";
import { getPaddingAccessoriesService } from "@/services/accessory.service";
import { Product } from "@/types/accessory";

export default function AccessoriesPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  // Prevent duplicate API calls in React Strict Mode
  const hasFetchedRef = useRef(false);

  useEffect(() => {
    // Only fetch if we haven't already fetched
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      getPaddingAccessoriesService()
        .then(setProducts)
        .finally(() => setLoading(false));
    }
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="h-42 w-42 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600" />
      </div>
    );
  }

  return <AccessoriesTable data={products} />;
}
