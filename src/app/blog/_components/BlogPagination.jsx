"use client";
import React from "react";
import { getPaginationPages } from "./blogUtils";

/**
 * BlogPagination Component
 * Displays pagination controls for blog posts
 * 
 * @param {Object} props
 * @param {number} props.currentPage - Current active page
 * @param {number} props.totalPages - Total number of pages
 * @param {Function} props.onPageChange - Callback function when page changes
 */
export default function BlogPagination({
  currentPage,
  totalPages,
  onPageChange,
}) {
  const pages = getPaginationPages(currentPage, totalPages);

  const handlePrevious = () => {
    if (currentPage > 1) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      onPageChange(currentPage + 1);
    }
  };

  const isPreviousDisabled = currentPage === 1;
  const isNextDisabled = currentPage === totalPages;

  return (
    <nav className="pagination mt-16 lg:mt-20">
      <ul className="list-unstyled slick-dots flex justify-center items-center space-x-8 lg:space-x-12">
        {/* Previous Button */}
        <li className="prev">
          <button
            onClick={handlePrevious}
            disabled={isPreviousDisabled}
            className={`flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-250 ${
              isPreviousDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            <span className="arrow_left mr-2">←</span>
            Prev
          </button>
        </li>

        {/* Page Numbers */}
        {pages.map((page) => {
          const isActive = currentPage === page;
          return (
            <li
              key={page}
              className={isActive ? "slick-active scale-125" : ""}
            >
              <button
                onClick={() => onPageChange(page)}
                className={`text-xl lg:text-2xl transition-all duration-250 ${
                  isActive
                    ? "text-gray-700 font-semibold scale-125"
                    : "text-gray-500 hover:text-gray-600"
                }`}
              >
                {page.toString().padStart(2, "0")}
              </button>
            </li>
          );
        })}

        {/* Next Button */}
        <li className="next">
          <button
            onClick={handleNext}
            disabled={isNextDisabled}
            className={`flex items-center text-gray-500 hover:text-gray-700 transition-colors duration-250 ${
              isNextDisabled ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            Next
            <span className="arrow_right ml-2">→</span>
          </button>
        </li>
      </ul>
    </nav>
  );
}
