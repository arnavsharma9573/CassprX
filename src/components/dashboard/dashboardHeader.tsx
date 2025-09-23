"use client";
import React, { useState } from "react";
import { Separator } from "../ui/separator";
import { Input } from "../ui/input";
import { CirclePlus, Command, Gift, Menu, Search } from "lucide-react";
import UserCard from "./UserCard";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "../ui/drawer";
import { Button } from "../ui/button";
import Sidebar from "./Sidebar";

interface User {
  name: string;
  email: string;
}

export default function DashboardHeader() {
  const [name, setName] = useState("Emily");
  const [email, setEmail] = useState("emily@example.com");
  return (
    <>
      <div className="bg-neutral-900/80 border w-full border-neutral-800 h-[3.95rem] flex items-center px-4 rounded-xl justify-between">
        <div className="flex items-center space-x-4">
          {/* Drawer (mobile menu) */}
          <div className="lg:hidden cursor-pointer hover:bg-neutral-800 rounded-md">
            <Drawer direction="left">
              <DrawerTrigger asChild>
                <Button
                  variant="outline"
                  className="bg-neutral-800 border-neutral-700 text-neutral-200"
                >
                  <Menu className="lg:hidden size-5" />
                </Button>
              </DrawerTrigger>
              <DrawerContent className="bg-neutral-900 border-neutral-800 text-neutral-200">
                <DrawerHeader>
                  <DrawerTitle className="text-lg font-bold text-neutral-300">Menu</DrawerTitle>
                </DrawerHeader>
                <Sidebar />
              </DrawerContent>
            </Drawer>
          </div>

          {/* Search */}
          <div className="relative w-32 md:w-72 lg:w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-neutral-400" />
            <Input
              type="text"
              placeholder="Search..."
              className="pl-8 md:pl-9 md:pr-16 w-full bg-neutral-800 border-neutral-700 text-neutral-200 placeholder:text-neutral-500 focus-visible:ring-0 focus:outline-none"
            />
            <div className="absolute hidden right-3 top-1/2 -translate-y-1/2 md:flex items-center space-x-1">
              <kbd className="p-1 text-xs font-medium text-neutral-400 bg-neutral-800 rounded">
                ⌘
              </kbd>
              <p className="text-xs mb-0.5 text-neutral-400">+</p>
              <kbd className="p-1 text-xs font-medium text-neutral-400 bg-neutral-800 rounded">
                K
              </kbd>
            </div>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex justify-between items-center space-x-3">
          <div className="Icons md:flex space-x-2 border-r border-neutral-700 pr-3 hidden text-neutral-300">
            <Gift
              strokeWidth={1.5}
              className="size-5 cursor-pointer hover:text-white"
            />
            <CirclePlus
              strokeWidth={1.5}
              className="size-5 cursor-pointer hover:text-white"
            />
          </div>
          <div className="user-card">
            {/* <UserCard name={name} email={email} /> */}
          </div>
        </div>
      </div>
    </>
  );
}
