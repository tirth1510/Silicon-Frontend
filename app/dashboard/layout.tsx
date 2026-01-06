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
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Sticky Header */}
          <header className="bg-background sticky top-0 z-20 flex items-center gap-4 border-b p-4 h-16">
            <SidebarTrigger className="-ml-1 text-blue-900 hover:bg-blue-50 hover:text-blue-800" />
            <Breadcrumb className="flex-1 text-base font-medium overflow-hidden">
              <BreadcrumbList className="flex items-center gap-2 whitespace-nowrap overflow-x-auto">
                {breadcrumbs.map((crumb, idx) =>
                  idx === breadcrumbs.length - 1 ? (
                    <BreadcrumbItem key={idx}>
                      <BreadcrumbPage >{crumb.label}</BreadcrumbPage>
                    </BreadcrumbItem>
                  ) : (
                    <BreadcrumbItem
                      key={idx}
                      className="hidden md:flex items-center"
                    >
                      <BreadcrumbLink asChild>
                        <Link
                          href={crumb.href}
                          className="flex items-center gap-1 text-muted-foreground"
                        >
                          {crumb.label}
                          <MdArrowForwardIos className="h-3 w-3 text-muted-foreground" />
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  )
                )}
              </BreadcrumbList>
            </Breadcrumb>
          </header>

          {/* Page Content */}
          <main className="flex-1 overflow-auto p-4">{children}</main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
