"use client";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { toast } from "sonner";
import { jwtDecode } from "jwt-decode";
import { login } from "@/store/feature/authSlice";

interface DecodedToken {
  userId: number | string;
}

const googleColors = {
  blue: "#4285F4",
  red: "#EA4335",
  yellow: "#FBBC04",
  green: "#34A853",
};

const GoogleAuth = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const dispatch = useDispatch();
  const effectRan = useRef(false);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (effectRan.current) return;
    effectRan.current = true;

    const processLogin = async () => {
      try {
        // Delay for animations (1500ms = 1.5s)
        await new Promise((resolve) => setTimeout(resolve, 100));

        const token = searchParams.get("token");
        const email = searchParams.get("email");
        const name = searchParams.get("name");
        const avatar_url = searchParams.get("avatar_url");

        if (!token || !email || !name) {
          const errorMessage = "Incomplete authentication data received.";
          toast.error(errorMessage);
          setError(errorMessage);
          setLoading(false);
          return;
        }

        const decodedToken = jwtDecode<DecodedToken>(token);
        const userId = decodedToken.userId.toString();

        localStorage.setItem("token", token);

        const userPayload = {
          id: userId,
          name,
          email,
          token,
          avatar_url: avatar_url || undefined,
        };

        dispatch(login(userPayload));
        toast.success("Successfully logged in");
        router.push("/dashboard");
      } catch (err) {
        const errorMessage =
          "An error occurred during login. Please try again.";
        console.error("Authentication processing failed:", err);
        toast.error(errorMessage);
        setError(errorMessage);
        setLoading(false);
      }
    };

    processLogin();
  }, [searchParams, router, dispatch]);

  return (
    <div className="relative h-screen w-screen bg-black overflow-hidden">
      {/* Animated gradient background */}
      {/* <div className="absolute inset-0 bg-gradient-to-br from-purple-900/20 via-blue-900/20 to-cyan-900/20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(79,70,229,0.1)_0%,transparent_50%)] animate-pulse"></div>
      </div> */}

      {/* Floating particles */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white/30 rounded-full"
          animate={{
            y: [null, -100],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 3 + 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}

      {/* Enhanced background text with Google styling */}
      <div className="absolute inset-0 flex items-center justify-center z-5 pointer-events-none">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 0.1, scale: 1 }}
          transition={{ duration: 2, repeat: Infinity, repeatType: "reverse" }}
          className="text-center"
        >
          <div className="flex items-center justify-center gap-2 text-6xl md:text-8xl font-light tracking-wider select-none">
            <span style={{ color: googleColors.blue }}>G</span>
            <span style={{ color: googleColors.red }}>o</span>
            <span style={{ color: googleColors.yellow }}>o</span>
            <span style={{ color: googleColors.blue }}>g</span>
            <span style={{ color: googleColors.green }}>l</span>
            <span style={{ color: googleColors.red }}>e</span>
          </div>
          <motion.div
            className="text-2xl md:text-4xl font-light text-white/40 mt-4 tracking-widest"
            animate={{ opacity: [0.2, 0.6, 0.2] }}
            transition={{ duration: 3, repeat: Infinity }}
          >
            Authentication
          </motion.div>
        </motion.div>
      </div>

      {/* Login card */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-md w-full mx-4"
        >
          <div className="p-8 rounded-3xl shadow-2xl bg-neutral-950/80 backdrop-blur-xl border border-neutral-700/50 text-center relative overflow-hidden">
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent rounded-3xl"></div>

            <div className="relative z-10">
              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-6"
                >
                  {/* Enhanced Google Logo */}
                  <motion.div
                    className="flex items-center justify-center gap-1 text-4xl font-normal mb-8"
                    animate={{ scale: [1, 1.05, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <span style={{ color: googleColors.blue }}>G</span>
                    <span style={{ color: googleColors.red }}>o</span>
                    <span style={{ color: googleColors.yellow }}>o</span>
                    <span style={{ color: googleColors.blue }}>g</span>
                    <span style={{ color: googleColors.green }}>l</span>
                    <span style={{ color: googleColors.red }}>e</span>
                  </motion.div>

                  {/* Enhanced loading spinner */}
                  <div className="relative w-16 h-16 mx-auto mb-8">
                    {/* Outer ring with Google colors */}
                    <motion.div
                      className="absolute inset-0 rounded-full"
                      style={{
                        background: `conic-gradient(from 0deg, ${googleColors.blue}, ${googleColors.red}, ${googleColors.yellow}, ${googleColors.green}, ${googleColors.blue})`,
                      }}
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 2,
                        ease: "linear",
                        repeat: Infinity,
                      }}
                    />
                    <div className="absolute inset-1 rounded-full bg-neutral-950"></div>

                    {/* Inner pulsing dot */}
                    <motion.div
                      className="absolute inset-6 rounded-full bg-white"
                      animate={{
                        scale: [0.8, 1.2, 0.8],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    />
                  </div>

                  {/* Enhanced typography */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    <h1 className="text-2xl font-light text-white mb-3 tracking-wide">
                      Signing you in
                    </h1>
                    <motion.p
                      className="text-neutral-400 text-sm"
                      animate={{ opacity: [0.7, 1, 0.7] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      Verifying your Google account...
                    </motion.p>
                  </motion.div>

                  {/* Progress dots */}
                  <div className="flex justify-center gap-2 mt-6">
                    {[0, 1, 2].map((i) => (
                      <motion.div
                        key={i}
                        className="w-2 h-2 rounded-full bg-white/40"
                        animate={{
                          scale: [1, 1.5, 1],
                          opacity: [0.4, 1, 0.4],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                        }}
                      />
                    ))}
                  </div>
                </motion.div>
              )}

              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6"
                >
                  {/* Error icon */}
                  <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/20 flex items-center justify-center">
                    <svg
                      className="w-8 h-8 text-red-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
                      />
                    </svg>
                  </div>

                  <div>
                    <h1 className="text-2xl font-light text-red-400 mb-3">
                      Authentication Failed
                    </h1>
                    <p className="text-neutral-400 text-sm leading-relaxed">
                      {error}
                    </p>
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => window.location.reload()}
                    className="mt-8 px-8 py-3 rounded-2xl bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 transition-all duration-200 text-white font-medium shadow-lg shadow-red-500/25 w-full"
                  >
                    Try Again
                  </motion.button>
                </motion.div>
              )}
            </div>
          </div>

          {/* Subtle bottom text */}
          <motion.p
            className="text-center text-neutral-500 text-xs mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
          >
            Powered by Google Identity Services
          </motion.p>
        </motion.div>
      </div>

      {/* Bottom corner branding */}
      <motion.div
        className="absolute bottom-6 right-6 text-neutral-600 text-xs font-light"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
      >
        Secure Authentication
      </motion.div>
    </div>
  );
};

export default GoogleAuth;
