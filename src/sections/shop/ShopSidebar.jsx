"use client";
import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Star } from "lucide-react";
import { motion } from "framer-motion";

// Constants
const MIN_PRICE = 0;
const MAX_PRICE = 1000;
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 1000;

// Data
const CATEGORIES = [
  { name: "Cheese", href: "/shop" },
  { name: "Cocktail", href: "/shop" },
  { name: "Drink", href: "/shop" },
  { name: "Uncategorized", href: "/shop" },
  { name: "Pizza", href: "/shop" },
  { name: "Non Veg", href: "/shop" },
];

const RECENT_PRODUCTS = [
  {
    image: "/img/shop/recentThumb1_1.png",
    title: "Ruti With Beef Slice",
    regularPrice: 35,
    offerPrice: 25,
    rating: "/img/icon/star3.svg",
  },
  {
    image: "/img/shop/recentThumb1_2.png",
    title: "Fast Food Combo",
    regularPrice: 95,
    offerPrice: 75,
    rating: "/img/icon/star3.svg",
  },
  {
    image: "/img/shop/recentThumb1_3.png",
    title: "Delicious Salad",
    regularPrice: 65,
    offerPrice: 55,
    rating: "/img/icon/star3.svg",
  },
  {
    image: "/img/shop/recentThumb1_4.png",
    title: "Chinese Pasta",
    regularPrice: 45,
    offerPrice: 35,
    rating: "/img/icon/star3.svg",
  },
];

export default function ShopSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(DEFAULT_MIN_PRICE);
  const [maxPrice, setMaxPrice] = useState(DEFAULT_MAX_PRICE);

  // Clamp function to ensure values are within bounds
  const clamp = (v, a, b) => Math.max(a, Math.min(b, Number(v)));

  // Minimum gap between min and max price (2% of range)
  const MIN_GAP = Math.max(1, Math.round((MAX_PRICE - MIN_PRICE) * 0.02));

  // Calculate price range percentage for slider
  // const priceRange = useMemo(() => {
  //   const range = MAX_PRICE - MIN_PRICE || 1;
  //   // Ensure min and max maintain minimum gap for display
  //   const adjustedMin = Math.min(minPrice, maxPrice - MIN_GAP);
  //   const adjustedMax = Math.max(maxPrice, minPrice + MIN_GAP);
  //   return {
  //     minPercent: ((adjustedMin - MIN_PRICE) / range) * 100,
  //     maxPercent: ((adjustedMax - MIN_PRICE) / range) * 100,
  //   };
  // }, [minPrice, maxPrice, MIN_GAP]);

  // Handle min price change
  // const handleMinPriceChange = useCallback((value) => {
  //   const numValue = clamp(value, MIN_PRICE, MAX_PRICE);
  //   // Ensure min doesn't exceed max - MIN_GAP
  //   const adjustedValue = Math.min(numValue, maxPrice - MIN_GAP);
  //   setMinPrice(adjustedValue);
  // }, [maxPrice, MIN_GAP]);

  // Handle max price change
  // const handleMaxPriceChange = useCallback((value) => {
  //   const numValue = clamp(value, MIN_PRICE, MAX_PRICE);
  //   // Ensure max doesn't go below min + MIN_GAP
  //   const adjustedValue = Math.max(numValue, minPrice + MIN_GAP);
  //   setMaxPrice(adjustedValue);
  // }, [minPrice, MIN_GAP]);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  }, [searchQuery]);



  return (
    <aside className="main-sidebar space-y-6 lg:space-y-8">
      {/* Search Widget */}
      <div className="bg-bgimg p-6 sm:p-8 rounded-2xl shadow-sm">
        <h5 className="text-white font-['Epilogue',sans-serif] text-lg sm:text-xl font-bold relative pb-3 mb-6 capitalize">
          Search
          <span className="absolute bottom-0 left-0 h-0.5 w-16 sm:w-20 bg-theme3"></span>
        </h5>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bgimg text-sm sm:text-base px-4 sm:px-5 py-3 rounded-lg border-none outline-none text-white font-['Roboto',sans-serif] pr-12 sm:pr-16 focus:ring-2 focus:ring-white transition-all"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full w-12 sm:w-16 bg-transparent  text-white hover:bg-theme3 hover:text-white rounded-r-lg transition-all duration-300 flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-4 h-4 cursor-pointer sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="bg-bgimg p-6 sm:p-8 rounded-2xl shadow-sm">
        <h5 className="text-white font-['Epilogue',sans-serif] text-lg sm:text-xl font-bold relative pb-3 mb-6 capitalize">
          Categories
          <span className="absolute bottom-0 left-0 h-0.5 w-16 sm:w-20 bg-theme3"></span>
        </h5>
        <ul className="flex flex-wrap items-center gap-2 sm:gap-3">
          {CATEGORIES.map((category, index) => (
            <li key={index}>
              <Link
                href={category.href}
                className="inline-flex px-3 sm:px-4 py-2 sm:py-2.5  text-white font-['Epilogue',sans-serif] text-xs sm:text-sm font-normal capitalize rounded-lg transition-all duration-300 hover:bg-theme3 hover:text-white active:scale-95"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Recent Products Widget - Desktop Only */}
      <div className="hidden lg:block w-full mt-8">
        <div className="bg-linear-to-br from-bgimg/80 via-bgimg to-bgimg/95 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-theme3/5 to-transparent opacity-20 pointer-events-none"></div>

          <h5 className="text-white font-['Epilogue',sans-serif] text-lg lg:text-xl font-black relative pb-3 lg:pb-4 mb-6 lg:mb-8 capitalize text-center">
            <span className="relative z-10 bg-linear-to-r from-theme3 to-theme bg-clip-text text-transparent drop-shadow-lg">
              Recent Products
            </span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 lg:w-20 bg-linear-to-r from-theme to-theme3 rounded-full"></span>
          </h5>

          <div className="grid grid-cols-1 gap-4 lg:gap-6 relative z-10">
            {RECENT_PRODUCTS.map((product, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-linear-to-br from-white/5 via-bgimg to-black/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl transition-all duration-500 relative overflow-hidden"
                whileHover={{ y: -4 }}
              >
                <div className="flex flex-col items-center text-center space-y-3 lg:space-y-4">
                  {/* Product Image with Floating Effect */}
                  <div className="relative w-full flex justify-center">
                    <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-full bg-linear-to-br transition-all duration-500">
                      <div className="w-full h-full rounded-full bg-bgimg/80 backdrop-blur-sm border border-white/10 group-hover:border-theme3/30 transition-all duration-500 flex items-center justify-center">
                        <Image
                          src={product.image}
                          alt={product.title}
                          width={64}
                          height={64}
                          className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-full transform group-hover:scale-110 transition-transform duration-500"
                          unoptimized={true}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Product Content */}
                  <div className="space-y-2 lg:space-y-3 flex-1 w-full">
                    <Link
                      href="/shop-details"
                      className="text-white font-['Epilogue',sans-serif] text-sm lg:text-base font-extrabold hover:text-theme transition-all duration-300 block line-clamp-2 group-hover:-translate-y-px"
                    >
                      {product.title}
                    </Link>

                    {/* Stars Rating */}
                    <div className="flex items-center justify-center gap-0.5">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className="w-3 h-3 lg:w-3.5 lg:h-3.5 fill-theme3 text-theme3 transform group-hover:scale-110 transition-transform duration-300"
                        />
                      ))}
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-center gap-2 lg:gap-3">
                      <span className="text-theme font-['Epilogue',sans-serif] text-sm lg:text-base font-black bg-linear-to-r from-theme/10 to-theme3/10 px-2 lg:px-3 py-1 rounded-full">
                        ${product.offerPrice}
                      </span>
                      <span className="text-text font-['Epilogue',sans-serif] text-xs lg:text-sm font-medium line-through opacity-70">
                        ${product.regularPrice}
                      </span>
                    </div>

                    {/* Quick Add Button */}
                    <button className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white font-['Epilogue',sans-serif] text-xs lg:text-sm font-semibold py-1.5 lg:py-2 px-3 lg:px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-theme3/30 ">
                      Add +
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* View All Link */}
          <div className="text-center mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-white/10">
            <Link
              href="/shop"
              className="inline-flex items-center text-theme3 font-['Epilogue',sans-serif] text-xs lg:text-sm font-semibold hover:text-theme transition-all duration-300 group"
            >
              View All Products
              <ArrowRight className="w-3 h-3 lg:w-4 lg:h-4 ml-1 lg:ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
            </Link>
          </div>
        </div>
      </div>
    </aside>
  );
}
