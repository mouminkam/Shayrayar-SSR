"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShoppingCart,
  User,
  Search,
  X,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { useState, useRef, useEffect } from "react";

export default function Header() {
  const pathname = usePathname();
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [hoveredDropdown, setHoveredDropdown] = useState(null);
  const cartRef = useRef(null);
  const headerRef = useRef(null);
  const dropdownRefs = useRef({});
  const hoverTimeoutRef = useRef(null);

  // Navigation items with proper links
  const navItems = [
    { name: "HOME", href: "/" },
    {
      name: "SHOP",
      href: "/category-page",
      dropdown: true,
      mega: true,
    },
    { name: "STORES", href: "/stores" },
    {
      name: "BLOG",
      href: "/blog",
      dropdown: true,
    },
    { name: "ABOUT", href: "/about-us" },
    { name: "CONTACT", href: "/contact-us" },
  ];

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (cartRef.current && !cartRef.current.contains(event.target)) {
        setCartOpen(false);
      }

      // Check if click is outside any dropdown
      const clickedInsideDropdown = Object.values(dropdownRefs.current).some(
        (ref) => ref && ref.contains(event.target)
      );

      if (!clickedInsideDropdown) {
        setHoveredDropdown(null);
        setActiveDropdown(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close search modal on Escape key
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") setSearchOpen(false);
    };

    if (searchOpen) {
      document.addEventListener("keydown", handleEscape);
      return () => document.removeEventListener("keydown", handleEscape);
    }
  }, [searchOpen]);

  // Handle hover for desktop dropdowns
  const handleDropdownHover = (itemName) => {
    if (window.innerWidth >= 1024) {
      // Clear any pending timeout
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
        hoverTimeoutRef.current = null;
      }
      setHoveredDropdown(itemName);
    }
  };

  const handleDropdownLeave = () => {
    if (window.innerWidth >= 1024) {
      // Small delay to allow mouse movement to dropdown
      hoverTimeoutRef.current = setTimeout(() => {
        setHoveredDropdown(null);
        hoverTimeoutRef.current = null;
      }, 150);
    }
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (hoverTimeoutRef.current) {
        clearTimeout(hoverTimeoutRef.current);
      }
    };
  }, []);

  // Mobile dropdown toggle
  const toggleDropdown = (itemName) => {
    setActiveDropdown(activeDropdown === itemName ? null : itemName);
  };

  // Check if nav item is active
  const isActive = (item) => {
    if (item.href === "/") {
      return pathname === "/";
    }
    if (item.dropdown && item.name === "SHOP") {
      return (
        pathname?.startsWith("/category-page") ||
        pathname?.startsWith("/product-page") ||
        pathname?.startsWith("/shoping-cart")
      );
    }
    if (item.dropdown && item.name === "BLOG") {
      return pathname?.startsWith("/blog");
    }
    return pathname?.startsWith(item.href);
  };

  return (
    <>
      {/* Header with fixed positioning */}
      <header
        ref={headerRef}
        className="w-full py-4  lg:py-6 bg-white fixed top-0 left-0 right-0 z-[99999] overflow-visible"
        style={{
          boxShadow: "0 2px 16px 0 rgba(0,0,0,0.04)",
        }}
      >
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between lg:mx-12">
            {/* Logo - Left */}
            <div className="shrink-0 z-10">
              <Link
                href="/"
                className="text-xl md:text-2xl font-bold tracking-widest text-gray-900 hover:text-gray-700 transition-colors"
              >
                J E W E L R Y
              </Link>
            </div>

            {/* Desktop Navigation - Center */}
            <nav className="hidden lg:flex items-center gap-8 xl:gap-10 absolute left-1/2 transform -translate-x-1/2">
              {navItems.map((item) => (
                <div
                  key={item.name}
                  className="relative group"
                  onMouseEnter={() =>
                    item.dropdown && handleDropdownHover(item.name)
                  }
                  onMouseLeave={handleDropdownLeave}
                  ref={(el) => {
                    if (item.dropdown) {
                      dropdownRefs.current[item.name] = el;
                    }
                  }}
                >
                  {item.dropdown ? (
                    <Link
                      href={item.href}
                      className={`relative flex items-center text-sm font-medium uppercase tracking-wide transition-all duration-300 pb-1 ${
                        isActive(item)
                          ? "text-orange-500"
                          : "text-gray-900 hover:text-orange-500"
                      }`}
                    >
                      {item.name}
                      <ChevronDown
                        className={`w-4 h-4 ml-1 transition-transform duration-300 ${
                          hoveredDropdown === item.name ? "rotate-180" : ""
                        }`}
                      />
                      {/* Hover underline effect */}
                      <span
                        className={`absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 ${
                          hoveredDropdown === item.name ? "w-full" : "w-0"
                        }`}
                      />
                    </Link>
                  ) : (
                    <Link
                      href={item.href}
                      className={`relative text-sm font-medium uppercase tracking-wide transition-all duration-300 pb-1 ${
                        isActive(item)
                          ? "text-orange-500"
                          : "text-gray-900 hover:text-orange-500"
                      }`}
                    >
                      {item.name}
                      {/* Hover underline effect */}
                      <span className="absolute bottom-0 left-0 h-0.5 bg-orange-500 transition-all duration-300 w-0 group-hover:w-full" />
                    </Link>
                  )}

                  {/* Shop Mega Dropdown */}
                  {item.mega &&
                    (hoveredDropdown === "SHOP" ||
                      activeDropdown === "SHOP") && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-[800px] bg-white shadow-2xl border border-gray-200 mt-2 p-8 animate-in fade-in slide-in-from-top-2 duration-200"
                        onMouseEnter={() => handleDropdownHover("SHOP")}
                        onMouseLeave={handleDropdownLeave}
                        ref={(el) => {
                          dropdownRefs.current["SHOP_DROPDOWN"] = el;
                        }}
                      >
                        <div className="flex gap-8">
                          {/* SHOP PAGES Column */}
                          <div className="w-1/4">
                            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase border-b border-gray-200 pb-2">
                              SHOP PAGES
                            </h3>
                            <ul className="space-y-3">
                              <li>
                                <Link
                                  href="/category-page"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  All Products
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/product-page"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Product Details
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/shoping-cart"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Shopping Cart
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/category-page"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Wishlist
                                </Link>
                              </li>
                            </ul>
                          </div>

                          {/* CATEGORIES Column */}
                          <div className="w-1/4">
                            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase border-b border-gray-200 pb-2">
                              CATEGORIES
                            </h3>
                            <ul className="space-y-3">
                              <li>
                                <Link
                                  href="/category-page"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Rings
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/category-page"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Necklaces
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/category-page"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Earrings
                                </Link>
                              </li>
                              <li>
                                <Link
                                  href="/category-page"
                                  className="text-gray-600 hover:text-orange-500 transition-colors duration-200 text-sm block py-1"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Bracelets
                                </Link>
                              </li>
                            </ul>
                          </div>

                          {/* SPECIAL OFFER Column */}
                          <div className="w-1/3">
                            <h3 className="font-semibold text-center text-gray-900 mb-0 text-sm uppercase border-b border-gray-200 pb-2">
                              SPECIAL OFFER
                            </h3>
                            <div className="p-6 text-center">
                              <span className="text-4xl font-bold uppercase w-full block mb-2 tracking-wide text-orange-500">
                                Sale 40%
                              </span>
                              <p className="text-xs mt-4 leading-relaxed text-gray-600">
                                Limited time offer
                                <br />
                                on selected jewelry items
                                <br />
                                Don&apos;t miss out!
                              </p>
                              <Link
                                href="/category-page"
                                className="text-base mt-5 uppercase hover:text-orange-500 transition-colors duration-300 inline-flex items-center justify-center text-gray-900 font-medium"
                                onClick={() => {
                                  setMobileMenuOpen(false);
                                  setActiveDropdown(null);
                                }}
                              >
                                Shop Now
                                <ChevronRight className="w-5 h-5 ml-2" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}

                  {/* Blog Dropdown */}
                  {item.name === "BLOG" &&
                    (hoveredDropdown === "BLOG" ||
                      activeDropdown === "BLOG") && (
                      <div
                        className="absolute top-full left-1/2 transform -translate-x-1/2 w-48 bg-white shadow-2xl border border-gray-200 mt-2 py-2 animate-in fade-in slide-in-from-top-2 duration-200"
                        onMouseEnter={() => handleDropdownHover("BLOG")}
                        onMouseLeave={handleDropdownLeave}
                        ref={(el) => {
                          dropdownRefs.current["BLOG_DROPDOWN"] = el;
                        }}
                      >
                        <Link
                          href="/blog"
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          All Posts
                        </Link>
                        <Link
                          href="/blog-detail"
                          className="block px-4 py-2 text-sm text-gray-600 hover:text-orange-500 hover:bg-gray-50 transition-colors duration-200"
                          onClick={() => {
                            setMobileMenuOpen(false);
                            setActiveDropdown(null);
                          }}
                        >
                          Post Details
                        </Link>
                      </div>
                    )}
                </div>
              ))}
            </nav>

            {/* Right Side Icons */}
            <div className="flex items-center gap-4 md:gap-6 lg:gap-10 shrink-0 z-10">
              {/* User Icon */}
              <Link
                href="/login"
                className="text-gray-700 hover:text-orange-500 transition-colors duration-300 hidden sm:block"
              >
                <User className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              </Link>
              {/* Cart Icon */}
              <div ref={cartRef} className="relative">
                <button
                  onClick={() => setCartOpen(!cartOpen)}
                  className="text-gray-700 hover:text-orange-500 transition-colors duration-300 relative"
                >
                  <ShoppingCart className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium">
                    2
                  </span>
                </button>

                {/* Cart Dropdown */}
                {cartOpen && (
                  <div className="absolute top-full right-0 z-[99999] w-72 md:w-80 bg-white shadow-2xl border border-gray-200 mt-4 p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-200">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-base md:text-lg font-medium text-gray-900">
                        Shopping Cart
                      </h3>
                      <button
                        onClick={() => setCartOpen(false)}
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-3 md:space-y-4 mb-4 max-h-64 overflow-y-auto">
                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0">
                            <span className="text-xs text-gray-600">💎</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Diamond Ring
                            </p>
                            <p className="text-sm text-gray-600">$230.00</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="flex items-center justify-between py-2 border-b border-gray-100">
                        <div className="flex items-center space-x-3 flex-1 min-w-0">
                          <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0">
                            <span className="text-xs text-gray-600">📿</span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-gray-900 truncate">
                              Gold Necklace
                            </p>
                            <p className="text-sm text-gray-600">$173.00</p>
                          </div>
                        </div>
                        <button className="text-gray-400 hover:text-red-500 transition-colors shrink-0 ml-2">
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-200">
                      <span className="text-gray-600 font-medium">Total:</span>
                      <span className="text-lg font-semibold text-gray-900">
                        $403.00
                      </span>
                    </div>

                    <div className="space-y-2">
                      <Link
                        href="/shoping-cart"
                        className="w-full bg-gray-900 text-white py-3 px-4 hover:bg-gray-800 transition-colors duration-300 text-sm font-medium block text-center"
                        onClick={() => setCartOpen(false)}
                      >
                        Checkout
                      </Link>
                      <Link
                        href="/shoping-cart"
                        className="w-full border border-gray-300 text-gray-700 py-3 px-4 hover:bg-gray-50 transition-colors duration-300 text-sm font-medium block text-center"
                        onClick={() => setCartOpen(false)}
                      >
                        View Cart
                      </Link>
                    </div>
                  </div>
                )}
              </div>
              {/* Search Icon */}
              <button
                onClick={() => setSearchOpen(true)}
                className="text-gray-700 hover:text-orange-500 transition-colors duration-300"
              >
                <Search className="w-5 h-5 md:w-6 md:h-6 lg:w-7 lg:h-7" />
              </button>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden flex flex-col space-y-1.5 p-1"
                aria-label="Toggle menu"
              >
                <span
                  className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                    mobileMenuOpen ? "rotate-45 translate-y-2" : ""
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                    mobileMenuOpen ? "opacity-0" : ""
                  }`}
                ></span>
                <span
                  className={`w-6 h-0.5 bg-gray-900 transition-all duration-300 ${
                    mobileMenuOpen ? "-rotate-45 -translate-y-2" : ""
                  }`}
                ></span>
              </button>
            </div>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="lg:hidden mt-4 pb-4 border-t border-gray-200 pt-4 animate-in fade-in slide-in-from-top-2 duration-200">
              <nav className="space-y-3">
                {navItems.map((item) => (
                  <div key={item.name}>
                    {item.dropdown ? (
                      <div>
                        <button
                          onClick={() => toggleDropdown(item.name)}
                          className={`flex items-center justify-between w-full text-sm font-medium uppercase py-2 transition-colors ${
                            isActive(item) ? "text-orange-500" : "text-gray-900"
                          }`}
                        >
                          {item.name}
                          <ChevronDown
                            className={`w-4 h-4 transition-transform duration-300 ${
                              activeDropdown === item.name ? "rotate-180" : ""
                            }`}
                          />
                        </button>

                        {activeDropdown === item.name && (
                          <div className="pl-4 space-y-2 mt-2 animate-in fade-in slide-in-from-top-2 duration-200">
                            {item.mega ? (
                              <>
                                <Link
                                  href="/category-page"
                                  className="block text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  All Products
                                </Link>
                                <Link
                                  href="/product-page"
                                  className="block text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Product Details
                                </Link>
                                <Link
                                  href="/shoping-cart"
                                  className="block text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Shopping Cart
                                </Link>
                                <Link
                                  href="/category-page"
                                  className="block text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Wishlist
                                </Link>
                              </>
                            ) : (
                              <>
                                <Link
                                  href="/blog"
                                  className="block text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  All Posts
                                </Link>
                                <Link
                                  href="/blog-detail"
                                  className="block text-sm text-gray-600 hover:text-orange-500 py-1.5 transition-colors"
                                  onClick={() => {
                                    setMobileMenuOpen(false);
                                    setActiveDropdown(null);
                                  }}
                                >
                                  Post Details
                                </Link>
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    ) : (
                      <Link
                        href={item.href}
                        className={`block text-sm font-medium uppercase py-2 transition-colors ${
                          isActive(item)
                            ? "text-orange-500"
                            : "text-gray-900 hover:text-orange-500"
                        }`}
                        onClick={() => setMobileMenuOpen(false)}
                      >
                        {item.name}
                      </Link>
                    )}
                  </div>
                ))}
              </nav>
            </div>
          )}
        </div>
      </header>

      {/* Search Modal */}
      {searchOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-[99999] flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchOpen(false);
            }
          }}
        >
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Header with Search title and close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Search className="w-6 h-6 text-orange-500 mr-3" />
                <span className="text-xl font-normal text-gray-900 tracking-wide">
                  Search
                </span>
              </div>
              <button
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 hover:text-gray-700 transition-colors duration-200"
                aria-label="Close search"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Search input */}
            <div className="p-6">
              <input
                type="text"
                placeholder="Type to search..."
                className="w-full px-4 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 rounded-lg transition-all duration-300 bg-transparent border border-gray-200 focus:border-orange-500"
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
