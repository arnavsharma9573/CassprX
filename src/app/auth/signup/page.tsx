"use client";
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import RegisterForm from "@/components/auth/RegisterForm";

export default function page() {
  return (
    <motion.div
      className="min-h-screen flex text-gray-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.95 }}
      transition={{ duration: 0.5 }}
    >
      {/* Left side - Login Form */}
      <RegisterForm />
    </motion.div>
  );
}
