"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Protected from "../../components/auth/Protected";
import PageSEO from "../../components/seo/PageSEO";

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
      <PageSEO
        title="Checkout - Complete Your Order"
        description="Complete your order at Shahrayar Restaurant. Secure checkout with multiple payment options."
        url="/checkout"
        keywords={["checkout", "order", "payment", "delivery", "pickup"]}
      />
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

