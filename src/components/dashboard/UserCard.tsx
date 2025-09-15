import React from "react";
import { Avatar } from "../ui/avatar";
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

interface UserCardProps {
  name: string;
  email: string;
}

export default function UserCard({ name, email }: UserCardProps) {
  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger className="outline-none border-1 p-2 rounded-2xl hover:bg-neutral-900/70 cursor-pointer transition-all duration-300">
          <div className="flex md:space-x-1 justify-between items-center cursor-pointer">
            <div className="flex items-center">
              <Avatar>
                <AvatarImage />
                <AvatarFallback className="flex h-10 w-10 bg-neutral-300 rounded-full items-center justify-center text-sm font-medium">
                  <p className="mb-2.5">{name.charAt(0)}</p>
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex flex-col md:ml-2 items-start">
              <p className="hidden md:flex text-sm font-medium text-neutral-500 ">{name}</p>
              <p className="hidden md:flex text-xs text-neutral-500">{email}</p>
            </div>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56 mr-4 md:mr-2 bg-neutral-900/80 text-white" align="start">
          <DropdownMenuLabel>My Account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem className="flex items-center md:hidden">
              <div className="flex flex-col md:ml-2 items-start">
                <p className="md:hidden text-sm font-medium text-neutral-200 ">{name}</p>
                <p className="md:hidden text-xs text-neutral-200">{email}</p>
              </div>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Profile
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Billing
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              Settings
              <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Team</DropdownMenuItem>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Invite users</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent className="w-56 mr-4 md:mr-2 bg-neutral-900/80 text-white">
                  <DropdownMenuItem>Email</DropdownMenuItem>
                  <DropdownMenuItem>Message</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>More...</DropdownMenuItem>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <DropdownMenuItem>
              New Team
              <DropdownMenuShortcut>⌘+T</DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem>GitHub</DropdownMenuItem>
          <DropdownMenuItem>Support</DropdownMenuItem>
          <DropdownMenuItem disabled>API</DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            Log out
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}
