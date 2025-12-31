/* ================== IMAGE ================== */
export interface ImageItem {
  url: string;
}

/* ================== PRICE ================== */
export interface ColorPrice {
  price: number;
  discount?: number;
  finalPrice?: number;
}

/* ================== COLOR ================== */
export interface ProductColor {
  colorName: string;
  imageUrl?: string;
  productImageUrl?: ImageItem[];
  productGallery?: ImageItem[];
  colorPrice?: ColorPrice[];
  stock?: number;
}

/* ================== SELL FLAGS ================== */
export interface ProductSellSchema {
  saleProduct?: boolean;
  tradingProduct?: boolean;
  companyProduct?: boolean;
  valuableProduct?: boolean;
  recommendedProduct?: boolean;
}

/* ================== MODEL DETAILS ================== */
export interface ProductModelDetails {
  colors?: ProductColor[];
  specifications?: { points: string }[];
  productSpecifications?: { key: string; value: string }[];
  productFeatures?: { key: string; value: string }[];
  productFeaturesIcons?: string[];
  warranty?: { points: string }[];
  schem?: ProductSellSchema;
}

/* ================== API ITEM ================== */
export interface SaleProductAPIItem {
  productId: string;
  productTitle: string;
  productCategory: string;
  modelId: string;
  modelName: string;
  status: "Live" | "Padding" | "Enquiry";
  productModelDetails?: ProductModelDetails | null;
}

/* ================== API RESPONSE ================== */
export interface SaleProductsResponse {
  success: boolean;
  count: number;
  data: SaleProductAPIItem[];
}

/* ================== UI NORMALIZED ================== */
export interface SaleProductUI {
  id: string;
  title: string;
  category: string;
  price: number;
  image: string;
}
