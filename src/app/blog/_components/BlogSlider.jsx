"use client";
import React from "react";
import BlogPost from "./BlogPost";
import BlogPagination from "./BlogPagination";
import { BLOG_CONFIG } from "./blogData";

/**
 * BlogSlider Component
 * Displays paginated blog posts with navigation controls
 *
 * @param {Object} props
 * @param {Array} props.posts - Array of blog posts
 * @param {number} props.currentPage - Current active page
 * @param {Function} props.onPageChange - Callback function when page changes
 */
export default function BlogSlider({
  posts,
  currentPage,
  onPageChange,
  postsPerPage,
}) {
  const totalPages = Math.ceil(posts.length / postsPerPage);

  const currentPosts = posts.slice(
    (currentPage - 1) * postsPerPage,
    currentPage * postsPerPage
  );

  return (
    <section className="blog-slider py-16 lg:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 gap-16 lg:gap-20">
          {currentPosts.map((post, index) => (
            <BlogPost key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* Pagination */}
        <BlogPagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      </div>
    </section>
  );
}
