"use client"; 
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
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
  
  // Use ref to store params and prevent infinite loop
  const paramsRef = useRef(params);
  const paramsString = useMemo(() => JSON.stringify(params), [params]);
  
  // Update ref when params actually change
  useEffect(() => {
    paramsRef.current = params;
  }, [paramsString]);

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
      // Use paramsRef.current to avoid stale closure
      const response = await getCachedOrFetch(
        `/branches/${branchId}/upsell-items`,
        paramsRef.current,
        () => api.branches.getUpsellItems(branchId, paramsRef.current)
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
  }, [selectedBranch?.id, paramsString, getCachedOrFetch]);

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

