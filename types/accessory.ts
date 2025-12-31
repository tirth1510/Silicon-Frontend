export type TextBlock = {
  _id: string;
  points: string[];
};

export type Product = {
  id: string;
  productTitle: string;
  productCategory: string;
  stock?: number;

  price: number;
  discount?: number;
  finalPrice?: number;

  productImages?: { url: string }[];

  soldCount?: number;
  isRecommended?: boolean;

  description?: TextBlock;
  specifications?: TextBlock;
  warranty?: TextBlock;
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
