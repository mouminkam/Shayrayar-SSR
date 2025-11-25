"use client";
import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import ProductCard from "./ProductCard";
import ProductCardSkeleton from "./ProductCardSkeleton";

/**
 * LazyProductCard - Lazy loads ProductCard when it enters viewport
 * @param {Object} product - Product data
 * @param {string} viewMode - "grid" or "list"
 * @param {Object} options - Intersection Observer options
 */
export default function LazyProductCard({ 
  product, 
  viewMode = "grid",
  options = {}
}) {
  const [shouldLoad, setShouldLoad] = useState(false);
  
  // Default options for intersection observer
  const defaultOptions = {
    threshold: 0.1, // Start loading when 10% of card is visible
    rootMargin: "100px", // Start loading 100px before card enters viewport
    triggerOnce: true, // Only trigger once for better performance
    ...options
  };

  const { ref, inView } = useInView(defaultOptions);

  // Load card when it enters viewport
  useEffect(() => {
    if (inView) {
      setShouldLoad(true);
    }
  }, [inView]);

  // If already loaded, render immediately
  if (shouldLoad) {
    return <ProductCard product={product} viewMode={viewMode} />;
  }

  // Render skeleton while waiting to load
  return (
    <div ref={ref} className="w-full">
      <ProductCardSkeleton viewMode={viewMode} count={1} />
    </div>
  );
}

