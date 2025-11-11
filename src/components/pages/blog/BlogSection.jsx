"use client";
import { useSearchParams } from "next/navigation";
import { useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

  // Split blogs into two rows (3 per row)
  const firstRow = currentBlogs.slice(0, 3);
  const secondRow = currentBlogs.slice(3, 6);

  // Scroll to first blog when page changes
  useEffect(() => {
    if (firstBlogRef.current && currentPage !== prevPageRef.current) {
      firstBlogRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  return (
    <section className="blog-section py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden" ref={firstBlogRef}>
      <div className="blog-wrapper style3 -mt-[30px]">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* First Row */}
          {firstRow.length > 0 && (
            <div className="blog-card-wrap style3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 lg:gap-8 ">
              {firstRow.map((blog, index) => (
                <div
                  key={index}
                  className="blog-card style1 bg-white rounded-3xl overflow-hidden  transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group  shadow"
                >
                  {/* Image */}
                  <div className="blog-thumb relative overflow-hidden ">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={400}
                      height={250}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized={true}
                      priority={false}
                    />
                  </div>

                  {/* Content */}
                  <div className="blog-content p-6 sm:p-8">
                    {/* Meta */}
                    <div className="blog-meta flex items-center gap-4 sm:gap-6 lg:gap-7 mb-6">
                      <div className="item1 bg-theme text-white px-4 sm:px-5 py-3 rounded-lg text-center shrink-0">
                        <h6 className="font-['Epilogue',sans-serif] text-2xl font-bold leading-tight text-white m-0">
                          {blog.date}
                        </h6>
                        <p className="text-white font-['Roboto',sans-serif] text-xs font-normal leading-tight m-0 mt-1">
                          {blog.month}
                        </p>
                      </div>
                      <div className="item2">
                        <div className="icon flex items-center gap-2">
                          <Image
                            src="/img/icon/user.svg"
                            alt="icon"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-text font-['Roboto',sans-serif] text-sm font-medium leading-tight">
                            {blog.author}
                          </span>
                        </div>
                      </div>
                      <div className="item3">
                        <div className="icon flex items-center gap-2">
                          <Image
                            src="/img/icon/tag.svg"
                            alt="icon"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                            style={{ transform: "rotate(85deg)" }}
                          />
                          <span className="text-text font-['Roboto',sans-serif] text-sm font-medium leading-tight">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href="/blog-details">
                      <h3 className="text-title font-['Epilogue',sans-serif] text-xl sm:text-2xl font-bold leading-tight mb-4 transition-colors duration-300 hover:text-theme">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Read More */}
                    <Link
                      href="/blog-details"
                      className="link-btn text-text font-['Roboto',sans-serif] text-base font-medium leading-tight capitalize inline-flex items-center gap-2 transition-all duration-300 hover:text-theme group/link"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-5 h-5 text-text transition-colors duration-300 group-hover/link:text-theme" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Second Row */}
          {secondRow.length > 0 && (
            <div className="blog-card-wrap style3 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 lg:gap-8 mt-8">
              {secondRow.map((blog, index) => (
                <div
                  key={startIndex + index + 3}
                  className="blog-card style1 bg-white rounded-3xl overflow-hidden  transition-all duration-300 hover:-translate-y-2 hover:shadow-xl group "
                >
                  {/* Image */}
                  <div className="blog-thumb relative overflow-hidden">
                    <Image
                      src={blog.image}
                      alt={blog.title}
                      width={400}
                      height={250}
                      className="w-full h-auto object-cover transition-transform duration-300 group-hover:scale-110"
                      unoptimized={true}
                      priority={false}
                    />
                  </div>

                  {/* Content */}
                  <div className="blog-content p-6 sm:p-8">
                    {/* Meta */}
                    <div className="blog-meta flex items-center gap-4 sm:gap-6 lg:gap-7 mb-6">
                      <div className="item1 bg-theme text-white px-4 sm:px-5 py-3 rounded-lg text-center shrink-0">
                        <h6 className="font-['Epilogue',sans-serif] text-2xl font-bold leading-tight text-white m-0">
                          {blog.date}
                        </h6>
                        <p className="text-white font-['Roboto',sans-serif] text-xs font-normal leading-tight m-0 mt-1">
                          {blog.month}
                        </p>
                      </div>
                      <div className="item2">
                        <div className="icon flex items-center gap-2">
                          <Image
                            src="/img/icon/user.svg"
                            alt="icon"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                          />
                          <span className="text-text font-['Roboto',sans-serif] text-sm font-medium leading-tight">
                            {blog.author}
                          </span>
                        </div>
                      </div>
                      <div className="item3">
                        <div className="icon flex items-center gap-2">
                          <Image
                            src="/img/icon/tag.svg"
                            alt="icon"
                            width={20}
                            height={20}
                            className="w-5 h-5 object-contain"
                            style={{ transform: "rotate(85deg)" }}
                          />
                          <span className="text-text font-['Roboto',sans-serif] text-sm font-medium leading-tight">
                            {blog.category}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Title */}
                    <Link href="/blog-details">
                      <h3 className="text-title font-['Epilogue',sans-serif] text-xl sm:text-2xl font-bold leading-tight mb-4 transition-colors duration-300 hover:text-theme">
                        {blog.title}
                      </h3>
                    </Link>

                    {/* Read More */}
                    <Link
                      href="/blog-details"
                      className="link-btn text-text font-['Roboto',sans-serif] text-base font-medium leading-tight capitalize inline-flex items-center gap-2 transition-all duration-300 hover:text-theme group/link"
                    >
                      <span>Read More</span>
                      <ArrowRight className="w-5 h-5 text-text transition-colors duration-300 group-hover/link:text-theme" />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pagination */}
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 pb-12 sm:pb-16 md:pb-20 lg:pb-24">
        <Pagination totalItems={allBlogs.length} itemsPerPage={itemsPerPage} />
      </div>
    </section>
  );
}

