"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";

export default function ResetPasswordForm({ token, email }) {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
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

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!formData.password_confirmation) {
      newErrors.password_confirmation = "Please confirm your password";
    } else if (formData.password !== formData.password_confirmation) {
      newErrors.password_confirmation = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    if (!token || !email) {
      toastError("Invalid reset link. Please request a new one.");
      router.push("/forgot-password");
      return;
    }

    const result = await resetPassword({
      token,
      email,
      password: formData.password,
      password_confirmation: formData.password_confirmation,
    });

    if (result.success) {
      toastSuccess("Password reset successfully! Please login with your new password.");
      // Redirect to login after a short delay
      setTimeout(() => {
        router.push("/login");
      }, 1500);
    } else {
      // Handle errors
      if (result.errors) {
        setErrors(result.errors);
      } else {
        toastError(result.error || "Failed to reset password. Please try again.");
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Email (Read-only) */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Mail className="w-4 h-4 inline mr-1" />
          Email Address
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white/70 cursor-not-allowed"
        />
      </div>

      {/* New Password */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Lock className="w-4 h-4 inline mr-1" />
          New Password
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
            placeholder="Enter new password"
            minLength={8}
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
            name="password_confirmation"
            value={formData.password_confirmation}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
              errors.password_confirmation ? "border-red-500" : "border-white/20"
            } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
            placeholder="Confirm new password"
            minLength={8}
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
        {errors.password_confirmation && (
          <p className="mt-1 text-red-400 text-sm">{errors.password_confirmation}</p>
        )}
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading || !token || !email}
        whileHover={!isLoading && token && email ? { scale: 1.02 } : {}}
        whileTap={!isLoading && token && email ? { scale: 0.98 } : {}}
        className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base  font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
            Resetting...
          </>
        ) : (
          <>
            <CheckCircle className="w-5 h-5" />
            Reset Password
          </>
        )}
      </motion.button>
    </form>
  );
}
