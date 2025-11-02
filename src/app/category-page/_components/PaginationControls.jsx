"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";

export default function PaginationControls({
  currentPage,
  totalPages,
  onPageChange,
  showAllProducts,
  onShowAllProducts,
}) {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-12 pt-8 border-t border-gray-200">
      {/* Show All Products Button */}
      <button
        onClick={onShowAllProducts}
        className="bg-gradient-to-r from-gray-800 to-gray-600 text-white px-8 py-3 rounded-lg font-bold uppercase tracking-wide text-sm transition-all duration-300 hover:from-gray-900 hover:to-gray-700 hover:shadow-lg hover:-translate-y-0.5 min-w-[200px] text-center"
      >
        {showAllProducts ? "Show Less" : "Show All Products"}
      </button>

      {/* Pagination */}
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors duration-200"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {[1, 2, 3, 4, 5, 6].map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`w-10 h-10 rounded flex items-center justify-center text-sm font-medium transition-all duration-200 ${
              currentPage === page
                ? "bg-gray-800 text-white shadow-lg"
                : "bg-white text-gray-600 border border-gray-300 hover:border-gray-400 hover:shadow-md"
            }`}
          >
            {page}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="w-10 h-10 bg-gray-800 text-white rounded flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-900 transition-colors duration-200"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
