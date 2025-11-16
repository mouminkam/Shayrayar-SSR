
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Breadcrumb from "../../components/ui/Breadcrumb";
import CheckoutSummary from "../../components/pages/checkout/CheckoutSummary";
import BillingForm from "../../components/pages/checkout/BillingForm";
import useCartStore from "../../store/cartStore";

export default function CheckoutPage() {
  const router = useRouter();
  const items = useCartStore((state) => state.items);

  useEffect(() => {
    // Redirect to cart if cart is empty
    if (items.length === 0) {
      router.push("/cart");
    }
  }, [items, router]);

  if (items.length === 0) {
    return null;
  }

  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Checkout" />
      <section className="checkout-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Billing Form - Takes 2 columns on desktop */}
            <div className="lg:col-span-2">
              <BillingForm />
            </div>

            {/* Checkout Summary - Takes 1 column on desktop */}
            <div className="lg:col-span-1">
              <CheckoutSummary />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

