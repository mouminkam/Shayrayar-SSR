"use client"; 
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import api from "../api";
import useBranchStore from "../store/branchStore";
import { useApiCache } from "./useApiCache";
import { generateCacheKey, getCachedData, setCachedData, getPendingRequest, setPendingRequest, CACHE_DURATION } from "../lib/utils/apiCache";
import { proxyObjectImages } from "../lib/utils/imageProxy";
import { useLanguage } from "../context/LanguageContext";

/**
 * Prefetch website slides using Fetch API with high priority
 * This function can be called early (e.g., in layout/page) to start fetching before component renders
 * @param {string|number} branchId - Branch ID
 * @param {Object} params - Query parameters
 * @returns {Promise<Object|null>} Promise that resolves with slides data or null
 */
export async function prefetchWebsiteSlides(branchId, params = {}) {
  if (!branchId || typeof window === 'undefined') {
    return null;
  }

  try {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shahrayar.peaklink.pro/api/v1';
    const url = `${API_BASE_URL}/website-slides`;
    
    // Build query params
    const queryParams = new URLSearchParams({
      branch_id: branchId,
      ...params,
    });
    
    const fullUrl = `${url}?${queryParams.toString()}`;
    
    // Get token and language for headers
    const getToken = () => {
      try {
        const authStorage = localStorage.getItem('auth-storage');
        if (authStorage) {
          const parsed = JSON.parse(authStorage);
          return parsed.state?.user?.token || parsed.state?.token || null;
        }
        return sessionStorage.getItem('registrationToken');
      } catch {
        return null;
      }
    };

    const token = getToken();
    
    // Get language from cookie
    const getLanguage = () => {
      if (typeof document === 'undefined') return 'bg';
      try {
        const value = `; ${document.cookie}`;
        const parts = value.split(`; language=`);
        
        if (parts.length === 2) {
          const lang = parts.pop().split(';').shift();
          return lang === 'en' ? 'en' : 'bg';
        }
        
        return 'bg';
      } catch {
        return 'bg';
      }
    };
    
    const language = getLanguage();
    const cacheKey = generateCacheKey('/website-slides', params, branchId, language);
    const ttl = CACHE_DURATION.WEBSITE_SLIDES || CACHE_DURATION.PRODUCTS;

    // Check cache first
    const cached = getCachedData(cacheKey);
    if (cached !== null) {
      return cached;
    }

    // Check for pending request
    const pending = getPendingRequest(cacheKey);
    if (pending) {
      return pending;
    }

    // Use Fetch API with high priority
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 seconds timeout
    
    const fetchPromise = fetch(fullUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Accept-Language': language,
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      priority: 'high', // High priority for banner slides
      signal: abortController.signal,
    })
      .finally(() => {
        clearTimeout(timeoutId);
      })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        // Transform to match axios response format
        const transformedData = data && typeof data === 'object' && 'success' in data 
          ? data 
          : { success: true, data: data };
        
        // Cache the response
        setCachedData(cacheKey, transformedData, ttl);
        return transformedData;
      })
      .catch((error) => {
        // Don't cache errors, but don't throw - return null for graceful degradation
        console.warn('Prefetch website slides failed:', error);
        return null;
      });

    setPendingRequest(cacheKey, fetchPromise);
    return fetchPromise;
  } catch (error) {
    console.warn('Prefetch website slides error:', error);
    return null;
  }
}

/**
 * Hook to fetch and manage website slides
 * @param {Object} params - Query parameters
 * @returns {Object} Website slides, loading state, and error
 */
export function useWebsiteSlides(params = {}) {
  const { selectedBranch } = useBranchStore();
  const { getCachedOrFetch } = useApiCache("WEBSITE_SLIDES");
  const { lang } = useLanguage();
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
      // Try to use fetch API with priority for better performance
      const cacheKey = generateCacheKey('/website-slides', paramsRef.current, branchId, lang);
      const cached = getCachedData(cacheKey);
      
      if (cached !== null) {
        // Use cached data immediately
        if (cached?.success && cached?.data?.slides) {
          // Convert image URLs to proxy URLs
          const proxiedSlides = cached.data.slides.map(slide => 
            proxyObjectImages(slide, ['desktop_image', 'mobile_image', 'image'])
          );
          setSlides(proxiedSlides);
        } else {
          setSlides([]);
        }
        setIsLoading(false);
        return;
      }

      // Check for pending request
      const pending = getPendingRequest(cacheKey);
      if (pending) {
        const response = await pending;
        if (response?.success && response?.data?.slides) {
          // Convert image URLs to proxy URLs
          const proxiedSlides = response.data.slides.map(slide => 
            proxyObjectImages(slide, ['desktop_image', 'mobile_image', 'image'])
          );
          setSlides(proxiedSlides);
        } else {
          setSlides([]);
        }
        setIsLoading(false);
        return;
      }

      // Use Fetch API with high priority for banner slides
      const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://shahrayar.peaklink.pro/api/v1';
      const url = `${API_BASE_URL}/website-slides`;
      
      // Build query params
      const queryParams = new URLSearchParams({
        branch_id: branchId,
        ...paramsRef.current,
      });
      
      const fullUrl = `${url}?${queryParams.toString()}`;
      const ttl = CACHE_DURATION.WEBSITE_SLIDES || CACHE_DURATION.PRODUCTS;

      // Get token and language for headers
      const getToken = () => {
        if (typeof window === 'undefined') return null;
        try {
          const authStorage = localStorage.getItem('auth-storage');
          if (authStorage) {
            const parsed = JSON.parse(authStorage);
            return parsed.state?.user?.token || parsed.state?.token || null;
          }
          return sessionStorage.getItem('registrationToken');
        } catch {
          return null;
        }
      };


      const token = getToken();
      
      // Get language from cookie
      const getLanguage = () => {
        if (typeof document === 'undefined') return 'bg';
        try {
          const value = `; ${document.cookie}`;
          const parts = value.split(`; language=`);
          
          if (parts.length === 2) {
            const lang = parts.pop().split(';').shift();
            return lang === 'en' ? 'en' : 'bg';
          }
          
          return 'bg';
        } catch {
          return 'bg';
        }
      };
      
      const language = getLanguage();

      // Use Fetch API with high priority
      const abortController = new AbortController();
      const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 seconds timeout
      
      const fetchPromise = fetch(fullUrl, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Accept-Language': language,
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        priority: 'high', // High priority for banner slides
        signal: abortController.signal,
      })
        .then(async (response) => {
          clearTimeout(timeoutId);
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          const data = await response.json();
          
          // Transform to match axios response format
          const transformedData = data && typeof data === 'object' && 'success' in data 
            ? data 
            : { success: true, data: data };
          
          // Cache the response
          setCachedData(cacheKey, transformedData, ttl);
          return transformedData;
        })
        .catch((error) => {
          clearTimeout(timeoutId);
          // Fallback to axios if fetch fails
          console.warn('Fetch API failed, falling back to axios:', error);
          return api.slides.getWebsiteSlides(paramsRef.current);
        });

      setPendingRequest(cacheKey, fetchPromise);
      const response = await fetchPromise;

      if (response?.success && response?.data?.slides) {
        // Convert image URLs to proxy URLs
        const proxiedSlides = response.data.slides.map(slide => 
          proxyObjectImages(slide, ['desktop_image', 'mobile_image', 'image'])
        );
        setSlides(proxiedSlides);
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
  }, [selectedBranch?.id, selectedBranch?.branch_id, paramsString, lang]);

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
