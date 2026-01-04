"use client";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import api from "../api";
import { generateCacheKey, getCachedData, setCachedData, getPendingRequest, setPendingRequest, CACHE_DURATION } from "../lib/utils/apiCache";
import { getLanguageFromCookie } from "../lib/utils/language";
import useAuthStore from "./authStore";

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
        const language = getLanguageFromCookie();
        const cacheKey = generateCacheKey("/branches", {}, null, language);
        const ttl = CACHE_DURATION.BRANCHES || 10 * 60 * 1000; // 10 minutes default
        
        const cached = getCachedData(cacheKey);
        if (cached !== null) {
          const branches = Array.isArray(cached.data) 
            ? cached.data 
            : cached.data?.branches || [];
          
          set({ branches, isLoading: false });

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
        const language = getLanguageFromCookie();
        const cacheKey = generateCacheKey(`/branches/${branchId}`, {}, branchId, language);
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

      // Set branch from user profile (called when user logs in or profile is fetched)
      setBranchFromUserProfile: async (branchId) => {
        if (!branchId) return { success: false, error: "Branch ID is required" };

        try {
          // First, try to find branch in existing branches list
          const branches = get().branches;
          const existingBranch = branches.find(
            (b) => b.id === branchId || b.branch_id === branchId
          );

          if (existingBranch) {
            // Branch found in list, use it
            set({ selectedBranch: existingBranch });
            // Fetch details for this branch
            await get().fetchBranchDetails(branchId);
            return { success: true, branch: existingBranch };
          } else {
            // Branch not in list, fetch it directly
            const response = await get().fetchBranchDetails(branchId);
            if (response.success && response.data) {
              const branch = response.data;
              set({ selectedBranch: branch });
              return { success: true, branch };
            } else {
              return { success: false, error: "Failed to fetch branch details" };
            }
          }
        } catch (error) {
          return {
            success: false,
            error: error.message || "An error occurred while setting branch from user profile",
          };
        }
      },

      // Sync branch with user profile (check if user is authenticated and update branch)
      syncWithUserProfile: async () => {
        const authStore = useAuthStore.getState();
        
        if (!authStore.isAuthenticated || !authStore.user) {
          return { success: false, error: "User is not authenticated" };
        }

        const userBranchId = authStore.user.branch_id;
        if (!userBranchId) {
          return { success: false, error: "User does not have a branch_id" };
        }

        // Check if current selected branch matches user's branch
        const currentBranchId = get().getSelectedBranchId();
        if (currentBranchId === userBranchId) {
          return { success: true, message: "Branch already matches user profile" };
        }

        // Update branch to match user profile
        return await get().setBranchFromUserProfile(userBranchId);
      },

      // Initialize: fetch branches if not loaded
      // Optimized to avoid blocking initial render - if branch is already selected from localStorage, return early
      initialize: async () => {
        const { branches, selectedBranch } = get();
        
        // If branch is already selected (from localStorage), fetch details if needed
        if (selectedBranch) {
          const branchId = selectedBranch.id || selectedBranch.branch_id;
          const currentDetails = get().branchDetails;
          const currentBranchId = currentDetails?.id || currentDetails?.branch_id;
          
          if (branchId && currentBranchId !== branchId) {
            get().fetchBranchDetails(branchId);
          }
          return; // Already initialized
        }
        
        // If branches are not loaded, fetch them
        if (branches.length === 0) {
          await get().fetchBranches();
        }
        
        // Check if user is authenticated
        const authStore = useAuthStore.getState();
        
        if (authStore.isAuthenticated && authStore.user?.branch_id) {
          // User is authenticated - use branch_id from user profile
          const userBranchId = authStore.user.branch_id;
          await get().setBranchFromUserProfile(userBranchId);
        } else {
          // User is not authenticated - use default branch
          try {
            const response = await api.branches.getDefaultBranch();
            if (response.success && response.data?.branch) {
              const defaultBranch = response.data.branch;
              set({ selectedBranch: defaultBranch });
              // Fetch full details for default branch
              const branchId = defaultBranch.id || defaultBranch.branch_id;
              if (branchId) {
                await get().fetchBranchDetails(branchId);
              }
            } else {
              // Fallback: use first branch or main branch if default branch API fails
              const branches = get().branches;
              if (branches.length > 0) {
                const mainBranch = branches.find(b => b.is_main === true) || branches[0];
                set({ selectedBranch: mainBranch });
                const branchId = mainBranch.id || mainBranch.branch_id;
                if (branchId) {
                  await get().fetchBranchDetails(branchId);
                }
              }
            }
          } catch (error) {
            console.warn("Failed to fetch default branch, using fallback:", error);
            // Fallback: use first branch or main branch
            const branches = get().branches;
            if (branches.length > 0) {
              const mainBranch = branches.find(b => b.is_main === true) || branches[0];
              set({ selectedBranch: mainBranch });
              const branchId = mainBranch.id || mainBranch.branch_id;
              if (branchId) {
                await get().fetchBranchDetails(branchId);
              }
            }
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

