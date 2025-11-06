"use client";
import Link from "next/link";
import { X } from "lucide-react";
import { useRef, useEffect } from "react";

export default function CartDropdown({
  cartOpen,
  setCartOpen,
  cartItems = [],
}) {
  const cartTimeoutRef = useRef(null);

  // Cleanup timeout عند unmount
  useEffect(() => {
    return () => {
      if (cartTimeoutRef.current) {
        clearTimeout(cartTimeoutRef.current);
      }
    };
  }, []);

  if (!cartOpen) return null;

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const handleMouseEnter = () => {
    // إلغاء أي timeout موجود
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
      cartTimeoutRef.current = null;
    }
    // إبقاء السلة مفتوحة
    setCartOpen(true);
  };

  const handleMouseLeave = () => {
    // إلغاء أي timeout موجود
    if (cartTimeoutRef.current) {
      clearTimeout(cartTimeoutRef.current);
    }
    // إضافة delay قبل الإغلاق (300ms)
    cartTimeoutRef.current = setTimeout(() => {
      setCartOpen(false);
      cartTimeoutRef.current = null;
    }, 300);
  };

  return (
    <div
      className="absolute top-full right-0 z-[9999] w-72 md:w-80 bg-white shadow-2xl border border-gray-200 mt-4 p-4 md:p-6 animate-in fade-in slide-in-from-top-2 duration-200"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-base md:text-lg font-medium text-gray-900">
          Shopping Cart
        </h3>
        <button
          onClick={() => setCartOpen(false)}
          className="text-gray-400 hover:text-red-600 transition-colors"
          aria-label="Close cart"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      <div className="space-y-3 md:space-y-4 mb-4 max-h-64 overflow-y-auto">
        {cartItems.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>Your cart is empty</p>
          </div>
        ) : (
          cartItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between py-2 border-b border-gray-100"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center shrink-0">
                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover rounded"
                      onError={(e) => {
                        e.target.src =
                          "https://via.placeholder.com/64x64?text=Food";
                      }}
                    />
                  ) : (
                    <span className="text-xs text-gray-600">🍔</span>
                  )}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {item.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {item.quantity} x{" "}
                    <span className="text-red-600 font-semibold">
                      ${item.price.toFixed(2)}
                    </span>
                  </p>
                </div>
              </div>
              <button
                className="text-gray-400 hover:text-red-600 transition-colors shrink-0 ml-2"
                aria-label={`Remove ${item.name} from cart`}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <>
          <div className="flex justify-between items-center mb-4 pt-2 border-t border-gray-200">
            <span className="text-gray-600 font-medium">Total:</span>
            <span className="text-lg font-semibold text-red-600">
              ${totalPrice.toFixed(2)}
            </span>
          </div>

          <div className="space-y-2">
            <Link
              href="/checkout"
              className="w-full bg-red-600 hover:bg-red-700 text-white py-3 px-4 transition-colors duration-300 text-sm font-medium block text-center"
              onClick={() => setCartOpen(false)}
            >
              Checkout
            </Link>
            <Link
              href="/cart"
              className="w-full border border-gray-300 text-gray-700 py-3 px-4 hover:bg-gray-50 transition-colors duration-300 text-sm font-medium block text-center"
              onClick={() => setCartOpen(false)}
            >
              View Cart
            </Link>
          </div>
        </>
      )}
    </div>
  );
}

