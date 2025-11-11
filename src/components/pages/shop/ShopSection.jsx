"use client";
import { useState, useMemo, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ShopSidebar from "./ShopSidebar";
import SortBar from "./SortBar";
import ProductCard from "./ProductCard";
import Pagination from "../blog/Pagination";

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
              <div className="block lg:hidden w-full mt-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
                  <h5 className="text-title font-['Epilogue',sans-serif] text-lg sm:text-xl font-bold relative pb-3 mb-6 capitalize">
                    Recent Products
                    <span className="absolute bottom-0 left-0 h-0.5 w-16 sm:w-20 bg-theme"></span>
                  </h5>
                  <div className="space-y-4 sm:space-y-5">
                    {RECENT_PRODUCTS.map((product, index) => (
                      <div
                        key={index}
                        className="p-4 sm:p-5 border border-gray-200 rounded-xl flex  items-center gap-4 sm:gap-5 transition-all duration-300 hover:border-theme hover:shadow-md hover:-translate-y-0.5"
                      >
                        <div className="shrink-0">
                          <Image
                            src={product.image}
                            alt={product.title}
                            width={70}
                            height={70}
                            className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-full"
                            unoptimized={true}
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <Link
                            href="/shop-details"
                            className="text-title font-['Roboto',sans-serif] text-sm sm:text-base font-normal hover:text-theme transition-colors duration-300 block mb-2 line-clamp-2"
                          >
                            {product.title}
                          </Link>
                          <div className="mb-2">
                            <Image
                              src={product.rating}
                              alt="rating"
                              width={80}
                              height={16}
                              className="h-3 sm:h-4"
                              unoptimized={true}
                            />
                          </div>
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-theme font-['Epilogue',sans-serif] text-sm sm:text-base font-bold">
                              ${product.offerPrice}
                            </span>
                            <span className="text-text font-['Epilogue',sans-serif] text-xs sm:text-sm font-medium line-through opacity-60">
                              ${product.regularPrice}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
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

