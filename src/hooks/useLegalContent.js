"use client";
import { useState, useEffect, useCallback } from "react";
import api from "../api";
import { useApiCache } from "./useApiCache";
import { useLanguage } from "../context/LanguageContext";

/**
 * Hook to fetch and manage legal content (Terms & Conditions or Privacy Policy)
 * @param {string} type - Content type: 'terms-conditions' or 'privacy-policy'
 * @returns {Object} Content data, loading state, and error
 */
export function useLegalContent(type = 'terms-conditions') {
  const { lang } = useLanguage();
  const { getCachedOrFetch } = useApiCache("LEGAL_CONTENT");
  const [content, setContent] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchContent = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Determine which API function to call based on type
      const fetchFn = type === 'terms-conditions' 
        ? () => api.legal.getTermsConditions(lang)
        : () => api.legal.getPrivacyPolicy(lang);

      // Use cache with long TTL for legal content
      const response = await getCachedOrFetch(
        `/legal/${type}`,
        { locale: lang },
        fetchFn
      );

      if (response?.success && response?.data) {
        setContent(response.data);
      } else {
        const errorMsg = "Failed to load content";
        setError(errorMsg);
        setContent(null);
      }
    } catch (err) {
      const errorMessage = err?.message || err?.data?.message || "Failed to load content. Please try again.";
      setError(errorMessage);
      setContent(null);
    } finally {
      setIsLoading(false);
    }
  }, [type, lang, getCachedOrFetch]);

  useEffect(() => {
    fetchContent();
  }, [fetchContent]);

  return {
    content,
    isLoading,
    error,
    refetch: fetchContent,
  };
}
