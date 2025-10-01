"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/hooks/redux-hooks";
import { logout } from "@/store/feature/authSlice";
import { useRouter } from "next/navigation";

// 1. Add `isCollapsed` to the component's props
interface UserCardProps {
  isCollapsed: boolean;
}

export default function UserCard({ isCollapsed }: UserCardProps) {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const router = useRouter();

  const logoutUser = () => {
    localStorage.removeItem("token");
    router.push("/");
    dispatch(logout());
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`outline-none w-full rounded-xl hover:bg-neutral-800/60 cursor-pointer transition-all duration-300  ${
          isCollapsed ? "p-1.5" : "p-2 border"
        }`}
      >
        {/* 2. Main container adapts based on `isCollapsed` */}
        <div
          className={`flex items-center cursor-pointer ${
            isCollapsed ? "justify-center" : "gap-x-3"
          }`}
        >
          <Avatar className={isCollapsed ? "size-7" : "size-9"}>
            <AvatarImage src={user?.avatar_url ?? undefined} />
            <AvatarFallback className="flex h-full w-full bg-neutral-100 rounded-full items-center justify-center text-sm font-medium">
              {user?.name ? user.name.charAt(0).toUpperCase() : "U"}
            </AvatarFallback>
          </Avatar>

          {/* 3. User name and email only render when not collapsed */}
          {!isCollapsed && (
            <div className="hidden md:flex flex-col items-start min-w-0">
              <p className="text-sm font-medium text-neutral-200 truncate">
                {user?.name}
              </p>
              <p className="text-xs text-neutral-400 truncate w-full">
                {user?.email}
              </p>
            </div>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        className="w-56 bg-neutral-950 text-white border-neutral-800"
        align="end"
        side="top" // Opens the menu above the card
        sideOffset={10} // Adds a small gap
      >
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuGroup>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/dashboard/profile">Profile</Link>
          </DropdownMenuItem>
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href="/dashboard/billing">Billing</Link>
          </DropdownMenuItem>
          <DropdownMenuItem>Settings</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem className="cursor-pointer" asChild>
          <Link href={"/dashboard/faq"}>Support</Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator className="bg-neutral-800" />
        <DropdownMenuItem
          className="cursor-pointer focus:bg-red-500/10 focus:text-red-400"
          onClick={logoutUser}
        >
          Logout
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
