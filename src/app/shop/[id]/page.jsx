"use client";
import { use, useEffect } from "react";
import { useRouter } from "next/navigation";
import useBranchStore from "../../../store/branchStore";
import Breadcrumb from "../../../components/ui/Breadcrumb";
import ShopDetailsContent from "../../../components/shop/ShopDetailsContent";
import PopularDishes from "../../../components/shop/PopularDishes";

export default function ShopDetailsPage({ params }) {
  const router = useRouter();
  const { initialize } = useBranchStore();
  const resolvedParams = use(params);
  const productId = resolvedParams?.id ? String(resolvedParams.id) : null;

  // Initialize branch store on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Validate productId
  if (!productId) {
    return (
      <div className="bg-bg3 min-h-screen">
        <Breadcrumb title="Shop details" />
        <section className="bg-bg3 py-12 sm:py-16 md:py-20 lg:py-24">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col items-center justify-center py-20">
              <p className="text-text text-lg mb-4">Invalid product ID</p>
              <button
                onClick={() => router.push("/shop")}
                className="px-6 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors"
              >
                Back to Shop
              </button>
            </div>
          </div>
        </section>
      </div>
    );
  }

  return (
    <div className="bg-bg3 min-h-screen">
      <ShopDetailsContent productId={productId} />
      <PopularDishes />
    </div>
  );
}

