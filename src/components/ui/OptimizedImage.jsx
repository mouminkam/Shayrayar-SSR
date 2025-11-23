"use client";
import { useState, useEffect, useMemo } from "react";
import NextImage from "next/image";
import { getBlurPlaceholder } from "../../lib/utils/imageUtils";

/**
 * OptimizedImage Component
 * Enhanced Next.js Image with blur placeholder support
 * Automatically generates blur placeholder if not provided
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {string} blurDataURL - Optional blur placeholder (auto-generated if not provided)
 * @param {Object} rest - All other Next.js Image props
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  blurDataURL,
  className = "",
  ...rest 
}) {
  const [blurPlaceholder, setBlurPlaceholder] = useState(null);
  const [imageError, setImageError] = useState(false);

  // Generate blur placeholder synchronously on mount to avoid any async issues
  const initialBlurPlaceholder = useMemo(() => {
    if (blurDataURL) {
      return blurDataURL;
    }
    if (src && typeof window !== "undefined") {
      try {
        return getBlurPlaceholder(src);
      } catch (error) {
        console.warn("Failed to generate blur placeholder:", error);
        return null;
      }
    }
    return null;
  }, [src, blurDataURL]);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;
    
    // Set the initial blur placeholder
    if (initialBlurPlaceholder) {
      setBlurPlaceholder(initialBlurPlaceholder);
    }
  }, [initialBlurPlaceholder]);

  // Fallback for broken images
  if (imageError) {
    return (
      <div 
        className={`bg-gray-800/50 flex items-center justify-center ${className}`}
        style={{ minHeight: rest.height || 200, minWidth: rest.width || 200 }}
      >
        <span className="text-gray-500 text-sm">Image not available</span>
      </div>
    );
  }

  return (
    <NextImage
      src={src}
      alt={alt}
      blurDataURL={blurPlaceholder}
      className={className}
      onError={() => setImageError(true)}
      placeholder={blurPlaceholder ? "blur" : "empty"}
      {...rest}
    />
  );
}

