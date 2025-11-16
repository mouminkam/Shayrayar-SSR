"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ShopSidebar from "./ShopSidebar";
import SortBar from "./SortBar";
import ProductCard from "../ui/ProductCard";
import Pagination from "../blog/Pagination";
import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

// Constants
const ITEMS_PER_PAGE_GRID = 12;
const ITEMS_PER_PAGE_LIST = 5;

// Recent Products Data
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

// Sample products data - replace with actual data from API/backend
const SAMPLE_PRODUCTS = [
  {
    id: 1,
    title: "Chicken Pizza",
    image: "/img/dishes/dishes2_1.png",
    price: 24.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 2,
    title: "Egg and Cucumber",
    image: "/img/dishes/dishes2_2.png",
    price: 28.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 3,
    title: "Chicken Fried Rice",
    image: "/img/dishes/dishes2_3.png",
    price: 20.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 4,
    title: "Chicken Leg Piece",
    image: "/img/dishes/dishes2_4.png",
    price: 58.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 5,
    title: "Chicken Pizza",
    image: "/img/dishes/dishes2_1.png",
    price: 24.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 6,
    title: "Egg and Cucumber",
    image: "/img/dishes/dishes2_2.png",
    price: 28.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 7,
    title: "Chicken Fried Rice",
    image: "/img/dishes/dishes2_3.png",
    price: 20.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 8,
    title: "Chicken Leg Piece",
    image: "/img/dishes/dishes2_4.png",
    price: 58.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 9,
    title: "Chicken Pizza",
    image: "/img/dishes/dishes2_4.png",
    price: 24.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 10,
    title: "Egg and Cucumber",
    image: "/img/dishes/dishes2_5.png",
    price: 28.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 11,
    title: "Chicken Fried Rice",
    image: "/img/dishes/dishes2_3.png",
    price: 20.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  {
    id: 12,
    title: "Chicken Leg Piece",
    image: "/img/dishes/dishes2_4.png",
    price: 58.0,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  },
  ...Array.from({ length: 18 }, (_, i) => ({
    id: 13 + i,
    title: `Product ${13 + i}`,
    image: "/img/dishes/dishes2_1.png",
    price: 20 + i * 5,
    rating: "/img/icon/star2.svg",
    description: "The registration fee",
  })),
];

export default function ShopSection() {
  const searchParams = useSearchParams();
  const currentPage = Number(searchParams.get("page")) || 1;
  const [viewMode, setViewMode] = useState("grid");
  const sortBarRef = useRef(null);
  const prevPageRef = useRef(currentPage);

  // Get items per page based on view mode
  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;

  // Handle view mode change - keep current page
  const handleViewChange = (mode) => {
    setViewMode(mode);
  };

  // Calculate pagination with useMemo for performance
  const { currentProducts, totalItems } = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedProducts = SAMPLE_PRODUCTS.slice(startIndex, endIndex);

    return {
      currentProducts: paginatedProducts,
      totalItems: SAMPLE_PRODUCTS.length,
    };
  }, [currentPage, itemsPerPage]);

  // Scroll to SortBar when page changes
  useEffect(() => {
    if (sortBarRef.current && currentPage !== prevPageRef.current) {
      sortBarRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
      prevPageRef.current = currentPage;
    }
  }, [currentPage]);

  return (
    <section className="shop-section py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden" ref={sortBarRef}>
      <div className="shop-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Sort Bar */}
          <div className="mb-6 lg:mb-8">
            <SortBar
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onViewChange={handleViewChange}
              viewMode={viewMode}
            />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
            {/* Sidebar */}
            <aside className="lg:col-span-3 order-1">
              <ShopSidebar />
            </aside>
            {/* Main Content */}
            <main className="lg:col-span-9 order-2 flex flex-col gap-6 lg:gap-8">
              {/* Products Grid/List */}
              <div className="w-full min-h-[400px]">
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                    {currentProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {currentProducts.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode="list" />
                    ))}
                  </div>
                )}
              </div>

              {/* Pagination */}
              {totalItems > itemsPerPage && (
                <div className="w-full mt-4">
                  <Pagination totalItems={totalItems} itemsPerPage={itemsPerPage} />
                </div>
              )}

              {/* Recent Products Widget - Mobile/Tablet Only */}
              <div className="block lg:hidden w-full mt-12">
                <div className="bg-linear-to-br from-bgimg/80 via-bgimg to-bgimg/95 backdrop-blur-sm p-8 rounded-3xl shadow-2xl shadow-theme3/10 relative overflow-hidden">
                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-linear-to-br from-theme3/5 to-transparent opacity-20 pointer-events-none"></div>

                  <h5 className="text-white font-['Epilogue',sans-serif] text-xl sm:text-2xl font-black relative pb-4 mb-8 capitalize text-center">
                    <span className="relative z-10 bg-linear-to-r from-theme3 to-theme bg-clip-text text-transparent drop-shadow-lg">
                      Recent Products
                    </span>
                    <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-20 bg-linear-to-r from-theme to-theme3 rounded-full"></span>
                  </h5>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 relative z-10">
                    {RECENT_PRODUCTS.map((product, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: index * 0.1 }}
                        className="group bg-linear-to-br from-white/5 via-bgimg to-black/90 backdrop-blur-md p-5 rounded-2xl  transition-all duration-500 relative overflow-hidden"
                        whileHover={{ y: -4 }}
                      >

                        <div className="flex flex-col items-center text-center space-y-4">
                          {/* Product Image with Floating Effect */}
                          <div className="relative w-full flex justify-center">
                            <div className="w-20 h-20 rounded-full bg-linear-to-br transition-all duration-500">
                              <div className="w-full h-full rounded-full bg-bgimg/80 backdrop-blur-sm border border-white/10 group-hover:border-theme3/30 transition-all duration-500 flex items-center justify-center">
                                <Image
                                  src={product.image}
                                  alt={product.title}
                                  width={80}
                                  height={80}
                                  className="w-16 h-16 object-cover rounded-full transform group-hover:scale-110 transition-transform duration-500"
                                  unoptimized={true}
                                />
                              </div>
                            </div>
                          </div>

                          {/* Product Content */}
                          <div className="space-y-3 flex-1 w-full">
                            <Link
                              href="/shop-details"
                              className="text-theme3 font-['Epilogue',sans-serif] text-lg font-extrabold hover:text-theme transition-all duration-300 block line-clamp-2 group-hover:-translate-y-px"
                            >
                              {product.title}
                            </Link>

                            {/* Stars Rating */}
                            <div className="flex items-center justify-center gap-0.5">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className="w-4 h-4 fill-theme3 text-theme3 transform group-hover:scale-110 transition-transform duration-300"
                                />
                              ))}
                            </div>

                            {/* Price */}
                            <div className="flex items-center justify-center gap-3">
                              <span className="text-theme font-['Epilogue',sans-serif] text-lg font-black bg-linear-to-r from-theme/10 to-theme3/10 px-3 py-1 rounded-full">
                                ${product.offerPrice}
                              </span>
                              <span className="text-text font-['Epilogue',sans-serif] text-sm font-medium line-through opacity-70">
                                ${product.regularPrice}
                              </span>
                            </div>

                            {/* Quick Add Button */}
                            <button className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white font-['Epilogue',sans-serif] text-sm font-semibold py-2 px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-theme3/30 border border-theme3/20">
                              Quick Add +
                            </button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>

                  {/* View All Link */}
                  <div className="text-center mt-8 pt-6 border-t border-white/10">
                    <Link
                      href="/shop"
                      className="inline-flex items-center text-theme3 font-['Epilogue',sans-serif] text-sm font-semibold hover:text-theme transition-all duration-300 group"
                    >
                      View All Products
                      <ArrowRight className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform duration-300" />
                    </Link>
                  </div>
                </div>
              </div>
            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

