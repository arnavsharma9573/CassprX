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
        const newArray = [...prevCards]; // create a copy of the array
        newArray.unshift(newArray.pop()!); // move the last element to the front
        return newArray;
      });
    }, 4000);
  };

  return (
    <div className="relative h-60 w-60 md:h-60 md:w-96">
      {cards.map((card, index) => {
        return (
          <motion.div
            key={card.id}
            className="absolute bg-gradient-to-br from-neutral-900 to-neutral-950 text-white h-60 w-60 md:h-64 md:w-[25rem] rounded-3xl p-6 shadow-xl border border-neutral-800 flex flex-col justify-between overflow-hidden"
            style={{
              transformOrigin: "top center",
            }}
            animate={{
              top: index * -CARD_OFFSET,
              scale: 1 - index * SCALE_FACTOR,
              zIndex: cards.length - index,
              rotate: index === 0 ? 0 : index % 2 === 0 ? 0.5 : -0.5, // Slight alternating rotation
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
              <div className="font-normal text-neutral-300 text-lg leading-relaxed mb-4">
                {card.content}
              </div>
            </div>

            <div className="relative z-10 pt-4 border-t border-neutral-800">
              <p className="text-neutral-100 font-medium text-xl">
                {card.name}
              </p>
              <p className="text-neutral-400 font-normal mt-1">
                {card.designation}
              </p>
            </div>

            {/* Decorative elements */}
            <div className="absolute top-4 right-4 w-2 h-2 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full" />
            <div className="absolute bottom-4 left-4 w-8 h-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-full opacity-60" />
          </motion.div>
        );
      })}
    </div>
  );
};
