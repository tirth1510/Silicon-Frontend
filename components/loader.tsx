"use client";

export default function Loader() {
  return (
    <div className="flex items-center justify-center">
      <div className="relative w-14 h-14">
        <div
          className="
            absolute inset-0
            rounded-full
            border-4
            border-blue-200
            border-t-blue-700
            animate-spin
          "
        />
      </div>
    </div>
  );
}
