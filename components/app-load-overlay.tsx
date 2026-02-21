"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useAppReady } from "@/contexts/app-ready-context";

const MIN_VISIBLE_MS = 700;

export function AppLoadOverlay() {
  const { ready } = useAppReady();
  const [visible, setVisible] = useState(true);
  const [fadeOut, setFadeOut] = useState(false);
  const mountTimeRef = useRef<number>(0);
  const hasSetMountTime = useRef(false);

  useEffect(() => {
    if (!hasSetMountTime.current) {
      mountTimeRef.current = Date.now();
      hasSetMountTime.current = true;
    }
  }, []);

  useEffect(() => {
    if (!ready) return;

    const elapsed = Date.now() - mountTimeRef.current;
    const remaining = Math.max(0, MIN_VISIBLE_MS - elapsed);

    const t = setTimeout(() => {
      setFadeOut(true);
      const hideTimer = setTimeout(() => {
        setVisible(false);
      }, 300);
      return () => clearTimeout(hideTimer);
    }, remaining);

    return () => clearTimeout(t);
  }, [ready]);

  if (!visible) return null;

  return (
    <div
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white gap-6 transition-opacity duration-300"
      style={{
        opacity: fadeOut ? 0 : 1,
        pointerEvents: fadeOut ? "none" : "auto",
      }}
    >
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
        <div
          className="h-full bg-blue-900"
          style={{ animation: "progress 1.5s ease-in-out infinite" }}
        />
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
