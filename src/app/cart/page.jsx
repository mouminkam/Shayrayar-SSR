
import Breadcrumb from "../../components/ui/Breadcrumb";
import CartTable from "../../components/cart/CartTable";
import CartSummary from "../../components/cart/CartSummary";

export default function CartPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="Cart" />
      <section className="shop-details-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Cart Table - Takes 2 columns on desktop */}
            <div className="lg:col-span-2">
              <div className="shop-details bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 py-6 px-3 sm:px-6 relative overflow-hidden">
                <CartTable />
              </div>
            </div>

            {/* Cart Summary - Takes 1 column on desktop */}
            <div className="lg:col-span-1">
              <CartSummary />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

