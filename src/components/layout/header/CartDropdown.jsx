"use client";
import Link from "next/link";
import Image from "next/image";
import { X } from "lucide-react";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "../../../hooks/useCart";
import { formatCurrency } from "../../../lib/utils/formatters";
import { IMAGE_PATHS } from "../../../data/constants";
import { getCartItemKey } from "../../../store/cartStore";

export default function CartDropdown({
  cartOpen,
  setCartOpen,
}) {
  const cartTimeoutRef = useRef(null);
  const { items: cartItems, subtotal, removeFromCart } = useCart();

  const handleMouseEnter = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    setCartOpen(true);
  };

  const handleMouseLeave = () => {
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }
    cartTimeoutRef.current = setTimeout(() => {
      setCartOpen(false);
      cartTimeoutRef.current = null;
    }, 300);
  };

  // Animation variants
  const dropdownVariants = {
    hidden: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95 
    },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      }
    },
    exit: { 
      opacity: 0, 
      y: -20, 
      scale: 0.95,
      transition: {
        duration: 0.2,
      }
    },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
        delayChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      transition: {
        staggerChildren: 0.03,
        staggerDirection: -1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: {
        duration: 0.3,
        ease: "easeOut",
      }
    },
    exit: { 
      opacity: 0, 
      x: -20,
      transition: {
        duration: 0.2,
      }
    },
  };

  return (
    <AnimatePresence>
      {cartOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full right-0 z-9999 w-72 md:w-80 bg-white shadow-2xl border border-gray-200 mt-4 p-4 md:p-6 rounded-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Header */}
            <motion.div
              variants={itemVariants}
              className="flex justify-between items-center mb-4"
            >
              <h3 className="text-base md:text-lg font-medium text-gray-900">
                Shopping Cart
              </h3>
              <motion.button
                onClick={() => setCartOpen(false)}
                className="text-gray-400 hover:text-theme rounded-full p-1 shrink-0"
                aria-label="Close cart"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </motion.div>

            {/* Cart Items */}
            <div 
              className="space-y-3 md:space-y-4 mb-4 max-h-64 overflow-y-auto overflow-x-hidden pr-2"
              style={{
                scrollbarWidth: 'thin',
                scrollbarColor: '#cbd5e1 #f1f5f9'
              }}
            >
              {cartItems.length === 0 ? (
                <motion.div
                  variants={itemVariants}
                  className="text-center py-8 text-gray-500"
                >
                  <p>Your cart is empty</p>
                </motion.div>
              ) : (
                cartItems.map((item, index) => {
                  const itemKey = getCartItemKey(item);
                  const itemPrice = item.final_price || item.price;
                  const hasCustomization = item.size_name || (item.ingredients_data && item.ingredients_data.length > 0);

                  return (
                    <motion.div
                      key={itemKey}
                      variants={itemVariants}
                      custom={index}
                      className="flex items-center justify-between py-2 border-b border-gray-100 gap-2"
                    >
                      <div className="flex items-center space-x-3 flex-1 min-w-0">
                        <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0 overflow-hidden">
                          {item.image ? (
                            <Image
                              src={item.image || IMAGE_PATHS.placeholder}
                              alt={item.name}
                              width={48}
                              height={48}
                              className="w-full h-full object-cover rounded"
                              quality={85}
                              loading="lazy"
                              sizes="48px"
                            />
                          ) : (
                            <span className="text-xs text-gray-600">🍔</span>
                          )}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {item.name}
                          </p>
                          {hasCustomization && (
                            <p className="text-xs text-gray-500 truncate">
                              {item.size_name && `${item.size_name}`}
                              {item.size_name && item.ingredients_data?.length > 0 && " • "}
                              {item.ingredients_data?.length > 0 && `${item.ingredients_data.length} add-on(s)`}
                            </p>
                          )}
                          <p className="text-sm text-gray-600">
                            {item.quantity} x{" "}
                            <span className="text-theme3 font-semibold">
                              {formatCurrency(itemPrice)}
                            </span>
                          </p>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => removeFromCart(itemKey)}
                        className="text-gray-400 hover:text-theme shrink-0 ml-2 rounded-full p-1 flex items-center justify-center"
                        aria-label={`Remove ${item.name} from cart`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="w-4 h-4" />
                      </motion.button>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Total and Buttons */}
            {cartItems.length > 0 && (
              <>
                <motion.div
                  variants={itemVariants}
                  className="flex justify-between items-center mb-4 pt-2 border-t border-gray-200"
                >
                  <span className="text-gray-600 font-medium">Total:</span>
                  <span className="text-lg font-semibold text-theme3">
                    {formatCurrency(subtotal)}
                  </span>
                </motion.div>

                <motion.div
                  variants={itemVariants}
                  className="space-y-2"
                >
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/checkout"
                      className="w-full bg-theme3 hover:bg-theme text-white py-3 px-4 transition-colors duration-300 text-sm font-medium block text-center rounded-md shadow-lg"
                      onClick={() => setCartOpen(false)}
                    >
                      Checkout
                    </Link>
                  </motion.div>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href="/cart"
                      className="w-full border border-gray-300 text-gray-700 py-3 px-4 hover:bg-gray-50 transition-colors duration-300 text-sm font-medium block text-center rounded-md"
                      onClick={() => setCartOpen(false)}
                    >
                      View Cart
                    </Link>
                  </motion.div>
                </motion.div>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
