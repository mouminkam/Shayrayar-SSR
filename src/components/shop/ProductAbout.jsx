"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Facebook, Youtube, Twitter, Instagram, Plus, Minus, Star } from "lucide-react";
import { formatCurrency } from "../../lib/utils/formatters";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";

export default function ProductAbout({ product }) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  
  const [quantity, setQuantity] = useState(1);
  const isInWishlistState = product?.id ? isInWishlist(product.id) : false;

  // Handle add to cart
  const handleAddToCart = () => {
    if (!product) return;
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to cart");
      router.push("/login");
      return;
    }
    
    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          title: product.title,
        });
      }
      toastSuccess(`${quantity} x ${product.title} added to cart`);
      setQuantity(1);
    } catch {
      toastError("Failed to add product to cart");
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async () => {
    if (!product) return;
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to wishlist");
      router.push("/login");
      return;
    }
    
    try {
      if (isInWishlistState) {
        const result = await removeFromWishlist(product.id);
        if (result.success) {
          toastSuccess(`${product.title} removed from wishlist`);
        } else {
          if (result.requiresAuth) {
            router.push("/login");
          }
          toastError(result.error || "Failed to remove from wishlist");
        }
      } else {
        const result = await addToWishlist({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          title: product.title,
        });
        if (result.success) {
          toastSuccess(`${product.title} added to wishlist`);
        } else {
          if (result.requiresAuth) {
            router.push("/login");
          }
          toastError(result.error || "Failed to add to wishlist");
        }
      }
    } catch {
      toastError("Failed to update wishlist");
    }
  };

  const handleQuantityChange = (delta) => {
    setQuantity((prev) => Math.max(1, prev + delta));
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
      className="product-about h-full flex flex-col"
    >
      {/* Title and Price */}
      <div className="title-wrapper flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <motion.h2
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="product-title text-white font-['Epilogue',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-black leading-tight"
        >
          {product?.title || "Product"}
        </motion.h2>
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="price text-theme font-['Epilogue',sans-serif] text-4xl sm:text-5xl lg:text-6xl font-black"
        >
          {product?.price ? formatCurrency(product.price) : "$0.00"}
        </motion.div>
      </div>

      {/* Rating */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="product-rating pb-6 mb-6 border-b border-white/10"
      >
        <div className="star-rating flex items-center gap-2 mb-3">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-theme3 text-theme3 transform hover:scale-110 transition-transform duration-300"
            />
          ))}
        </div>
        <span className="woocommerce-review-link text-text text-sm sm:text-base inline-flex items-center gap-1">
          <span>(2 customer reviews)</span>
        </span>
      </motion.div>

      {/* Description */}
      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
        className="text text-white text-base sm:text-lg font-['Roboto',sans-serif] font-normal leading-relaxed mb-8"
      >
        {product?.description || product?.longDescription || "No description available."}
      </motion.p>

      {/* Actions */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.7 }}
        className="actions mb-8"
      >
        <div className="quantity flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
          <p className="text-white text-lg font-['Epilogue',sans-serif] font-semibold mb-0">
            Quantity
          </p>

          <div className="qty-wrapper flex items-center gap-0 shadow-lg rounded-lg overflow-hidden">
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="quantity-minus qty-btn w-12 h-12 bg-white text-text hover:bg-theme hover:text-white transition-all duration-300 flex items-center justify-center border-r border-gray-200"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="w-4 h-4" />
            </motion.button>
            <input
              type="number"
              className="qty-input w-20 h-12 text-center border-y border-gray-200 bg-white text-title text-lg font-bold px-2 outline-none focus:ring-2 focus:ring-theme3 focus:border-theme3 transition-all"
              step="1"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="quantity-plus qty-btn w-12 h-12 bg-white text-text hover:bg-theme hover:text-white transition-all duration-300 flex items-center justify-center border-l border-gray-200"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="w-4 h-4" />
            </motion.button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
            <button
              onClick={handleAddToCart}
              className="theme-btn group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-theme3 font-['Epilogue',sans-serif] text-base font-semibold hover:bg-theme3 hover:border-theme3 transition-all duration-300 rounded-xl backdrop-blur-sm hover:shadow-lg hover:shadow-theme3/30"
            >
              <ShoppingCart className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
              Add to Cart
            </button>
          </motion.div>
          <motion.div
            whileHover={{ scale: 1.03, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="flex-1 sm:flex-none"
          >
            <button
              onClick={handleWishlistToggle}
              className={`theme-btn group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-theme3 font-['Epilogue',sans-serif] text-base font-semibold hover:bg-theme3 hover:border-theme3 transition-all duration-300 rounded-xl backdrop-blur-sm hover:shadow-lg hover:shadow-theme3/30 ${
                isInWishlistState ? "bg-theme3/20" : ""
              }`}
            >
              <Heart className={`w-5 h-5 mr-2 transform group-hover:scale-110 transition-all duration-300 ${
                isInWishlistState ? "fill-white" : ""
              }`} />
              {isInWishlistState ? "Remove from Wishlist" : "Add to Wishlist"}
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Share */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="share flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-auto pt-6 border-t border-white/10"
      >
        <h6 className="text-white font-['Epilogue',sans-serif] text-base sm:text-lg font-semibold m-0">
          Share with friends
        </h6>
        <ul className="social-media flex items-center gap-3">
          {[
            { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" },
            { icon: Youtube, href: "https://www.youtube.com", label: "YouTube" },
            { icon: Twitter, href: "https://www.x.com", label: "Twitter" },
            { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" },
          ].map(({ icon: Icon, href, label }, index) => (
            <li key={index}>
              <motion.div whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                <Link
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 backdrop-blur-sm text-white border border-white/20 rounded-full hover:bg-white hover:text-theme3 hover:border-theme3 transition-all duration-300 group"
                  aria-label={label}
                >
                  <Icon className="w-4 h-4 group-hover:scale-110 transition-transform duration-300" />
                </Link>
              </motion.div>
            </li>
          ))}
        </ul>
      </motion.div>
    </motion.div>
  );
}

