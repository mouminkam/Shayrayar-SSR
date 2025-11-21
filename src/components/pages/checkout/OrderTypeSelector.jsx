"use client";
import { motion } from "framer-motion";
import { Package, Store } from "lucide-react";
import useCartStore from "../../../store/cartStore";

export default function OrderTypeSelector() {
  const { orderType, setOrderType } = useCartStore();

  return (
    <div className="mb-6">
      <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-3">
        Order Type *
      </label>
      <div className="grid grid-cols-2 gap-4">
        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOrderType('delivery')}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            orderType === "delivery"
              ? "border-theme3 bg-theme3/20"
              : "border-white/20 bg-white/5 hover:border-theme3/50"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Package className={`w-6 h-6 ${orderType === "delivery" ? "text-theme3" : "text-text"}`} />
            <span className={`font-['Epilogue',sans-serif] font-bold ${
              orderType === "delivery" ? "text-theme3" : "text-white"
            }`}>
              Delivery
            </span>
          </div>
        </motion.button>

        <motion.button
          type="button"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setOrderType('pickup')}
          className={`p-4 rounded-xl border-2 transition-all duration-300 ${
            orderType === "pickup"
              ? "border-theme3 bg-theme3/20"
              : "border-white/20 bg-white/5 hover:border-theme3/50"
          }`}
        >
          <div className="flex flex-col items-center gap-2">
            <Store className={`w-6 h-6 ${orderType === "pickup" ? "text-theme3" : "text-text"}`} />
            <span className={`font-['Epilogue',sans-serif] font-bold ${
              orderType === "pickup" ? "text-theme3" : "text-white"
            }`}>
              Pickup
            </span>
          </div>
        </motion.button>
      </div>
    </div>
  );
}

