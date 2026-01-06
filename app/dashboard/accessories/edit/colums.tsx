import { updateProductStatusService } from "@/services/accessory.service";
import { Product } from "@/types/accessory";
import { useRouter } from "next/navigation";

export const accessoriesColumns = [
  {
    key: "productTitle",
    label: "Product Name",
    render: (row: Product) => row.productTitle,
  },
  {
    key: "productCategory",
    label: "Category",
    render: (row: Product) => row.productCategory,
  },
  {
    key: "stock",
    label: "Stock",
    render: (row: Product) => row.stock ?? 0,
  },
  {
    key: "status",
    label: "Status",
    render: (row: Product) => {
      const statusStyles: Record<string, string> = {
        Live: "bg-green-100 text-green-700",
        Padding: "bg-yellow-100 text-yellow-700",
        Enquiry: "bg-red-100 text-red-700",
      };

      const style =
        statusStyles[row.status ?? ""] ?? "bg-gray-100 text-gray-700";

      return (
        <span
          className={`px-3 py-1 rounded-full text-xs font-semibold ${style}`}
        >
          {row.status ?? "N/A"}
        </span>
      );
    },
  },
  {
    key: "actions",
    label: "Actions",
    render: (row: Product) => (
      <div className="flex gap-2">
        

        {/* SET LIVE */}
        <button
          disabled={row.status === "Live"}
          className={`px-3 py-1 text-sm font-medium rounded border
            ${
              row.status === "Live"
                ? "text-gray-400 border-gray-300 cursor-not-allowed"
                : "text-green-700 border-green-700 hover:bg-green-50"
            }`}
          onClick={async () => {
            try {
              await updateProductStatusService(row.id, "Live");
              window.location.reload(); // refresh table
            } catch (err) {
              console.error("Failed to update status", err);
            }
          }}
        >
          Live
        </button>
      </div>
    ),
  },
];
