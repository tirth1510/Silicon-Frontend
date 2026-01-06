/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";

import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

import {
  createProductService,
  ProductSpecification,
} from "@/services/accessory.service";

type TabValue = "basic" | "pricing" | "specs" | "images";

export default function CreateProductPage() {
  /* ---------------- STATE ---------------- */
  const [activeTab, setActiveTab] = useState<TabValue>("basic");

  const [form, setForm] = useState({
    productCategory: "",
    productTitle: "",
    description: "",
    price: "",
    discount: "",
    stock: "",
    specifications: [""],
    warranty: [""],
    productSpecifications: [{ key: "", value: "" }] as ProductSpecification[],
  });

  const [productImages, setProductImages] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  /* ---------------- MUTATION ---------------- */
  const { mutate, isPending } = useMutation({
    mutationFn: () =>
      createProductService(
        {
          productCategory: form.productCategory,
          productTitle: form.productTitle,
          description: form.description,
          price: Number(form.price),
          discount: Number(form.discount),
          stock: Number(form.stock),
          specifications: form.specifications.join(","),
          warranty: form.warranty.join(","),
          productSpecifications: form.productSpecifications.filter(
            (s) => s.key && s.value
          ),
        },
        { productImages, galleryImages }
      ),
    onSuccess: () => {
      setErrorMsg("");
      setSuccessMsg("Product created successfully 🎉");
    },
    onError: (err: any) => {
      setSuccessMsg("");
      setErrorMsg(err?.response?.data?.message || "Failed to create product");
    },
  });

  /* ---------------- HELPERS ---------------- */
  const updateArrayField = (
    key: "specifications" | "warranty",
    index: number,
    value: string
  ) => {
    const updated = [...form[key]];
    updated[index] = value;
    setForm({ ...form, [key]: updated });
  };

  const updateProductSpec = (
    index: number,
    field: "key" | "value",
    value: string
  ) => {
    const updated = [...form.productSpecifications];
    updated[index][field] = value;
    setForm({ ...form, productSpecifications: updated });
  };

  const next = () => {
    if (activeTab === "basic") setActiveTab("pricing");
    else if (activeTab === "pricing") setActiveTab("specs");
    else if (activeTab === "specs") setActiveTab("images");
  };

  const back = () => {
    if (activeTab === "images") setActiveTab("specs");
    else if (activeTab === "specs") setActiveTab("pricing");
    else if (activeTab === "pricing") setActiveTab("basic");
  };

  /* ---------------- UI ---------------- */
  return (
    <div className="max-w-5xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Create Product</h1>

      {/* ALERTS */}
      {successMsg && (
        <Alert>
          <AlertTitle>Success</AlertTitle>
          <AlertDescription>{successMsg}</AlertDescription>
        </Alert>
      )}

      {errorMsg && (
        <Alert variant="destructive">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errorMsg}</AlertDescription>
        </Alert>
      )}

      {/* TABS */}
      <Tabs
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as TabValue)}
        className="space-y-6"
      >
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="basic">Basic</TabsTrigger>
          <TabsTrigger value="pricing">Pricing</TabsTrigger>
          <TabsTrigger value="specs">Specifications</TabsTrigger>
          <TabsTrigger value="images">Images</TabsTrigger>
        </TabsList>

        {/* BASIC */}
        <TabsContent value="basic">
          <Card className="p-6 space-y-4">
            <Field label="Product Title">
              <Input
                value={form.productTitle}
                onChange={(e) =>
                  setForm({ ...form, productTitle: e.target.value })
                }
              />
            </Field>

            <Field label="Category">
              <Input
                value={form.productCategory}
                onChange={(e) =>
                  setForm({ ...form, productCategory: e.target.value })
                }
              />
            </Field>

            <Field label="Description">
              <Textarea
                value={form.description}
                onChange={(e) =>
                  setForm({ ...form, description: e.target.value })
                }
              />
            </Field>
          </Card>
        </TabsContent>

        {/* PRICING */}
        <TabsContent value="pricing">
          <Card className="p-6 grid grid-cols-3 gap-4">
            <Field label="Price">
              <Input
                type="number"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: e.target.value })
                }
              />
            </Field>

            <Field label="Discount">
              <Input
                type="number"
                value={form.discount}
                onChange={(e) =>
                  setForm({ ...form, discount: e.target.value })
                }
              />
            </Field>

            <Field label="Stock">
              <Input
                type="number"
                value={form.stock}
                onChange={(e) =>
                  setForm({ ...form, stock: e.target.value })
                }
              />
            </Field>
          </Card>
        </TabsContent>

        {/* SPECIFICATIONS */}
        <TabsContent value="specs">
          <Card className="p-6 space-y-6">
            {/* STRING SPECS */}
            <div className="space-y-3">
              <Label>Specifications</Label>
              {form.specifications.map((s, i) => (
                <Input
                  key={i}
                  placeholder="e.g. Fast Charging"
                  value={s}
                  onChange={(e) =>
                    updateArrayField("specifications", i, e.target.value)
                  }
                />
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setForm({
                    ...form,
                    specifications: [...form.specifications, ""],
                  })
                }
              >
                + Add Specification
              </Button>
            </div>

            {/* WARRANTY */}
            <div className="space-y-3">
              <Label>Warranty</Label>
              {form.warranty.map((w, i) => (
                <Input
                  key={i}
                  placeholder="1 Year Manufacturer Warranty"
                  value={w}
                  onChange={(e) =>
                    updateArrayField("warranty", i, e.target.value)
                  }
                />
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setForm({ ...form, warranty: [...form.warranty, ""] })
                }
              >
                + Add Warranty
              </Button>
            </div>

            {/* KEY VALUE SPECS */}
            <div className="space-y-3">
              <Label>Product Specifications (Key – Value)</Label>
              {form.productSpecifications.map((spec, i) => (
                <div key={i} className="grid grid-cols-5 gap-2">
                  <Input
                    placeholder="Key"
                    value={spec.key}
                    onChange={(e) =>
                      updateProductSpec(i, "key", e.target.value)
                    }
                  />
                  <Input
                    className="col-span-3"
                    placeholder="Value"
                    value={spec.value}
                    onChange={(e) =>
                      updateProductSpec(i, "value", e.target.value)
                    }
                  />
                  <Button
                    variant="destructive"
                    onClick={() =>
                      setForm({
                        ...form,
                        productSpecifications:
                          form.productSpecifications.filter(
                            (_, idx) => idx !== i
                          ),
                      })
                    }
                  >
                    X
                  </Button>
                </div>
              ))}
              <Button
                variant="outline"
                onClick={() =>
                  setForm({
                    ...form,
                    productSpecifications: [
                      ...form.productSpecifications,
                      { key: "", value: "" },
                    ],
                  })
                }
              >
                + Add Key–Value
              </Button>
            </div>
          </Card>
        </TabsContent>

        {/* IMAGES */}
        <TabsContent value="images">
          <Card className="p-6 space-y-4">
            <Field label="Product Images (Required)">
              <Input
                type="file"
                multiple
                onChange={(e) =>
                  setProductImages(Array.from(e.target.files || []))
                }
              />
            </Field>

            <Field label="Gallery Images">
              <Input
                type="file"
                multiple
                onChange={(e) =>
                  setGalleryImages(Array.from(e.target.files || []))
                }
              />
            </Field>
          </Card>
        </TabsContent>
      </Tabs>

      {/* NAVIGATION BUTTONS */}
      <div className="flex justify-between">
        {activeTab !== "basic" && (
          <Button variant="outline" onClick={back}>
            Back
          </Button>
        )}

        {activeTab !== "images" && (
          <Button onClick={next}>Next</Button>
        )}

        {activeTab === "images" && (
          <Button
            className="w-full"
            disabled={isPending}
            onClick={() => mutate()}
          >
            {isPending ? "Creating..." : "Create Product"}
          </Button>
        )}
      </div>
    </div>
  );
}

/* ---------------- FIELD ---------------- */
function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <Label>{label}</Label>
      {children}
    </div>
  );
}
