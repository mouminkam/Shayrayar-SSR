"use client";
import Breadcrumb from "../../components/pages/cart/Breadcrumb";
import CartSection from "../../components/pages/cart/CartSection";

export default function CartPage() {
  return (
    <div className="bg-bg2 min-h-screen">
      <Breadcrumb title="Cart List" />
      <CartSection />
    </div>
  );
}

