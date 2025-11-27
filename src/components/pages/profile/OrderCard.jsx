"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { formatCurrency } from "../../../lib/utils/formatters";
import { usePrefetchRoute } from "../../../hooks/usePrefetchRoute";
import OptimizedImage from "../../ui/OptimizedImage";
import { IMAGE_PATHS } from "../../../data/constants";

export default function OrderCard({ order, index }) {
  const router = useRouter();
  const { prefetchRoute } = usePrefetchRoute();

  const handleCardClick = () => {
    router.push(`/orders/${order.id}`, { scroll: false });
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'delivered':
        return 'bg-green-500/20 text-green-300';
      case 'confirmed':
      case 'preparing':
      case 'ready':
      case 'out_for_delivery':
        return 'bg-blue-500/20 text-blue-300';
      case 'cancelled':
        return 'bg-red-500/20 text-red-300';
      case 'pending':
      default:
        return 'bg-yellow-500/20 text-yellow-300';
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      onClick={handleCardClick}
      className="p-4 bg-white/5 rounded-xl border border-white/10 hover:border-theme3/50 transition-all duration-300 cursor-pointer group"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-4">
        <div>
          <p className="text-white  font-bold text-lg mb-1">
            {order.orderNumber || `Order #${String(order.id || '').slice(-8).toUpperCase()}`}
          </p>
          <p className="text-text text-sm">
            {order.date ? new Date(order.date).toLocaleDateString("en-US", {
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            }) : 'Date not available'}
          </p>
        </div>
        <div className="text-right">
          <p className="text-theme3  font-black text-xl mb-1">
            {formatCurrency(order.total)}
          </p>
          <span
            className={`inline-block px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order.status)}`}
          >
            {order.status?.replace('_', ' ') || 'pending'}
          </span>
        </div>
      </div>

      {/* Order Items */}
      {order.items && order.items.length > 0 && (
        <div className="space-y-2 mb-4 pt-4 border-t border-white/10">
          {order.items.slice(0, 3).map((item, idx) => (
            <div key={item.id || idx} className="flex items-center gap-3 text-sm">
              <div 
                className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0"
                onMouseEnter={() => item.id && prefetchRoute(`/shop/${item.id}`)}
              >
                <OptimizedImage
                  src={item.image || IMAGE_PATHS.placeholder}
                  alt={item.name || 'Item'}
                  fill
                  className="object-cover"
                  quality={85}
                  loading="lazy"
                  sizes="48px"
                />
              </div>
              <div className="flex-1">
                <p className="text-white font-medium">{item.name || 'Unknown Item'}</p>
                <p className="text-text text-xs">
                  Qty: {item.quantity || 1} × {formatCurrency(item.price || 0)}
                </p>
              </div>
              <p className="text-theme3 font-bold">
                {formatCurrency((item.price || 0) * (item.quantity || 1))}
              </p>
            </div>
          ))}
          {order.items.length > 3 && (
            <p className="text-text text-xs text-center pt-2">
              +{order.items.length - 3} more item(s)
            </p>
          )}
        </div>
      )}

      {/* Payment Method */}
      <div className="flex items-center justify-between pt-4 border-t border-white/10">
        <p className="text-text text-sm">
          Payment:{" "}
          <span className="text-white font-medium capitalize">
            {order.paymentMethod}
          </span>
        </p>
        <div className="flex items-center gap-2 text-theme3 group-hover:text-theme text-sm font-medium transition-colors">
          <span>View Details</span>
          <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

