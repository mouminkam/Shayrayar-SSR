/**
 * API Cache Manager
 * Simple in-memory cache with TTL (Time To Live) support
 * Handles cache invalidation and request deduplication
 */

// Cache entry structure: { data, timestamp, ttl }
const cache = new Map();
const pendingRequests = new Map(); // For request deduplication

/**
 * Generate cache key from URL and params
 * @param {string} url - API endpoint URL
 * @param {Object} params - Request parameters
 * @param {string|number} branchId - Branch ID (optional)
 * @returns {string} Cache key
 */
export function generateCacheKey(url, params = {}, branchId = null) {
  const sortedParams = Object.keys(params)
    .sort()
    .map((key) => `${key}=${JSON.stringify(params[key])}`)
    .join("&");
  
  const branchPart = branchId ? `branch=${branchId}` : "";
  const paramsPart = sortedParams ? `&${sortedParams}` : "";
  
  return `${url}?${branchPart}${paramsPart}`;
}

/**
 * Get cached data if available and not expired
 * @param {string} key - Cache key
 * @returns {any|null} Cached data or null if expired/not found
 */
export function getCachedData(key) {
  const entry = cache.get(key);
  
  if (!entry) {
    return null;
  }
  
  const now = Date.now();
  const age = now - entry.timestamp;
  
  // Check if expired
  if (age > entry.ttl) {
    cache.delete(key);
    return null;
  }
  
  return entry.data;
}

/**
 * Set data in cache
 * @param {string} key - Cache key
 * @param {any} data - Data to cache
 * @param {number} ttl - Time to live in milliseconds (default: 5 minutes)
 */
export function setCachedData(key, data, ttl = 5 * 60 * 1000) {
  cache.set(key, {
    data,
    timestamp: Date.now(),
    ttl,
  });
}

/**
 * Clear cache entry or all cache
 * @param {string|null} key - Cache key to clear, or null to clear all
 */
export function clearCache(key = null) {
  if (key) {
    cache.delete(key);
  } else {
    cache.clear();
  }
}

/**
 * Clear cache for a specific branch
 * @param {string|number} branchId - Branch ID
 */
export function clearBranchCache(branchId) {
  const keysToDelete = [];
  
  for (const key of cache.keys()) {
    if (key.includes(`branch=${branchId}`)) {
      keysToDelete.push(key);
    }
  }
  
  keysToDelete.forEach((key) => cache.delete(key));
}

/**
 * Get pending request promise for deduplication
 * @param {string} key - Request key
 * @returns {Promise|null} Pending promise or null
 */
export function getPendingRequest(key) {
  return pendingRequests.get(key) || null;
}

/**
 * Set pending request promise
 * @param {string} key - Request key
 * @param {Promise} promise - Promise to track
 */
export function setPendingRequest(key, promise) {
  pendingRequests.set(key, promise);
  
  // Clean up after promise resolves/rejects
  promise
    .finally(() => {
      pendingRequests.delete(key);
    });
}

/**
 * Clear all pending requests
 */
export function clearPendingRequests() {
  pendingRequests.clear();
}

/**
 * Clear all cache entries and pending requests
 * Useful when language changes to ensure fresh data with new Accept-Language header
 */
export function clearAllCache() {
  cache.clear();
  pendingRequests.clear();
}

/**
 * Get cache statistics (for debugging)
 * @returns {Object} Cache stats
 */
export function getCacheStats() {
  return {
    size: cache.size,
    pendingRequests: pendingRequests.size,
    keys: Array.from(cache.keys()),
  };
}

/**
 * Cache duration constants (in milliseconds)
 * Optimized for better performance - longer cache for static/semi-static data
 */
export const CACHE_DURATION = {
  PRODUCTS: 5 * 60 * 1000, // 5 minutes
  CATEGORIES: 15 * 60 * 1000, // 15 minutes (categories don't change often)
  PRODUCT_DETAIL: 10 * 60 * 1000, // 10 minutes
  HIGHLIGHTS: 10 * 60 * 1000, // 10 minutes (highlights don't change often)
  WEBSITE_SLIDES: 15 * 60 * 1000, // 15 minutes (slides don't change often)
  BRANCHES: 10 * 60 * 1000, // 10 minutes (branches don't change often)
};

