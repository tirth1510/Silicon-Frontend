"use client";

import Link from "next/link";
import { FileQuestion, Home } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50 dark:bg-gray-900 px-4">
      <Card className="w-full max-w-lg shadow-xl border-blue-200">
        <CardContent className="flex flex-col items-center text-center py-14 space-y-8">

          {/* Icon */}
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-blue-100">
            <FileQuestion className="h-10 w-10 text-blue-700" />
          </div>

          {/* Text */}
          <div className="space-y-3">
            <h1 className="text-7xl font-extrabold text-blue-800">
              404
            </h1>
            <p className="text-3xl font-bold text-blue-700">
              Page Not Found
            </p>
            <p className="text-base text-blue-600 max-w-sm mx-auto">
              The page you’re looking for doesn’t exist or may have been moved.
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
                Go Home
              </Link>
            </Button>
          </div>

          {/* Footer */}
          <p className="pt-6 text-sm text-blue-600">
            If you typed the address manually, please check the URL.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
