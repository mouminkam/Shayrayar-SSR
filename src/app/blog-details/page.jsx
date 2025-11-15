"use client";
import Breadcrumb from "../../components/ui/Breadcrumb";
import BlogDetailsContent from "../../sections/blog/blog-details/BlogDetailsContent";
import BlogDetailsSidebar from "../../sections/blog/blog-details/BlogDetailsSidebar";
import CommentsSection from "../../sections/blog/blog-details/CommentsSection";
import CommentForm from "../../sections/blog/blog-details/CommentForm";

export default function BlogDetailsPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Blog Details" />
      <section className="blog-details-section  relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="blog-details-area">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              {/* Main Content */}
              <div className="lg:col-span-8">
                <BlogDetailsContent />
              </div>

              {/* Sidebar */}
              <div className="lg:col-span-4">
                <BlogDetailsSidebar />
              </div>
            </div>
            <div className="px-0 md:px-0 lg:px-15 xl:px-30">
              <CommentsSection />
              <CommentForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

