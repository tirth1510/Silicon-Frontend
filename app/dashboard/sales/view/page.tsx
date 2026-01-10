/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-hooks/set-state-in-effect */
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ================= CONSTANTS ================= */
const TABLE_HEIGHT = "h-[600px]";
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


/* ================= COMPONENT ================= */
export default function ShopPage() {
  const [products, setProducts] = useState<ProductResponse[]>([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogData, setDialogData] = useState<ProductModelDetailsDTO | null>(
    null
  );
  const [selectedScheme, setSelectedScheme] = useState<ProductallSchemeKey | "all">("all");

  /* ================= FETCH ================= */
  useEffect(() => {
    (async () => {
      const data = await fetchProductsByallScheme(selectedScheme as ProductallSchemeKey );
      setProducts(data || []);
    })();
  }, []);

  /* ================= TABLE DATA ================= */
  const tableData: TableRow[] = useMemo(() => {
    const rows: TableRow[] = [];
    products.forEach((product) => {
      product.models.forEach((model) => {
        const schem = model.productModelDetails?.schem || {};
        
        const schemesToCheck = selectedScheme === "all" 
          ? PRODUCT_SCHEMES 
          : PRODUCT_SCHEMES.filter(s => s.key === selectedScheme);

        schemesToCheck.forEach((s) => {
          if (schem[s.key]) {
            rows.push({
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
    return rows;
  }, [products, selectedScheme]);

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

  return (
    <div className="px-10 pt-4">
      {/* Header & Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-2">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">
              Sales Performance
            </span>
          </div>
          <h1 className="text-4xl font-bold text-blue-900">Sales Overview</h1>
        </div>
        <div className="w-full sm:w-[250px]">
          <Select value={selectedScheme} onValueChange={(value) => setSelectedScheme(value as ProductallSchemeKey | "all")}>
            <SelectTrigger className="border-blue-200 focus:ring-blue-900 bg-white">
              <SelectValue placeholder="Filter by Scheme" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Schemes</SelectItem>
              {PRODUCT_SCHEMES.map((s) => (
                <SelectItem key={s.key} value={s.key}>
                  {s.title}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Single Table */}
      <div className="border border-blue-900 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className={`flex-1 overflow-y-auto ${TABLE_HEIGHT} scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-transparent`}>
          <Table>
            <TableHeader className="bg-blue-900 sticky top-0 z-10">
              <TableRow className="hover:bg-blue-900 border-none">
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Product</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Model</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Category</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Price</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Sales</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">View</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Remove</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {tableData.map((row, index) => (
                <TableRow key={`${row.modelId}-${row.schemeKey}-${index}`} className={`${ROW_HEIGHT} border-b border-gray-100 hover:bg-blue-50/50 transition-colors`}>
                  <TableCell className="text-center font-medium text-gray-900">
                    {row.productTitle}
                  </TableCell>
                  <TableCell className="text-center text-gray-600">{row.modelName}</TableCell>
                  <TableCell className="text-center text-gray-600">{row.category}</TableCell>
                  <TableCell className="text-center font-bold text-blue-900">
                    ₹{row.price.toLocaleString("en-IN")}
                  </TableCell>
                  <TableCell className="text-center">
                    <span
                      className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-100"
                    >
                      {row.schemeKey ? row.schemeKey : "No Scheme"}
                    </span>
                  </TableCell>

                  <TableCell className="text-center">
                    <button
                      className="bg-white border border-blue-200 text-blue-700 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-blue-50 transition-colors"
                      onClick={() => {
                        setDialogData(row.details);
                        setOpenDialog(true);
                      }}
                    >
                      View
                    </button>
                  </TableCell>
                  <TableCell className="text-center">
                    <button
                      className="bg-white border border-red-200 text-red-600 px-4 py-1.5 rounded-lg text-xs font-medium hover:bg-red-50 transition-colors"
                      onClick={() =>
                        handleRemove(row.productId, row.modelId, row.schemeKey as ProductallSchemeKey)
                      }
                    >
                      Remove
                    </button>
                  </TableCell>
                </TableRow>
              ))}
              {tableData.length === 0 && (
                <TableRow className={`${ROW_HEIGHT}`}>
                  <TableCell colSpan={7} className="text-center py-10 text-gray-500">
                    No products found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      <ModelDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={dialogData}
      />
    </div>
  );
}
