"use client";
import { motion } from "framer-motion";
import { KeyRound } from "lucide-react";

export default function ResetPasswordHeader() {
  return (
    <div className="text-center mb-8">
      <motion.div
        whileHover={{ scale: 1.1, rotate: 5 }}
        className="w-16 h-16 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center mx-auto mb-4"
      >
        <KeyRound className="w-8 h-8 text-white fill-white" />
      </motion.div>
      <h2 className="text-theme3 font-['Epilogue',sans-serif] text-3xl font-black uppercase mb-2">
        Confirm your Information
      </h2>
      <p className="text-text text-base">
        Enter the email address associated with your account and we'll send a code to reset your password
      </p>
    </div>
  );
}

