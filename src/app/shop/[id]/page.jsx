"use client";
import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AnimatedSection from "../../../components/ui/AnimatedSection";
import ErrorBoundary from "../../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../../components/ui/SectionSkeleton";

// Lazy load heavy components
const ShopDetailsContent = dynamic(
  () => import("../../../components/shop/ShopDetailsContent"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: false,
  }
);

const PopularDishes = dynamic(
  () => import("../../../components/shop/PopularDishes"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={5} height="h-96" />,
    ssr: false,
  }
);

export default function ShopDetailsPage({ params }) {
  const router = useRouter();
  const resolvedParams = use(params);
  const productId = resolvedParams?.id ? String(resolvedParams.id) : null;

  if (!productId) {
    return (
      <div className="bg-bg3 min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-text text-lg mb-4">Invalid product ID</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg3 min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <AnimatedSection>
            <ShopDetailsContent productId={productId} />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={5} height="h-96" />}>
          <AnimatedSection>
            <PopularDishes />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

