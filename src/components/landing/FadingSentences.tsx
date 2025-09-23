"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const sentences = [
  <>
    Our platform turns your campaign ideas into ready-to-post social media
    content,
    <br />
    audience insights, and automated publishing all in a few clicks.
  </>,
  <>
    All your Go-To-Market strategy, content, and publishing
    <br />
    simplified,automated, and under one roof.
  </>,
];

export default function FadingSentences() {
  const [index, setIndex] = useState(0);

  // This effect will switch to the next sentence after 4 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setIndex((prevIndex) => (prevIndex + 1) % sentences.length);
    }, 4000); // 4-second delay

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, [index]); // Rerun the effect when the index changes (for more than 2 sentences)

  return (
    // We give the container a fixed height to prevent layout shifts
    <div className="relative flex items-center justify-center text-center text-xl text-neutral-200 h-24 z-2">
      <AnimatePresence mode="wait">
        <motion.p
          // The key is crucial! It tells AnimatePresence that this is a new element.
          key={index}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        >
          {sentences[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
}
