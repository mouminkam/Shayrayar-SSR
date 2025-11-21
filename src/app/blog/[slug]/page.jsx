// Blog section temporarily disabled
/*
import Breadcrumb from "../../../components/ui/Breadcrumb";
import BlogDetailsContent from "../../../components/blog/blog-details/BlogDetailsContent";
import BlogDetailsSidebar from "../../../components/blog/blog-details/BlogDetailsSidebar";
import CommentsSection from "../../../components/blog/blog-details/CommentsSection";
import CommentForm from "../../../components/blog/blog-details/CommentForm";

export default async function BlogDetailsPage({ params }) {
  const { slug } = await params;
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Blog Details" />
      <section className="blog-details-section  relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="blog-details-area">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
              <div className="lg:col-span-8">
                <BlogDetailsContent slug={slug} />
              </div>
              <div className="lg:col-span-4">
                <BlogDetailsSidebar />
              </div>
            </div>
            <div className="px-0 md:px-0 lg:px-15 xl:px-30">
              <CommentsSection slug={slug} />
              <CommentForm slug={slug} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
*/

export default async function BlogDetailsPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <div className="flex items-center justify-center py-20">
        <p className="text-text text-lg">Blog section is temporarily disabled</p>
      </div>
    </div>
  );
}

