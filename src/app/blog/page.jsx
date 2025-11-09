"use client";
import Breadcrumb from "../../components/pages/blog/Breadcrumb";
import BlogSection from "../../components/pages/blog/BlogSection";

export default function BlogPage() {
  return (
    <div className="bg-bg2 min-h-screen">
      <Breadcrumb title="Blog" />
      <BlogSection />
    </div>
  );
}

