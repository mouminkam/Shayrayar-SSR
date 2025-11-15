"use client";
import { motion } from "framer-motion";
import ProductImage from "./ProductImage";
import ProductAbout from "./ProductAbout";
import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";
import ReviewForm from "./ReviewForm";

export default function ShopDetailsContent() {
  return (
    <section className="bg-bg3 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-30 pointer-events-none"></div>
      
      <div className="shop-details-wrapper style1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shop-details rounded-3xl ">
            <div className="container mx-auto">
              {/* Product Image and About */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid grid-cols-1 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-12 items-stretch shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <ProductImage />
                </div>
                <div className="relative z-10">
                  <ProductAbout />
                </div>
              </motion.div>

              {/* Product Description */}
              <ProductDescription />

              {/* Product Reviews */}
              <ProductReviews />

              {/* Review Form */}
              <ReviewForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

