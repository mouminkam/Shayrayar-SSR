"use client";

import { useState, useEffect, useCallback } from "react";
import { Filter as FilterIcon, X } from "lucide-react";
import CategoryBanner from "./_components/CategoryBanner";
import CategoryNavigation from "./_components/CategoryNavigation";
import FilterSidebar from "./_components/FilterSidebar";
import MobileFilterDrawer from "./_components/MobileFilterDrawer";
import ProductGrid from "./_components/ProductGrid";
import PaginationControls from "./_components/PaginationControls";

export default function CategoryPage() {
  const [showAllProducts, setShowAllProducts] = useState(false);
  const [visibleProducts, setVisibleProducts] = useState(6);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [selectedSeason, setSelectedSeason] = useState("");
  const [priceRange, setPriceRange] = useState({ min: 25, max: 45 });
  const [activeCategory, setActiveCategory] = useState("All");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Products state - will be populated from API
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [totalPages] = useState(6);

  const categories = [
    "All",
    "Collection",
    "Heels",
    "Flats",
    "Boots",
    "Sandals",
    "Sneakers",
    "Bags",
  ];

  const sizes = ["36", "37", "38", "39", "40", "41"];
  const colors = ["White", "Blue", "Green", "Silver"];
  const seasons = ["Summer", "Spring", "Autumn", "Winter"];

  // Fetch products from API
  const fetchProducts = useCallback(async () => {
    setIsLoading(true);
    try {
      // Build query parameters based on filters
      const params = new URLSearchParams();
      params.append("page", currentPage.toString());
      params.append("limit", showAllProducts ? "136" : "6");
      
      if (activeCategory !== "All") {
        params.append("category", activeCategory);
      }
      if (selectedSize) {
        params.append("size", selectedSize);
      }
      if (selectedColor) {
        params.append("color", selectedColor);
      }
      if (selectedSeason) {
        params.append("season", selectedSeason);
      }
      params.append("minPrice", priceRange.min.toString());
      params.append("maxPrice", priceRange.max.toString());

      // TODO: Replace with your actual API endpoint
      // const response = await fetch(`/api/products?${params.toString()}`);
      // const data = await response.json();
      // setProducts(data.products);
      // setTotalPages(data.totalPages);

      // For now, use mock data - remove this when API is ready
      const mockProducts = getMockProducts();
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
      // Fallback to mock data on error
      const mockProducts = getMockProducts();
      setProducts(mockProducts);
      setFilteredProducts(mockProducts);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, activeCategory, selectedSize, selectedColor, selectedSeason, priceRange, showAllProducts]);

  // Apply filters to products
  const applyFilters = useCallback(() => {
    let filtered = [...products];

    // Filter by category
    if (activeCategory !== "All") {
      filtered = filtered.filter((product) =>
        product.category.toLowerCase().includes(activeCategory.toLowerCase())
      );
    }

    // Filter by price
    filtered = filtered.filter(
      (product) =>
        product.price >= priceRange.min && product.price <= priceRange.max
    );

    // Filter by size (if product has size property)
    if (selectedSize) {
      filtered = filtered.filter((product) =>
        product.sizes?.includes(selectedSize)
      );
    }

    // Filter by color
    if (selectedColor) {
      filtered = filtered.filter((product) =>
        product.colors?.includes(selectedColor) ||
        product.color?.toLowerCase() === selectedColor.toLowerCase()
      );
    }

    // Filter by season
    if (selectedSeason) {
      filtered = filtered.filter((product) =>
        product.seasons?.includes(selectedSeason) ||
        product.season?.toLowerCase() === selectedSeason.toLowerCase()
      );
    }

    setFilteredProducts(filtered);
  }, [products, activeCategory, selectedSize, selectedColor, selectedSeason, priceRange]);

  // Fetch products when filters change
  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  // Apply filters when products or filter values change
  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  const handleShowAllProducts = () => {
    if (showAllProducts) {
      setVisibleProducts(6);
      setShowAllProducts(false);
    } else {
      setVisibleProducts(136);
      setShowAllProducts(true);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Reset filters
  const handleResetFilters = () => {
    setSelectedSize("");
    setSelectedColor("");
    setSelectedSeason("");
    setPriceRange({ min: 25, max: 45 });
    setActiveCategory("All");
  };

  // Get displayed products
  const displayedProducts = showAllProducts
    ? filteredProducts
    : filteredProducts.slice(0, visibleProducts);

  return (
    <div className="min-h-screen bg-white">
      {/* Banner Section */}
      <CategoryBanner />

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Category Navigation */}
        <CategoryNavigation
          categories={categories}
          activeCategory={activeCategory}
          onCategoryChange={setActiveCategory}
        />

        {/* Responsive Filter Button for mobile/tablet */}
        <div className="lg:hidden flex justify-between items-center mb-6">
          <button
            onClick={handleResetFilters}
            className="text-sm text-gray-600 hover:text-gray-900 underline"
          >
            Reset Filters
          </button>
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center px-5 py-3 bg-gray-900 text-white rounded-lg gap-2 shadow-lg font-semibold focus:outline-none"
          >
            <FilterIcon className="w-5 h-5" />
            <span>Filter</span>
          </button>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 mt-8">
          {/* Sidebar Filters - Desktop */}
          <aside className="lg:col-span-1 hidden lg:block">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold">Filters</h2>
              <button
                onClick={handleResetFilters}
                className="text-sm text-gray-600 hover:text-gray-900 underline"
              >
                Reset
              </button>
            </div>
            <FilterSidebar
              priceRange={priceRange}
              onPriceRangeChange={setPriceRange}
              sizes={sizes}
              selectedSize={selectedSize}
              onSizeChange={setSelectedSize}
              colors={colors}
              selectedColor={selectedColor}
              onColorChange={setSelectedColor}
              seasons={seasons}
              selectedSeason={selectedSeason}
              onSeasonChange={setSelectedSeason}
            />
          </aside>

          {/* Mobile Filter Drawer */}
          {isFilterOpen && (
            <MobileFilterDrawer onClose={() => setIsFilterOpen(false)}>
              <div className="flex justify-between items-center mb-4 sticky top-0 z-50 bg-white py-2 mt-20">
                <h2 className="text-lg font-bold">Filters</h2>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  aria-label="Close"
                  className="p-2 rounded-full hover:bg-gray-100 transition"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              <FilterSidebar
                priceRange={priceRange}
                onPriceRangeChange={setPriceRange}
                sizes={sizes}
                selectedSize={selectedSize}
                onSizeChange={setSelectedSize}
                colors={colors}
                selectedColor={selectedColor}
                onColorChange={setSelectedColor}
                seasons={seasons}
                selectedSeason={selectedSeason}
                onSeasonChange={setSelectedSeason}
              />
              <div className="mt-8 flex justify-center gap-4">
                <button
                  onClick={handleResetFilters}
                  className="flex-1 bg-gray-200 text-gray-800 rounded-lg px-6 py-3 font-bold text-base shadow hover:bg-gray-300 transition-all duration-200"
                >
                  Reset
                </button>
                <button
                  onClick={() => setIsFilterOpen(false)}
                  className="flex-1 bg-black text-white rounded-lg px-6 py-3 font-bold text-base shadow hover:bg-gray-800 transition-all duration-200"
                >
                  Done
                </button>
              </div>
            </MobileFilterDrawer>
          )}

          {/* Product Grid */}
          <section className="lg:col-span-3">
            {isLoading ? (
              <div className="text-center py-12">
                <p className="text-gray-600">Loading products...</p>
              </div>
            ) : displayedProducts.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-gray-600">No products found with these filters.</p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 text-gray-900 underline hover:text-gray-700"
                >
                  Reset filters
                </button>
              </div>
            ) : (
              <>
                <ProductGrid products={displayedProducts} />
                <PaginationControls
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={handlePageChange}
                  showAllProducts={showAllProducts}
                  onShowAllProducts={handleShowAllProducts}
                />
              </>
            )}
          </section>
        </div>
      </main>
    </div>
  );
}

// Mock products data - remove this when API is ready
function getMockProducts() {
  return [
    {
      id: 1,
      name: "Sport Brown Sneakers",
      category: "Shoes, Sneakers",
      price: 35,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["36", "37", "38", "39", "40"],
      colors: ["Brown"],
      seasons: ["Summer", "Spring"],
    },
    {
      id: 2,
      name: "Sport Brown Sneakers",
      category: "Shoes, Sneakers",
      price: 35,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["38", "39", "40", "41"],
      colors: ["Brown"],
      seasons: ["Summer"],
    },
    {
      id: 3,
      name: "Silver Stiletto",
      category: "Shoes, Stiletto",
      price: 36,
      originalPrice: 40,
      discount: 10,
      image: "/images/img20.jpg",
      sizes: ["36", "37", "38"],
      colors: ["Silver"],
      seasons: ["Spring", "Autumn"],
    },
    {
      id: 4,
      name: "White Classic Stiletto",
      category: "Shoes, Stiletto",
      price: 45,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["37", "38", "39", "40"],
      colors: ["White"],
      seasons: ["Summer", "Spring"],
    },
    {
      id: 5,
      name: "Silver Stiletto",
      category: "Shoes, Stiletto",
      price: 36,
      originalPrice: 40,
      discount: 10,
      image: "/images/img20.jpg",
      sizes: ["38", "39", "40"],
      colors: ["Silver"],
      seasons: ["Autumn", "Winter"],
    },
    {
      id: 6,
      name: "Sport Brown Sneakers",
      category: "Shoes, Sneakers",
      price: 35,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["39", "40", "41"],
      colors: ["Brown"],
      seasons: ["Summer"],
    },
    {
      id: 7,
      name: "White Classic Stiletto",
      category: "Shoes, Stiletto",
      price: 45,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["36", "37", "38"],
      colors: ["White"],
      seasons: ["Spring"],
    },
    {
      id: 9,
      name: "Silver Stiletto",
      category: "Shoes, Stiletto",
      price: 36,
      originalPrice: 40,
      discount: 10,
      image: "/images/img20.jpg",
      sizes: ["39", "40", "41"],
      colors: ["Silver"],
      seasons: ["Winter"],
    },
    {
      id: 10,
      name: "Sport Brown Sneakers",
      category: "Shoes, Sneakers",
      price: 35,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["36", "37", "38"],
      colors: ["Brown"],
      seasons: ["Summer", "Spring"],
    },
    {
      id: 11,
      name: "White Classic Stiletto",
      category: "Shoes, Stiletto",
      price: 45,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["38", "39", "40"],
      colors: ["White"],
      seasons: ["Autumn"],
    },
    {
      id: 12,
      name: "Silver Stiletto",
      category: "Shoes, Stiletto",
      price: 36,
      originalPrice: 40,
      discount: 10,
      image: "/images/img20.jpg",
      sizes: ["37", "38", "39"],
      colors: ["Silver"],
      seasons: ["Spring", "Summer"],
    },
    {
      id: 13,
      name: "Sport Brown Sneakers",
      category: "Shoes, Sneakers",
      price: 35,
      originalPrice: null,
      discount: null,
      image: "/images/img20.jpg",
      sizes: ["40", "41"],
      colors: ["Brown"],
      seasons: ["Summer"],
    },
  ];
}