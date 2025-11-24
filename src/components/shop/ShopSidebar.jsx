"use client";
import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Search, Star, Heart, ShoppingBasket } from "lucide-react";
import OptimizedImage from "../ui/OptimizedImage";
import { usePrefetchRoute } from "../../hooks/usePrefetchRoute";
import api from "../../api";
import useBranchStore from "../../store/branchStore";
import { transformCategories, transformMenuItemsToProducts } from "../../lib/utils/productTransform";
import { extractMenuItemsFromResponse } from "../../lib/utils/responseExtractor";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";
import { formatCurrency } from "../../lib/utils/formatters";


export default function ShopSidebar() {
  const { navigate, prefetchRoute } = usePrefetchRoute();
  const searchParams = useSearchParams();
  const { selectedBranch } = useBranchStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, items: wishlistItems } = useWishlistStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  
  const currentCategory = searchParams.get("category");
  const currentSearch = searchParams.get("search") || "";
  
  const [searchQuery, setSearchQuery] = useState(currentSearch);
  const [categories, setCategories] = useState([]);
  const [recentProducts, setRecentProducts] = useState([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingRecent, setIsLoadingRecent] = useState(false);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedBranch) {
        setIsLoadingCategories(false);
        return;
      }

      setIsLoadingCategories(true);
      try {
        const response = await api.menu.getMenuCategories();
        
        // Handle different response structures
        let categoriesData = [];
        
        if (response && response.success && response.data) {
          categoriesData = Array.isArray(response.data)
            ? response.data
            : response.data.categories || response.data.data || [];
        } else if (Array.isArray(response)) {
          categoriesData = response;
        } else if (response && response.data && Array.isArray(response.data)) {
          categoriesData = response.data;
        } else if (response && response.data) {
          categoriesData = response.data.categories || response.data.data || [];
        } else if (response && typeof response === 'object') {
          categoriesData = response.categories || response.data || [];
        }
        
        const transformed = transformCategories(categoriesData);
        setCategories(transformed);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, [selectedBranch]);

  // Fetch recent/featured products
  useEffect(() => {
    const fetchRecentProducts = async () => {
      if (!selectedBranch) return;

      setIsLoadingRecent(true);
      try {
        const response = await api.menu.getMenuItems({ 
          featured: true,
          limit: 4 
        });
        
        const { menuItems } = extractMenuItemsFromResponse(response);
        
        if (Array.isArray(menuItems) && menuItems.length > 0) {
          const transformed = transformMenuItemsToProducts(menuItems);
          setRecentProducts(transformed);
        } else {
          setRecentProducts([]);
        }
      } catch {
        setRecentProducts([]);
      } finally {
        setIsLoadingRecent(false);
      }
    };

    fetchRecentProducts();
  }, [selectedBranch]);

  // Handle add to cart
  const handleAddToCart = useCallback((e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    try {
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: product.image,
        title: product.title,
      });
      toastSuccess(`${product.title} added to cart`);
    } catch {
      toastError("Failed to add product to cart");
    }
  }, [addToCart, toastSuccess, toastError, isAuthenticated, navigate]);

  // Handle wishlist toggle
  const handleWishlistToggle = useCallback(async (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to wishlist");
      navigate("/login");
      return;
    }
    
    // Use menu_item_id if available, otherwise fall back to id
    const menuItemId = product.menu_item_id || product.id;
    if (!menuItemId) {
      console.error("handleWishlistToggle: Missing menuItemId", product);
      toastError("Invalid product information");
      return;
    }
    
    // Check if item is in wishlist by checking items array directly
    const isInWishlistState = wishlistItems.some((item) => {
      const itemId = item.id ? String(item.id) : null;
      const itemMenuItemId = item.menu_item_id ? String(item.menu_item_id) : null;
      const productIdStr = String(menuItemId);
      return itemId === productIdStr || itemMenuItemId === productIdStr;
    });
    
    try {
      if (isInWishlistState) {
        const result = await removeFromWishlist(menuItemId);
        if (result.success) {
          toastSuccess(`${product.title || product.name} removed from wishlist`);
        } else {
          if (result.requiresAuth) {
            navigate("/login");
          } else {
            toastError(result.error || "Failed to remove from wishlist");
          }
        }
      } else {
        const result = await addToWishlist({
          id: product.id,
          menu_item_id: menuItemId,
          name: product.title || product.name,
          price: product.price,
          image: product.image,
          title: product.title || product.name,
        });
        if (result.success) {
          if (result.alreadyExists) {
            // Item already exists, no need to show success message
            return;
          }
          toastSuccess(`${product.title || product.name} added to wishlist`);
        } else {
          if (result.requiresAuth) {
            navigate("/login");
          } else {
            toastError(result.error || "Failed to add to wishlist");
          }
        }
      }
    } catch (error) {
      console.error("handleWishlistToggle error:", error);
      toastError("Failed to update wishlist. Please try again.");
    }
  }, [addToWishlist, removeFromWishlist, wishlistItems, toastSuccess, toastError, isAuthenticated, navigate]);

  // Update search query when URL changes
  useEffect(() => {
    setSearchQuery(currentSearch);
  }, [currentSearch]);

  // Handle category selection
  const handleCategoryClick = useCallback((categoryId) => {
    const params = new URLSearchParams(searchParams.toString());
    
    if (categoryId && categoryId !== currentCategory) {
      params.set("category", categoryId);
      params.delete("page"); // Reset to first page
    } else {
      params.delete("category");
      params.delete("page");
    }
    
    navigate(`/shop?${params.toString()}`);
  }, [navigate, searchParams, currentCategory]);

  // Handle search
  const handleSearch = useCallback((e) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());
    
    if (searchQuery.trim()) {
      params.set("search", searchQuery.trim());
      params.delete("page"); // Reset to first page
    } else {
      params.delete("search");
      params.delete("page");
    }
    
    navigate(`/shop?${params.toString()}`);
  }, [searchQuery, navigate, searchParams]);



  return (
    <aside className="main-sidebar space-y-6 lg:space-y-8">
      {/* Search Widget */}
      <div className="bg-bgimg p-6 sm:p-8 rounded-2xl shadow-sm">
        <h5 className="text-white  text-lg sm:text-xl font-bold relative pb-3 mb-6 capitalize">
          Search
          <span className="absolute bottom-0 left-0 h-0.5 w-16 sm:w-20 bg-theme3"></span>
        </h5>
        <form onSubmit={handleSearch} className="relative">
          <input
            type="text"
            placeholder="Search here"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-bgimg text-sm sm:text-base px-4 sm:px-5 py-3 rounded-lg border-none outline-none text-white  pr-12 sm:pr-16 focus:ring-2 focus:ring-white transition-all"
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
        <h5 className="text-white  text-lg sm:text-xl font-bold relative pb-3 mb-6 capitalize">
          Categories
          <span className="absolute bottom-0 left-0 h-0.5 w-16 sm:w-20 bg-theme3"></span>
        </h5>
        {isLoadingCategories ? (
          <div className="flex items-center justify-center py-4">
            <p className="text-text text-sm">Loading categories...</p>
          </div>
        ) : categories.length === 0 ? (
          <p className="text-text text-sm">No categories available</p>
        ) : (
          <ul className="flex flex-wrap items-center gap-2 sm:gap-3">
            {/* All Categories Link */}
            <li>
              <button
                onClick={() => handleCategoryClick(null)}
                className={`inline-flex px-3 sm:px-4 py-2 sm:py-2.5 text-white  text-xs sm:text-sm font-normal capitalize rounded-lg transition-all duration-300 hover:bg-theme3 hover:text-white active:scale-95 ${
                  !currentCategory ? "bg-theme3 text-white" : ""
                }`}
              >
                All
              </button>
            </li>
            {categories.map((category) => (
              <li key={category.id}>
                <button
                  onClick={() => handleCategoryClick(category.id)}
                  className={`inline-flex px-3 sm:px-4 py-2 sm:py-2.5 text-white  text-xs sm:text-sm font-normal capitalize rounded-lg transition-all duration-300 hover:bg-theme3 hover:text-white active:scale-95 ${
                    currentCategory === String(category.id) ? "bg-theme3 text-white" : ""
                  }`}
                >
                  {category.name}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Recent Products Widget - Desktop Only */}
      <div className="hidden lg:block w-full mt-8">
        <div className="bg-linear-to-br from-bgimg/80 via-bgimg to-bgimg/95 backdrop-blur-sm p-6 lg:p-8 rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden">
          {/* Subtle gradient overlay */}
          <div className="absolute inset-0 bg-linear-to-br from-theme3/5 to-transparent opacity-20 pointer-events-none"></div>

          <h5 className="text-white  text-lg lg:text-xl font-black relative pb-3 lg:pb-4 mb-6 lg:mb-8 capitalize text-center">
            <span className="relative z-10 bg-linear-to-r from-theme3 to-theme bg-clip-text text-transparent drop-shadow-lg">
              Recent Products
            </span>
            <span className="absolute bottom-0 left-1/2 transform -translate-x-1/2 h-1 w-16 lg:w-20 bg-linear-to-r from-theme to-theme3 rounded-full"></span>
          </h5>

          {isLoadingRecent ? (
            <div className="flex items-center justify-center py-4">
              <p className="text-text text-sm">Loading...</p>
            </div>
          ) : recentProducts.length === 0 ? (
            <p className="text-text text-sm text-center">No recent products</p>
          ) : (
            <div className="grid grid-cols-1 gap-4 lg:gap-6 relative z-10">
              {recentProducts.map((product) => {
                const menuItemId = product.menu_item_id || product.id;
                // Check if item is in wishlist by checking items array directly
    const isInWishlistState = wishlistItems.some((item) => {
      const itemId = item.id ? String(item.id) : null;
      const itemMenuItemId = item.menu_item_id ? String(item.menu_item_id) : null;
      const productIdStr = String(menuItemId);
      return itemId === productIdStr || itemMenuItemId === productIdStr;
    });
                return (
                  <div
                    key={product.id}
                    className="group bg-linear-to-br from-white/5 via-bgimg to-black/90 backdrop-blur-md p-4 lg:p-5 rounded-2xl transition-all duration-500 relative overflow-hidden hover:-translate-y-1"
                  >
                    {/* Heart Button - Top Right */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, product)}
                      className={`absolute top-3 right-3 z-20 w-7 h-7 flex items-center justify-center rounded-full transition-all duration-300 ${
                        isInWishlistState
                          ? "bg-theme3 text-white"
                          : "bg-theme2 text-white hover:bg-theme"
                      }`}
                    >
                      <Heart className={`w-3.5 h-3.5 ${isInWishlistState ? "fill-current" : ""}`} />
                    </button>

                    <div className="flex flex-col items-center text-center space-y-3 lg:space-y-4">
                      {/* Product Image */}
                      <div 
                        className="relative w-full flex justify-center"
                        onMouseEnter={() => prefetchRoute(`/shop/${product.id}`)}
                      >
                        <div className="w-16 h-16 lg:w-18 lg:h-18 rounded-full bg-linear-to-br transition-all duration-500">
                          <div className="w-full h-full rounded-full bg-bgimg/80 backdrop-blur-sm border border-white/10 group-hover:border-theme3/30 transition-all duration-500 flex items-center justify-center">
                            <OptimizedImage
                              src={product.image}
                              alt={product.title}
                              width={56}
                              height={56}
                              className="w-12 h-12 lg:w-14 lg:h-14 object-cover rounded-full transform group-hover:scale-110 transition-transform duration-500"
                              quality={85}
                              loading="lazy"
                              sizes="(max-width: 1024px) 48px, 56px"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Product Content */}
                      <div className="space-y-2 lg:space-y-3 flex-1 w-full">
                        <Link
                          href={`/shop/${product.id}`}
                          onMouseEnter={() => prefetchRoute(`/shop/${product.id}`)}
                          className="text-white  text-sm lg:text-base font-extrabold hover:text-theme transition-all duration-300 block line-clamp-2 group-hover:-translate-y-px"
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
                          <span className="text-theme  text-sm lg:text-base font-black bg-linear-to-r from-theme/10 to-theme3/10 px-2 lg:px-3 py-1 rounded-full">
                            {formatCurrency(product.price)}
                          </span>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/shop/${product.id}`}
                            onMouseEnter={() => prefetchRoute(`/shop/${product.id}`)}
                            className="flex-1 bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white  text-xs lg:text-sm font-semibold py-1.5 lg:py-2 px-3 lg:px-4 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-theme3/30 text-center"
                          >
                            Order
                          </Link>
                          <button
                            onClick={(e) => handleAddToCart(e, product)}
                            className="w-9 h-9 flex items-center justify-center rounded-full bg-theme3 text-white hover:bg-theme transition-all duration-300"
                            title="Add to Cart"
                          >
                            <ShoppingBasket className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* View All Link */}
          <div className="text-center mt-6 lg:mt-8 pt-4 lg:pt-6 border-t border-white/10">
            <Link
              href="/shop"
              className="inline-flex items-center text-theme3  text-xs lg:text-sm font-semibold hover:text-theme transition-all duration-300 group"
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
