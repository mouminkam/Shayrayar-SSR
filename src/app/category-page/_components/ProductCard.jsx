"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingCart } from "lucide-react";

export default function ProductCard({ product }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="group relative cursor-pointer bg-white border cursor-pointer border-gray-200 rounded-lg overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      
    >
      {/* Discount Badge */}
      {product.discount && (
        <div className="absolute top-3 right-3 bg-black text-white text-xs font-bold px-2 py-1 rounded z-10">
          -{product.discount}%
        </div>
      )}

      {/* Product Image */}
      <div className="relative w-full aspect-[3/4] overflow-hidden shrink-0">
        <Image
          src={product.image}
          alt={product.name}
          fill
          sizes="(max-width: 640px) 100vw,
                 (max-width: 1024px) 50vw,
                 33vw"
          className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
          priority={true}
        />

        {/* Action Buttons */}
        <div
          className={`absolute bottom-3 right-3 flex gap-2 transition-opacity duration-300 ${
            isHovered ? "opacity-100" : "opacity-0"
          }`}
        >
          <button
            aria-label="Add to wishlist"
            className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110"
          >
            <Heart className="w-5 h-5 text-gray-600" />
          </button>
          <button className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-110">
            <ShoppingCart className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <p className="text-gray-500 text-xs uppercase tracking-wide mb-1">
          {product.category}
        </p>
        <h3 className="font-medium text-gray-900 mb-2 line-clamp-2">
          {product.name}
        </h3>
        <div className="flex items-center gap-2 mt-auto">
          {product.originalPrice && (
            <span className="text-gray-400 text-sm line-through">
              ${product.originalPrice}
            </span>
          )}
          <span className="font-bold text-gray-900">${product.price}</span>
        </div>
      </div>
    </div>
  );
}
