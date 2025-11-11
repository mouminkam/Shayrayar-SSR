"use client";
import { useState, useCallback, useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

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
  const priceRange = useMemo(() => {
    const range = MAX_PRICE - MIN_PRICE || 1;
    // Ensure min and max maintain minimum gap for display
    const adjustedMin = Math.min(minPrice, maxPrice - MIN_GAP);
    const adjustedMax = Math.max(maxPrice, minPrice + MIN_GAP);
    return {
      minPercent: ((adjustedMin - MIN_PRICE) / range) * 100,
      maxPercent: ((adjustedMax - MIN_PRICE) / range) * 100,
    };
  }, [minPrice, maxPrice, MIN_GAP]);

  // Handle min price change
  const handleMinPriceChange = useCallback((value) => {
    const numValue = clamp(value, MIN_PRICE, MAX_PRICE);
    // Ensure min doesn't exceed max - MIN_GAP
    const adjustedValue = Math.min(numValue, maxPrice - MIN_GAP);
    setMinPrice(adjustedValue);
  }, [maxPrice, MIN_GAP]);

  // Handle max price change
  const handleMaxPriceChange = useCallback((value) => {
    const numValue = clamp(value, MIN_PRICE, MAX_PRICE);
    // Ensure max doesn't go below min + MIN_GAP
    const adjustedValue = Math.max(numValue, minPrice + MIN_GAP);
    setMaxPrice(adjustedValue);
  }, [minPrice, MIN_GAP]);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    // TODO: Implement search functionality
    console.log("Search:", searchQuery);
  }, [searchQuery]);

  // Handle filter
  const handleFilter = useCallback((e) => {
    e.preventDefault();
    // TODO: Implement filter functionality
    console.log("Filter:", { minPrice, maxPrice });
  }, [minPrice, maxPrice]);

  return (
    <aside className="main-sidebar space-y-6 lg:space-y-8">
      {/* Search Widget */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <h5 className="text-title font-['Epilogue',sans-serif] text-lg sm:text-xl font-bold relative pb-3 mb-6 capitalize">
          Search
          <span className="absolute bottom-0 left-0 h-0.5 w-16 sm:w-20 bg-theme"></span>
        </h5>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bg2 text-sm sm:text-base px-4 sm:px-5 py-3 rounded-lg border-none outline-none text-text font-['Roboto',sans-serif] pr-12 sm:pr-16 focus:ring-2 focus:ring-theme/20 transition-all"
          />
          <button
            type="submit"
            className="absolute right-0 top-0 h-full w-12 sm:w-16 bg-transparent text-title hover:bg-theme hover:text-white rounded-r-lg transition-all duration-300 flex items-center justify-center"
            aria-label="Search"
          >
            <Search className="w-4 h-4 sm:w-5 sm:h-5" />
          </button>
        </form>
      </div>

      {/* Categories Widget */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm">
        <h5 className="text-title font-['Epilogue',sans-serif] text-lg sm:text-xl font-bold relative pb-3 mb-6 capitalize">
          Categories
          <span className="absolute bottom-0 left-0 h-0.5 w-16 sm:w-20 bg-theme"></span>
        </h5>
        <ul className="flex flex-wrap gap-2 sm:gap-3">
          {CATEGORIES.map((category, index) => (
            <li key={index}>
              <Link
                href={category.href}
                className="inline-flex px-3 sm:px-4 py-2 sm:py-2.5 bg-bg2 text-title font-['Epilogue',sans-serif] text-xs sm:text-sm font-normal capitalize rounded-lg transition-all duration-300 hover:bg-theme hover:text-white active:scale-95"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter Widget */}
      <div className="bg-white p-5 sm:p-6 lg:p-8 rounded-2xl shadow-sm">
        <h5 className="text-title font-['Epilogue',sans-serif] text-base sm:text-lg lg:text-xl font-bold relative pb-2 sm:pb-3 mb-4 sm:mb-6 capitalize">
          Filter By Price
          <span className="absolute bottom-0 left-0 h-0.5 w-14 sm:w-16 lg:w-20 bg-theme"></span>
        </h5>

        {/* Price Range Slider */}
        <div className="mb-5 sm:mb-6">
          <div className="relative h-1 bg-gray-200 rounded-full">
            {/* Progress bar */}
            <div
              className="absolute h-full bg-theme rounded-full"
              style={{
                left: `${priceRange.minPercent}%`,
                width: `${priceRange.maxPercent - priceRange.minPercent}%`,
              }}
            ></div>
          </div>

          {/* Range inputs - Simplified with just circles */}
          <div className="relative mt-5 h-6">
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={1}
              value={minPrice}
              onChange={(e) => handleMinPriceChange(e.target.value)}
              className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer z-20 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme [&::-webkit-slider-thumb]:border-2 
                [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-none [&::-webkit-slider-thumb]:cursor-pointer 
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-theme [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white 
                [&::-moz-range-thumb]:shadow-none [&::-moz-range-thumb]:cursor-pointer"
            />
            <input
              type="range"
              min={MIN_PRICE}
              max={MAX_PRICE}
              step={1}
              value={maxPrice}
              onChange={(e) => handleMaxPriceChange(e.target.value)}
              className="absolute w-full h-1 bg-transparent appearance-none cursor-pointer z-10 
                [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 
                [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-theme [&::-webkit-slider-thumb]:border-2 
                [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-none [&::-webkit-slider-thumb]:cursor-pointer 
                [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full 
                [&::-moz-range-thumb]:bg-theme [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white 
                [&::-moz-range-thumb]:shadow-none [&::-moz-range-thumb]:cursor-pointer"
            />
          </div>
        </div>

        {/* Price Inputs */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 sm:gap-4">
            {/* Min Price */}
            <div className="flex items-center gap-2 flex-1">
              <span className="text-title font-medium text-xs sm:text-sm lg:text-base whitespace-nowrap">Price:</span>
              <div className="flex items-center gap-1.5 flex-1 min-w-0">
                <span className="text-title font-semibold text-sm sm:text-base">$</span>
                <input
                  type="number"
                  min={MIN_PRICE}
                  max={MAX_PRICE}
                  value={minPrice}
                  onChange={(e) => handleMinPriceChange(e.target.value)}
                  className="flex-1 min-w-0 max-w-[90px] bg-bg2 px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-title font-semibold text-sm sm:text-base text-center outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all"
                />
              </div>
            </div>

            {/* Separator */}
            <span className="text-title font-semibold text-base sm:text-lg lg:text-xl self-center">-</span>

            {/* Max Price */}
            <div className="flex items-center gap-1.5 flex-1 min-w-0">
              <span className="text-title font-semibold text-sm sm:text-base">$</span>
              <input
                type="number"
                min={MIN_PRICE}
                max={MAX_PRICE}
                value={maxPrice}
                onChange={(e) => handleMaxPriceChange(e.target.value)}
                className="flex-1 min-w-0 max-w-[90px] bg-bg2 px-2 sm:px-3 py-2 rounded-lg border border-gray-200 text-title font-semibold text-sm sm:text-base text-center outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all"
              />
            </div>
          </div>

          {/* Filter Button */}
          <button
            onClick={handleFilter}
            className="w-full py-2.5 sm:py-3 lg:py-3.5 bg-theme text-white font-['Epilogue',sans-serif] text-xs sm:text-sm lg:text-base font-bold uppercase rounded-lg transition-all duration-300 hover:bg-theme2 hover:scale-[1.02] active:scale-[0.98] shadow-sm hover:shadow-md focus:outline-none focus:ring-2 focus:ring-theme/50"
          >
            Filter
          </button>
        </div>
      </div>

      {/* Recent Products Widget - Desktop Only */}
      <div className="hidden lg:block bg-white p-5 lg:p-6 xl:p-8 rounded-2xl shadow-sm">
        <h5 className="text-title font-['Epilogue',sans-serif] text-base lg:text-lg xl:text-xl font-bold relative pb-2 lg:pb-3 mb-4 lg:mb-6 capitalize">
          Recent Products
          <span className="absolute bottom-0 left-0 h-0.5 w-14 lg:w-16 xl:w-20 bg-theme"></span>
        </h5>
        <div className="space-y-3 lg:space-y-4 xl:space-y-5">
          {RECENT_PRODUCTS.map((product, index) => (
            <div
              key={index}
              className="p-3 lg:p-4 xl:p-5 border border-gray-200 rounded-xl flex flex-col xl:flex-row xl:items-center gap-3 lg:gap-4 xl:gap-5 transition-all duration-300 hover:border-theme hover:shadow-md hover:-translate-y-0.5 text-center xl:text-left"
            >
              <div className="shrink-0 flex justify-center xl:justify-start">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={70}
                  height={70}
                  className="w-14 h-14 lg:w-16 lg:h-16 xl:w-20 xl:h-20 object-cover rounded-full"
                  unoptimized={true}
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href="/shop-details"
                  className="text-title font-['Roboto',sans-serif] text-xs lg:text-sm xl:text-base font-normal hover:text-theme transition-colors duration-300 block mb-1.5 lg:mb-2 line-clamp-2"
                >
                  {product.title}
                </Link>
                <div className="mb-1.5 lg:mb-2 flex justify-center xl:justify-start">
                  <Image
                    src={product.rating}
                    alt="rating"
                    width={80}
                    height={16}
                    className="h-3 lg:h-3.5 xl:h-4"
                    unoptimized={true}
                  />
                </div>
                <div className="flex items-center justify-center xl:justify-start gap-1.5 lg:gap-2 flex-wrap">
                  <span className="text-theme font-['Epilogue',sans-serif] text-xs lg:text-sm xl:text-base font-bold">
                    ${product.offerPrice}
                  </span>
                  <span className="text-text font-['Epilogue',sans-serif] text-[10px] lg:text-xs xl:text-sm font-medium line-through opacity-60">
                    ${product.regularPrice}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}
