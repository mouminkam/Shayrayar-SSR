"use client";
import { motion } from "framer-motion";
import { CreditCard } from "lucide-react";
import PaymentMethodSelector from "./PaymentMethodSelector";
import CardPaymentForm from "./CardPaymentForm";

export default function PaymentMethodSection({ formData, handleInputChange, handleCardNumberChange, handleExpiryChange, setFormData }) {
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

      {formData.paymentMethod === "card" && (
        <CardPaymentForm
          formData={formData}
          handleInputChange={handleInputChange}
          handleCardNumberChange={handleCardNumberChange}
          handleExpiryChange={handleExpiryChange}
        />
      )}

      {formData.paymentMethod === "cash" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="p-4 bg-blue-500/20 border border-blue-500/50 rounded-xl"
        >
          <p className="text-blue-300 text-sm font-['Roboto',sans-serif]">
            You will pay in cash when the order is delivered.
          </p>
        </motion.div>
      )}
    </div>
  );
}

