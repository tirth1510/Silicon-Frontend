"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import BasicInfoTab from "./components/BasicInfoTab";
import Step2ModelDetails from "./components/modelTab";
import Step3ColorVariant from "./components/colorTab";
import Step4ModelFeatures from "./components/iconsTab";

export default function CreateProductPage() {
  const [activeTab, setActiveTab] = useState<string>("basic");
  const [productId, setProductId] = useState<string | null>(null);
  const [modelId, setModelId] = useState<string | null>(null);

  return (
    <div className="min-h-200 bg-gray-100 flex items-center justify-center m-2">
      <div className="w-full max-w-3xl bg-white p-6 rounded-lg shadow-lg border border-gray-200">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-6 space-x-6"
        >
          {/* Tabs List */}
          <div className="flex justify-center">
            <TabsList className="flex gap-4 rounded-lg bg-gray-100 p-2">
              <TabsTrigger value="basic">Basic Info</TabsTrigger>
              <TabsTrigger value="models" disabled={!productId}>Models</TabsTrigger>
              <TabsTrigger value="colors" disabled={!modelId}>Colors & Price</TabsTrigger>
              <TabsTrigger value="icon" disabled={!modelId}>Product Icons</TabsTrigger>
            </TabsList>
          </div>

          {/* Tabs Content */}
          <TabsContent value="basic">
            <BasicInfoTab
              onSuccess={(prodId, modId) => {
                setProductId(prodId);
                setModelId(modId);
                setActiveTab("models");
              }}
            />
          </TabsContent>

          <TabsContent value="models">
            {productId && modelId && (
              <Step2ModelDetails
                productId={productId}
                modelId={modelId}
                onNext={() => setActiveTab("colors")} // fixed
              />
            )}
          </TabsContent>

          <TabsContent value="colors">
            {productId && modelId && (
              <Step3ColorVariant
                productId={productId}
                modelId={modelId}
                onNext={() => setActiveTab("icon")}
              />
            )}
          </TabsContent>

          <TabsContent value="icon">
            {productId && modelId && (
              <Step4ModelFeatures
                productId={productId}
                modelId={modelId}
                onNext={() => alert("Product creation completed!")}
              />
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
