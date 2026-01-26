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
import { ProductModelDetailsDTO } from "@/types/model";

/* ---------------- COMMON ACTION BUTTON ---------------- */
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
      onClick={() =>
        alert(
          isEmpty
            ? `${title}: Add clicked`
            : `${title}: Update clicked`
        )
      }
    >
      {isEmpty ? "Add" : "Update"}
    </Button>
  </div>
);

interface Props {
  open: boolean;
  onClose: () => void;
  data: ProductModelDetailsDTO | null;
}

export function ModelDetailsDialog({ open, onClose, data }: Props) {
  const [selected, setSelected] = React.useState<string | null>(null);

  if (!data) return null;

  /* ---------------- RENDERERS ---------------- */

  const renderPoints = (title: string, list?: { points: string; }[]) => {
    const isEmpty = !list || list.length === 0;

    return (
      <Card className="relative min-h-[180px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-16">
          {isEmpty ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <ul className="list-disc pl-6 space-y-2 text-sm">
              {list.map((i, idx) => (
                <li key={idx}>{i.points}</li>
              ))}
            </ul>
          )}
          <ActionButton title={title} isEmpty={isEmpty} />
        </CardContent>
      </Card>
    );
  };

  const renderValueList = (
    title: string,
    list?: { value: string; }[]
  ) => {
    const isEmpty = !list || list.length === 0;

    return (
      <Card className="relative min-h-[180px]">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent className="pb-16">
          {isEmpty ? (
            <p className="text-sm text-muted-foreground">No data available</p>
          ) : (
            <ul className="list-disc pl-6 space-y-2 text-sm">
              {list.map((i, idx) => (
                <li key={idx}>{i.value}</li>
              ))}
            </ul>
          )}
          <ActionButton title={title} isEmpty={isEmpty} />
        </CardContent>
      </Card>
    );
  };

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
              const Icon =
                (Icons as any)[name] || FaQuestionCircle;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-center h-12 w-12 rounded bg-muted"
                >
                  <Icon size={22} />
                </div>
              );
            })
          )}
          <ActionButton title={title} isEmpty={isEmpty} />
        </CardContent>
      </Card>
    );
  };

  const renderParamIcons = (
    title: string,
    list?: { iconName: string; }[]
  ) => {
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
              const Icon =
                (Icons as any)[i.iconName] || FaQuestionCircle;
              return (
                <div
                  key={idx}
                  className="flex items-center justify-center h-12 w-12 rounded bg-muted"
                >
                  <Icon size={22} />
                </div>
              );
            })
          )}
          <ActionButton title={title} isEmpty={isEmpty} />
        </CardContent>
      </Card>
    );
  };

  const renderSellScheme = () => {
    const entries = Object.entries(data.schem || {});

    return (
      <Card>
        <CardHeader>
          <CardTitle>Sell Scheme</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-3">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className={`flex items-center gap-2 p-2 rounded ${v ? "bg-green-100" : "bg-muted"
                }`}
            >
              <FaCheckCircle
                className={v ? "text-green-600" : "text-gray-400"}
              />
              <span className="capitalize">
                {k.replace(/([A-Z])/g, " $1")}
              </span>
            </div>
          ))}
        </CardContent>
      </Card>
    );
  };

  const renderColors = () => (
    <Card>
      <CardHeader>
        <CardTitle>Colors</CardTitle>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.colors.map((c) => (
          <div
            key={c.colorName}
            className="border rounded p-4 space-y-2"
          >
            <p className="font-semibold">{c.colorName}</p>

            {c.imageUrl && (
              <img
                src={c.imageUrl}
                className="h-28 w-full object-contain"
                alt=""
              />
            )}

            <p>Stock: {c.stock}</p>
          </div>
        ))}
      </CardContent>
    </Card>
  );

  /* ---------------- MAIN CONTENT ---------------- */

  const renderContent = () => {
    switch (selected) {
      case "specifications":
        return renderPoints("Specifications", data.specifications);
      case "productSpecifications":
        return renderValueList(
          "Product Specifications",
          data.productSpecifications
        );
      case "productFeatures":
        return renderValueList(
          "Product Features",
          data.productFeatures
        );
      case "productFeaturesIcons":
        return renderIcons(
          "Feature Icons",
          data.productFeaturesIcons
        );
      case "warranty":
        return renderPoints("Warranty", data.warranty);
      case "standardParameters":
        return renderParamIcons(
          "Standard Parameters",
          data.standardParameters
        );
      case "optiomalParameters":
        return renderParamIcons(
          "Optional Parameters",
          data.optiomalParameters
        );
      case "schem":
        return renderSellScheme();
      case "colors":
        return renderColors();
      default:
        return (
          <p className="text-muted-foreground">
            Select a section
          </p>
        );
    }
  };

  /* ---------------- UI ---------------- */

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
          <DialogTitle className="sr-only">
            Model Details
          </DialogTitle>
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
                          {m}
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
