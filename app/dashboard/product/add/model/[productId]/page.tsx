"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

import BasicInfoTab from "./components/BasicInfoTab";
import Step2ModelDetails from "./components/modelTab";
import Step3ColorVariant from "./components/colorTab";
import Step4ModelFeatures from "./components/iconsTab";

export default function CreateProductPage() {
  const params = useParams();

  // ✅ Type narrowing (this is what you were missing)
  const productId =
    typeof params?.productId === "string" ? params.productId : null;

  const [activeTab, setActiveTab] = useState("basic");
  const [modelId, setModelId] = useState<string | null>(null);

  if (!productId) {
    return (
      <div className="text-center text-red-500">
        Invalid or missing product ID
      </div>
    );
  }

  return (
    <div className="min-h-200 bg-gray-100 flex items-center justify-center m-2">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg border">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          {/* ---------------- Tabs ---------------- */}
          <div className="flex justify-center">
            <TabsList className="flex gap-4 bg-gray-100 p-2 rounded-lg">
              <TabsTrigger value="basic">Add Model</TabsTrigger>
              <TabsTrigger value="models" disabled={!modelId}>
                Model Details
              </TabsTrigger>
              <TabsTrigger value="colors" disabled={!modelId}>
                Colors & Price
              </TabsTrigger>
              <TabsTrigger value="icon" disabled={!modelId}>
                Product Icons
              </TabsTrigger>
            </TabsList>
          </div>

          {/* ---------------- Step 1 ---------------- */}
          <TabsContent value="basic">
            <BasicInfoTab
              productId={productId}
              onSuccess={(newModelId) => {
                setModelId(newModelId);
                setActiveTab("models");
              }}
            />
          </TabsContent>

          {/* ---------------- Step 2 ---------------- */}
          <TabsContent value="models">
            {modelId && (
              <Step2ModelDetails
                productId={productId}
                modelId={modelId}
                onNext={() => setActiveTab("colors")}
              />
            )}
          </TabsContent>

          {/* ---------------- Step 3 ---------------- */}
          <TabsContent value="colors">
            {modelId && (
              <Step3ColorVariant
                productId={productId}
                modelId={modelId}
                onNext={() => setActiveTab("icon")}
              />
            )}
          </TabsContent>

          {/* ---------------- Step 4 ---------------- */}
          <TabsContent value="icon">
            {modelId && (
              <Step4ModelFeatures
                productId={productId}
                modelId={modelId}
                onNext={() => alert("Model setup completed")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
