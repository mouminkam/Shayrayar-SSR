"use client";

import { useEffect, useRef } from "react";

const LenisScrollProvider = ({ children }) => {
  const lenisRef = useRef(null);
  const rafIdRef = useRef(null);

  useEffect(() => {
    let lenisInstance = null;
    let rafId = null;
    let isMounted = true;

    // Dynamic import to ensure it only runs on client
    const initLenis = async () => {
      try {
        // Lazy load lenis only when needed
        const LenisModule = await import("lenis");
        const Lenis = LenisModule.default;
        
        if (!isMounted) return;

        // Initialize Lenis
        lenisInstance = new Lenis({
          lerp: 0.1,
          duration: 1.0,
          smoothWheel: true,
          smoothTouch: false, // Disable on touch devices for better performance
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
      } catch (error) {
        console.error("Failed to initialize Lenis:", error);
      }
    };

    // Delay initialization slightly to not block initial render
    const timeoutId = setTimeout(initLenis, 0);

    // Cleanup
    return () => {
      isMounted = false;
      clearTimeout(timeoutId);
      if (rafId) {
        cancelAnimationFrame(rafId);
      }
      if (lenisInstance) {
        lenisInstance.destroy();
      }
    };
  }, []);

  return <>{children}</>;
};

export default LenisScrollProvider;

