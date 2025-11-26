"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter, useParams } from "next/navigation";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ArrowLeft, Package, Calendar, CreditCard, MapPin, CheckCircle, Clock, XCircle, X, Navigation } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import api from "../../../api";
import useToastStore from "../../../store/toastStore";
import { formatCurrency } from "../../../lib/utils/formatters";
import AnimatedSection from "../../../components/ui/AnimatedSection";
import ErrorBoundary from "../../../components/ui/ErrorBoundary";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import SectionSkeleton from "../../../components/ui/SectionSkeleton";
import { usePrefetchRoute } from "../../../hooks/usePrefetchRoute";

export default function OrderDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const { prefetchRoute } = usePrefetchRoute();
  const orderId = params?.id;
  const { error: toastError, success: toastSuccess } = useToastStore();
  const [order, setOrder] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCancelling, setIsCancelling] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (orderId) {
      fetchOrderDetails();
    }
  }, [orderId]);

  const fetchOrderDetails = async () => {
    if (!orderId) return;

    setIsLoading(true);
    try {
      const response = await api.orders.getOrderById(orderId);
      
      if (response.success && response.data) {
        // Handle different response structures
        const orderData = response.data.order || response.data;
        setOrder(orderData);
      } else {
        toastError("Failed to load order details");
      }
    } catch (error) {
      console.error("Error fetching order:", error);
      toastError("Failed to load order details");
    } finally {
      setIsLoading(false);
    }
  };

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
    if (!cancelReason.trim()) {
      toastError("Please provide a cancellation reason");
      return;
    }

    setIsCancelling(true);
    try {
      const response = await api.orders.cancelOrder(orderId, { reason: cancelReason });
      
      if (response.success) {
        toastSuccess("Order cancelled successfully");
        setShowCancelModal(false);
        setCancelReason("");
        // Refresh order data
        fetchOrderDetails();
      } else {
        toastError(response.message || "Failed to cancel order");
      }
    } catch (error) {
      console.error("Error cancelling order:", error);
      toastError(error?.message || "Failed to cancel order");
    } finally {
      setIsCancelling(false);
    }
  };

  const handleTrackOrder = async () => {
    setIsTracking(true);
    try {
      const response = await api.orders.trackOrder(orderId);
      
      if (response.success && response.data) {
        setTrackingData(response.data);
        toastSuccess("Tracking information loaded");
      } else {
        toastError(response.message || "Failed to load tracking information");
      }
    } catch (error) {
      console.error("Error tracking order:", error);
      toastError(error?.message || "Failed to load tracking information");
    } finally {
      setIsTracking(false);
    }
  };

  const canCancelOrder = () => {
    const status = order?.status?.toLowerCase();
    return status === 'pending' || status === 'processing' || status === 'confirmed';
  };

  if (isLoading) {
    return (
      <div className="bg-bgimg min-h-screen">
        <Breadcrumb title="Order Details" />
        <section className="section-padding fix bg-bgimg py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-theme3"></div>
              <p className="text-text text-base">Loading order details...</p>
            </div>
          </div>
        </section>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="bg-bg3 min-h-screen">
        <Breadcrumb title="Order Details" />
        <section className="section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="flex flex-col items-center justify-center py-20 gap-4">
              <Package className="w-16 h-16 text-text/30" />
              <p className="text-text text-lg">Order not found</p>
              <Link
                href="/profile"
                onMouseEnter={() => prefetchRoute("/profile")}
                onClick={(e) => {
                  e.preventDefault();
                  router.push("/profile", { scroll: false });
                }}
                className="px-6 py-3 bg-theme3 text-white rounded-xl hover:bg-theme transition-colors"
              >
                Back to Profile
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
          <Breadcrumb title="Order Details" />
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
              <span className="font-medium">Back to Profile</span>
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
                      Order #{order.order_number || order.id}
                    </h1>
                    <p className="text-text text-sm flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      {order.created_at ? new Date(order.created_at).toLocaleDateString("en-US", {
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }) : 'Date not available'}
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
                      Order Items ({orderItems.length})
                    </h2>
                    {orderItems.map((item, idx) => {
                      const imageUrl = item.menu_item?.image_url || 
                                     item.menu_item?.image || 
                                     item.image || 
                                     '/img/placeholder.png';
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
                                Size: {item.size.name || item.size}
                              </p>
                            )}
                            <p className="text-text text-sm">
                              Quantity: {quantity} × {formatCurrency(itemPrice)}
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
                  {canCancelOrder() && (
                    <button
                      onClick={() => setShowCancelModal(true)}
                      className="flex items-center justify-center gap-2 px-6 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-semibold transition-all duration-300"
                    >
                      <X className="w-5 h-5" />
                      Cancel Order
                    </button>
                  )}
                  <button
                    onClick={handleTrackOrder}
                    disabled={isTracking}
                    className="flex items-center justify-center gap-2 px-6 py-3 bg-theme3/20 hover:bg-theme3/30 border border-theme3/30 rounded-xl text-theme3 font-semibold transition-all duration-300 disabled:opacity-50"
                  >
                    <Navigation className="w-5 h-5" />
                    {isTracking ? "Tracking..." : "Track Order"}
                    </button>
                  </div>
                </motion.div>
              </AnimatedSection>

              {/* Tracking Information */}
              {trackingData && (
                <AnimatedSection>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8"
                >
                  <h2 className="text-white  text-xl font-bold mb-4">
                    Order Tracking
                  </h2>
                  <div className="space-y-3">
                    {trackingData.status && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">Current Status</span>
                        <span className={`font-semibold capitalize px-3 py-1 rounded-xl ${getStatusColor(trackingData.status)}`}>
                          {trackingData.status}
                        </span>
                      </div>
                    )}
                    {trackingData.estimated_delivery_time && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">Estimated Delivery</span>
                        <span className="text-white font-semibold">
                          {new Date(trackingData.estimated_delivery_time).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {trackingData.tracking_url && (
                      <a
                        href={trackingData.tracking_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-center px-4 py-2 bg-theme3/20 hover:bg-theme3/30 border border-theme3/30 rounded-xl text-theme3 font-semibold transition-all"
                      >
                        View Tracking Link
                      </a>
                    )}
                  </div>
                </motion.div>
                </AnimatedSection>
              )}
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
                  Order Summary
                </h2>

                <div className="space-y-4">
                  {/* Order Type */}
                  {order.order_type && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <Package className="w-5 h-5 text-theme3" />
                      <div>
                        <p className="text-text text-xs">Order Type</p>
                        <p className="text-white font-semibold capitalize">{order.order_type}</p>
                      </div>
                    </div>
                  )}

                  {/* Delivery Address */}
                  {order.delivery_address && (
                    <div className="flex items-start gap-3 p-3 bg-white/5 rounded-xl">
                      <MapPin className="w-5 h-5 text-theme3 shrink-0 mt-0.5" />
                      <div>
                        <p className="text-text text-xs mb-1">Delivery Address</p>
                        <p className="text-white text-sm">{order.delivery_address}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Method */}
                  {order.payment_method && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <CreditCard className="w-5 h-5 text-theme3" />
                      <div>
                        <p className="text-text text-xs">Payment Method</p>
                        <p className="text-white font-semibold capitalize">{order.payment_method}</p>
                      </div>
                    </div>
                  )}

                  {/* Payment Status */}
                  {order.payment_status && (
                    <div className="flex items-center gap-3 p-3 bg-white/5 rounded-xl">
                      <div className={`w-5 h-5 rounded-full ${order.payment_status === 'paid' ? 'bg-green-500' : 'bg-yellow-500'}`} />
                      <div>
                        <p className="text-text text-xs">Payment Status</p>
                        <p className="text-white font-semibold capitalize">{order.payment_status}</p>
                      </div>
                    </div>
                  )}

                  {/* Price Breakdown */}
                  <div className="pt-4 border-t border-white/10 space-y-3">
                    {order.subtotal && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">Subtotal</span>
                        <span className="text-white font-semibold">{formatCurrency(parseFloat(order.subtotal))}</span>
                      </div>
                    )}
                    {order.delivery_charge && parseFloat(order.delivery_charge) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">Delivery</span>
                        <span className="text-white font-semibold">{formatCurrency(parseFloat(order.delivery_charge))}</span>
                      </div>
                    )}
                    {order.tax_amount && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">Tax</span>
                        <span className="text-white font-semibold">{formatCurrency(parseFloat(order.tax_amount))}</span>
                      </div>
                    )}
                    {order.discount_amount && parseFloat(order.discount_amount) > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-text">Discount</span>
                        <span className="text-theme3 font-semibold">-{formatCurrency(parseFloat(order.discount_amount))}</span>
                      </div>
                    )}
                    <div className="flex justify-between items-center pt-3 border-t border-white/10">
                      <span className="text-white  text-lg font-black uppercase">Total</span>
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
              Cancel Order
            </h3>
            <p className="text-text mb-4">
              Are you sure you want to cancel this order? Please provide a reason for cancellation.
            </p>
            <textarea
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              placeholder="Enter cancellation reason..."
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
                Cancel
              </button>
              <button
                onClick={handleCancelOrder}
                disabled={isCancelling || !cancelReason.trim()}
                className="flex-1 px-4 py-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-xl text-red-300 font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isCancelling ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}

