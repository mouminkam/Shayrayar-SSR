"use client";
import Image from "next/image";
import { Star, MessageSquare } from "lucide-react";

export default function ProductReviews({ productId }) {
  const reviews = [
    {
      id: 1,
      author: "Masirul Islam",
      date: "March 20, 2024 at 2:37 pm",
      avatar: "/img/blog/comment-author1.png",
      rating: 5,
      comment:
        "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy",
    },
    {
      id: 2,
      author: "Daniel Adam",
      date: "March 30, 2024 at 2:37 pm",
      avatar: "/img/blog/comment-author2.png",
      rating: 5,
      comment:
        "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy",
    },
  ];

  return (
    <div className="product-review mb-12 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>
      
      <div className="flex items-center justify-between mb-10 relative z-10">
        <h3 className="text-white  text-3xl font-black capitalize">
          {reviews.length} {reviews.length === 1 ? 'Review' : 'Reviews'}
        </h3>
        {reviews.length > 0 && (
          <div className="flex items-center gap-2 text-theme3">
            <MessageSquare className="w-5 h-5" />
            <span className="text-sm font-semibold">{reviews.length} Total</span>
          </div>
        )}
      </div>
      
      {reviews.length === 0 ? (
        <div className="text-center py-12 relative z-10">
          <MessageSquare className="w-16 h-16 text-white/20 mx-auto mb-4" />
          <p className="text-text text-lg">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <ul className="comment-list relative z-10">
          {reviews.map((review) => (
            <li
              key={review.id}
              className="comment-item pb-8 mb-8 border-b border-white/10 last:border-0 last:mb-0 last:pb-0"
            >
              <div className="post-comment flex items-start gap-5 group">
                <div className="comment-avater shrink-0">
                  <div className="relative">
                    <div className="absolute inset-0 bg-linear-to-br from-theme3/20 to-theme/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    <Image
                      src={review.avatar}
                      alt={review.author}
                      width={80}
                      height={80}
                      className="w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-theme3/50 transition-all duration-300 relative z-10"
                      unoptimized={true}
                    />
                  </div>
                </div>
                <div className="comment-content flex-1 relative">
                  <h4 className="name text-white  text-xl font-bold mb-1 capitalize transition-colors duration-300">
                    {review.author}
                  </h4>
                  <div className="commented-on text-text text-sm mb-4">{review.date}</div>
                  <div className="star absolute top-0 right-0 sm:flex hidden items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (review.rating || 5) ? 'fill-theme3 text-theme3' : 'fill-white/10 text-white/30'}`}
                      />
                    ))}
                  </div>
                  <div className="star flex sm:hidden items-center gap-0.5 mb-4">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${i < (review.rating || 5) ? 'fill-theme3 text-theme3' : 'fill-white/10 text-white/30'}`}
                      />
                    ))}
                  </div>
                  <p className="text text-white text-base leading-relaxed">{review.comment}</p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
