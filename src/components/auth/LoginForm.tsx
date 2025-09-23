"use client";
import { EyeIcon, EyeOff } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import Image from "next/image";
import { GOOGLE_CLIENT_ID, REDIRECT_URL } from "@/config/envConfig";

export default function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {}
  );

  // Validation handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors: typeof errors = {};

    // Email validation
    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      newErrors.email = "Enter a valid email address";
    }

    // Password validation
    if (!password) {
      newErrors.password = "Password is required";
    } else if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    setErrors(newErrors);

    // If no errors → proceed (later hook this to API)
    if (Object.keys(newErrors).length === 0) {
      console.log("✅ Form submitted successfully");
      // TODO: Integrate with authentication API
    }
  };

  const handleGoogleRedirect = () => {
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    // Always redirect back to our frontend callback so we can handle the code
    const googleRedirectUri = process.env.NEXT_PUBLIC_REDIRECT_UI;
    const scope = "openid email profile";

    // A quick check to make sure the variables are loaded
    if (!googleClientId || !googleRedirectUri) {
      console.error("Google Auth environment variables are not set!");
      // Optionally, show a toast error to the user
      // toast.error("Configuration error. Please try again later.");
      return;
    }
    const url = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleClientId}&redirect_uri=${googleRedirectUri}&response_type=code&scope=${encodeURIComponent(
      scope
    )}`;

    // Redirect the user
    window.location.href = url;
  };

  return (
    <motion.div
      className="flex-1 flex items-center justify-center p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/Bg-image.svg')" }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 0.9, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <div className="w-full max-w-md space-y-8">
        {/* Title */}
        <motion.div
          className="text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-2xl font-medium text-white">Welcome!</h1>
          <p className="text-neutral-300 mt-2 text-xs">
            Login to Stanxa AI to continue
          </p>
        </motion.div>

        {/* Social logins */}
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <div className="text-center flex flex-col space-y-2">
            <Link
              href={`https://accounts.google.com/o/oauth2/v2/auth?client_id=${GOOGLE_CLIENT_ID}&redirect_uri=${REDIRECT_URL}&response_type=code&scope=openid%20email%20profile`}
            >
              {/* Google */}
              <motion.div
                className="flex justify-center items-center gap-2 border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Image
                  src="/Google Icon.svg"
                  alt="Google Icon"
                  width={30}
                  height={30}
                />
                Log in With Google
              </motion.div>
            </Link>

            {/* Apple */}
            <motion.div
              className="flex justify-center items-center gap-2 border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="28"
                height="28"
                fill="currentColor"
                className="bi bi-apple"
                viewBox="0 0 16 16"
              >
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
              </svg>
              Log in With Apple
            </motion.div>
          </div>
        </motion.div>

        {/* Divider */}
        <motion.div
          className="relative flex items-center justify-center my-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
        >
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="flex-shrink mx-4 text-gray-400 font-medium">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </motion.div>

        {/* Email + Password fields */}
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <div className="text-center flex flex-col space-y-5">
            {/* Email */}
            <motion.div className="flex flex-col space-y-2">
              <p className="text-gray-200 text-left text-sm">Email</p>
              <motion.input
                placeholder="Enter your Email"
                className="p-2 rounded-xl border-[0.25px] border-gray-300 placeholder:text-gray-300 placeholder:text-sm"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {errors.email && (
                <p className="text-red-500 text-xs text-left">{errors.email}</p>
              )}
            </motion.div>

            {/* Password */}
            <motion.div className="flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-gray-200 text-left text-sm">Password</p>
                <Link
                  href="/"
                  className="text-sm text-[#eac565] hover:underline "
                >
                  Forget Password?
                </Link>
              </div>
              <motion.div className="flex justify-between items-center gap-3 border border-gray-300 rounded-xl p-2">
                <input
                  placeholder="Enter your Password"
                  className="w-full outline-none bg-transparent text-gray-300 placeholder-gray-300 placeholder:text-sm"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <motion.button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-500 hover:text-gray-300 focus:outline-none"
                >
                  {showPassword ? (
                    <EyeIcon className="size-5 transition-all duration-300" />
                  ) : (
                    <EyeOff className="size-5 transition-all duration-300" />
                  )}
                </motion.button>
              </motion.div>
              {errors.password && (
                <p className="text-red-500 text-xs text-left">
                  {errors.password}
                </p>
              )}
            </motion.div>
          </div>

          {/* Submit Button */}
          <motion.div
            className="w-full max-w-md space-y-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="text-center flex flex-col space-y-2">
              {/* Login Button */}
              <motion.div
                className="flex justify-center items-center gap-2 w-full bg-[var(--primary2)] text-[#1f1f1f] px-4 py-2 rounded-xl cursor-pointer hover:bg-[#eac565] transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
              >
                Log in
              </motion.div>
            </div>
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div className="text-center">
          <p className="text-sm text-neutral-300">
            Don't have an account?{" "}
            <motion.a
              href="/auth/signup"
              className="hover:underline font-medium text-[var(--primary2)]"
            >
              Sign up
            </motion.a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
