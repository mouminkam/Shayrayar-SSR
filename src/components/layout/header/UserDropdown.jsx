"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { User, LogOut, Package, Heart } from "lucide-react";
import useAuthStore from "../../../store/authStore";
import useWishlistStore from "../../../store/wishlistStore";
import useToastStore from "../../../store/toastStore";

export default function UserDropdown({
  userOpen,
  setUserOpen,
}) {
  const router = useRouter();
  const userTimeoutRef = useRef(null);
  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const { success: toastSuccess } = useToastStore();

  const handleMouseEnter = () => {
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current);
      userTimeoutRef.current = null;
    }
    setUserOpen(true);
  };

  const handleMouseLeave = () => {
    if (userTimeoutRef.current) {
      clearTimeout(userTimeoutRef.current);
    }
    userTimeoutRef.current = setTimeout(() => {
      setUserOpen(false);
      userTimeoutRef.current = null;
    }, 300);
  };

  const handleLogout = async () => {
    try {
      await logout();
      setUserOpen(false);
      toastSuccess("Logged out successfully");
      router.push("/");
    } catch (error) {
      // Logout will still clear local state even if API call fails
      setUserOpen(false);
      router.push("/");
    }
  };

  // Animation variants
  const dropdownVariants = {
    hidden: {
      opacity: 0,
      y: -20,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 20,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: -20,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: {
      opacity: 1,
      x: 0,
      transition: {
        duration: 0.2,
        ease: "easeOut",
      },
    },
    exit: {
      opacity: 0,
      x: -10,
      transition: {
        duration: 0.15,
      },
    },
  };

  if (!isAuthenticated) {
    return (
      <AnimatePresence>
        {userOpen && (
          <motion.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full right-0 z-9999 w-64 bg-white shadow-2xl border border-gray-200 mt-4 p-4 rounded-lg"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <motion.div
              variants={itemVariants}
              className="text-center py-4 mb-4 border-b border-gray-200"
            >
              <p className="text-gray-600 text-sm mb-4">Welcome! Please sign in to continue.</p>
            </motion.div>

            <motion.div variants={itemVariants} className="space-y-2">
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUserOpen(false);
                    router.push("/login");
                  }}
                  className="w-full bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-3 px-4 transition-all duration-300 text-sm font-semibold block text-center rounded-lg shadow-lg"
                >
                  Sign In
                </button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setUserOpen(false);
                    router.push("/register");
                  }}
                  className="w-full border-2 border-theme text-theme py-2 px-4 hover:bg-theme hover:text-white transition-all duration-300 text-sm font-medium block text-center rounded-lg"
                >
                  Create Account
                </button>
              </motion.div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {userOpen && (
        <motion.div
          variants={dropdownVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="absolute top-full right-0 z-9999 w-72 bg-white shadow-2xl border border-gray-200 mt-4 p-4 rounded-lg"
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* User Info Header */}
          <motion.div
            variants={itemVariants}
            className="flex items-center gap-3 pb-4 mb-4 border-b border-gray-200"
          >
            <div className="w-12 h-12 rounded-full bg-theme3 flex items-center justify-center shrink-0">
              <User className="w-6 h-6 text-white" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-gray-900 font-semibold text-sm truncate">{user?.name}</p>
              <p className="text-gray-500 text-xs truncate">{user?.email}</p>
            </div>
          </motion.div>

          {/* Menu Items */}
          <motion.div variants={itemVariants} className="space-y-1 mb-4">
            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setUserOpen(false)}
              >
                <User className="w-5 h-5 text-theme3" />
                <span className="text-sm font-medium">My Profile</span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/profile"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setUserOpen(false)}
              >
                <Package className="w-5 h-5 text-theme3" />
                <span className="text-sm font-medium">
                  My Orders
                  {user?.orders?.length > 0 && (
                    <span className="ml-2 text-xs bg-theme3 text-white px-2 py-0.5 rounded-full">
                      {user.orders.length}
                    </span>
                  )}
                </span>
              </Link>
            </motion.div>

            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
              <Link
                href="/wishlist"
                className="flex items-center gap-3 px-3 py-2 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                onClick={() => setUserOpen(false)}
              >
                <Heart className="w-5 h-5 text-theme3" />
                <span className="text-sm font-medium">
                  Wishlist
                  {wishlistItems.length > 0 && (
                    <span className="ml-2 text-xs bg-theme3 text-white px-2 py-0.5 rounded-full">
                      {wishlistItems.length}
                    </span>
                  )}
                </span>
              </Link>
            </motion.div>
          </motion.div>

          {/* Logout Button */}
          <motion.div variants={itemVariants}>
            <motion.button
              onClick={handleLogout}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full flex items-center gap-3 px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 border border-red-200"
            >
              <LogOut className="w-5 h-5" />
              <span className="text-sm font-medium">Sign Out</span>
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

