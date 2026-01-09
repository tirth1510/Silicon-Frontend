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
import { MoreHorizontal, Plus, Search, Edit3, FileText, Palette, Trash2, Package } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  getAllAccessoriesService,
  updateProductStatusService,
} from "@/services/accessory.service";
import { Product } from "@/types/accessory";

// Import dialogs
import AddAccessoryDialog from "./components/AddAccessoryDialog";
import UpdateAccessoryDialog from "./components/UpdateAccessoryDialog";
import ViewAccessoryDialog from "./components/ViewAccessoryDialog";

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [filteredAccessories, setFilteredAccessories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  // Dialog states
  const [openAddDialog, setOpenAddDialog] = useState(false);
  const [openEditDialog, setOpenEditDialog] = useState(false);
  const [openViewDialog, setOpenViewDialog] = useState(false);

  const [selectedAccessory, setSelectedAccessory] = useState<Product | null>(null);

  // Prevent duplicate API calls in React Strict Mode
  const hasFetchedRef = useRef(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const data = await getAllAccessoriesService();
      setAccessories(data);
      setFilteredAccessories(data);
    } catch (error) {
      console.error("Error fetching accessories:", error);
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

  // Search filter
  useEffect(() => {
    const query = searchQuery.toLowerCase();
    const filtered = accessories.filter(
      (accessory) =>
        accessory.productTitle.toLowerCase().includes(query) ||
        accessory.productCategory.toLowerCase().includes(query)
    );
    setFilteredAccessories(filtered);
  }, [searchQuery, accessories]);

  const handleDeleteAccessory = async (id: string, title: string) => {
    const confirmDelete = confirm(
      `Are you sure you want to delete "${title}"?`
    );
    if (!confirmDelete) return;

    try {
      // TODO: Add delete API call when available
      alert("Delete functionality will be implemented with API");
      fetchData();
    } catch (error: unknown) {
      const err = error as Error;
      alert(err.message || "Failed to delete accessory");
    }
  };

  const handleStatusChange = async (id: string, status: "Live" | "Padding" | "Enquiry") => {
    try {
      await updateProductStatusService(id, status);
      fetchData();
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 p-3 sm:p-6">
      {/* Enhanced Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-blue-100">
        <div className="flex-1">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Accessories Management
          </h1>
          <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 flex items-center gap-2">
            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            <span className="line-clamp-1">Manage all your accessories and medical supplies in one place</span>
          </p>
        </div>
        <Button
          onClick={() => setOpenAddDialog(true)}
          className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 transition-all duration-300 px-6 sm:px-8 py-4 sm:py-6 text-sm sm:text-base font-semibold w-full sm:w-auto sm:min-w-[220px] whitespace-nowrap"
        >
          <Plus className="mr-2 h-4 w-4 sm:h-5 sm:w-5" />
          Add New Accessory
        </Button>
      </div>

      {/* Enhanced Search Bar */}
      <div className="relative group">
        <Search className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
        <Input
          placeholder="Search accessories..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 sm:pl-12 pr-3 sm:pr-4 py-4 sm:py-6 text-sm sm:text-base border-2 border-gray-200 focus:border-blue-500 rounded-lg sm:rounded-xl shadow-sm hover:shadow-md transition-all duration-300"
        />
      </div>

      {/* Enhanced Table */}
      <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <TableHead className="w-16 font-bold text-gray-700">No.</TableHead>
                <TableHead className="w-28 font-bold text-gray-700">Image</TableHead>
                <TableHead className="font-bold text-gray-700">Product Name</TableHead>
                <TableHead className="font-bold text-gray-700">Category</TableHead>
                <TableHead className="w-32 font-bold text-gray-700">Price</TableHead>
                <TableHead className="w-24 font-bold text-gray-700">Stock</TableHead>
                <TableHead className="w-24 font-bold text-gray-700">Status</TableHead>
                <TableHead className="w-24 text-right font-bold text-gray-700 sticky right-0 bg-gradient-to-r from-gray-50 to-gray-100 shadow-[-4px_0_8px_rgba(0,0,0,0.08)] z-10">
                  Actions
                </TableHead>
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
                        <p className="text-gray-700 font-semibold text-lg">Loading accessories...</p>
                        <p className="text-gray-500 text-sm">Please wait while we fetch your data</p>
                      </div>
                    </div>
                  </TableCell>
                </TableRow>
              ) : filteredAccessories.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-24">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-20 h-20 rounded-full bg-gradient-to-br from-blue-100 to-indigo-100 flex items-center justify-center">
                        <Package className="w-10 h-10 text-blue-600" />
                      </div>
                      <div className="space-y-2">
                        <p className="text-gray-700 font-semibold text-lg">
                          {searchQuery ? "No accessories found" : "No accessories yet"}
                        </p>
                        <p className="text-gray-500 text-sm max-w-md">
                          {searchQuery
                            ? "Try adjusting your search terms"
                            : "Click 'Add New Accessory' button to create your first accessory"}
                        </p>
                      </div>
                      {!searchQuery && (
                        <Button
                          onClick={() => setOpenAddDialog(true)}
                          className="mt-4 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-lg"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Your First Accessory
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccessories.map((accessory, index) => (
                  <TableRow
                    key={accessory.id || accessory._id}
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
                          {accessory.productImages?.[0]?.url ? (
                            <div className="relative w-14 h-14 rounded-lg overflow-hidden border-2 border-gray-200 group-hover/image:border-blue-400 transition-all duration-300 shadow-sm">
                              <Image
                                src={accessory.productImages[0].url}
                                alt={accessory.productTitle}
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
                        {accessory.productTitle}
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-gray-700 font-medium">
                        {accessory.productCategory}
                      </div>
                    </TableCell>

                    <TableCell>
                      {accessory.priceDetails?.finalPrice ? (
                        <div className="font-bold text-lg bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                          ₹{accessory.priceDetails.finalPrice.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-gray-400 font-medium">-</span>
                      )}
                    </TableCell>

                    <TableCell>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${(accessory.stock ?? 0) > 10
                        ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                        : (accessory.stock ?? 0) > 0
                          ? "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
                          : "bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border border-red-200"
                        }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${(accessory.stock ?? 0) > 10
                          ? "bg-green-500"
                          : (accessory.stock ?? 0) > 0
                            ? "bg-yellow-500"
                            : "bg-red-500 animate-pulse"
                          }`} />
                        {accessory.stock ?? 0} units
                      </span>
                    </TableCell>

                    <TableCell>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold shadow-sm ${accessory.status === "Live"
                          ? "bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border border-green-200"
                          : accessory.status === "Enquiry"
                            ? "bg-gradient-to-r from-blue-100 to-cyan-100 text-blue-700 border border-blue-200"
                            : "bg-gradient-to-r from-yellow-100 to-orange-100 text-yellow-700 border border-yellow-200"
                          }`}
                      >
                        <span className={`w-1.5 h-1.5 rounded-full ${accessory.status === "Live" ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                          }`} />
                        {accessory.status}
                      </span>
                    </TableCell>

                    <TableCell className="text-right sticky right-0 bg-white group-hover:bg-gradient-to-r group-hover:from-blue-50 group-hover:to-indigo-50 shadow-[-4px_0_8px_rgba(0,0,0,0.08)] z-10">
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
                              setSelectedAccessory(accessory);
                              setOpenViewDialog(true);
                            }}
                            className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                                <FileText className="h-4 w-4 text-blue-600" />
                              </div>
                              <span className="font-medium text-gray-700">View Details</span>
                            </div>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            onClick={() => {
                              setSelectedAccessory(accessory);
                              setOpenEditDialog(true);
                            }}
                            className="rounded-lg p-3 cursor-pointer hover:bg-gradient-to-r hover:from-green-50 hover:to-emerald-50 transition-all duration-200"
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                                <Edit3 className="h-4 w-4 text-green-600" />
                              </div>
                              <span className="font-medium text-gray-700">Edit Accessory</span>
                            </div>
                          </DropdownMenuItem>

                          <div className="h-px bg-gray-200 my-2" />

                          {accessory.status !== "Live" && (
                            <DropdownMenuItem
                              onClick={() => handleStatusChange(accessory.id || accessory._id, "Live")}
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
                              handleDeleteAccessory(
                                accessory.id || accessory._id,
                                accessory.productTitle
                              )
                            }
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-lg bg-red-100 flex items-center justify-center">
                                <Trash2 className="h-4 w-4 text-red-600" />
                              </div>
                              <span className="font-medium text-red-600">Delete Accessory</span>
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
      <AddAccessoryDialog
        open={openAddDialog}
        onClose={() => setOpenAddDialog(false)}
        accessories={accessories}
        onSuccess={fetchData}
      />

      {selectedAccessory && (
        <>
          <UpdateAccessoryDialog
            open={openEditDialog}
            onClose={() => {
              setOpenEditDialog(false);
              setSelectedAccessory(null);
            }}
            accessory={selectedAccessory}
            accessories={accessories}
            onSuccess={fetchData}
          />

          <ViewAccessoryDialog
            open={openViewDialog}
            onClose={() => {
              setOpenViewDialog(false);
              setSelectedAccessory(null);
            }}
            accessory={selectedAccessory}
          />
        </>
      )}
    </div>
  );
}
