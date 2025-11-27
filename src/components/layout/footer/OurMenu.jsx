"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ChevronsRight } from "lucide-react";
import { usePrefetchRoute } from "../../../hooks/usePrefetchRoute";
import api from "../../../api";
import useBranchStore from "../../../store/branchStore";
import { transformCategories } from "../../../lib/utils/productTransform";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

// Helper: Extract categories from API response
const extractCategories = (response) => {
  if (!response) return [];
  if (Array.isArray(response)) return response;
  if (response?.success && response?.data) {
    return Array.isArray(response.data) ? response.data : response.data.categories || response.data.data || [];
  }
  return response?.data?.categories || response?.categories || response?.data || [];
};

export default function OurMenu() {
  const { prefetchRoute } = usePrefetchRoute();
  const { selectedBranch, initialize } = useBranchStore();
  const { lang } = useLanguage();
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize branch if not loaded
  useEffect(() => {
    if (!selectedBranch) {
      initialize();
    }
  }, [selectedBranch, initialize]);

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      if (!selectedBranch) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.menu.getMenuCategories();
        const categoriesData = extractCategories(response);
        const transformed = transformCategories(categoriesData);
        setCategories(transformed);
      } catch (error) {
        console.error("Error fetching categories:", error);
        setCategories([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, [selectedBranch]);

  return (
    <div className="mt-6 sm:mt-8 md:mt-0 lg:pl-6 xl:pl-12">
      <div className="mb-6 sm:mb-8">
        <h3 className="text-white text-xl sm:text-2xl font-bold inline-block relative pb-4 sm:pb-5">
          {t(lang, "our_menu")}
          {/* Orange Line */}
          <span className="absolute bottom-0 left-0 w-6 h-0.5 bg-theme3"></span>
          {/* White Line */}
          <span className="absolute bottom-0 left-10 w-12 sm:w-14 h-0.5 bg-white"></span>
        </h3>
      </div>
      <ul className="space-y-3 sm:space-y-4 md:space-y-5">
        {isLoading ? (
          <li className="text-white/70 text-sm">{t(lang, "loading_categories")}</li>
        ) : categories.length > 0 ? (
          categories.map((category) => {
            const href = `/shop?category=${category.id}`;
            return (
              <li key={category.id} className="transition-all duration-300 hover:translate-x-1">
                <Link
                  href={href}
                  onMouseEnter={() => prefetchRoute(href)}
                  className="flex items-center gap-2 text-white hover:text-theme3 transition-colors duration-300"
                >
                  <ChevronsRight className="w-4 h-4" />
                  <span>{category.name}</span>
                </Link>
              </li>
            );
          })
        ) : (
          <li className="text-white/70 text-sm">{t(lang, "no_categories_available")}</li>
        )}
      </ul>
    </div>
  );
}

