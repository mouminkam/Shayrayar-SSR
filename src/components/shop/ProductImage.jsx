"use client";
import Image from "next/image";

export default function ProductImage({ product }) {
  const placeholderFallback = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect fill='%23ddd' width='500' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";
  const imageUrl = product?.image || placeholderFallback;
  
  return (
    <div className="py-8 sm:py-12 lg:py-16 rounded-xl h-full flex items-center justify-center relative">
      <div className="relative flex justify-center items-center shrink-0 w-full">
        <div className="absolute z-0">
          <Image
            src="/img/food-items/circleShape2.png"
            alt="shape"
            width={500}
            height={500}
            className="w-64 h-64 sm:w-80 sm:h-80 lg:w-105 lg:h-105 opacity-80"
            unoptimized={true}
          />
        </div>

        <div className="relative z-10">
          <div className="relative">
            <div className="absolute inset-0 bg-linear-to-br from-theme3/20 to-theme/20 rounded-full blur-2xl opacity-50 group-hover:opacity-75 transition-opacity duration-500"></div>
            
            <Image
              src={imageUrl}
              alt={product?.title || "Product"}
              width={500}
              height={500}
              className="w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-full relative z-10 shadow-2xl shadow-theme3/90"
              unoptimized={true}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
