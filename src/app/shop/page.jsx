"use client";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ShopSection from "../../components/shop/ShopSection";

export default function ShopPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Shop" />
      <ShopSection />
    </div>
  );
}

