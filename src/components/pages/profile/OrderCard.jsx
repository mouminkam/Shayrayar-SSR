"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useState } from "react";
import { RotateCcw, Loader2 } from "lucide-react";
import { formatCurrency } from "../../../lib/utils/formatters";
import { usePrefetchRoute } from "../../../hooks/usePrefetchRoute";
import OptimizedImage from "../../ui/OptimizedImage";
import { IMAGE_PATHS } from "../../../data/constants";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";
import api from "../../../api";
import useToastStore from "../../../store/toastStore";
import { useAddToCart } from "../../../hooks/useAddToCart";
import { transformMenuItemToProduct } from "../../../lib/utils/productTransform";

const OrderCard = memo(function OrderCard({ order }) {
  const router = useRouter();
  const { prefetchRoute } = usePrefetchRoute();
  const { lang } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const addToCartHook = useAddToCart();
  const [isReorderLoading, setIsReorderLoading] = useState(false);

  const handleCardClick = () => {
    router.push(`/orders/${order.id}`, { scroll: false });
  };

  const handleReorder = async (e) => {
    e.stopPropagation(); // Prevent card click
    
    if (!order?.id) {
      toastError(t(lang, "invalid_order"));
      return;
    }

    setIsReorderLoading(true);
    try {
      // Get full order data from API
      const response = await api.orders.getOrderById(order.id);
      
      if (!response?.success || !response?.data) {
        toastError(response?.message || t(lang, "failed_to_reorder"));
        setIsReorderLoading(false);
        return;
      }

      // Extract order from response
      const orderData = response.data.order || response.data;
      const orderItems = orderData.order_items || [];

      if (!orderItems || orderItems.length === 0) {
        toastError(t(lang, "no_items_to_add"));
        setIsReorderLoading(false);
        return;
      }

      // Add each order item to cart
      let addedCount = 0;
      let failedCount = 0;

      for (const orderItem of orderItems) {
        try {
          // Get menu_item from order_item
          const menuItem = orderItem.menu_item;
          
          if (!menuItem) {
            console.error(`Menu item not found for order item ${orderItem.id}`);
            failedCount++;
            continue;
          }

          // Extract option_groups from menu_item if available, otherwise empty array
          const optionGroups = menuItem.option_groups || [];

          // Transform menu_item to product object
          const product = transformMenuItemToProduct(menuItem, optionGroups);
          
          if (!product) {
            console.error(`Failed to transform product ${menuItem.id}`);
            failedCount++;
            continue;
          }

          // Convert selected_options from API format to frontend format
          // API format: [{ option_group_id: 4, option_item_ids: [3] }]
          // Frontend format: { 4: [3] }
          let selectedOptions = null;
          if (orderItem.selected_options && Array.isArray(orderItem.selected_options) && orderItem.selected_options.length > 0) {
            selectedOptions = {};
            orderItem.selected_options.forEach(option => {
              if (option.option_group_id && Array.isArray(option.option_item_ids)) {
                selectedOptions[option.option_group_id] = option.option_item_ids;
              }
            });
          }

          // Build customization object from order_item data
          const customization = {
            sizeId: orderItem.size_id || null,
            ingredientIds: orderItem.selected_ingredients || [],
            selectedOptions: selectedOptions,
            finalPrice: parseFloat(orderItem.item_price || 0),
            isValid: true, // Assume valid since it was in a previous order
          };

          // Add to cart using the hook (which handles quantity internally)
          addToCartHook(product, customization, orderItem.quantity || 1);
          addedCount++;
        } catch (error) {
          console.error(`Error adding item ${orderItem.item_name} to cart:`, error);
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

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 text-green-300';
      case 'confirmed':
      case 'preparing':
      case 'ready':
      case 'out_for_delivery':
        return 'bg-blue-500/20 text-blue-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <div
      onClick={handleCardClick}
      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-theme3/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <p className="text-white  font-bold text-lg mb-1">
            {order.orderNumber || `${t(lang, "order_number")}${String(order.id || '').slice(-8).toUpperCase()}`}
          </p>
          <p className="text-text text-sm">
            {order.date ? new Date(order.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) : t(lang, "date_not_available")}
          </p>
        </div>
        <div className="text-right">
          <p className="text-theme3  font-black text-xl mb-1">
            {formatCurrency(order.total)}
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
          >
            {order.status?.replace('_', ' ') || 'pending'}
          </span>
        </div>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="space-y-2 mb-4 pt-4 border-t border-white/10">
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={item.id || idx} className="flex items-center gap-3 text-sm">
              <div 
                className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0"
                onMouseEnter={() => item.id && prefetchRoute(`/shop/${item.id}`)}
              >
                <OptimizedImage
                  src={item.image || IMAGE_PATHS.placeholder}
                  alt={item.name || 'Item'}
                  fill
                  className="object-cover"
                  quality={85}
                  loading="lazy"
                  sizes="48px"
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.name || 'Unknown Item'}</p>
                <p className="text-text text-xs">
                  {t(lang, "quantity")}: {item.quantity || 1} × {formatCurrency(item.price || 0)}
                </p>
              </div>
              <p className="text-theme3 font-bold">
                {formatCurrency((item.price || 0) * (item.quantity || 1))}
              </p>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-text text-xs text-center pt-2">
              +{order.items.length - 3} {t(lang, "more_items")}
            </p>
          )}
        </div>
      )}

      {/* Payment Method and Actions */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-4 border-t border-white/10">
        <p className="text-text text-sm">
          {t(lang, "payment")}{" "}
          <span className="text-white font-medium capitalize">
            {order.paymentMethod}
          </span>
        </p>
        <div className="flex items-center gap-3">
          {/* Reorder Button */}
          <button
            onClick={handleReorder}
            disabled={isReorderLoading}
            className="flex items-center gap-2 px-4 py-2 bg-theme3/20 hover:bg-theme3/30 border border-theme3/50 rounded-lg text-theme3 text-sm font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            title={t(lang, "reorder")}
          >
            {isReorderLoading ? (
              <Loader2 className="w-4 h-4 animate-spin" />
            ) : (
              <RotateCcw className="w-4 h-4" />
            )}
            <span>{t(lang, "reorder")}</span>
          </button>
          
          {/* View Details Link */}
          <div className="flex items-center gap-2 text-theme3 group-hover:text-theme text-sm font-medium transition-colors cursor-pointer" onClick={handleCardClick}>
          <span>{t(lang, "view_details")}</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
      </div>
    </div>
  );
});

OrderCard.displayName = "OrderCard";

export default OrderCard;

