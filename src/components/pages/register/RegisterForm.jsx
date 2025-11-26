"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Phone, Lock, UserPlus, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";

export default function RegisterForm() {
  const router = useRouter();
  const { registerPhone, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.phone) {
      newErrors.phone = "Phone number is required";
    } else if (!/^\+?[1-9]\d{1,14}$/.test(formData.phone.replace(/\s/g, ""))) {
      newErrors.phone = "Please enter a valid phone number";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!agreeToTerms) {
      newErrors.terms = "You must agree to the terms and conditions";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

      const result = await registerPhone({
      phone: formData.phone,
        password: formData.password,
        password_confirmation: formData.confirmPassword,
      });

      if (result.success) {
      // Save phone and password in sessionStorage for OTP verification and resend
        if (typeof window !== "undefined") {
        sessionStorage.setItem("registrationPhone", formData.phone);
          sessionStorage.setItem("registrationPassword", formData.password);
        }

      toastSuccess("OTP sent to your phone. Please verify your number.");
        router.push("/enter-otp");
    } else {
      // Handle errors
      if (result.errors) {
        setErrors(result.errors);
      } else {
        toastError(result.error || "Registration failed. Please try again.");
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* Phone */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Phone className="w-4 h-4 inline mr-1" />
          Phone number
        </label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-white/10 border ${
            errors.phone ? "border-red-500" : "border-white/20"
          } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
          placeholder="Enter your phone number"
        />
        {errors.phone && (
          <p className="mt-1 text-red-400 text-sm">{errors.phone}</p>
        )}
      </div>

      {/* Password */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Lock className="w-4 h-4 inline mr-1" />
          Create Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleInputChange}
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
          <p className="mt-1 text-red-400 text-sm">{errors.password}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Lock className="w-4 h-4 inline mr-1" />
          Confirm Password
        </label>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
              errors.confirmPassword ? "border-red-500" : "border-white/20"
            } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
            placeholder="Confirm your password"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-theme3 transition-colors"
          >
            {showConfirmPassword ? (
              <EyeOff className="w-5 h-5" />
            ) : (
              <Eye className="w-5 h-5" />
            )}
          </button>
        </div>
        {errors.confirmPassword && (
          <p className="mt-1 text-red-400 text-sm">{errors.confirmPassword}</p>
        )}
      </div>

      {/* Terms Checkbox */}
      <div className="flex items-start">
        <input
          type="checkbox"
          checked={agreeToTerms}
          onChange={(e) => {
            setAgreeToTerms(e.target.checked);
            if (errors.terms) {
              setErrors((prev) => ({ ...prev, terms: "" }));
            }
          }}
          className="w-4 h-4 rounded border-white/20 bg-white/10 text-theme3 focus:ring-theme3 mt-1"
        />
        <span className="ml-2 text-text text-sm">
          I agree to Terms and condition
        </span>
      </div>
      {errors.terms && (
        <p className="text-red-400 text-sm -mt-2">{errors.terms}</p>
      )}

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={!agreeToTerms || isLoading}
        whileHover={agreeToTerms && !isLoading ? { scale: 1.02 } : {}}
        whileTap={agreeToTerms && !isLoading ? { scale: 0.98 } : {}}
        className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base  font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Sending...
          </>
        ) : (
          <>
            <UserPlus className="w-5 h-5" />
            Register
          </>
        )}
      </motion.button>
    </form>
  );
}
