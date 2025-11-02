"use client";

export default function FilterSidebar({
  priceRange,
  onPriceRangeChange,
  sizes,
  selectedSize,
  onSizeChange,
  colors,
  selectedColor,
  onColorChange,
  seasons,
  selectedSeason,
  onSeasonChange,
}) {
  return (
    <div className="space-y-8 pr-4">
      {/* Price Filter */}
      <div className="border-t border-gray-200 pt-6">
        <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4">
          Price
        </h3>
        <div className="space-y-4">
          <div className="relative h-1 bg-gray-300 rounded">
            <div
              className="absolute h-full bg-black rounded"
              style={{
                left: `${((priceRange.min - 25) / 20) * 100}%`,
                width: `${((priceRange.max - priceRange.min) / 20) * 100}%`,
              }}
            ></div>
            <div className="absolute -top-1.5 -ml-2">
              <div className="w-4 h-4 bg-white border-2 border-black rounded-full cursor-pointer shadow-lg"></div>
            </div>
            <div className="absolute -top-1.5 -ml-2 right-0">
              <div className="w-4 h-4 bg-white border-2 border-black rounded-full cursor-pointer shadow-lg"></div>
            </div>
          </div>
          <div className="flex justify-between text-sm text-gray-600 font-medium">
            <span>${priceRange.min}</span>
            <span>${priceRange.max}</span>
          </div>
        </div>
      </div>

      {/* Size Filter */}
      <div className="border-t border-gray-200 pt-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4">
          Size
        </h3>
        <div className="flex flex-col  gap-4">
          {sizes.map((size) => (
            <button
              key={size}
              onClick={() => onSizeChange(size)}
              className={`py-2 text-sm font-medium rounded transition-all duration-200 w-full hover:bg-black hover:text-white ${
                selectedSize === size
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Color Filter */}
      <div className="border-t border-gray-200 pt-6 flex flex-col  gap-4">
        <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4">
          Color
        </h3>
        <div className="flex flex-col gap-4">
          {colors.map((color) => (
            <button
              key={color}
              onClick={() => onColorChange(color)}
              className={`py-2 text-sm font-medium rounded transition-all duration-200 w-full hover:bg-black hover:text-white  ${
                selectedColor === color
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {color}
            </button>
          ))}
        </div>
      </div>

      {/* Season Filter */}
      <div className="border-t border-gray-200 pt-6 flex flex-col gap-4">
        <h3 className="text-lg font-bold uppercase tracking-wide text-gray-900 mb-4">
          Season
        </h3>
        <div className="flex flex-col gap-4">
          {seasons.map((season) => (
            <button
              key={season}
              onClick={() => onSeasonChange(season)}
              className={`py-2 text-sm font-medium rounded transition-all duration-200 w-full hover:bg-black hover:text-white  ${
                selectedSeason === season
                  ? "bg-gray-900 text-white border-gray-900"
                  : "bg-white text-gray-700 border-gray-300 hover:border-gray-400"
              }`}
            >
              {season}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
