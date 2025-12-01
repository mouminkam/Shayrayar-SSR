"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Protected from "../../components/auth/Protected";

// Lazy load CheckoutSection - Heavy component with API calls
const CheckoutSection = dynamic(
  () => import("../../components/pages/checkout/CheckoutSection"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-screen" />,
    ssr: false,
  }
);

export default function CheckoutPage() {
  return (
    <Protected>
      <div className="bg-bg3 min-h-screen">
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
            <CheckoutSection />
          </Suspense>
        </ErrorBoundary>
      </div>
    </Protected>
  );
}

