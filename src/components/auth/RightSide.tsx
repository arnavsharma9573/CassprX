"use client";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function RightSide() {
  const [positions, setPositions] = useState<{ left: string; top: string }[]>(
    []
  );

  useEffect(() => {
    setPositions(
      [...Array(15)].map(() => ({
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
      }))
    );
  }, []);

  return (
    <motion.div
      className="flex-1 relative hidden lg:block bg-slate-950/50 m-5 rounded-2xl overflow-hidden"
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.3 }}
    >
      <motion.div
        className="w-full h-full flex flex-col items-center justify-center text-center relative"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        {/* Animated background elements */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3), transparent 50%)",
          }}
          animate={{
            background: [
              "radial-gradient(circle at 20% 80%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 20%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 40%, rgba(120, 219, 255, 0.3), transparent 50%)",
              "radial-gradient(circle at 60% 20%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 20% 80%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 80% 60%, rgba(120, 219, 255, 0.3), transparent 50%)",
              "radial-gradient(circle at 80% 80%, rgba(120, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 40% 20%, rgba(255, 119, 198, 0.3), transparent 50%), radial-gradient(circle at 20% 60%, rgba(120, 219, 255, 0.3), transparent 50%)",
            ],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "linear",
          }}
        />

        {/* Floating particles */}
        {positions.map((pos, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full opacity-60"
            style={pos}
            animate={{
              y: [0, -20, 0],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut",
            }}
          />
        ))}

        {/* 3D Cube Animation */}
        <motion.div
          className="relative w-48 h-48 mb-8"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{
            opacity: 1,
            scale: 1,
            rotateY: 360,
            rotateX: [0, 15, 0],
          }}
          transition={{
            opacity: { duration: 0.8, delay: 0.6 },
            scale: { duration: 0.8, delay: 0.6 },
            rotateY: {
              duration: 20,
              repeat: Infinity,
              ease: "linear",
            },
            rotateX: {
              duration: 6,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
        >
          {/* Outer ring */}
          <motion.div
            className="absolute inset-0 border-2 border-blue-500/30 rounded-full"
            animate={{
              rotate: 360,
              scale: [1, 1.1, 1],
            }}
            transition={{
              rotate: {
                duration: 15,
                repeat: Infinity,
                ease: "linear",
              },
              scale: {
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />

          {/* Inner ring */}
          <motion.div
            className="absolute inset-2 border border-blue-500/20 rounded-full"
            animate={{
              rotate: -360,
              opacity: [0.2, 0.6, 0.2],
            }}
            transition={{
              rotate: {
                duration: 12,
                repeat: Infinity,
                ease: "linear",
              },
              opacity: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          />

          {/* Central cube */}
          <motion.div
            className="absolute inset-4 flex items-center justify-center"
            animate={{
              rotateZ: [0, 180, 360],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="w-24 h-40 bg-gradient-to-br from-slate-800/70 to-purple-900/50 rounded-lg border border-slate-700/50 backdrop-blur-sm shadow-2xl"
              animate={{
                skewY: [-3, 3, -3],
              }}
              style={{
                filter: "drop-shadow(0 0 20px rgba(139, 92, 246, 0.3))",
              }}
              transition={{
                skewY: {
                  duration: 4,
                  repeat: Infinity,
                  ease: "easeInOut",
                },
              }}
            />
          </motion.div>
        </motion.div>

        {/* Text content with staggered animation */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.7 }}
        >
          <motion.h2
            className="text-3xl font-bold text-white mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <motion.span
              className="bg-gradient-to-r from-purple-400 via-pink-400 to-purple-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "300% 100%" }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              400K+ users.
            </motion.span>
          </motion.h2>
          <motion.p
            className="text-slate-400 mt-2 max-w-sm"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <motion.span
              className="bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
              style={{ backgroundSize: "300% 100%" }}
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              50M+ AI generated graphics.
            </motion.span>{" "}
            Join the revolution of digital creation.
          </motion.p>
        </motion.div>

        {/* Decorative floating elements */}
        <motion.div
          className="absolute top-10 right-10 w-4 h-4 bg-purple-400 rounded-full"
          animate={{
            y: [0, -10, 0],
            opacity: [0.4, 0.8, 0.4],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />

        <motion.div
          className="absolute bottom-20 left-10 w-3 h-3 bg-blue-400 rounded-full"
          animate={{
            x: [0, 10, 0],
            opacity: [0.3, 0.7, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 1,
          }}
        />
      </motion.div>
    </motion.div>
  );
}
