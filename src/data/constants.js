/**
 * Application constants
 * Centralized constants for the application
 */

// Navigation links
export const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/shop', label: 'Shop' },
  { href: '/contact-us', label: 'Contact Us' },
  { href: '/about-us', label: 'About US' },
];

// Social media links
export const SOCIAL_LINKS = [
  { href: 'https://google.com', label: 'Facebook', icon: 'Facebook' },
  { href: 'https://twitter.com', label: 'Twitter', icon: 'Twitter' },
  { href: 'https://youtube.com', label: 'YouTube', icon: 'Youtube' },
  { href: 'https://linkedin.com', label: 'LinkedIn', icon: 'Linkedin' },
];

// Business hours
export const BUSINESS_HOURS = '09:00 am - 06:00 pm';

// Tax amount (fixed amount, not percentage)
export const TAX_AMOUNT = 10; // 10 EUR fixed tax
// Keep TAX_RATE for backward compatibility if needed, but use TAX_AMOUNT instead
export const TAX_RATE = 0.1; // Deprecated: Use TAX_AMOUNT instead

// Pagination
export const ITEMS_PER_PAGE_GRID = 12;
export const ITEMS_PER_PAGE_LIST = 5;
export const ITEMS_PER_PAGE = 12; // Default for backward compatibility

// Image paths
export const IMAGE_PATHS = {
  logo: '/img/logo/mainlogo.png',
  breadcrumb: '/img/bg/breadcumb.jpg',
  placeholder: '/img/placeholder.svg',
};

