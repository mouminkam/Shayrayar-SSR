"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search } from "lucide-react";

export default function ShopSidebar() {
  const [searchQuery, setSearchQuery] = useState("");
  const [minPrice, setMinPrice] = useState(100);
  const [maxPrice, setMaxPrice] = useState(1000);

  const categories = [
    { name: "Cheese", href: "/shop" },
    { name: "Cocktail", href: "/shop" },
    { name: "Drink", href: "/shop" },
    { name: "Uncategorized", href: "/shop" },
    { name: "Pizza", href: "/shop" },
    { name: "Non Veg", href: "/shop" },
  ];

  const recentProducts = [
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

  const handleSearch = (e) => {
    e.preventDefault();
    console.log("Search:", searchQuery);
  };

  const handleFilter = (e) => {
    e.preventDefault();
    console.log("Filter:", { minPrice, maxPrice });
  };

  return (
    <div className="main-sidebar">
      {/* Search Widget */}
      <div className="single-sidebar-widget bg-white p-8 sm:p-10 rounded-2xl mb-8">
        <h5 className="widget-title text-title font-['Epilogue',sans-serif] text-xl font-bold relative pb-2 mb-6 capitalize">
          Search
          <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme"></span>
        </h5>
        <div className="search-widget">
          <form onSubmit={handleSearch} className="relative">
            <input
              type="text"
              placeholder="Search here"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg2 text-sm sm:text-base px-5 py-3 rounded-lg border-none outline-none text-text font-['Roboto',sans-serif] pr-16"
            />
            <button
              type="submit"
              className="absolute right-0 top-0 w-16 sm:w-20 h-full bg-transparent text-title hover:bg-theme hover:text-white rounded-r-lg transition-all duration-300 flex items-center justify-center"
            >
              <Search className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>

      {/* Categories Widget */}
      <div className="single-sidebar-widget bg-white p-8 sm:p-10 rounded-2xl mb-8">
        <h5 className="widget-title text-title font-['Epilogue',sans-serif] text-xl font-bold relative pb-2 mb-6 capitalize">
          Categories
          <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme"></span>
        </h5>
        <ul className="tagcloud flex items-center flex-wrap gap-2">
          {categories.map((category, index) => (
            <li key={index}>
              <Link
                href={category.href}
                className="inline-flex px-4 py-2.5 bg-bg2 text-title font-['Epilogue',sans-serif] text-sm font-normal capitalize rounded transition-all duration-300 hover:bg-theme hover:text-white"
              >
                {category.name}
              </Link>
            </li>
          ))}
        </ul>
      </div>

      {/* Price Filter Widget */}
      <div className="single-sidebar-widget bg-white p-8 sm:p-10 rounded-2xl mb-8">
        <h5 className="widget-title text-title font-['Epilogue',sans-serif] text-xl font-bold relative pb-2 mb-6 capitalize">
          Filter By Price
          <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme"></span>
        </h5>
        <div className="range__barcustom">
          <div className="slider h-2 bg-title rounded-md relative mb-6">
            <div
              className="progress h-full bg-theme rounded-md absolute"
              style={{
                left: `${(minPrice / 10000) * 100}%`,
                right: `${100 - (maxPrice / 10000) * 100}%`,
              }}
            ></div>
          </div>
          <div className="range-input relative flex justify-center">
            <input
              type="range"
              className="range-min absolute w-full h-2 top-[-8px] bg-transparent pointer-events-none appearance-none"
              min="0"
              max="10000"
              value={minPrice}
              onChange={(e) => setMinPrice(Number(e.target.value))}
            />
            <input
              type="range"
              className="range-max absolute w-full h-2 top-[-8px] bg-transparent pointer-events-none appearance-none"
              min="0"
              max="10000"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
            />
          </div>
          <div className="price-input mt-4">
            <div className="price-wrapper flex items-center gap-2 flex-wrap">
              <div className="field flex items-center text-lg">
                <span className="text-title font-medium">Price:</span>
              </div>
              <div className="field flex items-center text-lg">
                <span className="text-title font-medium">$</span>
                <input
                  type="number"
                  className="input-min w-16 h-full outline-none bg-transparent border-none text-base font-medium text-title p-0"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                />
              </div>
              <div className="separators text-2xl leading-10 font-medium text-title">-</div>
              <div className="field flex items-center text-lg">
                <span className="text-title font-medium">$</span>
                <input
                  type="number"
                  className="input-max w-16 h-full outline-none bg-transparent border-none text-base font-medium text-title p-0"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                />
              </div>
              <button
                onClick={handleFilter}
                className="filter-btn  py-2 bg-transparent text-title font-['Epilogue',sans-serif] text-base font-bold uppercase border border-gray-300 rounded transition-all duration-300 hover:bg-theme hover:text-white hover:border-theme mt-2 sm:mt-0"
              >
                Filter
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Products Widget */}
      <div className="single-sidebar-widget bg-white p-8 sm:p-10 rounded-2xl">
        <h5 className="widget-title text-title font-['Epilogue',sans-serif] text-xl font-bold relative pb-2 mb-6 capitalize">
          Recent Products
          <span className="absolute bottom-0 left-0 h-0.5 w-20 bg-theme"></span>
        </h5>
        <div className="recent-products">
          {recentProducts.map((product, index) => (
            <div
              key={index}
              className={`recent-box p-5 sm:p-6 border border-gray-200 rounded-xl flex items-center gap-5 mb-6 last:mb-0 transition-all duration-300 hover:border-theme hover:-translate-y-1 ${index !== recentProducts.length - 1 ? "" : ""
                }`}
            >
              <div className="recent-thumb shrink-0">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="w-20 h-20 object-cover rounded-full"
                  unoptimized={true}
                />
              </div>
              <div className="recent-content flex-1">
                <Link
                  href="/shop-details"
                  className="text-title font-['Roboto',sans-serif] text-base font-normal hover:text-theme transition-colors duration-300 block mb-2"
                >
                  {product.title}
                </Link>
                <div className="star mb-2">
                  <Image
                    src={product.rating}
                    alt="rating"
                    width={80}
                    height={16}
                    className="h-4"
                    unoptimized={true}
                  />
                </div>
                <div className="price flex items-center gap-2">
                  <div className="regular-price text-theme font-['Epilogue',sans-serif] text-base font-bold uppercase">
                    ${product.offerPrice}
                  </div>
                  <div className="offer-price text-text font-['Epilogue',sans-serif] text-base font-bold uppercase line-through">
                    ${product.regularPrice}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

