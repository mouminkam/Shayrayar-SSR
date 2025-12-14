"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Tag, Loader2, Gift } from "lucide-react";
import api from "../../../api";
import useCartStore from "../../../store/cartStore";
import useBranchStore from "../../../store/branchStore";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";
import { formatCurrency } from "../../../lib/utils/formatters";

/**
 * AvailableCouponsModal Component
 * Modal for displaying and applying available coupons
 */
export default function AvailableCouponsModal({ isOpen, onClose, onApplyCoupon }) {
  const { lang } = useLanguage();
  const { items, getSubtotal } = useCartStore();
  const { getSelectedBranchId } = useBranchStore();
  
  const [coupons, setCoupons] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch applicable coupons when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchApplicableCoupons();
    } else {
      // Reset state when modal closes
      setCoupons([]);
      setError(null);
    }
  }, [isOpen, items, getSubtotal]);

  const fetchApplicableCoupons = async () => {
    const branchId = getSelectedBranchId();
    if (!branchId || items.length === 0) {
      setCoupons([]);
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const orderData = {
        order_amount: getSubtotal(),
        branch_id: branchId,
        items: items.map((item) => ({
          id: item.id,
          quantity: item.quantity,
        })),
      };

      const response = await api.coupons.getApplicableCoupons(orderData);
      
      if (response.success && response.data) {
        const couponsList = Array.isArray(response.data.coupons) 
          ? response.data.coupons 
          : [];
        setCoupons(couponsList);
      } else {
        setCoupons([]);
      }
    } catch (err) {
      console.error("Error fetching applicable coupons:", err);
      setError(err?.message || t(lang, "failed_to_load_coupons") || "Failed to load coupons");
      setCoupons([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleApplyCoupon = (couponCode) => {
    if (onApplyCoupon) {
      onApplyCoupon(couponCode);
    }
    onClose();
  };

  // Use portal to render modal at document body level
  if (typeof window === 'undefined') return null;
  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
          />
          
          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="bg-linear-to-br from-bgimg/95 via-bgimg to-bgimg/90 backdrop-blur-md rounded-3xl shadow-2xl border border-white/10 w-full max-w-2xl max-h-[90vh] flex flex-col">
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-theme3/20 flex items-center justify-center">
                    <Tag className="w-6 h-6 text-theme3" />
                  </div>
                  <h2 className="text-white text-2xl font-black">
                    {t(lang, "available_coupons_modal_title") || "Available Coupons"}
                  </h2>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  aria-label="Close"
                >
                  <X className="w-6 h-6 text-white" />
                </button>
              </div>

              {/* Content */}
              <div className="flex-1 overflow-y-auto p-6">
                {isLoading ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <Loader2 className="w-12 h-12 text-theme3 animate-spin mb-4" />
                    <p className="text-text text-sm">{t(lang, "loading") || "Loading..."}</p>
                  </div>
                ) : error ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center mb-4">
                      <X className="w-8 h-8 text-red-400" />
                    </div>
                    <p className="text-red-300 text-sm text-center">{error}</p>
                    <button
                      onClick={fetchApplicableCoupons}
                      className="mt-4 px-4 py-2 bg-theme3/20 hover:bg-theme3/30 border border-theme3/50 rounded-xl text-theme3 text-sm font-semibold transition-all"
                    >
                      {t(lang, "retry") || "Retry"}
                    </button>
                  </div>
                ) : coupons.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                      <Gift className="w-8 h-8 text-text/50" />
                    </div>
                    <p className="text-text text-center text-sm">
                      {t(lang, "no_coupons_available") || "No coupons available"}
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {coupons.map((coupon, index) => {
                      const discountText = coupon.discount_amount 
                        ? formatCurrency(coupon.discount_amount)
                        : coupon.type === 'percentage'
                        ? `${coupon.value}%`
                        : coupon.type === 'fixed_amount'
                        ? formatCurrency(coupon.value)
                        : coupon.type === 'FREEDELIVERY'
                        ? t(lang, "free_delivery") || "Free Delivery"
                        : '';

                      return (
                        <motion.div
                          key={coupon.id || index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 }}
                          className="p-4 bg-white/5 border border-white/10 rounded-xl hover:border-theme3/50 hover:bg-white/10 transition-all"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <Tag className="w-4 h-4 text-theme3" />
                                <h3 className="text-white font-bold text-lg">
                                  {coupon.code}
                                </h3>
                              </div>
                              {coupon.description && (
                                <p className="text-text text-sm mb-2">
                                  {coupon.description}
                                </p>
                              )}
                              <div className="flex items-center gap-2">
                                <span className="text-theme3 font-semibold text-sm">
                                  {t(lang, "discount_label") || "Discount"}: {discountText}
                                </span>
                              </div>
                            </div>
                            <button
                              onClick={() => handleApplyCoupon(coupon.code)}
                              className="px-4 py-2 bg-theme3 hover:bg-theme text-white rounded-xl font-semibold text-sm transition-all whitespace-nowrap"
                            >
                              {t(lang, "apply_coupon") || "Apply"}
                            </button>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

