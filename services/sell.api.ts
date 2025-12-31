// services/sell.api.ts
import axios from "axios";
import { SaleProductsResponse } from "@/types/sell";
import { ProductSchemeKey } from "@/constants/schemes";

export const getSaleProductsService = async (): Promise<SaleProductsResponse> => {
  const res = await axios.get<SaleProductsResponse>(
    "http://localhost:5000/api/demo/limetedtimedeal/sell"
  );

  return res.data;
};
export const fetchProductsByScheme = async (scheme: ProductSchemeKey) => {
  const res = await axios.get(
    `http://localhost:5000/api/demo/scheme/${scheme}`
  );

  if (!res.data?.success) {
    throw new Error("Failed to fetch products");
  }

  return res.data.data;
};