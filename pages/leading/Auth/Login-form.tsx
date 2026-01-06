/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useLogin } from "@/hooks/uselogin";
import { googleLoginService } from "@/services/auth.service";

import { toast } from "sonner";
import { useRouter } from "next/navigation";
import GoogleLoginButton from "./googlebutton";

export function LoginForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();
  const { mutate: login, isPending } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleGoogleLogin = async (credentialResponse: any) => {
    try {
      const data = await googleLoginService(credentialResponse.credential);

      console.log("Login success:", data);
      // redirect or update auth state here
    } catch (err: any) {
      console.error(err.message);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ Brutal but correct validation
    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }

    if (!password) {
      toast.warning("Password is required");
      return;
    }

    login(
      { email, password },
      {
        onSuccess: (res: any) => {
          toast.success("Login successful");

          const role = res?.user?.role;

          if (role === "admin") {
            router.push("/dashboard");
          } else {
            router.push("/");
          }
        },
        onError: (err: any) => {
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Invalid credentials"
          );
        },
      }
    );
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 mt-10">
        <CardContent className="grid p-0 md:grid-cols-2">
          {/* Left image */}
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/image2.png"
              alt="Login illustration"
              fill
              priority
              className="object-cover"
            />
          </div>

          {/* Form */}
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Welcome <span className="text-blue-800">Back</span>
                </h1>
                <p className="text-muted-foreground">Login to your account</p>
              </div>

              {/* Google login */}
              <Field>
                <GoogleLoginButton />
              </Field>

              <FieldSeparator>Or continue with</FieldSeparator>

              {/* Email */}
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              {/* Password */}
              <Field>
                <div className="flex items-center">
                  <FieldLabel htmlFor="password">Password</FieldLabel>
                  <Link
                    href="/forgot-password"
                    className="ml-auto text-sm hover:underline"
                  >
                    Forgot your password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>

              {/* Submit */}
              <Field>
                <Button
                  type="submit"
                  disabled={isPending}
                  className="w-full border-2 border-blue-800 bg-white text-blue-800 hover:bg-blue-50 disabled:cursor-not-allowed"
                >
                  {isPending ? "Please wait..." : "Login"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-blue-700 font-semibold">
                  Sign up
                </Link>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our{" "}
        <Link href="/terms" className="text-blue-700 font-semibold">
          Terms
        </Link>{" "}
        and{" "}
        <Link href="/privacy" className="text-blue-700 font-semibold">
          Privacy Policy
        </Link>
        .
      </FieldDescription>
    </div>
  );
}
