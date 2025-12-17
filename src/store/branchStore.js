"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api";

const useBranchStore = create(
  persist(
    (set, get) => ({
      // State
      selectedBranch: null,
      branches: [],
      isLoading: false,

      // Actions
      fetchBranches: async () => {
        set({ isLoading: true });
        try {
          const response = await api.branches.getAllBranches();
          
          if (response.success && response.data) {
            const branches = Array.isArray(response.data) 
              ? response.data 
              : response.data.branches || [];
            
            set({ branches, isLoading: false });

            // If no branch is selected, set the first one as default
            if (!get().selectedBranch && branches.length > 0) {
              // TEMPORARY: For testing, prefer branch ID = 1 (Shahrayar Premium)
              // Try to find branch with ID = 1, then main branch (is_main: true), or use first branch
              const testBranch = branches.find(b => b.id === 1 || b.branch_id === 1);
              const mainBranch = branches.find(b => b.is_main === true) || branches[0];
              set({ selectedBranch: testBranch || mainBranch });
            }

            return { success: true, branches };
          } else {
            set({ isLoading: false });
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

      setSelectedBranch: (branch) => {
        if (!branch) return;
        set({ selectedBranch: branch });
      },

      getSelectedBranchId: () => {
        const selectedBranch = get().selectedBranch;
        return selectedBranch?.id || selectedBranch?.branch_id || null;
      },

      // Initialize: fetch branches if not loaded
      initialize: async () => {
        const { branches } = get();
        if (branches.length === 0) {
          await get().fetchBranches();
        }
        // Ensure a branch is selected
        if (!get().selectedBranch && get().branches.length > 0) {
          // TEMPORARY: For testing, prefer branch ID = 1 (Shahrayar Premium)
          // Try to find branch with ID = 1, then main branch (is_main: true), or use first branch
          const testBranch = get().branches.find(b => b.id === 1 || b.branch_id === 1);
          const mainBranch = get().branches.find(b => b.is_main === true) || get().branches[0];
          set({ selectedBranch: testBranch || mainBranch });
        }
      },
    }),
    {
      name: "branch-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist selectedBranch and branches, not isLoading
      partialize: (state) => ({
        selectedBranch: state.selectedBranch,
        branches: state.branches,
      }),
      version: 1,
      migrate: (persistedState, version) => {
        // Handle migration if needed in the future
        return persistedState || { selectedBranch: null, branches: [] };
      },
    }
  )
);

export default useBranchStore;

