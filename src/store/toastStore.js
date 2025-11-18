"use client";
import { create } from "zustand";

// Toast notification structure
// { id, message, type: 'success' | 'error' | 'info' | 'warning', duration }

let toastIdCounter = 0;

const useToastStore = create((set) => ({
  toasts: [],

  // Add a new toast
  addToast: (message, type = "info", duration = 5000) => {
    const id = ++toastIdCounter;
    const toast = { id, message, type, duration };

    set((state) => ({
      toasts: [...state.toasts, toast],
    }));

    // Auto remove after duration
    if (duration > 0) {
      setTimeout(() => {
        
        set((state) => ({
          toasts: state.toasts.filter((t) => t.id !== id),
        }));
      }, duration);
    }

    return id;
  },

  // Remove a toast by id
  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((t) => t.id !== id),
    }));
  },

  // Clear all toasts
  clearToasts: () => {
    set({ toasts: [] });
  },

  // Convenience methods
  success: (message, duration) => {
    return useToastStore.getState().addToast(message, "success", duration);
  },

  error: (message, duration) => {
    return useToastStore.getState().addToast(message, "error", duration);
  },

  info: (message, duration) => {
    return useToastStore.getState().addToast(message, "info", duration);
  },

  warning: (message, duration) => {
    return useToastStore.getState().addToast(message, "warning", duration);
  },
}));

export default useToastStore;

