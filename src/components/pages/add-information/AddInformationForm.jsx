"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { User, Mail, MapPin, ArrowRight } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useToastStore from "../../../store/toastStore";

export default function AddInformationForm() {
  const router = useRouter();
  const { completeRegistration, getRegistrationBranches, isLoading } = useAuthStore();
  const { success: toastSuccess, error: toastError } = useToastStore();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    location: "",
    branch_id: "",
  });
  const [branches, setBranches] = useState([]);
  const [loadingBranches, setLoadingBranches] = useState(true);
  const [errors, setErrors] = useState({});

  // Load registration token and branches
  useEffect(() => {
    const loadData = async () => {
      // Check if we have registration token
      if (typeof window !== "undefined") {
        const token = sessionStorage.getItem("registrationToken");
        if (!token) {
          toastError("Session expired. Please start registration again.");
          setTimeout(() => {
            router.push("/register");
          }, 2000);
          return;
        }

        // Load branches
        try {
          const result = await getRegistrationBranches("ar");
          if (result.success && result.branches) {
            setBranches(result.branches);
            // Set default branch if available
            if (result.branches.length > 0 && !formData.branch_id) {
              setFormData((prev) => ({
                ...prev,
                branch_id: result.branches[0].id.toString(),
              }));
            }
          } else {
            toastError(result.error || "Failed to load branches");
          }
        } catch (error) {
          toastError(error.message || "Failed to load branches");
        } finally {
          setLoadingBranches(false);
        }
      }
    };

    loadData();
  }, [router, toastError, getRegistrationBranches]);

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

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.branch_id) {
      newErrors.branch_id = "Please select a branch";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Check if we have registration token
    if (typeof window !== "undefined") {
      const token = sessionStorage.getItem("registrationToken");
      if (!token) {
        toastError("Session expired. Please start registration again.");
        router.push("/register");
        return;
      }
    }

    try {
      // Combine first and last name
      const fullName = `${formData.firstName} ${formData.lastName}`.trim();

      const result = await completeRegistration({
        name: fullName,
        email: formData.email,
        branch_id: parseInt(formData.branch_id),
      });

      if (result.success) {
        toastSuccess("Registration completed successfully! Welcome!");
        // Clean up sessionStorage
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("registrationToken");
          sessionStorage.removeItem("registrationPhone");
          sessionStorage.removeItem("registrationPassword");
        }
        setTimeout(() => {
          router.push("/");
        }, 2000);
      } else {
        const errorMessage = result.error || "Failed to complete registration. Please try again.";
        toastError(errorMessage);
        
        // Set field-specific errors if available
        if (result.errors) {
          const apiErrors = {};
          Object.keys(result.errors).forEach((key) => {
            // Map API error keys to form field names
            if (key === "name") {
              // Split name errors between first and last name
              apiErrors.firstName = Array.isArray(result.errors[key]) 
                ? result.errors[key][0] 
                : result.errors[key];
            } else {
              apiErrors[key] = Array.isArray(result.errors[key]) 
                ? result.errors[key][0] 
                : result.errors[key];
            }
          });
          setErrors({ ...errors, ...apiErrors });
        }
      }
    } catch (error) {
      toastError(error.message || "An unexpected error occurred. Please try again.");
    }
  };

  const handleLocationClick = () => {
    // Location picker logic will be added later
    // For now, just show a message
    toastError("Location picker will be implemented soon");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {/* First Name */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <User className="w-4 h-4 inline mr-1" />
          First name
        </label>
        <input
          type="text"
          name="firstName"
          value={formData.firstName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-white/10 border ${
            errors.firstName ? "border-red-500" : "border-white/20"
          } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
          placeholder="Enter your first name"
        />
        {errors.firstName && (
          <p className="mt-1 text-red-400 text-sm">{errors.firstName}</p>
        )}
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <User className="w-4 h-4 inline mr-1" />
          Last name
        </label>
        <input
          type="text"
          name="lastName"
          value={formData.lastName}
          onChange={handleInputChange}
          className={`w-full px-4 py-3 bg-white/10 border ${
            errors.lastName ? "border-red-500" : "border-white/20"
          } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300`}
          placeholder="Enter your last name"
        />
        {errors.lastName && (
          <p className="mt-1 text-red-400 text-sm">{errors.lastName}</p>
        )}
      </div>

      {/* Email */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <Mail className="w-4 h-4 inline mr-1" />
          E-mail address
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

      {/* Branch Selection */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Branch
        </label>
        <select
          name="branch_id"
          value={formData.branch_id}
          onChange={handleInputChange}
          disabled={loadingBranches}
          className={`w-full px-4 py-3 bg-white/10 border ${
            errors.branch_id ? "border-red-500" : "border-white/20"
          } rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
        >
          <option value="">Select a branch</option>
          {branches.map((branch) => (
            <option key={branch.id} value={branch.id} className="bg-bg3">
              {branch.name || branch.title || `Branch ${branch.id}`}
            </option>
          ))}
        </select>
        {errors.branch_id && (
          <p className="mt-1 text-red-400 text-sm">{errors.branch_id}</p>
        )}
      </div>

      {/* Location */}
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          <MapPin className="w-4 h-4 inline mr-1" />
          Location
        </label>
        <div className="relative">
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="w-full px-4 py-3 pr-12 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
            placeholder="Enter your location (optional)"
          />
          <button
            type="button"
            onClick={handleLocationClick}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-text hover:text-theme3 transition-colors"
          >
            <MapPin className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Submit Button */}
      <motion.button
        type="submit"
        disabled={isLoading || loadingBranches}
        whileHover={{ scale: isLoading || loadingBranches ? 1 : 1.02 }}
        whileTap={{ scale: isLoading || loadingBranches ? 1 : 0.98 }}
        className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base  font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-6"
      >
        {isLoading ? (
          <>
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
            />
            Completing Registration...
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
