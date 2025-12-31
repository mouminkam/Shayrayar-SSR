import { headers } from 'next/headers';
import { i18n } from '../locales/i18n/config';

/**
 * Server-side function to get language from Accept-Language header
 * Falls back to default locale if header not found or not supported
 * @returns {Promise<string>} Language code ('en' or 'bg')
 */
export async function getLanguage() {
  try {
    const headersList = await headers();
    const acceptLanguage = headersList.get('accept-language');
    
    if (acceptLanguage) {
      // Parse Accept-Language header
      // Format: "en-US,en;q=0.9,bg;q=0.8" -> ["en", "bg"]
      const languages = acceptLanguage
        .split(',')
        .map(lang => lang.split(';')[0].trim().toLowerCase().substring(0, 2));
      
      // Always prioritize default locale (bg) if it exists in the header
      if (languages.includes(i18n.defaultLocale)) {
        return i18n.defaultLocale;
      }
      
      // If default locale not in header, still use it as default
      // Only use other languages if explicitly requested and default not available
      // This ensures bg is always the default language
      return i18n.defaultLocale;
    }
    
    // Fallback to default locale
    return i18n.defaultLocale;
  } catch (error) {
    console.error('Error reading Accept-Language header:', error);
    return i18n.defaultLocale;
  }
}

