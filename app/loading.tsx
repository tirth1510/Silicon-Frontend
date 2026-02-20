import { Loader2 } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white gap-4">
      <Loader2 className="h-12 w-12 animate-spin text-blue-900" />
      <p className="text-sm font-medium text-slate-500 animate-pulse">Loading...</p>
    </div>
  );
}