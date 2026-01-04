"use client";
import { createContext, useContext, useState, useEffect, useCallback } from "react";
import { i18n } from "../locales/i18n/config";
import { getCookie, setCookie } from "../lib/utils/cookies";

const LanguageContext = createContext();

const LANGUAGE_COOKIE_NAME = 'language';

export function LanguageProvider({ children }) {
  // Always start with default locale to avoid hydration mismatch
  // We'll read from cookie in useEffect after mount
  const [lang, setLangState] = useState(i18n.defaultLocale);
  const [isMounted, setIsMounted] = useState(false);

  // Read from cookie after mount to avoid hydration mismatch
  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const cookieLang = getCookie(LANGUAGE_COOKIE_NAME);
      if (cookieLang && i18n.locales.includes(cookieLang)) {
        setLangState(cookieLang);
      } else {
        // Default to Bulgarian and set cookie
        setLangState(i18n.defaultLocale);
        setCookie(LANGUAGE_COOKIE_NAME, i18n.defaultLocale);
      }
    }
  }, []); // Only run once on mount

  // Wrapper function that saves to cookie when language changes
  const setLang = useCallback((newLang) => {
    if (typeof window !== 'undefined' && i18n.locales.includes(newLang)) {
      // Update state immediately
      setLangState(newLang);
      // Save to cookie (365 days expiration)
      setCookie(LANGUAGE_COOKIE_NAME, newLang);
    }
  }, []);

  return (
    <LanguageContext.Provider value={{ lang, setLang }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  
  // Fallback if context is not available (SSR or component outside LanguageProvider)
  if (!context) {
    return {
      lang: i18n.defaultLocale,
      setLang: () => {
        console.warn('setLang called but LanguageProvider is not available');
      },
    };
  }
  
  return context;
};
