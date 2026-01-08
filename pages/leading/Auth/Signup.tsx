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
import { useState } from "react";
import { registerService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { toast } from "sonner";


export function SignupForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // ❌ Brutally honest validation (frontend)
    if (!username.trim()) {
      toast.warning("Username is required");
      return;
    }

    if (!email.trim()) {
      toast.warning("Email is required");
      return;
    }

    if (!password || password.length < 4) {
      toast.warning("Password must be at least 4 characters");
      return;
    }

    setLoading(true);

    try {
      const res = await registerService({
        username,
        email,
        password,
        role: "user", // DEFAULT
        imageUrl: "/default-user.png",
      });

      toast.success("Account created successfully 🎉");

      // ✅ ROLE-BASED REDIRECT
      const role = res?.role;

      if (role === "admin") {
        router.push("/dashboard");
      } else {
        router.push("/");
      }
    } catch (err: any) {
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card className="overflow-hidden p-0">
        <CardContent className="grid p-0 md:grid-cols-2">
          <form className="p-6 md:p-8" onSubmit={handleSubmit}>
            <FieldGroup>
              <div className="flex flex-col items-center gap-2 text-center">
                <h1 className="text-2xl font-bold">Create your account</h1>
                <p className="text-muted-foreground text-sm">
                  Sign up with your details
                </p>
              </div>

              <FieldSeparator>Or continue with</FieldSeparator>

              <Field>
                <FieldLabel>Username</FieldLabel>
                <Input
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Email</FieldLabel>
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel>Password</FieldLabel>
                <Input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Field>


              <Field>
                <Button type="submit" disabled={loading} className="w-full">
                  {loading ? "Creating..." : "Create Account"}
                </Button>
              </Field>

              <FieldDescription className="text-center">
                Already have an account? <a href="/login">Sign in</a>
              </FieldDescription>
            </FieldGroup>
          </form>

          <div className="bg-muted relative hidden md:block">
            <Image src="/image.png" alt="Signup" fill className="object-cover" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default SignupForm;