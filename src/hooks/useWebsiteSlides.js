"use client"; 
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import api from "../api";
import useBranchStore from "../store/branchStore";
import { useApiCache } from "./useApiCache";

/**
 * Hook to fetch and manage website slides
 * @param {Object} params - Query parameters
 * @returns {Object} Website slides, loading state, and error
 */
export function useWebsiteSlides(params = {}) {
  const { selectedBranch } = useBranchStore();
  const { getCachedOrFetch } = useApiCache("WEBSITE_SLIDES");
  const [slides, setSlides] = useState([]);
  // Don't start with loading=true - wait for branch first
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  
  // Use ref to store params and prevent infinite loop
  const paramsRef = useRef(params);
  const paramsString = useMemo(() => JSON.stringify(params), [params]);
  
  // Update ref when params actually change
  useEffect(() => {
    paramsRef.current = params;
  }, [paramsString]);

  const fetchWebsiteSlides = useCallback(async () => {
    const branchId = selectedBranch?.id || selectedBranch?.branch_id;
    // Don't fetch if no branch - wait for branch to be selected
    if (!branchId) {
      setSlides([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Use paramsRef.current to avoid stale closure
      const response = await getCachedOrFetch(
        '/website-slides',
        paramsRef.current,
        () => api.slides.getWebsiteSlides(paramsRef.current)
      );

      if (response?.success && response?.data?.slides) {
        setSlides(response.data.slides);
      } else {
        setSlides([]);
      }
    } catch (err) {
      const errorMessage = err?.message || err?.data?.message || "Failed to load website slides";
      setError(errorMessage);
      // Don't show toast for slides - it's not critical
      console.error("Website slides error:", errorMessage);
      setSlides([]);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch?.id, selectedBranch?.branch_id, paramsString, getCachedOrFetch]);

  useEffect(() => {
    fetchWebsiteSlides();
  }, [fetchWebsiteSlides]);

  return {
    slides,
    isLoading,
    error,
    refetch: fetchWebsiteSlides,
  };
}
