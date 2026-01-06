"use client";

import { GoogleOAuthProvider } from "@react-oauth/google"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();
const client = "349309195310-ee43pba87mk2i0kvc0a5sj173rossika.apps.googleusercontent.com"
export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <GoogleOAuthProvider clientId={client}>
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    </GoogleOAuthProvider>
  );
}
