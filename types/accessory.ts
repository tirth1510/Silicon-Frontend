import {
  CreateProductPayload,
  CreateProductFiles,
} from "@/services/accessory.service";
import { Value } from "@radix-ui/react-select";

/* eslint-disable @typescript-eslint/no-explicit-any */
export type TextBlock = {
  _id: string;
  points: string[];
};

export type Product = {
  productImageUrl: any;
  productGallery: any;
  description: any;
  priceDetails: any;
  id: string;
  productTitle: string;
  productCategory: string;
  stock?: number;
  status: string;
  price: number;
  discount?: number;
  finalPrice?: number;

  // ✅ ADD THESE HERE (IMAGE DATA)
  productImages?: { url: string }[];
  galleryImages?: { url: string }[];

  // ✅ TEXT / POINTS DATA
  specifications?: { points?: string }[];
  productSpecifications?: { key?: string; value?: string }[];
  warranty?: { points?: string }[];
   createdAt: string;
  updatedAt: string;
};

// -------------------- TYPES --------------------
export type Point = {
  points: string;
  _id: string;
};

export type ImageObj = {
  url: string;
};

export type PriceDetails = {
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
};
export type productSpecifications = {
  key: string;
  value: string;
};
export type AccessoryApiResponse = {
  status: any;
  id: string;
  _id: string;
  productTitle: string;
  productCategory: string;
  description: string;
  priceDetails: PriceDetails;
  stock: number;
  productImageUrl: ImageObj[];
  productGallery: ImageObj[];
  specifications: Point[];
  productSpecifications: productSpecifications[];
  warranty: Point[];
  createdAt: string;
  updatedAt: string;
  __v: number;
};

export type SingleAccessoryResponse = {
  success: boolean;
  data: AccessoryApiResponse;
};

export type FilterType =
  | "ALL"
  | "LOW_TO_HIGH"
  | "HIGH_SELL"
  | "RECOMMENDED"
  | "VALUABLE";
