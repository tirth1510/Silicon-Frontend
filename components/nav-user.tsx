"use client";

import { ChevronsUpDown, LogOut, User, User2, LucideShieldCheck } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

import { useProfile } from "@/hooks/useprofile";

export function NavUser() {
  const { isMobile } = useSidebar();
  const { profile, loading } = useProfile();

  if (loading || !profile) return null;

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="
                bg-gray-50 text-gray-700 border border-gray-200
                hover:bg-gray-100
                data-[state=open]:bg-gray-100
                group-data-[collapsible=icon]:!p-0
                group-data-[collapsible=icon]:!w-14
                group-data-[collapsible=icon]:!h-14
                group-data-[collapsible=icon]:justify-center
              "
            >
              <Avatar className="h-9 w-9 rounded-full border-2 border-blue-600 group-data-[collapsible=icon]:h-12 group-data-[collapsible=icon]:w-12">
                <AvatarImage
                  src={profile.imageUrl || ""}
                  alt={profile.username}
                />
                <AvatarFallback className="rounded-full bg-blue-600 text-white">
                  <User className="w-5 h-5 group-data-[collapsible=icon]:w-6 group-data-[collapsible=icon]:h-6" />
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden">
                <span className="truncate font-semibold text-gray-800 text-base">{profile.username}</span>
                <span className="truncate text-sm text-gray-500">
                  {profile.email}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto size-4 text-gray-400 group-data-[collapsible=icon]:hidden" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg bg-white border border-gray-200 shadow-xl"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-3 px-3 py-3 bg-blue-50">
                <Avatar className="h-10 w-10 rounded-full border-2 border-blue-600">
                  <AvatarImage src={profile.imageUrl || ""} />
                  <AvatarFallback className="rounded-full bg-blue-600 text-white">
                    <User2 className="w-5 h-5" />
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-bold text-gray-900">
                    {profile.username}
                  </span>
                  <span className="truncate text-xs text-gray-600">
                    {profile.email}
                  </span>
                </div>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            <DropdownMenuGroup>
              {profile.isVerified && (
                <DropdownMenuItem className="gap-2 mx-2 my-1 rounded-md bg-green-50 border border-green-200 text-green-800 hover:bg-green-100">
                  <LucideShieldCheck className="size-4 text-green-700" />
                  <span className="font-semibold">Verified Account</span>
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 mx-2 my-1 rounded-md text-red-600 hover:bg-red-50 hover:text-red-700 cursor-pointer">
              <LogOut className="size-4" />
              <span className="font-medium">Log out</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
