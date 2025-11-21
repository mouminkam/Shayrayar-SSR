"use client";

import { useEffect, useRef } from "react";

const LenisScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") return;

    let lenisInstance = null;
    let rafId = null;
    let isMounted = true;

    // Dynamic import to ensure it only runs on client
    const initLenis = async () => {
      try {
        // Check if already initialized
        if (lenisRef.current) return;

        // Lazy load lenis only when needed
        const LenisModule = await import("lenis");
        const Lenis = LenisModule.default || LenisModule;
        
        if (!isMounted) return;

        // Initialize Lenis
        lenisInstance = new Lenis({
          lerp: 0.1,
          duration: 1.0,
          smoothWheel: true,
          smoothTouch: false, // Disable on touch devices for better performance
          wheelMultiplier: 1,
          touchMultiplier: 2,
        });

        lenisRef.current = lenisInstance;

        // Animation frame function
        function raf(time) {
          if (lenisInstance && isMounted) {
            lenisInstance.raf(time);
            rafId = requestAnimationFrame(raf);
          }
        }

        rafId = requestAnimationFrame(raf);
        rafIdRef.current = rafId;

        // Log success in development
        if (process.env.NODE_ENV === "development") {
          console.log("Lenis initialized successfully");
        }
      } catch (error) {
        console.error("Failed to initialize Lenis:", error);
        // Don't break the app if Lenis fails to load
      }
    };

    // Initialize immediately on client
    initLenis();

    // Cleanup
    return () => {
      isMounted = false;
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenisInstance) {
        try {
          lenisInstance.destroy();
        } catch (e) {
          console.error("Error destroying Lenis:", e);
        }
      }
      lenisRef.current = null;
    };
  }, []);

  return <>{children}</>;
};

export default LenisScrollProvider;

