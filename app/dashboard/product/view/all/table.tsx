"use client";

import { useEffect, useState, useRef } from "react";
import {
  getAllModelsWithProductInfo,
  goLiveModelService,
} from "@/services/model.api";
import { ModelWithProductDTO, ProductModelDetailsDTO } from "@/types/model";

import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner"; // assuming you have a Spinner component

import { ModelDetailsDialog } from "./modelDetailsCard";

export default function ModelsPage() {
  const [data, setData] = useState<ModelWithProductDTO[]>([]);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ProductModelDetailsDTO | null>(null);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Prevent duplicate API calls in React Strict Mode
  const hasFetchedRef = useRef(false);

  const fetchModels = async () => {
    try {
      setLoading(true);
      const res = await getAllModelsWithProductInfo();
      setData(res);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't already fetched
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchModels();
    }
  }, []);

  const handleEnquiry = async (productId: string, modelId: string) => {
    try {
      setActionLoadingId(modelId);
      await goLiveModelService(productId, modelId, "Enquiry");
      await fetchModels(); // instant refresh
    } catch (err) {
      console.error(err);
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <>
      <h1 className="text-2xl font-bold mb-4">All Products & Models</h1>

      <Table>
        <TableHeader>
          <TableRow className="bg-gray-50">
            <TableHead>S.No.</TableHead>
            <TableHead>Colors</TableHead>
            <TableHead>Product</TableHead>
            <TableHead>Model</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10">
                <Spinner />
              </TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={6} className="text-center py-10 text-muted-foreground">
                No models found
              </TableCell>
            </TableRow>
          ) : (
            data.map((model, index) => (
              <TableRow key={model.modelId} className="hover:bg-gray-50">
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
                    className={`px-2 py-1 rounded text-xs font-medium
                      ${model.status === "Live" && "bg-green-100 text-green-700"}
                      ${model.status === "Padding" && "bg-yellow-100 text-yellow-700"}
                      ${model.status === "Enquiry" && "bg-blue-100 text-blue-700"}
                    `}
                  >
                    {model.status}
                  </span>
                </TableCell>

                <TableCell className="flex gap-2 justify-end">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => {
                      setSelected(model.productModelDetails);
                      setOpen(true);
                    }}
                    disabled={!model.productModelDetails}
                  >
                    View
                  </Button>

                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleEnquiry(model.productId, model.modelId)}
                      disabled={actionLoadingId === model.modelId}
                    >
                      {actionLoadingId === model.modelId ? "Updating..." : "Enquiry"}
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
