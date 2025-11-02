"use client";
import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Heart } from "lucide-react";
import { useState, useEffect } from "react";

export default function RelatedProductsSlider({ products = [] }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Duplicate products for infinite loop
  const duplicatedProducts = [...products, ...products, ...products];

  // Auto slide
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => prev + 1);
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => prev + 1);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => prev - 1);
  };

  // Calculate the actual index for display (for dots)
  const actualIndex = currentSlide % products.length;

  // Get visible slides with opacity
  const getSlideOpacity = (index) => {
    const totalSlides = duplicatedProducts.length;
    const currentPosition = (index - currentSlide + totalSlides) % totalSlides;

    // الصورة الوسطى (المركزية) - واضحة
    if (currentPosition === 1) return "opacity-100";
    // الصور الجانبية - معتمة
    if (currentPosition === 0 || currentPosition === 2) return "";
    // باقي الصور - مخفية
    return "opacity-0";
  };

  return (
    <section className="py-12 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-2xl md:text-3xl font-light text-gray-800 mb-8">
            You May Also Like
          </h2>
        </div>

        {/* Products Slider */}
        <div className="relative">
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * (100 / 3)}%)` }}
            >
              {/* Duplicate items for infinite loop */}
              {duplicatedProducts.map((product, index) => (
                <div
                  key={index}
                  className={`w-1/3 shrink-0 px-4 transition-opacity duration-500 ${getSlideOpacity(
                    index
                  )}`}
                >
                  <div className="group relative bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300">
                    <div className="relative overflow-hidden">
                      <Link href={`/product-page?id=${product.id}`}>
                        <Image
                          src={product.image}
                          alt={product.name}
                          width={400}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </Link>

                      {/* Overlay - يظهر فقط على الصورة الواضحة (الوسطى) */}
                      <div
                        className={`absolute inset-0 transition-all duration-300 ${
                          getSlideOpacity(index) === "opacity-100"
                            ? "bg-black/0 group-hover:bg-black/50"
                            : "bg-black/60"
                        } flex items-end p-6`}
                      >
                        <div
                          className={`text-white w-full transition-all duration-300 ${
                            getSlideOpacity(index) === "opacity-100"
                              ? "transform translate-y-4 group-hover:translate-y-0 opacity-0 group-hover:opacity-100"
                              : "opacity-70"
                          }`}
                        >
                          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-0">
                            <div>
                              <h3 className="text-sm uppercase font-light mb-1 truncate max-w-[140px] sm:max-w-none">
                                {product.name}
                              </h3>
                              <span className="text-base sm:text-lg font-bold">
                                ${product.price}
                              </span>
                            </div>
                            <button className="flex items-center gap-1 text-xs sm:text-sm mt-2 sm:mt-0">
                              <Heart className="w-4 h-4" />
                              {product.likes || 0}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronLeft className="w-6 h-6 text-gray-700" />
          </button>
          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white p-3 rounded-full shadow-lg hover:bg-gray-100 transition-colors duration-300 z-10"
          >
            <ChevronRight className="w-6 h-6 text-gray-700" />
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center space-x-3 mt-8">
            {products.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === actualIndex
                    ? "bg-gray-700 w-8"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
