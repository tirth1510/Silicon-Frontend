"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { updateProductModelFeatures } from "@/services/product.api";
import { Button } from "@/components/ui/button";
import { AiOutlineCheck } from "react-icons/ai";
import {
  FaHeartbeat,
  FaTemperatureHigh,
  FaLungs,
  FaTint,
  FaRegHeart,
} from "react-icons/fa";
import { Trash2, Plus, Loader2, CheckCircle2 } from "lucide-react";
import { toast } from "sonner";

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
  const [featuresIcons, setFeaturesIcons] = useState<string[]>(
    initialFeatures?.productFeaturesIcons || [""],
  );
  const [standardParameters, setStandardParameters] = useState<string[]>(
    initialFeatures?.standardParameters?.map((p) => p.iconName) || [],
  );
  const [optiomalParameters, setOptiomalParameters] = useState<string[]>(
    initialFeatures?.optiomalParameters?.map((p) => p.iconName) || [],
  );

  const mutation = useMutation({
    mutationFn: () =>
      updateProductModelFeatures(productId, modelId, {
        productFeaturesIcons: featuresIcons.filter(
          (icon) => icon.trim() !== "",
        ),
        standardParameters: standardParameters.map((iconName) => ({
          iconName,
        })),
        optiomalParameters: optiomalParameters.map((iconName) => ({
          iconName,
        })),
      }),
    onSuccess: () => {
      toast.success("Features updated successfully");
      onNext();
    },
    onError: () => toast.error("Failed to update features"),
  });

  const toggleSelection = (
    value: string,
    list: string[],
    setList: (arr: string[]) => void,
  ) => {
    setList(
      list.includes(value) ? list.filter((v) => v !== value) : [...list, value],
    );
  };

  const removeFeatureIcon = (index: number) => {
    if (featuresIcons.length > 1) {
      setFeaturesIcons(featuresIcons.filter((_, i) => i !== index));
    }
  };

  return (
    <div className="space-y-10 max-w-4xl mx-auto p-1">
      {/* 2. PARAMETERS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Standard Parameters */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase text-blue-900 tracking-widest flex items-center gap-2">
            <CheckCircle2 size={14} /> Standard Parameters
          </label>
          <div className="grid grid-cols-2 gap-3">
            {STANDARD_PARAMETER_OPTIONS.map((opt) => {
              const isSelected = standardParameters.includes(opt.name);
              return (
                <div
                  key={opt.name}
                  onClick={() =>
                    toggleSelection(
                      opt.name,
                      standardParameters,
                      setStandardParameters,
                    )
                  }
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                    isSelected
                      ? "bg-blue-900 border-blue-900 text-white shadow-lg"
                      : "bg-white border-slate-100 text-slate-600 hover:border-blue-200"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${isSelected ? "bg-white/20" : "bg-slate-100"}`}
                  >
                    {opt.icon}
                  </div>
                  <span className="text-xs font-black tracking-tighter leading-none">
                    {opt.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Optional Parameters */}
        <div className="space-y-4">
          <label className="text-xs font-black uppercase text-slate-500 tracking-widest flex items-center gap-2">
            <Plus size={14} /> Optional Parameters
          </label>
          <div className="grid grid-cols-2 gap-3">
            {OPTIONAL_PARAMETER_OPTIONS.map((opt) => {
              const isSelected = optiomalParameters.includes(opt.name);
              return (
                <div
                  key={opt.name}
                  onClick={() =>
                    toggleSelection(
                      opt.name,
                      optiomalParameters,
                      setOptiomalParameters,
                    )
                  }
                  className={`flex items-center gap-3 p-3 rounded-2xl cursor-pointer border-2 transition-all duration-300 ${
                    isSelected
                      ? "bg-[#00B5AD] border-[#00B5AD] text-white shadow-lg"
                      : "bg-white border-slate-100 text-slate-600 hover:border-teal-100"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg ${isSelected ? "bg-white/20" : "bg-slate-100"}`}
                  >
                    {opt.icon}
                  </div>
                  <span className="text-xs font-black tracking-tighter leading-none">
                    {opt.name}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* 3. SAVE BUTTON */}
      <div className="pt-8 border-t flex justify-end">
        <Button
          size="lg"
          onClick={() => mutation.mutate()}
          disabled={mutation.isPending}
          className="bg-blue-900 hover:bg-blue-800 px-12 py-6 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-blue-900/20"
        >
          {mutation.isPending ? (
            <>
              <Loader2 className="mr-2 animate-spin" size={20} /> Saving...
            </>
          ) : (
            "Save & Continue"
          )}
        </Button>
      </div>
    </div>
  );
}
