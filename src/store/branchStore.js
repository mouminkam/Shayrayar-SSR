"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api";
import { generateCacheKey, getCachedData, setCachedData, getPendingRequest, setPendingRequest, CACHE_DURATION } from "../lib/utils/apiCache";

const useBranchStore = create(
  persist(
    (set, get) => ({
      // State
      selectedBranch: null,
      branches: [],
      branchDetails: null, // Full branch details (address, email, phone, working_hours, etc.)
      isLoading: false,
      isLoadingDetails: false,

      // Actions
      fetchBranches: async () => {
        // Check cache first
        const cacheKey = generateCacheKey("/branches", {}, null);
        const ttl = CACHE_DURATION.BRANCHES || 10 * 60 * 1000; // 10 minutes default
        
        const cached = getCachedData(cacheKey);
        if (cached !== null) {
          const branches = Array.isArray(cached.data) 
            ? cached.data 
            : cached.data?.branches || [];
          
          set({ branches, isLoading: false });

          // If no branch is selected, set the first one as default
          if (!get().selectedBranch && branches.length > 0) {
            const testBranch = branches.find(b => b.id === 1 || b.branch_id === 1);
            const mainBranch = branches.find(b => b.is_main === true) || branches[0];
            set({ selectedBranch: testBranch || mainBranch });
          }

          return { success: true, branches };
        }

        // Check for pending request (deduplication)
        const pending = getPendingRequest(cacheKey);
        if (pending) {
          try {
            const response = await pending;
            if (response.success && response.data) {
              const branches = Array.isArray(response.data) 
                ? response.data 
                : response.data.branches || [];
              set({ branches, isLoading: false });
              return { success: true, branches };
            }
          } catch (error) {
            // If pending request fails, continue to fetch new
          }
        }

        set({ isLoading: true });
        try {
          // Create fetch promise
          const fetchPromise = api.branches.getAllBranches()
            .then((response) => {
              // Cache the response
              setCachedData(cacheKey, response, ttl);
              return response;
            });

          // Track pending request
          setPendingRequest(cacheKey, fetchPromise);

          const response = await fetchPromise;
          
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
        // Auto-fetch details for new branch
        const branchId = branch.id || branch.branch_id;
        if (branchId) {
          get().fetchBranchDetails(branchId);
        }
      },

      getSelectedBranchId: () => {
        const selectedBranch = get().selectedBranch;
        return selectedBranch?.id || selectedBranch?.branch_id || null;
      },

      // Fetch branch details - called once per branch
      fetchBranchDetails: async (branchId) => {
        // Check if already cached for this branch in state
        const currentDetails = get().branchDetails;
        const currentBranchId = currentDetails?.id || currentDetails?.branch_id;
        
        if (currentBranchId === branchId && currentDetails) {
          // Already have details for this branch
          return { success: true, data: currentDetails };
        }

        // Check cache first
        const cacheKey = generateCacheKey(`/branches/${branchId}`, {}, branchId);
        const ttl = CACHE_DURATION.BRANCHES || 10 * 60 * 1000; // 10 minutes default
        
        const cached = getCachedData(cacheKey);
        if (cached !== null) {
          const details = cached.data?.branch || cached.data;
          set({ branchDetails: details, isLoadingDetails: false });
          return { success: true, data: details };
        }

        // Check for pending request (deduplication)
        const pending = getPendingRequest(cacheKey);
        if (pending) {
          try {
            const response = await pending;
            if (response?.success && response.data) {
              const details = response.data.branch || response.data;
              set({ branchDetails: details, isLoadingDetails: false });
              return { success: true, data: details };
            }
          } catch (error) {
            // If pending request fails, continue to fetch new
          }
        }

        set({ isLoadingDetails: true });
        try {
          // Create fetch promise
          const fetchPromise = api.branches.getBranchById(branchId)
            .then((response) => {
              // Cache the response
              setCachedData(cacheKey, response, ttl);
              return response;
            });

          // Track pending request
          setPendingRequest(cacheKey, fetchPromise);

          const response = await fetchPromise;
          
          if (response?.success && response.data) {
            const details = response.data.branch || response.data;
            set({ branchDetails: details, isLoadingDetails: false });
            return { success: true, data: details };
          } else {
            set({ isLoadingDetails: false });
            return { success: false, error: "Failed to fetch branch details" };
          }
        } catch (error) {
          set({ isLoadingDetails: false });
          return { 
            success: false, 
            error: error.message || "An error occurred while fetching branch details" 
          };
        }
      },

      // Helper function to get formatted contact info
      getBranchContactInfo: () => {
        const details = get().branchDetails;
        if (!details) return null;
        
        return {
          address: details.address || details.location || null,
          email: details.email || details.contact_email || null,
          phone: details.phone || details.contact_phone || details.telephone || null,
        };
      },

      // Helper function to get working hours
      getBranchWorkingHours: () => {
        const details = get().branchDetails;
        if (!details) return null;
        
        return details.working_hours || details.opening_hours || details.hours || null;
      },

      // Helper function to get branch location (for maps)
      getBranchLocation: () => {
        const details = get().branchDetails;
        if (!details) return null;
        
        return {
          latitude: details.latitude || details.lat || null,
          longitude: details.longitude || details.lng || details.lon || null,
        };
      },

      // Initialize: fetch branches if not loaded
      // Optimized to avoid blocking initial render - if branch is already selected from localStorage, return early
      initialize: async () => {
        const { branches, selectedBranch } = get();
        
        // If branch is already selected (from localStorage), no need to wait
        if (selectedBranch) {
          return; // Already initialized
        }
        
        // If branches are not loaded, fetch them
        if (branches.length === 0) {
          await get().fetchBranches();
        }
        
        // Ensure a branch is selected
        if (!get().selectedBranch && get().branches.length > 0) {
          // TEMPORARY: For testing, prefer branch ID = 1 (Shahrayar Premium)
          // Try to find branch with ID = 1, then main branch (is_main: true), or use first branch
          const testBranch = get().branches.find(b => b.id === 1 || b.branch_id === 1);
          const mainBranch = get().branches.find(b => b.is_main === true) || get().branches[0];
          const selected = testBranch || mainBranch;
          set({ selectedBranch: selected });
          
          // Auto-fetch details for selected branch
          const branchId = selected?.id || selected?.branch_id;
          if (branchId) {
            get().fetchBranchDetails(branchId);
          }
        } else if (get().selectedBranch) {
          // If branch is already selected, fetch details if not already loaded
          const branchId = get().selectedBranch.id || get().selectedBranch.branch_id;
          const currentDetails = get().branchDetails;
          const currentBranchId = currentDetails?.id || currentDetails?.branch_id;
          
          if (branchId && currentBranchId !== branchId) {
            get().fetchBranchDetails(branchId);
          }
        }
      },
    }),
    {
      name: "branch-storage", // localStorage key
      storage: createJSONStorage(() => localStorage),
      // Only persist selectedBranch and branches, not isLoading or branchDetails
      // branchDetails will be fetched fresh on each session to ensure data is up-to-date
      partialize: (state) => ({
        selectedBranch: state.selectedBranch,
        branches: state.branches,
        // Don't persist branchDetails - fetch fresh on load
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

