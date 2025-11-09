"use client";
import { useState } from "react";
import Link from "next/link";
import { Calculator, MapPin, ArrowRight, Truck } from "lucide-react";

export default function CartTotals() {
  const [shippingMethod, setShippingMethod] = useState("flat_rate");
  const [showShippingForm, setShowShippingForm] = useState(false);
  const [shippingData, setShippingData] = useState({
    country: "BD",
    state: "",
    city: "",
    postcode: "",
  });

  const cartSubtotal = 72;
  const shippingCost = shippingMethod === "free_shipping" ? 0 : 5;
  const orderTotal = cartSubtotal + shippingCost;

  const handleShippingSubmit = (e) => {
    e.preventDefault();
    console.log("Update shipping:", shippingData);
    setShowShippingForm(false);
  };

  return (
    <div className="cart-totals-wrapper bg-white rounded-2xl shadow-lg p-6 lg:p-8 border border-gray-100">
      <h2 className="summary-title text-title font-epilogue text-2xl font-bold mb-6 pb-4 border-b-2 border-gray-200">
        Cart Totals
      </h2>

      <div className="space-y-6">
        {/* Subtotal */}
        <div className="flex justify-between items-center py-4 border-b border-gray-100">
          <span className="text-title font-epilogue text-base font-semibold">
            Subtotal
          </span>
          <span className="amount text-title font-bold text-lg">
            ${cartSubtotal.toFixed(2)}
          </span>
        </div>

        {/* Shipping */}
        <div className="shipping-section py-4 border-b border-gray-100">
          <div className="flex justify-between items-start mb-4">
            <span className="text-title font-epilogue text-base font-semibold flex items-center gap-2">
              <Truck className="w-5 h-5 text-theme" />
              Shipping
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <label className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-theme/50 transition-all duration-300 group">
              <input
                type="radio"
                id="free_shipping"
                name="shipping_method"
                className="shipping_method w-4 h-4 text-theme focus:ring-theme focus:ring-2"
                checked={shippingMethod === "free_shipping"}
                onChange={() => setShippingMethod("free_shipping")}
              />
              <div className="flex-1">
                <span className="text-title font-epilogue text-sm font-semibold block">
                  Free Shipping
                </span>
                <span className="text-text text-xs">$0.00</span>
              </div>
              {shippingMethod === "free_shipping" && (
                <div className="w-2 h-2 bg-theme rounded-full"></div>
              )}
            </label>

            <label className="cursor-pointer flex items-center gap-3 p-3 rounded-lg border-2 border-gray-200 hover:border-theme/50 transition-all duration-300 group">
              <input
                type="radio"
                id="flat_rate"
                name="shipping_method"
                className="shipping_method w-4 h-4 text-theme focus:ring-theme focus:ring-2"
                checked={shippingMethod === "flat_rate"}
                onChange={() => setShippingMethod("flat_rate")}
              />
              <div className="flex-1">
                <span className="text-title font-epilogue text-sm font-semibold block">
                  Flat Rate
                </span>
                <span className="text-text text-xs">$5.00</span>
              </div>
              {shippingMethod === "flat_rate" && (
                <div className="w-2 h-2 bg-theme rounded-full"></div>
              )}
            </label>
          </div>

          <p className="woocommerce-shipping-destination text-text text-xs mb-4 bg-bg2 p-3 rounded-lg">
            Shipping options will be updated during checkout.
          </p>

          <form onSubmit={handleShippingSubmit}>
            <button
              type="button"
              onClick={() => setShowShippingForm(!showShippingForm)}
              className="shipping-calculator-button w-full flex items-center justify-center gap-2 text-theme font-epilogue text-sm font-semibold py-2 px-4 border-2 border-theme/20 rounded-lg hover:bg-theme/10 hover:border-theme transition-all duration-300"
            >
              <MapPin className="w-4 h-4" />
              {showShippingForm ? "Hide Address" : "Change Address"}
            </button>

            {showShippingForm && (
              <div className="shipping-calculator-form mt-4 space-y-4 p-4 bg-bg2 rounded-xl">
                <div className="form-row">
                  <label className="block text-title font-epilogue text-sm font-semibold mb-2">
                    Country
                  </label>
                  <select
                    className="form-select w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all duration-300 bg-white"
                    value={shippingData.country}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, country: e.target.value })
                    }
                  >
                    <option value="AR">Argentina</option>
                    <option value="AM">Armenia</option>
                    <option value="BD">Bangladesh</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="block text-title font-epilogue text-sm font-semibold mb-2">
                    State
                  </label>
                  <select
                    className="form-select w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all duration-300 bg-white"
                    value={shippingData.state}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, state: e.target.value })
                    }
                  >
                    <option value="">Select an option…</option>
                    <option value="BD-05">Bagerhat</option>
                    <option value="BD-01">Bandarban</option>
                    <option value="BD-02">Barguna</option>
                    <option value="BD-06">Barishal</option>
                  </select>
                </div>

                <div className="form-row">
                  <label className="block text-title font-epilogue text-sm font-semibold mb-2">
                    City
                  </label>
                  <input
                    type="text"
                    className="form-control w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all duration-300 bg-white"
                    placeholder="Town / City"
                    value={shippingData.city}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, city: e.target.value })
                    }
                  />
                </div>

                <div className="form-row">
                  <label className="block text-title font-epilogue text-sm font-semibold mb-2">
                    Postcode
                  </label>
                  <input
                    type="text"
                    className="form-control w-full px-4 py-3 border border-gray-200 rounded-lg text-sm outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all duration-300 bg-white"
                    placeholder="Postcode / ZIP"
                    value={shippingData.postcode}
                    onChange={(e) =>
                      setShippingData({ ...shippingData, postcode: e.target.value })
                    }
                  />
                </div>

                <button
                  type="submit"
                  className="theme-btn w-full px-6 py-3 bg-theme text-white font-roboto text-sm font-medium hover:bg-theme2 transition-all duration-300 rounded-lg shadow-md hover:shadow-lg flex items-center justify-center gap-2"
                >
                  <Calculator className="w-4 h-4" />
                  Update
                </button>
              </div>
            )}
          </form>
        </div>

        {/* Order Total */}
        <div className="order-total flex justify-between items-center py-4 bg-theme/5 rounded-xl px-4">
          <span className="text-title font-epilogue text-lg font-bold">
            Order Total
          </span>
          <strong>
            <span className="amount text-theme font-epilogue text-2xl font-bold">
              ${orderTotal.toFixed(2)}
            </span>
          </strong>
        </div>

        {/* Proceed to Checkout */}
        <div className="wc-proceed-to-checkout pt-4">
          <Link
            href="/checkout"
            className="theme-btn w-full px-6 py-4 bg-theme text-white font-roboto text-base font-semibold hover:bg-theme2 transition-all duration-300 rounded-xl shadow-lg hover:shadow-xl flex items-center justify-center gap-2 group"
          >
            Proceed to Checkout
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
          </Link>
        </div>
      </div>
    </div>
  );
}

