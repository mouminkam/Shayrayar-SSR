"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

// User structure
// { id, name, email, phone, address, orders: [] }

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
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Mock user data - in real app, this would come from API
          const mockUser = {
            id: Date.now().toString(),
            name: "John Doe",
            email: email,
            phone: "+1234567890",
            address: {
              street: "123 Main St",
              city: "New York",
              state: "NY",
              zipCode: "10001",
              country: "USA",
            },
            orders: [],
          };

          set({
            user: mockUser,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user: mockUser };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      register: async (userData) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          const newUser = {
            id: Date.now().toString(),
            name: userData.name,
            email: userData.email,
            phone: userData.phone || "",
            address: userData.address || {
              street: "",
              city: "",
              state: "",
              zipCode: "",
              country: "",
            },
            orders: [],
          };

          set({
            user: newUser,
            isAuthenticated: true,
            isLoading: false,
          });

          return { success: true, user: newUser };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      logout: () => {
        set({
          user: null,
          isAuthenticated: false,
        });
      },

      updateProfile: (updates) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              ...updates,
            },
          });
        }
      },

      addOrder: (order) => {
        const user = get().user;
        if (user) {
          set({
            user: {
              ...user,
              orders: [
                {
                  id: Date.now().toString(),
                  ...order,
                  date: new Date().toISOString(),
                },
                ...user.orders,
              ],
            },
          });
        }
      },

      // Reset password flow helpers
      resetPasswordRequest: async (email) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
          return { success: true, message: "OTP sent to your email" };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      verifyOTP: async (email, otp) => {
        set({ isLoading: true });
        try {
          // Simulate API call - in real app, verify OTP with backend
          await new Promise((resolve) => setTimeout(resolve, 1000));
          
          // Mock verification - accept any 6-digit OTP for demo
          if (otp.length === 6) {
            set({ isLoading: false });
            return { success: true };
          } else {
            set({ isLoading: false });
            return { success: false, error: "Invalid OTP" };
          }
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
        }
      },

      resetPassword: async (email, newPassword) => {
        set({ isLoading: true });
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));
          set({ isLoading: false });
          return { success: true, message: "Password reset successfully" };
        } catch (error) {
          set({ isLoading: false });
          return { success: false, error: error.message };
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

