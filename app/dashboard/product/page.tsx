"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Package } from "lucide-react";
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
import { MoreHorizontal, Plus, Search, Edit3, FileText, Palette, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  deleteModelService,
  getAllModelsWithProductInfo,
} from "@/services/model.api";
import { ModelWithProductDTO } from "@/types/model";

// Import dialogs
import AddProductDialog from "./components/AddProductDialog";
import UpdateProductDialog from "./components/UpdateProductDialog";
import UpdateModelDialog from "./components/UpdateModelDialog";
import UpdateModelDetailsDialog from "./components/UpdateModelDetailsDialog";
import UpdateColorDialog from "./components/UpdateColorDialog";
import AddModelDialog from "./components/AddModelDialog";

export default function ProductsPage() {
  const [models, setModels] = useState<ModelWithProductDTO[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelWithProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddModelDialog, setOpenAddModelDialog] = useState(false);
  const [selectedProductForModel, setSelectedProductForModel] = useState<string | null>(null);
  
  const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
  const [openEditModelDialog, setOpenEditModelDialog] = useState(false);
  const [openEditDetailsDialog, setOpenEditDetailsDialog] = useState(false);
  const [openEditColorDialog, setOpenEditColorDialog] = useState(false);
  
  const [selectedModel, setSelectedModel] = useState<ModelWithProductDTO | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllModelsWithProductInfo();
      setModels(data);
      setFilteredModels(data);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Search filter
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = models.filter(
      (model) =>
        model.productTitle.toLowerCase().includes(query) ||
        model.modelName.toLowerCase().includes(query)
    );
    setFilteredModels(filtered);
  }, [searchQuery, models]);

  const handleDeleteModel = async (productId: string, modelId: string, modelName: string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete the model "${modelName}"?`
    );
    if (!confirmDelete) return;

    try {
      await deleteModelService(productId, modelId);
      alert("Model deleted successfully");
      fetchData();
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message || "Failed to delete model");
    }
  };

  return (
    <div className="space-y-6 p-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 rounded-2xl p-6 border border-blue-100">
  <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Product Management
          </h1>
          <p className="text-sm text-gray-600 mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Manage all your products, models, and variants in one place
          </p>
        </div>
        <Button
          onClick={() => setOpenAddDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 px-8 py-6 text-base font-semibold min-w-[200px]"
        >
          <Plus className="mr-2 h-5 w-5" />
          Add New Product
        </Button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative group">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Search products or models..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-12 pr-4 py-6 text-base border-2 border-gray-200 focus:border-blue-500 rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        />
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <TableHead className="w-16 font-bold text-gray-700">No.</TableHead>
              <TableHead className="w-28 font-bold text-gray-700">Image</TableHead>
              <TableHead className="font-bold text-gray-700">Product Name</TableHead>
              <TableHead className="font-bold text-gray-700">Model Name</TableHead>
              <TableHead className="w-32 font-bold text-gray-700">Price</TableHead>
              <TableHead className="w-24 font-bold text-gray-700">Stock</TableHead>
              <TableHead className="w-24 font-bold text-gray-700">Status</TableHead>
              <TableHead className="w-24 text-right font-bold text-gray-700">Actions</TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {loading ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                      <Spinner />
                      <div className="absolute inset-0 animate-ping">
                        <Spinner />
                      </div>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-700 font-semibold text-lg">Loading products...</p>
                      <p className="text-gray-500 text-sm">Please wait while we fetch your data</p>
                    </div>
                  </div>
                </TableCell>
              </TableRow>
            ) : filteredModels.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-24">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                      <Package className="w-10 h-10 text-blue-600" />
                    </div>
                    <div className="space-y-2">
                      <p className="text-gray-700 font-semibold text-lg">
                        {searchQuery ? "No products found" : "No products yet"}
                      </p>
                      <p className="text-gray-500 text-sm max-w-md">
                        {searchQuery 
                          ? "Try adjusting your search terms or filters" 
                          : "Click 'Add New Product' button to create your first product"}
                      </p>
                    </div>
                    {!searchQuery && (
                      <Button
                        onClick={() => setOpenAddDialog(true)}
                        className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        Add Your First Product
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredModels.map((model, index) => (
                <TableRow 
                  key={model.modelId} 
                  className="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 border-b border-gray-100 group"
                >
                  <TableCell className="font-bold text-gray-700">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center text-sm font-semibold text-blue-700 group-hover:from-blue-200 group-hover:to-indigo-200 transition-all duration-200">
                      {index + 1}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="flex items-center justify-center py-1">
                      <div className="relative group/image">
                        {model.productModelDetails?.colors?.[0]?.imageUrl ? (
                          <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 group-hover/image:border-blue-400 transition-all duration-300 shadow-sm">
                            <Image
                              src={model.productModelDetails.colors[0].imageUrl}
                              alt={model.productTitle}
                              fill
                              className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                              sizes="56px"
                            />
                          </div>
                        ) : (
                          <div className="w-14 h-14 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                            <span className="text-[10px] text-gray-400 font-medium">No Image</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="font-semibold text-gray-900 group-hover:text-blue-700 transition-colors duration-200">
                      {model.productTitle}
                    </div>
                  </TableCell>

                  <TableCell>
                    <div className="text-gray-700 font-medium">
                      {model.modelName}
                    </div>
                  </TableCell>

                  <TableCell>
                    {model.productModelDetails?.colors?.[0]?.colorPrice?.[0]
                      ?.finalPrice ? (
                      <div className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                        ₹{model.productModelDetails.colors[0].colorPrice[0].finalPrice.toLocaleString()}
                      </div>
                    ) : (
                      <span className="text-gray-400 font-medium">-</span>
                    )}
                  </TableCell>

                  <TableCell>
                    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                      (model.productModelDetails?.colors?.[0]?.stock ?? 0) > 10
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                        : (model.productModelDetails?.colors?.[0]?.stock ?? 0) > 0
                        ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
                        : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        (model.productModelDetails?.colors?.[0]?.stock ?? 0) > 10
                          ? "bg-green-500"
                          : (model.productModelDetails?.colors?.[0]?.stock ?? 0) > 0
                          ? "bg-yellow-500"
                          : "bg-red-500 animate-pulse"
                      }`} />
                      {model.productModelDetails?.colors?.[0]?.stock ?? 0} units
                    </span>
                  </TableCell>

                  <TableCell>
                    <span
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${
                        model.status === "Live"
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                          : "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
                      }`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${
                        model.status === "Live" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                      }`} />
                      {model.status}
                    </span>
                  </TableCell>

                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          className="h-9 w-9 p-0 hover:bg-blue-100 hover:text-blue-700 transition-all duration-200 rounded-lg"
                        >
                          <MoreHorizontal className="h-5 w-5" />
                        </Button>
                      </DropdownMenuTrigger>

                      <DropdownMenuContent align="end" className="w-64 p-2 shadow-xl border-2 border-gray-100">
                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedProductForModel(model.productId);
                            setOpenAddModelDialog(true);
                          }}
                          className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                              <Plus className="h-4 w-4 text-blue-600" />
                            </div>
                            <span className="font-medium text-gray-700">Add New Model</span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedModel(model);
                            setOpenEditProductDialog(true);
                          }}
                          className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                              <Edit3 className="h-4 w-4 text-purple-600" />
                            </div>
                            <span className="font-medium text-gray-700">Edit Product Info</span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedModel(model);
                            setOpenEditModelDialog(true);
                          }}
                          className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-green-600" />
                            </div>
                            <span className="font-medium text-gray-700">Edit Model</span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedModel(model);
                            setOpenEditDetailsDialog(true);
                          }}
                          className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-amber-50 hover:to-orange-50 transition-all duration-200"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-amber-100 flex items-center justify-center">
                              <FileText className="h-4 w-4 text-amber-600" />
                            </div>
                            <span className="font-medium text-gray-700">Edit Specifications</span>
                          </div>
                        </DropdownMenuItem>

                        <DropdownMenuItem
                          onClick={() => {
                            setSelectedModel(model);
                            setOpenEditColorDialog(true);
                          }}
                          disabled={!model.productModelDetails?.colors?.[0]}
                          className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                              <Palette className="h-4 w-4 text-cyan-600" />
                            </div>
                            <span className="font-medium text-gray-700">Edit Color & Pricing</span>
                          </div>
                        </DropdownMenuItem>

                        <div className="h-px bg-gray-200 my-2" />

                        <DropdownMenuItem
                          className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 transition-all duration-200"
                          onClick={() =>
                            handleDeleteModel(
                              model.productId,
                              model.modelId,
                              model.modelName
                            )
                          }
                        >
                          <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                              <Trash2 className="h-4 w-4 text-red-600" />
                            </div>
                            <span className="font-medium text-red-600">Delete Model</span>
                          </div>
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* Dialogs */}
      <AddProductDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        onSuccess={fetchData}
      />

      {selectedProductForModel && (
        <AddModelDialog
          open={openAddModelDialog}
          onClose={() => {
            setOpenAddModelDialog(false);
            setSelectedProductForModel(null);
          }}
          productId={selectedProductForModel}
          onSuccess={fetchData}
        />
      )}

      {selectedModel && (
        <>
          <UpdateProductDialog
            open={openEditProductDialog}
            onClose={() => setOpenEditProductDialog(false)}
            productId={selectedModel.productId}
            defaultValues={{
              productTitle: selectedModel.productTitle,
              productCategory: selectedModel.productCategory ?? "1",
              description: selectedModel.productDescription || "",
            }}
            onSuccess={fetchData}
          />

          <UpdateModelDialog
            open={openEditModelDialog}
            onClose={() => setOpenEditModelDialog(false)}
            productId={selectedModel.productId}
            modelId={selectedModel.modelId}
            defaultValues={{
              modelName: selectedModel.modelName,
              status: selectedModel.status,
            }}
            onSuccess={fetchData}
          />

          {selectedModel.productModelDetails && (
            <>
              <UpdateModelDetailsDialog
                open={openEditDetailsDialog}
                onClose={() => setOpenEditDetailsDialog(false)}
                productId={selectedModel.productId}
                modelId={selectedModel.modelId}
                modelDetails={{
                  specifications: selectedModel.productModelDetails.specifications,
                  productSpecifications: selectedModel.productModelDetails.productSpecifications,
                  productFeatures: selectedModel.productModelDetails.productFeatures,
                  warranty: selectedModel.productModelDetails.warranty,
                }}
                onSuccess={fetchData}
              />

              {selectedModel.productModelDetails.colors?.[0] && (
                <UpdateColorDialog
                  open={openEditColorDialog}
                  onClose={() => setOpenEditColorDialog(false)}
                  productId={selectedModel.productId}
                  modelId={selectedModel.modelId}
                  colorId={selectedModel.productModelDetails.colors[0]._id}
                  colorData={selectedModel.productModelDetails.colors[0]}
                  onSuccess={fetchData}
                />
              )}
            </>
          )}
        </>
      )}
  </div>
  );
}
