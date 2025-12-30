"use client"

import { ChevronRight, type LucideIcon } from "lucide-react"
import Link from "next/link"

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"

/* ---------------- CORRECT RECURSIVE TYPE ---------------- */
export type NavItem = {
  title: string
  url?: string            // ✅ optional (parents don’t need url)
  icon?: LucideIcon
  isActive?: boolean
  items?: NavItem[]       // ✅ recursive
}

/* ---------------- NAV MAIN ---------------- */
export function NavMain({ items }: { items: NavItem[] }) {
  return (
    <SidebarGroup>
      <SidebarGroupLabel>Platform</SidebarGroupLabel>
      <SidebarMenu>
        {items.map((item) => (
          <NavNode key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  )
}

/* ---------------- RECURSIVE NODE ---------------- */
function NavNode({ item }: { item: NavItem }) {
  // 🔹 CASE 1: ITEM HAS CHILDREN → COLLAPSIBLE
  if (item.items && item.items.length > 0) {
    return (
      <Collapsible
        defaultOpen={item.isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton tooltip={item.title}>
              {item.icon && <item.icon />}
              <span>{item.title}</span>
              <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent>
            <SidebarMenuSub>
              {item.items.map((child) => (
                <SidebarMenuSubItem key={child.title}>
                  <NavNode item={child} />
                </SidebarMenuSubItem>
              ))}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    )
  }

  // 🔹 CASE 2: LEAF NODE → LINK
  return (
    <SidebarMenuButton asChild tooltip={item.title}>
      <Link href={item.url ?? "#"}>
        {item.icon && <item.icon />}
        <span>{item.title}</span>
      </Link>
    </SidebarMenuButton>
  )
}
