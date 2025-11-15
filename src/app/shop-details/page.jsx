"use client";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ShopDetailsContent from "../../sections/shop/ShopDetailsContent";
import PopularDishes from "../../sections/shop/PopularDishes";

export default function ShopDetailsPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Shop details" />
      <ShopDetailsContent />
      <PopularDishes />
    </div>
  );
}

