"use client";
import { useCallback, useEffect, useRef } from "react";
import {
  generateCacheKey,
  getCachedData,
  setCachedData,
  clearBranchCache,
  getPendingRequest,
  setPendingRequest,
  CACHE_DURATION,
} from "../lib/utils/apiCache";
import useBranchStore from "../store/branchStore";

/**
 * Hook to use API caching with automatic branch invalidation
 * @param {string} cacheType - Type of cache (for TTL selection)
 * @returns {Object} Cache utilities
 */
export function useApiCache(cacheType = "PRODUCTS") {
  const { selectedBranch } = useBranchStore();
  const branchId = selectedBranch?.id || selectedBranch?.branch_id || null;
  const previousBranchIdRef = useRef(branchId);

  // Get TTL based on cache type
  const getTTL = useCallback(() => {
    return CACHE_DURATION[cacheType] || CACHE_DURATION.PRODUCTS;
  }, [cacheType]);

  // Clear cache when branch changes
  useEffect(() => {
    if (branchId && previousBranchIdRef.current && previousBranchIdRef.current !== branchId) {
      // Clear cache for previous branch when branch changes
      clearBranchCache(previousBranchIdRef.current);
    }
    previousBranchIdRef.current = branchId;
  }, [branchId]);

  /**
   * Get cached data or fetch new data
   * @param {string} url - API endpoint URL
   * @param {Object} params - Request parameters
   * @param {Function} fetchFn - Function to fetch data if not cached
   * @param {number} customTTL - Custom TTL (optional)
   * @returns {Promise<any>} Cached or fresh data
   */
  const getCachedOrFetch = useCallback(
    async (url, params = {}, fetchFn, customTTL = null) => {
      const cacheKey = generateCacheKey(url, params, branchId);
      const ttl = customTTL || getTTL();

      // Check cache first
      const cached = getCachedData(cacheKey);
      if (cached !== null) {
        return cached;
      }

      // Check for pending request (deduplication)
      const pending = getPendingRequest(cacheKey);
      if (pending) {
        return pending;
      }

      // Fetch new data
      const fetchPromise = fetchFn()
        .then((data) => {
          setCachedData(cacheKey, data, ttl);
          return data;
        })
        .catch((error) => {
          // Don't cache errors
          throw error;
        });

      setPendingRequest(cacheKey, fetchPromise);
      return fetchPromise;
    },
    [branchId, getTTL]
  );

  /**
   * Invalidate cache for specific URL and params
   * @param {string} url - API endpoint URL
   * @param {Object} params - Request parameters
   */
  const invalidateCache = useCallback(
    (url, params = {}) => {
      const cacheKey = generateCacheKey(url, params, branchId);
      const cached = getCachedData(cacheKey);
      if (cached !== null) {
        setCachedData(cacheKey, null, 0); // Expire immediately
      }
    },
    [branchId]
  );

  /**
   * Clear all cache for current branch
   */
  const clearCurrentBranchCache = useCallback(() => {
    if (branchId) {
      clearBranchCache(branchId);
    }
  }, [branchId]);

  return {
    getCachedOrFetch,
    invalidateCache,
    clearCurrentBranchCache,
    branchId,
  };
}

