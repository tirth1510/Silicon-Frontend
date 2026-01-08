"use client";

import { ReactNode, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/app-sidebar";
import { useProfile } from "@/hooks/useprofile";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
} from "@/components/ui/breadcrumb";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import Link from "next/link";
import { MdArrowForwardIos } from "react-icons/md";

interface LayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: LayoutProps) {
  const { profile, loading } = useProfile();
  const router = useRouter();
  const pathname = typeof window !== "undefined" ? window.location.pathname : "";
  const segments = pathname.split("/").filter(Boolean);

  // Redirect non-admins
  useEffect(() => {
    if (!loading) {
      if (!profile) {
        // Not logged in
        router.replace("/login");
      } else if (profile.role !== "admin") {
        // Logged in but not admin
        router.replace("/unauthorized");
      }
    }
  }, [loading, profile, router]);

  // Create breadcrumb items dynamically
  const breadcrumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return {
      label: seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href,
    };
  });

  // Show nothing while loading or redirecting
  if (loading || !profile || profile.role !== "admin") {
    return null;
  }

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Header with Breadcrumb */}
          <header className="sticky top-0 z-0 flex items-center gap-4 border-b border-gray-200 bg-white px-6 py-4 shadow-sm">
            <SidebarTrigger className="text-gray-600 hover:bg-gray-100 hover:text-gray-900 rounded-md" />
            <Breadcrumb className="flex-1">
              <BreadcrumbList className="flex items-center gap-2">
                {breadcrumbs.map((crumb, idx) =>
                  idx === breadcrumbs.length - 1 ? (
                    <BreadcrumbItem key={idx}>
                      <BreadcrumbPage className="text-gray-900 font-semibold text-base">
                        {crumb.label}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <BreadcrumbItem
                      key={idx}
                      className="hidden md:flex items-center"
                    >
                      <BreadcrumbLink asChild>
                        <Link
                          href={crumb.href}
                          className="flex items-center gap-1.5 text-gray-600 hover:text-blue-600 text-sm transition-colors"
                        >
                          {crumb.label}
                          <MdArrowForwardIos className="h-3 w-3 text-gray-400" />
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto bg-gray-50">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
