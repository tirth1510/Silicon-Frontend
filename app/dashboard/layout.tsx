"use client";

import { ReactNode } from "react";
import { AppSidebar } from "@/components/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Separator } from "@/components/ui/separator";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { MdArrowForwardIos } from "react-icons/md";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const pathname = usePathname();
  const segments = pathname.split("/").filter(Boolean);

  // Create breadcrumb items dynamically
  const breadcrumbs = segments.map((seg, idx) => {
    const href = "/" + segments.slice(0, idx + 1).join("/");
    return {
      label: seg.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase()),
      href,
    };
  });

  return (
    <SidebarProvider>
      <div className="flex h-screen w-screen overflow-hidden">
        {/* Sidebar */}
        <AppSidebar />

        {/* Main Content */}
        <SidebarInset className="flex-1 flex flex-col overflow-hidden">
          {/* Sticky Header */}
          <header className="bg-background sticky top-0 z-20 flex items-center gap-4 border-b p-4 h-16">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="h-6" />
            <Breadcrumb className="flex-1 text-base font-medium overflow-hidden">
              <BreadcrumbList className="flex items-center gap-2 whitespace-nowrap overflow-x-auto">
                {breadcrumbs.map((crumb, idx) =>
                  idx === breadcrumbs.length - 1 ? (
                    <BreadcrumbItem key={idx}>
                      <BreadcrumbPage>{crumb.label}</BreadcrumbPage>
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
