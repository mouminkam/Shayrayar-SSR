"use client";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, Plus, Minus } from "lucide-react";
import useCartStore from "../../store/cartStore";
import { formatCurrency } from "../../lib/utils/formatters";
import { IMAGE_PATHS } from "../../data/constants";

const CartTable = memo(() => {
  const { items, removeFromCart, increaseQty, decreaseQty } = useCartStore();

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-cart text-center py-16"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-24 h-24 bg-linear-to-br from-theme/20 to-theme3/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-theme3/30"
        >
          <Trash2 className="w-12 h-12 text-theme3" />
        </motion.div>
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-black mb-2">
          Your cart is empty
        </h3>
        <p className="text-text text-base mb-6">
          Start adding items to your cart!
        </p>
        <motion.div whileHover={{ scale: 1.05, y: -2 }} whileTap={{ scale: 0.95 }}>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white font-['Epilogue',sans-serif] text-base font-semibold rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </motion.div>
    );
  }

  // Desktop Table View
  const DesktopTable = () => (
    <div className="hidden lg:block overflow-x-auto mb-5">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b-2 border-white/10">
            <th className="text-left py-4 px-4 font-['Epilogue',sans-serif] text-white font-bold">
              Product
            </th>
            <th className="text-center py-4 px-4 font-['Epilogue',sans-serif] text-white font-bold">
              Price
            </th>
            <th className="text-center py-4 px-4 font-['Epilogue',sans-serif] text-white font-bold">
              Quantity
            </th>
            <th className="text-center py-4 px-4 font-['Epilogue',sans-serif] text-white font-bold">
              Subtotal
            </th>
            <th className="text-center py-4 px-4 font-['Epilogue',sans-serif] text-white font-bold w-12">
              Action
            </th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, index) => (
            <motion.tr
              key={item.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              className="border-b border-white/10 transition-colors duration-300 hover:bg-white/5"
            >
              <td className="py-6 px-4">
                <div className="flex items-center gap-4">
                  <Link href="/shop-details" className="shrink-0 group">
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      className="relative w-20 h-20 rounded-xl overflow-hidden transition-all duration-300"
                    >
                      <Image
                        src={item.image || IMAGE_PATHS.placeholder}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized={true}
                      />
                    </motion.div>
                  </Link>
                  <Link
                    href="/shop-details"
                    className="text-white font-['Epilogue',sans-serif] text-lg font-bold hover:text-theme transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </div>
              </td>
              <td className="text-center py-6 px-4">
                <span className="text-theme font-['Epilogue',sans-serif] font-bold text-lg">
                  {formatCurrency(item.price)}
                </span>
              </td>
              <td className="text-center py-6 px-4">
                <div className="flex items-center justify-center gap-3">
                  <motion.button
                    onClick={() => decreaseQty(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-theme text-white rounded-lg transition-all duration-300 border border-white/20 hover:border-theme"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-white font-['Epilogue',sans-serif] font-semibold text-base min-w-[2rem]">
                    {item.quantity}
                  </span>
                  <motion.button
                    onClick={() => increaseQty(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-theme text-white rounded-lg transition-all duration-300 border border-white/20 hover:border-theme"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
              </td>
              <td className="text-center py-6 px-4">
                <span className="text-theme3 font-['Epilogue',sans-serif] font-bold text-lg">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </td>
              <td className="text-center py-6 px-4">
                <motion.button
                  onClick={() => removeFromCart(item.id)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-theme hover:bg-theme/10 rounded-lg transition-all duration-300 mx-auto"
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile Card View
  const MobileCardView = () => (
    <div className="lg:hidden space-y-4 mb-8">
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: index * 0.05 }}
          className="cart-item-card relative bg-linear-to-br from-white/10 via-bgimg/50 to-bgimg/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/20 hover:border-theme3/50 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            <Link href="/shop-details" className="shrink-0 group">
              <div className="relative w-full sm:w-24 h-50 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={item.image || IMAGE_PATHS.placeholder}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized={true}
                />
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <Link
                href="/shop-details"
                className="text-white font-['Epilogue',sans-serif] text-lg font-bold hover:text-theme transition-colors duration-300 block mb-2"
              >
                {item.name}
              </Link>
              <div className="text-theme font-['Epilogue',sans-serif] font-bold text-base mb-3">
                {formatCurrency(item.price)}
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <motion.button
                    onClick={() => decreaseQty(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-theme text-white rounded-lg transition-all duration-300 border border-white/20 hover:border-theme"
                    aria-label="Decrease quantity"
                  >
                    <Minus className="w-4 h-4" />
                  </motion.button>
                  <span className="text-white font-['Epilogue',sans-serif] font-semibold text-base min-w-[2rem] text-center">
                    {item.quantity}
                  </span>
                  <motion.button
                    onClick={() => increaseQty(item.id)}
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-8 h-8 flex items-center justify-center bg-white/10 hover:bg-theme text-white rounded-lg transition-all duration-300 border border-white/20 hover:border-theme"
                    aria-label="Increase quantity"
                  >
                    <Plus className="w-4 h-4" />
                  </motion.button>
                </div>
                <div className="text-right">
                  <div className="text-theme3 font-['Epilogue',sans-serif] font-bold text-lg">
                    {formatCurrency(item.price * item.quantity)}
                  </div>
                </div>
              </div>

              {/* Remove Button */}
              <motion.button
                onClick={() => removeFromCart(item.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-transparent border-2 border-theme text-theme text-sm font-semibold rounded-xl hover:bg-theme hover:text-white transition-all duration-300"
                aria-label={`Remove ${item.name} from cart`}
              >
                <Trash2 className="w-4 h-4" />
                Remove
              </motion.button>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="cart-table-wrapper">
      <DesktopTable />
      <MobileCardView />
    </div>
  );
});

CartTable.displayName = "CartTable";

export default CartTable;

