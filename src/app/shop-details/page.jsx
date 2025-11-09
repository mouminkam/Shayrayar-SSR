"use client";
import Breadcrumb from "../../components/pages/shop/Breadcrumb";
import ShopDetailsContent from "../../components/pages/shop-details/ShopDetailsContent";
import PopularDishes from "../../components/pages/shop-details/PopularDishes";

export default function ShopDetailsPage() {
  return (
    <div className="bg-bg2 min-h-screen">
      <Breadcrumb title="Shop details" />
      <ShopDetailsContent />
      <PopularDishes />
    </div>
  );
}

