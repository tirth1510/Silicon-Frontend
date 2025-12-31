"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { getAccessoryByIdService } from "@/services/accessory.service";

type Point = {
  points: string;
  _id: string;
};

type ImageObj = { url: string };

type Product = {
  _id: string;
  productTitle: string;
  productCategory: string;
  description: string;
  priceDetails: {
    currency: string;
    price: number;
    discount: number;
    finalPrice: number;
  };
  stock: number;
  productImageUrl: ImageObj[];
  productGallery: ImageObj[];
  specifications: Point[];
  warranty: Point[];
};

export default function AccessoryDetailsPage() {
  const params = useParams();
  const id = params?.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const data = await getAccessoryByIdService(id);
        setProduct(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) return <p>Loading...</p>;
  if (!product) return <p>Product not found.</p>;

  return (
    <div className="max-w-[1200px] min-h-154 mx-auto px-4 py-10">
      <div className="grid md:grid-cols-2 gap-10">
        <Image
          src={product.productImageUrl?.[0]?.url ?? "/placeholder.png"}
          alt={product.productTitle}
          width={500}
          height={400}
          className="object-contain"
        />

        <div>
          <h1 className="text-3xl font-bold mb-4">{product.productTitle}</h1>
          <p className="text-xl font-bold text-blue-900 mb-4">
            ₹ {product.priceDetails.finalPrice.toLocaleString("en-IN")}
          </p>
          <p className="text-gray-700 mb-4">{product.description}</p>

          {product.specifications?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Specifications</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {product.specifications.map((s) => (
                  <li key={s._id}>{s.points}</li>
                ))}
              </ul>
            </div>
          )}

          {product.warranty?.length > 0 && (
            <div className="mb-4">
              <h3 className="font-semibold mb-2">Warranty</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {product.warranty.map((w) => (
                  <li key={w._id}>{w.points}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
