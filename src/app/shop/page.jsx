import { Suspense } from "react";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ShopSection from "../../components/shop/ShopSection";

export default function ShopPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Shop" />
      <Suspense fallback={
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme3"></div>
        </div>
      }>
        <ShopSection />
      </Suspense>
    </div>
  );
}

