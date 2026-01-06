"use client";

import { ChevronsUpDown, CircleQuestionMark, LogOut, LucideShieldCheck, TicketCheck, User, User2, VariableIcon } from "lucide-react";

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
import { FaTiktok } from "react-icons/fa";

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
                bg-white text-blue-900
                hover:bg-blue-50
                data-[state=open]:bg-blue-50
                data-[state=open]:text-blue-900
              "
            >
              <Avatar className="h-8 w-8 rounded-lg">
                <AvatarImage
                  src={profile.imageUrl || ""}
                  alt={profile.username}
                />
                <AvatarFallback className="rounded-lg bg-blue-900 text-white">
                  <User />
                </AvatarFallback>
              </Avatar>

              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{profile.username}</span>
                <span className="truncate text-xs text-gray-600">
                  {profile.email}
                </span>
              </div>

              <ChevronsUpDown className="ml-auto size-4 text-blue-900" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-lg bg-white border border-blue-100"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuLabel className="p-0 font-normal">
              <div className="flex items-center gap-2 px-2 py-2">
                <Avatar className="h-8 w-8 rounded-lg">
                  <AvatarImage src={profile.imageUrl || ""} />
                  <AvatarFallback className="rounded-lg bg-blue-900 text-white">
                    <User2 />
                  </AvatarFallback>
                </Avatar>

                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium text-blue-900">
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
                <DropdownMenuItem className="gap-2 border-2 font-xl bg-green-50 border-green-300 text-green-800">
                  <LucideShieldCheck  className="size-4 text-green-800" />
                  Verified account
                </DropdownMenuItem>
              )}
            </DropdownMenuGroup>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 text-red-600 hover:bg-red-50">
              <LogOut className="size-4" />
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
