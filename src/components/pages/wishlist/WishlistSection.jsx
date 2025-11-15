"use client";
import { motion } from "framer-motion";
import WishlistTable from "./WishlistTable";
import SocialButtons from "./SocialButtons";
import { Heart } from "lucide-react";

export default function WishlistSection() {
  return (
    <section className="shop-details-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-30 pointer-events-none"></div>
      
      <div className="relative z-10">
        <div className="container mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="shop-details bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 py-6 px-3 relative overflow-hidden"
          >
            {/* Subtle gradient overlay */}
            <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>
            <div className="tinv-wishlist woocommerce tinv-wishlist-clear relative z-10">
              {/* Header */}
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="tinv-header mb-8 pb-6"
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    className="w-14 h-14 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center"
                  >
                    <Heart className="w-7 h-7 text-white fill-white" />
                  </motion.div>
                  <h2 className="text-white font-epilogue text-3xl lg:text-4xl font-black">
                    My Wishlist
                  </h2>
                </div>
              </motion.div>

              {/* Wishlist Table */}
              <form action="#" method="post" autoComplete="off">
                <WishlistTable />
              </form>

              {/* Social Buttons */}
              <div className="mt-8 pt-8">
                <SocialButtons />
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

