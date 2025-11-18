"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, ArrowRight } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";

export default function ResetPasswordForm() {
  const router = useRouter();
  const { resetPasswordRequest, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const value = e.target.value;
    setEmail(value);
    // Clear error when user starts typing
    if (errors.email) {
      setErrors((prev) => ({
        ...prev,
        email: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    try {
      const result = await resetPasswordRequest(email);

      if (result.success) {
        // Save email to sessionStorage for OTP verification
        if (typeof window !== "undefined") {
          sessionStorage.setItem("resetEmail", email);
          // Clear any old token
          sessionStorage.removeItem("resetToken");
        }

        toastSuccess(result.message || "OTP sent to your email! Please check your inbox.");
        router.push("/enter-otp");
      } else {
        const errorMessage = result.error || "Failed to send OTP. Please try again.";
        toastError(errorMessage);
        setErrors({ email: errorMessage });
      }
    } catch (error) {
      const errorMessage = error.message || "An unexpected error occurred. Please try again.";
      toastError(errorMessage);
      setErrors({ email: errorMessage });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
          <Mail className="w-4 h-4 inline mr-1" />
          Enter your email address
        </label>
        <input
          type="email"
          value={email}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-white/10 border ${
            errors.email ? "border-red-500" : "border-white/20"
          } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
          placeholder="your@email.com"
        />
        {errors.email && (
          <p className="mt-1 text-red-400 text-sm">{errors.email}</p>
        )}
      </div>

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
            Sending...
          </>
        ) : (
          <>
            Send Code
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </form>
  );
}
