"use client";
import { useState, useCallback } from "react";
import { Search, X } from "lucide-react";
import { motion } from "framer-motion";

/**
 * Reusable Search Bar Component
 * @param {string} placeholder - Placeholder text
 * @param {function} onSearch - Callback function when search is performed
 * @param {string} defaultValue - Default search value
 * @param {string} className - Additional CSS classes
 */
export default function SearchBar({
  placeholder = "Search...",
  onSearch,
  defaultValue = "",
  className = "",
}) {
  const [searchValue, setSearchValue] = useState(defaultValue);
  const [isFocused, setIsFocused] = useState(false);

  const handleChange = useCallback(
    (e) => {
      const value = e.target.value;
      setSearchValue(value);
      if (onSearch) {
        onSearch(value);
      }
    },
    [onSearch]
  );

  const handleClear = useCallback(() => {
    setSearchValue("");
    if (onSearch) {
      onSearch("");
    }
  }, [onSearch]);

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault();
      if (onSearch) {
        onSearch(searchValue);
      }
    },
    [searchValue, onSearch]
  );

  return (
    <motion.form
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      onSubmit={handleSubmit}
      className={`relative ${className}`}
    >
      <div
        className={`relative flex items-center bg-white/10 border ${
          isFocused ? "border-theme3" : "border-white/20"
        } rounded-xl transition-all duration-300`}
      >
        <Search className="absolute left-4 w-5 h-5 text-text pointer-events-none" />
        <input
          type="text"
          value={searchValue}
          onChange={handleChange}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          className="w-full pl-12 pr-10 py-3 bg-transparent text-white placeholder-text/50 focus:outline-none focus:ring-2 focus:ring-theme3/20 rounded-xl font-['Roboto',sans-serif]"
        />
        {searchValue && (
          <motion.button
            type="button"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            onClick={handleClear}
            className="absolute right-3 p-1 text-text hover:text-theme3 transition-colors"
            aria-label="Clear search"
          >
            <X className="w-4 h-4" />
          </motion.button>
        )}
      </div>
    </motion.form>
  );
}

