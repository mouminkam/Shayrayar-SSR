"use client";
import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import ShopSidebar from "./ShopSidebar";
import SortBar from "./SortBar";
import ProductCard from "../ui/ProductCard";
import Pagination from "../blog/Pagination";
import { Loader2 } from "lucide-react";
import api from "../../api";
import useBranchStore from "../../store/branchStore";
import { transformMenuItemsToProducts } from "../../lib/utils/productTransform";
import { extractMenuItemsFromResponse } from "../../lib/utils/responseExtractor";
import useToastStore from "../../store/toastStore";

// Constants
const ITEMS_PER_PAGE_GRID = 12;
const ITEMS_PER_PAGE_LIST = 5;


export default function ShopSection() {
  const searchParams = useSearchParams();
  const { selectedBranch, initialize } = useBranchStore();
  const { error: toastError } = useToastStore();
  
  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);
  
  const currentPage = Number(searchParams.get("page")) || 1;
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "menu_order";
  
  const [viewMode, setViewMode] = useState("grid");
  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);

  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    if (!selectedBranch) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
      };

      // Add category filter if selected
      if (categoryId) {
        params.category_id = categoryId;
      }

      // Add search query if provided
      if (searchQuery) {
        params.search = searchQuery;
      }

      // Add sort parameter (if API supports it)
      if (sortBy && sortBy !== "menu_order") {
        params.sort_by = sortBy;
      }

      const response = await api.menu.getMenuItems(params);
      const { menuItems, totalCount } = extractMenuItemsFromResponse(response);

      if (Array.isArray(menuItems) && menuItems.length > 0) {
        const transformedProducts = transformMenuItemsToProducts(menuItems);
        setProducts(transformedProducts);
        setTotalItems(totalCount || transformedProducts.length);
        setError(null);
      } else if (totalCount > 0) {
        setError("No products found on this page");
        setProducts([]);
        setTotalItems(totalCount);
      } else {
        const errorMsg = response?.message || response?.error || "No products found";
        setError(errorMsg);
        setProducts([]);
        setTotalItems(0);
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while loading products";
      setError(errorMessage);
      toastError(errorMessage);
      setProducts([]);
      setTotalItems(0);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch, currentPage, itemsPerPage, categoryId, searchQuery, sortBy, toastError]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  return (
    <section className="shop-section py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="shop-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Sort Bar */}
          <div className="mb-6 lg:mb-8">
            <SortBar
              totalItems={totalItems}
              currentPage={currentPage}
              itemsPerPage={itemsPerPage}
              onViewChange={setViewMode}
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
                  <div className="flex items-center justify-center py-20">
                    <Loader2 className="w-8 h-8 text-theme3 animate-spin" />
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-text text-lg mb-4">{error}</p>
                    <button
                      onClick={fetchProducts}
                      className="px-6 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors"
                    >
                      Try Again
                    </button>
                  </div>
                ) : products.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-20">
                    <p className="text-text text-lg">No products found</p>
                    {searchQuery && (
                      <p className="text-text text-sm mt-2">Try adjusting your search or filters</p>
                    )}
                  </div>
                ) : viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-6 lg:gap-8">
                    {products.map((product) => (
                      <ProductCard key={product.id} product={product} viewMode="grid" />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-4">
                    {products.map((product) => (
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

            </main>
          </div>
        </div>
      </div>
    </section>
  );
}

