/**
 * Image utility functions for blur placeholders and optimization
 * 
 * Note: We avoid using 'Image' constructor directly to prevent conflicts
 * with Next.js Image component. Use document.createElement('img') instead.
 * 
 * IMPORTANT: This file must NOT import or reference 'Image' from next/image
 * to avoid naming conflicts with the DOM Image constructor.
 */

/**
 * Creates a blur placeholder data URL from an image URL
 * This generates a tiny base64 image that can be used as a placeholder
 * 
 * @param {string} imageUrl - The original image URL
 * @param {number} width - Placeholder width (default: 10)
 * @param {number} height - Placeholder height (default: 10)
 * @returns {Promise<string>} - Base64 data URL or fallback SVG
 */
export async function generateBlurDataURL(imageUrl, width = 10, height = 10) {
  // If no image URL, return a simple gray placeholder
  if (!imageUrl || imageUrl.startsWith('data:')) {
    return generateSVGPlaceholder(width, height);
  }

  try {
    // For remote images, we'll use a simple approach
    // In production, you might want to use a service like Cloudinary or ImageKit
    // that provides blur placeholders automatically
    
    // For now, we'll generate a simple colored placeholder based on the image URL
    // This is a lightweight solution that works immediately
    
    // Generate a consistent color based on the image URL hash
    const hash = imageUrl.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    const saturation = 20 + (Math.abs(hash) % 30); // 20-50%
    const lightness = 15 + (Math.abs(hash) % 20); // 15-35% (dark theme)
    
    return generateSVGPlaceholder(width, height, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
  } catch (error) {
    console.warn("Failed to generate blur placeholder:", error);
    return generateSVGPlaceholder(width, height);
  }
}

/**
 * Generates a simple SVG placeholder
 * 
 * @param {number} width - SVG width
 * @param {number} height - SVG height
 * @param {string} color - Background color (default: gray)
 * @returns {string} - SVG data URL
 */
export function generateSVGPlaceholder(width = 10, height = 10, color = "#1a1a1a") {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `.trim();
  
  // Use encodeURIComponent for better compatibility
  if (typeof window !== "undefined" && typeof btoa !== "undefined") {
    try {
      return `data:image/svg+xml;base64,${btoa(svg)}`;
    } catch {
      // Fallback to URI encoding if btoa fails
      return `data:image/svg+xml,${encodeURIComponent(svg)}`;
    }
  }
  
  // Fallback for server-side
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

/**
 * Creates a blur placeholder for Next.js Image component
 * This is a synchronous version that returns immediately
 * 
 * @param {string} imageUrl - The original image URL
 * @returns {string} - Blur data URL
 */
export function getBlurPlaceholder(imageUrl) {
  if (!imageUrl) {
    return generateSVGPlaceholder(10, 10);
  }

  // For local images, try to use a simple approach
  if (imageUrl.startsWith('/')) {
    // Generate a subtle colored placeholder
    const hash = imageUrl.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    const hue = Math.abs(hash) % 360;
    const saturation = 20 + (Math.abs(hash) % 30);
    const lightness = 15 + (Math.abs(hash) % 20);
    
    return generateSVGPlaceholder(10, 10, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
  }

  // For remote images, use a neutral dark placeholder
  return generateSVGPlaceholder(10, 10, "#1a1a1a");
}

/**
 * Preloads an image in the background
 * 
 * @param {string} imageUrl - Image URL to preload
 * @returns {Promise<void>}
 */
export function preloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    if (!imageUrl || typeof window === "undefined" || typeof document === "undefined") {
      resolve();
      return;
    }

    try {
      // Use document.createElement to avoid conflict with Next.js Image component
      // NEVER use 'new Image()' or 'window.Image()' here as it conflicts with Next.js Image
      const img = document.createElement('img');
      img.onload = () => resolve();
      img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
      img.src = imageUrl;
    } catch (error) {
      // Silently fail - preloading is not critical
      console.warn("Failed to preload image:", error);
      resolve();
    }
  });
}

/**
 * Checks if an image is loaded
 * 
 * @param {string} imageUrl - Image URL to check
 * @returns {Promise<boolean>}
 */
export async function isImageLoaded(imageUrl) {
  if (!imageUrl || typeof window === "undefined") {
    return false;
  }

  try {
    await preloadImage(imageUrl);
    return true;
  } catch {
    return false;
  }
}

/**
 * Converts a relative image path from API to a full URL
 * Handles both relative paths (e.g., "avatars/...") and full URLs
 * 
 * @param {string} imagePath - Image path from API (can be relative, full URL, or data URL)
 * @returns {string|null} - Full URL for Next.js Image component, or null if no path
 */
export function getFullImageUrl(imagePath) {
  if (!imagePath) {
    return null;
  }

  // If already a full URL (http:// or https://), return as is
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath;
  }

  // If data URL (from FileReader), return as is
  if (imagePath.startsWith("data:")) {
    return imagePath;
  }

  // If starts with /storage/, add base URL
  if (imagePath.startsWith("/storage/")) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shahrayar.peaklink.pro/api/v1";
    const storageBaseUrl = API_BASE_URL.replace("/api/v1", "");
    return `${storageBaseUrl}${imagePath}`;
  }

  // If relative path (e.g., "avatars/..."), construct full URL
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shahrayar.peaklink.pro/api/v1";
  const storageBaseUrl = API_BASE_URL.replace("/api/v1", "");
  const cleanPath = imagePath.startsWith("/") ? imagePath.slice(1) : imagePath;
  return `${storageBaseUrl}/storage/${cleanPath}`;
}

