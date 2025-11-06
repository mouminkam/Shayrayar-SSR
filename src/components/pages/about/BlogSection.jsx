"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function BlogSection() {
  const blogs = [
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
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Image
              src="/img/icon/titleIcon.svg"
              alt="icon"
              width={20}
              height={20}
            />
            <span className="text-theme2 font-['Epilogue',sans-serif] text-base font-bold uppercase">
              LATEST NEWS
            </span>
            <Image
              src="/img/icon/titleIcon.svg"
              alt="icon"
              width={20}
              height={20}
            />
          </div>
          <h2 className="text-title font-['Epilogue',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-black">
            Our Latest Foods News
          </h2>
        </div>

        {/* Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
          {blogs.map((blog, index) => (
            <div
              key={index}
              className="bg-white rounded-3xl overflow-hidden shadow-lg transition-all duration-300 hover:-translate-y-2 group"
            >
              {/* Image */}
              <div className="relative overflow-hidden">
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
              <div className="p-6 sm:p-8">
                {/* Meta */}
                <div className="flex items-center gap-5 mb-5">
                  <div className="bg-theme text-white px-4 py-2 rounded-xl text-center">
                    <h6 className="text-2xl font-bold">{blog.date}</h6>
                    <p className="text-sm">{blog.month}</p>
                  </div>
                  <div className="flex items-center gap-2 text-text text-sm">
                    <Image
                      src="/img/icon/user.svg"
                      alt="icon"
                      width={16}
                      height={16}
                      className="w-5 h-5"
                    />
                    <span>{blog.author}</span>
                  </div>
                  <div className="flex items-center gap-2 text-text text-sm">
                    <Image
                      src="/img/icon/tag.svg"
                      alt="icon"
                      width={16}
                      height={16}
                      className="w-5 h-5"
                    />
                    <span>{blog.category}</span>
                  </div>
                </div>

                {/* Title */}
                <Link href="/blog-details">
                  <h3 className="text-title font-['Epilogue',sans-serif] text-xl sm:text-2xl font-bold mb-4 hover:text-theme transition-colors duration-300">
                    {blog.title}
                  </h3>
                </Link>

                {/* Read More */}
                <Link
                  href="/blog-details"
                  className="text-theme font-semibold inline-flex items-center gap-2 hover:gap-3 transition-all duration-300"
                >
                  <span>Read More</span>
                  <ArrowRight className="w-5 h-5 text-theme" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
