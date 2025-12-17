"use client";
import { useState } from "react";
import api from "../api";
import useToastStore from "../store/toastStore";
import { useLanguage } from "../context/LanguageContext";
import { t } from "../locales/i18n/getTranslation";
import { useAddToCart } from "./useAddToCart";
import { transformMenuItemToProduct } from "../lib/utils/productTransform";
import { calculateProductPriceWithCustomizations } from "../lib/utils/productPrice";

/**
 * Hook to manage order actions (cancel, reorder, track)
 * @param {Object} order - Order object
 * @param {string} orderId - Order ID
 * @param {Function} refetchOrder - Function to refetch order data
 * @returns {Object} Actions and states
 */
export function useOrderActions(order, orderId, refetchOrder) {
  const { error: toastError, success: toastSuccess } = useToastStore();
  const { lang } = useLanguage();
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isReorderLoading, setIsReorderLoading] = useState(false);
  const addToCartHook = useAddToCart();

  /**
   * Check if order can be cancelled
   * @returns {boolean} True if order can be cancelled
   */
  const canCancelOrder = () => {
    // إذا لم يتم تحميل البيانات بعد، لا نسمح بالإلغاء
    if (!order) {
      return false;
    }

    const status = order?.status?.toLowerCase();
    const paymentMethod = order?.payment_method?.toLowerCase();
    const paymentIntentId = order?.payment_intent_id;
    const paymentStatus = order?.payment_status?.toLowerCase();
    
    // لا يمكن الإلغاء إذا كان الطلب مكتمل أو ملغي أو تم تسليمه
    if (status === 'completed' || status === 'cancelled' || status === 'delivered') {
      return false;
    }
    
    // Stripe orders: لا يمكن الإلغاء أبداً (بغض النظر عن الحالة)
    // التحقق من payment_method === 'stripe' أو وجود payment_intent_id
    if (paymentMethod === 'stripe' || paymentIntentId) {
      return false;
    }
    
    // أيضاً: إذا كان payment_status === 'paid' و payment_method === 'stripe'
    if (paymentStatus === 'paid' && paymentMethod === 'stripe') {
      return false;
    }
    
    // Cash orders: لا يمكن الإلغاء إذا كان confirmed (تم الدفع فعلياً)
    if (paymentMethod === 'cash' && status === 'confirmed') {
      return false;
    }
    
    // Cash orders: يمكن الإلغاء إذا كان pending (لم يتم الدفع بعد)
    if (paymentMethod === 'cash' && status === 'pending') {
      return true;
    }
    
    // Cash orders: يمكن الإلغاء إذا كان processing (قبل البدء بالتحضير الفعلي)
    if (paymentMethod === 'cash' && status === 'processing') {
      return true;
    }
    
    // Default: لا يمكن الإلغاء
    return false;
  };

  /**
   * Handle cancel order action
   * @param {string} reason - Cancellation reason (optional, uses state if not provided)
   */
  const handleCancelOrder = async (reason = null) => {
    const reasonToUse = reason || cancelReason;
    
    // Validate cancellation reason
    if (!reasonToUse || !reasonToUse.trim()) {
      toastError(t(lang, "please_provide_cancellation_reason"));
      return;
    }

    // Double check if order can still be cancelled (status might have changed)
    if (!canCancelOrder()) {
      const paymentMethod = order?.payment_method?.toLowerCase();
      const paymentIntentId = order?.payment_intent_id;
      const status = order?.status?.toLowerCase();
      
      // Stripe orders cannot be cancelled at all
      if (paymentMethod === 'stripe' || paymentIntentId) {
        toastError(t(lang, "cannot_cancel_paid_order"));
      } else if (paymentMethod === 'cash' && status === 'confirmed') {
        toastError(t(lang, "cannot_cancel_paid_order"));
      } else if (status === 'completed' || status === 'delivered') {
        toastError(t(lang, "cannot_cancel_completed_order"));
      } else {
        toastError(t(lang, "cannot_cancel_order"));
      }
      setShowCancelModal(false);
      setCancelReason("");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await api.orders.cancelOrder(orderId, { reason: reasonToUse });
      
      if (response.success) {
        toastSuccess(t(lang, "order_cancelled_successfully"));
        setShowCancelModal(false);
        setCancelReason("");
        // Refresh order data
        if (refetchOrder) {
          refetchOrder();
        }
      } else {
        // Backend might reject cancellation - show appropriate message
        const errorMessage = response.message || t(lang, "failed_to_cancel_order");
        toastError(errorMessage);
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      const errorMessage = error?.response?.data?.message || error?.message || t(lang, "failed_to_cancel_order");
      toastError(errorMessage);
    } finally {
      setIsCancelling(false);
    }
  };

  /**
   * Handle track order action
   */
  const handleTrackOrder = () => {
    // Check if tracking_url is available
    if (!order?.tracking_url) {
      toastError(t(lang, "tracking_not_available"));
      return;
    }

    // Open tracking URL in a new window
    window.open(order.tracking_url, '_blank', 'noopener,noreferrer');
  };

  /**
   * Handle reorder action
   */
  const handleReorder = async () => {
    if (!order?.id) {
      toastError(t(lang, "invalid_order"));
      return;
    }

    setIsReorderLoading(true);
    try {
      // Call reorder API endpoint
      const response = await api.orders.reorderOrder(order.id);
      
      if (!response?.success || !response?.data) {
        toastError(response?.message || t(lang, "failed_to_reorder"));
        setIsReorderLoading(false);
        return;
      }

      // Extract items and missing_items from response
      const { items = [], missing_items = [] } = response.data;

      // Get order items for fallback data (if reorder API doesn't include all customization data)
      const orderItemsMap = new Map();
      if (order?.order_items && Array.isArray(order.order_items)) {
        order.order_items.forEach((orderItem) => {
          orderItemsMap.set(orderItem.menu_item_id, orderItem);
        });
      }

      // Handle missing items warning
      if (missing_items && missing_items.length > 0) {
        const missingText = missing_items.length === 1 ? t(lang, "item") : t(lang, "items");
        toastError(`${missing_items.length} ${missingText} ${t(lang, "no_longer_available") || "are no longer available"}`);
      }

      // Check if there are any items to add
      if (!items || items.length === 0) {
        toastError(t(lang, "no_items_to_add"));
        setIsReorderLoading(false);
        return;
      }

      // Add each item to cart
      let addedCount = 0;
      let failedCount = 0;

      for (const item of items) {
        try {
          // Get fallback data from order.order_items if available
          const fallbackOrderItem = orderItemsMap.get(item.menu_item_id);
          
          // Fetch menu item details
          const menuItemResponse = await api.menu.getMenuItemById(item.menu_item_id);
          
          if (!menuItemResponse?.success || !menuItemResponse?.data) {
            console.error(`Failed to fetch menu item ${item.menu_item_id}`);
            failedCount++;
            continue;
          }

          // Extract menu item data, option_groups, and customizations
          const menuItemData = menuItemResponse.data.item || menuItemResponse.data;
          const optionGroups = menuItemResponse.data.option_groups || [];
          const customizations = menuItemResponse.data.customizations || null;

          if (!menuItemData) {
            console.error(`Menu item data not found for ID ${item.menu_item_id}`);
            failedCount++;
            continue;
          }

          // Transform menu item to product object
          const product = transformMenuItemToProduct(menuItemData, optionGroups, lang, customizations);
          
          if (!product) {
            console.error(`Failed to transform product ${item.menu_item_id}`);
            failedCount++;
            continue;
          }

          // Handle selected_ingredients (use from item or fallback)
          const ingredientIds = Array.isArray(item.selected_ingredients) 
            ? item.selected_ingredients 
            : (item.selected_ingredients ? [item.selected_ingredients] : 
               (fallbackOrderItem?.selected_ingredients 
                 ? (Array.isArray(fallbackOrderItem.selected_ingredients) 
                    ? fallbackOrderItem.selected_ingredients 
                    : [fallbackOrderItem.selected_ingredients])
                 : []));

          // Handle selected_options (use from item or fallback)
          let selectedOptions = null;
          if (item.selected_options && Array.isArray(item.selected_options) && item.selected_options.length > 0) {
            // Convert from API format to frontend format
            selectedOptions = {};
            item.selected_options.forEach((option) => {
              if (option.option_group_id && Array.isArray(option.option_item_ids)) {
                selectedOptions[option.option_group_id] = option.option_item_ids;
              }
            });
          } else if (fallbackOrderItem?.selected_options && Array.isArray(fallbackOrderItem.selected_options) && fallbackOrderItem.selected_options.length > 0) {
            // Use fallback data
            selectedOptions = {};
            fallbackOrderItem.selected_options.forEach((option) => {
              if (option.option_group_id && Array.isArray(option.option_item_ids)) {
                selectedOptions[option.option_group_id] = option.option_item_ids;
              }
            });
          }

          // Handle selected_customizations (use from item or fallback)
          let selectedCustomizations = null;
          if (item.selected_drinks || item.selected_toppings || item.selected_sauces || item.selected_allergens) {
            selectedCustomizations = {
              allergens: Array.isArray(item.selected_allergens) 
                ? item.selected_allergens 
                : (item.selected_allergens ? [item.selected_allergens] : []),
              drinks: Array.isArray(item.selected_drinks) 
                ? item.selected_drinks 
                : (item.selected_drinks ? [item.selected_drinks] : []),
              toppings: Array.isArray(item.selected_toppings) 
                ? item.selected_toppings 
                : (item.selected_toppings ? [item.selected_toppings] : []),
              sauces: Array.isArray(item.selected_sauces) 
                ? item.selected_sauces 
                : (item.selected_sauces ? [item.selected_sauces] : [])
            };
          } else if (fallbackOrderItem) {
            // Use fallback data from order.order_items
            selectedCustomizations = {
              allergens: Array.isArray(fallbackOrderItem.selected_allergens) 
                ? fallbackOrderItem.selected_allergens 
                : (fallbackOrderItem.selected_allergens ? [fallbackOrderItem.selected_allergens] : []),
              drinks: Array.isArray(fallbackOrderItem.selected_drinks) 
                ? fallbackOrderItem.selected_drinks 
                : (fallbackOrderItem.selected_drinks ? [fallbackOrderItem.selected_drinks] : []),
              toppings: Array.isArray(fallbackOrderItem.selected_toppings) 
                ? fallbackOrderItem.selected_toppings 
                : (fallbackOrderItem.selected_toppings ? [fallbackOrderItem.selected_toppings] : []),
              sauces: Array.isArray(fallbackOrderItem.selected_sauces) 
                ? fallbackOrderItem.selected_sauces 
                : (fallbackOrderItem.selected_sauces ? [fallbackOrderItem.selected_sauces] : [])
            };
          }

          // Calculate final price with all customizations
          const finalPrice = calculateProductPriceWithCustomizations(
            product,
            item.size_id || null,
            ingredientIds,
            selectedOptions,
            selectedCustomizations
          );

          // Build customization object
          const customization = {
            sizeId: item.size_id || null,
            ingredientIds: ingredientIds,
            selectedOptions: selectedOptions,
            selectedCustomizations: selectedCustomizations,
            finalPrice: finalPrice,
            isValid: true, // Assume valid since it was in a previous order
          };

          // Add to cart using the hook (which handles quantity internally)
          addToCartHook(product, customization, item.quantity || 1);
          addedCount++;
        } catch (error) {
          console.error(`Error adding item ${item.menu_item_id} to cart:`, error);
          failedCount++;
        }
      }

      // Show success/error messages
      if (addedCount > 0) {
        const itemText = addedCount === 1 ? t(lang, "item") : t(lang, "items");
        toastSuccess(`${addedCount} ${itemText} ${t(lang, "added_to_cart")}`);
      }
      if (failedCount > 0) {
        const itemText = failedCount === 1 ? t(lang, "item") : t(lang, "items");
        toastError(`${failedCount} ${itemText} ${t(lang, "failed_add_cart")}`);
      }
      if (addedCount === 0 && failedCount === 0) {
        toastError(t(lang, "no_items_to_add"));
      }
    } catch (error) {
      console.error("Reorder error:", error);
      toastError(error?.message || t(lang, "failed_to_reorder"));
    } finally {
      setIsReorderLoading(false);
    }
  };

  return {
    canCancelOrder,
    handleCancelOrder,
    handleReorder,
    handleTrackOrder,
    isCancelling,
    isReorderLoading,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
  };
}
