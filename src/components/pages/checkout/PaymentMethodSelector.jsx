"use client";
import { motion } from "framer-motion";
import { CreditCard, Wallet } from "lucide-react";

export default function PaymentMethodSelector({ paymentMethod, setPaymentMethod }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setPaymentMethod("card")}
        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
          paymentMethod === "card"
            ? "border-theme3 bg-theme3/20"
            : "border-white/20 bg-white/5 hover:border-theme3/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <CreditCard className="w-6 h-6 text-theme3" />
          <span className="text-white font-['Epilogue',sans-serif] font-bold">
            Credit/Debit Card
          </span>
        </div>
      </motion.button>

      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setPaymentMethod("cash")}
        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
          paymentMethod === "cash"
            ? "border-theme3 bg-theme3/20"
            : "border-white/20 bg-white/5 hover:border-theme3/50"
        }`}
      >
        <div className="flex items-center gap-3">
          <Wallet className="w-6 h-6 text-theme3" />
          <span className="text-white font-['Epilogue',sans-serif] font-bold">
            Cash on Delivery
          </span>
        </div>
      </motion.button>
    </div>
  );
}

