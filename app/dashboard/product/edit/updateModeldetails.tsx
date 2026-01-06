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
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";
import { Pencil, Check, X } from "lucide-react";
import { updateModel } from "@/services/model.api";

interface UpdateModelDialogProps {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  defaultValues: {
    modelName: string;
    status: "Live" | "Padding" | "Enquiry";
  };
  onSuccess?: () => void;
}

export default function UpdateModelDialog({
  open,
  onClose,
  productId,
  modelId,
  defaultValues,
  onSuccess,
}: UpdateModelDialogProps) {
  const [values, setValues] = useState({
    modelName: "",
    status: "Padding" as "Live" | "Padding" | "Enquiry",
  });

  const [editing, setEditing] = useState({
    modelName: false,
    status: false,
  });

  const [loadingField, setLoadingField] = useState<string | null>(null);

  /* Alert state */
  const [showAlert, setShowAlert] = useState(false);
  const [alertType, setAlertType] = useState<"success" | "error">("success");
  const [alertMessage, setAlertMessage] = useState("");

  /* Sync default values */
  useEffect(() => {
    if (open) {
      setValues({
        modelName: defaultValues.modelName || "",
        status: defaultValues.status || "",
      });

      setEditing({
        modelName: false,
        status: false,
      });

      setShowAlert(false);
    }
  }, [open, defaultValues]);

  const handleUpdate = async (field: keyof typeof values) => {
    try {
      setLoadingField(field);

      await updateModel(productId, modelId, {
        [field]: values[field],
      });

      setEditing((prev) => ({ ...prev, [field]: false }));

      setAlertType("success");
      setAlertMessage("Model updated successfully");
      setShowAlert(true);

      onSuccess?.();

      // ✅ auto-close dialog after success
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

  const renderField = (
    label: string,
    field: keyof typeof values,
    type: "text" | "select" = "text"
  ) => (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>

      <div className="flex items-center gap-2">
        {type === "text" ? (
          <Input
            value={values[field]}
            disabled={!editing[field]}
            onChange={(e) =>
              setValues({ ...values, [field]: e.target.value })
            }
          />
        ) : (
          <select
            className="w-full rounded-md border px-3 py-2 text-sm disabled:opacity-60"
            disabled={!editing[field]}
            value={values[field]}
            onChange={(e) =>
              setValues({
                ...values,
                [field]: e.target.value as "Live" | "Padding" | "Enquiry",
              })
            }
          >
            <option value="Live">Live</option>
            <option value="Padding">Padding</option>
            <option value="Enquiry">Enquiry</option>
          </select>
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
          <DialogTitle>Edit Model</DialogTitle>
        </DialogHeader>

        {renderField("Model Name", "modelName")}
        {renderField("Status", "status", "select")}

        {/* ✅ Alert under dialog content */}
        {showAlert && (
          <Alert
            variant={alertType === "error" ? "destructive" : "default"}
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
