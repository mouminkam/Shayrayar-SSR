"use client";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Mail, Lock, LogIn, Eye, EyeOff } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";

export default function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { login, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});

  // Load saved email from localStorage if Remember Me was checked
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedEmail = localStorage.getItem("rememberedEmail");
      if (savedEmail) {
        setFormData((prev) => ({ ...prev, email: savedEmail }));
        setRememberMe(true);
      }
    }
  }, []);

  // Handle error from query params (e.g., from redirects)
  useEffect(() => {
    const error = searchParams?.get("error");
    if (error) {
      toastError(error);
      // Clear error from URL
      if (typeof window !== "undefined") {
        const url = new URL(window.location.href);
        url.searchParams.delete("error");
        window.history.replaceState({}, "", url);
      }
    }
  }, [searchParams, toastError]);

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

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!validateForm()) {
      return false;
    }

    try {
      const result = await login(formData.email, formData.password);

      if (result.success) {
        // Save email to localStorage if Remember Me is checked
        if (rememberMe) {
          localStorage.setItem("rememberedEmail", formData.email);
        } else {
          localStorage.removeItem("rememberedEmail");
        }

        toastSuccess("Login successful! Welcome back!");

        // Redirect to returnUrl or home
        const returnUrl = searchParams?.get("returnUrl") || "/";
        router.push(returnUrl);
      } else {
        // Handle errors - show toast immediately
        if (result.errors) {
          setErrors(result.errors);
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

    return false;
  };



  return (
    <form onSubmit={handleSubmit} className="space-y-6" noValidate>
      {/* Email */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Mail className="w-4 h-4 inline mr-1" />
          Email Address
        </label>
        <input
          type="email"
          name="email"
          value={formData.email}
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

      {/* Password */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Lock className="w-4 h-4 inline mr-1" />
          Password
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
          href="/reset-password"
          className="text-theme3 hover:text-theme text-sm font-medium transition-colors"
        >
          Forgot password?
        </a>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading}
        whileHover={!isLoading ? { scale: 1.02 } : {}}
        whileTap={!isLoading ? { scale: 0.98 } : {}}
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
  );
}
