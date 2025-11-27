"use client";
import { motion } from "framer-motion";
import { Wallet, Zap } from "lucide-react";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

export default function PaymentMethodSelector({ paymentMethod, setPaymentMethod }) {
  const { lang } = useLanguage();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <motion.button
        type="button"
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => setPaymentMethod("stripe")}
        className={`p-4 rounded-xl border-2 transition-all duration-300 ${
          paymentMethod === "stripe"
            ? "border-theme3 bg-theme3/20"
            : "border-white/20 bg-white/5 hover:border-theme3/50"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <Zap className={`w-6 h-6 ${paymentMethod === "stripe" ? "text-theme3" : "text-text"}`} />
          <span className={` font-bold text-sm ${
            paymentMethod === "stripe" ? "text-theme3" : "text-white"
          }`}>
            {t(lang, "stripe")}
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
        <div className="flex flex-col items-center gap-2">
          <Wallet className={`w-6 h-6 ${paymentMethod === "cash" ? "text-theme3" : "text-text"}`} />
          <span className={` font-bold text-sm ${
            paymentMethod === "cash" ? "text-theme3" : "text-white"
          }`}>
            {t(lang, "cash")}
          </span>
        </div>
      </motion.button>
    </div>
  );
}

