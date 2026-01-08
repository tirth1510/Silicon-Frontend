"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
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
export function NavMain({ items }: { items: NavItem[]; }) {
  return (
    <SidebarGroup>
      <SidebarMenu className="space-y-1 group-data-[collapsible=icon]:space-y-3">
        {items.map((item) => (
          <NavNode key={item.title} item={item} />
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}

/* ---------------- RECURSIVE NODE ---------------- */
function NavNode({ item }: { item: NavItem; }) {
  const pathname = usePathname();

  // Check if current item or any child is active based on pathname
  const isCurrentPath = (url?: string) => {
    if (!url || url === "#") return false;

    // Special case for dashboard root - must match exactly
    if (url === "/dashboard") {
      return pathname === "/dashboard";
    }

    // For other routes, check exact match or starts with
    return pathname === url || pathname.startsWith(url + "/");
  };

  const isActive = isCurrentPath(item.url) ||
    (item.items?.some(child => isCurrentPath(child.url)) ?? false);

  // 🔹 ITEM HAS CHILDREN → COLLAPSIBLE
  if (item.items && item.items.length > 0) {
    return (
      <Collapsible
        defaultOpen={isActive}
        className="group/collapsible"
      >
        <SidebarMenuItem>
          <CollapsibleTrigger asChild>
            <SidebarMenuButton
              tooltip={item.title}
              className={`
                px-3 py-3.5 rounded-lg transition-all duration-200 gap-3
                ${isActive
                  ? 'bg-blue-50 text-blue-600 font-semibold'
                  : 'text-gray-700 hover:bg-gray-100'
                }
                group-data-[collapsible=icon]:px-0
                group-data-[collapsible=icon]:py-4
                group-data-[collapsible=icon]:justify-center
                group-data-[collapsible=icon]:gap-0
              `}
            >
              {item.icon && (
                <item.icon
                  className={`w-7 h-7 ${isActive ? 'text-blue-600' : 'text-gray-500'} group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8`}
                />
              )}
              <span className="text-lg font-medium group-data-[collapsible=icon]:hidden">
                {item.title}
              </span>
              <ChevronRight
                className={`
                  ml-auto w-5 h-5 transition-transform duration-200 
                  group-data-[state=open]/collapsible:rotate-90
                  ${isActive ? 'text-blue-600' : 'text-gray-400'}
                  group-data-[collapsible=icon]:hidden
                `}
              />
            </SidebarMenuButton>
          </CollapsibleTrigger>

          <CollapsibleContent className="group-data-[collapsible=icon]:hidden">
            <SidebarMenuSub className="ml-6 mt-1 space-y-1 pl-4 border-l-2 border-gray-200">
              {item.items.map((child) => {
                const childActive = isCurrentPath(child.url);
                return (
                  <SidebarMenuSubItem key={child.title}>
                    <SidebarMenuButton
                      asChild
                      tooltip={child.title}
                      className={`
                        px-3 py-2.5 rounded-lg transition-all duration-200
                        ${childActive
                          ? 'bg-blue-50 text-blue-600 font-semibold'
                          : 'text-gray-600 hover:bg-gray-100'
                        }
                      `}
                    >
                      <Link href={child.url ?? "#"} className="flex items-center gap-3 w-full">
                        {child.icon && (
                          <child.icon
                            className={`w-6 h-6 ${childActive ? 'text-blue-600' : 'text-gray-400'
                              }`}
                          />
                        )}
                        <span className="text-base font-medium">
                          {child.title}
                        </span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuSubItem>
                );
              })}
            </SidebarMenuSub>
          </CollapsibleContent>
        </SidebarMenuItem>
      </Collapsible>
    );
  }

  // 🔹 LEAF NODE → LINK
  const leafActive = isCurrentPath(item.url);

  return (
    <SidebarMenuItem>
      <SidebarMenuButton
        asChild
        tooltip={item.title}
        className={`
          px-3 py-3.5 rounded-lg transition-all duration-200 gap-3
          ${leafActive
            ? 'bg-blue-50 text-blue-600 font-semibold'
            : 'text-gray-700 hover:bg-gray-100'
          }
          group-data-[collapsible=icon]:px-0
          group-data-[collapsible=icon]:py-4
          group-data-[collapsible=icon]:justify-center
          group-data-[collapsible=icon]:gap-0
        `}
      >
        <Link href={item.url ?? "#"} className="flex items-center gap-3 group-data-[collapsible=icon]:gap-0">
          {item.icon && (
            <item.icon
              className={`w-7 h-7 ${leafActive ? 'text-blue-600' : 'text-gray-500'} group-data-[collapsible=icon]:w-8 group-data-[collapsible=icon]:h-8`}
            />
          )}
          <span className="text-lg font-medium group-data-[collapsible=icon]:hidden">
            {item.title}
          </span>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
}
