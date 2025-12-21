"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "../../../lib/validations/authSchemas";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";
import LegalModal from "../../ui/LegalModal";

export default function LoginForm() {
  const router = useRouter();
  const { login, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { lang } = useLanguage();
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isTermsOpen, setIsTermsOpen] = useState(false);
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    mode: "onChange",
  });

  // Load saved email from localStorage if Remember Me was checked
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setValue("email", savedEmail);
        setRememberMe(true);
      }
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    if (!agreeToTerms) {
      toastError(t(lang, "please_agree_to_terms"));
      return;
    }

    try {
      const result = await login(data.email, data.password);

      if (result.success) {
        // Save email to localStorage if Remember Me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", data.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        toastSuccess("Login successful! Welcome back!");

        // Redirect to home
        router.push("/");
      } else {
        // Handle errors - show toast immediately
        if (result.errors) {
          // Show toast for validation errors
          const errorMessages = Object.values(result.errors).flat();
          if (errorMessages.length > 0) {
            toastError(errorMessages.join(", "));
          }
        } else {
          // Show toast for login failure
          const errorMessage = "Email or password is incorrect";
          toastError(errorMessage);
        }
      }
    } catch (error) {
      // Catch any unexpected errors
      console.error("Login error:", error);
      toastError(error?.message || "An error occurred during login. Please try again.");
    }
  };

  const handleTermsClick = (e) => {
    e.preventDefault();
    setIsTermsOpen(true);
  };

  const handlePrivacyClick = (e) => {
    e.preventDefault();
    setIsPrivacyOpen(true);
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6" noValidate>
        {/* Email */}
        <div>
          <label className="block text-text  text-sm font-medium mb-2">
            <Mail className="w-4 h-4 inline mr-1" />
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-4 py-3 bg-white/10 border ${
              errors.email ? "border-red-500" : "border-white/20"
            } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
            placeholder="your@email.com"
          />
          {errors.email && (
            <p className="mt-1 text-red-400 text-sm">{errors.email.message}</p>
          )}
        </div>

        {/* Password */}
        <div>
          <label className="block text-text  text-sm font-medium mb-2">
            <Lock className="w-4 h-4 inline mr-1" />
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              {...register("password")}
              className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
                errors.password ? "border-red-500" : "border-white/20"
              } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
              placeholder="Enter your password"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-theme3 transition-colors"
            >
              {showPassword ? (
                <EyeOff className="w-5 h-5" />
              ) : (
                <Eye className="w-5 h-5" />
              )}
            </button>
          </div>
          {errors.password && (
            <p className="mt-1 text-red-400 text-sm">{errors.password.message}</p>
          )}
        </div>

        {/* Terms & Privacy Checkbox */}
        <div className="flex items-start">
          <input
            type="checkbox"
            checked={agreeToTerms}
            onChange={(e) => setAgreeToTerms(e.target.checked)}
            className="w-4 h-4 rounded border-white/20 bg-white/10 text-theme3 focus:ring-theme3 mt-1"
          />
          <span className="ml-2 text-text text-sm">
            {t(lang, "agree_to_terms")}{" "}
            <button
              type="button"
              onClick={handleTermsClick}
              className="text-theme3 hover:text-theme underline font-medium"
            >
              {t(lang, "terms_and_conditions_link")}
            </button>{" "}
            {t(lang, "and_privacy_policy_link")}{" "}
            <button
              type="button"
              onClick={handlePrivacyClick}
              className="text-theme3 hover:text-theme underline font-medium"
            >
              {t(lang, "privacy_policy_link")}
            </button>
          </span>
        </div>

        {/* Forgot Password */}
        <div className="flex items-center justify-between">
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              className="w-4 h-4 rounded border-white/20 bg-white/10 text-theme3 focus:ring-theme3"
            />
            <span className="ml-2 text-theme3 text-sm">Remember me</span>
          </label>
          <a
            href="/forgot-password"
            className="text-theme3 hover:text-theme text-sm font-medium transition-colors"
          >
            Forgot password?
          </a>
        </div>

        {/* Submit Button */}
        <motion.button
          type="submit"
          disabled={isLoading || !agreeToTerms}
          whileHover={!isLoading && agreeToTerms ? { scale: 1.02 } : {}}
          whileTap={!isLoading && agreeToTerms ? { scale: 0.98 } : {}}
          className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base  font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
              Logging in...
            </>
          ) : (
            <>
              <LogIn className="w-5 h-5" />
              Login
            </>
          )}
        </motion.button>
      </form>

      {/* Legal Modals */}
      <LegalModal
        isOpen={isTermsOpen}
        onClose={() => setIsTermsOpen(false)}
        type="terms-conditions"
      />
      <LegalModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
        type="privacy-policy"
      />
    </>
  );
}
