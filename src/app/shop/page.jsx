import { Suspense } from "react";
import Breadcrumb from "../../components/ui/Breadcrumb";
import ShopSection from "../../components/shop/ShopSection";
import ShopSectionFallback from "../../components/shop/ShopSectionFallback";

export default function ShopPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Shop" />
      <Suspense fallback={<ShopSectionFallback />}>
        <ShopSection />
      </Suspense>
    </div>
  );
}

