"use client";

import { useState } from "react";
import { GoogleOAuthProvider } from "@react-oauth/google"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const CLIENT_ID = "349309195310-ee43pba87mk2i0kvc0a5sj173rossika.apps.googleusercontent.com";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <GoogleOAuthProvider clientId={CLIENT_ID}>
      <QueryClientProvider client={queryClient}>
        {children}
      </QueryClientProvider>
    </GoogleOAuthProvider>
  );
}

