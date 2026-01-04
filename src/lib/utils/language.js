/**
 * Language Utilities
 * Unified functions to get language from cookie
 * 
 * IMPORTANT: All language retrieval should use cookie, not localStorage
 * This ensures consistency between SSR and CSR
 */

import { getCookie } from './cookies';
import { i18n } from '../../locales/i18n/config';

const LANGUAGE_COOKIE_NAME = 'language';

/**
 * Client-side function to get language from cookie
 * Falls back to default locale ('bg') if not found
 * 
 * @returns {string} Language code ('en' or 'bg')
 */
export function getLanguageFromCookie() {
  if (typeof document === 'undefined') {
    return i18n.defaultLocale;
  }
  
  try {
    const cookieLang = getCookie(LANGUAGE_COOKIE_NAME);
    
    if (cookieLang && i18n.locales.includes(cookieLang)) {
      return cookieLang;
    }
    
    // Fallback to default locale
    return i18n.defaultLocale;
  } catch (error) {
    console.error('Error reading language cookie:', error);
    return i18n.defaultLocale;
  }
}

/**
 * Get language cookie name (for consistency)
 * @returns {string} Language cookie name
 */
export function getLanguageCookieName() {
  return LANGUAGE_COOKIE_NAME;
}

