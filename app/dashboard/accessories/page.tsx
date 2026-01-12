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
import { MoreHorizontal, Plus, Search, Edit3, FileText, Palette, Trash2, Package, Sparkles } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";

import {
  getAllAccessoriesService,
  updateProductStatusService,
  getPaddingAccessoriesService,
} from "@/services/accessory.service";
import { Product } from "@/types/accessory";

// Import dialogs
import AddAccessoryDialog from "./components/AddAccessoryDialog";
import UpdateAccessoryDialog from "./components/UpdateAccessoryDialog";
import ViewAccessoryDialog from "./components/ViewAccessoryDialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function AccessoriesPage() {
  const [accessories, setAccessories] = useState<Product[]>([]);
  const [filteredAccessories, setFilteredAccessories] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
 const [statusFilter, setStatusFilter] = useState<"all" | "pending" | "live">("all");
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

      const [pending, live] = await Promise.all([
        getAllAccessoriesService(),
        getPaddingAccessoriesService(),
      ]);

      // Pending FIRST, then Live (as you asked)
      const merged = [...pending, ...live];

      setAccessories(merged);
      setFilteredAccessories(merged);
    } catch (error) {
      console.error("Error fetching accessories:", error);
    } finally {
      setLoading(false);
    }
  };

 const fetchByStatus = async (status: "pending" | "live") => {
    try {
      setLoading(true);

      const data =
        status === "pending"
          ? await getPaddingAccessoriesService()
          : await getAllAccessoriesService();

      setAccessories(data);
      setFilteredAccessories(data);
    } catch (error) {
      console.error("Error fetching filtered accessories:", error);
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
          <h1 className="text-4xl font-bold text-blue-900">Accessories</h1>
        </div>
        <Button
          onClick={() => setOpenAddDialog(true)}
          className="bg-blue-900 hover:bg-blue-800 text-white px-6 py-2 rounded-lg font-semibold transition-colors"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Accessory
        </Button>
      </div>

      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4 items-center w-full mb-6">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search accessories..."
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
                <TableHead className="text-center text-white font-bold text-sm uppercase tracking-wide py-4">Category</TableHead>
                <TableHead className="w-32 text-center text-white font-bold text-sm uppercase tracking-wide py-4">Price</TableHead>
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
                          className="mt-4 bg-blue-900 hover:bg-blue-800 text-white"
                        >
                          <Plus className="mr-2 h-4 w-4" />
                          Add Accessory
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredAccessories.map((accessory, index) => (
                  <TableRow
                    key={accessory.id || accessory._id}
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
                          {accessory.productImages?.[0]?.url ? (
                            <div className="relative w-12 h-12 rounded-lg overflow-hidden border border-gray-200 group-hover/image:border-blue-400 transition-all duration-300">
                              <Image
                                src={accessory.productImages[0].url}
                                alt={accessory.productTitle}
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
                        {accessory.productTitle}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      <div className="text-gray-600 font-medium">
                        {accessory.productCategory}
                      </div>
                    </TableCell>

                    <TableCell className="text-center">
                      {accessory.finalPrice ? (
                        <div className="font-bold text-blue-900">
                          ₹{accessory.finalPrice.toLocaleString()}
                        </div>
                      ) : (
                        <span className="text-gray-400 font-medium">-</span>
                      )}
                    </TableCell>

                    <TableCell className="text-center">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${(accessory.stock ?? 0) > 10
                        ? "bg-green-50 text-green-700 border border-green-100"
                        : (accessory.stock ?? 0) > 0
                          ? "bg-yellow-50 text-yellow-700 border border-yellow-100"
                          : "bg-red-50 text-red-700 border border-red-100"
                        }`}>
                        {accessory.stock ?? 0}
                      </span>
                    </TableCell>

                    <TableCell className="text-center">
                      <span
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${accessory.status === "Live"
                          ? "bg-blue-50 text-blue-700 border border-blue-100"
                          : accessory.status === "Enquiry"
                            ? "bg-purple-50 text-purple-700 border border-purple-100"
                            : "bg-gray-100 text-gray-700 border border-gray-200"
                          }`}
                      >
                        {accessory.status}
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
