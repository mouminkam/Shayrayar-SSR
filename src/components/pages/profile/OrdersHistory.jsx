"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingBag, Package } from "lucide-react";
import OrderCard from "./OrderCard";

export default function OrdersHistory({ orders }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 shadow-2xl rounded-xl bg-theme flex items-center justify-center"
        >
          <ShoppingBag className="w-6 h-6 text-white fill-white" />
        </motion.div>
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-black uppercase">
          Order History
        </h3>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-text/30 mx-auto mb-4" />
          <p className="text-text text-lg mb-2">No orders yet</p>
          <p className="text-text/70 text-sm mb-6">
            Start shopping to see your orders here
          </p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-6 py-3 bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white font-['Epilogue',sans-serif] text-sm font-semibold rounded-xl transition-all duration-300"
          >
            Start Shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, index) => (
            <OrderCard key={order.id} order={order} index={index} />
          ))}
        </div>
      )}
    </motion.div>
  );
}

