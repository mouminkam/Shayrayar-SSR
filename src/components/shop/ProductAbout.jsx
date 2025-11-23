"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Heart, Facebook, Youtube, Twitter, Instagram, Plus, Minus, Star } from "lucide-react";
import { formatCurrency } from "../../lib/utils/formatters";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";
import ProductCustomization from "./ProductCustomization";

// Social media links - memoized outside component
const SOCIAL_LINKS = [
  { icon: Facebook, href: "https://www.facebook.com", label: "Facebook" },
  { icon: Youtube, href: "https://www.youtube.com", label: "YouTube" },
  { icon: Twitter, href: "https://www.x.com", label: "Twitter" },
  { icon: Instagram, href: "https://www.instagram.com", label: "Instagram" },
];

export default function ProductAbout({ product }) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState(() => ({
    sizeId: product?.default_size_id || null,
    ingredientIds: [],
    finalPrice: product?.price || product?.base_price || 0,
  }));

  const isInWishlistState = product?.id ? isInWishlist(product.id) : false;

  const handleCustomizationChange = useCallback((data) => {
    setCustomization(data);
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    if (!isAuthenticated) {
      toastError("Please login to add items to cart");
      router.push("/login");
      return;
    }

    // Validation: Check if size is required but not selected
    if (product?.has_sizes && !customization.sizeId) {
      toastError("Please select a size");
      return;
    }

    // Get selected size and ingredients data
    const selectedSize = product?.sizes?.find((s) => s.id === customization.sizeId) || null;
    const selectedIngredients = product?.ingredients?.filter((ing) =>
      customization.ingredientIds.includes(ing.id)
    ) || [];

    try {
      for (let i = 0; i < quantity; i++) {
        addToCart({
          id: product.id,
          name: product.title,
          price: customization.finalPrice, // Use final price after customization
          base_price: product.base_price || product.price,
          image: product.image,
          title: product.title,
          // Size information
          size_id: customization.sizeId,
          size_name: selectedSize?.name || null,
          // Ingredients information
          ingredients: customization.ingredientIds,
          ingredients_data: selectedIngredients,
          // Final calculated price
          final_price: customization.finalPrice,
        });
      }

      const customizationText = [
        selectedSize?.name,
        selectedIngredients.length > 0 && `${selectedIngredients.length} add-on(s)`,
      ]
        .filter(Boolean)
        .join(", ");

      toastSuccess(
        `${quantity} x ${product.title}${customizationText ? ` (${customizationText})` : ""} added to cart`
      );
      setQuantity(1);
    } catch {
      toastError("Failed to add product to cart");
    }
  };

  const handleWishlistToggle = async () => {
    if (!product) return;

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
    <div className="product-about h-full flex flex-col">
      <div className="title-wrapper flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 sm:mb-6 gap-4">
        <h2 className="product-title text-white  text-3xl sm:text-4xl lg:text-5xl font-black leading-tight">
          {product?.title || "Product"}
        </h2>
        <div className="price text-theme  text-4xl sm:text-5xl lg:text-6xl font-black">
          {formatCurrency(customization.finalPrice)}
        </div>
      </div>

      <div className="product-rating pb-6 mb-6 border-b border-white/10">
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
      </div>

      <p className="text text-white text-base sm:text-lg  font-normal leading-relaxed mb-8">
        {product?.description || product?.longDescription || "No description available."}
      </p>

      {/* Product Customization (Sizes & Ingredients) */}
      <ProductCustomization
        product={product}
        onCustomizationChange={handleCustomizationChange}
      />

      <div className="actions mb-8">
        <div className="quantity flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-8 mb-8">
          <p className="text-white text-lg  font-semibold mb-0">
            Quantity
          </p>

          <div className="qty-wrapper flex items-center gap-0 shadow-lg rounded-lg overflow-hidden">
            <button
              type="button"
              className="quantity-minus qty-btn w-12 h-12 bg-white text-text hover:bg-theme hover:text-white transition-all duration-300 flex items-center justify-center border-r border-gray-200"
              onClick={() => handleQuantityChange(-1)}
            >
              <Minus className="w-4 h-4" />
            </button>
            <input
              type="number"
              className="qty-input w-20 h-12 text-center border-y border-gray-200 bg-white text-title text-lg font-bold px-2 outline-none focus:ring-2 focus:ring-theme3 focus:border-theme3 transition-all"
              step="1"
              min="1"
              max="100"
              value={quantity}
              onChange={(e) => setQuantity(Math.max(1, Number(e.target.value)))}
            />
            <button
              type="button"
              className="quantity-plus qty-btn w-12 h-12 bg-white text-text hover:bg-theme hover:text-white transition-all duration-300 flex items-center justify-center border-l border-gray-200"
              onClick={() => handleQuantityChange(1)}
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <button
            onClick={handleAddToCart}
            className="theme-btn group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-theme3  text-base font-semibold hover:bg-theme3 hover:border-theme3 transition-all duration-300 rounded-xl backdrop-blur-sm hover:shadow-lg hover:shadow-theme3/30"
          >
            <ShoppingCart className="w-5 h-5 mr-2 transform group-hover:scale-110 transition-transform duration-300" />
            Add to Cart
          </button>
          <button
            onClick={handleWishlistToggle}
            className={`theme-btn group inline-flex items-center justify-center w-full sm:w-auto px-8 py-4 bg-transparent text-white border-2 border-theme3  text-base font-semibold hover:bg-theme3 hover:border-theme3 transition-all duration-300 rounded-xl backdrop-blur-sm hover:shadow-lg hover:shadow-theme3/30 ${isInWishlistState ? "bg-theme3/20" : ""
              }`}
          >
            <Heart className={`w-5 h-5 mr-2 transform group-hover:scale-110 transition-all duration-300 ${isInWishlistState ? "fill-white" : ""
              }`} />
            {isInWishlistState ? "Remove from Wishlist" : "Add to Wishlist"}
          </button>
        </div>
      </div>

      <div className="share flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-auto pt-6 border-t border-white/10">
        <h6 className="text-white  text-base sm:text-lg font-semibold m-0">
          Share with friends
        </h6>
        <ul className="social-media flex items-center gap-3">
          {SOCIAL_LINKS.map(({ icon: Icon, href, label }) => (
            <li key={label}>
              <Link
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 flex items-center justify-center bg-white/10 text-white border border-white/20 rounded-full hover:bg-white hover:text-theme3 hover:border-theme3 transition-colors"
                aria-label={label}
              >
                <Icon className="w-4 h-4" />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
