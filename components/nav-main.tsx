"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";

export type NavItem = {
  title: string;
  url?: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: NavItem[];
};

/* ---------------- NAV MAIN ---------------- */
export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel className="text-gray-500">Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavNode key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

/* ---------------- RECURSIVE NODE ---------------- */
function NavNode({ item }: { item: NavItem }) {
  // ✅ Check if item is active or has any active child
  const hasActiveChild = (item: NavItem): boolean => {
    if (item.isActive) return true;
    if (item.items) return item.items.some(hasActiveChild);
    return false;
  };

  const active = hasActiveChild(item);
  const iconColor = active ? "text-blue-900 font-medium" : "text-blue-800 font-medium";
  const textColor = active ? "text-blue-900 font-medium" : "text-blue-800 font-medium";

  // 🔹 ITEM HAS CHILDREN → COLLAPSIBLE
  if (item.items && item.items.length > 0) {
    return (
      <Collapsible
        defaultOpen={active}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className={`hover:bg-blue-50 rounded-md`}
            >
              {item.icon && <item.icon className={`${iconColor} mr-2`} />}
              <span className={textColor}>{item.title}</span>
              <ChevronRight className={`ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90`} />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub className="pl-4">
              {item.items.map((child) => (
                <SidebarMenuSubItem key={child.title}>
                  <NavNode item={child} />
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // 🔹 LEAF NODE → LINK
  return (
    <SidebarMenuButton
      asChild
      tooltip={item.title}
      className="hover:bg-blue-50 rounded-md"
    >
      <Link href={item.url ?? "#"} className="flex items-center">
        {item.icon && <item.icon className={`${iconColor} mr-2`} />}
        <span className={textColor}>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  );
}
