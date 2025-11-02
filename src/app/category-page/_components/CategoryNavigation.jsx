"use client";

export default function CategoryNavigation({ categories, activeCategory, onCategoryChange }) {
  return (
    <nav className="flex flex-wrap justify-center gap-4 sm:gap-8 py-6 ">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => onCategoryChange(category)}
          className={`relative text-sm sm:text-base font-medium uppercase tracking-wide transition-all duration-300 pb-2 ${
            activeCategory === category
              ? "text-black font-bold"
              : "text-gray-600 hover:text-black"
          }`}
        >
          {category}
          {activeCategory === category && (
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-black transform transition-transform duration-300"></span>
          )}
        </button>
      ))}
    </nav>
  );
}
