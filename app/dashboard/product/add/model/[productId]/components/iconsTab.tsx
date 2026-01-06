"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProductModelFeatures } from "@/services/product.api";
import { Button } from "@/components/ui/button";
import { AiOutlineCheck } from "react-icons/ai";
import { FaHeartbeat, FaTemperatureHigh, FaLungs, FaTint, FaRegHeart } from "react-icons/fa";

interface Props {
  productId: string;
  modelId: string;
  initialFeatures?: {
    productFeaturesIcons?: string[];
    standardParameters?: { iconName: string }[];
    optiomalParameters?: { iconName: string }[];
  };
  onNext: () => void;
}

const STANDARD_PARAMETER_OPTIONS = [
  { name: "ECG", icon: <FaHeartbeat /> },
  { name: "RESPIRATION", icon: <FaLungs /> },
  { name: "SPO2", icon: <FaTint /> },
  { name: "NIBP", icon: <FaRegHeart /> },
  { name: "TEMP", icon: <FaTemperatureHigh /> },
  { name: "PR", icon: <FaRegHeart /> },
];

const OPTIONAL_PARAMETER_OPTIONS = [
  { name: "ETCO2", icon: <FaLungs /> },
  { name: "IBP", icon: <FaRegHeart /> },
];

export default function Step4ModelFeatures({
  productId,
  modelId,
  initialFeatures,
  onNext,
}: Props) {
  const [featuresIcons, setFeaturesIcons] = useState<string[]>(initialFeatures?.productFeaturesIcons || []);
  const [standardParameters, setStandardParameters] = useState<string[]>(
    initialFeatures?.standardParameters?.map((p) => p.iconName) || []
  );
  const [optiomalParameters, setOptiomalParameters] = useState<string[]>(
    initialFeatures?.optiomalParameters?.map((p) => p.iconName) || []
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateProductModelFeatures(productId, modelId, {
        productFeaturesIcons: featuresIcons,
        standardParameters: standardParameters.map((iconName) => ({ iconName })),
        optiomalParameters: optiomalParameters.map((iconName) => ({ iconName })),
      }),
    onSuccess: () => onNext(),
  });

  const toggleSelection = (value: string, list: string[], setList: (arr: string[]) => void) => {
    if (list.includes(value)) {
      setList(list.filter((v) => v !== value));
    } else {
      setList([...list, value]);
    }
  };

  return (
    <div className="space-y-6">
      {/* Product Features Icons */}
      <div>
        <label className="font-medium text-sm">Product Features Icons</label>
        {featuresIcons.map((icon, idx) => (
          <input
            key={idx}
            value={icon}
            onChange={(e) => {
              const updated = [...featuresIcons];
              updated[idx] = e.target.value;
              setFeaturesIcons(updated);
            }}
            placeholder="Enter feature icon"
            className="mb-2 block w-full border rounded px-2 py-1"
          />
        ))}
        <Button size="sm" onClick={() => setFeaturesIcons([...featuresIcons, ""])}>
          + Add Feature Icon
        </Button>
      </div>

      {/* Standard Parameters */}
      <div>
        <label className="font-medium text-sm">Standard Parameters</label>
        <div className="border rounded p-2 max-h-60 overflow-y-auto">
          {STANDARD_PARAMETER_OPTIONS.map((opt) => (
            <div
              key={opt.name}
              className="flex justify-between items-center p-1 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSelection(opt.name, standardParameters, setStandardParameters)}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                <span>{opt.name}</span>
              </div>
              {standardParameters.includes(opt.name) && <AiOutlineCheck className="text-green-500" />}
            </div>
          ))}
        </div>
      </div>

      {/* Optional Parameters */}
      <div>
        <label className="font-medium text-sm">Optional Parameters</label>
        <div className="border rounded p-2 max-h-60 overflow-y-auto">
          {OPTIONAL_PARAMETER_OPTIONS.map((opt) => (
            <div
              key={opt.name}
              className="flex justify-between items-center p-1 cursor-pointer hover:bg-gray-100"
              onClick={() => toggleSelection(opt.name, optiomalParameters, setOptiomalParameters)}
            >
              <div className="flex items-center gap-2">
                {opt.icon}
                <span>{opt.name}</span>
              </div>
              {optiomalParameters.includes(opt.name) && <AiOutlineCheck className="text-green-500" />}
            </div>
          ))}
        </div>
      </div>

      <Button onClick={() => mutation.mutate()} disabled={mutation.isPending}>
        Save & Continue
      </Button>
    </div>
  );
}
