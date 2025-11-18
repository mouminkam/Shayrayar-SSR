"use client";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Twitter, Youtube, Linkedin } from "lucide-react";

export default function CommentsSection({ slug }) {
  const comments = [
    {
      id: 1,
      author: "Albert Flores",
      date: "March 20, 2024 at 2:37 pm",
      image: "/img/blog/comment-author1.png",
      comment:
        "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy",
    },
    {
      id: 2,
      author: "Alex Flores",
      date: "March 20, 2024 at 2:37 pm",
      image: "/img/blog/comment-author2.png",
      comment:
        "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy",
    },
  ];

  return (
    <div className="comments-area mt-10">
      {/* Tags and Share */}
      <div className="tag-share-wrap border-b border-gray-200 py-5 mt-10 mb-8 w-full">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div className="tagcloud flex items-center flex-wrap gap-2">
            <h6 className="text-white font-['Epilogue',sans-serif] text-lg sm:text-xl font-semibold mr-2 inline">
              Tags:{" "}
            </h6>
            <Link
              href="/blog"
              className="inline-flex px-4 py-2 text-title font-['Epilogue',sans-serif] text-sm font-normal capitalize bg-white border border-gray-200 rounded transition-all duration-300 hover:bg-theme3 hover:text-white hover:border-theme3"
            >
              News
            </Link>
            <Link
              href="/blog"
              className="inline-flex px-4 py-2 text-white font-['Epilogue',sans-serif] text-sm font-normal capitalize bg-theme3 border border-theme3 rounded transition-all duration-300"
            >
              business
            </Link>
            <Link
              href="/blog"
              className="inline-flex px-4 py-2 text-title font-['Epilogue',sans-serif] text-sm font-normal capitalize bg-white border border-gray-200 rounded transition-all duration-300 hover:bg-theme3 hover:text-white hover:border-theme3"
            >
              marketing
            </Link>
          </div>
          {/* Social Media Icons */}
          <div className="flex items-center gap-2 sm:gap-3">
            <span className="text-white font-['Epilogue',sans-serif] text-lg font-semibold">Share:</span>
            <a
              href="https://facebook.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-white/20 rounded flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300 group"
              aria-label="Facebook"
            >
              <Facebook className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
            </a>
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-white/20 rounded flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300 group"
              aria-label="Twitter"
            >
              <Twitter className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-white/20 rounded flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300 group"
              aria-label="LinkedIn"
            >
              <Linkedin className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
            </a>
            <a
              href="https://youtube.com"
              target="_blank"
              rel="noopener noreferrer"
              className="w-9 h-9 border border-white/20 rounded flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300 group"
              aria-label="YouTube"
            >
              <Youtube className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
            </a>
          </div>
        </div>
      </div>
      <div className="comments-heading mb-8">
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-medium mb-0">
          02 Comments
        </h3>
      </div>

      {comments.map((comment) => (
        <div
          key={comment.id}
          className="blog-single-comment flex flex-col sm:flex-row gap-4 sm:gap-5 pt-8 pb-8 border-b border-gray-200 last:border-b-0"
        >
          <div className="image shrink-0">
            <Image
              src={comment.image}
              alt={comment.author}
              width={80}
              height={80}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover"
              unoptimized={true}
            />
          </div>
          <div className="content flex-1">
            <div className="head flex flex-wrap gap-2 sm:gap-4 items-center justify-between mb-3">
              <div className="con">
                <h5 className="mb-1">
                  <span className="text-white font-['Epilogue',sans-serif] text-lg sm:text-xl font-semibold capitalize">
                    {comment.author}
                  </span>
                </h5>
                <span className="text-text font-['Roboto',sans-serif] text-sm">{comment.date}</span>
              </div>
              <div className="btn">
                <button
                  className="inline-flex px-10 py-2 bg-theme3 text-white font-['Roboto',sans-serif] text-md rounded-full hover:bg-theme transition-colors duration-300"
                >
                  Reply
                </button>
              </div>
            </div>
            <p className="text-text font-['Roboto',sans-serif] text-base leading-7 mb-0">{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

