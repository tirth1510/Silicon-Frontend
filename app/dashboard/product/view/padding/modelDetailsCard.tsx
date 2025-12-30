"use client";

import * as React from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Sidebar, SidebarContent, SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem, SidebarProvider } from "@/components/ui/sidebar";
import { FaHeartbeat, FaThermometerHalf, FaCheckCircle, FaBolt, FaCogs, FaPalette, FaListUl } from "react-icons/fa";
import { ProductModelDetailsDTO } from "@/types/model";

interface ModelDetailsDialogProps {
  open: boolean;
  onClose: () => void;
  data: ProductModelDetailsDTO | null;
}

export function ModelDetailsDialog({ open, onClose, data }: ModelDetailsDialogProps) {
  const [selectedKey, setSelectedKey] = React.useState<string | null>(null);
  const details = data;

  if (!details) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>No Details</DialogTitle>
          </DialogHeader>
          <p>No details available for this model.</p>
          <DialogClose asChild>
            <Button className="mt-4 w-full" onClick={onClose}>Close</Button>
          </DialogClose>
        </DialogContent>
      </Dialog>
    );
  }

  const keys = [
    { key: "specifications", label: "Specifications" },
    { key: "productSpecifications", label: "Product Specs" },
    { key: "productFeatures", label: "Features" },
    { key: "colors", label: "Colors" },
    { key: "warranty", label: "Warranty" },
    { key: "standardParameters", label: "Standard Params" },
    { key: "optiomalParameters", label: "Optional Params" },
    { key: "sellFlags", label: "Sell Flags" },
  ];

  const iconMap: Record<string, React.ElementType> = {
    specifications: FaListUl,
    productSpecifications: FaCogs,
    productFeatures: FaPalette,
    colors: FaPalette,
    warranty: FaCheckCircle,
    standardParameters: FaHeartbeat,
    optiomalParameters: FaBolt,
    sellFlags: FaCheckCircle,
  };

  const renderDetailCard = () => {
    switch (selectedKey) {
      case "colors":
        return details.colors?.length ? (
          <Card>
            <CardHeader>
              <CardTitle>Colors</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {details.colors.map((color) => (
                <div key={color.colorName} className="border rounded p-4 flex flex-col gap-3">
                  <p className="font-semibold text-lg">{color.colorName}</p>

                  {/* Main Color Image */}
                  {color.imageUrl && (
                    <img
                      src={color.imageUrl}
                      alt={color.colorName}
                      className="w-full h-32 object-contain rounded"
                    />
                  )}

                  {/* Product Images */}
                  {color.productImageUrl?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {color.productImageUrl.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`${color.colorName} product ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Gallery Images */}
                  {color.productGallery?.length > 0 && (
                    <div className="flex gap-2 overflow-x-auto py-2">
                      {color.productGallery.map((img, idx) => (
                        <img
                          key={idx}
                          src={img.url}
                          alt={`${color.colorName} gallery ${idx + 1}`}
                          className="w-20 h-20 object-cover rounded border"
                        />
                      ))}
                    </div>
                  )}

                  {/* Stock */}
                  <p>Stock: {color.stock}</p>

                  {/* Price Details */}
                  {color.colorPrice?.map((p, idx) => (
                    <p key={idx}>
                      {p.currency} {p.price} → {p.finalPrice} ({p.discount}% discount)
                    </p>
                  ))}
                </div>
              ))}
            </CardContent>
          </Card>
        ) : <p>No colors available</p>;

      // Other cases: specifications, productSpecifications, productFeatures, etc.
      default:
        return <p>Select a key to view details</p>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="overflow-hidden p-0 max-h-[700px] min-w-[1200px]">
        <DialogHeader>
          <DialogTitle className="sr-only">Model Details</DialogTitle>
        </DialogHeader>

        <SidebarProvider className="items-start">
          {/* Sidebar */}
          <Sidebar collapsible="none" className="hidden md:flex w-64 border-r">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {keys.map(k => {
                      const Icon = iconMap[k.key] || FaListUl;
                      return (
                        <SidebarMenuItem key={k.key}>
                          <SidebarMenuButton asChild isActive={selectedKey === k.key}>
                            <button onClick={() => setSelectedKey(k.key)} className="flex items-center gap-2 px-2 py-1">
                              <Icon size={16} />
                              <span>{k.label}</span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      );
                    })}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          {/* Right Panel */}
          <main className="flex flex-1 flex-col overflow-auto p-4">
            <ScrollArea className="max-h-full">{renderDetailCard()}</ScrollArea>
          </main>
        </SidebarProvider>

        <DialogClose asChild>
          <Button className="mt-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
