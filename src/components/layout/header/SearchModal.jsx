"use client";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

export default function SearchModal({ searchOpen, setSearchOpen }) {
  const { lang } = useLanguage();
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 },
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.9,
      y: -20,
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      }
    },
    exit: { 
      opacity: 0, 
      scale: 0.9,
      y: -20,
      transition: {
        duration: 0.2,
      }
    },
  };

  return (
    <AnimatePresence>
      {searchOpen && (
        <motion.div
          variants={overlayVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 bg-black/40 z-[10000] flex items-center justify-center p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setSearchOpen(false);
            }
          }}
        >
          <motion.div
            variants={modalVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="bg-white rounded-2xl w-full max-w-md shadow-2xl"
          >
            {/* Header with Search title and close button */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <Search className="w-6 h-6 text-theme3 mr-3" />
                <span className="text-xl font-normal text-gray-900 tracking-wide">
                  {t(lang, "search")}
                </span>
              </div>
              <motion.button
                onClick={() => setSearchOpen(false)}
                className="text-gray-500 hover:text-theme rounded-full p-1"
                aria-label={t(lang, "close_search")}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-6 h-6" />
              </motion.button>
            </div>

            {/* Search input */}
            <div className="p-6">
              <motion.input
                type="text"
                placeholder={t(lang, "type_to_search")}
                className="w-full px-4 py-4 text-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-theme3 rounded-lg transition-all duration-300 bg-transparent border border-gray-200 focus:border-theme3"
                autoFocus
                initial={{ scale: 0.95 }}
                animate={{ scale: 1 }}
                transition={{ delay: 0.1 }}
                onKeyDown={(e) => {
                  if (e.key === "Escape") {
                    setSearchOpen(false);
                  }
                }}
              />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
