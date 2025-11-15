"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBasket, Heart, Star } from "lucide-react";

// Format price to always show 2 decimal places
const formatPrice = (price) => {
  return Number(price).toFixed(2);
};

export default function ProductCard({ product, viewMode = "grid" }) {
  if (viewMode === "list") {
    return (
      <div className="relative flex flex-col sm:flex-row mt-0 items-start sm:items-center gap-6 sm:gap-8 p-5 sm:p-6 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="dishes-thumb relative shrink-0">
          <Image
            src={product.image}
            alt={product.title}
            width={150}
            height={150}
            className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full relative z-10"
            unoptimized={true}
          />
          <div className="circle-shape absolute -top-[4.2px] w-[calc(100%+10px)] h-[calc(100%+10px)] left-1/2  transform  -translate-x-1/2 z-0">
            <Image
              src="/img/food-items/circleShape.png"
              alt="shape"
              width={150}
              height={150}
              className="w-full h-full animate-spin-slow"
              unoptimized={true}
            />
          </div>
        </div>
        <div className="dishes-content flex-1 ">
          <Link href="/shop-details">
            <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-bold mb-3 hover:text-theme transition-colors duration-300">
              {product.title}
            </h3>
          </Link>
          <div className="icon absolute top-4 right-4">
            <Link
              href="#"
              className="w-8 h-8 flex items-center justify-center bg-theme2 text-white rounded-full hover:bg-theme transition-all duration-300"
            >
              <Heart className="w-4 h-4" />
            </Link>
          </div>
          <div className="star mb-3 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-theme3 text-theme3"
              />
            ))}
          </div>
          <div className="text text-text font-['Roboto',sans-serif] text-base font-normal leading-relaxed mb-5">
            {product.longDescription || "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy text of the printing and typesetting industry.When an unknown printer took a galley of type"}
          </div>
        <div className="flex items-center justify-between">
        <h6 className="text-theme font-['Epilogue',sans-serif] text-lg font-bold ">
            ${formatPrice(product.price)}
          </h6>
          <Link
            href="/shop-details"
            className="theme-btn style6 inline-flex items-center justify-center px-8 sm:px-8 py-3 bg-theme2 text-white font-['Epilogue',sans-serif] text-sm font-semibold uppercase rounded-full hover:bg-theme hover:text-white transition-all duration-300"
          >
            Order Now <ShoppingBasket className="w-4 h-4 ml-2" />
          </Link>
        </div>
        </div>
      </div>
    );
  }

  // Grid View
  return (
    <div className="dishes-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl text-center transition-all duration-300 hover:-translate-y-2 relative min-h-[200px] flex flex-col">
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex justify-center items-center shrink-0 w-full">
        {/* Circle Shape - Behind the food image */}
        <Image
          src="/img/food-items/circleShape.png"
          alt="shape"
          width={150}
          height={150}
          className="w-51 h-51 -top-[46px] absolute z-0 animate-spin-slow"
          unoptimized={true}
        />

        {/* Food Image - On top */}
        <Image
          src={product.image}
          alt={product.title}
          width={150}
          height={150}
          className="w-48 h-48 object-cover -top-10 relative z-10"
          unoptimized={true}
        />
      </div>
      <div className="item-content mt-20 flex flex-col grow justify-between">
        <div>
          <Link href="/shop-details">
            <h3 className="text-white font-['Epilogue',sans-serif] text-lg sm:text-xl font-bold mb-2 hover:text-theme transition-colors duration-300 line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <p className="text-text font-['Roboto',sans-serif] text-sm sm:text-base mb-4 line-clamp-2">
            {product.description}
          </p>
        </div>
        <div className="mt-auto">
          <div className="star mb-3 flex items-center justify-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-theme3 text-theme3"
              />
            ))}
          </div>
          <h6 className="text-theme font-['Epilogue',sans-serif] text-base sm:text-lg font-bold mb-4">
            ${formatPrice(product.price)}
          </h6>
          <Link
            href="/shop-details"
            className="theme-btn style6 inline-flex items-center justify-center px-8 sm:px-8 py-3 bg-theme2 text-white font-['Epilogue',sans-serif] text-sm font-semibold uppercase rounded-full hover:bg-theme hover:text-white transition-all duration-300"
          >
            Order Now <ShoppingBasket className="w-4 h-4 ml-2" />
          </Link>
        </div>
      </div>
    </div>
  );
}

