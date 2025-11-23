"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { Heart } from "lucide-react";

export default function WishlistPreview({ wishlistItems }) {
  if (wishlistItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.2 }}
      className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center"
          >
            <Heart className="w-6 h-6 text-white fill-white" />
          </motion.div>
          <h3 className="text-white  text-2xl font-black uppercase">
            Saved Items
          </h3>
        </div>
        <Link
          href="/wishlist"
          className="text-theme3 hover:text-theme text-sm font-medium transition-colors"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {wishlistItems.slice(0, 6).map((item) => (
          <Link
            key={item.id}
            href={`/shop/${item.id}`}
            className="group relative aspect-square rounded-xl overflow-hidden border border-white/10 hover:border-theme3/50 transition-all duration-300"
          >
            <Image
              src={item.image || "/img/placeholder.png"}
              alt={item.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-300"
              quality={85}
              loading="lazy"
              sizes="80px"
            />
          </Link>
        ))}
      </div>
    </motion.div>
  );
}

