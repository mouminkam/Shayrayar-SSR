"use client";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import useCartStore from "../../../store/cartStore";
import PaymentMethodSelector from "./PaymentMethodSelector";

export default function PaymentMethodSection({ formData, setFormData }) {
  const { orderType } = useCartStore();
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 shadow-2xl rounded-xl bg-theme flex items-center justify-center"
        >
          <CreditCard className="w-6 h-6 text-white fill-white" />
        </motion.div>
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-black uppercase">
          Payment Method
        </h3>
      </div>

      <PaymentMethodSelector
        paymentMethod={formData.paymentMethod}
        setPaymentMethod={(method) => setFormData((prev) => ({ ...prev, paymentMethod: method }))}
      />

      {formData.paymentMethod === "stripe" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-theme3/20 border border-theme3/50 rounded-xl"
        >
          <p className="text-white text-sm font-['Roboto',sans-serif]">
            Stripe payment method selected.
          </p>
        </motion.div>
      )}

      {formData.paymentMethod === "cash" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-green-500/20 border border-green-500/50 rounded-xl"
        >
          <p className="text-green-300 text-sm font-['Roboto',sans-serif]">
            You will pay in cash when the order is {orderType === 'pickup' ? 'picked up' : 'delivered'}.
          </p>
        </motion.div>
      )}
    </div>
  );
}

