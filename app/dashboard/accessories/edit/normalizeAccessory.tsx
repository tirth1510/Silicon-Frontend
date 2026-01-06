import { AccessoryApiResponse, Product } from "@/types/accessory";

export const normalizeAccessory = (api: AccessoryApiResponse): Product => ({
    id: api.id ?? api._id ?? "",
    productTitle: api.productTitle ?? "",
    productCategory: api.productCategory ?? "",
    description: api.description ?? "",
    status: api.status ?? "inactive",
    priceDetails: api.priceDetails ?? { currency: "USD", amount: 0 },
    stock: api.stock ?? 0,
    productImageUrl: api.productImageUrl ?? [],
    productGallery: api.productGallery ?? [],
    specifications: api.specifications ?? [],
    warranty: api.warranty ?? [],
    productSpecifications: api.productSpecifications ?? [],
    createdAt: api.createdAt ?? new Date().toISOString(),
    updatedAt: api.updatedAt ?? new Date().toISOString(),
    price: 0
});
