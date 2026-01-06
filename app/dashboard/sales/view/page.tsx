/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useMemo, useState } from "react";
import { Sparkles } from "lucide-react";

import { PRODUCT_SCHEMES, ProductallSchemeKey } from "./schemes";
import {
  fetchProductsByallScheme,
  updateProductSchemeService,
} from "@/services/sell.api";
import { ModelDetailsDialog } from "../../product/view/all/modelDetailsCard";
import { ProductModelDetailsDTO } from "@/types/model";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

/* ================= CONSTANTS ================= */
const ITEMS_PER_PAGE = 5;
const TABLE_HEIGHT = "h-[300px]";
const ROW_HEIGHT = "h-[50px]";

/* ================= TYPES ================= */
type ProductModel = {
  modelId: string;
  modelName: string;
  productModelDetails: ProductModelDetailsDTO;
};

type ProductResponse = {
  productId: string;
  productTitle: string;
  productCategory: string;
  models: ProductModel[];
};

type TableRow = {
  productId: string;
  productTitle: string;
  category: string;
  modelId: string;
  modelName: string;
  price: number;
  schemeKey: ProductallSchemeKey | null;
  schemeTitle: string;
  details: ProductModelDetailsDTO;
};

/* ================= SCHEME COLORS ================= */
const SCHEME_COLORS: Record<ProductallSchemeKey, string> = {
  saleProduct: "bg-red-100 text-red-800",
  tradingProduct: "bg-orange-100 text-orange-800",
  recommendedProduct: "bg-green-100 text-green-800",
  companyProduct: "bg-blue-100 text-blue-800",
  valuableProduct: "bg-purple-100 text-purple-800",
  all: "",
};

/* ================= COMPONENT ================= */
export default function ShopPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState<ProductModelDetailsDTO | null>(
    null
  );
  const [currentPages, setCurrentPages] = useState<Record<string, number>>({});

  /* ================= FETCH ================= */
  useEffect(() => {
    (async () => {
      const data = await fetchProductsByallScheme("all");
      setProducts(data || []);
    })();
  }, []);

  /* ================= TABLE DATA ================= */
  const tableDataByScheme: Record<ProductallSchemeKey, TableRow[]> =
    useMemo(() => {
      const map: Record<ProductallSchemeKey, TableRow[]> = {
        saleProduct: [],
        tradingProduct: [],
        recommendedProduct: [],
        companyProduct: [],
        valuableProduct: [],
        all: [],
      };

      products.forEach((product) => {
        product.models.forEach((model) => {
          const schem = model.productModelDetails?.schem || {};
          PRODUCT_SCHEMES.forEach((s) => {
            if (schem[s.key]) {
              map[s.key].push({
                productId: product.productId,
                productTitle: product.productTitle,
                category: product.productCategory,
                modelId: model.modelId,
                modelName: model.modelName,
                price:
                  model.productModelDetails?.colors?.[0]?.colorPrice?.[0]
                    ?.finalPrice || 0,
                schemeKey: s.key,
                schemeTitle: s.title,
                details: model.productModelDetails,
              });
            }
          });
        });
      });

      return map;
    }, [products]);

  /* ================= REMOVE ================= */
  const handleRemove = async (
    productId: string,
    modelId: string,
    schemeKey: ProductallSchemeKey
  ) => {
    const updatedSchem = await updateProductSchemeService(
      productId,
      modelId,
      schemeKey
    );

    setProducts((prev) =>
      prev.map((p) =>
        p.productId !== productId
          ? p
          : {
              ...p,
              models: p.models.map((m) =>
                m.modelId !== modelId
                  ? m
                  : {
                      ...m,
                      productModelDetails: {
                        ...m.productModelDetails,
                        schem: updatedSchem,
                      },
                    }
              ),
            }
      )
    );
  };

  /* ================= PAGINATION ================= */
  const paginateData = (schemeKey: ProductallSchemeKey) => {
    const page = currentPages[schemeKey] || 1;
    const rows = tableDataByScheme[schemeKey] || [];
    const totalPages = Math.ceil(rows.length / ITEMS_PER_PAGE);
    const paginated = rows.slice(
      (page - 1) * ITEMS_PER_PAGE,
      page * ITEMS_PER_PAGE
    );
    return { paginated, totalPages };
  };

  const setPage = (schemeKey: ProductallSchemeKey, page: number) => {
    setCurrentPages((prev) => ({ ...prev, [schemeKey]: page }));
  };

  /* ================= RENDER TABLE ================= */
  const renderTable = (schemeKey: ProductallSchemeKey) => {
    const { paginated, totalPages } = paginateData(schemeKey);

    return (
      <div className="border rounded-xl mb-6 flex flex-col">
        <h3 className="text-xl font-semibold px-4 py-2 bg-gray-50 border-b flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-blue-900" />
          {PRODUCT_SCHEMES.find((s) => s.key === schemeKey)?.title}
        </h3>

        <div className={`flex-1 overflow-y-auto ${TABLE_HEIGHT}`}>
          <table className="min-w-full table-fixed">
            <thead className="bg-blue-900 text-white sticky top-0">
              <tr>
                <th className="px-4 py-2 text-center">Product</th>
                <th className="px-4 py-2 text-center">Model</th>
                <th className="px-4 py-2 text-center">Category</th>
                <th className="px-4 py-2 text-center">Price</th>
                <th className="px-4 py-2 text-center">Sales</th>
                <th className="px-4 py-2 text-center">View</th>
                <th className="px-4 py-2 text-center">Remove</th>
              </tr>
            </thead>
            <tbody>
              {paginated.map((row) => (
                <tr key={row.modelId} className={`border-b ${ROW_HEIGHT}`}>
                  <td className="px-4 py-2 text-center truncate">
                    {row.productTitle}
                  </td>
                  <td className="px-4 py-2 text-center">{row.modelName}</td>
                  <td className="px-4 py-2 text-center">{row.category}</td>
                  <td className="px-4 py-2 text-center font-bold text-blue-900">
                    ₹{row.price.toLocaleString("en-IN")}
                  </td>
                  <td className="px-4 py-2 text-center font-bold">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        row.schemeKey
                          ? SCHEME_COLORS[row.schemeKey]
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {row.schemeKey ? row.schemeKey : "No Scheme"}
                    </span>
                  </td>

                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-blue-900 text-white px-3 py-1 rounded text-xs"
                      onClick={() => {
                        setDialogData(row.details);
                        setOpenDialog(true);
                      }}
                    >
                      View
                    </button>
                  </td>
                  <td className="px-4 py-2 text-center">
                    <button
                      className="bg-red-100 text-red-700 px-2 py-1 rounded text-xs"
                      onClick={() =>
                        handleRemove(row.productId, row.modelId, schemeKey)
                      }
                    >
                      Remove
                    </button>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr className={`${ROW_HEIGHT}`}>
                  <td colSpan={6} className="text-center py-10 text-gray-500">
                    No products in this scheme
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="py-2 border-t flex justify-center">
            <Pagination>
              <PaginationContent>
                <PaginationPrevious
                  onClick={() =>
                    setPage(
                      schemeKey,
                      Math.max(1, (currentPages[schemeKey] || 1) - 1)
                    )
                  }
                />
                {Array.from({ length: totalPages }).map((_, i) => (
                  <PaginationItem key={i}>
                    <PaginationLink
                      isActive={(currentPages[schemeKey] || 1) === i + 1}
                      onClick={() => setPage(schemeKey, i + 1)}
                    >
                      {i + 1}
                    </PaginationLink>
                  </PaginationItem>
                ))}
                <PaginationNext
                  onClick={() =>
                    setPage(
                      schemeKey,
                      Math.min(totalPages, (currentPages[schemeKey] || 1) + 1)
                    )
                  }
                />
              </PaginationContent>
            </Pagination>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-4">
      {PRODUCT_SCHEMES.map((s) => renderTable(s.key as ProductallSchemeKey))}

      <ModelDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={dialogData}
      />
    </div>
  );
}
