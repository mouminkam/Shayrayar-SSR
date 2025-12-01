"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AnimatedSection from "../../ui/AnimatedSection";
import ErrorBoundary from "../../ui/ErrorBoundary";
import SectionSkeleton from "../../ui/SectionSkeleton";
import useCartStore from "../../../store/cartStore";
import useAuthStore from "../../../store/authStore";

// Lazy load checkout components
const CheckoutSummary = dynamic(
  () => import("./CheckoutSummary"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-64" />,
    ssr: false,
  }
);

const BillingForm = dynamic(
  () => import("./BillingForm"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: false,
  }
);

export default function CheckoutSection() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (!isAuthenticated || items.length === 0) {
    return null;
  }

  return (
    <section className="checkout-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
          {/* Billing Form - Takes 2 columns on desktop */}
          <div className="lg:col-span-2">
            <ErrorBoundary>
              <AnimatedSection>
                <BillingForm />
              </AnimatedSection>
            </ErrorBoundary>
          </div>

          {/* Checkout Summary - Takes 1 column on desktop */}
          <div className="lg:col-span-1">
            <ErrorBoundary>
              <AnimatedSection>
                <CheckoutSummary />
              </AnimatedSection>
            </ErrorBoundary>
          </div>
        </div>
      </div>
    </section>
  );
}

