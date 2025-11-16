"use client";
import { motion } from "framer-motion";
import Image from "next/image";
import { Star } from "lucide-react";

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
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="product-review mb-12 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden"
    >
      {/* Subtle gradient overlay */}
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>
      
      <h3 className="text-white font-['Epilogue',sans-serif] text-3xl font-black mb-10 capitalize relative z-10">
        {reviews.length} Reviews
      </h3>
      <ul className="comment-list relative z-10">
        {reviews.map((review, index) => (
          <motion.li
            key={review.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
            className="comment-item pb-8 mb-8 border-b border-white/10 last:border-0 last:mb-0 last:pb-0"
          >
            <div className="post-comment flex items-start gap-5 group">
              <div className="comment-avater shrink-0">
                <motion.div
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ duration: 0.3 }}
                  className="relative"
                >
                  <div className="absolute inset-0 bg-linear-to-br from-theme3/20 to-theme/20 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <Image
                    src={review.avatar}
                    alt={review.author}
                    width={80}
                    height={80}
                    className="w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-theme3/50 transition-all duration-300 relative z-10"
                    unoptimized={true}
                  />
                </motion.div>
              </div>
              <div className="comment-content flex-1 relative">
                <h4 className="name text-white font-['Epilogue',sans-serif] text-xl font-bold mb-1 capitalize transition-colors duration-300">
                  {review.author}
                </h4>
                <div className="commented-on text-text text-sm mb-4">{review.date}</div>
                <div className="star absolute top-0 right-0 sm:flex hidden items-center gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-theme3 text-theme3"
                    />
                  ))}
                </div>
                <div className="star flex sm:hidden items-center gap-0.5 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className="w-4 h-4 fill-theme3 text-theme3"
                    />
                  ))}
                </div>
                <p className="text text-white text-base leading-relaxed">{review.comment}</p>
              </div>
            </div>
          </motion.li>
        ))}
      </ul>
    </motion.div>
  );
}

