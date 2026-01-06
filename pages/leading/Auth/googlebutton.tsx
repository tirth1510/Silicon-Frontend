/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { GoogleLogin, CredentialResponse } from "@react-oauth/google";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function GoogleLoginButton() {
  const router = useRouter();

  const handleGoogleLogin = async (
    credentialResponse: CredentialResponse
  ) => {
    try {
      const idToken = credentialResponse?.credential;

      if (!idToken) {
        console.error("No Google token received");
        return;
      }

      const res = await fetch(
        "http://localhost:5000/api/auth/google-login",
        {
          method: "POST",
          credentials: "include", 
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idToken }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      toast.success("Login success:", data);

      router.push("/"); 
    } catch (error: any) {
      toast.error("Google login error:", error.message);
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleLogin}
        onError={() => console.error("Google login failed")}
      />
    </div>
  );
}
