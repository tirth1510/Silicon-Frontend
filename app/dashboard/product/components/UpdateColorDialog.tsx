/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { updateColorBySection } from "@/services/model.api";
import { Label } from "@/components/ui/label";
import { 
  Trash2, Loader2, Save, X, Palette, 
  IndianRupee, Package, ImageIcon, ImagePlus, Layout, UploadCloud, RefreshCcw, Check 
} from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onClose: () => void;
  productId: string;
  modelId: string;
  colorId: string;
  colorData: any;
  onSuccess: () => void;
}

export default function UpdateColorDialog({
  open,
  onClose,
  productId,
  modelId,
  colorId,
  colorData,
  onSuccess,
}: Props) {
  const [colorName, setColorName] = useState("");
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [stock, setStock] = useState(0);

  const [mainImage, setMainImage] = useState<File | undefined>(undefined);
  const [productImages, setProductImages] = useState<File[]>([]);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);

  const [deleteProductIndexes, setDeleteProductIndexes] = useState<number[]>([]);
  const [deleteGalleryIndexes, setDeleteGalleryIndexes] = useState<number[]>([]);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open && colorData) {
      setColorName(colorData.colorName || "");
      setPrice(colorData.colorPrice?.[0]?.price || 0);
      setDiscount(colorData.colorPrice?.[0]?.discount || 0);
      setStock(colorData.stock || 0);
      setMainImage(undefined);
      setProductImages([]);
      setGalleryImages([]);
      setDeleteProductIndexes([]);
      setDeleteGalleryIndexes([]);
    }
  }, [colorData, open]);

  const handleFileChange = (setter: any, currentFiles: File[], e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (currentFiles.length + files.length > 5) {
      toast.error("Limit: Maximum 5 new images allowed per sync");
      return;
    }
    setter([...currentFiles, ...files]);
  };

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await updateColorBySection(productId, modelId, colorId, "details", {
        colorName, price, discount, stock,
      });

      if (mainImage || productImages.length || galleryImages.length || deleteProductIndexes.length || deleteGalleryIndexes.length) {
        await updateColorBySection(productId, modelId, colorId, "images", {
          mainImage, productImages, galleryImages, deleteProductIndexes, deleteGalleryIndexes,
        });
      }

      toast.success("Assets Updated Successfully!");
      onSuccess();
      onClose();
    } catch (err: any) {
      toast.error(err.message || "Sync error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="w-[98vw] max-w-7xl h-[92vh] overflow-hidden p-0 flex flex-col border-none shadow-2xl rounded-[3rem]">
        
        {/* --- HEADER --- */}
        <div className="px-10 py-6 bg-blue-900 text-white flex justify-between items-center shrink-0">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center border border-white/20">
              <Palette className="w-6 h-6 text-white" />
            </div>
            <div>
              <DialogTitle className="text-2xl font-black tracking-tight uppercase">Update Variant Media</DialogTitle>
              <DialogDescription className="text-blue-200/70 font-bold uppercase text-[9px] tracking-[0.2em] mt-0.5">
                Model: {colorData?.colorName || 'Variant Asset Control'}
              </DialogDescription>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors"><X size={24} /></button>
        </div>

        <Tabs defaultValue="info" className="flex-1 flex flex-col overflow-hidden">
          <div className="px-10 py-4 bg-slate-50 border-b shrink-0">
            <TabsList className="bg-transparent h-auto gap-4 p-0">
              {[
                { id: "info", label: "Price & Stock", icon: Package },
                { id: "main", label: "Main Thumbnail", icon: ImageIcon },
                { id: "product", label: "Product Views", icon: Layout },
                { id: "gallery", label: "Gallery", icon: ImagePlus },
              ].map((tab) => (
                <TabsTrigger key={tab.id} value={tab.id} className="data-[state=active]:bg-blue-900 data-[state=active]:text-white rounded-2xl px-6 py-2.5 font-black uppercase text-[10px] tracking-widest border border-slate-200 shadow-sm transition-all">
                  <tab.icon className="w-4 h-4 mr-2" /> {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
          </div>

          <div className="flex-1 overflow-y-auto px-10 py-10 bg-white scrollbar-hide">
            <div className="max-w-6xl mx-auto space-y-12">
              
              {/* --- PRICE & STOCK TAB --- */}
              <TabsContent value="info" className="m-0 outline-none animate-in fade-in">
                 <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                    <div className="space-y-6">
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Color Display Name</Label>
                            <Input value={colorName} onChange={(e) => setColorName(e.target.value)} className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-5" />
                        </div>
                        <div className="space-y-2">
                            <Label className="text-[10px] font-black uppercase text-blue-900 tracking-widest ml-1">Stock Availability</Label>
                            <Input type="number" value={stock} onChange={(e) => setStock(+e.target.value)} className="h-14 bg-slate-50 border-slate-200 rounded-2xl font-bold px-5" />
                        </div>
                    </div>
                    <div className="bg-blue-900 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-blue-900/30">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-blue-300 mb-6 flex items-center gap-2"><IndianRupee size={14} /> Price Engine</h4>
                        <div className="grid grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold uppercase text-blue-200 opacity-60">Base Price</Label>
                                <Input type="number" value={price} onChange={(e) => setPrice(+e.target.value)} className="bg-white/10 border-white/20 h-12 rounded-xl font-black text-white text-lg" />
                            </div>
                            <div className="space-y-2">
                                <Label className="text-[9px] font-bold uppercase text-blue-200 opacity-60">Discount %</Label>
                                <Input type="number" value={discount} onChange={(e) => setDiscount(+e.target.value)} className="bg-white/10 border-white/20 h-12 rounded-xl font-black text-white text-lg" />
                            </div>
                        </div>
                        <div className="mt-8 pt-6 border-t border-white/10 flex justify-between items-end">
                            <div><p className="text-[10px] font-black uppercase text-blue-300">Net Payable</p><h2 className="text-4xl font-black mt-1">₹{(price - (price * discount / 100)).toLocaleString()}</h2></div>
                            {discount > 0 && <span className="bg-green-500 text-white px-3 py-1 rounded-full text-[9px] font-black uppercase mb-1">Savings Active</span>}
                        </div>
                    </div>
                 </div>
              </TabsContent>

              {/* --- MAIN THUMBNAIL TAB --- */}
              <TabsContent value="main" className="m-0 outline-none">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                  <div className="p-8 bg-slate-50 border border-slate-100 rounded-[2.5rem] text-center">
                    <Label className="text-[10px] font-black uppercase text-blue-900 block mb-6">Currently Active Thumbnail</Label>
                    <div className="relative aspect-square max-w-[280px] mx-auto rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                      {colorData.imageUrl ? <Image src={colorData.imageUrl} alt="Main" fill className="object-cover" /> : <div className="h-full w-full flex items-center justify-center text-slate-300 uppercase font-black text-[10px]">No Asset</div>}
                    </div>
                  </div>
                  <div className="flex flex-col justify-center space-y-6">
                    <div className="p-10 border-4 border-dashed border-slate-100 rounded-[3rem] text-center hover:border-blue-200 transition-all bg-white group">
                      <ImageIcon size={48} className="mx-auto text-slate-200 group-hover:text-blue-500 mb-4 transition-transform group-hover:scale-110" />
                      <Label className="cursor-pointer block">
                        <span className="bg-blue-900 text-white px-8 py-3.5 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl block w-fit mx-auto">Replace Thumbnail</span>
                        <Input type="file" accept="image/*" className="hidden" onChange={(e) => setMainImage(e.target.files?.[0])} />
                      </Label>
                    </div>
                    {mainImage && (
                      <div className="flex items-center gap-4 p-4 bg-green-50 border-2 border-green-100 rounded-3xl animate-in zoom-in-95">
                        <img src={URL.createObjectURL(mainImage)} className="w-20 h-20 rounded-2xl object-cover border-2 border-white shadow-md" alt="New" />
                        <div><p className="text-[10px] font-black text-green-700 uppercase">Ready for replacement</p><p className="text-[10px] font-medium text-green-600 truncate max-w-[200px]">{mainImage.name}</p></div>
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>

              {/* --- PRODUCT VIEWS & GALLERY COMMON HANDLER --- */}
              {['product', 'gallery'].map((tabType) => (
                <TabsContent key={tabType} value={tabType} className="m-0 outline-none space-y-12">
                    {/* 1. Existing Media List */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4"><h4 className="font-black text-blue-900 uppercase text-xs tracking-widest">Active Server Assets</h4><div className="h-px flex-1 bg-slate-100" /></div>
                        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-6">
                            {(tabType === 'product' ? colorData.productImageUrl : colorData.productGallery)?.map((img: any, i: number) => {
                                const isDeleted = tabType === 'product' ? deleteProductIndexes.includes(i) : deleteGalleryIndexes.includes(i);
                                return (
                                    <div key={i} className={`relative aspect-square rounded-[2rem] overflow-hidden border-2 transition-all ${isDeleted ? 'border-red-500 opacity-30 grayscale ring-4 ring-red-50' : 'border-slate-100 shadow-sm hover:shadow-xl'}`}>
                                        <Image src={img.url} alt="Server" fill className="object-cover" />
                                        {!isDeleted && (
                                            <div className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                                <Label className="cursor-pointer bg-white text-blue-900 px-3 py-1.5 rounded-xl font-black text-[9px] uppercase flex items-center gap-1.5 hover:bg-blue-50">
                                                    <RefreshCcw size={10} /> Replace
                                                    <Input type="file" className="hidden" onChange={(e) => handleFileChange(tabType === 'product' ? setProductImages : setGalleryImages, tabType === 'product' ? productImages : galleryImages, e)} />
                                                </Label>
                                                <Button size="sm" variant="destructive" className="rounded-xl h-7 px-3 font-black text-[9px] uppercase flex items-center gap-1.5" onClick={() => tabType === 'product' ? setDeleteProductIndexes([...deleteProductIndexes, i]) : setDeleteGalleryIndexes([...deleteGalleryIndexes, i])}>
                                                    <Trash2 size={10} /> Delete
                                                </Button>
                                            </div>
                                        )}
                                        {isDeleted && (
                                            <button onClick={() => tabType === 'product' ? setDeleteProductIndexes(p => p.filter(idx => idx !== i)) : setDeleteGalleryIndexes(p => p.filter(idx => idx !== i))} className="absolute inset-0 flex flex-col items-center justify-center text-white bg-red-600/90 font-black text-[8px] uppercase p-2 text-center">
                                                <RefreshCcw size={20} className="mb-1" /> Restore Asset
                                            </button>
                                        )}
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    {/* 2. New Upload Zone */}
                    <div className="p-8 border-4 border-dashed border-slate-100 rounded-[2.5rem] text-center bg-slate-50/50 hover:bg-slate-50 transition-all group">
                        <UploadCloud size={40} className="mx-auto text-slate-200 group-hover:text-blue-400 mb-4 transition-colors" />
                        <Label className="cursor-pointer">
                            <span className="bg-blue-900 text-white px-8 py-3 rounded-2xl font-black uppercase text-[10px] tracking-widest shadow-xl block w-fit mx-auto transition-transform active:scale-95">Add to {tabType} Queue</span>
                            <Input type="file" multiple accept="image/*" className="hidden" onChange={(e) => handleFileChange(tabType === 'product' ? setProductImages : setGalleryImages, tabType === 'product' ? productImages : galleryImages, e)} />
                        </Label>
                        <p className="mt-3 text-[9px] font-bold text-slate-400 uppercase tracking-widest">Max 5 new images per batch</p>
                    </div>

                    {/* 3. New List Bottom (Queue) */}
                    {(tabType === 'product' ? productImages : galleryImages).length > 0 && (
                        <div className="space-y-4 pt-6 border-t border-blue-50">
                            <h4 className="font-black text-blue-600 uppercase text-[10px] tracking-widest flex items-center gap-2"><Check size={14} /> New Queue list (Ready to Sync)</h4>
                            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                                {(tabType === 'product' ? productImages : galleryImages).map((file: File, i: number) => (
                                    <div key={i} className="relative aspect-square rounded-[1.5rem] overflow-hidden border-4 border-blue-500 shadow-2xl animate-in zoom-in-90">
                                        <img src={URL.createObjectURL(file)} className="h-full w-full object-cover" alt="New" />
                                        <button onClick={() => tabType === 'product' ? setProductImages(p => p.filter((_, idx) => idx !== i)) : setGalleryImages(p => p.filter((_, idx) => idx !== i))} className="absolute top-2 right-2 bg-red-600 text-white p-1.5 rounded-full shadow-lg hover:scale-110 transition-transform">
                                            <X size={12} strokeWidth={4} />
                                        </button>
                                        <div className="absolute bottom-0 inset-x-0 bg-blue-600/90 py-1 text-[8px] text-white font-black uppercase text-center backdrop-blur-sm">New Asset</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </TabsContent>
              ))}

            </div>
          </div>
        </Tabs>

        {/* --- STICKY FOOTER --- */}
        <div className="px-10 py-6 bg-white border-t border-slate-100 flex justify-between items-center shrink-0 rounded-b-[3rem]">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2"><Check className="text-green-500" /> Confirm all media changes before syncing</p>
          <div className="flex gap-4">
            <Button variant="ghost" onClick={onClose} disabled={loading} className="rounded-2xl px-8 h-12 font-black uppercase text-[10px] tracking-widest text-slate-400">Cancel</Button>
            <Button onClick={handleSubmit} disabled={loading} className="bg-blue-900 hover:bg-slate-950 text-white shadow-xl shadow-blue-900/20 px-10 h-12 rounded-2xl font-black uppercase text-[10px] tracking-widest border-b-4 border-blue-950 active:border-b-0 active:translate-y-1 transition-all">
              {loading ? (
                <div className="flex items-center gap-2"><Loader2 className="w-4 h-4 animate-spin" /><span>Pushing Data...</span></div>
              ) : (
                <div className="flex items-center gap-2"><Save className="w-4 h-4" /><span>Finalize Sync</span></div>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}