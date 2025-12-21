"use client";
import { useCallback } from "react";
import useCartStore from "../store/cartStore";
import useToastStore from "../store/toastStore";
import useAuthStore from "../store/authStore";
import { validateProductForCart, buildProductCartItem, getCustomizationText } from "../lib/utils/cartHelpers";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../locales/i18n/getTranslation";

/**
 * Hook to handle adding products to cart
 * @returns {Function} handleAddToCart function
 */
export function useAddToCart() {
  const { addToCart } = useCartStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  const { lang } = useLanguage();

  const handleAddToCart = useCallback(
    (product, customization = {}, quantity = 1) => {
      // Validate product (use isValid from customization if available, otherwise validate)
      const isValid = customization.isValid !== undefined 
        ? customization.isValid 
        : validateProductForCart(product, customization).isValid;
      
      if (!isValid) {
        const validation = validateProductForCart(product, customization);
        toastError(t(lang, validation.error) || validation.error || t(lang, "please_select_required_options"));
        return;
      }

      try {
        // Build cart item
        const cartItem = buildProductCartItem(product, customization, quantity);

        // Add to cart (quantity times)
        for (let i = 0; i < quantity; i++) {
          addToCart(cartItem);
        }

        // Get customization text for toast
        const selectedSize = product?.sizes?.find((s) => s.id === customization.sizeId) || null;
        const selectedIngredients = product?.ingredients?.filter((ing) =>
          customization.ingredientIds?.includes(ing.id)
        ) || [];
        const customizationText = getCustomizationText(selectedSize, selectedIngredients, t, lang);

        // Show success message
        toastSuccess(
          `${quantity} x ${product.title}${customizationText} ${t(lang, "added_to_cart")}`
        );

        // Show reminder to login if not authenticated
        if (!isAuthenticated) {
          // Use a small delay to show the login reminder after the success message
          setTimeout(() => {
            toastError(t(lang, "please_login_before_checkout") || "Please login before checkout");
          }, 500);
        }
      } catch (error) {
        toastError(t(lang, "failed_add_cart"));
      }
    },
    [addToCart, toastSuccess, toastError, isAuthenticated, lang]
  );

  return handleAddToCart;
}

