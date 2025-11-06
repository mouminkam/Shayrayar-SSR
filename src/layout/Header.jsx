"use client";
import Image from "next/image";
import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import {
  Search,
  ShoppingCart,
  Menu,
  Facebook,
  Twitter,
  Youtube,
  Linkedin,
} from "lucide-react";
import SearchModal from "../components/layout/header/SearchModal";
import CartDropdown from "../components/layout/header/CartDropdown";
import Sidebar from "../components/layout/header/Sidebar";

const FreshHeatHeader = () => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const cartTimeoutRef = useRef(null);

  // Sample cart items - يمكن استبدالها بـ state management أو context
  const cartItems = [
    {
      id: 1,
      name: "Fried Chicken",
      price: 80.0,
      quantity: 1,
      image: "/img/blog/blogRecentThumb3_1.png",
    },
    {
      id: 2,
      name: "Fried Noodles",
      price: 60.0,
      quantity: 1,
      image: "/img/blog/blogRecentThumb3_2.png",
    },
    {
      id: 3,
      name: "Special Pasta",
      price: 70.0,
      quantity: 1,
      image: "/img/blog/blogRecentThumb3_3.png",
    },
  ];

  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const handleSearchClick = () => {
    setIsSearchOpen(true);
  };

  const handleCartMouseEnter = (isHeaderActive) => {
    if (!isHeaderActive) return;
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    setIsCartOpen(true);
  };

  const handleCartMouseLeave = (isHeaderActive) => {
    if (!isHeaderActive) return;
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }
    cartTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
      cartTimeoutRef.current = null;
    }, 300);
  };

  const handleMenuClick = (isHeaderActive) => {
    if (isHeaderActive) {
      setIsMobileMenuOpen(!isMobileMenuOpen);
    }
  };

  // Cleanup timeout عند unmount
  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
    };
  }, []);

  // Scroll detection
  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header الأول - يظهر فقط عند التحميل ويختفي عند السكرول */}
      <header
        className={`w-full hidden lg:block bg-white border-b border-gray-200 transition-all duration-300 ${
          isScrolled
            ? "lg:fixed lg:-translate-y-full lg:top-0 lg:z-40"
            : "relative"
        }`}
      >
        {/* Logo and Navigation */}
        <div className="flex items-center">
          {/* Logo Section */}
          <div className="px-2 md:mb-0 w-1/4">
            <div className="p-5">
              <Image
                src="/img/logo/logo.svg"
                alt="logo"
                width={100}
                height={100}
                className="w-full h-full object-contain"
              />
            </div>
          </div>

          {/* القسم اليميني كامل */}
          <div className="w-full flex flex-col">
            {/* Top Bar */}
            <div className="py-2 pr-16 pl-10 bg-[#EB0029] flex justify-between items-center text-lg text-white">
              <div className="flex items-center">
                <span className="mr-2">©</span>
                <span>09:00 am - 06:00 pm</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="mr-2">FollowUs:</span>
                <a
                  href="https://facebook.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Facebook page"
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-[#EB0029] transition-all duration-300"
                >
                  <Facebook className="w-4 h-4 text-white group-hover:text-[#EB0029] transition-colors duration-300" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Twitter page"
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-[#EB0029] transition-all duration-300"
                >
                  <Twitter className="w-4 h-4 text-white group-hover:text-[#EB0029] transition-colors duration-300" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our YouTube channel"
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-[#EB0029] transition-all duration-300"
                >
                  <Youtube className="w-4 h-4 text-white group-hover:text-[#EB0029] transition-colors duration-300" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our LinkedIn page"
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-[#EB0029] transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4 text-white group-hover:text-[#EB0029] transition-colors duration-300" />
                </a>
              </div>
            </div>
            {/* Navigation */}
            <nav className="w-full flex justify-between items-center md:w-auto py-8 px-10 bg-[#010F1C] text-white">
              <ul className="flex flex-wrap justify-center md:justify-start gap-10 font-medium">
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/"
                    className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                  >
                    Home
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/about"
                    className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                  >
                    AboutUs
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/shop"
                    className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                  >
                    Shop
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/pages"
                    className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                  >
                    Pages
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/blog"
                    className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                  >
                    Blog
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/contact"
                    className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                  >
                    ContactUs
                  </Link>
                </li>
              </ul>

              {/* search and cart */}
              <div className="flex items-center gap-8 mr-5">
                {/* Search Icon */}
                <button
                  onClick={handleSearchClick}
                  aria-label="Open search"
                  className="focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded cursor-pointer"
                >
                  <Search
                    className="h-6 w-6 text-gray-400 hover:text-[#EB0029] transition-colors duration-300"
                    strokeWidth={2}
                  />
                </button>
                {/* Cart Icon with Badge */}
                <div
                  className="relative"
                  onMouseEnter={() => handleCartMouseEnter(!isScrolled)}
                  onMouseLeave={() => handleCartMouseLeave(!isScrolled)}
                >
                  <button
                    aria-label={`Open cart with ${cartCount} items`}
                    className={`focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded ${
                      !isScrolled
                        ? "cursor-pointer"
                        : "cursor-not-allowed opacity-50"
                    }`}
                    disabled={isScrolled}
                  >
                    <ShoppingCart
                      className="h-6 w-6 text-gray-400 hover:text-[#EB0029] transition-colors duration-300"
                      strokeWidth={2}
                    />
                  </button>
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-[#FC791A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {cartCount}
                    </span>
                  )}
                  {!isScrolled && (
                    <CartDropdown
                      cartOpen={isCartOpen}
                      setCartOpen={setIsCartOpen}
                      cartItems={cartItems}
                    />
                  )}
                </div>
                {/* Menu Icon */}
                <button
                  onClick={() => handleMenuClick(!isScrolled)}
                  aria-label="Open mobile menu"
                  className={`focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black rounded ${
                    !isScrolled
                      ? "cursor-pointer"
                      : "cursor-not-allowed opacity-50"
                  }`}
                  disabled={isScrolled}
                >
                  <Menu
                    className="h-6 w-6 text-gray-400 hover:text-[#EB0029] transition-colors duration-300"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Header الثاني - يظهر دائماً على الأجهزة المتوسطة والصغيرة، وعند السكرول على الشاشات الكبيرة */}
      {/* Version للشاشات المتوسطة والصغيرة - يظهر دائماً */}
      <header className="block lg:hidden fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 z-50">
        <div className="mx-auto flex flex-row items-center justify-between gap-4 px-4 py-4 w-full">
          {/* Logo Section */}
          <div className="flex items-center min-w-[100px]">
            <Image
              src="/img/logo/logo.svg"
              alt="logo"
              width={100}
              height={40}
              className="h-10 w-auto object-contain"
            />
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4 shrink-0">
            {/* Search Icon */}
            <button
              onClick={handleSearchClick}
              aria-label="Open search"
              className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded cursor-pointer"
            >
              <Search
                className="h-5 w-5 text-gray-600 hover:text-[#EB0029] transition-colors duration-300"
                strokeWidth={2}
              />
            </button>

            {/* Cart Icon with Badge */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => handleCartMouseEnter(true)}
              onMouseLeave={() => handleCartMouseLeave(true)}
            >
              <button
                aria-label={`Open cart with ${cartCount} items`}
                className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded cursor-pointer"
              >
                <ShoppingCart
                  className="h-5 w-5 text-gray-600 hover:text-[#EB0029] transition-colors duration-300"
                  strokeWidth={2}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FC791A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              <CartDropdown
                cartOpen={isCartOpen}
                setCartOpen={setIsCartOpen}
                cartItems={cartItems}
              />
            </div>

            {/* Menu Icon */}
            <button
              onClick={() => handleMenuClick(true)}
              aria-label="Open mobile menu"
              className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded cursor-pointer"
            >
              <Menu
                className="h-5 w-5 text-gray-600 hover:text-[#EB0029] transition-colors duration-300"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Header الثاني - Version للشاشات الكبيرة - يظهر عند السكرول */}
      <header
        className={`hidden lg:block fixed top-0 left-0 right-0 w-full bg-white border-b border-gray-200 z-50 transition-transform duration-300 ${
          isScrolled ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="mx-auto flex flex-row items-center justify-between gap-10 px-15 py-4 w-full">
          {/* Logo Section */}
          <div className="flex items-center min-w-[120px]">
            <Image
              src="/img/logo/logo.svg"
              alt="logo"
              width={120}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </div>

          {/* Navigation */}
          <nav className="flex-1 flex justify-center">
            <ul className="flex items-center gap-8 font-medium text-gray-900">
              <li>
                <Link
                  href="/"
                  className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/about"
                  className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                >
                  Shop
                </Link>
              </li>
              <li>
                <Link
                  href="/pages"
                  className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                >
                  Pages
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-[#EB0029] transition-colors duration-300 cursor-pointer"
                >
                  Contact Us
                </Link>
              </li>
            </ul>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-6 shrink-0">
            {/* Search Icon */}
            <button
              onClick={handleSearchClick}
              aria-label="Open search"
              className="flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded cursor-pointer"
            >
              <Search
                className="h-5 w-5 text-gray-600 hover:text-[#EB0029] transition-colors duration-300"
                strokeWidth={2}
              />
            </button>

            {/* Cart Icon with Badge */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => handleCartMouseEnter(isScrolled)}
              onMouseLeave={() => handleCartMouseLeave(isScrolled)}
            >
              <button
                aria-label={`Open cart with ${cartCount} items`}
                className={`flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded ${
                  isScrolled
                    ? "cursor-pointer"
                    : "cursor-not-allowed opacity-50"
                }`}
                disabled={!isScrolled}
              >
                <ShoppingCart
                  className="h-5 w-5 text-gray-600 hover:text-[#EB0029] transition-colors duration-300"
                  strokeWidth={2}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-[#FC791A] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                    {cartCount}
                  </span>
                )}
              </button>
              {isScrolled && (
                <CartDropdown
                  cartOpen={isCartOpen}
                  setCartOpen={setIsCartOpen}
                  cartItems={cartItems}
                />
              )}
            </div>

            {/* Menu Icon */}
            <button
              onClick={() => handleMenuClick(isScrolled)}
              aria-label="Open mobile menu"
              className={`flex items-center justify-center focus:outline-none focus:ring-2 focus:ring-orange-500 rounded ${
                isScrolled
                  ? "cursor-pointer"
                  : "cursor-not-allowed opacity-50"
              }`}
              disabled={!isScrolled}
            >
              <Menu
                className="h-5 w-5 text-gray-600 hover:text-[#EB0029] transition-colors duration-300"
                strokeWidth={2}
              />
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar - Fixed في كل الحالات */}
      <Sidebar isOpen={isMobileMenuOpen} setIsOpen={setIsMobileMenuOpen} />

      {/* Search Modal - Fixed في كل الحالات */}
      <SearchModal searchOpen={isSearchOpen} setSearchOpen={setIsSearchOpen} />
    </>
  );
};

export default FreshHeatHeader;
