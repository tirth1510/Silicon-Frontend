"use client";

import { AppReadyProvider } from "@/contexts/app-ready-context";
import { AppLoadOverlay } from "@/components/app-load-overlay";
import { AppReadyOnRoute } from "@/components/app-ready-on-route";
import ConditionalLayout from "@/components/conditional-layout";
import { Toaster } from "@/components/ui/sonner";

export function LayoutWithSplash({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AppReadyProvider>
      <AppReadyOnRoute />
      <ConditionalLayout>
        <Toaster />
        {children}
      </ConditionalLayout>
      <AppLoadOverlay />
    </AppReadyProvider>
  );
}
