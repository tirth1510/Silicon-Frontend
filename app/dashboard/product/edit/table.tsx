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
import { productColumns } from "./colums";
import { ModelWithProductDTO } from "@/types/model";
import ProductEditDialog from "./editProductDialogBox";
import { Button } from "@/components/ui/button";

type Props = {
  data: ModelWithProductDTO[];
};

export default function ProductTable({ data }: Props) {
  const [selectedProduct, setSelectedProduct] = useState<ModelWithProductDTO | null>(null);
  const [openDialog, setOpenDialog] = useState(false);

  // Listen to the custom event from the "Edit Details" button
  useEffect(() => {
    const handler = (event: Event) => {
      const customEvent = event as CustomEvent<ModelWithProductDTO>;
      setSelectedProduct(customEvent.detail);
      setOpenDialog(true);
    };

    window.addEventListener("open-product-dialog", handler);

    return () => {
      window.removeEventListener("open-product-dialog", handler);
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
            {productColumns.map((col) => (
              <TableHead key={col.key}>{col.label}</TableHead>
            ))}
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((row) => (
            <TableRow key={row.modelId}>
              {productColumns.map((col) => (
                <TableCell key={col.key}>{col.render(row)}</TableCell>
              ))}
              <TableCell>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedProduct(row);
                    setOpenDialog(true);
                  }}
                >
                  Edit
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {selectedProduct && (
        <ProductEditDialog
          productId={selectedProduct.productId}
          modelId={selectedProduct.modelId}
          open={openDialog}
          onClose={() => {
            setOpenDialog(false);
            setSelectedProduct(null);
          }}
        />
      )}
    </>
  );
}
