/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import axios from "axios";
import {
  ShoppingBag,
  Package,
  Eye,
  MessageCircle,
  Sparkles,
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { DialogTitle } from "@radix-ui/react-dialog";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

/* ---------- API TYPES ---------- */

type ProductColor = {
  name: string;
  images?: { url: string; }[];
};

type ProductFromAPI = {
  _id: string;
  productTitle: string;
  productCategory: string;
  priceDetails: {
    price: number;
    discount?: number;
    finalPrice?: number;
  };
  colors?: ProductColor[];
  productImages?: { url: string; }[];
};

type ProductsAPIResponse = {
  [x: string]: any;
  success: boolean;
  data: ProductFromAPI[];
};

/* ---------- UI TYPE ---------- */

type ProductForList = {
  id: string;
  productname: string;
  category: string;
  price: number;
  finalPrice: number;
  discount: number;
  productImage: string;
  color?: string;
};

/* ---------- UTILS ---------- */

const shuffleArray = <T,>(array: T[]): T[] =>
  [...array].sort(() => Math.random() - 0.5);

/* ---------- COMPONENT ---------- */

export default function ShopPage() {
  const router = useRouter();
  const [products, setProducts] = useState<ProductForList[]>([]);
  const [loading, setLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductForList | null>(
    null
  );

  const [form, setForm] = useState({
    name: "",
    address: "",
  });

  const WHATSAPP_NUMBER = "918160496588";

  const sendWhatsApp = () => {
    if (!selectedProduct) return;

    const message = `
Hello Meditech,

Client Name: ${form.name}
Address: ${form.address}

Product Name: ${selectedProduct.productname}
Product Image: ${selectedProduct.productImage}
    `;

    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      message
    )}`;

    window.open(url, "_blank");
    setOpen(false);
  };

  const visibleProducts = products;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get<ProductsAPIResponse>(
          "http://localhost:5000/api/accessorize/all",
          { timeout: 10000 }
        );

        if (!response.data.success) {
          throw new Error("API failed");
        }

        const mapped: ProductForList[] = response.data.products.flatMap(
          (product: {
            productImages: any;

            price: number;
            discount: number;
            finalPrice: number;

            colors: any[];
            _id: any;
            productTitle: any;
            productCategory: any;
          }) => {
            const price = product.price ?? 0;
            const discount = product.discount ?? 0;

            if (product.colors?.length) {
              return product.colors.map((color) => ({
                id: product._id,
                productname: product.productTitle,
                category: product.productCategory || "Accessories",
                price,
                finalPrice: product.finalPrice,
                discount,
                color: color.name,
                productImage:
                  product.productImages?.[0]?.url ??
                  "https://via.placeholder.com/400x400?text=No+Image",
              }));
            }

            return [
              {
                id: product._id,
                productname: product.productTitle,
                category: product.productCategory || "Accessories",
                price,
                finalPrice: product?.finalPrice,
                discount,
                productImage:
                  product.productImages?.[0]?.url ??
                  "https://via.placeholder.com/400x400?text=No+Image",
              },
            ];
          }
        );

        setProducts(mapped.slice(0, 8));
      } catch (error) {
        console.error("❌ API fetch error:", error);
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 font-medium">
            Loading accessories...
          </p>
        </div>
      </div>
    );
  }

  return (
    <section className="relative bg-white py-20 overflow-hidden">
      {/* Subtle Background Pattern */}
      <div className="absolute inset-0 opacity-[0.03]">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 2px 2px, rgb(30 58 138) 1px, transparent 0)`,
            backgroundSize: "40px 40px",
          }}
        ></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* SECTION HEADER */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-5 border border-blue-100">
            <Package className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">
              Essential Medical Accessories
            </span>
          </div>

          <h2 className="text-4xl sm:text-5xl font-bold text-blue-900 mb-4">
            Premium Accessories
          </h2>

          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Discover our comprehensive range of medical accessories and
            consumables for all your healthcare needs
          </p>
        </div>

        {/* No Products Message */}
        {products.length === 0 && !loading && (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-blue-50 mb-4">
              <Package className="w-10 h-10 text-blue-900" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              No Accessories Available
            </h3>
            <p className="text-gray-600 mb-6">
              Check back soon for new products
            </p>
            <Button
              onClick={() => router.push("/shop/products")}
              className="bg-blue-900 hover:bg-blue-800 text-white font-semibold px-6 py-2 rounded-lg"
            >
              Browse All Products
            </Button>
          </div>
        )}

        {/* PRODUCT GRID */}
        {products.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, index) => (
              <div
                key={`${product.id}-${index}`}
                className="group bg-white rounded-xl overflow-hidden border border-gray-200 
                                       hover:border-blue-900 hover:shadow-lg transition-all duration-300"
              >
                {/* Image Section */}
                <div className="relative h-48 bg-gray-50 overflow-hidden">
                  <Image
                    src={product.productImage}
                    alt={product.productname}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                  />

                  {/* Category Badge */}
                  <div className="absolute top-2 left-2">
                    <span
                      className="inline-block px-2.5 py-1 text-[10px] font-semibold text-white bg-blue-900 
                                               rounded-md shadow-md"
                    >
                      {product.category}
                    </span>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4">
                  {/* Title */}
                  <h3 className="text-sm font-bold text-gray-900 mb-2 line-clamp-2 h-10">
                    {product.productname}
                  </h3>

                  <p className="text-xl font-bold text-blue-900 mb-4">
                    ₹
                    {(product.finalPrice ?? product.price)?.toLocaleString(
                      "en-IN"
                    )}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <button
                      onClick={() =>
                        router.push(`/shop/products/${product.id}`)
                      }
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
        )}

        {/* View All Button */}
        {products.length > 0 && (
          <div className="text-center mt-12">
            <Button
              onClick={() => router.push("/shop/products")}
              className="inline-flex items-center gap-2 px-8 py-4 
                         bg-blue-900 text-white font-semibold rounded-xl 
                         hover:bg-blue-800 transition-all duration-300 
                         shadow-lg hover:shadow-xl hover:-translate-y-0.5"
            >
              <ShoppingBag className="w-5 h-5" />
              <span>View All Products</span>
            </Button>
          </div>
        )}
      </div>

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
                <p className="text-sm text-gray-600 mb-1">Product</p>
                <p className="font-bold text-blue-900">
                  {selectedProduct.productname}
                </p>
                <p className="text-xl font-bold text-blue-900 mt-2">
                  ₹{selectedProduct.price}
                </p>
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
                    onChange={(e) =>
                      setForm({ ...form, address: e.target.value })
                    }
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
                  <svg
                    className="w-5 h-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
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
