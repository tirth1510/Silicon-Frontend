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
import { 
  MoreHorizontal, Plus, Search, Edit3, FileText, Palette, 
  Trash2, Package, Sparkles, Eye, LayoutGrid, CheckCircle2, Clock,
  ChevronLeft, ChevronRight
} from "lucide-react";
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
import { Star, ShieldCheck } from "lucide-react"; // Naye icons
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
import UpdateValuableDialog from "./components/updateValueableproducts";

export default function ProductsPage() {
  const [models, setModels] = useState<ModelWithProductDTO[]>([]);
  const [filteredModels, setFilteredModels] = useState<ModelWithProductDTO[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "live">("all");

  // --- PAGINATION STATES ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openAddModelDialog, setOpenAddModelDialog] = useState(false);
  const [selectedProductForModel, setSelectedProductForModel] = useState<string | null>(null);
  const [openEditProductDialog, setOpenEditProductDialog] = useState(false);
  const [openEditModelDialog, setOpenEditModelDialog] = useState(false);
  const [openEditDetailsDialog, setOpenEditDetailsDialog] = useState(false);
  const [openEditColorDialog, setOpenEditColorDialog] = useState(false);
  const [openValuableDialog, setOpenValuableDialog] = useState(false);
  const [selectedModel, setSelectedModel] = useState<ModelWithProductDTO | null>(null);

  const hasFetchedRef = useRef(false);
  const router = useRouter();

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pending, live] = await Promise.all([
        getPaddingModelsWithProductInfo(),
        getAllModelsWithProductInfo(),
      ]);
      const merged = [...pending, ...live];
      setModels(merged);
      setFilteredModels(merged);
      setCurrentPage(1); // Reset to page 1 on new fetch
    } catch (error) {
      console.error("Error fetching models:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchByStatus = async (status: "pending" | "live") => {
    try {
      setLoading(true);
      const data = status === "pending"
          ? await getPaddingModelsWithProductInfo()
          : await getAllModelsWithProductInfo();
      setModels(data);
      setFilteredModels(data);
      setCurrentPage(1);
    } catch (error) {
      console.error("Error fetching filtered models:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
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

  // Search filter logic
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = models.filter(
      (model) =>
        model.productTitle.toLowerCase().includes(query) ||
        model.modelName.toLowerCase().includes(query) ||
        (model.productCategory && model.productCategory.toLowerCase().includes(query))
    );
    setFilteredModels(filtered);
    setCurrentPage(1); 
  }, [searchQuery, models]);

  // --- PAGINATION CALCULATIONS ---
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredModels.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredModels.length / itemsPerPage);

  const handleStatusChange = async (productId: string, modelId: string, status: "Live" | "Padding" | "Enquiry") => {
    try {
      await goLiveModelService(productId, modelId, status);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDeleteModel = async (productId: string, modelId: string, modelName: string) => {
    if (!confirm(`Are you sure you want to delete "${modelName}"?`)) return;
    try {
      await deleteModelService(productId, modelId);
      fetchData();
    } catch (error: any) {
      alert(error.message || "Failed to delete");
    }
  };

  return (
    <div className="px-6 lg:px-10 pt-8 pb-10 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-5xl font-black text-blue-900 tracking-tighter">
            Product <span className="text-slate-400 font-medium">Inventory</span>
          </h1>
        </div>
        <Button onClick={() => setOpenAddDialog(true)} className="bg-blue-900 hover:bg-slate-900 text-white px-8 h-14 rounded-2xl font-black uppercase tracking-widest border-b-4 border-blue-950 transition-all">
          <Plus className="mr-2 h-5 w-5 stroke-[3px]" /> Create New Product
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 mb-8 bg-white p-4 rounded-3xl shadow-sm border border-slate-100">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400 group-focus-within:text-blue-900" />
          <Input placeholder="Search products..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-12 h-12 border-none bg-slate-50 rounded-2xl" />
        </div>
        <Select value={statusFilter} onValueChange={(v) => setStatusFilter(v as any)}>
          <SelectTrigger className="w-full md:w-[180px] h-12 rounded-2xl border-2 border-slate-100 font-bold">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent className="rounded-2xl">
            <SelectItem value="all" className="font-bold">All Status</SelectItem>
            <SelectItem value="pending" className="font-bold text-amber-600">Pending</SelectItem>
            <SelectItem value="live" className="font-bold text-green-600">Live</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-[2.5rem] overflow-hidden shadow-2xl shadow-blue-900/5 border border-slate-100">
        <Table>
          <TableHeader className="bg-blue-900 border-none">
            <TableRow className="hover:bg-blue-900">
              <TableHead className="w-16 text-center text-blue-100 font-black text-[10px] uppercase tracking-widest py-6">ID</TableHead>
              <TableHead className="w-28 text-center text-blue-100 font-black text-[10px] uppercase py-6">Preview</TableHead>
              <TableHead className="text-left text-blue-100 font-black text-[10px] uppercase py-6">Product Details</TableHead>
              <TableHead className="text-center text-blue-100 font-black text-[10px] uppercase py-6">Model Info</TableHead>
              <TableHead className="text-center text-blue-100 font-black text-[10px] uppercase py-6">Stock</TableHead>
              <TableHead className="text-center text-blue-100 font-black text-[10px] uppercase py-6">Status</TableHead>
              <TableHead className="w-24 text-center text-blue-100 font-black text-[10px] uppercase py-6 pr-8">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center py-32"><Spinner className="w-10 h-10 text-blue-900 mx-auto" /></TableCell></TableRow>
            ) : currentItems.length === 0 ? (
              <TableRow><TableCell colSpan={7} className="text-center py-32 font-bold opacity-40">No items found</TableCell></TableRow>
            ) : (
              currentItems.map((model, index) => (
                <TableRow key={model.modelId} className="hover:bg-blue-50/30 transition-all border-b border-slate-50 group">
                  <TableCell className="text-center font-black text-slate-300 text-xs">{(currentPage - 1) * itemsPerPage + index + 1}</TableCell>
                  <TableCell>
                    <div className="flex justify-center p-2">
                      <div className="relative w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-100 shadow-sm">
                        <Image src={model.productModelDetails?.colors?.[0]?.imageUrl || "/placeholder.png"} alt="Product" fill className="object-cover" />
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-left py-4">
                    <div className="font-black text-slate-900">{model.productTitle}</div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase">{model.productCategory}</div>
                  </TableCell>
                  <TableCell className="text-center"><span className="text-slate-600 font-bold bg-slate-50 px-3 py-1 rounded-full border">{model.modelName}</span></TableCell>
                  <TableCell className="text-center">
                    <div className={`inline-flex flex-col p-2 rounded-2xl border-2 ${(model.productModelDetails?.colors?.[0]?.stock ?? 0) > 5 ? "bg-green-50 text-green-700 border-green-100" : "bg-red-50 text-red-700 border-red-100"}`}>
                      <span className="text-lg font-black">{model.productModelDetails?.colors?.[0]?.stock ?? 0}</span>
                      <span className="text-[8px] font-black uppercase">Units</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <span className={`px-3 py-1 rounded-xl text-[10px] font-black uppercase ${model.status === "Live" ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}`}>
                      {model.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right pr-8">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild><Button variant="ghost" className="h-10 w-10 rounded-full hover:bg-blue-900 hover:text-white"><MoreHorizontal className="h-6 w-6" /></Button></DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-64 p-3 shadow-2xl border-none rounded-[2rem] bg-white ring-1 ring-slate-100">
                         <DropdownMenuItem onClick={() => { setSelectedProductForModel(model.productId); setOpenAddModelDialog(true); }} className="rounded-xl p-3 cursor-pointer focus:bg-blue-50">
                           <Plus className="w-4 h-4 mr-3 text-blue-600" /> <span className="font-bold">Add Model</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => { setSelectedModel(model); setOpenEditProductDialog(true); }} className="rounded-xl p-3 cursor-pointer focus:bg-green-50">
                           <Edit3 className="w-4 h-4 mr-3 text-green-600" /> <span className="font-bold">Edit Product</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => { setSelectedModel(model); setOpenEditDetailsDialog(true); }} className="rounded-xl p-3 cursor-pointer focus:bg-amber-50">
                           <FileText className="w-4 h-4 mr-3 text-amber-600" /> <span className="font-bold">Edit Details</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => { setSelectedModel(model); setOpenEditColorDialog(true); }} className="rounded-xl p-3 cursor-pointer focus:bg-cyan-50">
                           <Palette className="w-4 h-4 mr-3 text-cyan-600" /> <span className="font-bold">Edit Color/Variants</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => { setSelectedModel(model); setOpenValuableDialog(true); }} className="rounded-xl p-3 cursor-pointer focus:bg-yellow-50">
                           <Star className="w-4 h-4 mr-3 text-yellow-600" /> <span className="font-bold">Promote / Valuable</span>
                         </DropdownMenuItem>
                         <DropdownMenuItem onClick={() => router.push(`/dashboard/product/${model.modelId}`)} className="rounded-xl p-3 cursor-pointer focus:bg-indigo-50">
                           <Eye className="w-4 h-4 mr-3 text-indigo-600" /> <span className="font-bold">Full View</span>
                         </DropdownMenuItem>
                         <div className="h-px bg-slate-100 my-2" />
                         {model.status !== "Live" && (
                           <DropdownMenuItem onClick={() => handleStatusChange(model.productId, model.modelId, "Live")} className="rounded-xl p-3 focus:bg-green-600 focus:text-white">
                             <CheckCircle2 className="w-4 h-4 mr-3" /> <span className="font-bold">Mark Live</span>
                           </DropdownMenuItem>
                         )}
                         <DropdownMenuItem onClick={() => handleDeleteModel(model.productId, model.modelId, model.modelName)} className="rounded-xl p-3 focus:bg-red-600 focus:text-white">
                           <Trash2 className="w-4 h-4 mr-3" /> <span className="font-bold">Delete</span>
                         </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        {/* --- PAGINATION FOOTER --- */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between px-10 py-6 border-t border-slate-50 bg-slate-50/30">
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">
              Page {currentPage} of {totalPages} — Total {filteredModels.length} Items
            </p>
            <div className="flex gap-2">
              <Button 
                variant="outline" size="icon" className="rounded-xl border-2 h-10 w-10"
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(v => v - 1)}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              {[...Array(totalPages)].map((_, i) => (
                <Button
                  key={i}
                  variant={currentPage === i + 1 ? "default" : "outline"}
                  className={`h-10 w-10 rounded-xl font-black ${currentPage === i + 1 ? "bg-blue-900" : ""}`}
                  onClick={() => setCurrentPage(i + 1)}
                >
                  {i + 1}
                </Button>
              ))}
              <Button 
                variant="outline" size="icon" className="rounded-xl border-2 h-10 w-10"
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(v => v + 1)}
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* All Dialogs */}
      <AddProductDialog open={openAddDialog} onClose={() => setOpenAddDialog(false)} onSuccess={fetchData} />
      {selectedProductForModel && <AddModelDialog open={openAddModelDialog} onClose={() => { setOpenAddModelDialog(false); setSelectedProductForModel(null); }} productId={selectedProductForModel} onSuccess={fetchData} />}
      {selectedModel && (
        <>
       
          <UpdateProductDialog open={openEditProductDialog} onClose={() => setOpenEditProductDialog(false)} productId={selectedModel.productId} defaultValues={{ productTitle: selectedModel.productTitle, productCategory: selectedModel.productCategory ?? "1", description: selectedModel.productDescription || "" }} onSuccess={fetchData} />
          <UpdateModelDialog open={openEditModelDialog} onClose={() => setOpenEditModelDialog(false)} productId={selectedModel.productId} modelId={selectedModel.modelId} defaultValues={{ modelName: selectedModel.modelName, status: selectedModel.status }} onSuccess={fetchData} />
          {selectedModel.productModelDetails && (
            <>
              <UpdateModelDetailsDialog open={openEditDetailsDialog} onClose={() => setOpenEditDetailsDialog(false)} productId={selectedModel.productId} modelId={selectedModel.modelId} modelDetails={selectedModel.productModelDetails} onSuccess={fetchData} />
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
          <UpdateValuableDialog
            open={openValuableDialog}
            onClose={() => setOpenValuableDialog(false)}
            productId={selectedModel.productId}
            modelId={selectedModel.modelId}
            currentScheme={selectedModel}
            onSuccess={fetchData}
          >
            <div className="flex items-center gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-100">
              <div className="relative w-16 h-16 bg-white rounded-xl overflow-hidden border border-slate-200 shrink-0">
                <Image src={selectedModel.productModelDetails?.colors?.[0]?.imageUrl || "/placeholder.png"} alt={selectedModel.modelName} fill className="object-contain p-1" />
              </div>
              <div>
                <h4 className="font-black text-blue-900 text-lg leading-tight">{selectedModel.modelName}</h4>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{selectedModel.productTitle}</p>
              </div>
            </div>
          </UpdateValuableDialog>
        </>
      )}
    </div>
  );
}