import axios from "axios";
import { ModelWithProductDTO } from "@/types/model";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000/api/demo";

export const getAllModelsWithProductInfo = async (): Promise<
  ModelWithProductDTO[]
> => {
  const res = await axios.get<{
    success: boolean;
    count: number;
    data: ModelWithProductDTO[];
  }>(`${API_BASE_URL}/products-with-models`);

  return res.data.data;
};

export const getPaddingModelsWithProductInfo = async (): Promise<
  ModelWithProductDTO[]
> => {
  const res = await axios.get<{
    success: boolean;
    count: number;
    data: ModelWithProductDTO[];
  }>(`${API_BASE_URL}/products/models/padding`);

  return res.data.data;
};

export const goLiveModelService = async (
  productId: string,
  modelId: string,
  status: "Live" | "Padding" | "Enquiry"
) => {
  const res = await axios.put(
    `${API_BASE_URL}/products/update/${productId}/models/${modelId}`,
    { status }
  );

  if (!res.data.success) {
    throw new Error(res.data.message);
  }

  return res.data.data;
};


