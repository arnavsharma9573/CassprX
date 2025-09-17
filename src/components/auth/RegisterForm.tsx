"use client";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useState } from "react";
import TermsModal from "./TermsAndConditions";
import Image from "next/image";

export default function RegisterForm() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [accepted, setAccepted] = useState(false);

  // form state
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    terms: accepted,
  });

  // error state
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // validate form
  const validate = () => {
    const newErrors: { [key: string]: string } = {};

    if (!formData.fullName.trim()) {
      newErrors.fullName = "Full name is required.";
    }

    if (!formData.email) {
      newErrors.email = "Email is required.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Enter a valid email.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters.";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    if (!accepted) {
      newErrors.terms = "You must agree to the terms.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // handle submit
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      // TODO: Implement actual registration API call
      setFormData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        terms: false,
      });
      setAccepted(false);
    }
  };

  return (
    <motion.div
      className="flex-1 flex items-center justify-center p-8 bg-cover bg-center"
      style={{ backgroundImage: "url('/Bg-image.svg')" }}
      initial={{ opacity: 0, x: -50 }}
      animate={{ opacity: 0.90, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
    >
      <motion.div
        className="w-full max-w-md space-y-8"
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 0.95, opacity: 1 }}
        transition={{ duration: 0.4 }}
      >
        {/* Title */}
        <motion.div
          className="text-left"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <h1 className="text-3xl font-medium text-white">Create Account</h1>
          <p className="text-neutral-300 mt-2 text-sm">
            Sign up to get started with Stanxa AI
          </p>
        </motion.div>

        {/* Social logins */}
        <motion.div
          className="w-full max-w-md space-y-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <motion.div className="text-center flex flex-col space-y-2">
            {/* Google */}
            <motion.div
              className="flex justify-center items-center gap-2 border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {/* Google Icon */}
              <Image
                src="/Google Icon.svg"
                alt="Google Icon"
                width={30}
                height={30}
              />
              Log in With Google
            </motion.div>

            {/* Apple */}
            <motion.div
              className="flex justify-center items-center gap-2 border border-slate-700/50 bg-slate-800/20 backdrop-blur-sm px-4 py-2 rounded-xl cursor-pointer hover:bg-slate-800/30 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="30"
                height="30"
                fill="currentColor"
                className="bi bi-apple"
                viewBox="0 0 16 16"
              >
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
                <path d="M11.182.008C11.148-.03 9.923.023 8.857 1.18c-1.066 1.156-.902 2.482-.878 2.516s1.52.087 2.475-1.258.762-2.391.728-2.43m3.314 11.733c-.048-.096-2.325-1.234-2.113-3.422s1.675-2.789 1.698-2.854-.597-.79-1.254-1.157a3.7 3.7 0 0 0-1.563-.434c-.108-.003-.483-.095-1.254.116-.508.139-1.653.589-1.968.607-.316.018-1.256-.522-2.267-.665-.647-.125-1.333.131-1.824.328-.49.196-1.422.754-2.074 2.237-.652 1.482-.311 3.83-.067 4.56s.625 1.924 1.273 2.796c.576.984 1.34 1.667 1.659 1.899s1.219.386 1.843.067c.502-.308 1.408-.485 1.766-.472.357.013 1.061.154 1.782.539.571.197 1.111.115 1.652-.105.541-.221 1.324-1.059 2.238-2.758q.52-1.185.473-1.282" />
              </svg>
              Log in With Apple
            </motion.div>
          </motion.div>
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

        {/* Form */}
        <motion.form
          onSubmit={handleSubmit}
          className="w-full max-w-md space-y-5"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {/* Full Name */}
          <div className="flex flex-col space-y-2">
            <p className="text-gray-200 text-left text-sm">Full Name</p>
            <input
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              placeholder="Enter your full name"
              className="p-2 rounded-xl border-[0.25px] border-gray-300 placeholder-gray-300 placeholder:text-sm"
              type="text"
            />
            {errors.fullName && (
              <span className="text-red-500 text-xs">{errors.fullName}</span>
            )}
          </div>

          {/* Email */}
          <div className="flex flex-col space-y-2">
            <p className="text-gray-200 text-left text-sm">Email</p>
            <input
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              className="p-2 rounded-xl border-[0.25px] border-gray-300 placeholder-gray-300  placeholder:text-sm"
              type="email"
            />
            {errors.email && (
              <span className="text-red-500 text-xs">{errors.email}</span>
            )}
          </div>

          {/* Password */}
          <div className="flex flex-col space-y-2">
            <p className="text-gray-200 text-left text-sm">Password</p>
            <div className="flex justify-between items-center gap-3 border border-gray-300 rounded-xl p-2">
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full outline-none bg-transparent text-gray-300 placeholder-gray-300 placeholder:text-sm"
                type={showPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showPassword ? (
                  <EyeIcon className="size-5 transition-all duration-300" />
                ) : (
                  <EyeOffIcon className="size-5 transition-all duration-300" />
                )}
              </button>
            </div>
            {errors.password && (
              <span className="text-red-500 text-xs">{errors.password}</span>
            )}
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col space-y-2">
            <p className="text-gray-200 text-left text-sm">Confirm Password</p>
            <div className="flex justify-between items-center gap-3 border border-gray-300 rounded-xl p-2">
              <input
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Re-enter your password"
                className="w-full outline-none bg-transparent text-gray-300 placeholder-gray-300 placeholder:text-sm "
                type={showConfirmPassword ? "text" : "password"}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="text-gray-500 hover:text-gray-300 focus:outline-none"
              >
                {showConfirmPassword ? (
                  <EyeIcon className="size-5 transition-all duration-300" />
                ) : (
                  <EyeOffIcon className="size-5 transition-all duration-300" />
                )}
              </button>
            </div>
            {errors.confirmPassword && (
              <span className="text-red-500 text-xs">
                {errors.confirmPassword}
              </span>
            )}
          </div>

          {/* Terms */}
          <div className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              name="terms"
              checked={accepted}
              onChange={() => setAccepted(!accepted)}
            />
            <p className="text-sm text-gray-400">
              I agree to the{" "}
              <span
                onClick={() => setIsOpen(true)}
                className="bg-gradient-to-r from-[#E6A550] to-[#BC853B] bg-clip-text text-transparent hover:underline"
              >
                Terms & Conditions
              </span>
            </p>
          </div>
          {errors.terms && (
            <span className="text-red-500 text-xs">{errors.terms}</span>
          )}

          {/* Submit */}
          <motion.button
            type="submit"
            className="w-full bg-[var(--primary2)] text-[#1f1f1f] px-4 py-2 rounded-xl cursor-pointer hover:bg-[var(--primary2)] transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Sign Up
          </motion.button>

          <motion.div className="text-center">
            <p className="text-sm text-gray-100">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className=" hover:underline font-medium text-[var(--primary2)]"
              >
                Log In
              </Link>{" "}
            </p>
          </motion.div>
        </motion.form>
      </motion.div>
      <TermsModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        onAccept={() => {
          setAccepted(true); // ✅ Check the box when user accepts
          setIsOpen(false);
        }}
      />
    </motion.div>
  );
}
