"use client";
import Breadcrumb from "../../components/pages/shop/Breadcrumb";
import ShopSection from "../../components/pages/shop/ShopSection";

export default function ShopPage() {
  return (
    <div className="bg-bg2 min-h-screen">
      <Breadcrumb title="Shop" />
      <ShopSection />
    </div>
  );
}

