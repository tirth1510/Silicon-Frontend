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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal } from "lucide-react";

import {
  deleteModelService,
  getAllModelsWithProductInfo,
} from "@/services/model.api";
import { ModelWithProductDTO, ProductModelDetailsDTO } from "@/types/model";
import UpdateProductDialog from "./updateProductDilog";
import UpdateModelDialog from "./updateModeldetails";
import UpdateModelDetailsDialog, {
  ModelDetails,
} from "./updateModeldetailsdilog";
import { useRouter } from "next/navigation";
import UpdateColorDialog from "./updateColordetails";

export default function ModelsTable() {
  const [models, setModels] = useState<ModelWithProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  /* Product dialog */
  const [openProductDialog, setOpenProductDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] =
    useState<ModelWithProductDTO | null>(null);

  /* Model dialog */
  const [openModelDialog, setOpenModelDialog] = useState(false);
  const [selectedModel, setSelectedModel] =
    useState<ModelWithProductDTO | null>(null);

  /* Color dialog */
  const [openColorDialog, setOpenColorDialog] = useState(false);
  const [selectedColor, setSelectedColor] = useState<{
    colorId: string;
    colorData: any;
    productId: string;
    modelId: string;
  } | null>(null);

  /* Model Details dialog */
  const [openModelDetailsDialog, setOpenModelDetailsDialog] = useState(false);

  /* Color dialog */

  const router = useRouter();
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

  const mapToModelDetails = (
    details: ProductModelDetailsDTO
  ): ModelDetails => ({
    specifications: details.specifications,
    productSpecifications: details.productSpecifications,
    productFeatures: details.productFeatures,
    warranty: details.warranty,
  });

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
            <TableHead>Actions</TableHead>
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
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <MoreHorizontal />
                    </Button>
                  </DropdownMenuTrigger>

                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={() => {
                        router.push(
                          `/dashboard/product/add/model/${model.productId}`
                        );
                      }}
                    >
                      Add New Model
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedProduct(model);
                        setOpenProductDialog(true);
                      }}
                    >
                      Edit Product
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedModel(model);
                        setOpenModelDialog(true);
                      }}
                    >
                      Edit Model
                    </DropdownMenuItem>

                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedModel(model);
                        setOpenModelDetailsDialog(true);
                      }}
                    >
                      Edit Model Details
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={async () => {
                        const confirmDelete = confirm(
                          `Are you sure you want to delete the model "${model.modelName}"?`
                        );
                        if (!confirmDelete) return;

                        try {
                          await deleteModelService(
                            model.productId,
                            model.modelId
                          );
                          alert("Model deleted successfully");
                          fetchData();
                        } catch (error: any) {
                          alert(error.message || "Failed to delete model");
                        }
                      }}
                    >
                      Delete Model
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        const firstColor =
                          model.productModelDetails?.colors?.[0];

                        if (!firstColor) {
                          alert("No color found for this model");
                          return;
                        }

                        setSelectedColor({
                          colorId: firstColor._id, // 🔥 MUST be real colorId
                          colorData: firstColor,
                          productId: model.productId,
                          modelId: model.modelId,

                        });

                        setOpenColorDialog(true);
                      }}
                    >
                      Edit Color Details
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* ---------------- Update Product Dialog ---------------- */}
      {selectedProduct && (
        <UpdateProductDialog
          open={openProductDialog}
          onClose={() => setOpenProductDialog(false)}
          productId={selectedProduct.productId}
          defaultValues={{
            productTitle: selectedProduct.productTitle,
            productCategory: selectedProduct.productCategory ?? "",
            description: selectedProduct.productDescription,
          }}
          onSuccess={fetchData}
        />
      )}

      {/* ---------------- Update Model Dialog ---------------- */}
      {selectedModel && (
        <UpdateModelDialog
          open={openModelDialog}
          onClose={() => setOpenModelDialog(false)}
          productId={selectedModel.productId}
          modelId={selectedModel.modelId}
          defaultValues={{
            modelName: selectedModel.modelName,
            status: selectedModel.status,
          }}
          onSuccess={fetchData}
        />
      )}

      {/* ---------------- Update Model Details Dialog ---------------- */}
      {selectedModel && selectedModel.productModelDetails && (
        <UpdateModelDetailsDialog
          open={openModelDetailsDialog}
          onClose={() => setOpenModelDetailsDialog(false)}
          productId={selectedModel.productId}
          modelId={selectedModel.modelId}
          modelDetails={mapToModelDetails(selectedModel.productModelDetails)}
          onSuccess={fetchData}
        />
      )}

      {selectedColor && (
        <UpdateColorDialog
          open={openColorDialog}
          onClose={() => setOpenColorDialog(false)}
          productId={selectedColor.productId}
          modelId={selectedColor.modelId}
          colorId={selectedColor.colorId}
          colorData={selectedColor.colorData}
          onSuccess={fetchData}
        />
      )}
    </>
  );
}
