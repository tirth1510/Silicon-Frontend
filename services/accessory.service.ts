/* eslint-disable @typescript-eslint/no-explicit-any */

import axios from "axios";
import {
  Product,
  AccessoryApiResponse,
  SingleAccessoryResponse,
} from "@/types/accessory";

/* ================= AXIOS INSTANCE ================= */
const API = axios.create({
  baseURL: "http://localhost:5000/api",
  withCredentials: true,
});

/* ================= TYPES ================= */
export type ProductStatus = "Padding" | "Live" | "Enquiry";

interface UpdateStatusResponse {
  success: boolean;
  message: string;
  product: Product;
}

/* ================= FETCH SERVICES ================= */

/** Get all accessories */
export const getAllAccessoriesService = async (): Promise<Product[]> => {
  const res = await API.get("/accessorize/all");
  return res.data?.success ? res.data.products : [];
};

/** Get padding accessories */
export const getPaddingAccessoriesService = async (): Promise<Product[]> => {
  const res = await API.get("/accessorize/padding/all");
  return res.data?.success ? res.data.products : [];
};

/** Update product status */
export const updateProductStatusService = async (
  productId: string,
  status: ProductStatus
): Promise<UpdateStatusResponse> => {
  if (!productId) throw new Error("Product ID is required");

  const { data } = await API.put<UpdateStatusResponse>(
    `/accessorize/${productId}/status`,
    { status }
  );

  return data;
};

/** Get accessory by ID */

/* ================= CREATE PRODUCT ================= */

export type ProductSpecification = {
  key: string;
  value: string;
};

export type CreateProductPayload = {
  productCategory: string;
  productTitle: string;
  description: string;
  price: number;
  discount?: number;
  stock?: number;
  specifications?: string;
  warranty?: string;
  productSpecifications?: ProductSpecification[];
};

export type CreateProductFiles = {
  productImages: File[];
  galleryImages?: File[];
};

/** Create product */
export const createProductService = async (
  data: CreateProductPayload,
  files: CreateProductFiles
) => {
  if (!files.productImages?.length) {
    throw new Error("At least one product image is required");
  }

  const formData = new FormData();

  /* ---------- TEXT ---------- */
  formData.append("productCategory", data.productCategory);
  formData.append("productTitle", data.productTitle);
  formData.append("description", data.description);
  formData.append("price", String(data.price));

  if (data.discount !== undefined)
    formData.append("discount", String(data.discount));

  if (data.stock !== undefined) formData.append("stock", String(data.stock));

  if (data.specifications)
    formData.append("specifications", data.specifications);

  if (data.warranty) formData.append("warranty", data.warranty);

  if (data.productSpecifications?.length) {
    formData.append(
      "productSpecifications",
      JSON.stringify(data.productSpecifications)
    );
  }

  /* ---------- IMAGES ---------- */
  files.productImages.forEach((file) => formData.append("productImages", file));

  files.galleryImages?.forEach((file) =>
    formData.append("galleryImages", file)
  );

  /* ---------- API ---------- */
  const { data: response } = await API.post("/accessorize/create", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response;
};

export const updateProductService = async (
  id: string,
  data: CreateProductPayload,
  files?: CreateProductFiles
): Promise<Product> => {
  const formData = new FormData();

  // append text fields
  Object.entries(data).forEach(([key, value]) => {
    if (value !== undefined) formData.append(key, value as any);
  });

  // append files
  if (files?.productImages) {
    files.productImages.forEach((file) =>
      formData.append("productImages", file)
    );
  }
  if (files?.galleryImages) {
    files.galleryImages.forEach((file) =>
      formData.append("galleryImages", file)
    );
  }

  const res = await API.put(`/accessorize/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.product;
};

/* ================= SECTION-BASED UPDATE ================= */

/** Update product details */
// utils/api.ts

/** Update product main image */



export const getAccessoryByIdService = async (
  id: string
): Promise<AccessoryApiResponse> => {
  const res = await API.get<SingleAccessoryResponse>(`/accessorize/${id}`);
  return res.data.data;
};



/* ================= UPDATE ACCESSORIES (ADVANCED) ================= */

/* ---------------- Types ---------------- */



/* ---------------- GET ---------------- */

export const getAccessoryByervice = async (id: string) => {
  if (!id) throw new Error("Accessory ID required");

  const res = await API.get(`/accessorize/${id}`);
  return res.data.product;
};

/* ---------------- UPDATE ---------------- */

export type UpdateAccessoriesPayload = {
  productCategory?: string;
  productTitle?: string;
  description?: string;
  stock?: number;
  priceDetails?: {
    price: number;
    discount: number;
  };
  specifications?: any[];
  warranty?: any[];
  productSpecifications?: any[];
  specIndexes?: number[];
  specificationIndexes?: number[];
  warrantyIndexes?: number[];
  deleteIndex?: number;
  deleteSpecificationIndex?: number;
  deleteWarrantyIndex?: number;
  deleteGalleryIndex?: number;
  replaceGalleryIndex?: number;
  deleteImageIndex?: number;
  replaceImageIndex?: number;
};

export type UpdateAccessoriesFiles = {
  productImageUrl?: File[];
  productGallery?: File[];
};

export const updateAccessoriesDetailsService = async (
  id: string,
  payload: UpdateAccessoriesPayload = {},
  files?: UpdateAccessoriesFiles
) => {
  if (!id) throw new Error("Accessory ID required");

  const formData = new FormData();

  /* ---------- simple fields ---------- */
  if (payload.productCategory) formData.append("productCategory", payload.productCategory);
  if (payload.productTitle) formData.append("productTitle", payload.productTitle);
  if (payload.description) formData.append("description", payload.description);
  if (payload.stock !== undefined) formData.append("stock", String(payload.stock));

  if (payload.priceDetails) {
    formData.append("priceDetails", JSON.stringify(payload.priceDetails));
  }

  /* ---------- arrays ---------- */
  if (payload.productSpecifications)
    formData.append(
      "productSpecifications",
      JSON.stringify(payload.productSpecifications)
    );

  if (payload.specifications)
    formData.append("specifications", JSON.stringify(payload.specifications));

  if (payload.warranty)
    formData.append("warranty", JSON.stringify(payload.warranty));

  /* ---------- indexes ---------- */
  if (payload.specIndexes !== undefined)
    formData.append("specIndexes", JSON.stringify(payload.specIndexes));

  if (payload.specificationIndexes !== undefined)
    formData.append(
      "specificationIndexes",
      JSON.stringify(payload.specificationIndexes)
    );

  if (payload.warrantyIndexes !== undefined)
    formData.append(
      "warrantyIndexes",
      JSON.stringify(payload.warrantyIndexes)
    );

  if (payload.deleteIndex !== undefined)
    formData.append("deleteIndex", String(payload.deleteIndex));

  if (payload.deleteSpecificationIndex !== undefined)
    formData.append(
      "deleteSpecificationIndex",
      String(payload.deleteSpecificationIndex)
    );

  if (payload.deleteWarrantyIndex !== undefined)
    formData.append(
      "deleteWarrantyIndex",
      String(payload.deleteWarrantyIndex)
    );

  if (payload.deleteGalleryIndex !== undefined)
    formData.append("deleteGalleryIndex", String(payload.deleteGalleryIndex));

  if (payload.replaceGalleryIndex !== undefined)
    formData.append("replaceGalleryIndex", String(payload.replaceGalleryIndex));

  if (payload.deleteImageIndex !== undefined)
    formData.append("deleteImageIndex", String(payload.deleteImageIndex));

  if (payload.replaceImageIndex !== undefined)
    formData.append("replaceImageIndex", String(payload.replaceImageIndex));

  /* ---------- files ---------- */
  files?.productGallery?.forEach((file) =>
    formData.append("productGallery", file)
  );

  files?.productImageUrl?.forEach((file) =>
    formData.append("productImageUrl", file)
  );

  /* ---------- API ---------- */
  const res = await API.put(`/accessorize/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return res.data.product;
};
