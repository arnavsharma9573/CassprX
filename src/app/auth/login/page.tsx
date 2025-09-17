"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import LoginForm from "@/components/auth/LoginForm";
import RightSide from "@/components/auth/RightSide";

export default function page() {
  return (
    <motion.div
      className="min-h-screen flex text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left side - Login Form */}
      <LoginForm />
    </motion.div>
  );
}
