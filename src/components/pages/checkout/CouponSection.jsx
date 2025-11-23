"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Tag, X, Check, Loader2 } from "lucide-react";
import useCartStore from "../../../store/cartStore";
import useBranchStore from "../../../store/branchStore";
import useToastStore from "../../../store/toastStore";
import api from "../../../api";

export default function CouponSection() {
  const { coupon, applyCoupon, removeCoupon, items, getSubtotal } = useCartStore();
  const { getSelectedBranchId } = useBranchStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  
  const [couponCode, setCouponCode] = useState("");
  const [isValidating, setIsValidating] = useState(false);
  const [availableCoupons, setAvailableCoupons] = useState([]);
  const [isLoadingCoupons, setIsLoadingCoupons] = useState(false);

  // Fetch available coupons
  useEffect(() => {
    const fetchAvailableCoupons = async () => {
      const branchId = getSelectedBranchId();
      if (!branchId || items.length === 0) return;

      setIsLoadingCoupons(true);
      try {
        // Prepare order data for available coupons API
        const orderData = {
          order_amount: getSubtotal(),
          branch_id: branchId,
          items: items.map((item) => ({
            menu_item_id: item.id,
            quantity: item.quantity,
          })),
        };

        const response = await api.orders.getAvailableCoupons(orderData);
        
        if (response.success && response.data) {
          const coupons = Array.isArray(response.data) 
            ? response.data 
            : response.data.coupons || [];
          setAvailableCoupons(coupons);
        }
      } catch (error) {
        console.error("Error fetching available coupons:", error);
      } finally {
        setIsLoadingCoupons(false);
      }
    };

    fetchAvailableCoupons();
  }, [items, getSelectedBranchId, getSubtotal]);

  const handleValidateCoupon = async () => {
    if (!couponCode.trim()) {
      toastError("Please enter a coupon code");
      return;
    }

    const branchId = getSelectedBranchId();
    if (!branchId) {
      toastError("Please select a branch");
      return;
    }

    setIsValidating(true);
    try {
      const response = await api.coupons.validateCoupon({
        code: couponCode.trim(),
        order_amount: getSubtotal(),
        branch_id: branchId,
      });

      if (response.success && response.data) {
        const couponData = {
          code: couponCode.trim(),
          ...response.data,
        };
        applyCoupon(couponData);
        toastSuccess("Coupon applied successfully!");
        setCouponCode("");
      } else {
        toastError(response.message || "Invalid coupon code");
      }
    } catch (error) {
      toastError(error.message || "Failed to validate coupon");
    } finally {
      setIsValidating(false);
    }
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    toastSuccess("Coupon removed");
  };

  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center"
        >
          <Tag className="w-6 h-6 text-white fill-white" />
        </motion.div>
        <h3 className="text-white  text-2xl font-black uppercase">
          Coupon Code
        </h3>
      </div>

      {coupon ? (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 bg-theme3/20 border border-theme3/50 rounded-xl flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <Check className="w-5 h-5 text-theme3" />
            <div>
              <p className="text-white font-semibold">{coupon.code}</p>
              <p className="text-text text-sm">
                Discount: {coupon.discount_amount 
                  ? `$${coupon.discount_amount.toFixed(2)}`
                  : coupon.discount_type === 'percentage'
                  ? `${coupon.discount_value}%`
                  : `$${coupon.discount_value}`}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleRemoveCoupon}
            className="p-2 hover:bg-theme3/30 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-theme3" />
          </button>
        </motion.div>
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
              onKeyPress={(e) => e.key === "Enter" && handleValidateCoupon()}
              placeholder="Enter coupon code"
              className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
            />
            <motion.button
              type="button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleValidateCoupon}
              disabled={isValidating || !couponCode.trim()}
              className="px-6 py-3 bg-theme3 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isValidating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Validating...
                </>
              ) : (
                "Apply"
              )}
            </motion.button>
          </div>

          {availableCoupons.length > 0 && (
            <div className="p-4 bg-white/5 rounded-xl border border-white/10">
              <p className="text-text text-sm font-medium mb-2">Available Coupons:</p>
              <div className="space-y-2">
                {availableCoupons.slice(0, 3).map((availCoupon, index) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-2 bg-white/5 rounded-lg"
                  >
                    <div>
                      <p className="text-white font-semibold text-sm">{availCoupon.code}</p>
                      <p className="text-text text-xs">
                        {availCoupon.description || "Special discount"}
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        setCouponCode(availCoupon.code);
                        handleValidateCoupon();
                      }}
                      className="px-3 py-1 bg-theme3/20 text-theme3 rounded-lg text-xs font-semibold hover:bg-theme3/30 transition-colors"
                    >
                      Use
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

