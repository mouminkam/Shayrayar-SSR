"use client";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Minus, AlertCircle, CheckCircle } from "lucide-react";
import { formatCurrency } from "../../../lib/utils/formatters";
import useCartStore from "../../../store/cartStore";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

/**
 * ReorderModal Component
 * Modal for confirming and editing reorder items before adding to cart
 */
export default function ReorderModal({ isOpen, onClose, reorderData, isLoading }) {
  const { lang } = useLanguage();
  const { addToCart } = useCartStore();
  
  const [items, setItems] = useState([]);
  const [missingItems, setMissingItems] = useState([]);

  // Initialize items with quantities from reorderData
  useEffect(() => {
    if (reorderData?.items) {
      setItems(
        reorderData.items.map((item) => ({
          ...item,
          quantity: item.quantity || 1,
        }))
      );
    }
    if (reorderData?.missing_items) {
      setMissingItems(reorderData.missing_items);
    }
  }, [reorderData]);

  // Reset when modal closes
  useEffect(() => {
    if (!isOpen) {
      setItems([]);
      setMissingItems([]);
    }
  }, [isOpen]);

  const handleQuantityChange = (index, delta) => {
    setItems((prev) =>
      prev.map((item, i) =>
        i === index
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleAddToCart = () => {
    if (items.length === 0) return;

    // Add each item to cart with its quantity
    items.forEach((item) => {
      // Build cart item structure
      const cartItem = {
        id: item.menu_item_id,
        menu_item_id: item.menu_item_id,
        name: item.item_name || `Item ${item.menu_item_id}`,
        title: item.item_name || `Item ${item.menu_item_id}`,
        price: item.price || 0,
        base_price: item.price || 0,
        final_price: item.price || 0,
        quantity: item.quantity,
        size_id: item.size_id || null,
        size_name: item.size_name || null,
        ingredients: item.selected_ingredients || [],
        selected_options: item.selected_options || null,
        special_instructions: item.special_instructions || null,
        image: item.image_url || null,
      };

      // Add to cart (quantity times)
      for (let i = 0; i < item.quantity; i++) {
        addToCart(cartItem);
      }
    });

    onClose();
  };

  // Use portal to render modal at document body level
  if (typeof window === 'undefined') return null;
  if (!isOpen) return null;

  const modalContent = (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 flex items-center justify-center bg-black/75 backdrop-blur-md z-50"
          onClick={onClose}
          style={{ 
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            zIndex: 999999,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '1rem'
          }}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="relative w-full max-w-2xl bg-linear-to-br from-bgimg/98 via-bgimg/95 to-bgimg/90 backdrop-blur-lg rounded-2xl sm:rounded-3xl shadow-2xl border border-white/20 overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
            style={{ 
              maxHeight: '90vh',
              maxWidth: '90vw',
              margin: 'auto',
              position: 'relative'
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 sm:p-6 border-b border-white/20 shrink-0 bg-linear-to-r from-bgimg/95 via-bgimg/90 to-bgimg/95 backdrop-blur-sm">
              <h2 className="text-white text-lg sm:text-xl md:text-2xl font-black">
                {t(lang, "reorder_order")}
              </h2>
              <button
                onClick={onClose}
                className="w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center rounded-full bg-white/20 hover:bg-white/30 text-white transition-all duration-300 shrink-0"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 sm:p-6">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme3"></div>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Missing Items Warning */}
                  {missingItems.length > 0 && (
                    <div className="p-4 bg-yellow-500/20 border border-yellow-500/50 rounded-xl">
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-yellow-400 shrink-0 mt-0.5" />
                        <div className="flex-1">
                          <h3 className="text-yellow-300 font-semibold mb-2">
                            {t(lang, "items_unavailable")}
                          </h3>
                          <ul className="space-y-1">
                            {missingItems.map((item, idx) => (
                              <li key={idx} className="text-yellow-200 text-sm">
                                • {item.item_name} ({t(lang, item.reason || "unavailable")})
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Available Items */}
                  {items.length > 0 ? (
                    <div className="space-y-4">
                      <h3 className="text-white text-lg font-semibold">
                        {t(lang, "items_to_add")}
                      </h3>
                      {items.map((item, index) => (
                        <div
                          key={index}
                          className="p-4 bg-white/5 rounded-xl border border-white/10"
                        >
                          <div className="flex items-center justify-between mb-3">
                            <div className="flex-1">
                              <h4 className="text-white font-semibold">
                                {item.item_name || `Item ${item.menu_item_id}`}
                              </h4>
                              {item.special_instructions && (
                                <p className="text-text/70 text-sm mt-1">
                                  {t(lang, "special_instructions")}: {item.special_instructions}
                                </p>
                              )}
                            </div>
                            <div className="text-theme3 font-bold">
                              {formatCurrency(item.price || 0)}
                            </div>
                          </div>

                          {/* Quantity Selector */}
                          <div className="flex items-center justify-between">
                            <span className="text-text text-sm">
                              {t(lang, "quantity")}:
                            </span>
                            <div className="flex items-center gap-2">
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(index, -1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <span className="w-12 text-center text-white font-semibold">
                                {item.quantity}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleQuantityChange(index, 1)}
                                className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <p className="text-text text-base">
                        {t(lang, "no_items_to_add")}
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer */}
            {items.length > 0 && (
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3 sm:gap-4 p-4 sm:p-6 border-t border-white/10 shrink-0">
                <button
                  onClick={onClose}
                  className="w-full sm:w-auto px-6 py-3 bg-transparent border-2 border-white/20 text-white rounded-xl hover:border-white/40 transition-colors font-semibold"
                >
                  {t(lang, "cancel")}
                </button>
                <button
                  onClick={handleAddToCart}
                  disabled={isLoading || items.length === 0}
                  className="w-full sm:w-auto px-6 py-3 bg-theme3 text-white rounded-xl hover:bg-theme transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  <CheckCircle className="w-5 h-5" />
                  {t(lang, "add_to_cart")}
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );

  return createPortal(modalContent, document.body);
}

