import React from "react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
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

interface UserCardProps {
  name: string;
  email: string;
  avatar: string;
}

export default function UserCard({ name, email, avatar }: UserCardProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none border-1 p-2 w-48 rounded-2xl hover:bg-neutral-900/80 cursor-pointer transition-all duration-300">
          <div className="flex items-center cursor-pointer gap-x-3">
            <Avatar>
              <AvatarImage src={avatar} />
              <AvatarFallback className="flex h-10 w-10 bg-neutral-100 rounded-full items-center justify-center text-sm font-medium">
                {name.charAt(0)}
              </AvatarFallback>
            </Avatar>

            {/* Ensure flex column has shrink and overflow handling */}
            <div className="hidden md:flex flex-col items-start min-w-0">
              <p className="text-sm font-medium text-neutral-200">{name}</p>
              <p className="text-xs text-neutral-400 truncate w-full overflow-hidden">
                {email}
              </p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          className="w-56 bg-neutral-950 text-white"
          align="start"
        >
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center md:hidden">
              <div className="flex flex-col md:ml-2 items-start">
                <p className="md:hidden text-sm font-medium text-neutral-200 ">
                  {name}
                </p>
                <p className="md:hidden text-xs text-neutral-200 truncate">
                  {email}
                </p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard/profile">Profile</Link>
            </DropdownMenuItem>
            <DropdownMenuItem className="cursor-pointer" asChild>
              <Link href="/dashboard/billing">Billing</Link>
            </DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="cursor-pointer" asChild>
            <Link href={"/dashboard/faq"}>Support</Link>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem className="">Logout</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
