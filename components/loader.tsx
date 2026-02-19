"use client";

export default function Loader() {
  return (
    /* h-screen aur flex-col se content screen ke bilkul beech mein aayega */
    <div className="flex flex-col items-center justify-center min-h-[60vh] md:min-h-screen w-full bg-white/50 backdrop-blur-sm">
      <div className="relative w-10 h-10 md:w-14 md:h-14">
        <div
          className="
            absolute inset-0
            rounded-full
            border-3 md:border-4
            border-blue-100
            border-t-blue-800
            animate-spin
          "
        />
      </div>
      
      {/* Optional: Mobile par loading text chota dikhane ke liye */}
      <p className="mt-4 text-xs md:text-sm font-medium text-blue-900 animate-pulse">
        Loading...
      </p>
    </div>
  );
}