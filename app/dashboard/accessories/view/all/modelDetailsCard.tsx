/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import * as React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { Product } from "@/types/accessory";

import {
  FaImages,
  FaListAlt,
  FaClipboardList,
  FaShieldAlt,
  FaCheckCircle,
} from "react-icons/fa";

/* ---------------- KEY-VALUE / POINTS RENDERER ---------------- */
const renderKeyValueList = (
  title: string,
  list?: { key?: string; value?: string }[] | { points?: string }[]
) => {
  const isEmpty = !list || list.length === 0;

  return (
    <Card className="min-h-[180px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid gap-3">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">No data available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            {list.map((item, idx) => (
              <div key={idx} className="flex items-start gap-2">
                <FaCheckCircle className="mt-1 text-blue-600 shrink-0" />

                <div className="flex flex-wrap gap-1">
                  {"key" in item && item.key && (
                    <span className="font-semibold">{item.key}:</span>
                  )}
                  {"value" in item && item.value && <span>{item.value}</span>}
                  {"points" in item && item.points && <span>{item.points}</span>}
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/* ---------------- IMAGES RENDERER ---------------- */
const renderImages = (title: string, images?: { url: string }[]) => {
  const isEmpty = !images || images.length === 0;

  return (
    <Card className="min-h-[180px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>

      <CardContent className="grid grid-cols-3 gap-4">
        {isEmpty ? (
          <p className="col-span-3 text-sm text-muted-foreground">
            No images available
          </p>
        ) : (
          images.map((img, idx) => (
            <img
              key={idx}
              src={img.url}
              alt={`${title} ${idx + 1}`}
              className="h-32 w-full object-contain rounded border"
            />
          ))
        )}
      </CardContent>
    </Card>
  );
};

/* ---------------- MAIN DIALOG ---------------- */
interface Props {
  open: boolean;
  onClose: () => void;
  data: Product | null;
}

export default function ProductDetailsDialog({
  open,
  onClose,
  data,
}: Props) {
  const [selected, setSelected] = React.useState<string>("productImages");

  if (!data) return null;

  const renderContent = () => {
    switch (selected) {
      case "productImages":
        return renderImages("Product Images", data.productImages);
      case "galleryImages":
        return renderImages("Gallery Images", data.galleryImages);
      case "specifications":
        return renderKeyValueList("Specifications", data.specifications);
      case "productSpecifications":
        return renderKeyValueList(
          "Product Specifications",
          data.productSpecifications
        );
      case "warranty":
        return renderKeyValueList("Warranty", data.warranty);
      default:
        return <p className="text-muted-foreground">Select a section</p>;
    }
  };

  const menu = [
    {
      key: "productImages",
      label: "Product Images",
      icon: FaImages,
    },
    {
      key: "galleryImages",
      label: "Gallery Images",
      icon: FaImages,
    },
    {
      key: "specifications",
      label: "Specifications",
      icon: FaListAlt,
    },
    {
      key: "productSpecifications",
      label: "Product Specs",
      icon: FaClipboardList,
    },
    {
      key: "warranty",
      label: "Warranty",
      icon: FaShieldAlt,
    },
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 min-w-[1000px] max-h-[700px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Product Details</DialogTitle>
        </DialogHeader>

        <SidebarProvider>
          <Sidebar className="w-64 border-r">
            <SidebarContent>
              <SidebarGroup>
                <SidebarGroupContent>
                  <SidebarMenu>
                    {menu.map(({ key, label, icon: Icon }) => (
                      <SidebarMenuItem key={key}>
                        <SidebarMenuButton
                          isActive={selected === key}
                          onClick={() => setSelected(key)}
                          className="flex items-center gap-3"
                        >
                          <Icon className="h-4 w-4 text-blue-600 shrink-0" />
                          <span>{label}</span>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    ))}
                  </SidebarMenu>
                </SidebarGroupContent>
              </SidebarGroup>
            </SidebarContent>
          </Sidebar>

          <main className="flex-1 p-4 overflow-auto">
            <ScrollArea>{renderContent()}</ScrollArea>
          </main>
        </SidebarProvider>

        <DialogClose asChild>
          <Button className="m-4 w-full">Close</Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}
