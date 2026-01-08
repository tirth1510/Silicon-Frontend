"use client";

import * as React from "react";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  TrendingUp,
  Eye,
  BarChart3,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Navigation data
const data = {
  navMain: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      isActive: true,
    },
    {
      title: "Products",
      url: "/dashboard/product",
      icon: Package,
      isActive: true,
    },
    {
      title: "Accessories",
      url: "/dashboard/accessories",
      icon: ShoppingBag,
      isActive: true,
    },
    {
      title: "Sales",
      url: "#",
      icon: BarChart3,
      isActive: true,
      items: [
        { 
          title: "Live Sales", 
          url: "/dashboard/sales/all", 
          icon: TrendingUp 
        },
        { 
          title: "View Sales", 
          url: "/dashboard/sales/view", 
          icon: Eye 
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar 
      collapsible="icon" 
      {...props} 
      className="border-r border-gray-200 bg-white"
    >
      {/* Header with Logo */}
      <SidebarHeader className="border-b border-gray-200 py-6 px-4 bg-white group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-5">
        <div className="flex items-center justify-center">
          <Image 
            src="/logo.png" 
            alt="Silicon Meditech" 
            height={60} 
            width={180}
            className="object-contain group-data-[collapsible=icon]:hidden"
          />
          <div className="hidden group-data-[collapsible=icon]:flex w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl items-center justify-center shadow-lg">
            <span className="text-white font-bold text-xl">SM</span>
          </div>
        </div>
      </SidebarHeader>

      {/* Navigation Content */}
      <SidebarContent className="py-4 px-3 bg-white group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-5">
        <NavMain items={data.navMain} />
      </SidebarContent>

      {/* Footer with User */}
      <SidebarFooter className="border-t border-gray-200 py-3 px-3 bg-white group-data-[collapsible=icon]:px-2 group-data-[collapsible=icon]:py-4">
        <NavUser />
      </SidebarFooter>

      <SidebarRail className="bg-gray-300" />
    </Sidebar>
  );
}
