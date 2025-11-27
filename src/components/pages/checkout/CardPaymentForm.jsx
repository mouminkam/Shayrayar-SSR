"use client";
import { motion } from "framer-motion";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

export default function CardPaymentForm({ formData, handleInputChange, handleCardNumberChange, handleExpiryChange }) {
  const { lang } = useLanguage();
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      className="space-y-4 p-4 bg-white/5 rounded-xl border border-white/10"
    >
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          {t(lang, "card_number")}
        </label>
        <input
          type="text"
          name="cardNumber"
          value={formData.cardNumber}
          onChange={handleCardNumberChange}
          maxLength={19}
          placeholder={t(lang, "card_number_placeholder")}
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
        />
      </div>
      <div>
        <label className="block text-text  text-sm font-medium mb-2">
          {t(lang, "cardholder_name")}
        </label>
        <input
          type="text"
          name="cardName"
          value={formData.cardName}
          onChange={handleInputChange}
          placeholder={t(lang, "cardholder_name_placeholder")}
          required
          className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-text  text-sm font-medium mb-2">
            {t(lang, "expiry_date")}
          </label>
          <input
            type="text"
            name="cardExpiry"
            value={formData.cardExpiry}
            onChange={handleExpiryChange}
            maxLength={5}
            placeholder={t(lang, "expiry_date_placeholder")}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
          />
        </div>
        <div>
          <label className="block text-text  text-sm font-medium mb-2">
            {t(lang, "cvc")}
          </label>
          <input
            type="text"
            name="cardCVC"
            value={formData.cardCVC}
            onChange={handleInputChange}
            maxLength={4}
            placeholder={t(lang, "cvc_placeholder")}
            required
            className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-xl text-white placeholder-text/50 focus:outline-none focus:border-theme3 focus:ring-2 focus:ring-theme3/20 transition-all duration-300"
          />
        </div>
      </div>
    </motion.div>
  );
}

