"use client";
import { cn } from "@/lib/utils";
import {
  AnimatePresence,
  MotionValue,
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion"; // Note: 'motion/react' is deprecated, use 'framer-motion'
import React, { useRef, useState } from "react";

// The main component that will be exported
export const VerticalFloatingDock = ({
  items,
  className,
}: {
  items: { title: string; icon: React.ReactNode; href?: string }[];
  className?: string;
}) => {
  // We'll track the mouse's Y position
  let mouseY = useMotionValue(Infinity);

  return (
    <motion.div
      onMouseMove={(e) => mouseY.set(e.pageY)}
      onMouseLeave={() => mouseY.set(Infinity)}
      className={cn(
        "flex flex-col items-center gap-4 rounded-2xl bg-neutral-900/80 backdrop-blur-sm p-3",
        className
      )}
    >
      {items.map((item) => (
        <IconContainer mouseY={mouseY} key={item.title} {...item} />
      ))}
    </motion.div>
  );
};

// The individual icon container, now driven by mouseY
function IconContainer({
  mouseY,
  title,
  icon,
}: {
  mouseY: MotionValue;
  title: string;
  icon: React.ReactNode;
}) {
  let ref = useRef<HTMLDivElement>(null);

  // Calculate the distance from the mouse's Y position to the icon's center
  let distance = useTransform(mouseY, (val) => {
    let bounds = ref.current?.getBoundingClientRect() ?? { y: 0, height: 0 };
    return val - bounds.y - bounds.height / 2;
  });

  // Transform the size based on the vertical distance
  let sizeTransform = useTransform(distance, [-100, 0, 100], [40, 70, 40]);
  let iconSizeTransform = useTransform(distance, [-100, 0, 100], [20, 35, 20]);

  // Apply a spring animation for a smooth effect
  let size = useSpring(sizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });
  let iconSize = useSpring(iconSizeTransform, {
    mass: 0.1,
    stiffness: 150,
    damping: 12,
  });

  const [hovered, setHovered] = useState(false);

  return (
    <div className="relative">
      <motion.div
        ref={ref}
        style={{ width: size, height: size }}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        className="relative flex aspect-square items-center justify-center rounded-full bg-neutral-900"
      >
        <AnimatePresence>
          {hovered && (
            <motion.div
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              className="absolute right-full ml-4 w-fit rounded-md bg-neutral-800 px-2 py-1 text-xs text-white whitespace-nowrap"
            >
              {title}
            </motion.div>
          )}
        </AnimatePresence>
        <motion.div
          style={{ width: iconSize, height: iconSize }}
          className="flex items-center justify-center text-white"
        >
          {icon}
        </motion.div>
      </motion.div>
    </div>
  );
}
