"use client";
import { Skeleton } from "@/components/ui/skeleton";
import { motion } from "framer-motion";

const CalendarSkeleton = () => {
  const days = Array.from({ length: 7 });
  const rows = Array.from({ length: 5 });

  return (
    <motion.div
      className="rounded-xl border border-neutral-800 bg-neutral-900 p-4 text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="flex justify-between items-center mb-6">
        <Skeleton className="h-6 w-48 bg-neutral-800" />
        <Skeleton className="h-8 w-32 bg-neutral-800 rounded-lg" />
      </div>

      <div className="grid grid-cols-7 gap-3">
        {rows.map((_, rowIdx) =>
          days.map((_, colIdx) => (
            <motion.div
              key={`${rowIdx}-${colIdx}`}
              className="aspect-square bg-neutral-800/50 border border-neutral-800 rounded-lg p-2 flex flex-col gap-2"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: (rowIdx * 7 + colIdx) * 0.015 }}
            >
              <Skeleton className="h-4 w-1/3 bg-neutral-700 rounded-md" />
              <Skeleton className="h-2 w-full bg-neutral-700 rounded-md" />
              <Skeleton className="h-2 w-3/4 bg-neutral-700 rounded-md" />
            </motion.div>
          ))
        )}
      </div>
    </motion.div>
  );
};

export default CalendarSkeleton;
