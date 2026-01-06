"use client";

import * as React from "react";
import {
  AudioWaveform,
  BookOpen,
  Bot,
  Command,
  Edit3,
  Eye,
  Frame,
  GalleryVerticalEnd,
  Map,
  PieChart,
  Plus,
  Settings2,
  SquareTerminal,
} from "lucide-react";

import { NavMain } from "@/components/nav-main";
import { NavUser } from "@/components/nav-user";
import { TeamSwitcher } from "@/components/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Image from "next/image";

// Sample data
const data = {
  teams: [
    {
      name: "Acme Inc",
      logo: GalleryVerticalEnd,
      plan: "Enterprise",
    },
    {
      name: "Acme Corp.",
      logo: AudioWaveform,
      plan: "Startup",
    },
    {
      name: "Evil Corp.",
      logo: Command,
      plan: "Free",
    },
  ],
  navMain: [
    {
      title: "Products",
      url: "#",
      icon: SquareTerminal,
      isActive: true,
      items: [
        {
          title: "View Products",
          icon: Eye,
          items: [
            { title: "Live Products", url: "/dashboard/product/view/all", icon: Eye },
            { title: "Padding Products", url: "/dashboard/product/view/padding", icon: Eye },
          ],
        },
        {
          title: "Add Product",
          icon: Plus,
          items: [
            { title: "Add New Products", url: "/dashboard/product/add/Product", icon: Plus },
            { title: "Add New Model's", url: "/dashboard/product/add/model", icon: Plus },
          ],
        },
        {
          title: "Update Product",
          icon: Edit3,
          items: [{ title: "Edit Products", url: "/dashboard/product/edit", icon: Edit3 }],
        },
      ],
    },
    {
      title: "Accesories",
      icon: Bot,
      isActive: true,
      items: [
        {
          title: "View Accesories",
          icon: Eye,
          items: [
            { title: "Live Accesories", url: "/dashboard/accessories/view/all", icon: Eye },
            { title: "Padding Accesories", url: "/dashboard/accessories/view/padding", icon: Eye },
          ],
        },
        {
          title: "Add Product",
          icon: Plus,
          items: [{ title: "Add New Accesories", url: "/dashboard/accessories/add/Product", icon: Plus }],
        },
        {
          title: "Update Product",
          icon: Edit3,
          items: [{ title: "Edit Products", url: "/dashboard/accessories/edit", icon: Edit3 }],
        },
      ],
    },
    {
      title: "Sales Category",
      url: "#",
      icon: BookOpen,
      isActive: true,
      items: [
        {
          title: "View Sale",
          icon: Eye,
          items: [
            { title: "Live sales", url: "/dashboard/sales/all", icon: Eye },
            { title: "View Sale Product", url: "/dashboard/sales/view", icon: Eye },
          ],
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props} className="bg-white border-r border-gray-100">
      <SidebarHeader className="bg-white border-r py-9 border-gray-100">
        <Image src="/logo.png" alt="SiliconMeditech" height={100} width={270} />
      </SidebarHeader>

      <SidebarContent className="bg-white border-r border-gray-100">
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter className="bg-white border-r border-gray-100">
        <NavUser />
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
