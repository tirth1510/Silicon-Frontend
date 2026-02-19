/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Plus, Trash2, Loader2, Save, X, FileText, Settings, Sparkles, ShieldCheck } from "lucide-react";
import { updateModelDetailsBySection } from "@/services/model.api";
import { toast } from "sonner";

/* ---------------- TYPES ---------------- */

type SpecificationItem = { points: string; _id?: string; };
type KeyValueItem = { key: string; value: string; _id?: string; };
type PointsItem = { points: string; _id?: string; };

export interface ModelDetails {
  specifications?: SpecificationItem[];
  productSpecifications?: KeyValueItem[];
  productFeatures?: KeyValueItem[];
  warranty?: PointsItem[];
}

type SectionKey = keyof ModelDetails;

type Props = {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  modelDetails: ModelDetails;
  onSuccess: () => void;
};

const MAX_ITEMS = 15;

const SECTIONS_CONFIG = [
  { id: "specifications", label: "Specifications", icon: FileText },
  { id: "productSpecifications", label: "Product Specs", icon: Settings },
  { id: "productFeatures", label: "Features", icon: Sparkles },
  { id: "warranty", label: "Warranty", icon: ShieldCheck },
];

/* ---------------- COMPONENT ---------------- */

export default function UpdateModelDetailsDialog({
  open,
  onClose,
  productId,
  modelId,
  modelDetails,
  onSuccess,
}: Props) {
  const [activeSection, setActiveSection] = useState<SectionKey>("specifications");
  const [data, setData] = useState<ModelDetails>({
    specifications: [],
    productSpecifications: [],
    productFeatures: [],
    warranty: [],
  });
  const [saving, setSaving] = useState(false);

  /* ---------- INIT STATE ---------- */
  useEffect(() => {
    setData({
      specifications: modelDetails.specifications || [],
      productSpecifications: modelDetails.productSpecifications || [],
      productFeatures: modelDetails.productFeatures || [],
      warranty: modelDetails.warranty || [],
    });
  }, [modelDetails]);

  /* ---------- HANDLERS ---------- */

  const handleChange = (field: SectionKey, index: number, key: string, value: string) => {
    const updated = [...(data[field] || [])];
    updated[index] = { ...updated[index], [key]: value };
    setData({ ...data, [field]: updated });
  };

  const handleAdd = (field: SectionKey) => {
    const updated = [...(data[field] || [])];
    if (updated.length >= MAX_ITEMS) {
      toast.error(`Maximum ${MAX_ITEMS} items allowed`);
      return;
    }
    if (field === "specifications" || field === "warranty") {
      updated.push({ points: "" });
    } else {
      updated.push({ key: "", value: "" });
    }
    setData({ ...data, [field]: updated });
  };

  const handleDelete = (field: SectionKey, index: number) => {
    const updated = [...(data[field] || [])];
    updated.splice(index, 1);
    setData({ ...data, [field]: updated });
  };

  const handleSave = async () => {
    if (saving) return;
    try {
      setSaving(true);
      const section = activeSection;
      const current = data[section] || [];
      
      // Validation & Cleaning
      let filtered: any[] = [];
      if (section === "specifications" || section === "warranty") {
        filtered = (current as PointsItem[]).filter(i => i.points?.trim() !== "");
      } else {
        filtered = (current as KeyValueItem[]).filter(i => i.key?.trim() || i.value?.trim());
      }

      await updateModelDetailsBySection({
        productId,
        modelId,
        section,
        data: filtered.length === 0 
          ? (section === "specifications" || section === "warranty" ? [{ points: "" }] : [{ key: "", value: "" }]) 
          : filtered,
      });

      toast.success(`${section.charAt(0).toUpperCase() + section.slice(1)} updated successfully!`);
      onSuccess();
    } catch (err: any) {
      toast.error(err.message || "Failed to update section");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="w-[98vw] max-w-7xl h-[92vh] overflow-hidden p-0 flex flex-col border-none shadow-2xl rounded-[2.5rem]">
        
        {/* --- HEADER --- */}
        <div className="px-8 py-6 bg-blue-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Settings className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">Update Specifications</DialogTitle>
              <DialogDescription className="text-blue-100/70 font-bold uppercase text-[10px] tracking-widest mt-1">
                Deep configuration for Model: {modelId.slice(-6)}
              </DialogDescription>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors">
            <X size={24} />
          </button>
        </div>

        <Tabs 
          value={activeSection} 
          onValueChange={(v) => setActiveSection(v as SectionKey)} 
          className="flex-1 flex flex-col overflow-hidden"
        >
          {/* --- TABS NAVIGATION --- */}
          <div className="px-8 py-4 bg-slate-50 border-b shrink-0">
            <TabsList className="bg-transparent h-auto gap-4 p-0">
              {SECTIONS_CONFIG.map((sec) => (
                <TabsTrigger 
                  key={sec.id} 
                  value={sec.id}
                  className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-xl px-6 py-2.5 font-black uppercase text-[10px] tracking-widest border border-slate-200 transition-all shadow-sm"
                >
                  <sec.icon className="w-4 h-4 mr-2" />
                  {sec.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          {/* --- CONTENT AREA --- */}
          <div className="flex-1 overflow-y-auto px-8 py-10 bg-white scrollbar-hide">
            <div className="max-w-5xl mx-auto">
              {SECTIONS_CONFIG.map((sec) => (
                <TabsContent key={sec.id} value={sec.id} className="m-0 outline-none animate-in fade-in slide-in-from-bottom-2 duration-400">
                  
                  {/* Empty State */}
                  {(data[sec.id as SectionKey]?.length || 0) === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 border-2 border-dashed border-slate-100 rounded-[2.5rem]">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                        <Plus className="text-slate-300 w-10 h-10" />
                      </div>
                      <p className="text-slate-400 font-black uppercase text-xs tracking-widest">No entries found in this section</p>
                    </div>
                  )}

                  {/* Dynamic Fields Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {data[sec.id as SectionKey]?.map((item: any, idx: number) => (
                      <div key={idx} className="flex gap-3 items-center bg-slate-50/50 p-4 rounded-2xl border border-slate-100 group hover:border-blue-200 transition-all">
                        {sec.id === "specifications" || sec.id === "warranty" ? (
                          <Input
                            value={item.points}
                            placeholder={`Enter ${sec.label} point...`}
                            onChange={(e) => handleChange(sec.id as SectionKey, idx, "points", e.target.value)}
                            className="bg-white h-11 border-slate-200 rounded-xl font-medium focus:ring-blue-900/10"
                          />
                        ) : (
                          <>
                            <Input
                              value={item.key}
                              placeholder="Label (e.g. Memory)"
                              onChange={(e) => handleChange(sec.id as SectionKey, idx, "key", e.target.value)}
                              className="bg-white h-11 border-slate-200 rounded-xl font-black text-xs uppercase"
                            />
                            <Input
                              value={item.value}
                              placeholder="Value (e.g. 128GB)"
                              onChange={(e) => handleChange(sec.id as SectionKey, idx, "value", e.target.value)}
                              className="bg-white h-11 border-slate-200 rounded-xl font-medium"
                            />
                          </>
                        )}
                        <Button 
                          variant="ghost" size="icon" 
                          onClick={() => handleDelete(sec.id as SectionKey, idx)}
                          className="text-slate-300 hover:text-red-600 hover:bg-red-50 rounded-xl shrink-0"
                        >
                          <Trash2 size={18} />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    onClick={() => handleAdd(sec.id as SectionKey)}
                    className="mt-8 h-14 border-2 border-dashed border-blue-200 text-blue-900 font-black uppercase text-[10px] tracking-[0.2em] w-full rounded-2xl hover:bg-blue-50 transition-all"
                    disabled={(data[sec.id as SectionKey]?.length || 0) >= MAX_ITEMS}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Add New {sec.label} Row
                  </Button>
                </TabsContent>
              ))}
            </div>
          </div>
        </Tabs>

        {/* --- STICKY FOOTER --- */}
        <div className="px-8 py-6 bg-white border-t border-slate-100 flex justify-between items-center shrink-0 rounded-b-[2.5rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
            Press Save to apply changes to the active section
          </p>
          <div className="flex gap-3">
            <Button variant="ghost" onClick={onClose} className="rounded-xl px-6 h-12 font-black uppercase text-[10px] tracking-widest text-slate-400">
              Discard
            </Button>
            <Button
              onClick={handleSave}
              disabled={saving}
              className="bg-blue-900 hover:bg-slate-900 text-white shadow-xl shadow-blue-900/20 px-10 h-12 rounded-xl font-black uppercase text-[10px] tracking-widest border-b-4 border-blue-950 active:border-b-0 active:translate-y-1 transition-all"
            >
              {saving ? (
                <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Syncing...</span></div>
              ) : (
                <div className="flex items-center gap-2"><Save className="w-4 h-4" /><span>Apply Section Changes</span></div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}