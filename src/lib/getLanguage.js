import { cookies } from 'next/headers';
import { i18n } from '../locales/i18n/config';

const LANGUAGE_COOKIE_NAME = 'language';

/**
 * Server-side function to get language from cookie
 * Falls back to default locale ('bg') if not found
 * 
 * IMPORTANT: We use cookie for language preference.
 * The default language is always 'bg' for first-time visitors.
 * 
 * @returns {Promise<string>} Language code ('en' or 'bg')
 */
export async function getLanguage() {
  try {
    const cookieStore = await cookies();
    const languageCookie = cookieStore.get(LANGUAGE_COOKIE_NAME);
    
    if (languageCookie?.value && i18n.locales.includes(languageCookie.value)) {
      return languageCookie.value;
    }
    
    // Always fallback to default locale ('bg') for first-time visitors
    return i18n.defaultLocale;
  } catch (error) {
    console.error('Error reading language cookie:', error);
    return i18n.defaultLocale;
  }
}
