"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, Eye, EyeOff, CheckCircle } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";

export default function ConfirmPasswordForm() {
  const router = useRouter();
  const { resetPassword, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [resetToken, setResetToken] = useState("");
  const [resetEmail, setResetEmail] = useState("");
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    // Get token and email from sessionStorage
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("resetToken");
      const storedEmail = sessionStorage.getItem("resetEmail");
      
      if (token) {
        setResetToken(token);
      }
      
      if (storedEmail) {
        setResetEmail(storedEmail);
      }
      
      // Redirect if token or email is missing
      if (!token || !storedEmail) {
        toastError("Session expired. Please start the password reset process again.");
        setTimeout(() => {
          router.push("/reset-password");
        }, 2000);
      }
    }
  }, [router, toastError]);

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

    if (!formData.newPassword) {
      newErrors.newPassword = "Password is required";
    } else if (formData.newPassword.length < 6) {
      newErrors.newPassword = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password";
    } else if (formData.newPassword !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Validate that we have token and email
    if (!resetToken || !resetEmail) {
      toastError("Session expired. Please start the password reset process again.");
      router.push("/reset-password");
      return;
    }

    // Prepare reset data according to API requirements
    const resetData = {
      token: resetToken,
      email: resetEmail,
      password: formData.newPassword,
      password_confirmation: formData.confirmPassword,
    };

    try {
      const result = await resetPassword(resetData);

      if (result.success) {
        toastSuccess("Password reset successfully! You can now login with your new password.");
        // Clean up sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("resetEmail");
          sessionStorage.removeItem("resetToken");
        }
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else {
        // Handle API validation errors
        const errorMessage = result.error || "Failed to reset password. Please try again.";
        toastError(errorMessage);
        
        // Set field-specific errors if available from API
        if (result.errors) {
          const apiErrors = {};
          Object.keys(result.errors).forEach((key) => {
            // Map API error keys to form field names
            const fieldName = key === "password" ? "newPassword" : 
                             key === "password_confirmation" ? "confirmPassword" : key;
            apiErrors[fieldName] = Array.isArray(result.errors[key]) 
              ? result.errors[key][0] 
              : result.errors[key];
          });
          setErrors({ ...errors, ...apiErrors });
        }
      }
    } catch (error) {
      // Handle unexpected errors
      toastError(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* New Password */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Lock className="w-4 h-4 inline mr-1" />
          Create new password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="newPassword"
            value={formData.newPassword}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 pr-12 bg-white/10 border ${
              errors.newPassword ? "border-red-500" : "border-white/20"
            } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
            placeholder="Enter new password"
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
        {errors.newPassword && (
          <p className="mt-1 text-red-400 text-sm">{errors.newPassword}</p>
        )}
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Lock className="w-4 h-4 inline mr-1" />
          Confirm password
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
            placeholder="Confirm new password"
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

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={{ scale: isLoading ? 1 : 1.02 }}
        whileTap={{ scale: isLoading ? 1 : 0.98 }}
        className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base  font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Resetting Password...
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
