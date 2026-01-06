/* eslint-disable @next/next/no-img-element */
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
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
} from "@/components/ui/card";
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
import * as Icons from "react-icons/fa";
import { FaQuestionCircle, FaCheckCircle } from "react-icons/fa";
import { ProductModelDetailsDTO, ColorDTO, } from "@/types/model";

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
                {"value" in item && item.value ? (
                  <span>{item.value}</span>
                ) : null}
                {"points" in item && item.points ? (
                  <span>{item.points}</span>
                ) : null}
              </div>
            ))}
          </div>
        )}
        <ActionButton title={title} isEmpty={isEmpty} />
      </CardContent>
    </Card>
  );
};

/* ---------------- ICON RENDERERS ---------------- */
const renderIcons = (title: string, icons?: string[]) => {
  const isEmpty = !icons || icons.length === 0;

  return (
    <Card className="relative min-h-[180px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-5 gap-4 pb-16">
        {isEmpty ? (
          <p className="col-span-5 text-sm text-muted-foreground">
            No icons available
          </p>
        ) : (
          icons.map((name, idx) => {
            const Icon = (Icons as any)[name] || FaQuestionCircle;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center h-20 w-20 rounded bg-muted"
              >
                <Icon size={28} />
                <span className="text-xs mt-1">{name}</span>
              </div>
            );
          })
        )}
        <ActionButton title={title} isEmpty={isEmpty} />
      </CardContent>
    </Card>
  );
};

const renderParamIcons = (title: string, list?: { iconName: string }[]) => {
  const isEmpty = !list || list.length === 0;

  return (
    <Card className="relative min-h-[180px]">
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-6 gap-4 pb-16">
        {isEmpty ? (
          <p className="col-span-6 text-sm text-muted-foreground">
            No data available
          </p>
        ) : (
          list.map((i, idx) => {
            const Icon = (Icons as any)[i.iconName] || FaQuestionCircle;
            return (
              <div
                key={idx}
                className="flex flex-col items-center justify-center h-20 w-20 rounded bg-muted"
              >
                <Icon size={28} />
                <span className="text-xs mt-1">{i.iconName}</span>
              </div>
            );
          })
        )}
        <ActionButton title={title} isEmpty={isEmpty} />
      </CardContent>
    </Card>
  );
};

/* ---------------- SELL SCHEME ---------------- */
const renderSellScheme = (schem: Record<string, any>) => {
  const entries = Object.entries(schem || {});

  if (entries.length === 0) {
    return (
      <Card className="relative min-h-[180px]">
        <CardHeader>
          <CardTitle>Sell Scheme</CardTitle>
        </CardHeader>
        <CardContent className="pb-16">
          <p className="text-sm text-muted-foreground">No sell scheme available</p>
          <ActionButton title="Sell Scheme" isEmpty={true} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="relative min-h-[180px]">
      <CardHeader>
        <CardTitle>Sell Scheme</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-3 pb-16">
        {entries.map(([key, value]) => (
          <div
            key={key}
            className={`flex items-center gap-2 p-2 rounded ${
              value ? "bg-green-100" : "bg-red-100"
            }`}
          >
            <FaCheckCircle className={value ? "text-green-600" : "text-red-400"} />
            <span className="capitalize">{key.replace(/([A-Z])/g, " $1")}</span>
          </div>
        ))}
        <ActionButton title="Sell Scheme" isEmpty={false} />
      </CardContent>
    </Card>
  );
};

/* ---------------- COLORS ---------------- */
const renderColors = (colors: ColorDTO[]) => (
  <Card className="relative">
    <CardHeader>
      <CardTitle>Colors</CardTitle>
    </CardHeader>
    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4 pb-16">
      {colors.map((c) => (
        <div key={c.colorName} className="border rounded p-4 space-y-2">
          <p className="font-semibold">{c.colorName}</p>

          {c.imageUrl && (
            <img
              src={c.imageUrl}
              className="h-32 w-full object-contain rounded"
              alt={c.colorName}
            />
          )}

          {c.colorPrice && c.colorPrice.length > 0 && (
            <div className="space-y-1">
              {c.colorPrice.map((p, idx) => (
                <p key={idx} className="text-sm">
                  {p.currency} {p.price}{" "}
                  {p.discount > 0 && (
                    <span className="line-through text-gray-400">{p.price}</span>
                  )} → Final: {p.finalPrice}
                </p>
              ))}
            </div>
          )}

          <p className="text-sm">Stock: {c.stock}</p>

          <ActionButton title={c.colorName} isEmpty={c.stock === 0} />
        </div>
      ))}
    </CardContent>
  </Card>
);

/* ---------------- MAIN DIALOG ---------------- */
interface Props {
  open: boolean;
  onClose: () => void;
  data: ProductModelDetailsDTO | null;
}

export function ModelDetailsDialog({ open, onClose, data }: Props) {
  const [selected, setSelected] = React.useState<string | null>(null);

  if (!data) return null;

  const renderContent = () => {
    switch (selected) {
      case "specifications":
        return renderKeyValueList("Specifications", data.specifications);
      case "productSpecifications":
        return renderKeyValueList(
          "Product Specifications",
          data.productSpecifications
        );
      case "productFeatures":
        return renderKeyValueList("Product Features", data.productFeatures);
      case "productFeaturesIcons":
        return renderIcons("Feature Icons", data.productFeaturesIcons);
      case "warranty":
        return renderKeyValueList("Warranty", data.warranty);
      case "standardParameters":
        return renderParamIcons("Standard Parameters", data.standardParameters);
      case "optiomalParameters":
        return renderParamIcons("Optional Parameters", data.optiomalParameters);
      case "schem":
        return renderSellScheme(data.schem);
      case "colors":
        return renderColors(data.colors);
      default:
        return <p className="text-muted-foreground">Select a section</p>;
    }
  };

  const menu = [
    "specifications",
    "productSpecifications",
    "productFeatures",
    "productFeaturesIcons",
    "colors",
    "warranty",
    "standardParameters",
    "optiomalParameters",
    "schem",
  ];

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="p-0 min-w-[1200px] max-h-[700px] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="sr-only">Model Details</DialogTitle>
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
