"use client";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "../api";
import useBranchStore from "../store/branchStore";
import { transformMenuItemsToProducts } from "../lib/utils/productTransform";
import { extractMenuItemsFromResponse } from "../lib/utils/responseExtractor";
import useToastStore from "../store/toastStore";
import { ITEMS_PER_PAGE_GRID, ITEMS_PER_PAGE_LIST } from "../data/constants";
import { useApiCache } from "./useApiCache";
import { useLanguage } from "../context/LanguageContext";
import { debounce } from "../lib/utils/debounce";

/**
 * Hook to manage shop products fetching, pagination, and filtering
 * @param {string} viewMode - View mode: "grid" or "list"
 * @returns {Object} Products data, loading state, and handlers
 */
export function useShopProducts(viewMode = "grid") {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { selectedBranch, initialize } = useBranchStore();
  const { error: toastError } = useToastStore();
  const { getCachedOrFetch } = useApiCache("PRODUCTS");
  const { lang } = useLanguage();

  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);

  // Get filters from URL
  const categoryId = searchParams.get("category");
  const searchQuery = searchParams.get("search") || "";
  const sortBy = searchParams.get("sort") || "menu_order";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const itemsPerPage = viewMode === "grid" ? ITEMS_PER_PAGE_GRID : ITEMS_PER_PAGE_LIST;

  const [products, setProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalItems, setTotalItems] = useState(0);
  const [pagination, setPagination] = useState(null);

  // Debounced search query state
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState(searchQuery);

  // Create debounced function using debounce utility
  const debouncedSetSearchQuery = useMemo(
    () => debounce((value) => {
      setDebouncedSearchQuery(value);
    }, 300),
    []
  );

  // Update debounced search query when searchQuery changes
  useEffect(() => {
    debouncedSetSearchQuery(searchQuery);
  }, [searchQuery, debouncedSetSearchQuery]);

  // Fetch products with caching
  const fetchProducts = useCallback(async () => {
    if (!selectedBranch) {
      setIsLoading(false);
      return;
    }

    // جعل category مطلوب
    if (!categoryId) {
      setIsLoading(false);
      setError("Please select a category");
      setProducts([]);
      setTotalItems(0);
      setPagination(null);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const params = {
        page: currentPage,
        limit: itemsPerPage,
        category_id: categoryId, // مطلوب دائماً
      };

      if (debouncedSearchQuery) {
        params.search = debouncedSearchQuery;
      }
      if (sortBy && sortBy !== "menu_order") {
        params.sort_by = sortBy;
      }

      // Use cache for API call
      const response = await getCachedOrFetch(
        "/menu-items",
        params,
        () => api.menu.getMenuItems(params)
      );

      const { menuItems, totalCount, pagination: paginationInfo } = extractMenuItemsFromResponse(response);
      
      if (Array.isArray(menuItems) && menuItems.length > 0) {
        const transformedProducts = transformMenuItemsToProducts(menuItems, lang);
        setProducts(transformedProducts);
        setTotalItems(totalCount);
        setPagination(paginationInfo);
        setError(null);
      } else if (totalCount > 0) {
        setError("No products found");
        setProducts([]);
        setTotalItems(totalCount);
        setPagination(paginationInfo);
      } else {
        const errorMsg = response?.message || response?.error || "No products found";
        setError(errorMsg);
        setProducts([]);
        setTotalItems(0);
        setPagination(null);
      }
    } catch (err) {
      const errorMessage = err.message || "An error occurred while loading products";
      setError(errorMessage);
      toastError(errorMessage);
      setProducts([]);
      setTotalItems(0);
      setPagination(null);
    } finally {
      setIsLoading(false);
    }
  }, [selectedBranch, currentPage, itemsPerPage, categoryId, debouncedSearchQuery, sortBy, toastError, getCachedOrFetch, lang]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Handle page change
  // ScrollToTopHandler will ensure scroll to top on route change
  const handlePageChange = useCallback((page) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page);
    router.push(`/shop?${params.toString()}`, { scroll: true });
  }, [searchParams, router]);

  return {
    products,
    isLoading,
    error,
    totalItems,
    pagination,
    currentPage,
    handlePageChange,
    refetch: fetchProducts,
  };
}

