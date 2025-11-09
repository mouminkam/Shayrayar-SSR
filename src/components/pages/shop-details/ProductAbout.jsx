"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShoppingCart, Heart, Facebook, Youtube, Twitter, Instagram, Plus, Minus } from "lucide-react";

export default function ProductAbout() {
  const [quantity, setQuantity] = useState(1);

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <div className="product-about">
      {/* Title and Price */}
      <div className="title-wrapper flex items-center justify-between mb-5">
        <h2 className="product-title text-title font-['Epilogue',sans-serif] text-2xl font-bold">
          Chicken Pizza
        </h2>
        <div className="price text-title font-['Epilogue',sans-serif] text-3xl sm:text-4xl font-bold">
          $69
        </div>
      </div>

      {/* Rating */}
      <div className="product-rating pb-5 mb-5 border-b border-gray-200">
        <div className="star-rating relative w-24 h-5 mb-2 flex items-center">
          <Image
            src="/img/icon/star2.svg"
            alt="rating"
            width={100}
            height={20}
            className="h-5 w-auto"
            unoptimized={true}
          />
        </div>
        <Link
          href="/shop-details"
          className="woocommerce-review-link text-text text-sm hover:text-theme transition-colors duration-300"
        >
          (2 customer reviews)
        </Link>
      </div>

      {/* Description */}
      <p className="text text-text font-['Roboto',sans-serif] text-base font-normal leading-relaxed mb-8">
        Aliquam hendrerit a augue insuscipit. Etiam aliquam massa quis des mauris commodo venenatis
        ligula commodo leez sed blandit convallis dignissim onec vel pellentesque neque.
      </p>

      {/* Actions */}
      <div className="actions mb-6">
        <div className="quantity flex items-center gap-8 mb-8">
          <p className="text-text font-['Roboto',sans-serif] text-base font-normal m-0">
            Quantity
          </p>

          <div className="qty-wrapper flex items-center gap-0">
            <button
              type="button"
              className="quantity-minus qty-btn w-9 h-10 border border-gray-200 bg-white text-text rounded-l-md hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 flex items-center justify-center"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <input
              type="number"
              className="qty-input w-16 h-10 text-center border-y border-gray-200 bg-white text-title text-base font-semibold px-2 outline-none focus:border-theme"
              step="1"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
            <button
              type="button"
              className="quantity-plus qty-btn w-9 h-10 border border-gray-200 bg-white text-text rounded-r-md hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 flex items-center justify-center"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
        <div className="flex items-center gap-4 flex-wrap">
          <Link
            href="/cart"
            className="theme-btn inline-block px-6 py-3 bg-theme text-white font-['Roboto',sans-serif] text-sm font-normal hover:bg-theme2 transition-all duration-300 rounded-md"
          >
            Add to Cart
            <ShoppingCart className="w-4 h-4 inline-block ml-2" />
          </Link>
          <Link
            href="/wishlist"
            className="theme-btn style5 inline-block px-6 py-3 bg-theme2 text-white border border-theme2 font-['Roboto',sans-serif] text-sm font-normal hover:bg-title hover:border-theme transition-all duration-300 rounded-md"
          >
            ADD TO wishlist
            <Heart className="w-4 h-4 inline-block ml-2" />
          </Link>
        </div>
      </div>

      {/* Share */}
      <div className="share flex items-center gap-5">
        <h6 className="text-title font-['Epilogue',sans-serif] text-base font-semibold m-0">
          share with friends
        </h6>
        <ul className="social-media flex items-center gap-2.5">
          <li>
            <Link
              href="https://www.facebook.com"
              className="w-9 h-9 flex items-center justify-center bg-white text-title border border-gray-200 rounded-full hover:bg-theme hover:text-white hover:border-theme transition-all duration-300"
            >
              <Facebook className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.youtube.com"
              className="w-9 h-9 flex items-center justify-center bg-white text-title border border-gray-200 rounded-full hover:bg-theme hover:text-white hover:border-theme transition-all duration-300"
            >
              <Youtube className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.x.com"
              className="w-9 h-9 flex items-center justify-center bg-white text-title border border-gray-200 rounded-full hover:bg-theme hover:text-white hover:border-theme transition-all duration-300"
            >
              <Twitter className="w-3.5 h-3.5" />
            </Link>
          </li>
          <li>
            <Link
              href="https://www.instagram.com"
              className="w-9 h-9 flex items-center justify-center bg-white text-title border border-gray-200 rounded-full hover:bg-theme hover:text-white hover:border-theme transition-all duration-300"
            >
              <Instagram className="w-3.5 h-3.5" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}

