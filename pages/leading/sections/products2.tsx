/* eslint-disable react-hooks/purity */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ShoppingBag, Eye, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

/* ---------- TYPES ---------- */
type ColorPrice = {
  currency: string;
  price: number;
  discount: number;
  finalPrice: number;
};

type Color = {
  colorName: string;
  imageUrl?: string;
  productImageUrl?: { url: string; }[];
  colorPrice?: ColorPrice[];
  stock?: number;
};

type ProductModelDetails = {
  colors: Color[];
};

type ProductFromAPI = {
  _id: string;
  modelId: string;
  productTitle: string;
  modelName: string;
  productCategory: string;
  productModelDetails?: ProductModelDetails;
};

type ProductForList = {
  id: string;
  modelId: string;
  title: string;
  modelName: string;
  category: string;
  price: number;
  originalPrice: number;
  discount: number;
  image: string;
};

/* ---------- COMPONENT ---------- */
export default function ShopPage() {
  const router = useRouter();

  const [products, setProducts] = useState<ProductForList[]>([]);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const WHATSAPP_NUMBER = "918160496588"; // with country code

  // Static fallback image when API doesn't provide one
  const FALLBACK_IMAGE = "https://t4.ftcdn.net/jpg/02/60/04/09/360_F_260040900_oO6YW1sHTnKxby4GcjCvtypUCWjnQRg5.jpg";

  /* ---------- FETCH PRODUCTS ---------- */
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("http://localhost:5000/api/demo/products-with-models");

        if (!res.ok) {
          console.error(`API Error: ${res.status} ${res.statusText}`);
          return;
        }

        const data = await res.json();

        if (data.success && Array.isArray(data.data)) {
          const mapped = data.data.map((product: ProductFromAPI) => {
            // Get first color from productModelDetails
            const firstColor = product.productModelDetails?.colors?.[0];
            const priceInfo = firstColor?.colorPrice?.[0];

            return {
              id: product._id,
              modelId: product.modelId,
              title: product.productTitle,
              modelName: product.modelName,
              category: product.productCategory,
              price: priceInfo?.finalPrice || 0,
              originalPrice: priceInfo?.price || 0,
              discount: priceInfo?.discount || 0,
              image: firstColor?.imageUrl ||
                firstColor?.productImageUrl?.[0]?.url ||
                FALLBACK_IMAGE,
            };
          });

          setProducts(mapped);
        } else {
          console.error("Invalid API response format:", data);
        }
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, []);

  /* ---------- WHATSAPP SEND ---------- */
  const sendWhatsApp = () => {
    if (!selectedProduct) return;

    const message = `
Hello Meditech,

Client Name: ${form.name}
Address: ${form.address}

Product Model: ${selectedProduct.modelName}
Product Image: ${selectedProduct.image}
    `;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
    setOpen(false);
  };

  // Show only 8 random products - memoized so it only shuffles once when products are loaded
  const visibleProducts = useMemo(() => {
    return products
      .sort(() => Math.random() - 0.5)
      .slice(0, 8);
  }, [products.length]); // Only re-shuffle when products array length changes (i.e., when data is first loaded)

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`,
            backgroundSize: '40px 40px'
          }}>
        </div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-5 border border-blue-100">
            <ShoppingBag className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">Featured Collection</span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Premium Products
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore our carefully curated selection of high-quality medical equipment
          </p>
        </div>

        {/* ---------- PRODUCT GRID ---------- */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {visibleProducts.map((product, index) => (
            <div
              key={`${product.id}-${index}`}
              className="group bg-white rounded-xl overflow-hidden border border-gray-200 
                         hover:border-blue-900 hover:shadow-lg transition-all duration-300"
            >
              {/* Image Section */}
              <div className="relative h-48 bg-gray-50 overflow-hidden">
                <Image
                  src={product.image || FALLBACK_IMAGE}
                  alt={product.title}
                  fill
                  unoptimized
                  className="object-contain p-2 group-hover:scale-110 transition-transform duration-300"
                />

                {/* Category Badge */}
                <div className="absolute top-2 left-2">
                  <span className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white bg-blue-900 
                                 rounded-md shadow-md">
                    {product.category}
                  </span>
                </div>

                {/* Discount Badge */}
                {product.discount > 0 && (
                  <div className="absolute top-2 right-2">
                    <span className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white bg-red-600 
                                   rounded-md shadow-md">
                      {product.discount}% OFF
                    </span>
                  </div>
                )}
              </div>

              {/* Content Section */}
              <div className="p-4">
                {/* Model Name */}
                <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 h-10">
                  {product.modelName}
                </h3>

               
                {/* Action Buttons */}
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/products/${product.modelId}`)}
                    className="flex-1 px-3 py-2 bg-blue-900 text-white text-xs font-semibold rounded-lg
                             hover:bg-blue-800 transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>View</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedProduct(product);
                      setOpen(true);
                    }}
                    className="flex-1 px-3 py-2 border-2 border-blue-900 text-blue-900 text-xs font-semibold rounded-lg
                             hover:bg-blue-900 hover:text-white transition-all duration-200 flex items-center justify-center gap-1.5"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>Contact</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More Products Button */}
        {products.length > 8 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push('/products')}
              className="inline-flex items-center gap-2 px-8 py-4 
                         bg-blue-900 text-white font-semibold rounded-xl 
                         hover:bg-blue-800 transition-all duration-300 
                         shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View More Products</span>
            </Button>
          </div>
        )}
      </div>

      {/* ---------- CONTACT DIALOG ---------- */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-md rounded-xl border border-gray-200 shadow-xl">
          <DialogHeader className="pb-4">
            <DialogTitle className="text-2xl font-bold text-blue-900">
              Product Enquiry
            </DialogTitle>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-4">
              {/* Product Info */}
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <p className="text-sm text-gray-600 mb-1">Product Model</p>
                <p className="font-bold text-blue-900">{selectedProduct.modelName}</p>
                <div className="mt-2">
                  <div className="flex items-center gap-2">
                    <p className="text-xl font-bold text-blue-900">
                      ₹{selectedProduct.price.toLocaleString("en-IN")}
                    </p>
                    {selectedProduct.discount > 0 && (
                      <span className="text-xs bg-red-600 text-white px-2 py-0.5 rounded-full font-semibold">
                        {selectedProduct.discount}% OFF
                      </span>
                    )}
                  </div>
                  {selectedProduct.discount > 0 && (
                    <>
                      <p className="text-sm text-gray-500 line-through">
                        ₹{selectedProduct.originalPrice.toLocaleString("en-IN")}
                      </p>
                      <p className="text-xs text-green-700 font-semibold">
                        You save ₹{(selectedProduct.originalPrice - selectedProduct.price).toLocaleString("en-IN")}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-3">
                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Name
                  </label>
                  <Input
                    placeholder="Your name"
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="border-gray-300 focus:border-blue-900"
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-gray-700 mb-1.5 block">
                    Address
                  </label>
                  <Textarea
                    placeholder="Your address"
                    rows={3}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    className="border-gray-300 focus:border-blue-900 resize-none"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col gap-2 pt-2">
                <Button
                  onClick={sendWhatsApp}
                  className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-5 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                  </svg>
                  Send on WhatsApp
                </Button>

                <Button
                  variant="outline"
                  onClick={() => setOpen(false)}
                  className="w-full border-2 border-gray-300 hover:border-blue-900 hover:bg-blue-50 text-gray-700 hover:text-blue-900 font-semibold py-5 rounded-lg transition-all duration-200"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
