export interface ImageDTO {
  url: string;
}

export interface ColorPriceDTO {
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
}

export interface ColorDTO {
  colorName: string;
  imageUrl: string;
  productImageUrl: ImageDTO[];
  productGallery: ImageDTO[];
  colorPrice: ColorPriceDTO[];
  stock: number;
}

export interface ProductSellDTO {
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
  productId: string;
  productTitle: string;
  productCategory: string;
  modelId: string;
  modelName: string;
  status: "Padding" | "Live" | "Enquiry";
  productModelDetails: ProductModelDetailsDTO | null;
}
