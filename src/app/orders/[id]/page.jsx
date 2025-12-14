"use client";
import { useEffect, useState, useCallback, use } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowLeft, Package, Calendar, CreditCard, MapPin, CheckCircle, Clock, XCircle, X, Navigation, RotateCcw, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "../../../api";
import useToastStore from "../../../store/toastStore";
import { IMAGE_PATHS } from "../../../data/constants";
import { formatCurrency } from "../../../lib/utils/formatters";
import AnimatedSection from "../../../components/ui/AnimatedSection";
import ErrorBoundary from "../../../components/ui/ErrorBoundary";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import { usePrefetchRoute } from "../../../hooks/usePrefetchRoute";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";
import { useAddToCart } from "../../../hooks/useAddToCart";
import { transformMenuItemToProduct } from "../../../lib/utils/productTransform";

export default function OrderDetailsPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const { prefetchRoute } = usePrefetchRoute();
  const orderId = resolvedParams?.id ? String(resolvedParams.id) : null;
  const { error: toastError, success: toastSuccess } = useToastStore();
  const { lang } = useLanguage();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");
  const [isReorderLoading, setIsReorderLoading] = useState(false);
  const addToCartHook = useAddToCart();

  const fetchOrderDetails = useCallback(async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const response = await api.orders.getOrderById(orderId);
      
      // Log response for debugging
      console.log('Order API Response:', response);
      
      if (response.success && response.data) {
        // Handle different response structures
        const orderData = response.data.order || response.data;
        
        if (!orderData || !orderData.id) {
          console.error('Invalid order data structure:', response);
          toastError(t(lang, "failed_to_load_order_details"));
          return;
        }
        
        setOrder(orderData);
      } else {
        console.error('Order API error:', response);
        toastError(response?.message || t(lang, "failed_to_load_order_details"));
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      // Log full error details
      console.error("Error details:", {
        message: error.message,
        status: error.status,
        data: error.data,
        response: error.response
      });
      toastError(error?.message || t(lang, "failed_to_load_order_details"));
    } finally {
      setIsLoading(false);
    }
  }, [orderId, toastError, lang]);

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId, fetchOrderDetails]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'processing':
      case 'preparing':
      case 'confirmed':
        return 'bg-blue-500/20 text-blue-300 border-blue-500/30';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'pending':
        return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      default:
        return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case 'completed':
      case 'delivered':
        return <CheckCircle className="w-5 h-5" />;
      case 'cancelled':
        return <XCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const handleCancelOrder = async () => {
    // Validate cancellation reason
    if (!cancelReason.trim()) {
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
      const response = await api.orders.cancelOrder(orderId, { reason: cancelReason });
      
      if (response.success) {
        toastSuccess(t(lang, "order_cancelled_successfully"));
        setShowCancelModal(false);
        setCancelReason("");
        // Refresh order data
        fetchOrderDetails();
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

  const handleTrackOrder = () => {
    // Check if tracking_url is available
    if (!order.tracking_url) {
      toastError(t(lang, "tracking_not_available"));
      return;
    }

    // Open tracking URL in a new window
    window.open(order.tracking_url, '_blank', 'noopener,noreferrer');
  };

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

  const handleReorder = async () => {
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

          // Extract option_groups and customizations from menu_item if available
          const optionGroups = menuItem.option_groups || [];
          const customizations = menuItem.customizations || null;

          // Transform menu_item to product object
          const product = transformMenuItemToProduct(menuItem, optionGroups, lang, customizations);
          
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

          // Convert selected_customizations from API format to frontend format
          // API format: selected_drinks: [1, 2] أو null, selected_toppings: [3] أو null
          // Frontend format: { drinks: [1, 2], toppings: [3] } (دائماً arrays، لا null)
          const selectedCustomizations = {
            allergens: Array.isArray(orderItem.selected_allergens) 
              ? orderItem.selected_allergens 
              : (orderItem.selected_allergens ? [orderItem.selected_allergens] : []),
            drinks: Array.isArray(orderItem.selected_drinks) 
              ? orderItem.selected_drinks 
              : (orderItem.selected_drinks ? [orderItem.selected_drinks] : []),
            toppings: Array.isArray(orderItem.selected_toppings) 
              ? orderItem.selected_toppings 
              : (orderItem.selected_toppings ? [orderItem.selected_toppings] : []),
            sauces: Array.isArray(orderItem.selected_sauces) 
              ? orderItem.selected_sauces 
              : (orderItem.selected_sauces ? [orderItem.selected_sauces] : [])
          };

          // Build customization object from order_item data
          const customization = {
            sizeId: orderItem.size_id || null,
            // Handle selected_ingredients (can be array or null)
            ingredientIds: Array.isArray(orderItem.selected_ingredients) 
              ? orderItem.selected_ingredients 
              : (orderItem.selected_ingredients ? [orderItem.selected_ingredients] : (orderItem.ingredients || [])),
            selectedOptions: selectedOptions,
            selectedCustomizations: selectedCustomizations, // Add customizations
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

  if (isLoading) {
    return (
      <div className="bg-bgimg min-h-screen">
        <Breadcrumb title={t(lang, "order_details")} />
        <section className="section-padding fix bg-bgimg py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme3"></div>
              <p className="text-text text-base">{t(lang, "loading_order_details")}</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-bg3 min-h-screen">
        <Breadcrumb title={t(lang, "order_details")} />
        <section className="section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Package className="w-16 h-16 text-text/30" />
              <p className="text-text text-lg">{t(lang, "order_not_found")}</p>
              <Link
                href="/profile"
                onMouseEnter={() => prefetchRoute("/profile")}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/profile", { scroll: false });
                }}
                className="px-6 py-3 bg-theme3 text-white rounded-xl hover:bg-theme transition-colors"
              >
                {t(lang, "back_to_profile")}
              </Link>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Transform order items for display
  const orderItems = order.order_items || order.items || [];

  return (
    <div className="bg-bg3 min-h-screen">
      <ErrorBoundary>
        <AnimatedSection>
          <Breadcrumb title={t(lang, "order_details")} />
        </AnimatedSection>
      </ErrorBoundary>
      <section className="section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <ErrorBoundary>
          {/* Back Button */}
          <AnimatedSection>
            <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mb-6"
          >
            <Link
              href="/profile"
              onMouseEnter={() => prefetchRoute("/profile")}
              onClick={(e) => {
                e.preventDefault();
                router.push("/profile", { scroll: false });
              }}
              className="inline-flex items-center gap-2 text-text hover:text-theme3 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">{t(lang, "back_to_profile")}</span>
            </Link>
            </motion.div>
          </AnimatedSection>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Order Header */}
              <AnimatedSection>
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8"
              >
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                  <div>
                    <h1 className="text-white  text-3xl font-black mb-2">
                      {t(lang, "order_number")}{order.order_number || order.id}
                    </h1>
                    <p className="text-text text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : t(lang, "date_not_available")}
                    </p>
                  </div>
                  <div className={`flex items-center gap-2 px-4 py-2 rounded-xl border ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    <span className="font-semibold capitalize">{order.status || 'pending'}</span>
                  </div>
                </div>

                {/* Order Items */}
                {orderItems.length > 0 && (
                  <div className="space-y-4">
                    <h2 className="text-white  text-xl font-bold mb-4">
                      {t(lang, "order_items")} ({orderItems.length})
                    </h2>
                    {orderItems.map((item, idx) => {
                      const imageUrl = item.menu_item?.image_url || 
                                     item.menu_item?.image || 
                                     item.image || 
                                     IMAGE_PATHS.placeholder;
                      const itemName = item.item_name || item.menu_item?.name || item.name || 'Unknown Item';
                      const itemPrice = parseFloat(item.item_price || item.price || item.menu_item?.price || 0);
                      const quantity = item.quantity || 1;

                      return (
                        <motion.div
                          key={item.id || idx}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: 0.2 + idx * 0.1 }}
                          className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden shrink-0">
                            <Image
                              src={imageUrl}
                              alt={itemName}
                              fill
                              className="object-cover"
                              quality={85}
                              loading="lazy"
                              sizes="80px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-white  font-bold text-lg mb-1">
                              {itemName}
                            </h3>
                            {item.size && (
                              <p className="text-text text-sm mb-1">
                                {t(lang, "size")} {item.size.name || item.size}
                              </p>
                            )}
                            <p className="text-text text-sm">
                              {t(lang, "quantity")}: {quantity} × {formatCurrency(itemPrice)}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-theme3  font-black text-xl">
                              {formatCurrency(itemPrice * quantity)}
                            </p>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 mt-6 pt-6 border-t border-white/10">
                  <button
                    onClick={handleReorder}
                    disabled={isReorderLoading}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-theme3/20 hover:bg-theme3/30 border border-theme3/30 rounded-xl text-theme3 font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isReorderLoading ? (
                      <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                      <RotateCcw className="w-5 h-5" />
                    )}
                    {t(lang, "reorder")}
                  </button>
                  {(() => {
                    // Direct check: لا نعرض الزر إذا كان Stripe أو Cash confirmed
                    if (!order) return null;
                    
                    const paymentMethod = order?.payment_method?.toLowerCase();
                    const paymentIntentId = order?.payment_intent_id;
                    const status = order?.status?.toLowerCase();
                    const paymentStatus = order?.payment_status?.toLowerCase();
                    
                    // لا نعرض الزر إذا كان Stripe (بغض النظر عن الحالة)
                    if (paymentMethod === 'stripe' || paymentIntentId) {
                      return null;
                    }
                    
                    // لا نعرض الزر إذا كان Cash + confirmed
                    if (paymentMethod === 'cash' && status === 'confirmed') {
                      return null;
                    }
                    
                    // لا نعرض الزر إذا كان الطلب مكتمل أو ملغي أو تم تسليمه
                    if (status === 'completed' || status === 'cancelled' || status === 'delivered') {
                      return null;
                    }
                    
                    // فقط إذا كان canCancelOrder() يعيد true
                    if (!canCancelOrder()) {
                      return null;
                    }
                    
                    return (
                      <button
                        onClick={() => {
                          // Double check before showing modal
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
                            return;
                          }
                          setShowCancelModal(true);
                        }}
                        className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-semibold transition-all duration-300"
                      >
                        <X className="w-5 h-5" />
                        {t(lang, "cancel_order")}
                      </button>
                    );
                  })()}
                  <button
                    onClick={handleTrackOrder}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-theme3/20 hover:bg-theme3/30 border border-theme3/30 rounded-xl text-theme3 font-semibold transition-all duration-300"
                  >
                    <Navigation className="w-5 h-5" />
                    {t(lang, "track_order")}
                    </button>
                  </div>
                </motion.div>
              </AnimatedSection>

            </div>

            {/* Sidebar - Order Summary */}
            <div className="lg:col-span-1">
              <AnimatedSection>
                <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8 sticky top-8"
              >
                <h2 className="text-white  text-xl font-black uppercase mb-6">
                  {t(lang, "order_summary")}
                </h2>

                <div className="space-y-4">
                  {/* Order Type */}
                  {order.order_type && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <Package className="w-5 h-5 text-theme3" />
                      <div>
                        <p className="text-text text-xs">{t(lang, "order_type")}</p>
                        <p className="text-white font-semibold capitalize">{order.order_type}</p>
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.delivery_address && (
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                      <MapPin className="w-5 h-5 text-theme3 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-text text-xs mb-1">{t(lang, "delivery_address")}</p>
                        <p className="text-white text-sm">{order.delivery_address}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  {order.payment_method && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <CreditCard className="w-5 h-5 text-theme3" />
                      <div>
                        <p className="text-text text-xs">{t(lang, "payment_method")}</p>
                        <p className="text-white font-semibold capitalize">{order.payment_method}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Status */}
                  {order.payment_status && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className={`w-5 h-5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="text-text text-xs">{t(lang, "payment_status")}</p>
                        <p className="text-white font-semibold capitalize">{order.payment_status}</p>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {order.subtotal && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">{t(lang, "subtotal")}</span>
                        <span className="text-white font-semibold">{formatCurrency(parseFloat(order.subtotal))}</span>
                      </div>
                    )}
                    {order.delivery_charge && parseFloat(order.delivery_charge) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">{t(lang, "delivery")}</span>
                        <span className="text-white font-semibold">{formatCurrency(parseFloat(order.delivery_charge))}</span>
                      </div>
                    )}
                    {order.tax_amount && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">{t(lang, "tax")}</span>
                        <span className="text-white font-semibold">{formatCurrency(parseFloat(order.tax_amount))}</span>
                      </div>
                    )}
                    {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">{t(lang, "discount")}</span>
                        <span className="text-theme3 font-semibold">-{formatCurrency(parseFloat(order.discount_amount))}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <span className="text-white  text-lg font-black uppercase">{t(lang, "total")}</span>
                      <span className="text-theme3  text-2xl font-black">
                        {formatCurrency(parseFloat(order.total_amount || order.total || 0))}
                      </span>
                    </div>
                  </div>
                </div>
                </motion.div>
              </AnimatedSection>
            </div>
          </div>
          </ErrorBoundary>
        </div>
      </section>

      {/* Cancel Order Modal */}
      {showCancelModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-linear-to-br from-bgimg/95 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl border border-white/10 p-6 lg:p-8 max-w-md w-full"
          >
            <h3 className="text-white  text-2xl font-black mb-4">
              {t(lang, "cancel_order")}
            </h3>
            <p className="text-text mb-4">
              {t(lang, "cancel_order_confirmation")}
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder={t(lang, "enter_cancellation_reason")}
              rows={4}
              className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300 resize-none mb-4"
            />
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setShowCancelModal(false);
                  setCancelReason("");
                }}
                className="flex-1 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white font-semibold transition-all"
              >
                {t(lang, "cancel")}
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? t(lang, "cancelling") : t(lang, "confirm_cancel")}
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Track Order Map Modal */}
    </div>
  );
}

