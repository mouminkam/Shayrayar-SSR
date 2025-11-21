"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";
import OTPInput from "./OTPInput";

export default function OTPForm() {
  const router = useRouter();
  const { verifyPhoneOTP, verifyOTP, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const [otp, setOtp] = useState(["", "", "", ""]);
  const inputRefs = useRef([]);
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [flowType, setFlowType] = useState(""); // "registration", "reset", or "google-login"

  // Determine flow type and get phone/email from sessionStorage
  useEffect(() => {
    if (typeof window !== "undefined") {
      const googleFlow = sessionStorage.getItem("googleFlow");
      const registrationPhone = sessionStorage.getItem("registrationPhone");
      const resetEmail = sessionStorage.getItem("resetEmail");

      if (googleFlow && registrationPhone) {
        // Google login flow
        setPhone(registrationPhone);
        setFlowType("google-login");
      } else if (registrationPhone) {
        // Regular registration flow
        setPhone(registrationPhone);
        setFlowType("registration");
      } else if (resetEmail) {
        // Reset password flow
        setEmail(resetEmail);
        setFlowType("reset");
      } else {
        // No flow data, redirect to appropriate page
        router.push("/register");
      }
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpString = otp.join("");

    if (otpString.length !== 4) {
      toastError("Please enter the complete 4-digit OTP");
      return;
    }

    // Validate OTP format (should be numeric)
    if (!/^\d{4}$/.test(otpString)) {
      toastError("OTP must contain only numbers");
      return;
    }

    try {
      if (flowType === "google-login") {
        // Google login flow - verify OTP and complete login
        const result = await verifyPhoneOTP(phone, otpString);

        if (result.success) {
          // Get Google user data from sessionStorage
          if (typeof window !== "undefined") {
            const googleUserStr = sessionStorage.getItem("googleUser");
            const googleToken = sessionStorage.getItem("googleToken");

            if (googleUserStr && googleToken) {
              const googleUser = JSON.parse(googleUserStr);
              
              // Update user with verified phone
              const updatedUser = {
                ...googleUser,
                phone: phone,
              };

              // Save user + token in authStore
              const authStore = useAuthStore.getState();
              authStore.setState({
                user: { ...updatedUser, token: googleToken },
                isAuthenticated: true,
              });

              // Cleanup sessionStorage
              sessionStorage.removeItem("googleUser");
              sessionStorage.removeItem("googleToken");
              sessionStorage.removeItem("googleFlow");
              sessionStorage.removeItem("registrationPhone");
            }
          }

          toastSuccess("Phone verified successfully! Welcome!");
          router.push("/");
        } else {
          const errorMessage = result.error || "Invalid OTP. Please try again.";
          toastError(errorMessage);
          setOtp(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } else if (flowType === "registration") {
        // Registration flow
        const result = await verifyPhoneOTP(phone, otpString);

        if (result.success) {
          toastSuccess("Phone verified successfully! Please complete your registration.");
          router.push("/add-information");
        } else {
          const errorMessage = result.error || "Invalid OTP. Please try again.";
          toastError(errorMessage);
          setOtp(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      } else if (flowType === "reset") {
        // Reset password flow
        const result = await verifyOTP(email, otpString);

        if (result.success) {
          toastSuccess("OTP verified successfully! You can now reset your password.");
          router.push("/confirm-information");
        } else {
          const errorMessage = result.error || "Invalid OTP. Please try again.";
          toastError(errorMessage);
          setOtp(["", "", "", ""]);
          inputRefs.current[0]?.focus();
        }
      }
    } catch (error) {
      const errorMessage = error.message || "An unexpected error occurred. Please try again.";
      toastError(errorMessage);
      setOtp(["", "", "", ""]);
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
            Continue
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </motion.button>
    </form>
  );
}
