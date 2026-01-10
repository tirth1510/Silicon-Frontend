export const PRODUCT_SCHEMES = [
  {
    key: "tradingProduct",
    title: "Trading Products",
    description: "Products available for trading purposes",
  },
  {
    key: "saleProduct",
    title: "Sale Products",
    description: "Products available for sale",
  },
  {
    key: "recommendedProduct",
    title: "Recommended Products",
    description: "Top recommended products by experts",
  },
  {
    key: "companyProduct",
    title: "High Selling Products",
    description: "Official company-owned products",
  },
  {
    key: "valuableProduct",
    title: "Valuable Products",
    description: "High-value and premium products",
  },
  
] as const;

export type ProductallSchemeKey = (typeof PRODUCT_SCHEMES)[number]["key"];


