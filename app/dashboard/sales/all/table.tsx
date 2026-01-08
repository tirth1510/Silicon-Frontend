/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

import { PRODUCT_SCHEMES, ProductallSchemeKey } from "./schemes";
import { getAllModelsWithProductInfo } from "@/services/model.api";
import {
  addProductSchemeService,
  updateProductSchemeService,
} from "@/services/sell.api";
import { ModelWithProductDTO } from "@/types/model";
import { Sparkles } from "lucide-react";

const ITEMS_PER_PAGE = 9;

export default function ModelsTable() {
  const [models, setModels] = useState<ModelWithProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<ModelWithProductDTO | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<
    ProductallSchemeKey | ""
  >("");

  const [currentPage, setCurrentPage] = useState(1);

  const fetchData = async () => {
    try {
      const data = await getAllModelsWithProductInfo();
      setModels(data);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div className="py-10 text-center">Loading...</div>;

  const totalPages = Math.ceil(models.length / ITEMS_PER_PAGE);

  const paginatedModels = models.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSchemeSelect = async (schemeKey: ProductallSchemeKey) => {
    if (!selectedModel) return;

    try {
      for (const scheme of PRODUCT_SCHEMES) {
        await updateProductSchemeService(
          selectedModel.productId,
          selectedModel.modelId,
          scheme.key
        );
      }

      await addProductSchemeService(
        selectedModel.productId,
        selectedModel.modelId,
        schemeKey
      );

      setSelectedScheme(schemeKey);
      setOpenSellDialog(false);
      fetchData();
    } catch (error: any) {
      alert(error.message || "Failed to update sell option");
    }
  };

  return (
    <div className="px-10 pt-4">
      <div className="flex justify-between items-center mb-6 ">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-2">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">
              Curated Selection
            </span>
          </div>
          <h2 className="text-4xl font-bold text-blue-900">
            Sales Product Add
          </h2>
        </div>
      </div>
      <div className="border border-blue-900 rounded-xl overflow-hidden">
        <Table>
          <TableHeader className="bg-blue-900">
            <TableRow>
              {[
                "Sr.",
                "Image",
                "Product",
                "Model",
                "Price",
                "Stock",
                "Action",
              ].map((head) => (
                <TableHead
                  key={head}
                  className="text-white font-bold text-sm uppercase tracking-wide text-center"
                >
                  {head}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>

         <TableBody>
  {paginatedModels.map((model, index) => (
    <TableRow
      key={model.modelId}
      className="border-b border-gray-200 hover:bg-gray-50 transition"
    >
      {/* Index */}
      <TableCell className="py-4 text-center text-gray-600 text-sm">
        {(currentPage - 1) * ITEMS_PER_PAGE + index + 1}
      </TableCell>

      {/* Image */}
      <TableCell className="py-2">
        <div className="flex justify-center">
          {model.productModelDetails?.colors?.[0]?.imageUrl ? (
            <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 hover:border-blue-500 transition-all duration-300 shadow-sm group">
              <Image
                src={model.productModelDetails.colors[0].imageUrl}
                alt={model.productTitle}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="56px"
              />
            </div>
          ) : (
            <div className="w-14 h-14 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
              <span className="text-[10px] text-gray-400 font-medium">No Image</span>
            </div>
          )}
        </div>
      </TableCell>

      {/* Product Name (WIDTH REDUCED) */}
      <TableCell className="py-4 text-center">
        <div className="max-w-[160px] mx-auto font-semibold text-gray-900 text-sm truncate">
          {model.productTitle}
        </div>
      </TableCell>

      {/* Model Name */}
      <TableCell className="py-4 text-center text-gray-700">
        {model.modelName}
      </TableCell>

      {/* Price */}
      <TableCell className="py-4 text-center font-medium text-gray-800">
        {model.productModelDetails?.colors?.[0]?.colorPrice?.[0]?.finalPrice
          ? `₹${model.productModelDetails.colors[0].colorPrice[0].finalPrice}`
          : "-"}
      </TableCell>

      {/* Stock */}
      <TableCell className="py-4 text-center text-gray-600">
        {model.productModelDetails?.colors?.[0]?.stock ?? "-"}
      </TableCell>

      {/* Action */}
      <TableCell className="py-4">
        <div className="flex justify-center">
          <Button
            variant="outline"
            className="border-gray-400 text-gray-700 bg-white hover:bg-gray-800 hover:text-white text-xs px-4 py-2"
            onClick={() => {
              setSelectedModel(model);
              setOpenSellDialog(true);

              const activeScheme = PRODUCT_SCHEMES.find(
                (scheme) =>
                  model.productModelDetails?.schem?.[scheme.key]
              );
              setSelectedScheme(activeScheme?.key || "");
            }}
          >
            Add Sell
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

        </Table>

        {/* ================= PAGINATION ================= */}
        <div className="py-4 ">
          {totalPages > 1 && (
          <Pagination className="mt-6">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                />
              </PaginationItem>

              {[...Array(totalPages)].map((_, i) => (
                <PaginationItem key={i}>
                  <PaginationLink
                    isActive={currentPage === i + 1}
                    onClick={() => setCurrentPage(i + 1)}
                  >
                    {i + 1}
                  </PaginationLink>
                </PaginationItem>
              ))}

              <PaginationItem>
                <PaginationNext
                  onClick={() =>
                    setCurrentPage((p) => Math.min(p + 1, totalPages))
                  }
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        )}
        </div>
      </div>

      {/* ================= DIALOG ================= */}
      {selectedModel && (
        <Dialog open={openSellDialog} onOpenChange={setOpenSellDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle className="text-blue-900 font-bold">
                Add Sell for {selectedModel.modelName}
              </DialogTitle>
            </DialogHeader>

            <div className="space-y-3 mt-4">
              {PRODUCT_SCHEMES.map((scheme) => (
                <label
                  key={scheme.key}
                  className="flex justify-between items-center p-3 border rounded-lg hover:bg-blue-50 cursor-pointer"
                >
                  <div>
                    <p className="font-semibold">{scheme.title}</p>
                    <p className="text-xs text-gray-500">
                      {scheme.description}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="scheme"
                    checked={selectedScheme === scheme.key}
                    onChange={() => handleSchemeSelect(scheme.key)}
                  />
                </label>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
