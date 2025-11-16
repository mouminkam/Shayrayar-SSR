import { Suspense } from "react";
import Breadcrumb from "../../components/ui/Breadcrumb";
import BlogSection from "../../components/blog/BlogSection";
import BlogSectionFallback from "../../components/pages/blog/BlogSectionFallback";

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

