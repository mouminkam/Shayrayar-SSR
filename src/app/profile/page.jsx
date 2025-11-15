"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../../components/ui/Breadcrumb";
import useAuthStore from "../../store/authStore";
import useWishlistStore from "../../store/wishlistStore";
import ProfileSidebar from "../../components/pages/profile/ProfileSidebar";
import OrdersHistory from "../../components/pages/profile/OrdersHistory";
import WishlistPreview from "../../components/pages/profile/WishlistPreview";

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, logout } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated || !user) {
    return null;
  }

  const orders = user.orders || [];

  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="My Profile" />
      <section className="profile-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Profile Info Sidebar */}
            <div className="lg:col-span-1">
              <ProfileSidebar user={user} orders={orders} />
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              <OrdersHistory orders={orders} />
              <WishlistPreview wishlistItems={wishlistItems} />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

