import React from "react";
import { WobbleCard } from "../ui/wobble-card";

export default function Strip() {
  return (
    <WobbleCard
      containerClassName="col-span-1 h-20 max-w-7xl bg-[#BF7E43] mb-6"
      className="flex flex-col justify-center align-middle"
    >
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 sm:gap-0 text-white text-3xl mt-2">
        <p className="text-xl md:text-2xl text-center sm:text-left">
          Join Us in Defining the Next Era of AI
        </p>
        <p className="cursor-pointer text-lg md:text-2xl">Get Started</p>
      </div>
    </WobbleCard>
  );
}
