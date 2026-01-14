/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, useEffect } from "react"; // 1. Import hooks
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GoogleLoginButton() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false); // 2. Track mounting

  // 3. Set mounted to true only after component hits the browser
  useEffect(() => {
    setMounted(true);
  }, []);

  const handleGoogleLogin = async (credentialResponse: CredentialResponse) => {
    try {
      const idToken = credentialResponse?.credential;
      if (!idToken) return;

      // Use an environment variable for the URL so it works on Vercel too!
      const API_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5000";

      const res = await fetch(`${API_URL}/api/auth/google-login`, {
        method: "POST",
        credentials: "include", 
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Login failed");

      toast.success("Login successful!");
      router.push("/"); 
    } catch (error: any) {
      toast.error(error.message || "Google login error");
    }
  };

  // 4. Return null or a skeleton while building/loading
  if (!mounted) return null; 

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.error("Google login failed")}
      />
    </div>
  );
}