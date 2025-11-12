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
  const [activeHeader, setActiveHeader] = useState(null); // لتتبع آخر header تم عمل hover عليه
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

  const handleCartClick = (headerId) => {
    setActiveHeader(headerId);
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    // Toggle cart - إذا كان مفتوح يغلق، وإذا كان مغلق يفتح
    setIsCartOpen((prev) => !prev);
    // إلغاء focus بعد click لتجنب ظهور border
    if (document.activeElement) {
      document.activeElement.blur();
    }
  };

  const handleCartMouseEnter = (headerId) => {
    setActiveHeader(headerId); // تحديث آخر header تم عمل hover عليه
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    setIsCartOpen(true);
  };

  const handleCartMouseLeave = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }
    cartTimeoutRef.current = setTimeout(() => {
      setIsCartOpen(false);
      cartTimeoutRef.current = null;
      setActiveHeader(null); // إعادة تعيين عند الإغلاق
    }, 300);
  };

  const handleMenuClick = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
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
      setIsScrolled(scrollTop > 150);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      {/* Header الأول - يظهر فقط عند التحميل ويختفي عند السكرول */}
      <header
        className={`w-full hidden lg:block bg-white z-100 transition-all duration-300 ${isScrolled
          ? "lg:-translate-y-full "
          : "relative"
          }`}
      >
        {/* Logo and Navigation */}
        <div className="flex items-stretch bg-bg3">
          {/* Logo Section */}
          <div className="w-1/5 relative flex items-center justify-center cursor-pointer overflow-visible self-stretch">
            {/* decorative shape خلف اللوغو */}
            <div
              className="absolute top-0 left-0 h-full w-[calc(100%+90px)] bg-bg3 z-10
              [clip-path:polygon(0_0,100%_0,calc(100%-80px)_100%,0_100%)]"
              aria-hidden="true"
            />

            {/* اللوغو نفسو فوق الشكل */}
            <Link href="/" className="relative z-20 transform">
              <Image
                src={`/img/logo/mainlogo.png`}
                alt="logo"
                width={100}
                height={100}
                className="w-24 h-auto object-cover"
              />
            </Link>
          </div>

          {/* القسم اليميني كامل */}
          <div className="flex-1 flex flex-col">
            {/* Top Bar */}
            <div className="py-1 pl-26 pr-16  bg-theme3 flex justify-between items-center text-lg text-white">
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
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300"
                >
                  <Facebook className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
                </a>
                <a
                  href="https://twitter.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our Twitter page"
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300"
                >
                  <Twitter className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
                </a>
                <a
                  href="https://youtube.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our YouTube channel"
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300"
                >
                  <Youtube className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
                </a>
                <a
                  href="https://linkedin.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Visit our LinkedIn page"
                  className="w-9 h-9 border border-white/20 rounded group flex items-center justify-center hover:bg-white hover:border-theme3 transition-all duration-300"
                >
                  <Linkedin className="w-4 h-4 text-white group-hover:text-theme3 transition-colors duration-300" />
                </a>
              </div>
            </div>
            {/* Navigation */}
            <nav className="w-full flex justify-between items-center md:w-auto py-5 px-10 bg-bgimg text-white">
              <ul className="flex justify-around items-center font-medium w-full">
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/"
                    className="hover:text-theme3 transition-colors duration-300 cursor-pointer"
                  >
                    Home
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/shop"
                    className="hover:text-theme3 transition-colors duration-300 cursor-pointer"
                  >
                    Shop
                  </Link>
                </li>

                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/blog"
                    className="hover:text-theme3 transition-colors duration-300 cursor-pointer"
                  >
                    Blog
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/contact-us"
                    className="hover:text-theme3 transition-colors duration-300 cursor-pointer"
                  >
                    Contact Us
                  </Link>
                </li>
                <li className="transition-all duration-300 hover:translate-x-1">
                  <Link
                    href="/about-us"
                    className="hover:text-theme3 transition-colors duration-300 cursor-pointer"
                  >
                    About US
                  </Link>
                </li>
              </ul>

              {/* search and cart */}
              <div className="flex items-center gap-8 mr-5">
                {/* Search Icon */}
                <button
                  onClick={handleSearchClick}
                  aria-label="Open search"
                  className="focus:outline-none focus:ring-2 focus:ring-theme2 focus:ring-offset-2 focus:ring-offset-title rounded cursor-pointer"
                >
                  <Search
                    className="h-6 w-6 text-text hover:text-theme3 transition-colors duration-300"
                    strokeWidth={2}
                  />
                </button>
                {/* Cart Icon with Badge */}
                <div
                  className="relative"
                  onMouseEnter={() => handleCartMouseEnter("header1")}
                  onMouseLeave={handleCartMouseLeave}
                >
                  <button
                    onClick={() => handleCartClick("header1")}
                    aria-label={`Open cart with ${cartCount} items`}
                    className="outline-none focus:outline-none rounded cursor-pointer relative"
                  >
                    <ShoppingCart
                      className="h-6 w-6 text-text hover:text-theme3 transition-colors duration-300"
                      strokeWidth={2}
                    />
                    {cartCount > 0 && (
                      <span className="absolute -top-2 -right-2 bg-theme2 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {cartCount}
                      </span>
                    )}
                  </button>
                  {/* CartDropdown يظهر فقط إذا كان Header الأول هو النشط وكان ظاهر */}
                  {activeHeader === "header1" && !isScrolled && (
                    <CartDropdown
                      cartOpen={isCartOpen}
                      setCartOpen={setIsCartOpen}
                      cartItems={cartItems}
                    />
                  )}
                </div>
                {/* Menu Icon */}
                <button
                  onClick={handleMenuClick}
                  aria-label="Open sidebar menu"
                  className="focus:outline-none focus:ring-2 focus:ring-theme2 focus:ring-offset-2 focus:ring-offset-title rounded cursor-pointer"
                >
                  <Menu
                    className="h-6 w-6 text-text hover:text-theme3 transition-colors duration-300"
                    strokeWidth={2}
                  />
                </button>
              </div>
            </nav>
          </div>
        </div>
      </header>

      {/* Header الثاني - يظهر دائماً على الأجهزة الصغيرة، وعند السكرول على الشاشات الكبيرة */}
      <header
        className={`fixed top-0 left-0 right-0 w-full bg-bgimg z-100 transition-transform duration-300 shadow-sm ${
          // للأجهزة الصغيرة: يظهر دائماً (translate-y-0)
          // للشاشات الكبيرة: يظهر فقط عند السكرول
          isScrolled ? "translate-y-0" : "translate-y-0 lg:-translate-y-full"
          }`}
      >
        <div className="container mx-auto flex flex-row items-center justify-between gap-4 lg:gap-8 px-4 sm:px-6 lg:px-8 xl:px-12 py-3 lg:py-4 w-full">
          {/* Logo Section */}
          <div className="flex items-center justify-start shrink-0 lg:ml-10">
            <Link href="/" className="flex items-center">
              <Image
                src="/img/logo/mainlogo.png"
                alt="logo"
                width={120}
                height={120}
                className="h-12 sm:h-14 lg:h-16 xl:h-20 w-auto object-contain transition-transform duration-300 hover:scale-105"
                unoptimized={true}
              />
            </Link>
          </div>

          {/* Navigation - للشاشات الكبيرة فقط */}
          <nav className="hidden lg:flex flex-1 justify-center">
            <ul className="flex items-center gap-8 xl:gap-12 font-medium text-white">
              <li>
                <Link
                  href="/"
                  className="text-sm xl:text-base hover:text-theme3 transition-colors duration-300 cursor-pointer relative group"
                >
                  Home

                </Link>
              </li>
              <li>
                <Link
                  href="/shop"
                  className="text-sm xl:text-base hover:text-theme3 transition-colors duration-300 cursor-pointer relative group"
                >
                  Shop

                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-sm xl:text-base hover:text-theme3 transition-colors duration-300 cursor-pointer relative group"
                >
                  Blog

                </Link>
              </li>
              <li>
                <Link
                  href="/contact-us"
                  className="text-sm xl:text-base hover:text-theme3 transition-colors duration-300 cursor-pointer relative group"
                >
                  Contact Us

                </Link>
              </li>
              <li>
                <Link
                  href="/about-us"
                  className="text-sm xl:text-base hover:text-theme3 transition-colors duration-300 cursor-pointer relative group"
                >
                  About US

                </Link>
              </li>
            </ul>
          </nav>

          {/* Icons */}
          <div className="flex items-center gap-3 sm:gap-4 lg:gap-5 xl:gap-6 shrink-0">
            {/* Search Icon */}
            <button
              onClick={handleSearchClick}
              aria-label="Open search"
              className="flex items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme focus:ring-offset-2 focus:ring-offset-bgimg cursor-pointer hover:bg-white/10 transition-all duration-300"
            >
              <Search
                className="h-5 w-5 sm:h-6 sm:w-6 text-white hover:text-theme3 transition-colors duration-300"
                strokeWidth={2}
              />
            </button>

            {/* Cart Icon with Badge */}
            <div
              className="relative flex items-center"
              onMouseEnter={() => handleCartMouseEnter("header2")}
              onMouseLeave={handleCartMouseLeave}
            >
              <button
                onClick={() => handleCartClick("header2")}
                aria-label={`Open cart with ${cartCount} items`}
                className="flex items-center justify-center p-2 rounded-lg outline-none focus:outline-none focus:ring-2 focus:ring-theme3 focus:ring-offset-2 focus:ring-offset-bgimg cursor-pointer relative hover:bg-white/10 transition-all duration-300"
              >
                <ShoppingCart
                  className="h-5 w-5 sm:h-6 sm:w-6 text-white hover:text-theme3 transition-colors duration-300"
                  strokeWidth={2}
                />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-theme3 text-white text-xs rounded-full w-5 h-5 lg:w-6 lg:h-6 flex items-center justify-center font-bold shadow-lg">
                    {cartCount}
                  </span>
                )}
              </button>
              {/* CartDropdown يظهر فقط إذا كان Header الثاني هو النشط */}
              {activeHeader === "header2" && (
                <CartDropdown
                  cartOpen={isCartOpen}
                  setCartOpen={setIsCartOpen}
                  cartItems={cartItems}
                />
              )}
            </div>

            {/* Menu Icon */}
            <button
              onClick={handleMenuClick}
              aria-label="Open sidebar menu"
              className="flex items-center justify-center p-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-theme2 focus:ring-offset-2 focus:ring-offset-bgimg cursor-pointer hover:bg-white/10 transition-all duration-300"
            >
              <Menu
                className="h-5 w-5 sm:h-6 sm:w-6 text-white hover:text-theme3 transition-colors duration-300"
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
