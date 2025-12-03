"use client";
import { useState } from "react";
import { useSearchParams } from "next/navigation";
import ShopSidebar from "./ShopSidebar";
import SortBar from "./SortBar";
import ProductCardSkeleton from "../../ui/ProductCardSkeleton";
import LazyProductCard from "../../ui/LazyProductCard";
import AnimatedSection from "../../ui/AnimatedSection";
import { ChevronDown } from "lucide-react";
import { useShopProducts } from "../../../hooks/useShopProducts";
import { ITEMS_PER_PAGE_GRID, ITEMS_PER_PAGE_LIST } from "../../../data/constants";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

export default function ShopSection() {
  const searchParams = useSearchParams();
  const { lang } = useLanguage();
  const [viewMode, setViewMode] = useState("grid");
  
  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;
  
  // Use custom hook for products management
  const {
    products,
    isLoading,
    error,
    totalItems,
    hasMore,
    handleViewModeChange: hookHandleViewModeChange,
    handleShowMore,
    refetch,
  } = useShopProducts(viewMode);

  // Handle view mode change with hook
  const handleViewModeChange = (newViewMode) => {
    setViewMode(newViewMode);
    hookHandleViewModeChange(newViewMode);
  };

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
                      onClick={refetch}
                      className="px-6 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors"
                    >
                      {t(lang, "try_again")}
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-text text-lg">{t(lang, "no_products_found")}</p>
                    {searchParams.get("search") && (
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

