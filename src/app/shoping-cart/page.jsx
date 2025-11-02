"use client";

import { useState } from "react";
import { X, Minus, Plus } from "lucide-react";
import Image from "next/image";
import Button from "../../components/Button";

export default function ShoppingCartPage() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "White Classic Stiletto",
      price: 90,
      quantity: 2,
      image: "/images/img20.jpg",
    },
    {
      id: 2,
      name: "Brown Sport Sneakers",
      price: 35,
      quantity: 1,
      image: "/images/img20.jpg",
    },
    {
      id: 3,
      name: "White Sport Shoes",
      price: 35,
      quantity: 1,
      image: "/images/img20.jpg",
    },
    {
      id: 5,
      name: "White Classic Stiletto",
      price: 90,
      quantity: 2,
      image: "/images/img20.jpg",
    },
    {
      id: 6,
      name: "Brown Sport Sneakers",
      price: 35,
      quantity: 1,
      image: "/images/img20.jpg",
    },
    {
      id: 7,
      name: "White Sport Shoes",
      price: 35,
      quantity: 1,
      image: "/images/img20.jpg",
    },
  ]);

  const [couponCode, setCouponCode] = useState("");
  const [visibleCount, setVisibleCount] = useState(3);
  const [showAll, setShowAll] = useState(false);

  const subtotal = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const tax = 7.0;
  const total = subtotal + tax;

  const updateQuantity = (id, newQuantity) => {
    if (newQuantity < 1) return;

    setCartItems(
      cartItems.map((item) =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handleCheckout = () => {
    console.log("Proceeding to checkout");
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    if (!couponCode.trim()) {
      alert("Please enter a promo code");
      return;
    }
    // TODO: Integrate coupon validation API
    alert(`Coupon applied: ${couponCode}`);
  };

  // Note: continue shopping action can be added here if needed

  const toggleShowMore = () => {
    if (showAll) {
      setVisibleCount(3);
      setShowAll(false);
    } else {
      setVisibleCount(cartItems.length);
      setShowAll(true);
    }
  };

  return (
    <div className="min-h-screen bg-white mt-20">
      {/* Shopping Cart Content */}
      <section className="py-12 md:py-16">
        <div className="max-w-6xl mx-auto px-4">
          {/* Cart Items */}
          <div className="space-y-8">
            {cartItems.slice(0, visibleCount).map((item) => (
              <div
                key={item.id}
                className="border-b border-gray-200 pb-8 last:border-b-0"
              >
                <div className="flex justify-around md:flex-row md:items-center gap-5 mt-5">
                  {/* Product Image */}
                  <div className="md:w-2/12 flex justify-center items-center">
                    <div className="w-60 h-60 md:w-32 md:h-32 ">
                      <Image
                        src={item.image}
                        alt={item.name}
                        width={128}
                        height={128}
                        className="w-full h-full object-cover rounded"
                      />
                    </div>
                  </div>

                  {/* For mobile: stack sections vertically. For md+: keep horizontal grid */}
                  <div className="flex flex-col w-auto md:flex-row md:items-center md:justify-between md:w-full md:gap-0">
                    {/* Product Details */}
                    <div className="w-full md:w-4/12 mb-8 md:mb-0">
                      <h3 className="text-lg font-medium mb-2 md:mb-2 text-gray-800 ">
                        {item.name}
                      </h3>
                      <p className="text-gray-600 text-sm">
                        Product code: {item.id}
                      </p>
                    </div>

                    {/* Price */}
                    <div className="w-full md:w-2/12 mb-4 md:mb-0 flex md:block justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800">
                        <span className="md:hidden mr-5">Unit Price : </span> $
                        {item.price.toFixed(2)}
                      </span>
                    </div>

                    {/* Quantity Controls */}
                    <div className="w-full md:w-2/12 mb-8 md:mb-0 flex md:block justify-between items-center ">
                      <span className="md:hidden mr-4 font-semibold">
                        QTY :
                      </span>
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded">
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity - 1)
                            }
                            className="p-2 transition-colors rounded-sm text-gray-600 hover:bg-gray-800 hover:text-white"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="px-4 py-2 text-gray-800 font-medium min-w-12 text-center">
                            {item.quantity.toString().padStart(2, "0")}
                          </span>
                          <button
                            onClick={() =>
                              updateQuantity(item.id, item.quantity + 1)
                            }
                            className="p-2 rounded-sm transition-colors text-gray-600 hover:bg-gray-800 hover:text-white"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Total and Remove */}
                    <div className="w-full md:w-2/12 flex justify-between items-center">
                      <span className="text-lg font-semibold text-gray-800 md:mr-4">
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                      <button
                        onClick={() => removeItem(item.id)}
                        className="p-2 mr-3 hover:text-red-500 transition-colors"
                      >
                        <X className="w-5 h-5 font-semibold" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {cartItems.length > 3 && (
            <div className="text-center mt-8">
              <Button
                onClick={toggleShowMore}
                variant="secondary"
                size="md"
              >
                {showAll ? "Show Less" : "Show More"}
              </Button>
            </div>
          )}

          {/* Coupon and Summary Section */}
          <div className="mt-12 flex flex-col lg:flex-row gap-8">
            {/* Coupon Section */}

            <div className="flex flex-col items-center justify-between rounded-lg p-6 lg:w-1/2">
              <h3 className="text-3xl font-semibold text-gray-800 mb-10 uppercase text-center">
                Coupon Code
              </h3>
              <input
                type="text"
                placeholder="CUPON CODE"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                className="w-full border-2 border-gray-300 rounded px-4 py-3 focus:outline-none focus:border-gray-800 mb-4 transition"
              />
              <Button
                onClick={handleApplyCoupon}
                variant="primary"
                size="md"
                className="w-full mt-2"
              >
                Apply Coupon
              </Button>
            </div>

            {/* Order Summary */}
            <div className=" rounded-lg p-6 lg:w-1/2">
              <h3 className="text-lg font-semibold text-gray-800 mb-10 uppercase text-center">
                Order Summary
              </h3>

              <div className="space-y-4">
                <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
                  <span className="text-gray-600 uppercase">Subtotal</span>
                  <span className="text-gray-800 font-semibold">
                    ${subtotal.toFixed(2)}
                  </span>
                </div>

                <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
                  <span className="text-gray-600 uppercase">Tax</span>
                  <span className="text-gray-800 font-semibold">
                    ${tax.toFixed(2)}
                  </span>
                </div>

                <div className="mb-10 pt-4">
                  <div className="flex justify-between items-center border-b-2 border-gray-300 pb-4">
                    <span className="text-gray-600 uppercase">Total</span>
                    <span className="text-lg font-semibold text-gray-800">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <Button
                onClick={handleCheckout}
                variant="primary"
                size="md"
                className="w-full mt-6"
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
