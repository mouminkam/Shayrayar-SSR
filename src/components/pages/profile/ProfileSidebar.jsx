"use client";
import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, MapPin, Package, LogOut, Edit, Camera } from "lucide-react";
import OptimizedImage from "../../ui/OptimizedImage";
import dynamic from "next/dynamic";
import useAuthStore from "../../../store/authStore";
import { useRouter } from "next/navigation";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";
import { getFullImageUrl } from "../../../lib/utils/imageUtils";

// Lazy load ProfileEditModal
const ProfileEditModal = dynamic(
  () => import("./ProfileEditModal"),
  {
    ssr: false,
  }
);

export default function ProfileSidebar({ user, totalOrders = 0 }) {
  const router = useRouter();
  const { logout } = useAuthStore();
  const { lang } = useLanguage();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  // Convert relative image path to full URL for Next.js Image component
  const userImageUrl = useMemo(() => {
    const imagePath = user?.image || user?.image_url || user?.avatar;
    return imagePath ? getFullImageUrl(imagePath) : null;
  }, [user?.image, user?.image_url, user?.avatar]);

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
        <div className="relative inline-block">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-24 h-24 rounded-full bg-theme3 flex items-center justify-center mx-auto mb-4 shadow-xl overflow-hidden relative"
          >
            {userImageUrl ? (
              <OptimizedImage
                src={userImageUrl}
                alt={user.name || "Profile"}
                width={96}
                height={96}
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <User className="w-12 h-12 text-white" />
            )}
          </motion.div>
          <motion.button
            onClick={() => setIsEditModalOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="absolute bottom-0 right-0 w-8 h-8 cursor-pointer bg-theme3 rounded-full flex items-center justify-center shadow-lg hover:bg-theme3/90 transition-colors border-2 border-bgimg"
            aria-label={t(lang, "edit_profile")}
          >
            <Camera className="w-4 h-4 text-white" />
          </motion.button>
        </div>
        <div className="flex items-center justify-center gap-2">
          <h3 className="text-white text-2xl font-black uppercase">
            {user.name}
          </h3>
          <motion.button
            onClick={() => setIsEditModalOpen(true)}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className=" w-8 h-8 bg-theme3 cursor-pointer rounded-full flex items-center justify-center shadow-lg hover:bg-theme3/90 transition-colors border-2 border-bgimg"
            aria-label={t(lang, "edit_profile")}
          >
            <Edit className="w-4 h-4 text-white " />
          </motion.button>
        </div>
        <p className="text-text text-sm mt-1">{user.email}</p>
      </div>

      {/* User Info */}
      <div className="space-y-4 mb-6 pt-6 border-t border-white/10">
        <div className="flex items-start gap-3">
          <Mail className="w-5 h-5 text-theme3 mt-0.5 shrink-0" />
          <div>
            <p className="text-text text-xs font-medium mb-1">{t(lang, "email_label").replace(":", "")}</p>
            <p className="text-white  text-sm">
              {user.email}
            </p>
          </div>
        </div>

        {user.phone && (
          <div className="flex items-start gap-3">
            <Phone className="w-5 h-5 text-theme3 mt-0.5 shrink-0" />
            <div>
              <p className="text-text text-xs font-medium mb-1">{t(lang, "phone_label").replace(":", "")}</p>
              <p className="text-white  text-sm">
                {user.phone}
              </p>
            </div>
          </div>
        )}

        {user.address?.street && (
          <div className="flex items-start gap-3">
            <MapPin className="w-5 h-5 text-theme3 mt-0.5 shrink-0" />
            <div>
              <p className="text-text text-xs font-medium mb-1">{t(lang, "address")}</p>
              <p className="text-white  text-sm">
                {user.address.street}
                <br />
                {user.address.city}, {user.address.state} {user.address.zipCode}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 gap-4 mb-6 pt-6 border-t border-white/10">
        <div className="text-center p-3 bg-white/5 rounded-xl">
          <Package className="w-6 h-6 text-theme3 mx-auto mb-2" />
          <p className="text-white  text-xl font-black">
            {totalOrders}
          </p>
          <p className="text-text text-xs">{t(lang, "orders")}</p>
        </div>
      </div>

      {/* Logout Button */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="w-full border-2 border-red-500/50 text-red-400 py-3 px-6 hover:bg-red-500/20 transition-all duration-300 text-base  font-medium rounded-xl flex items-center justify-center gap-2"
      >
        <LogOut className="w-5 h-5" />
        {t(lang, "logout")}
      </motion.button>

      {/* Profile Edit Modal */}
      <ProfileEditModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
      />
    </motion.div>
  );
}

