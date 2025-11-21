"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api";


// User structure
// { id, name, email, phone, address, orders: [], token }

// Order structure
// { id, items: [], total, status, date, shippingAddress, paymentMethod }

const useAuthStore = create(
  persist(
    (set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,

      // Actions
      login: async (email, password) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.login(email, password);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store user with token
            const userData = {
              ...user,
              token: token,
            };

            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true, user: userData };
          } else {
            set({ isLoading: false });
            return { 
              success: false, 
              error: response.message || "Login failed" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          // Extract error details from API response
          const errorMessage = error.message || "An error occurred during login";
          const apiErrors = error.data?.errors || null;
          
          return { 
            success: false, 
            error: errorMessage,
            errors: apiErrors
          };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          // Prepare registration data with password confirmation
          const registerData = {
            name: userData.name,
            email: userData.email,
            phone: userData.phone,
            password: userData.password,
            password_confirmation: userData.password_confirmation || userData.password,
            branch_id: userData.branch_id || 1, // Default branch_id if not provided
          };

          const response = await api.auth.register(registerData);
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store user with token
            const userDataWithToken = {
              ...user,
              token: token,
            };

            set({
              user: userDataWithToken,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true, user: userDataWithToken };
          } else {
            set({ isLoading: false });
            return { 
              success: false, 
              error: response.message || "Registration failed" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          // Extract error details from API response
          const errorMessage = error.message || "An error occurred during registration";
          const apiErrors = error.data?.errors || null;
          
          return { 
            success: false, 
            error: errorMessage,
            errors: apiErrors
          };
        }
      },

      logout: async () => {
        try {
          // Call logout API if user is authenticated
          if (get().isAuthenticated) {
            await api.auth.logout();
          }
        } catch (error) {
          console.error("Logout error:", error);
          // Continue with logout even if API call fails
        } finally {
          set({
            user: null,
            isAuthenticated: false,
          });
        }
      },

      updateProfile: async (updates) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.updateProfile(updates);
          
          if (response.success && response.data) {
            const currentUser = get().user;
            const updatedUser = {
              ...currentUser,
              ...response.data.user,
            };

            set({
              user: updatedUser,
              isLoading: false,
            });

            return { success: true, user: updatedUser };
          } else {
            set({ isLoading: false });
            return { 
              success: false, 
              error: response.message || "Failed to update profile" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message || "An error occurred while updating profile" 
          };
        }
      },

      fetchProfile: async () => {
        set({ isLoading: true });
        try {
          const response = await api.auth.getProfile();
          
          if (response.success && response.data) {
            const currentUser = get().user;
            const updatedUser = {
              ...currentUser,
              ...response.data.user,
            };

            set({
              user: updatedUser,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true, user: updatedUser };
          } else {
            set({ isLoading: false });
            return { 
              success: false, 
              error: response.message || "Failed to fetch profile" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message || "An error occurred while fetching profile" 
          };
        }
      },

      // Reset password flow helpers
      resetPasswordRequest: async (email) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.forgotPassword(email);
          set({ isLoading: false });
          
          if (response.success) {
            return { 
              success: true, 
              message: response.message || "OTP sent to your email" 
            };
          } else {
            return { 
              success: false, 
              error: response.message || "Failed to send OTP" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          // Extract error details from API response
          const errorMessage = error.message || "An error occurred";
          
          return { 
            success: false, 
            error: errorMessage
          };
        }
      },

      verifyOTP: async (email, otp) => {
        // Note: The API doesn't have a separate verifyOTP endpoint
        // We use the OTP as the token in reset-password endpoint
        // Save OTP to sessionStorage for use in reset password step
        set({ isLoading: true });
        try {
          if (!email || !otp) {
            set({ isLoading: false });
            return { success: false, error: "Email and OTP are required" };
          }

          // Validate OTP format (should be 4 digits)
          if (otp.length !== 4 || !/^\d{4}$/.test(otp)) {
            set({ isLoading: false });
            return { success: false, error: "OTP must be 4 digits" };
          }

          // Save OTP as token in sessionStorage for reset password step
          if (typeof window !== "undefined") {
            sessionStorage.setItem("resetToken", otp);
            sessionStorage.setItem("resetEmail", email);
          }

          set({ isLoading: false });
          return { success: true, token: otp };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message || "Failed to verify OTP" };
        }
      },

      resetPassword: async (resetData) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.resetPassword(resetData);
          set({ isLoading: false });
          
          if (response.success) {
            return { 
              success: true, 
              message: response.message || "Password reset successfully" 
            };
          } else {
            return { 
              success: false, 
              error: response.message || "Failed to reset password" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          // Extract error details from API response
          const errorMessage = error.message || "An error occurred while resetting password";
          const apiErrors = error.data?.errors || null;
          
          return { 
            success: false, 
            error: errorMessage,
            errors: apiErrors
          };
        }
      },

      // Multi-step registration flow
      registerPhone: async (phoneData) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.registerPhone(phoneData);
          set({ isLoading: false });
          
          if (response.success) {
            return { 
              success: true, 
              message: response.message || "OTP sent to your phone" 
            };
          } else {
            return { 
              success: false, 
              error: response.message || "Failed to send OTP" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          const errorMessage = error.message || "An error occurred";
          const apiErrors = error.data?.errors || null;
          
          return { 
            success: false, 
            error: errorMessage,
            errors: apiErrors
          };
        }
      },

      verifyPhoneOTP: async (phone, code) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.verifyPhone({ phone, code });
          set({ isLoading: false });
          
          if (response.success && response.data) {
            const { token } = response.data;
            
            // Store temporary token for completing registration
            if (typeof window !== "undefined") {
              sessionStorage.setItem("registrationToken", token);
              sessionStorage.setItem("registrationPhone", phone);
            }
            
            return { 
              success: true, 
              token: token,
              message: response.message || "Phone verified successfully" 
            };
          } else {
            return { 
              success: false, 
              error: response.message || "Invalid OTP code" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          const errorMessage = error.message || "An error occurred while verifying OTP";
          const apiErrors = error.data?.errors || null;
          
          return { 
            success: false, 
            error: errorMessage,
            errors: apiErrors
          };
        }
      },

      completeRegistration: async (userData) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.completeRegistration(userData);
          set({ isLoading: false });
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store user with token
            const userDataWithToken = {
              ...user,
              token: token,
            };

            set({
              user: userDataWithToken,
              isAuthenticated: true,
              isLoading: false,
            });

            // Clean up session storage
            if (typeof window !== "undefined") {
              sessionStorage.removeItem("registrationToken");
              sessionStorage.removeItem("registrationPhone");
            }

            return { success: true, user: userDataWithToken };
          } else {
            return { 
              success: false, 
              error: response.message || "Failed to complete registration" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          const errorMessage = error.message || "An error occurred while completing registration";
          const apiErrors = error.data?.errors || null;
          
          return { 
            success: false, 
            error: errorMessage,
            errors: apiErrors
          };
        }
      },

      getRegistrationBranches: async (lang = 'ar') => {
        set({ isLoading: true });
        try {
          const response = await api.auth.getRegistrationBranches(lang);
          set({ isLoading: false });
          
          if (response.success && response.data) {
            return { 
              success: true, 
              branches: response.data.branches || response.data 
            };
          } else {
            return { 
              success: false, 
              error: response.message || "Failed to fetch branches" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message || "An error occurred while fetching branches" 
          };
        }
      },

      // Google authentication
      getGoogleAuthUrl: async () => {
        set({ isLoading: true });
        try {
          const response = await api.auth.getGoogleAuthUrl();
          set({ isLoading: false });
          
          if (response.success && response.data) {
            return { 
              success: true, 
              data: response.data,
              url: response.data.redirect_url || response.data.url || response.data.auth_url 
            };
          } else {
            return { 
              success: false, 
              error: response.message || "Failed to get Google auth URL" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message || "An error occurred while getting Google auth URL" 
          };
        }
      },

      // Handle Google OAuth callback data
      handleGoogleOAuthCallback: async (callbackData) => {
        set({ isLoading: true });
        try {
          const { user, token } = callbackData;
          
          if (!user || !token) {
            set({ isLoading: false });
            return { success: false, error: "Invalid callback data" };
          }

          // Save user + token in sessionStorage for both cases
          if (typeof window !== "undefined") {
            sessionStorage.setItem("googleUser", JSON.stringify(user));
            sessionStorage.setItem("googleToken", token);
            sessionStorage.setItem("googleFlow", "true");
          }

          // Check if phone is missing
          if (!user.phone) {
            set({ isLoading: false });
            return {
              success: true,
              redirect: "/add-phone",
            };
          }

          // Phone exists - send OTP
          try {
            const otpResult = await api.auth.registerPhone({
              phone: user.phone,
              password: null,
              password_confirmation: null,
            });

            if (otpResult.success) {
              // Save phone in sessionStorage for OTP verification
              if (typeof window !== "undefined") {
                sessionStorage.setItem("registrationPhone", user.phone);
              }

              set({ isLoading: false });
              return {
                success: true,
                redirect: "/enter-otp",
              };
            } else {
              set({ isLoading: false });
              return {
                success: false,
                error: otpResult.message || "Failed to send OTP",
              };
            }
          } catch (otpError) {
            console.error("Error sending OTP:", otpError);
            set({ isLoading: false });
            return {
              success: false,
              error: otpError.message || "Failed to send OTP",
            };
          }
        } catch (error) {
          set({ isLoading: false });
          return {
            success: false,
            error: error.message || "An error occurred during Google authentication",
          };
        }
      },

      loginWithGoogle: async (idToken) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.googleLogin(idToken);
          set({ isLoading: false });
          
          if (response.success && response.data) {
            const { user, token } = response.data;
            
            // Store user with token
            const userData = {
              ...user,
              token: token,
            };

            set({
              user: userData,
              isAuthenticated: true,
              isLoading: false,
            });

            return { success: true, user: userData };
          } else {
            return { 
              success: false, 
              error: response.message || "Google login failed" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          const errorMessage = error.message || "An error occurred during Google login";
          const apiErrors = error.data?.errors || null;
          
          return { 
            success: false, 
            error: errorMessage,
            errors: apiErrors
          };
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);

export default useAuthStore;

