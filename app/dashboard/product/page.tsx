/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
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
import { MoreHorizontal, Plus, Search, Edit3, FileText, Palette, Trash2, Package, Sparkles, Eye } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  deleteModelService,
  getAllModelsWithProductInfo,
  getPaddingModelsWithProductInfo,
  goLiveModelService,
} from "@/services/model.api";
import { ModelWithProductDTO } from "@/types/model";

// Import dialogs
import AddProductDialog from "./components/AddProductDialog";
import UpdateProductDialog from "./components/UpdateProductDialog";
import UpdateModelDialog from "./components/UpdateModelDialog";
import UpdateModelDetailsDialog from "./components/UpdateModelDetailsDialog";
import UpdateColorDialog from "./components/UpdateColorDialog";
import AddModelDialog from "./components/AddModelDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useRouter } from "next/navigation";
export default function ProductsPage() {
  const [models, setModels] = useState<ModelWithProductDTO[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelWithProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "live">("all");

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddModelDialog, setOpenAddModelDialog] = useState(false);
  const [selectedProductForModel, setSelectedProductForModel] = useState<string | null>(null);
  
  const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
  const [openEditModelDialog, setOpenEditModelDialog] = useState(false);
  const [openEditDetailsDialog, setOpenEditDetailsDialog] = useState(false);
  const [openEditColorDialog, setOpenEditColorDialog] = useState(false);
  
  const [selectedModel, setSelectedModel] = useState<ModelWithProductDTO | null>(null);

  // Prevent duplicate API calls in React Strict Mode
  const hasFetchedRef = useRef(false);
const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);

      const [pending, live] = await Promise.all([
        getPaddingModelsWithProductInfo(),
        getAllModelsWithProductInfo(),
      ]);

      // Pending FIRST, then Live
      const merged = [...pending, ...live];

      setModels(merged);
      setFilteredModels(merged);
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchByStatus = async (status: "pending" | "live") => {
    try {
      setLoading(true);

      const data =
        status === "pending"
          ? await getPaddingModelsWithProductInfo()
          : await getAllModelsWithProductInfo();

      setModels(data);
      setFilteredModels(data);
    } catch (error) {
      console.error("Error fetching filtered models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Only fetch if we haven't already fetched
    if (!hasFetchedRef.current) {
      hasFetchedRef.current = true;
      fetchData();
    }
  }, []);

  useEffect(() => {
    if (statusFilter === "all") {
      fetchData();
    } else {
      fetchByStatus(statusFilter);
    }
  }, [statusFilter]);

  // Search filter
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = models.filter(
      (model) =>
        model.productTitle.toLowerCase().includes(query) ||
        model.modelName.toLowerCase().includes(query) ||
        model.productCategory.toLowerCase().includes(query)
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

  const handleStatusChange = async (productId: string, modelId: string, status: "Live" | "Padding" | "Enquiry") => {
    try {
      await goLiveModelService(productId, modelId, status);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="px-10 pt-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-end sm:items-center gap-4 mb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 rounded-lg mb-2">
            <Sparkles className="w-4 h-4 text-blue-900" />
            <span className="text-sm font-semibold text-blue-900">
              Inventory Management
            </span>
          </div>
          <h1 className="text-4xl font-bold text-blue-900">Products</h1>
        </div>
        <Button
          onClick={() => setOpenAddDialog(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Product
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 border-blue-200 focus:border-blue-900 focus:ring-blue-900 rounded-lg"
          />
        </div>

        <Select
          value={statusFilter}
          onValueChange={(value) => setStatusFilter(value as any)}
        >
          <SelectTrigger className="w-full sm:w-[200px] border-blue-200 focus:ring-blue-900 rounded-lg">
            <SelectValue placeholder="Filter Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="live">Live</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="border border-blue-900 rounded-xl overflow-hidden shadow-sm bg-white">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-blue-900">
              <TableRow className="hover:bg-blue-900 border-none">
                <TableHead className="w-16 text-center text-white font-bold text-sm uppercase tracking-wide py-4">No.</TableHead>
                <TableHead className="w-28 text-center text-white font-bold text-sm uppercase tracking-wide py-4">Image</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Product Name</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Model Name</TableHead>
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Category</TableHead>
                <TableHead className="w-24 text-center text-white font-bold text-sm uppercase tracking-wide py-4">Stock</TableHead>
                <TableHead className="w-24 text-center text-white font-bold text-sm uppercase tracking-wide py-4">Status</TableHead>
                <TableHead className="w-24 text-center text-white font-bold text-sm uppercase tracking-wide py-4">
                  Actions
                </TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-24">
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
                  <TableCell colSpan={9} className="text-center py-24">
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
                            ? "Try adjusting your search terms"
                            : "Click 'Add Product' button to create your first product"}
                        </p>
                      </div>
                      {!searchQuery && (
                        <Button
                          onClick={() => setOpenAddDialog(true)}
                          className="mt-4 bg-blue-900 hover:bg-blue-800 text-white"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Product
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredModels.map((model, index) => (
                  <TableRow
                    key={model.modelId || model._id}
                    className="hover:bg-blue-50/50 transition-all duration-200 border-b border-gray-100 group"
                  >
                    <TableCell className="text-center font-medium text-gray-600">
                      <div className="w-8 h-8 mx-auto rounded-full bg-gray-100 flex items-center justify-center text-sm font-semibold text-gray-700">
                        {index + 1}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center justify-center py-1">
                        <div className="relative group/image">
                          {model.productModelDetails?.colors?.[0]?.imageUrl ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 group-hover/image:border-blue-400 transition-all duration-300">
                              <Image
                                src={model.productModelDetails.colors[0].imageUrl}
                                alt={model.productTitle}
                                fill
                                className="object-cover group-hover/image:scale-105 transition-transform duration-300"
                                sizes="56px"
                              />
                            </div>
                          ) : (
                            <div className="w-12 h-12 bg-gray-100 rounded-lg border border-gray-200 flex items-center justify-center">
                              <span className="text-[10px] text-gray-400 font-medium">No Image</span>
                            </div>
                          )}
                        </div>
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="font-semibold text-gray-900">
                        {model.productTitle}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="text-gray-600 font-medium">
                        {model.modelName}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="text-gray-600 font-medium">
                        {model.productCategory || "N/A"}
                      </div>
                    </TableCell>

                    

                    <TableCell className="text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${(model.productModelDetails?.colors?.[0]?.stock ?? 0) > 10
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : (model.productModelDetails?.colors?.[0]?.stock ?? 0) > 0
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                        {model.productModelDetails?.colors?.[0]?.stock ?? 0}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${model.status === "Live"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : model.status === "Enquiry"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                      >
                        {model.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 w-8 p-0 hover:bg-blue-50 hover:text-blue-700 rounded-md"
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
                            className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <Edit3 className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium text-gray-700">Edit Product</span>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedModel(model);
                              setOpenEditModelDialog(true);
                            }}
                            className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-purple-50 hover:to-pink-50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-purple-100 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-purple-600" />
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
                              <span className="font-medium text-gray-700">Edit Details</span>
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
                              <span className="font-medium text-gray-700">Edit Color Details</span>
                            </div>
                          </DropdownMenuItem>


                           <DropdownMenuItem
                            onClick={() => router.push(`/dashboard/product/${model.modelId}`)}
                            className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-cyan-50 hover:to-blue-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-cyan-100 flex items-center justify-center">
                                <Eye className="h-4 w-4 text-cyan-600" />
                              </div>
                              <span className="font-medium text-gray-700">View Model Details</span>
                            </div>
                          </DropdownMenuItem>

                          <div className="h-px bg-gray-200 my-2" />

                          {model.status !== "Live" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(model.productId, model.modelId, "Live")}
                              className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                            >
                              <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                  <span className="text-green-600 font-bold">✓</span>
                                </div>
                                <span className="font-medium text-gray-700">Mark as Live</span>
                              </div>
                            </DropdownMenuItem>
                          )}

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
