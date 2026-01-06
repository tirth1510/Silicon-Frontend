"use client";

import React, { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { accessoriesColumns } from "./colums";
import { Product } from "@/types/accessory";
import ProductDetailsDialog from "./modelDetailsCard"; // your dialog file

type Props = {
  data: Product[];
};

export default function AccessoriesTable({ data }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Listen to the custom event from the "View" button
  useEffect(() => {
    const handler = (event: CustomEvent) => {
      setSelectedProduct(event.detail);
      setOpenDialog(true);
    };

    window.addEventListener("open-product-dialog", handler as EventListener);

    return () => {
      window.removeEventListener("open-product-dialog", handler as EventListener);
    };
  }, []);

  if (!Array.isArray(data) || data.length === 0) {
    return <p className="text-muted-foreground">No products found</p>;
  }

  

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {accessoriesColumns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row.id}>
              {accessoriesColumns.map((col) => (
                <TableCell key={col.key}>{col.render(row)}</TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Dialog */}
      <ProductDetailsDialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        data={selectedProduct}
      />
    </>
  );
}
