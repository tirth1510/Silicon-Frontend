/* eslint-disable @typescript-eslint/no-explicit-any */
export type Product = {
  description: any;
  priceDetails: any;
  _id(_id: any, payload: any, files: any): unknown; // keep as-is for now
  id: string;
  productTitle: string;
  productCategory: string;
  stock?: number;
  status: string;
  price: number;
  discount?: number;
  finalPrice?: number;

  // IMAGE DATA
  productImages?: { url: string }[];
  galleryImages?: { url: string }[];

  // TEXT / POINTS DATA
  specifications?: { points?: string }[];
  productSpecifications?: { key?: string; value?: string }[];
  warranty?: { points?: string }[];
};

export type Point = { points: string; _id: string };
export type ImageObj = { url: string };
export type PriceDetails = {
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
};

export type AccessoryApiResponse = {
  _id: string;
  productTitle: string;
  productCategory: string;
  description: string;
  priceDetails: PriceDetails;
  stock: number;
  productImageUrl: ImageObj[];
  productGallery: ImageObj[];
  specifications: Point[];
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

export type AccessorySection =
  | "basic"
  | "priceDetails"
  | "productImageUrl"
  | "productGallery"
  | "specifications"
  | "productSpecifications"
  | "warranty";
