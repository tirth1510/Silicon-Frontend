"use client";

import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const CLIENT_ID = "507726124613-ul2vo06csdv078ggmfghtnrq0tpifutb.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode; }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        // Build ke waqt error na aaye isliye window check add hota hai default behavior mein
        staleTime: 60 * 1000,
      },
    },
  }));

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}