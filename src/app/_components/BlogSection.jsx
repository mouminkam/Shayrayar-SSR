"use client";
import { useState, useEffect } from "react";
import {
  BlogBanner,
  BlogSlider,
  LoadingSpinner,
  blogPosts,
  BLOG_CONFIG,
} from "../blog/_components";

/**
 * BlogSection Component
 * Main blog page component that displays blog banner and paginated blog posts
 */
export default function BlogSection() {
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize components after mount
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, BLOG_CONFIG.loadingDelay);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="blog-page">
      <BlogBanner />
      <BlogSlider
        posts={blogPosts}
        currentPage={currentPage}
        onPageChange={setCurrentPage}
        postsPerPage={1}
      />
    </div>
  );
}

// Export BlogDetail for use in detail pages
export { BlogDetail } from "../blog/_components";
