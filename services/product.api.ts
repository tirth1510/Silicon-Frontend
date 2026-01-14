/* eslint-disable @typescript-eslint/no-explicit-any */
import axios from "axios";
import {
  ApiResponse,
  CreateProductStep1Payload,
  ProductModelDetailsPayload,
  ProductDTO,
  ProductModelDTO,
  ColorVariantPayload,
  UpdateProductModelFeaturesPayload,
} from "@/types/product";

const API = axios.create({
  baseURL: `${process.env.NEXT_PUBLIC_API_BASE_URL}/api/demo`,
});

/* ---------- STEP-1 ---------- */
export const createProductStep1 = async (
  payload: CreateProductStep1Payload
): Promise<ApiResponse<ProductDTO>> => {
  const res = await API.post<ApiResponse<ProductDTO>>("/products", payload);
  return res.data;
};


/*------------- STEP-1 ------- ADD NEW MODEL ----- */

export const addProductModelService = async (
  productId: string,
  payload: { modelName: string }
): Promise<ApiResponse<ProductModelDTO>> => {
  const res = await API.post<ApiResponse<ProductModelDTO>>(
    `/products/${productId}/models`,
    {
      modelName: payload.modelName,
      status: "Padding", // 👈 spelling fixed too
    }
  );

  return res.data;
};







/* ---------- STEP-2 ---------- */
export const addProductModelDetails = async (
  productId: string,
  modelId: string,
  payload: ProductModelDetailsPayload
): Promise<ApiResponse<ProductModelDTO>> => {
  const res = await API.put<ApiResponse<ProductModelDTO>>(
    `/products/${productId}/models/${modelId}/details`,
    payload
  );
  return res.data;
};

/* ---------- STEP-3: Add Color Variant ---------- */
export const addColorVariant = async (
  productId: string,
  modelId: string,
  payload: ColorVariantPayload
): Promise<ApiResponse<any>> => {
  // Convert the payload to FormData for multipart upload
  const formData = new FormData();
  formData.append("colorName", payload.colorName);
  if (payload.stock !== undefined) formData.append("stock", payload.stock.toString());
  if (payload.colorPrice) formData.append("colorPrice", JSON.stringify(payload.colorPrice));
  formData.append("colorImage", payload.colorImage);

  if (payload.productImages) {
    payload.productImages.forEach((file) => formData.append("productImages", file));
  }

  if (payload.galleryImages) {
    payload.galleryImages.forEach((file) => formData.append("galleryImages", file));
  }

  // Pass the FormData directly to axios
  const res = await API.post<ApiResponse<any>>(
    `/products/${productId}/models/${modelId}/colors`,
    formData,
    {
      headers: { "Content-Type": "multipart/form-data" },
    }
  );

  return res.data;
};



/* ---------- STEP-4: Update Product Model Features ---------- */
export const updateProductModelFeatures = async (
  productId: string,
  modelId: string,
  payload: UpdateProductModelFeaturesPayload
): Promise<ApiResponse<any>> => {
  const res = await API.put<ApiResponse<any>>(
    `/products/${productId}/models/${modelId}/features`,
    payload
  );
  return res.data;
};

/* ---------- UPDATE PRODUCT ---------- */
export const updateProductService = async (
  productId: string,
  payload: any
): Promise<ApiResponse<any>> => {
  const res = await API.put<ApiResponse<any>>(
    `/products/${productId}`,
    payload
  );
  return res.data;
};

