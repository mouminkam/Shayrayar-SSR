"use client";
import { useState } from "react";
import { Grid, List } from "lucide-react";

export default function SortBar({ totalItems = 0, currentPage = 1, itemsPerPage = 12, onViewChange, viewMode = "grid" }) {
  const [sortBy, setSortBy] = useState("menu_order");

  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="mb-6">
      <div className="flex items-center justify-between">
        <div className="">
          <p className="woocommerce-result-count text-text text-base font-['Roboto',sans-serif] mb-0">
            Showing {startItem} - {endItem} of {totalItems} Results
          </p>
        </div>

        <div className="flex items-center justify-center gap-2">
          <div className="col-md-auto">
            <form className="woocommerce-ordering" method="get">
              <select
                name="orderby"
                className="single-select h-12 leading-[46px] border border-gray-200 w-full sm:w-auto min-w-[209px] text-base m-0 px-5 pr-10 rounded transition-all duration-300 hover:border-theme focus:border-theme outline-none appearance-none bg-white"
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
              >
                <option value="menu_order">Default Sorting</option>
                <option value="popularity">Sort by popularity</option>
                <option value="rating">Sort by average rating</option>
                <option value="date">Sort by latest</option>
                <option value="price">Sort by price: low to high</option>
                <option value="price-desc">Sort by price: high to low</option>
              </select>
            </form>
          </div>

          <div className="col-md-auto">
            <ul className="nav nav-pills flex items-center gap-2" role="tablist">
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link p-2 border-none bg-transparent transition-all duration-300 ${viewMode === "grid"
                    ? "text-theme"
                    : "text-text hover:text-theme"
                    }`}
                  onClick={() => onViewChange("grid")}
                  type="button"
                  role="tab"
                  aria-label="Grid view"
                >
                  <Grid className="w-5 h-5" />
                </button>
              </li>
              <li className="nav-item" role="presentation">
                <button
                  className={`nav-link p-2 border-none bg-transparent transition-all duration-300 ${viewMode === "list"
                    ? "text-theme"
                    : "text-text hover:text-theme"
                    }`}
                  onClick={() => onViewChange("list")}
                  type="button"
                  role="tab"
                  aria-label="List view"
                >
                  <List className="w-5 h-5" />
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

