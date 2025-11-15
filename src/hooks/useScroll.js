"use client";
import { useState, useEffect } from "react";

/**
 * Custom hook to detect scroll position
 * @param {number} threshold - Scroll threshold in pixels (default: 150)
 * @returns {boolean} Whether the scroll threshold has been passed
 */
export const useScroll = (threshold = 150) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > threshold);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return isScrolled;
};

