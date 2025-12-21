"use client";
import { createContext, useContext, useState, useEffect, useCallback, useRef } from "react";
import { i18n } from "../locales/i18n/config";
import { clearAllCache } from "../lib/utils/apiCache";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Always start with default locale to avoid hydration mismatch
  // We'll read from localStorage in useEffect after mount
  const [lang, setLangState] = useState(i18n.defaultLocale);
  const [isMounted, setIsMounted] = useState(false);
  const previousLangRef = useRef(i18n.defaultLocale);

  // Read from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      // Validate that saved language is one of the supported locales
      if (savedLang && i18n.locales.includes(savedLang)) {
        setLangState(savedLang);
        // Update previousLangRef to match saved language to prevent infinite loop
        previousLangRef.current = savedLang;
      } else {
        // If no valid language in localStorage, save default
        localStorage.setItem('language', i18n.defaultLocale);
        previousLangRef.current = i18n.defaultLocale;
      }
    }
  }, []); // Only run on mount

  // Wrapper function that saves to localStorage immediately when language changes
  const setLang = useCallback((newLang) => {
    if (typeof window !== 'undefined' && i18n.locales.includes(newLang)) {
      // Save to localStorage immediately
      localStorage.setItem('language', newLang);
      // Update state
      setLangState(newLang);
    }
  }, []);

  // Also save to localStorage whenever lang changes (backup)
  useEffect(() => {
    if (isMounted && typeof window !== 'undefined') {
      localStorage.setItem('language', lang);
    }
  }, [lang, isMounted]);

  // Clear cache and refresh when language changes
  useEffect(() => {
    // Skip on initial mount
    if (!isMounted) {
      return;
    }

    // Read current language from localStorage to avoid race conditions
    if (typeof window === 'undefined') {
      return;
    }

    const currentLang = localStorage.getItem('language') || i18n.defaultLocale;
    
    // Only trigger if language actually changed (compare with previous value)
    if (previousLangRef.current !== currentLang) {
      // Update previous language reference first to prevent infinite loop
      previousLangRef.current = currentLang;
      
      // Clear all cache to ensure fresh data with new Accept-Language header
      clearAllCache();
      
      // Reload the page completely to re-fetch all data with new language
      window.location.reload();
    }
  }, [lang, isMounted]);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
