"uipse client";
import { useState, useEffect, useCallback } from "react";
import api from "../api";
import useBranchStore from "../store/branchStore";
import { useApiCache } from "./useApiCache";

/**
 * Hook to fetch and manage upsell items
 * @param {Object} params - Query parameters
 * @param {string} params.type - Filter by item type (optional)
 * @returns {Object} Upsell items, loading state, and error
 */
export function useUpsellItems(params = {}) {
  const { selectedBranch } = useBranchStore();
  const { getCachedOrFetch } = useApiCache("UPSELL_ITEMS");
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true); // Start with true to show loading state
  const [error, setError] = useState(null);

  const fetchUpsellItems = useCallback(async () => {
    const branchId = selectedBranch?.id;
    if (!branchId) {
      setItems([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await getCachedOrFetch(
        `/branches/${branchId}/upsell-items`,
        params,
        () => api.branches.getUpsellItems(branchId, params)
      );

      if (response?.success && response?.data?.items) {
        setItems(response.data.items);
      } else {
        setItems([]);
      }
    } catch (err) {
      const errorMessage = err?.message || err?.data?.message || "Failed to load upsell items";
      setError(errorMessage);
      // Don't show toast for upsell items - it's not critical
      console.error("Upsell items error:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch?.id, params, getCachedOrFetch]);

  useEffect(() => {
    fetchUpsellItems();
  }, [fetchUpsellItems]);

  return {
    items,
    isLoading,
    error,
    refetch: fetchUpsellItems,
  };
}

