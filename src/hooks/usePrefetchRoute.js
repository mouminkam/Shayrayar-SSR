"use client";
import { useRouter } from "next/navigation";
import { useTransition, useCallback } from "react";

/**
 * Custom hook for route prefetching and navigation with transitions
 * Provides smooth navigation experience even during page loading
 * 
 * @returns {Object} - { prefetchRoute, navigate, isPending }
 */
export function usePrefetchRoute() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  /**
   * Prefetch a route (load resources in background)
   * Should be called on hover or when link is visible
   * 
   * @param {string} href - Route path to prefetch
   */
  const prefetchRoute = useCallback((href) => {
    if (typeof window !== "undefined" && href) {
      try {
        router.prefetch(href);
      } catch (error) {
        // Silently fail - prefetch is not critical
        if (process.env.NODE_ENV === "development") {
          console.warn("Failed to prefetch route:", href, error);
        }
      }
    }
  }, [router]);

  /**
   * Navigate to a route with transition
   * Uses startTransition to mark navigation as non-urgent
   * This allows React to keep UI responsive during navigation
   * 
   * @param {string} href - Route path to navigate to
   * @param {Object} options - Navigation options
   * @param {boolean} options.prefetch - Whether to prefetch before navigating (default: true)
   */
  const navigate = useCallback((href, options = {}) => {
    if (!href) return;

    const { prefetch: shouldPrefetch = true } = options;

    // Prefetch first if requested
    if (shouldPrefetch) {
      prefetchRoute(href);
    }

    // Navigate with transition (no scroll)
    startTransition(() => {
      try {
        router.push(href, { scroll: false });
      } catch (error) {
        console.error("Navigation error:", error);
      }
    });
  }, [router, prefetchRoute]);

  /**
   * Prefetch multiple routes at once
   * Useful for prefetching related pages
   * 
   * @param {string[]} routes - Array of route paths to prefetch
   */
  const prefetchRoutes = useCallback((routes) => {
    if (Array.isArray(routes)) {
      routes.forEach(route => {
        if (route) prefetchRoute(route);
      });
    }
  }, [prefetchRoute]);

  return {
    prefetchRoute,
    navigate,
    prefetchRoutes,
    isPending,
  };
}

