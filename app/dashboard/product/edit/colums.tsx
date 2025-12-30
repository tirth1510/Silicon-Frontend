import { ColumnDef } from "@tanstack/react-table";
import { ModelWithProductDTO, ProductModelDetailsDTO } from "@/types/model";
import { Button } from "@/components/ui/button";

export const modelColumns = (
  onViewDetails: (details: ProductModelDetailsDTO | null) => void
): ColumnDef<ModelWithProductDTO>[] => [
  {
    header: "Product",
    accessorKey: "productTitle",
  },
  {
    header: "Model",
    accessorKey: "modelName",
  },
  {
    header: "Status",
    accessorKey: "status",
  },
  {
    header: "Actions",
    cell: ({ row }) => {
      return (
        <Button size="sm" onClick={() => onViewDetails(row.original.productModelDetails)}>
          View Details
        </Button>
      );
    },
  },
];
