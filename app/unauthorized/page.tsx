"use client";

import Link from "next/link";
import { ShieldAlert, Home, LogIn } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function UnauthorizedPage() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-lg shadow-xl border-blue-200">
        <CardContent className="flex flex-col items-center text-center py-14 space-y-8">

          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <ShieldAlert className="h-10 w-10 text-blue-700" />
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h1 className="text-7xl font-extrabold text-blue-800">
              401
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              Unauthorized
            </p>
            <p className="text-base text-blue-600 max-w-sm mx-auto">
              You don’t have permission to access this page.
              Please login with the correct account or return home.
            </p>
          </div>

          {/* Actions */}
          <div className="flex gap-4 pt-4">
            <Button
              asChild
              size="lg"
              className="bg-blue-700 hover:bg-blue-800"
            >
              <Link href="/">
                <Home className="mr-2 h-5 w-5" />
                Home
              </Link>
            </Button>

            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-blue-700 text-blue-700 hover:bg-blue-100"
            >
              <Link href="/login">
                <LogIn className="mr-2 h-5 w-5" />
                Login
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <p className="pt-6 text-sm text-blue-600">
            If you believe this is a mistake, please contact support.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
