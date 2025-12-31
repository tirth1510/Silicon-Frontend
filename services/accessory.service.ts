// services/accessory.service.ts
import axios from "axios";
import { Product,AccessoryApiResponse,SingleAccessoryResponse } from "@/types/accessory";

export const getAllAccessoriesService = async (): Promise<Product[]> => {
  const res = await axios.get("http://localhost:5000/api/accessorize/all");

  // extract the products array
  if (res.data?.success && Array.isArray(res.data.products)) {
    return res.data.products;
  }

  return [];
};


export const getAccessoryByIdService = async (
  id: string
): Promise<AccessoryApiResponse> => {
  const res = await axios.get<SingleAccessoryResponse>(
    `http://localhost:5000/api/accessorize/${id}`
  );
  // return the inner data
  return res.data.data;
};



