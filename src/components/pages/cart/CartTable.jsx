"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Trash2, Plus, Minus, ShoppingBag, Tag } from "lucide-react";

export default function CartTable() {
  const [cartItems, setCartItems] = useState([
    {
      id: 1,
      name: "Brick Oven Pepperoni",
      image: "/img/dishes/dishes4_1.png",
      price: 18,
      quantity: 1,
    },
    {
      id: 2,
      name: "Cheese Hand-Pizza",
      image: "/img/dishes/dishes4_2.png",
      price: 18,
      quantity: 1,
    },
    {
      id: 3,
      name: "Over Loaded Vegan",
      image: "/img/dishes/dishes4_3.png",
      price: 18,
      quantity: 1,
    },
    {
      id: 4,
      name: "Chicken Leg Piece",
      image: "/img/dishes/dishes4_4.png",
      price: 18,
      quantity: 1,
    },
  ]);

  const [couponCode, setCouponCode] = useState("");

  const handleQuantityChange = (id, delta) => {
    setCartItems((items) =>
      items.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, item.quantity + delta) }
          : item
      )
    );
  };

  const handleQuantityInput = (id, value) => {
    const numValue = Math.max(1, Number(value) || 1);
    setCartItems((items) =>
      items.map((item) => (item.id === id ? { ...item, quantity: numValue } : item))
    );
  };

  const handleRemove = (id) => {
    setCartItems((items) => items.filter((item) => item.id !== id));
  };

  const handleApplyCoupon = (e) => {
    e.preventDefault();
    console.log("Apply coupon:", couponCode);
  };

  const handleUpdateCart = (e) => {
    e.preventDefault();
    console.log("Update cart");
  };

  // Calculate totals
  const subtotal = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="cart-table-wrapper">
      {/* Desktop Table View */}
      <div className="hidden lg:block overflow-x-auto mb-8 ">
        <table className="cart_table w-full border-collapse">
          <thead>
            <tr className=" border-b-2 border-gray-200">
              <th className="cart-col-image font-epilogue text-white font-bold py-6 px-4 text-left">
                Product
              </th>
              <th className="cart-colname font-epilogue text-white font-bold py-6 px-4 text-left">
                Name
              </th>
              <th className="cart-col-price font-epilogue text-white font-bold py-6 px-4 text-center">
                Price
              </th>
              <th className="cart-col-quantity font-epilogue text-white font-bold py-6 px-4 text-center">
                Quantity
              </th>
              <th className="cart-col-total font-epilogue text-white font-bold py-6 px-4 text-center">
                Total
              </th>
              <th className="cart-col-remove font-epilogue text-white font-bold py-6 px-4 text-center">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {cartItems.map((item) => (
              <tr key={item.id} className="cart_item transition-colors duration-300">
                <td className="py-6 px-4">
                  <Link href="/shop-details" className="cartimage inline-block group">
                    <div className="relative w-20 h-20 rounded-xl overflow-hidden  transition-shadow duration-300">
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                        unoptimized={true}
                      />
                    </div>
                  </Link>
                </td>
                <td className="py-6 px-4">
                  <Link
                    href="/shop-details"
                    className="cartname text-white font-epilogue text-lg font-bold hover:text-theme transition-colors duration-300"
                  >
                    {item.name}
                  </Link>
                </td>
                <td className="py-6 px-4 text-center">
                  <span className="amount text-white font-bold text-base">
                    ${item.price.toFixed(2)}
                  </span>
                </td>
                <td className="py-6 px-4">
                  <div className="quantity flex items-center justify-center">
                    <button
                      type="button"
                      className="quantity-minus qty-btn w-10 h-10 border border-gray-200 bg-white text-gray-600 rounded-l-lg hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 flex items-center justify-center"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <input
                      type="number"
                      className="qty-input w-16 h-10 border-y border-gray-200 bg-white text-theme text-sm font-bold text-center outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all duration-300"
                      value={item.quantity}
                      min="1"
                      max="99"
                      onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="quantity-plus qty-btn w-10 h-10 border border-gray-200 bg-white text-gray-600 rounded-r-lg hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 flex items-center justify-center"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>
                </td>
                <td className="py-6 px-4 text-center">
                  <span className="amount text-white font-bold text-lg ">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </td>
                <td className="py-6 px-4 text-center">
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="remove w-10 h-10 flex items-center justify-center text-gray-400 hover:text-theme hover:bg-theme/10 rounded-lg transition-all duration-300"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mobile Card View */}
      <div className="lg:hidden space-y-4 mb-8">
        {cartItems.map((item) => (
          <div key={item.id} className="cart-item-card bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
            <div className="flex gap-4">
              <Link href="/shop-details" className="cartimage shrink-0 group">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden  transition-shadow duration-300">
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    className="object-cover group-hover:scale-110 transition-transform duration-300"
                    unoptimized={true}
                  />
                </div>
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href="/shop-details"
                  className="cartname text-title font-epilogue text-lg font-bold hover:text-theme transition-colors duration-300 block mb-2"
                >
                  {item.name}
                </Link>
                <div className="flex items-center justify-between mb-3">
                  <span className="amount text-title font-bold text-base">
                    ${item.price.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleRemove(item.id)}
                    className="remove w-8 h-8 flex items-center justify-center text-gray-400 hover:text-theme hover:bg-theme/10 rounded-lg transition-all duration-300"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <div className="quantity flex items-center">
                    <button
                      type="button"
                      className="quantity-minus qty-btn w-9 h-9 border border-gray-200 bg-white text-gray-600 rounded-l-lg hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 flex items-center justify-center"
                      onClick={() => handleQuantityChange(item.id, -1)}
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <input
                      type="number"
                      className="qty-input w-14 h-9 border-y border-gray-200 bg-white text-theme text-sm font-bold text-center outline-none focus:border-theme"
                      value={item.quantity}
                      min="1"
                      max="99"
                      onChange={(e) => handleQuantityInput(item.id, e.target.value)}
                    />
                    <button
                      type="button"
                      className="quantity-plus qty-btn w-9 h-9 border border-gray-200 bg-white text-gray-600 rounded-r-lg hover:bg-theme hover:text-white hover:border-theme transition-all duration-300 flex items-center justify-center"
                      onClick={() => handleQuantityChange(item.id, 1)}
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <span className="amount text-title font-bold text-lg ">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Actions Section */}
      <div className="actions-section space-y-6 pt-6 border-t border-gray-200">
        {/* Coupon Code */}
        <div className="th-cart-coupon">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                className="form-control text-white w-full pl-12 pr-5 py-3 border-2 border-gray-200 rounded-xl text-base outline-none focus:border-theme focus:ring-2 focus:ring-theme/20 transition-all duration-300"
                placeholder="Enter coupon code..."
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
              />
            </div>
            <button
              type="submit"
              onClick={handleApplyCoupon}
              className="theme-btn px-8 py-3 bg-theme text-white font-roboto text-base font-medium hover:bg-theme2 transition-all duration-300 rounded-xl whitespace-nowrap shadow-md hover:shadow-lg"
            >
              Apply Coupon
            </button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <button
            type="submit"
            onClick={handleUpdateCart}
            className="theme-btn px-8 py-3 bg-white border-2 border-theme text-theme font-roboto text-base font-medium hover:bg-theme hover:text-white transition-all duration-300 rounded-xl whitespace-nowrap"
          >
            Update Cart
          </button>
          <Link
            href="/shop"
            className="theme-btn px-8 py-3 bg-theme text-white font-roboto text-base font-medium hover:bg-theme2 transition-all duration-300 rounded-xl whitespace-nowrap shadow-md hover:shadow-lg flex items-center justify-center gap-2"
          >
            <ShoppingBag className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}

