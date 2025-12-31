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
import { useState } from "react";
import { useLogin } from "@/hooks/uselogin";

export function LoginForm({ className, ...props }: React.ComponentProps<"div">) {
  const { mutate: login, isPending: loading, error } = useLogin();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // login({ email, password });
  };

  function loginWithGoogle(event: React.MouseEvent<HTMLButtonElement, MouseEvent>): void {
    event.preventDefault();
    // Redirect to Google OAuth endpoint or call your login logic
    window.location.href = "/api/auth/google";
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0 mt-10">
        <CardContent className="grid p-0 md:grid-cols-2">
          <div className="bg-muted relative hidden md:block">
            <Image
              src="/image2.png"
              alt="Login Image"
              fill
              className="object-cover"
            />
          </div>

          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">
                  Welcome <span className="text-blue-800">Back</span>
                </h1>
                <p className="text-muted-foreground text-balance">
                  Login to your account
                </p>
              </div>

              {/* Google Login */}
              <Field>
                <Button
                  variant="outline"
                  type="button"
                  onClick={loginWithGoogle}
                  className="w-full border-gray-500 flex items-center justify-center gap-2 py-5"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5"
                    fill="currentColor"
                  >
                    <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
                  </svg>

                  <span>Login with Google</span>
                </Button>
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
                  <a
                    href="#"
                    className="ml-auto text-sm underline-offset-2 hover:underline"
                  >
                    Forgot your password?
                  </a>
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
                  disabled={loading}
                  className="border border-blue-800 text-blue-800 bg-white hover:bg-white hover:text-blue-800 border-2"
                >
                  {loading ? "Please wait..." : "Login"}
                </Button>
              </Field>

              {error && (
                <p className="text-red-600 text-center mt-2">{error.message}</p>
              )}

              <FieldDescription className="text-center">
                Don&apos;t have an account?{" "}
                <a href="/signup" className="text-blue-700 font-semibold">Sign up</a>
              </FieldDescription>
            </FieldGroup>
          </form>
        </CardContent>
      </Card>

      <FieldDescription className="px-6 text-center">
        By continuing, you agree to our{" "}
        <a href="#" className="text-blue-700 font-semibold">Terms</a> and{" "}
        <a href="#" className="text-blue-700 font-semibold">Privacy Policy</a>.
      </FieldDescription>
    </div>
  );
}
