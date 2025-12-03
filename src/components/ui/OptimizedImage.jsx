"use client";
import { useState, useEffect, useMemo, useRef } from "react";
import NextImage from "next/image";
import { getBlurPlaceholder } from "../../lib/utils/imageUtils";
import { IMAGE_PATHS } from "../../data/constants";

/**
 * OptimizedImage Component
 * Enhanced Next.js Image with blur placeholder support, auto-retry, and fallback
 * Automatically retries loading failed images every 2 seconds (max 3 retries)
 * 
 * @param {string} src - Image source URL
 * @param {string} alt - Image alt text
 * @param {string} blurDataURL - Optional blur placeholder (auto-generated if not provided)
 * @param {number} maxRetries - Maximum number of retry attempts (default: 3)
 * @param {number} retryDelay - Delay between retries in milliseconds (default: 2000)
 * @param {Object} rest - All other Next.js Image props
 */
export default function OptimizedImage({ 
  src, 
  alt, 
  blurDataURL,
  className = "",
  maxRetries = 3,
  retryDelay = 2000,
  ...rest 
}) {
  const [blurPlaceholder, setBlurPlaceholder] = useState(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const [imageKey, setImageKey] = useState(() => Date.now()); // Lazy initialization
  const loadTimeoutRef = useRef(null);
  const retryTimeoutRef = useRef(null);
  
  // Fallback image path
  const fallbackSrc = IMAGE_PATHS.placeholder;

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

  // Reset states when src changes
  useEffect(() => {
    if (src) {
      setImageError(false);
      setImageLoaded(false);
      setRetryCount(0);
      setImageKey(() => Date.now());
      // Clear any existing timeouts
      if (loadTimeoutRef.current) {
        clearTimeout(loadTimeoutRef.current);
      }
      if (retryTimeoutRef.current) {
        clearTimeout(retryTimeoutRef.current);
      }
    }
  }, [src]);

  // Auto-retry mechanism: retry loading every 2 seconds if image failed to load
  useEffect(() => {
    // Only retry if we have an error and haven't exceeded max retries
    if (imageError && retryCount < maxRetries) {
      retryTimeoutRef.current = setTimeout(() => {
        // Force re-render by changing key
        setImageKey(() => Date.now());
        setImageError(false);
        setImageLoaded(false);
        setRetryCount((prev) => prev + 1);
      }, retryDelay);

      return () => {
        if (retryTimeoutRef.current) {
          clearTimeout(retryTimeoutRef.current);
        }
      };
    }
  }, [imageError, retryCount, maxRetries, retryDelay]);

  // Timeout check: if image doesn't load within 5 seconds, trigger retry
  useEffect(() => {
    if (src && !imageLoaded && !imageError && retryCount === 0) {
      loadTimeoutRef.current = setTimeout(() => {
        // If still not loaded after 5 seconds, trigger error to start retry
        if (!imageLoaded) {
          setImageError(true);
        }
      }, 5000);

      return () => {
        if (loadTimeoutRef.current) {
          clearTimeout(loadTimeoutRef.current);
        }
      };
    }
  }, [src, imageLoaded, imageError, retryCount]);

  // Check if src exists before render
  if (!src) {
    const minHeight = rest.height || 200;
    const minWidth = rest.width || 200;
    return (
      <div 
        className={`bg-gray-800/50 flex items-center justify-center animate-pulse ${className}`}
        style={{
          minHeight: `${minHeight}px`,
          minWidth: `${minWidth}px`,
        }}
      >
        <span className="text-gray-500 text-sm">Loading...</span>
      </div>
    );
  }

  // After max retries, show fallback image
  if (imageError && retryCount >= maxRetries) {
    return (
      <div className="relative">
        <NextImage
          src={fallbackSrc}
          alt={alt || "Image not available"}
          className={className}
          {...rest}
        />
      </div>
    );
  }

  const imageSrc = src;
  const isFill = rest.fill === true;

  // If using fill prop, the parent container should handle positioning
  // We still need a wrapper for absolute positioned elements (skeleton, retry indicator)
  if (isFill) {
    return (
      <div className="absolute inset-0">
        {/* Skeleton/Placeholder while loading */}
        {!imageLoaded && (
          <div 
            className={`absolute inset-0 bg-gray-800/50 animate-pulse z-0`}
          />
        )}
        
        <NextImage
          key={`${imageSrc}-${imageKey}`} // Force re-render when URL or key changes (for retry)
          src={imageSrc}
          alt={alt || "Image"}
          blurDataURL={blurPlaceholder}
          fill
          className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
          onLoad={() => {
            setImageLoaded(true);
            setImageError(false);
            // Clear timeout if image loads successfully
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
          }}
          onError={() => {
            setImageError(true);
            setImageLoaded(false);
            // Clear load timeout
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
          }}
          onLoadingComplete={() => {
            setImageLoaded(true);
            setImageError(false);
            // Clear timeout if image loads successfully
            if (loadTimeoutRef.current) {
              clearTimeout(loadTimeoutRef.current);
            }
          }}
          placeholder={blurPlaceholder ? "blur" : "empty"}
          {...rest}
        />
        
        {/* Show retry indicator if retrying */}
        {imageError && retryCount < maxRetries && (
          <div className="absolute inset-0 bg-gray-800/30 flex items-center justify-center z-10">
            <span className="text-gray-400 text-xs">Retrying... ({retryCount + 1}/{maxRetries})</span>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Skeleton/Placeholder while loading */}
      {!imageLoaded && (
        <div 
          className={`absolute inset-0 bg-gray-800/50 animate-pulse ${className}`}
          style={{
            minHeight: rest.height ? `${rest.height}px` : undefined,
            minWidth: rest.width ? `${rest.width}px` : undefined,
          }}
        />
      )}
      
      <NextImage
        key={`${imageSrc}-${imageKey}`} // Force re-render when URL or key changes (for retry)
        src={imageSrc}
        alt={alt || "Image"}
        blurDataURL={blurPlaceholder}
        className={`${className} ${!imageLoaded ? 'opacity-0' : 'opacity-100'} transition-opacity duration-300`}
        onLoad={() => {
          setImageLoaded(true);
          setImageError(false);
          // Clear timeout if image loads successfully
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
        }}
        onError={() => {
          setImageError(true);
          setImageLoaded(false);
          // Clear load timeout
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
        }}
        onLoadingComplete={() => {
          setImageLoaded(true);
          setImageError(false);
          // Clear timeout if image loads successfully
          if (loadTimeoutRef.current) {
            clearTimeout(loadTimeoutRef.current);
          }
        }}
        placeholder={blurPlaceholder ? "blur" : "empty"}
        {...rest}
      />
      
      {/* Show retry indicator if retrying */}
      {imageError && retryCount < maxRetries && (
        <div className="absolute inset-0 bg-gray-800/30 flex items-center justify-center">
          <span className="text-gray-400 text-xs">Retrying... ({retryCount + 1}/{maxRetries})</span>
        </div>
      )}
    </div>
  );
}

