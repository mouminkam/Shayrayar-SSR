"use client";
import { Grid, List } from "lucide-react";
import { ITEMS_PER_PAGE } from "../../data/constants";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

/**
 * SortBar Component
 * Displays product count and view mode toggle
 * @param {Object} props
 * @param {number} props.totalItems - Total number of items
 * @param {number} props.currentPage - Current page number
 * @param {number} props.itemsPerPage - Items per page
 * @param {Function} props.onViewChange - Callback when view mode changes
 * @param {string} props.viewMode - Current view mode ("grid" or "list")
 */
export default function SortBar({ totalItems = 0, currentPage = 1, itemsPerPage = ITEMS_PER_PAGE, onViewChange, viewMode = "grid" }) {
  const { lang } = useLanguage();

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="w-full">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 sm:gap-6">
        {/* Results Count */}
        <div className="shrink-0">
          <p className="text-white text-sm sm:text-base ">
            {t(lang, "showing")} <span className="font-semibold">{startItem}</span> - <span className="font-semibold">{endItem}</span> {t(lang, "of")} <span className="font-semibold">{totalItems}</span> {t(lang, "results")}
          </p>
        </div>

        {/* Sort & View Controls */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 w-full sm:w-auto">
          {/* Sort Select */}
          {/* <div className="shrink-0">
            <form className="woocommerce-ordering flex justify-between items-center gap-4" method="get">
              <label
                htmlFor="sort-select"
                className="block text-white text-lg "
              >
                Sort by:
              </label>
              <select
                id="sort-select"
                name="orderby"
                className="h-12 leading-[46px] bg-bgimg border border-gray-200 w-3/4 sm:w-auto min-w-[200px] text-sm sm:text-base px-4 pr-10 rounded-lg transition-all duration-300 appearance-none  text-white  cursor-pointer"
                value={sortBy}
                onChange={handleSortChange}
              >
                <option value="menu_order">Default Sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="rating">Sort by average rating</option>
                <option value="date">Sort by latest</option>
                <option value="price">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
              </select>
            </form>
          </div> */}

          {/* View Mode Toggle */}
          <div className="shrink-0">
            <div className="flex items-center gap-2 bg-bgimg rounded-lg p-1">
              <button
                className={`p-2 rounded transition-all cursor-pointer duration-300 ${viewMode === "grid"
                  ? "bg-theme text-white"
                  : "text-white hover:text-theme hover:bg-gray-50"
                  }`}
                onClick={() => onViewChange("grid")}
                type="button"
                role="tab"
                aria-label="Grid view"
                aria-selected={viewMode === "grid"}
              >
                <Grid className="w-5 h-5" />
              </button>
              <button
                className={`p-2 rounded transition-all cursor-pointer duration-300 ${viewMode === "list"
                  ? "bg-theme text-white"
                  : "text-white hover:text-theme hover:bg-gray-50"
                  }`}
                onClick={() => onViewChange("list")}
                type="button"
                role="tab"
                aria-label="List view"
                aria-selected={viewMode === "list"}
              >
                <List className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

