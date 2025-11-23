"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export default function BlogDetailsSidebar() {
  const [searchQuery, setSearchQuery] = useState("");

  const categories = [
    { name: "Breakfast", count: 8 },
    { name: "Restaurant", count: 11 },
    { name: "Dinner", count: 12, active: true },
    { name: "Fast Food", count: 18 },
    { name: "Launch", count: 7 },
  ];

  const recentPosts = [
    {
      image: "/img/blog/blogRecentThumb3_1.png",
      date: "18 Dec, 2024",
      title: "Avoid Health Risk Food & Endure High Availability",
    },
    {
      image: "/img/blog/blogRecentThumb3_2.png",
      date: "18 Dec, 2024",
      title: "Tacking the Condition of Your Fresh Mind",
    },
    {
      image: "/img/blog/blogRecentThumb3_3.png",
      date: "18 Dec, 2024",
      title: "What's the Holding Back the Food Solution",
    },
  ];

  const tags = ["Cheese", "Cocktail", "Drink", "Uncategorized", "Pizza", "Non Veg"];

  const handleSearch = (e) => {
    e.preventDefault();
    // Handle search
    console.log("Search:", searchQuery);
  };

  return (
    <div className="main-sidebar2">
      {/* Search Widget */}
      <div className="single-sidebar-widget bg-bgimg p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg mb-8">
        <div className="wid-title mb-6">
          <h3 className="text-white  text-xl sm:text-2xl font-bold relative pb-4 capitalize">
            Search
            <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme3"></span>
          </h3>
        </div>
        <div className="search-widget">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-5 rounded-lg font-medium border-none outline-none text-white  text-sm sm:text-base pr-20 focus:ring-1 focus:ring-white"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 w-16 sm:w-20 h-full text-white rounded-r-lg hover:bg-theme3 transition-colors duration-300 flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Categories Widget */}
      <div className="single-sidebar-widget bg-bgimg p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg mb-8">
        <div className="wid-title mb-6">
          <h3 className="text-white  text-xl sm:text-2xl font-bold relative pb-4 capitalize">
            Categories
            <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme3"></span>
          </h3>
        </div>
        <div className="news-widget-categories">
          <ul className="space-y-3">
            {categories.map((category, index) => (
              <li
                key={index}
                className={`rounded-lg transition-all duration-300  ${category.active
                  ? "bg-theme3 "
                  : "hover:bg-theme3"
                  }`}
              >
                <Link
                  href="/blog"
                  className="flex items-center justify-between px-5 sm:px-6 py-5"
                >
                  <span
                    className={` text-sm sm:text-base font-medium text-white`}
                  >
                    {category.name}
                  </span>
                  <span
                    className={` text-sm sm:text-base font-medium text-white`}
                  >
                    ({category.count})
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Recent Posts Widget */}
      <div className="single-sidebar-widget bg-bgimg p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg mb-8">
        <div className="wid-title mb-6">
          <h3 className="text-white  text-xl sm:text-2xl font-bold relative pb-4 capitalize">
            Recent Post
            <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme3"></span>
          </h3>
        </div>
        <div className="recent-post-area">
          {recentPosts.map((post, index) => (
            <div
              key={index}
              className={`recent-items flex items-center gap-4 sm:gap-5 ${index !== recentPosts.length - 1 ? "pb-5 mb-5 border-b border-gray-200" : ""
                }`}
            >
              <div className="recent-thumb shrink-0">
                <Image
                  src={post.image}
                  alt={post.title}
                  width={80}
                  height={80}
                  className="w-16 sm:w-20 h-16 sm:h-20 object-cover rounded-lg"
                  quality={80}
                  loading="lazy"
                  sizes="(max-width: 640px) 64px, 80px"
                />
              </div>
              <div className="recent-content">
                <ul className="flex items-center gap-2 mb-2">
                  <li className="flex items-center gap-1 text-theme  text-md font-normal">
                    <Image
                      src="/img/icon/calendarIcon.png"
                      alt="calendar"
                      width={16}
                      height={16}
                      className="w-4 h-4"
                    />
                    {post.date}
                  </li>
                </ul>
                <h6 className=" text-base font-bold leading-6">
                  <Link
                    href={`/blog/${post.slug || post.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '')}`}
                    className="text-white hover:text-theme transition-colors duration-300"
                  >
                    {post.title}
                  </Link>
                </h6>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tags Widget */}
      <div className="single-sidebar-widget bg-bgimg p-6 sm:p-8 lg:p-10 rounded-lg shadow-lg">
        <div className="wid-title mb-6">
          <h3 className="text-white  text-xl sm:text-2xl font-bold relative pb-4 capitalize">
            Tags
            <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme3"></span>
          </h3>
        </div>
        <div className="tagcloud flex items-center flex-wrap gap-2 sm:gap-3">
          {tags.map((tag, index) => (
            <Link
              key={index}
              href="/blog"
              className={`inline-flex px-4 py-2 text-sm  font-normal capitalize rounded transition-all duration-300 ${index === 1
                ? "bg-theme3 text-white"
                : "text-white hover:bg-theme3 hover:text-white"
                }`}
            >
              {tag}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

