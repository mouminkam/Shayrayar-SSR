"use client";
import { useState, useEffect } from "react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";

export default function OTPFooter() {
  const { success: toastSuccess, error: toastError } = useToastStore();
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [flowType, setFlowType] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const registrationPhone = sessionStorage.getItem("registrationPhone");
      const resetEmail = sessionStorage.getItem("resetEmail");

      if (registrationPhone) {
        setPhone(registrationPhone);
        setFlowType("registration");
      } else if (resetEmail) {
        setEmail(resetEmail);
        setFlowType("reset");
      }
    }
  }, []);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => {
        setResendTimer((prev) => prev - 1);
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleResend = async () => {
    if (!canResend) return;

    try {
      if (flowType === "registration") {
        const { registerPhone } = useAuthStore.getState();
        const storedPassword = typeof window !== "undefined" 
          ? sessionStorage.getItem("registrationPassword") 
          : "";

        if (!storedPassword) {
          toastError("Please go back and resubmit the registration form");
          return;
        }

        const result = await registerPhone({
          phone: phone,
          password: storedPassword,
          password_confirmation: storedPassword,
        });

        if (result.success) {
          toastSuccess("OTP resent to your phone");
          setResendTimer(60);
          setCanResend(false);
        } else {
          toastError(result.error || "Failed to resend OTP");
        }
      } else if (flowType === "reset") {
        const { resetPasswordRequest } = useAuthStore.getState();
        const result = await resetPasswordRequest(email);
        if (result.success) {
          toastSuccess("OTP resent to your email");
          setResendTimer(60);
          setCanResend(false);
        } else {
          toastError(result.error || "Failed to resend OTP");
        }
      }
    } catch (error) {
      toastError(error.message || "Failed to resend OTP");
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="mt-6 text-center space-y-2">
      <p className="text-theme3 text-sm font-medium">
        {flowType === "registration" 
          ? "A code has been sent to your phone"
          : "A code has been sent to your email"}
      </p>
      {canResend ? (
        <button
          type="button"
          onClick={handleResend}
          className="text-theme3 hover:text-theme text-sm font-medium transition-colors underline"
        >
          Resend code
        </button>
      ) : (
        <p className="text-text text-sm">
          Resend in {formatTime(resendTimer)}
        </p>
      )}
    </div>
  );
}
