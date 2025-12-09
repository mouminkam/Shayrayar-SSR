"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { i18n } from "../locales/i18n/config";

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  // Always start with default locale to avoid hydration mismatch
  // We'll read from localStorage in useEffect after mount
  const [lang, setLangState] = useState(i18n.defaultLocale);
  const [isMounted, setIsMounted] = useState(false);

  // Read from localStorage after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('language');
      // Validate that saved language is one of the supported locales
      if (savedLang && i18n.locales.includes(savedLang)) {
        setLangState(savedLang);
      } else {
        // If no valid language in localStorage, save default
        localStorage.setItem('language', i18n.defaultLocale);
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

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => useContext(LanguageContext);
