"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import OTPHeader from "./OTPHeader";
import OTPForm from "./OTPForm";
import OTPFooter from "./OTPFooter";

export default function OTPSection() {
  const router = useRouter();
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [flowType, setFlowType] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const registrationPhone = sessionStorage.getItem("registrationPhone");
      const resetEmail = sessionStorage.getItem("resetEmail");

      // Load session data - necessary for client-side only data
      if (registrationPhone) {
        setPhone(registrationPhone);
        setFlowType("registration");
        setIsLoading(false);
      } else if (resetEmail) {
        setEmail(resetEmail);
        setFlowType("reset");
        setIsLoading(false);
      } else {
        // No flow data, redirect
        router.push("/register");
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading || !flowType) {
    return null; // Loading state
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-8 lg:p-10"
    >
      <OTPHeader phone={phone} email={email} flowType={flowType} />
      <OTPForm />
      <OTPFooter />
    </motion.div>
  );
}
