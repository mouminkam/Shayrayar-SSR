"use client";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Package, LogOut, Heart } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useWishlistStore from "../../../store/wishlistStore";
import { useRouter } from "next/navigation";

export default function ProfileSidebar({ user, orders }) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/");
    } catch (error) {
      // Logout will still clear local state even if API call fails
      router.push("/");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-6 lg:p-8 sticky top-8"
    >
      {/* User Avatar & Name */}
      <div className="text-center mb-6">
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          className="w-24 h-24 rounded-full bg-theme3 flex items-center justify-center mx-auto mb-4 shadow-xl"
        >
          <User className="w-12 h-12 text-white" />
        </motion.div>
        <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-black uppercase">
          {user.name}
        </h3>
        <p className="text-text text-sm mt-1">{user.email}</p>
      </div>

      {/* User Info */}
      <div className="space-y-4 mb-6 pt-6 border-t border-white/10">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-theme3 mt-0.5 shrink-0" />
          <div>
            <p className="text-text text-xs font-medium mb-1">Email</p>
            <p className="text-white font-['Roboto',sans-serif] text-sm">
              {user.email}
            </p>
          </div>
        </div>

        {user.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-theme3 mt-0.5 shrink-0" />
            <div>
              <p className="text-text text-xs font-medium mb-1">Phone</p>
              <p className="text-white font-['Roboto',sans-serif] text-sm">
                {user.phone}
              </p>
            </div>
          </div>
        )}

        {user.address?.street && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-theme3 mt-0.5 shrink-0" />
            <div>
              <p className="text-text text-xs font-medium mb-1">Address</p>
              <p className="text-white font-['Roboto',sans-serif] text-sm">
                {user.address.street}
                <br />
                {user.address.city}, {user.address.state} {user.address.zipCode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-4 mb-6 pt-6 border-t border-white/10">
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <Package className="w-6 h-6 text-theme3 mx-auto mb-2" />
          <p className="text-white font-['Epilogue',sans-serif] text-xl font-black">
            {orders.length}
          </p>
          <p className="text-text text-xs">Orders</p>
        </div>
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <Heart className="w-6 h-6 text-theme3 mx-auto mb-2" />
          <p className="text-white font-['Epilogue',sans-serif] text-xl font-black">
            {wishlistItems.length}
          </p>
          <p className="text-text text-xs">Wishlist</p>
        </div>
      </div>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full border-2 border-red-500/50 text-red-400 py-3 px-6 hover:bg-red-500/20 transition-all duration-300 text-base font-['Epilogue',sans-serif] font-medium rounded-xl flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        Logout
      </motion.button>
    </motion.div>
  );
}

