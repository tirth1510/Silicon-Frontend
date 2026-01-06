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
import { PRODUCT_SCHEMES, ProductallSchemeKey } from "./schemes";
import { getAllModelsWithProductInfo } from "@/services/model.api";

import {
  addProductSchemeService,
  updateProductSchemeService,
} from "@/services/sell.api";

import { ModelWithProductDTO } from "@/types/model";

export default function ModelsTable() {
  const [models, setModels] = useState<ModelWithProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  const [openSellDialog, setOpenSellDialog] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<ModelWithProductDTO | null>(null);
  const [selectedScheme, setSelectedScheme] = useState<
    ProductallSchemeKey | ""
  >("");

  const fetchData = async () => {
    try {
      const data = await getAllModelsWithProductInfo();
      setModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;

  const handleSchemeSelect = async (schemeKey: ProductallSchemeKey) => {
    if (!selectedModel) return;

    try {
      // first set all schemes to false
      for (const scheme of PRODUCT_SCHEMES) {
        await updateProductSchemeService(
          selectedModel.productId,
          selectedModel.modelId,
          scheme.key
        );
      }

      // then set the selected scheme to true
      await addProductSchemeService(
        selectedModel.productId,
        selectedModel.modelId,
        schemeKey
      );

      setSelectedScheme(schemeKey);
      fetchData();
      setOpenSellDialog(false);
    } catch (error: any) {
      alert(error.message || "Failed to update sell option");
    }
  };

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Sr. No</TableHead>
            <TableHead>Image</TableHead>
            <TableHead>Product Name</TableHead>
            <TableHead>Model Name</TableHead>
            <TableHead>Price</TableHead>
            <TableHead>Stock</TableHead>
            <TableHead>Sell Options</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {models.map((model, index) => (
            <TableRow key={model.modelId}>
              <TableCell>{index + 1}</TableCell>

              <TableCell>
                {model.productModelDetails?.colors?.[0]?.imageUrl ? (
                  <Image
                    src={model.productModelDetails.colors[0].imageUrl}
                    alt={model.productTitle}
                    width={50}
                    height={50}
                    className="rounded"
                  />
                ) : (
                  <div className="w-12 h-12 bg-gray-200 rounded" />
                )}
              </TableCell>

              <TableCell>{model.productTitle}</TableCell>
              <TableCell>{model.modelName}</TableCell>

              <TableCell>
                {model.productModelDetails?.colors?.[0]?.colorPrice?.[0]
                  ?.finalPrice
                  ? `${model.productModelDetails.colors[0].colorPrice[0].finalPrice}/-`
                  : "-"}
              </TableCell>

              <TableCell>
                {model.productModelDetails?.colors?.[0]?.stock ?? "-"}
              </TableCell>

              <TableCell>
                <Button
                  onClick={() => {
                    setSelectedModel(model);
                    setOpenSellDialog(true);

                    // automatically select the currently active scheme
                    const activeScheme = PRODUCT_SCHEMES.find(
                      (scheme) => model.productModelDetails?.schem?.[scheme.key]
                    );
                    setSelectedScheme(activeScheme?.key || "");
                  }}
                >
                  Add Sell
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ---------------- Add Sell Dialog ---------------- */}
      {selectedModel && (
        <Dialog open={openSellDialog} onOpenChange={setOpenSellDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Sell for {selectedModel.modelName}</DialogTitle>
            </DialogHeader>

            <div className="space-y-2 mt-4">
              {PRODUCT_SCHEMES.map((scheme) => (
                <div
                  key={scheme.key}
                  className="flex justify-between items-center p-2 border rounded"
                >
                  <div>
                    <p className="font-medium">{scheme.title}</p>
                    <p className="text-sm text-gray-500">
                      {scheme.description}
                    </p>
                  </div>

                  <input
                    type="radio"
                    name="scheme"
                    checked={selectedScheme === scheme.key}
                    onChange={() => handleSchemeSelect(scheme.key)}
                  />
                </div>
              ))}
            </div>
          </DialogContent>
        </Dialog>
      )}
    </>
  );
}
