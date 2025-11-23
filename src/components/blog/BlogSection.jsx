"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, User, Tag } from "lucide-react";
import Pagination from "./Pagination";


export default function BlogSection() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const itemsPerPage = 6;
  const firstBlogRef = useRef(null);
  const prevPageRef = useRef(currentPage);

  const allBlogs = [
    {
      date: "15",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Fast Food Frenzy a Taste of Convenience",
      image: "/img/blog/blogThumb1_1.jpg",
    },
    {
      date: "17",
      month: "Dec",
      author: "By Admin",
      category: "Chicken",
      title: "Benefits of health and safety measures",
      image: "/img/blog/blogThumb1_2.jpg",
    },
    {
      date: "25",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Quick Cravings Unraveling Fast Food Delights",
      image: "/img/blog/blogThumb1_3.jpg",
    },
    {
      date: "15",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Fast Food Frenzy a Taste of Convenience",
      image: "/img/blog/blogThumb1_4.jpg",
    },
    {
      date: "17",
      month: "Dec",
      author: "By Admin",
      category: "Chicken",
      title: "Benefits of health and safety measures",
      image: "/img/blog/blogThumb1_5.jpg",
    },
    {
      date: "25",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Quick Cravings Unraveling Fast Food Delights",
      image: "/img/blog/blogThumb1_6.jpg",
    },
    {
      date: "25",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Quick Cravings Unraveling Fast Food Delights",
      image: "/img/blog/blogThumb1_6.jpg",
    },
    {
      date: "25",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Quick Cravings Unraveling Fast Food Delights",
      image: "/img/blog/blogThumb1_6.jpg",
    },
    {
      date: "25",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Quick Cravings Unraveling Fast Food Delights",
      image: "/img/blog/blogThumb1_6.jpg",
    },
    {
      date: "25",
      month: "Dec",
      author: "By Admin",
      category: "Noodles",
      title: "Quick Cravings Unraveling Fast Food Delights",
      image: "/img/blog/blogThumb1_6.jpg",
    },
  ];

  // Calculate pagination
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentBlogs = allBlogs.slice(startIndex, endIndex);

  // Scroll to first blog when page changes
  useEffect(() => {
    if (firstBlogRef.current && currentPage !== prevPageRef.current) {
      firstBlogRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  return (
    <section
      className="blog-section py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden"
      ref={firstBlogRef}
    >
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Blog Cards Grid - Single Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {currentBlogs.map((blog, index) => (
            <div
              key={`${startIndex}-${index}`}
              className="bg-bgimg rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 group h-full flex flex-col"
            >
              {/* Image */}
              <div className="relative overflow-hidden h-64 shrink-0">
                <Image
                  src={blog.image}
                  alt={blog.title}
                  width={400}
                  height={250}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                  quality={85}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
              </div>

              {/* Content */}
              <div className="p-6 sm:p-8 flex flex-col flex-1">
                {/* Meta */}
                <div className="flex items-center gap-5 mb-5">
                  <div className="bg-theme3 text-white px-4 py-2 rounded-xl text-center">
                    <h6 className="text-2xl font-bold">{blog.date}</h6>
                    <p className="text-sm">{blog.month}</p>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <User className="w-5 h-5 text-theme3" />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-white text-sm">
                    <Tag className="w-5 h-5 text-theme3" />
                    <span>{blog.category}</span>
                  </div>
                </div>

                {/* Title */}
                <Link href={`/blog/${blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`} className="flex-1">
                  <h3 className="text-white  text-xl sm:text-2xl font-bold mb-4 transition-colors duration-300 line-clamp-2">
                    {blog.title}
                  </h3>
                </Link>

                {/* Read More */}
                <Link
                  href={`/blog/${blog.slug || blog.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                  className="text-theme3 font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all duration-300 mt-auto"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-5 h-5 text-theme3" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Pagination */}
        {allBlogs.length > itemsPerPage && (
          <div className="mt-12 sm:mt-16 md:mt-20 lg:mt-24">
            <Pagination totalItems={allBlogs.length} itemsPerPage={itemsPerPage} />
          </div>
        )}
      </div>
    </section>
  );
}
