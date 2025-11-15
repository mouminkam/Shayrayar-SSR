"use client";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { formatCurrency } from "../../../lib/utils/formatters";

export default function OrderCard({ order, index }) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-theme3/50 transition-all duration-300"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <p className="text-white font-['Epilogue',sans-serif] font-bold text-lg mb-1">
            Order #{order.id.slice(-8).toUpperCase()}
          </p>
          <p className="text-text text-sm">
            {new Date(order.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <div className="text-right">
          <p className="text-theme3 font-['Epilogue',sans-serif] font-black text-xl mb-1">
            {formatCurrency(order.total)}
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
              order.status === "completed"
                ? "bg-green-500/20 text-green-300"
                : order.status === "processing"
                ? "bg-blue-500/20 text-blue-300"
                : "bg-yellow-500/20 text-yellow-300"
            }`}
          >
            {order.status}
          </span>
        </div>
      </div>

      {/* Order Items */}
      <div className="space-y-2 mb-4 pt-4 border-t border-white/10">
        {order.items?.slice(0, 3).map((item) => (
          <div key={item.id} className="flex items-center gap-3 text-sm">
            <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
              <Image
                src={item.image || "/img/placeholder.png"}
                alt={item.name}
                fill
                className="object-cover"
                unoptimized={true}
              />
            </div>
            <div className="flex-1">
              <p className="text-white font-medium">{item.name}</p>
              <p className="text-text text-xs">
                Qty: {item.quantity} × {formatCurrency(item.price)}
              </p>
            </div>
            <p className="text-theme3 font-bold">
              {formatCurrency(item.price * item.quantity)}
            </p>
          </div>
        ))}
        {order.items?.length > 3 && (
          <p className="text-text text-xs text-center pt-2">
            +{order.items.length - 3} more item(s)
          </p>
        )}
      </div>

      {/* Payment Method */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <p className="text-text text-sm">
          Payment:{" "}
          <span className="text-white font-medium capitalize">
            {order.paymentMethod}
          </span>
        </p>
        <Link
          href={`/profile?order=${order.id}`}
          className="text-theme3 hover:text-theme text-sm font-medium transition-colors"
        >
          View Details
        </Link>
      </div>
    </motion.div>
  );
}

