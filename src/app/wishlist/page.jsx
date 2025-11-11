"use client";
import Breadcrumb from "../../components/pages/wishlist/Breadcrumb";
import WishlistSection from "../../components/pages/wishlist/WishlistSection";

export default function WishlistPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Wishlist" />
      <WishlistSection />

    </div>
  );
}

