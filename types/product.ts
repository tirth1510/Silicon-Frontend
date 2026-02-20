/* ---------- IMAGE ---------- */
export interface ImageDTO {
  _id: string;
  url: string;
}

/* ---------- GENERIC API RESPONSE ---------- */
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error?: string;
}

/* ---------- PRICE ---------- */
export interface ProductPriceDTO {
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
}

/* ---------- COLOR ---------- */
export interface ColorDTO {
  _id: string;
  colorName: string;
  imageUrl: string;
  productImageUrl: ImageDTO[];
  productGallery: ImageDTO[];
  colorPrice: ProductPriceDTO[];
  stock: number;
  addtionalDetails: {
    key: string;
    value: string;
  }[];
}

/* ---------- COLOR PAYLOAD (for Step-3) ---------- */
export interface ColorVariantPayload {
  colorName: string;
  stock?: number;
  colorPrice?: { currency: string; price: number; discount: number }[];
  colorImage: File; // required
  productImages?: File[]; // optional
  galleryImages?: File[]; // optional
}

/* ---------- SELL FLAGS ---------- */
export interface ProductSellDTO {
  saleProduct: boolean;
  tradingProduct: boolean;
  companyProduct: boolean;
  valuableProduct: boolean;
  recommendedProduct: boolean;
}

/* ---------- MODEL DETAILS ---------- */
export interface ProductModelDetailsDTO {
  colors: ColorDTO[];

  specifications: { points: string }[];
  productSpecifications: { key: string; value: string }[];
  productFeatures: { key: string; value: string }[];
  productFeaturesIcons: string[];
  standardParameters: { iconName: "ECG" | "RESPIRATION" | "SPO2" | "NIBP" | "TEMP" | "PR" }[];
  optiomalParameters: { iconName: "ETCO2" | "IBP" }[];
  warranty: { points: string }[];
  schem: ProductSellDTO;
}

/* ---------- MODEL ---------- */
export interface ProductModelDTO {
  _id: string;
  modelName: string;
  status: "Padding" | "Live";
  productModelDetails: ProductModelDetailsDTO | null;
}

/* ---------- PRODUCT ---------- */
export interface ProductDTO {
  _id: string;
  productCategory: "1" | "2" | "3" | "4";
  productTitle: string;
  description: string;
  productModels: ProductModelDTO[];
  createdAt: string;
  updatedAt: string;
}

/* ---------- FRONTEND FORM PAYLOADS ---------- */
export interface CreateProductStep1Payload {
  productCategory: "1" | "2" | "3" | "4";
  productTitle: string;
  modelName: string;
}

export interface ProductModelDetailsPayload {
  specifications?: { points: string }[];
  productSpecifications?: { key: string; value: string }[];
  productFeatures?: { key: string; value: string }[];
  warranty?: { points: string }[];
}


export interface UpdateProductModelFeaturesPayload {
  productFeaturesIcons?: string[];
  standardParameters?: { iconName: string }[];
  optiomalParameters?: { iconName: string }[];
}


