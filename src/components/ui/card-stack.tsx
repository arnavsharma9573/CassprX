"use client";
import { useEffect, useState } from "react";
import { motion } from "motion/react";

let interval: any;

type Card = {
  id: number;
  name: string;
  designation: string;
  content: React.ReactNode;
};

export const CardStack = ({
  items,
  offset,
  scaleFactor,
}: {
  items: Card[];
  offset?: number;
  scaleFactor?: number;
}) => {
  const CARD_OFFSET = offset || 10;
  const SCALE_FACTOR = scaleFactor || 0.06;
  const [cards, setCards] = useState<Card[]>(items);

  useEffect(() => {
    startFlipping();
    return () => clearInterval(interval);
  }, []);

  const startFlipping = () => {
    interval = setInterval(() => {
      setCards((prevCards: Card[]) => {
        const newArray = [...prevCards];
        newArray.unshift(newArray.pop()!);
        return newArray;
      });
    }, 4000);
  };

  return (
    <div className="relative w-full max-w-[22rem] sm:max-w-[25rem] h-[16rem] sm:h-[18rem] mx-auto">
      {cards.map((card, index) => (
        <motion.div
          key={card.id}
          className="absolute bg-gradient-to-br from-neutral-900 to-neutral-950 text-white 
                     w-full h-full rounded-2xl sm:rounded-3xl p-4 sm:p-6 shadow-xl 
                     border border-neutral-800 flex flex-col justify-between overflow-hidden"
          style={{
            transformOrigin: "top center",
          }}
          animate={{
            top: index * -CARD_OFFSET,
            scale: 1 - index * SCALE_FACTOR,
            zIndex: cards.length - index,
            rotate: index === 0 ? 0 : index % 2 === 0 ? 0.5 : -0.5,
          }}
          whileHover={{
            scale: index === 0 ? 1.02 : 1 - index * SCALE_FACTOR + 0.02,
            transition: { duration: 0.3 },
          }}
        >
          {/* Background pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white via-transparent to-transparent" />
          </div>

          {/* Glossy overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/5 via-transparent to-transparent pointer-events-none" />

          {/* Content */}
          <div className="relative z-10">
            <div className="font-normal text-neutral-300 text-sm sm:text-base leading-relaxed mb-3 sm:mb-4">
              {card.content}
            </div>
          </div>

          <div className="relative z-10 pt-3 sm:pt-4 border-t border-neutral-800">
            <p className="text-neutral-100 font-medium text-base sm:text-xl">
              {card.name}
            </p>
            <p className="text-neutral-400 font-normal mt-1 text-sm sm:text-base">
              {card.designation}
            </p>
          </div>

          {/* Decorative elements */}
          <div className="absolute top-3 right-3 sm:top-4 sm:right-4 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 w-6 sm:w-8 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-60" />
        </motion.div>
      ))}
    </div>
  );
};
