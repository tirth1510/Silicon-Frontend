import { Key } from "react";

export interface ImageDTO {
  _id: string;
  url: string;
}

export interface ColorPriceDTO {
  _id: string;
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
}

export interface ColorDTO {
  _id: string;
  colorName: string;
  imageUrl: string;
  productImageUrl: ImageDTO[];
  productGallery: ImageDTO[];
  colorPrice: ColorPriceDTO[];
  stock: number;
}

export type ProductallSchemeKey =
  | "all"
  | "saleProduct"
  | "tradingProduct"
  | "companyProduct"
  | "valuableProduct"
  | "recommendedProduct";

export interface ProductSellDTO {
  all: boolean;
  saleProduct: boolean;
  tradingProduct: boolean;
  companyProduct: boolean;
  valuableProduct: boolean;
  recommendedProduct: boolean;
}

export interface ProductModelDetailsDTO {
  specifications: { points: string }[];
  productSpecifications: { key: string; value: string }[];
  productFeatures: { key: string; value: string }[];
  productFeaturesIcons: string[];
  warranty: { points: string }[];
  schem: ProductSellDTO;
  colors: ColorDTO[];
  standardParameters: { iconName: string }[];
  optiomalParameters: { iconName: string }[];
}

export interface ModelWithProductDTO {
  _id: string;
  productId: string;
  productTitle: string;
  productDescription?: string;
  productCategory: string;
  modelId: string;
  modelName: string;
  status: "Padding" | "Live" | "Enquiry";
  productModelDetails: ProductModelDetailsDTO | null;
}
