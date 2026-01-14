"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/navbar";
import Footer from "@/components/footer";

interface ConditionalLayoutProps {
  children: React.ReactNode;
}

export default function ConditionalLayout({
  children,
}: ConditionalLayoutProps) {
  const pathname = usePathname() || ""; // fallback to empty string

  const isDashboard = pathname.startsWith("/dashboard");
  const isunAuthorized = pathname.startsWith("/unauthorized");

  const isLogin = pathname.startsWith("/login");
  const isRegister = pathname.startsWith("/signup");

  // Dashboard pages: no navbar/footer
  if (isDashboard || isLogin || isRegister || isunAuthorized) return <>{children}</>;

  // Regular pages: with navbar and footer
  return (
    <>
      <Navbar />
      <main className="min-h-auto">{children}</main>
      <Footer />
    </>
  );
}
