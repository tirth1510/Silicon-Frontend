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
import { FaCheckCircle } from "react-icons/fa";

/* ---------------- CUSTOM ACTION BUTTON ---------------- */
const ActionButton = ({
  title,
  isEmpty,
}: {
  title: string;
  isEmpty: boolean;
}) => (
  <div className="absolute bottom-4 right-4">
    <Button
      size="sm"
      className="bg-blue-50 text-blue-900 border-2 border-blue-900 hover:bg-blue-100"
      onClick={() =>
        alert(isEmpty ? `${title}: Add clicked` : `${title}: Update clicked`)
      }
    >
      {isEmpty ? "Add" : "Update"}
    </Button>
  </div>
);

/* ---------------- KEY-VALUE / POINTS RENDERER ---------------- */
const renderKeyValueList = (
  title: string,
  list?: { key?: string; value?: string }[] | { points?: string }[]
) => {
  const isEmpty = !list || list.length === 0;
  return (
    <Card className="relative min-h-[180px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="pb-16 grid gap-2">
        {isEmpty ? (
          <p className="text-sm text-muted-foreground">No data available</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
            {list.map((item, idx) => (
              <div key={idx} className="flex gap-1 flex-wrap">
                {"key" in item && item.key ? (
                  <span className="font-semibold">{item.key}:</span>
                ) : null}
                {"value" in item && item.value ? <span>{item.value}</span> : null}
                {"points" in item && item.points ? <span>{item.points}</span> : null}
              </div>
            ))}
          </div>
        )}
        <ActionButton title={title} isEmpty={isEmpty} />
      </CardContent>
    </Card>
  );
};

/* ---------------- IMAGES ---------------- */
const renderImages = (title: string, images?: { url: string }[]) => {
  const isEmpty = !images || images.length === 0;
  return (
    <Card className="relative min-h-[180px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-3 gap-4 pb-16">
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
        <ActionButton title={title} isEmpty={isEmpty} />
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

export default function ProductDetailsDialog({ open, onClose, data }: Props) {
  const [selected, setSelected] = React.useState<string | null>(null);

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
        return renderKeyValueList("Product Specifications", data.productSpecifications);
      case "warranty":
        return renderKeyValueList("Warranty", data.warranty);
      default:
        return <p className="text-muted-foreground">Select a section</p>;
    }
  };

  const menu = ["productImages", "galleryImages", "specifications", "productSpecifications", "warranty"];

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
                    {menu.map((m) => (
                      <SidebarMenuItem key={m}>
                        <SidebarMenuButton
                          isActive={selected === m}
                          onClick={() => setSelected(m)}
                        >
                          {m.replace(/([A-Z])/g, " $1")}
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
