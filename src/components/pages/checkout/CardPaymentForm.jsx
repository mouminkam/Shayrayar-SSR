"use client";
import { motion } from "framer-motion";

export default function CardPaymentForm({ formData, handleInputChange, handleCardNumberChange, handleExpiryChange }) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10"
    >
      <div>
        <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
          Card Number *
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
          placeholder="1234 5678 9012 3456"
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
        />
      </div>
      <div>
        <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
          Cardholder Name *
        </label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleInputChange}
          placeholder="John Doe"
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
            Expiry Date *
          </label>
          <input
            type="text"
            name="cardExpiry"
            value={formData.cardExpiry}
            onChange={handleExpiryChange}
            maxLength={5}
            placeholder="MM/YY"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-text font-['Roboto',sans-serif] text-sm font-medium mb-2">
            CVC *
          </label>
          <input
            type="text"
            name="cardCVC"
            value={formData.cardCVC}
            onChange={handleInputChange}
            maxLength={4}
            placeholder="123"
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
}

