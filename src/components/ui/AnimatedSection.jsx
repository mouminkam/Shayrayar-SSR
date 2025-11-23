"use client";
import { useEffect, useState } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";

// AnimatedSection Wrapper Component
// Provides smooth scroll-triggered animations for sections
// duration: animation duration in seconds (default: 0.8)
// mobileOptimized: If true, shows content immediately on mobile without animation delay
const AnimatedSection = ({ children, duration = 0.8, mobileOptimized = true }) => {
  const [isMobile, setIsMobile] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({
    triggerOnce: true, // Trigger once for better performance
    threshold: 0.05, // Lower threshold for mobile
    rootMargin: mobileOptimized ? "200px 0px 0px 0px" : "0px 0px -50px 0px" // Larger margin on mobile
  });

  // Detect mobile on mount
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  useEffect(() => {
    if (inView) {
      // On mobile, animate faster and ensure visibility
      const animDuration = isMobile && mobileOptimized ? duration * 0.6 : duration;
      controls.start({
        x: 0,
        opacity: 1,
        transition: { duration: animDuration, ease: "easeOut" },
      });
    } else if (!mobileOptimized) {
      // Only animate out on desktop if not mobile optimized
      controls.start({
        x: -100,
        opacity: 0,
        transition: { duration: duration * 0.6, ease: "easeInOut" },
      });
    }
  }, [controls, inView, duration, isMobile, mobileOptimized]);

  // On mobile with optimization, show content immediately if in view
  const initialState = isMobile && mobileOptimized && inView 
    ? { x: 0, opacity: 1 } 
    : { x: -100, opacity: 0 };

  return (
    <motion.div
      ref={ref}
      animate={controls}
      initial={initialState}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedSection;

