// Blog section temporarily disabled
/*
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
*/

export default function BlogPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <div className="flex items-center justify-center py-20">
        <p className="text-text text-lg">Blog section is temporarily disabled</p>
      </div>
    </div>
  );
}

