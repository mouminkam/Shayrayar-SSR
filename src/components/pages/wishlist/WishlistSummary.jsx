"use client";
import { memo, useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ShoppingCart, Trash2, Heart, Package } from "lucide-react";
import useWishlistStore from "../../../store/wishlistStore";
import useCartStore from "../../../store/cartStore";

const WishlistSummary = memo(() => {
  const items = useWishlistStore((state) => state.items);
  const clearWishlist = useWishlistStore((state) => state.clearWishlist);
  const { addToCart } = useCartStore();

  // Derived count - auto-recalculate when items change
  const itemCount = useMemo(() => {
    return items.length;
  }, [items]);

  const handleMoveAllToCart = () => {
    items.forEach((item) => {
      addToCart({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
      });
    });
  };

  const handleClearWishlist = () => {
    if (confirm("Are you sure you want to clear your wishlist?")) {
      clearWishlist();
    }
  };

  if (items.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="wishlist-summary bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8 sticky top-8"
    >
      <div className="flex items-center gap-3 mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-12 h-12 shadow-2xl rounded-xl bg-theme3 flex items-center justify-center"
        >
          <Heart className="w-6 h-6 text-white fill-white" />
        </motion.div>
        <h3 className="text-white  text-2xl font-black uppercase">
          Wishlist Summary
        </h3>
      </div>

      <div className="space-y-4 mb-6">
        {/* Total Items */}
        <div className="flex justify-between items-center py-4 border-t-2 border-theme3/30 border-b-2 border-theme3/30">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-theme3" />
            <span className="text-white  text-xl font-black uppercase">
              Total Items
            </span>
          </div>
          <span className="text-theme3  text-2xl font-black">
            {itemCount}
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="space-y-3">
        {/* Move All to Cart Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button
            onClick={handleMoveAllToCart}
            className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-4 px-6 transition-all duration-300 text-base  font-semibold uppercase rounded-xl shadow-lg hover:shadow-xl hover:shadow-theme3/40 border border-theme3/30 flex items-center justify-center gap-2"
          >
            <ShoppingCart className="w-5 h-5" />
            Move All to Cart
          </button>
        </motion.div>

        {/* Clear Wishlist Button */}
        <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
          <button
            onClick={handleClearWishlist}
            className="w-full border-2 border-theme text-theme py-3 px-6 hover:bg-theme hover:text-white transition-all duration-300 text-base  font-medium rounded-xl flex items-center justify-center gap-2"
          >
            <Trash2 className="w-5 h-5" />
            Clear Wishlist
          </button>
        </motion.div>

        {/* Continue Shopping Link */}
        <motion.div
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="mt-4"
        >
          <Link
            href="/shop"
            className="w-full border-2 border-white/20 hover:border-theme text-white py-3 px-6 hover:bg-theme/10 transition-all duration-300 text-base  font-medium block text-center rounded-xl"
          >
            Continue Shopping
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
});

WishlistSummary.displayName = "WishlistSummary";

export default WishlistSummary;

