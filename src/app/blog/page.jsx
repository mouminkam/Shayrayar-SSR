"use client";
import { Suspense } from "react";
import Breadcrumb from "../../components/pages/blog/Breadcrumb";
import BlogSection from "../../components/pages/blog/BlogSection";

function BlogSectionFallback() {
  return (
    <section className="blog-section py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-theme"></div>
          <p className="mt-4 text-text">Loading blog posts...</p>
        </div>
      </div>
    </section>
  );
}

export default function BlogPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Blog" />
      <Suspense fallback={<BlogSectionFallback />}>
        <BlogSection />
      </Suspense>
    </div>
  );
}

