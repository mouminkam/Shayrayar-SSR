"use client";
import { motion } from "framer-motion";
import Image from "next/image";

export default function ProductImage({ product }) {
  // Use a data URL as fallback if placeholder doesn't exist
  const placeholderFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect fill='%23ddd' width='500' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
  const imageUrl = product?.image || placeholderFallback;
  
  console.log("🖼️ ProductImage - product:", product);
  console.log("🖼️ ProductImage - imageUrl:", imageUrl);
  
  return (
    <div className="py-8 sm:py-12 lg:py-16 rounded-xl h-full flex items-center justify-center relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative flex justify-center items-center shrink-0 w-full"
      >
        {/* Animated background circle */}
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
          className="absolute z-0"
        >
          <Image
            src="/img/food-items/circleShape2.png"
            alt="shape"
            width={500}
            height={500}
            className="w-64 h-64 sm:w-80 sm:h-80 lg:w-105 lg:h-105 opacity-80"
            unoptimized={true}
          />
        </motion.div>

        {/* Product Image with hover effect */}
        <motion.div
          whileHover={{ scale: 1.05, rotate: 2 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="relative z-10"
        >
          <div className="relative">
            {/* Glow effect */}
            <div className="absolute inset-0 bg-linear-to-br from-theme3/20 to-theme/20 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            
            <Image
              src={imageUrl}
              alt={product?.title || "Product"}
              width={500}
              height={500}
              className="w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-full relative z-10 shadow-2xl shadow-theme3/90 "
              unoptimized={true}
            />
          </div>
        </motion.div>

        {/* Floating particles effect */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-theme3 rounded-full opacity-60"
            animate={{
              y: [0, -30, 0],
              x: [0, Math.sin(i) * 20, 0],
              opacity: [0.6, 1, 0.6],
            }}
            transition={{
              duration: 3 + i,
              repeat: Infinity,
              delay: i * 0.5,
              ease: "easeInOut",
            }}
            style={{
              left: `${20 + i * 30}%`,
              top: `${30 + i * 20}%`,
            }}
          />
        ))}
      </motion.div>
    </div>
  );
}

