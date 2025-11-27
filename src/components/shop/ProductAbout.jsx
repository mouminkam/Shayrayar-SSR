"use client";
import { useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingCart, Facebook, Youtube, Twitter, Instagram, Plus, Minus } from "lucide-react";
import { formatCurrency } from "../../lib/utils/formatters";
import useCartStore from "../../store/cartStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";
import ProductCustomization from "./ProductCustomization";
import { SOCIAL_LINKS } from "../../data/constants";

// Map icon names to lucide-react components
const iconMap = { Facebook, Youtube, Twitter, Instagram };

export default function ProductAbout({ product }) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();

  const [quantity, setQuantity] = useState(1);
  const [customization, setCustomization] = useState(() => ({
    sizeId: product?.default_size_id || null,
    ingredientIds: [],
    finalPrice: product?.price || product?.base_price || 0,
  }));

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
        </div>
      </div>

      <div className="share flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 mt-auto pt-6 border-t border-white/10">
        <h6 className="text-white  text-base sm:text-lg font-semibold m-0">
          Share with friends
        </h6>
        <ul className="social-media flex items-center gap-3">
          {SOCIAL_LINKS.map((social) => {
            const Icon = iconMap[social.icon];
            if (!Icon) return null;
            return (
              <li key={social.label}>
                <Link
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-10 h-10 flex items-center justify-center bg-white/10 text-white border border-white/20 rounded-full hover:bg-white hover:text-theme3 hover:border-theme3 transition-colors"
                  aria-label={social.label}
                >
                  <Icon className="w-4 h-4" />
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
