"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import { useAppReady } from "@/contexts/app-ready-context";

/**
 * On non-landing routes, set app ready after a short delay so the splash
 * overlay does not stay visible when the user opens or reloads other pages.
 */
export function AppReadyOnRoute() {
  const pathname = usePathname();
  const { setReady } = useAppReady();

  useEffect(() => {
    if (pathname !== "/" && pathname !== null) {
      const t = setTimeout(() => setReady(true), 100);
      return () => clearTimeout(t);
    }
  }, [pathname, setReady]);

  return null;
}
