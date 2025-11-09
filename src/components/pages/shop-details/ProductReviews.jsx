"use client";
import Image from "next/image";
import Link from "next/link";

export default function ProductReviews() {
  const reviews = [
    {
      id: 1,
      author: "Masirul Islam",
      date: "March 20, 2024 at 2:37 pm",
      avatar: "/img/blog/comment-author1.png",
      rating: "/img/icon/star3.svg",
      comment:
        "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy",
    },
    {
      id: 2,
      author: "Daniel Adam",
      date: "March 30, 2024 at 2:37 pm",
      avatar: "/img/blog/comment-author2.png",
      rating: "/img/icon/star3.svg",
      comment:
        "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy",
    },
  ];

  return (
    <div className="product-review mb-12">
      <h3 className="text-title font-['Epilogue',sans-serif] text-3xl font-black mb-10 capitalize">
        {reviews.length} Reviews
      </h3>
      <ul className="comment-list">
        {reviews.map((review) => (
          <li
            key={review.id}
            className="comment-item pb-8 mb-8 border-b border-gray-200 last:border-0 last:mb-0 last:pb-0"
          >
            <div className="post-comment flex items-start gap-5">
              <div className="comment-avater shrink-0">
                <Image
                  src={review.avatar}
                  alt={review.author}
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover"
                  unoptimized={true}
                />
              </div>
              <div className="comment-content flex-1 relative">
                <h4 className="name text-title font-['Epilogue',sans-serif] text-xl font-bold mb-1 capitalize">
                  {review.author}
                </h4>
                <div className="commented-on text-text text-sm mb-4">{review.date}</div>
                <div className="star absolute top-0 right-0 sm:block hidden">
                  <Image
                    src={review.rating}
                    alt="rating"
                    width={80}
                    height={16}
                    className="h-4"
                    unoptimized={true}
                  />
                </div>
                <div className="star block sm:hidden mb-4">
                  <Image
                    src={review.rating}
                    alt="rating"
                    width={80}
                    height={16}
                    className="h-4"
                    unoptimized={true}
                  />
                </div>
                <p className="text text-text text-base leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

