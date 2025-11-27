"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Package, ArrowRight } from "lucide-react";
import OrderCard from "./OrderCard";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

export default function OrdersHistory({ orders, showViewAll = true, maxDisplay = null, totalOrders = null }) {
  const { lang } = useLanguage();
  // Ensure orders is always an array
  const ordersList = Array.isArray(orders) ? orders : [];
  const DISPLAY_LIMIT = 5;
  
  // Use totalOrders if provided (from pagination), otherwise use ordersList.length
  const totalOrdersCount = totalOrders !== null ? totalOrders : ordersList.length;
  
  // If maxDisplay is provided, use it; otherwise use default logic
  let displayedOrders;
  let hasMoreOrders;
  
  if (maxDisplay !== null) {
    // Use maxDisplay limit (for /orders page)
    displayedOrders = ordersList.slice(0, maxDisplay);
    hasMoreOrders = ordersList.length > maxDisplay;
  } else if (showViewAll) {
    // Use default limit for profile page
    displayedOrders = ordersList.slice(0, DISPLAY_LIMIT);
    hasMoreOrders = ordersList.length > DISPLAY_LIMIT;
  } else {
    // Show all orders (fallback)
    displayedOrders = ordersList;
    hasMoreOrders = false;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 shadow-2xl rounded-xl bg-theme flex items-center justify-center"
          >
            <ShoppingBag className="w-6 h-6 text-white fill-white" />
          </motion.div>
          <h3 className="text-white  text-2xl font-black uppercase">
            {t(lang, "order_history")}
          </h3>
        </div>
        {totalOrdersCount > 0 && (
          <span className="text-text text-sm font-medium">
            {totalOrdersCount} {totalOrdersCount === 1 ? t(lang, "order") : t(lang, "orders")}
          </span>
        )}
      </div>

      {ordersList.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-text/30 mx-auto mb-4" />
          <p className="text-text text-lg mb-2">{t(lang, "no_orders_yet")}</p>
          <p className="text-text/70 text-sm mb-6">
            {t(lang, "start_shopping_to_see_orders")}
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white  text-sm font-semibold rounded-xl transition-all duration-300"
          >
            {t(lang, "start_shopping")}
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {displayedOrders.map((order, index) => (
              <OrderCard key={order.id} order={order} index={index} />
            ))}
          </div>
          
          {hasMoreOrders && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="mt-6 pt-6 border-t border-white/10"
            >
              <Link
                href="/orders"
                className="flex items-center justify-center gap-2 px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-theme3/50 rounded-xl text-white  text-sm font-semibold transition-all duration-300 group"
              >
                {t(lang, "view_all_orders")} ({totalOrdersCount})
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </motion.div>
          )}
        </>
      )}
    </motion.div>
  );
}

