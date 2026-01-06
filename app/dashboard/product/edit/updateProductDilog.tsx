/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Pencil, Check, X } from "lucide-react";
import { updateProduct } from "@/services/model.api";

interface UpdateProductDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  defaultValues: {
    productTitle: string;
    productCategory?: string;
    description?: string;
  };
  onSuccess?: () => void;
}

export default function UpdateProductDialog({
  open,
  onClose,
  productId,
  defaultValues,
  onSuccess,
}: UpdateProductDialogProps) {
  const [values, setValues] = useState({
    productTitle: "",
    productCategory: "",
    description: "",
  });

  const [editing, setEditing] = useState({
    productTitle: false,
    productCategory: false,
    description: false,
  });

  const [loadingField, setLoadingField] = useState<string | null>(null);

  /* Alert state */
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  /* Sync values */
  useEffect(() => {
    if (open) {
      setValues({
        productTitle: defaultValues.productTitle || "",
        productCategory: defaultValues.productCategory || "",
        description: defaultValues.description || "",
      });

      setEditing({
        productTitle: false,
        productCategory: false,
        description: false,
      });

      setShowAlert(false);
    }
  }, [open, defaultValues]);

  const handleUpdate = async (field: keyof typeof values) => {
    try {
      setLoadingField(field);

      await updateProduct(productId, {
        [field]: values[field],
      });

      setEditing((prev) => ({ ...prev, [field]: false }));

      setAlertType("success");
      setAlertMessage("Updated successfully");
      setShowAlert(true);

      onSuccess?.();

      // ✅ auto close dialog on success
      setTimeout(() => {
        setShowAlert(false);
        onClose();
      }, 2000);
    } catch (error: any) {
      setAlertType("error");
      setAlertMessage(
        error?.response?.data?.message || "Update failed. Please try again."
      );
      setShowAlert(true);

      // ❌ dialog stays open on error
      setTimeout(() => setShowAlert(false), 3000);
    } finally {
      setLoadingField(null);
    }
  };

  const renderField = (label: string, field: keyof typeof values) => (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-start gap-2">
        {field === "description" ? (
          <Textarea
            rows={3}
            value={values[field]}
            disabled={!editing[field]}
            onChange={(e) =>
              setValues({ ...values, [field]: e.target.value })
            }
          />
        ) : (
          <Input
            value={values[field]}
            disabled={!editing[field]}
            onChange={(e) =>
              setValues({ ...values, [field]: e.target.value })
            }
          />
        )}

        {!editing[field] ? (
          <Button
            variant="ghost"
            size="icon"
            onClick={() =>
              setEditing((prev) => ({ ...prev, [field]: true }))
            }
          >
            <Pencil size={16} />
          </Button>
        ) : (
          <>
            <Button
              size="icon"
              variant="ghost"
              disabled={loadingField === field}
              onClick={() => handleUpdate(field)}
            >
              <Check size={16} />
            </Button>

            <Button
              size="icon"
              variant="ghost"
              onClick={() =>
                setEditing((prev) => ({ ...prev, [field]: false }))
              }
            >
              <X size={16} />
            </Button>
          </>
        )}
      </div>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md space-y-4">
        <DialogHeader>
          <DialogTitle>Edit Product</DialogTitle>
        </DialogHeader>

        {renderField("Product Name", "productTitle")}
        {renderField("Category", "productCategory")}
        {renderField("Description", "description")}

        {/* ✅ Alert UNDER dialog content */}
        {showAlert && (
          <Alert
            variant={alertType === "error" ? "destructive" : "default"}
            className="mt-4"
          >
            <AlertTitle>
              {alertType === "error" ? "Error" : "Success"}
            </AlertTitle>
            <AlertDescription>{alertMessage}</AlertDescription>
          </Alert>
        )}
      </DialogContent>
    </Dialog>
  );
}
