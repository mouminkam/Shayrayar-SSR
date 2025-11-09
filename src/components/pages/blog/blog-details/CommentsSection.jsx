"use client";
import Image from "next/image";
import Link from "next/link";

export default function CommentsSection() {
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
      <div className="comments-heading mb-8">
        <h3 className="text-title font-['Epilogue',sans-serif] text-2xl sm:text-3xl lg:text-4xl font-medium mb-0">
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
                  <Link
                    href="/blog-details"
                    className="text-title font-['Epilogue',sans-serif] text-lg sm:text-xl font-semibold capitalize hover:text-theme2 transition-colors duration-300"
                  >
                    {comment.author}
                  </Link>
                </h5>
                <span className="text-text font-['Roboto',sans-serif] text-sm">{comment.date}</span>
              </div>
              <div className="btn">
                <Link
                  href="/blog-details"
                  className="inline-flex px-4 py-2 bg-theme text-white font-['Roboto',sans-serif] text-sm rounded-full hover:bg-title transition-colors duration-300"
                >
                  Reply
                </Link>
              </div>
            </div>
            <p className="text-text font-['Roboto',sans-serif] text-base leading-7 mb-0">{comment.comment}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

