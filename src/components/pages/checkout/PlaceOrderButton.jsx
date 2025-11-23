"use client";
import { motion } from "framer-motion";
import { Lock } from "lucide-react";

export default function PlaceOrderButton({ isProcessing, onClick }) {
  return (
    <motion.button
      type="submit"
      disabled={isProcessing}
      onClick={onClick}
      whileHover={{ scale: isProcessing ? 1 : 1.02 }}
      whileTap={{ scale: isProcessing ? 1 : 0.98 }}
      className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base  font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
    >
      {isProcessing ? (
        <>
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          >
            <Lock className="w-5 h-5" />
          </motion.div>
          Processing...
        </>
      ) : (
        <>
          <Lock className="w-5 h-5" />
          Place Order
        </>
      )}
    </motion.button>
  );
}

