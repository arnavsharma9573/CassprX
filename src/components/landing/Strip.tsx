import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export default function Strip() {
  return (
    <WobbleCard
      containerClassName="col-span-1 h-48 max-w-7xl bg-[#BF7E43]"
      className="flex flex-col justify-between align-middle"
    >
      <div className=" flex justify-between items-center mx-8 mr-14 text-white text-3xl">
        <p className="text-2xl">Join Us in Defining the Next Era of AI</p>
        <p className="cursor-pointer">Get Started</p>
      </div>
    </WobbleCard>
  );
}
