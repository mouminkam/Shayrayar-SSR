"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
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
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  const { lang } = useLanguage();

  const handleAddToCart = useCallback(
    (product, customization = {}, quantity = 1) => {
      // Check authentication
      if (!isAuthenticated) {
        toastError(t(lang, "please_login_add_cart"));
        router.push("/login");
        return;
      }

      // Validate product
      const validation = validateProductForCart(product, customization);
      if (!validation.isValid) {
        toastError(t(lang, validation.error) || validation.error);
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
      } catch (error) {
        toastError(t(lang, "failed_add_cart"));
      }
    },
    [addToCart, toastSuccess, toastError, isAuthenticated, router, lang]
  );

  return handleAddToCart;
}

