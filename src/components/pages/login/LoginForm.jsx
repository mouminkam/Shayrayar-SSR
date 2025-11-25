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

    if (!validateForm()) {
      return;
    }

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
      // Handle errors
      if (result.errors) {
        setErrors(result.errors);
      } else {
        toastError(result.error || "Login failed. Please try again.");
      }
    }
  };


  return (
    <form onSubmit={handleSubmit} className="space-y-6">
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

      {/* Divider */}
      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-white/20"></div>
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-transparent text-text">Or continue with</span>
        </div>
      </div>

      {/* Google Button */}
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full bg-white/10 hover:bg-white/20 text-white py-4 px-6 transition-all duration-300 text-base font-semibold rounded-xl shadow-lg hover:shadow-xl border border-white/20 flex items-center justify-center gap-3"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24">
          <path
            fill="currentColor"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="currentColor"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="currentColor"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
          />
          <path
            fill="currentColor"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
          />
        </svg>
        Continue with Google
      </motion.button>
    </form>
  );
}
