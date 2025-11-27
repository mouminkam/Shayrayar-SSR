"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ShopSidebar from "./ShopSidebar";
import SortBar from "./SortBar";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";
import LazyProductCard from "../ui/LazyProductCard";
import AnimatedSection from "../ui/AnimatedSection";
import { ChevronDown } from "lucide-react";
import api from "../../api";
import useBranchStore from "../../store/branchStore";
import { transformMenuItemsToProducts } from "../../lib/utils/productTransform";
import { extractMenuItemsFromResponse } from "../../lib/utils/responseExtractor";
import useToastStore from "../../store/toastStore";
import { ITEMS_PER_PAGE_GRID, ITEMS_PER_PAGE_LIST } from "../../data/constants";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";


export default function ShopSection() {
  const searchParams = useSearchParams();
  const { selectedBranch, initialize } = useBranchStore();
  const { error: toastError } = useToastStore();
  const { lang } = useLanguage();
  
  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);
  
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "menu_order";
  
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]); // Products to display
  const [allProducts, setAllProducts] = useState([]); // All products (for client-side pagination)
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [useClientPagination, setUseClientPagination] = useState(false); // Flag to determine pagination type

  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;

  // Handle view mode change
  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    if (useClientPagination) {
      const newItemsPerPage = newViewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
      setProducts(allProducts.slice(0, newItemsPerPage));
    }
  };

  // Handle show more button (only for client-side pagination)
  const handleShowMore = () => {
    const currentCount = products.length;
    const nextCount = currentCount + itemsPerPage;
    setProducts(allProducts.slice(0, nextCount));
  };

  // Hybrid Pagination: Try server-side first, fallback to client-side
  const fetchProducts = useCallback(async () => {
    if (!selectedBranch) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 1: Try server-side pagination with requested limit
      const params = {
        page: 1,
        limit: itemsPerPage,
      };

      // Add filters
      if (categoryId) {
        params.category_id = categoryId;
      }
      if (searchQuery) {
        params.search = searchQuery;
      }
      if (sortBy && sortBy !== "menu_order") {
        params.sort_by = sortBy;
      }

      const response = await api.menu.getMenuItems(params);
      const { menuItems, totalCount } = extractMenuItemsFromResponse(response);
      const apiPerPage = response?.data?.items?.per_page;

      // Check if API respects the limit parameter
      const apiRespectsLimit = apiPerPage && apiPerPage === itemsPerPage;

      if (Array.isArray(menuItems) && menuItems.length > 0) {
        const transformedProducts = transformMenuItemsToProducts(menuItems);

        if (apiRespectsLimit) {
          // ✅ Server-side pagination works!
          setUseClientPagination(false);
          setProducts(transformedProducts);
          setAllProducts([]); // Not needed for server-side
          setTotalItems(totalCount || transformedProducts.length);
        } else {
          // ❌ API doesn't respect limit - use client-side pagination
          setUseClientPagination(true);
          
          // Fetch all products for client-side pagination
          const allParams = { ...params, limit: 1000 };
          const allResponse = await api.menu.getMenuItems(allParams);
          const { menuItems: allMenuItems } = extractMenuItemsFromResponse(allResponse);
          const allTransformed = transformMenuItemsToProducts(allMenuItems);
          
          setAllProducts(allTransformed);
          setProducts(allTransformed.slice(0, itemsPerPage));
          setTotalItems(allTransformed.length);
        }
        setError(null);
      } else if (totalCount > 0) {
        setError("No products found");
        setProducts([]);
        setAllProducts([]);
        setTotalItems(totalCount);
      } else {
        const errorMsg = response?.message || response?.error || "No products found";
        setError(errorMsg);
        setProducts([]);
        setAllProducts([]);
        setTotalItems(0);
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while loading products";
      setError(errorMessage);
      toastError(errorMessage);
      setProducts([]);
      setAllProducts([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch, itemsPerPage, categoryId, searchQuery, sortBy, toastError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const hasMore = useClientPagination && products.length < allProducts.length;

  return (
    <AnimatedSection mobileOptimized={true}>
      <section className="shop-section py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="shop-wrapper style1">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
            {/* Sort Bar */}
            <div className="mb-6 lg:mb-8">
              <SortBar
                totalItems={totalItems}
                currentPage={1}
                itemsPerPage={itemsPerPage}
                onViewChange={handleViewModeChange}
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
                {isLoading ? (
                  viewMode === "grid" ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                      <ProductCardSkeleton viewMode="grid" count={itemsPerPage} />
                    </div>
                  ) : (
                    <div className="flex flex-col gap-4">
                      <ProductCardSkeleton viewMode="list" count={itemsPerPage} />
                    </div>
                  )
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-text text-lg mb-4">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="px-6 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors"
                    >
                      {t(lang, "try_again")}
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-text text-lg">{t(lang, "no_products_found")}</p>
                    {searchQuery && (
                      <p className="text-text text-sm mt-2">{t(lang, "try_adjusting_search_filters")}</p>
                    )}
                  </div>
                ) : viewMode === "grid" ? (
                  <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                      {products.map((product, index) => (
                        <LazyProductCard 
                          key={product.id} 
                          product={product} 
                          viewMode="grid"
                          // Load first 4 cards immediately (above the fold)
                          options={index < 4 ? { rootMargin: "0px" } : {}}
                        />
                      ))}
                    </div>
                    {hasMore && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleShowMore}
                          className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white  text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {t(lang, "show_more")}
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="flex flex-col gap-4">
                      {products.map((product, index) => (
                        <LazyProductCard 
                          key={product.id} 
                          product={product} 
                          viewMode="list"
                          options={index < 2 ? { rootMargin: "0px" } : {}}
                        />
                      ))}
                    </div>
                    {hasMore && (
                      <div className="flex justify-center mt-8">
                        <button
                          onClick={handleShowMore}
                          className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white  text-sm font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl"
                        >
                          {t(lang, "show_more")}
                          <ChevronDown className="w-5 h-5" />
                        </button>
                      </div>
                    )}
                  </>
                )}
              </div>

              </main>
            </div>
          </div>
        </div>
      </section>
    </AnimatedSection>
  );
}

