"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api";
import useCartStore from "./cartStore";


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
          // Clear all state
          set({
            user: null,
            isAuthenticated: false,
          });

          // Clear cart store
          try {
            useCartStore.getState().clearCart();
          } catch (error) {
            console.warn("Failed to clear cart:", error);
          }

          // Clear all localStorage items except rememberedEmail
          if (typeof window !== "undefined") {
            // Save rememberedEmail before clearing
            const rememberedEmail = localStorage.getItem("rememberedEmail");
            
            // Clear Zustand stores
            localStorage.removeItem("auth-storage");
            localStorage.removeItem("cart-storage");
            localStorage.removeItem("branch-storage");
            
            // Clear all other localStorage items (loop through all keys)
            const keysToKeep = ["rememberedEmail"];
            const allKeys = Object.keys(localStorage);
            allKeys.forEach((key) => {
              if (!keysToKeep.includes(key)) {
                localStorage.removeItem(key);
              }
            });
            
            // Restore rememberedEmail if it existed
            if (rememberedEmail) {
              localStorage.setItem("rememberedEmail", rememberedEmail);
            }
            
            // Clear all sessionStorage items
            sessionStorage.clear();

            // Clear browser cache (caches API)
            if ("caches" in window) {
              try {
                const cacheNames = await caches.keys();
                await Promise.all(
                  cacheNames.map((cacheName) => caches.delete(cacheName))
                );
              } catch (cacheError) {
                console.warn("Failed to clear cache:", cacheError);
              }
            }

            // Clear service worker cache if available
            if ("serviceWorker" in navigator && navigator.serviceWorker.controller) {
              try {
                navigator.serviceWorker.controller.postMessage({ type: "CLEAR_CACHE" });
              } catch (swError) {
                console.warn("Failed to clear service worker cache:", swError);
              }
            }

            // Force clear all cookies
            // This will clear all cookies for the current domain
            try {
              document.cookie.split(";").forEach((cookie) => {
                const eqPos = cookie.indexOf("=");
                const name = eqPos > -1 ? cookie.substr(0, eqPos).trim() : cookie.trim();
                if (name) {
                  // Clear cookie by setting it to expire in the past
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/`;
                  document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${window.location.hostname}`;
                  // Also try with www subdomain
                  if (window.location.hostname.startsWith("www.")) {
                    const domainWithoutWww = window.location.hostname.replace(/^www\./, "");
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=${domainWithoutWww}`;
                  } else {
                    document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/;domain=.${window.location.hostname}`;
                  }
                }
              });
            } catch (cookieError) {
              console.warn("Failed to clear cookies:", cookieError);
            }
          }
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

      uploadProfileImage: async (imageFile) => {
        set({ isLoading: true });
        try {
          const response = await api.auth.uploadProfileImage(imageFile);
          
          if (response.success && response.data) {
            const currentUser = get().user;
            const responseUser = response.data.user || response.data;
            
            // Check if image is in response (check all possible field names)
            const hasImage = responseUser?.image || responseUser?.image_url || responseUser?.avatar || responseUser?.photo;
            
            const updatedUser = {
              ...currentUser,
              ...responseUser,
            };

            set({
              user: updatedUser,
              isLoading: false,
            });

            // If image is not in response, fetch fresh profile to get updated image
            // This ensures the image URL is correct and up-to-date
            if (!hasImage) {
              try {
                const freshProfile = await get().fetchProfile();
                if (freshProfile?.user) {
                  set({ user: freshProfile.user });
                  return { success: true, user: freshProfile.user };
                }
              } catch (fetchError) {
                // If fetch fails, continue with the updated user from response
                console.warn('Failed to fetch fresh profile after image upload:', fetchError);
              }
            }

            return { success: true, user: updatedUser };
          } else {
            set({ isLoading: false });
            return { 
              success: false, 
              error: response.message || "Failed to upload image" 
            };
          }
        } catch (error) {
          set({ isLoading: false });
          return { 
            success: false, 
            error: error.message || "An error occurred while uploading image" 
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
              console.log("Token saved to sessionStorage:", token ? "Token exists" : "Token is null/undefined");
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
              sessionStorage.removeItem("registrationPassword");
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
        // Don't update global isLoading to avoid re-renders
        // This is a lightweight call that shouldn't affect the global loading state
        try {
          const response = await api.auth.getRegistrationBranches(lang);
          
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
          return { 
            success: false, 
            error: error.message || "An error occurred while fetching branches" 
          };
        }
      },

      // Build Google OAuth URL directly
      buildGoogleOAuthUrl: () => {
        if (typeof window === "undefined") {
          return { success: false, error: "Window is not available" };
        }

        const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
        const redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;

        if (!clientId || !redirectUri) {
          return {
            success: false,
            error: "Google OAuth configuration is missing. Please check environment variables.",
          };
        }

        // Generate state for CSRF protection
        const state = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
        
        // Store state and redirect_uri in sessionStorage for verification
        if (typeof window !== "undefined") {
          sessionStorage.setItem("googleOAuthState", state);
          sessionStorage.setItem("googleOAuthRedirectUri", redirectUri);
        }

        // Build Google OAuth URL
        const params = new URLSearchParams({
          client_id: clientId,
          redirect_uri: redirectUri,
          response_type: "code",
          scope: "openid email profile",
          access_type: "offline",
          prompt: "consent",
          state: state,
        });

        const googleAuthUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;

        return {
          success: true,
          url: googleAuthUrl,
          state: state,
        };
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
      version: 1,
      migrate: (persistedState, version) => {
        // Handle migration if needed in the future
        return persistedState || { user: null, isAuthenticated: false, isLoading: false };
      },
    }
  )
);

export default useAuthStore;

