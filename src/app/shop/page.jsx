"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";

// Lazy load ShopSection - Heavy component with API calls
const ShopSection = dynamic(
  () => import("../../components/shop/ShopSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={12} height="h-screen" />,
    ssr: false,
  }
);

export default function ShopPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <AnimatedSection>
        <Breadcrumb title="Shop" />
      </AnimatedSection>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={12} height="h-screen" />}>
          <ShopSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

