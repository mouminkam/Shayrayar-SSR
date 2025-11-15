"use client";
import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Trash2, ShoppingCart, Heart } from "lucide-react";
import useWishlistStore from "../../../store/wishlistStore";
import useCartStore from "../../../store/cartStore";

const WishlistTable = memo(() => {
  const { items, removeFromWishlist } = useWishlistStore();
  const { addToCart } = useCartStore();

  const handleMoveToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
    });
    // Optionally remove from wishlist after adding to cart
    // removeFromWishlist(item.id);
  };

  if (items.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="empty-wishlist text-center py-16"
      >
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          className="w-24 h-24 bg-linear-to-br from-theme/20 to-theme3/20 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 border-2 border-theme3/30"
        >
          <Heart className="w-12 h-12 text-theme3" />
        </motion.div>
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-black mb-2">
          Your wishlist is empty
        </h3>
        <p className="text-text text-base mb-6">
          Start adding items to your wishlist!
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
              Action
            </th>
            <th className="text-center py-4 px-4 font-['Epilogue',sans-serif] text-white font-bold w-12">
              Remove
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
                        src={item.image || "/img/placeholder.png"}
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
                {item.originalPrice ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="text-theme font-['Epilogue',sans-serif] font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-text opacity-60 text-sm line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-theme font-['Epilogue',sans-serif] font-bold text-lg">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </td>
              <td className="text-center py-6 px-4">
                <motion.button
                  onClick={() => handleMoveToCart(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-transparent border-2 border-theme3 text-theme3 text-sm font-semibold rounded-xl hover:bg-theme3 hover:text-white transition-all duration-300"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>
              </td>
              <td className="text-center py-6 px-4">
                <motion.button
                  onClick={() => removeFromWishlist(item.id)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-theme hover:bg-theme/10 rounded-lg transition-all duration-300 mx-auto"
                  aria-label={`Remove ${item.name} from wishlist`}
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
          className="wishlist-item-card relative bg-linear-to-br from-white/10 via-bgimg/50 to-bgimg/80 backdrop-blur-sm rounded-2xl shadow-xl p-4 border border-white/20 hover:border-theme3/50 hover:shadow-2xl transition-all duration-300"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Image */}
            <Link href="/shop-details" className="shrink-0 group">
              <div className="relative w-full sm:w-24 h-24 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={item.image || "/img/placeholder.png"}
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
              <div className="mb-3">
                {item.originalPrice ? (
                  <div className="flex items-center gap-2">
                    <span className="text-theme font-['Epilogue',sans-serif] font-bold text-base">
                      ${item.price.toFixed(2)}
                    </span>
                    <span className="text-text opacity-60 text-sm line-through">
                      ${item.originalPrice.toFixed(2)}
                    </span>
                  </div>
                ) : (
                  <span className="text-theme font-['Epilogue',sans-serif] font-bold text-base">
                    ${item.price.toFixed(2)}
                  </span>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  onClick={() => handleMoveToCart(item)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex-1 inline-flex items-center justify-center gap-2 px-4 py-2 bg-transparent border-2 border-theme3 text-theme3 text-sm font-semibold rounded-xl hover:bg-theme3 hover:text-white transition-all duration-300"
                  aria-label={`Add ${item.name} to cart`}
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </motion.button>
                <motion.button
                  onClick={() => removeFromWishlist(item.id)}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  whileTap={{ scale: 0.9 }}
                  className="w-10 h-10 flex items-center justify-center text-white/60 hover:text-theme hover:bg-theme/10 rounded-lg transition-all duration-300"
                  aria-label={`Remove ${item.name} from wishlist`}
                >
                  <Trash2 className="w-5 h-5" />
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );

  return (
    <div className="wishlist-table-wrapper">
      <DesktopTable />
      <MobileCardView />
    </div>
  );
});

WishlistTable.displayName = "WishlistTable";

export default WishlistTable;
