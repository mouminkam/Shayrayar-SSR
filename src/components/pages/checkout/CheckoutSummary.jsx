"use client";
import { memo, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { ShoppingCart, Package } from "lucide-react";
import useCartStore from "../../../store/cartStore";
import { formatCurrency } from "../../../lib/utils/formatters";

const CheckoutSummary = memo(() => {
  const items = useCartStore((state) => state.items);

  // Derived calculations
  const subtotal = useMemo(() => {
    return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  }, [items]);

  const tax = useMemo(() => {
    return subtotal * 0.1; // 10% tax
  }, [subtotal]);

  const shipping = useMemo(() => {
    return subtotal > 100 ? 0 : 10; // Free shipping over $100
  }, [subtotal]);

  const total = useMemo(() => {
    return subtotal + tax + shipping;
  }, [subtotal, tax, shipping]);

  const itemCount = useMemo(() => {
    return items.reduce((sum, item) => sum + item.quantity, 0);
  }, [items]);

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="checkout-summary bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8 sticky top-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center"
        >
          <ShoppingCart className="w-6 h-6 text-white fill-white" />
        </motion.div>
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-black uppercase">
          Order Summary
        </h3>
      </div>

      {/* Order Items */}
      <div className="space-y-3 mb-6 max-h-64 overflow-y-auto pr-2">
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 p-3 bg-white/5 rounded-xl border border-white/10"
          >
            <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.image || "/img/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="text-white font-['Epilogue',sans-serif] text-sm font-bold truncate">
                {item.name}
              </h4>
              <p className="text-text text-xs">
                Qty: {item.quantity} × {formatCurrency(item.price)}
              </p>
            </div>
            <div className="text-theme3 font-['Epilogue',sans-serif] text-sm font-bold">
              {formatCurrency(item.price * item.quantity)}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Details */}
      <div className="space-y-3 mb-6 pt-4 border-t border-white/10">
        {/* Item Count */}
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-theme3" />
            <span className="text-text font-['Roboto',sans-serif] text-sm font-medium">
              Items ({itemCount})
            </span>
          </div>
          <span className="text-white font-['Epilogue',sans-serif] text-sm font-bold">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Subtotal */}
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-text font-['Roboto',sans-serif] text-base font-medium">
            Subtotal
          </span>
          <span className="text-white font-['Epilogue',sans-serif] text-lg font-bold">
            {formatCurrency(subtotal)}
          </span>
        </div>

        {/* Shipping */}
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-text font-['Roboto',sans-serif] text-base font-medium">
            Shipping
          </span>
          <span className="text-white font-['Epilogue',sans-serif] text-lg font-bold">
            {shipping === 0 ? (
              <span className="text-theme3">FREE</span>
            ) : (
              formatCurrency(shipping)
            )}
          </span>
        </div>

        {/* Tax */}
        <div className="flex justify-between items-center py-2 border-b border-white/10">
          <span className="text-text font-['Roboto',sans-serif] text-base font-medium">
            Tax (10%)
          </span>
          <span className="text-white font-['Epilogue',sans-serif] text-lg font-bold">
            {formatCurrency(tax)}
          </span>
        </div>

        {/* Total */}
        <div className="flex justify-between items-center py-4 border-t-2 border-theme3/30">
          <span className="text-white font-['Epilogue',sans-serif] text-xl font-black uppercase">
            Total
          </span>
          <span className="text-theme3 font-['Epilogue',sans-serif] text-2xl font-black">
            {formatCurrency(total)}
          </span>
        </div>
      </div>
    </motion.div>
  );
});

CheckoutSummary.displayName = "CheckoutSummary";

export default CheckoutSummary;

