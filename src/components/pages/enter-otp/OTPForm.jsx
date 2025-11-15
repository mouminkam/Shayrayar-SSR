"use client";
import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";
import OTPInput from "./OTPInput";

export default function OTPForm({ email }) {
  const router = useRouter();
  const { verifyOTP, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const inputRefs = useRef([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 6) {
      toastError("Please enter the complete 6-digit OTP");
      return;
    }

    const result = await verifyOTP(email, otpString);

    if (result.success) {
      toastSuccess("OTP verified successfully!");
      router.push("/confirm-information");
    } else {
      toastError(result.error || "Invalid OTP. Please try again.");
      setOtp(["", "", "", "", "", ""]);
      inputRefs.current[0]?.focus();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <OTPInput otp={otp} setOtp={setOtp} inputRefs={inputRefs} />

      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base font-['Epilogue',sans-serif] font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Verifying...
          </>
        ) : (
          <>
            Verify OTP
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </form>
  );
}

