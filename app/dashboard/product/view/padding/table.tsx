/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useCallback } from "react";

// Services
import {
  getPaddingModelsWithProductInfo,
  goLiveModelService, // 🔴 YOU MUST CREATE THIS
} from "@/services/model.api";

// Types
import { ModelWithProductDTO, ProductModelDetailsDTO } from "@/types/model";

// ShadCN UI
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

// Dialog
import { ModelDetailsDialog } from "./modelDetailsCard";

export default function ModelsPage() {
  const [data, setData] = useState<ModelWithProductDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProductModelDetailsDTO | null>(null);

  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  // ✅ Fetch function (reusable)
  const fetchModels = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getPaddingModelsWithProductInfo();
      setData(res);
    } finally {
      setLoading(false);
    }
  }, []);

  // ✅ Initial fetch + auto refresh
  useEffect(() => {
    fetchModels();
  }, [fetchModels]);

  // ✅ Go Live handler
  const handleGoLive = async (productId: string, modelId: string) => {
    try {
      setActionLoadingId(modelId);

      await goLiveModelService(productId, modelId, "Live"); // ✅ correct API call

      await fetchModels();
    } catch (error: any) {
      console.error(error.message || "Failed to go live");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">Padding Products & Models</h1>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>S.No.</TableHead>
            <TableHead>Colors</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
            <TableHead>Go Live</TableHead> {/* 🆕 */}
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            // ✅ Table Loader
            [...Array(5)].map((_, i) => (
              <TableRow key={i}>
                {Array.from({ length: 7 }).map((__, idx) => (
                  <TableCell key={idx}>
                    <Skeleton className="h-5 w-full" />
                  </TableCell>
                ))}
              </TableRow>
            ))
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">
                No models found
              </TableCell>
            </TableRow>
          ) : (
            data.map((model, index) => (
              <TableRow key={model.modelId}>
                <TableCell>{index + 1}</TableCell>

                <TableCell>
                  <div className="flex gap-2">
                    {model.productModelDetails?.colors?.map((color) => (
                      <img
                        key={color.colorName}
                        src={color.imageUrl}
                        alt={color.colorName}
                        className="w-8 h-8 rounded border"
                      />
                    ))}
                    {!model.productModelDetails?.colors?.length && (
                      <span className="text-muted-foreground">No Colors</span>
                    )}
                  </div>
                </TableCell>

                <TableCell>{model.productTitle}</TableCell>
                <TableCell>{model.modelName}</TableCell>

                <TableCell>
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${
                      model.status === "Live"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {model.status}
                  </span>
                </TableCell>

                <TableCell>
                  <Button
                    size="sm"
                    onClick={() => {
                      setSelected(model.productModelDetails);
                      setOpen(true);
                    }}
                    disabled={!model.productModelDetails}
                  >
                    View Details
                  </Button>
                </TableCell>

                {/* 🔥 GO LIVE COLUMN */}
                <TableCell>
                  <Button
                    size="sm"
                    disabled={
                      model.status === "Live" ||
                      actionLoadingId === model.modelId
                    }
                    onClick={() => handleGoLive(model.productId, model.modelId)}
                  >
                    {actionLoadingId === model.modelId
                      ? "Publishing..."
                      : "Go Live"}
                  </Button>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>

      <ModelDetailsDialog
        open={open}
        onClose={() => setOpen(false)}
        data={selected}
      />
    </>
  );
}
