/* eslint-disable @typescript-eslint/no-explicit-any */
// services/sell.api.ts
import axios from "axios";
import { SaleProductsResponse } from "@/types/sell";
import { ProductSchemeKey } from "@/constants/schemes";
import {ProductallSchemeKey} from "@/app/dashboard/sales/view/schemes"

export const getSaleProductsService = async (): Promise<SaleProductsResponse> => {
  const res = await axios.get<SaleProductsResponse>(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/limetedtimedeal/sell`
  );

  return res.data;
};
export const fetchProductsByScheme = async (scheme: ProductSchemeKey) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products/scheme/${scheme}`
  );

  if (!res.data?.success) {
    throw new Error("Failed to fetch products");
  }

  return res.data.data;
};

export const fetchProductsByallScheme = async (scheme: ProductallSchemeKey) => {
  const res = await axios.get(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products/scheme/${scheme}`
  );

  if (!res.data?.success) {
    throw new Error("Failed to fetch products");
  }

  return res.data.data;
};




export const updateProductSchemeService = async (
  productId: string,
  modelId: string,
  schemeKey: ProductallSchemeKey
) => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products/${productId}/models/${modelId}/sell`,
    { [schemeKey]: false } // ✅ always set false
  );

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to update scheme");
  }

  return res.data.data; // returns updated schem object
};


export const addProductSchemeService = async (
  productId: string,
  modelId: string,
  schemeKey: ProductallSchemeKey
) => {
  const res = await axios.patch(
    `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo/products/${productId}/models/${modelId}/sell`,
    { [schemeKey]: true } // ✅ always set false
  );

  if (!res.data?.success) {
    throw new Error(res.data?.message || "Failed to update scheme");
  }

  return res.data.data; // returns updated schem object
};