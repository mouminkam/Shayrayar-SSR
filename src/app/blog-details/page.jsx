"use client";
import Breadcrumb from "../../components/pages/blog/Breadcrumb";
import BlogDetailsContent from "../../components/pages/blog/blog-details/BlogDetailsContent";
import BlogDetailsSidebar from "../../components/pages/blog/blog-details/BlogDetailsSidebar";
import CommentsSection from "../../components/pages/blog/blog-details/CommentsSection";
import CommentForm from "../../components/pages/blog/blog-details/CommentForm";

export default function BlogDetailsPage() {
  return (
    <div className="bg-bg2 min-h-screen">
      <Breadcrumb title="Blog Details" />
      <section className="blog-details-section py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="blog-details-area">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <BlogDetailsContent />
                <CommentsSection />
                <CommentForm />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <BlogDetailsSidebar />
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

