"use client";
import CartTable from "./CartTable";
import CartTotals from "./CartTotals";
import { CheckCircle2 } from "lucide-react";

export default function CartSection() {
  return (
    <section className="shop-details-section section-padding fix bg-bg2 py-12 ">
      <div className="shop-details-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="shop-details bg-white rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
            {/* WooCommerce Message */}
            <div className="woocommerce-notices-wrapper mb-8">
              <div className="woocommerce-message relative px-5 py-4 pl-12 bg-theme/10 border-l-4 border-theme text-theme text-sm font-semibold rounded-lg flex items-center gap-3 shadow-sm">
                <CheckCircle2 className="w-5 h-5 text-theme shrink-0" />
                <span>Shipping costs updated.</span>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
              {/* Cart Table - Takes 2 columns on large screens */}
              <div className="lg:col-span-2">
                <form action="#" className="woocommerce-cart-form">
                  <CartTable />
                </form>
              </div>

              {/* Cart Totals - Takes 1 column on large screens */}
              <div className="lg:col-span-1">
                <div className="sticky top-8">
                  <CartTotals />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

