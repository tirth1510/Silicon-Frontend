import Image from "next/image";

export default function Loading() {
  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-white gap-6">
      <div className="relative w-64 h-20">
        <Image
          src="/logo.png"
          alt="Loading..."
          fill
          className="object-contain"
          priority
        />
      </div>
      
      <div className="w-48 h-1 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full bg-blue-900" style={{ animation: "progress 1.5s ease-in-out infinite" }}></div>
      </div>

      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
}