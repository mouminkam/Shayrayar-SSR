"use client";
import { useRouter } from "next/navigation";

/**
 * Build query string from params object
 * @param {Object} params - Query parameters object
 * @returns {string} - Query string (e.g., "?key=value&key2=value2")
 */
export const buildQuery = (params) => {
  if (!params || Object.keys(params).length === 0) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

/**
 * Set query parameters and navigate without scrolling
 * @param {Object} router - Next.js router instance
 * @param {string} pathname - Base path (e.g., "/shop")
 * @param {Object} params - Query parameters object
 * @param {Object} options - Navigation options
 * @param {boolean} options.replace - Use replace instead of push (default: false)
 */
export const setQueryParams = (router, pathname, params = {}, options = {}) => {
  const { replace = false } = options;
  const query = buildQuery(params);
  const url = `${pathname}${query}`;
  
  if (replace) {
    router.replace(url, { scroll: false });
  } else {
    router.push(url, { scroll: false });
  }
};

/**
 * Unified router hook that provides router and pushNoScroll helper
 * @returns {Object} - { router, pushNoScroll, replaceNoScroll }
 */
export const useUnifiedRouter = () => {
  const router = useRouter();
  
  const pushNoScroll = (url) => {
    router.push(url, { scroll: false });
  };
  
  const replaceNoScroll = (url) => {
    router.replace(url, { scroll: false });
  };
  
  return { router, pushNoScroll, replaceNoScroll };
};

