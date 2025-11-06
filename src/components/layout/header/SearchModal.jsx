"use client";
import { Search, X } from "lucide-react";

export default function SearchModal({ searchOpen, setSearchOpen }) {
  if (!searchOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/40 z-[9999] flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          setSearchOpen(false);
        }
      }}
    >
      <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl animate-in zoom-in-95 duration-200">
        {/* Header with Search title and close button */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Search className="w-6 h-6 text-red-600 mr-3" />
            <span className="text-xl font-normal text-gray-900 tracking-wide">
              Search
            </span>
          </div>
          <button
            onClick={() => setSearchOpen(false)}
            className="text-gray-500 hover:text-red-600 transition-colors duration-200"
            aria-label="Close search"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Search input */}
        <div className="p-6">
          <input
            type="text"
            placeholder="Type to search..."
            className="w-full px-4 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-600 rounded-lg transition-all duration-300 bg-transparent border border-gray-200 focus:border-red-600"
            autoFocus
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchOpen(false);
              }
            }}
          />
        </div>
      </div>
    </div>
  );
}

