/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import { ModelWithProductDTO } from "@/types/model";

const API_BASE_URL ="http://localhost:5000/api/demo";

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
    `${API_BASE_URL}/products/${productId}/models/${modelId}`,
    { status }
  );

  if (!res.data.success) {
    throw new Error(res.data.message);
  }

  return res.data.data;
};


export const updateProduct = (productId: string, payload: any) =>
  axios.put(`${API_BASE_URL}/products/${productId}`, payload);




export const updateModel = (
  productId: string,
  modelId: string,
  payload: any
) =>
  axios.put(`${API_BASE_URL}/products/${productId}/models/${modelId}`, payload);

export const updateModelService = async (
  productId: string,
  modelId: string,
  payload: any
) => {
  const res = await axios.put(`${API_BASE_URL}/products/${productId}/models/${modelId}`, payload);
  return res.data;
};

export type ModelDetailsSection =
  | "specifications"
  | "productSpecifications"
  | "productFeatures"
  | "warranty";

interface UpdateModelDetailsParams {
  productId: string;
  modelId: string;
  section: ModelDetailsSection;
  data: any;
}

export const updateModelDetailsBySection = async ({
  productId,
  modelId,
  section,
  data,
}: UpdateModelDetailsParams) => {
  if (!productId || !modelId || !section) {
    throw new Error("Missing required parameters");
  }

  const response = await axios.put(
    `${API_BASE_URL}/products/${productId}/models/${modelId}/details/${section}`,
    data
  );

  return response.data;
};

/**
 * Update color by section (details or images)
 * @param {Object} params
 *  - productId
 *  - modelId
 *  - colorId
 *  - section: "details" | "images"
 *  - colorName, stock, price, discount (for details)
 *  - mainImage, productImages, galleryImages (boolean flags for images)
 *  - file: File or array of Files
 *  - index: optional index to replace
 *  - deleteIndexes: optional array of indexes to delete
 */
// services/product.service.ts
export const updateColorBySection = async (
  productId: string,
  modelId: string,
  colorId: string,
  section: "details" | "images",
  data: {
    colorName?: string;
    stock?: number;
    price?: number;
    discount?: number;
    mainImage?: File;
    productImages?: File[];
    galleryImages?: File[];
    index?: number;
    deleteProductIndexes?: number[];
    deleteGalleryIndexes?: number[];
  }
) => {
  try {
    const formData = new FormData();

    // Append normal fields
    if (data.colorName) formData.append("colorName", data.colorName);
    if (data.stock !== undefined) formData.append("stock", String(data.stock));
    if (data.price !== undefined) formData.append("price", String(data.price));
    if (data.discount !== undefined) formData.append("discount", String(data.discount));
    if (data.index !== undefined) formData.append("index", String(data.index));

    if (data.deleteProductIndexes?.length) {
      formData.append("deleteProductIndexes", JSON.stringify(data.deleteProductIndexes));
    }
    if (data.deleteGalleryIndexes?.length) {
      formData.append("deleteGalleryIndexes", JSON.stringify(data.deleteGalleryIndexes));
    }

    // Append files
    if (data.mainImage) formData.append("mainImage", data.mainImage);
    data.productImages?.forEach((file) => formData.append("productImages", file));
    data.galleryImages?.forEach((file) => formData.append("galleryImages", file));

    const res = await fetch(
      `${API_BASE_URL}/products/color/${productId}/models/${modelId}/colors/${colorId}/${section}`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (!res.ok) {
      let message = "Failed to update color";
      try {
        const err = await res.json();
        message = err.message || message;
      } catch {
        const text = await res.text();
        message = text || message;
      }
      throw new Error(message);
    }

    const result = await res.json();
    return result; // { success: true, message, uploadedUrls }
  } catch (error: any) {
    console.error("updateColorBySection error:", error);
    throw error;
  }
};



export const deleteModelService = async (productId: string, modelId: string) => {
  if (!productId || !modelId) throw new Error("Missing productId or modelId");

  const res = await fetch(
    `${API_BASE_URL}/products/delete/${productId}/models/${modelId}`,
    { method: "DELETE" }
  );

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.message || "Failed to delete model");
  }

  return res.json(); // { success: true, message: "...", product: {...} }
};
