"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { X, ShoppingCart, Check, XCircle, Trash2, Package } from "lucide-react";

export default function WishlistTable() {
  const [wishlistItems, setWishlistItems] = useState([
    {
      id: 58,
      name: "Egg and Cucumber",
      image: "/img/dishes/dishes5_1.png",
      price: 45.0,
      originalPrice: null,
      dateAdded: "November 21, 2023",
      stockStatus: "in-stock",
    },
    {
      id: 60,
      name: "Brick Oven Pepperoni",
      image: "/img/dishes/dishes5_2.png",
      price: 18.0,
      originalPrice: 20.0,
      dateAdded: "November 21, 2021",
      stockStatus: "in-stock",
    },
    {
      id: 61,
      name: "Double Patty Veg",
      image: "/img/dishes/dishes5_3.png",
      price: 18.0,
      originalPrice: 20.0,
      dateAdded: "November 21, 2021",
      stockStatus: "out-of-stock",
    },
  ]);

  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(wishlistItems.map((item) => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (id, checked) => {
    if (checked) {
      setSelectedItems((prev) => [...prev, id]);
    } else {
      setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
    }
  };

  const handleRemove = (id) => {
    if (confirm("Are you sure you want to remove this item from your wishlist?")) {
      setWishlistItems(wishlistItems.filter((item) => item.id !== id));
      setSelectedItems(selectedItems.filter((itemId) => itemId !== id));
    }
  };

  const handleBulkRemove = () => {
    if (selectedItems.length === 0) return;
    if (confirm(`Are you sure you want to remove ${selectedItems.length} item(s) from your wishlist?`)) {
      setWishlistItems(wishlistItems.filter((item) => !selectedItems.includes(item.id)));
      setSelectedItems([]);
    }
  };

  const handleAddToCart = (id) => {
    console.log("Add to cart:", id);
    // Add to cart logic here
  };

  const handleBulkAddToCart = () => {
    selectedItems.forEach((id) => {
      const item = wishlistItems.find((item) => item.id === id);
      if (item && item.stockStatus === "in-stock") {
        handleAddToCart(id);
      }
    });
  };

  // Update selectAll when individual items change
  useEffect(() => {
    if (selectedItems.length === wishlistItems.length && wishlistItems.length > 0) {
      setSelectAll(true);
    } else {
      setSelectAll(false);
    }
  }, [selectedItems, wishlistItems.length]);

  // Desktop Table View
  const DesktopTable = () => (
    <div className="hidden lg:block overflow-x-auto mb-8">
      <table className="tinvwl-table-manage-list w-full border-collapse">
        <thead>
          <tr className="bg-bg2 border-b-2 border-gray-200">
            <th className="product-cb w-12 text-center py-4 px-4">
              <input
                type="checkbox"
                className="global-cb cursor-pointer w-5 h-5 text-theme focus:ring-theme focus:ring-2 rounded"
                title="Select all for bulk action"
                checked={selectAll}
                onChange={(e) => handleSelectAll(e.target.checked)}
              />
            </th>
            <th className="product-thumbnail w-32 text-center py-4 px-4 font-epilogue text-title font-bold">
              Image
            </th>
            <th className="product-name text-left py-4 px-4 font-epilogue text-title font-bold">
              Product Name
            </th>
            <th className="product-price text-center py-4 px-4 font-epilogue text-title font-bold">
              Price
            </th>
            <th className="product-date text-center py-4 px-4 font-epilogue text-title font-bold">
              Date Added
            </th>
            <th className="product-stock text-center py-4 px-4 font-epilogue text-title font-bold">
              Stock
            </th>
            <th className="product-action text-center py-4 px-4 font-epilogue text-title font-bold">
              Action
            </th>
            <th className="product-remove w-12 text-center py-4 px-4"></th>
          </tr>
        </thead>
        <tbody>
          {wishlistItems.map((item) => (
            <tr key={item.id} className="wishlist_item border-b border-gray-100 hover:bg-bg2/50 transition-colors duration-300">
              <td className="product-cb text-center py-6 px-4 align-middle">
                <input
                  type="checkbox"
                  name="wishlist_pr[]"
                  value={item.id}
                  title="Select for bulk action"
                  checked={selectedItems.includes(item.id)}
                  onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                  className="cursor-pointer w-5 h-5 text-theme focus:ring-theme focus:ring-2 rounded"
                />
              </td>
              <td className="product-thumbnail text-center py-6 px-4 align-middle">
                <Link href="/shop-details" className="inline-block group">
                  <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
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
              <td className="product-name py-6 px-4 align-middle">
                <Link
                  href="/shop-details"
                  className="text-title font-epilogue text-lg font-bold hover:text-theme transition-colors duration-300"
                >
                  {item.name}
                </Link>
              </td>
              <td className="product-price text-center py-6 px-4 align-middle">
                {item.originalPrice ? (
                  <div className="flex items-center justify-center gap-2">
                    <ins className="no-underline text-theme2 font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </ins>
                    <del className="text-text opacity-60 text-sm line-through">
                      ${item.originalPrice.toFixed(2)}
                    </del>
                  </div>
                ) : (
                  <span className="text-theme2 font-bold text-lg">${item.price.toFixed(2)}</span>
                )}
              </td>
              <td className="product-date text-center py-6 px-4 align-middle">
                <time className="entry-date text-text text-sm">{item.dateAdded}</time>
              </td>
              <td className="product-stock text-center py-6 px-4 align-middle">
                {item.stockStatus === "in-stock" ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm font-semibold">
                    <Check className="w-4 h-4" />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-theme rounded-full text-sm font-semibold">
                    <XCircle className="w-4 h-4" />
                    Out of Stock
                  </span>
                )}
              </td>
              <td className="product-action text-center py-6 px-4 align-middle">
                <button
                  type="button"
                  onClick={() => handleAddToCart(item.id)}
                  disabled={item.stockStatus === "out-of-stock"}
                  className={`button as-btn px-6 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 mx-auto ${
                    item.stockStatus === "in-stock"
                      ? "bg-theme hover:bg-theme2 shadow-md hover:shadow-lg"
                      : "bg-gray-300 cursor-not-allowed"
                  }`}
                  title="Add to Cart"
                >
                  <ShoppingCart className="w-4 h-4" />
                  Add to Cart
                </button>
              </td>
              <td className="product-remove text-center py-6 px-4 align-middle">
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="w-10 h-10 flex items-center justify-center text-gray-400 hover:text-theme hover:bg-theme/10 rounded-lg transition-all duration-300"
                  title="Remove"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Mobile Card View
  const MobileCardView = () => (
    <div className="lg:hidden space-y-4 mb-8">
      {wishlistItems.map((item) => (
        <div key={item.id} className="wishlist-item-card bg-white rounded-xl shadow-md p-4 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
          <div className="flex gap-4">
            {/* Checkbox */}
            <div className="flex items-start pt-1">
              <input
                type="checkbox"
                name="wishlist_pr[]"
                value={item.id}
                checked={selectedItems.includes(item.id)}
                onChange={(e) => handleSelectItem(item.id, e.target.checked)}
                className="cursor-pointer w-5 h-5 text-theme focus:ring-theme focus:ring-2 rounded"
              />
            </div>

            {/* Image */}
            <Link href="/shop-details" className="cartimage flex-shrink-0 group">
              <div className="relative w-24 h-24 rounded-xl overflow-hidden shadow-md group-hover:shadow-lg transition-shadow duration-300">
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                  unoptimized={true}
                />
              </div>
            </Link>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-start justify-between gap-2 mb-2">
                <Link
                  href="/shop-details"
                  className="text-title font-epilogue text-lg font-bold hover:text-theme transition-colors duration-300 flex-1"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  onClick={() => handleRemove(item.id)}
                  className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-theme hover:bg-theme/10 rounded-lg transition-all duration-300 flex-shrink-0"
                  title="Remove"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Price */}
              <div className="mb-3">
                {item.originalPrice ? (
                  <div className="flex items-center gap-2">
                    <ins className="no-underline text-theme2 font-bold text-lg">
                      ${item.price.toFixed(2)}
                    </ins>
                    <del className="text-text opacity-60 text-sm line-through">
                      ${item.originalPrice.toFixed(2)}
                    </del>
                  </div>
                ) : (
                  <span className="text-theme2 font-bold text-lg">${item.price.toFixed(2)}</span>
                )}
              </div>

              {/* Stock Status */}
              <div className="mb-3">
                {item.stockStatus === "in-stock" ? (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-green-50 text-green-600 rounded-full text-xs font-semibold">
                    <Check className="w-3 h-3" />
                    In Stock
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 text-theme rounded-full text-xs font-semibold">
                    <XCircle className="w-3 h-3" />
                    Out of Stock
                  </span>
                )}
              </div>

              {/* Date */}
              <div className="mb-3">
                <time className="entry-date text-text text-xs">{item.dateAdded}</time>
              </div>

              {/* Add to Cart Button */}
              <button
                type="button"
                onClick={() => handleAddToCart(item.id)}
                disabled={item.stockStatus === "out-of-stock"}
                className={`w-full px-4 py-2 text-sm font-semibold text-white rounded-lg transition-all duration-300 flex items-center justify-center gap-2 ${
                  item.stockStatus === "in-stock"
                    ? "bg-theme hover:bg-theme2 shadow-md hover:shadow-lg"
                    : "bg-gray-300 cursor-not-allowed"
                }`}
              >
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div className="wishlist-table-wrapper">
      {/* Bulk Actions */}
      {selectedItems.length > 0 && (
        <div className="bulk-actions mb-6 p-4 bg-theme/10 rounded-xl border border-theme/20 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Package className="w-5 h-5 text-theme" />
            <span className="text-title font-epilogue text-sm font-semibold">
              {selectedItems.length} item(s) selected
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleBulkAddToCart}
              className="px-4 py-2 bg-theme text-white text-sm font-semibold rounded-lg hover:bg-theme2 transition-all duration-300 flex items-center gap-2 shadow-md hover:shadow-lg"
            >
              <ShoppingCart className="w-4 h-4" />
              Add Selected to Cart
            </button>
            <button
              type="button"
              onClick={handleBulkRemove}
              className="px-4 py-2 bg-white border-2 border-theme text-theme text-sm font-semibold rounded-lg hover:bg-theme hover:text-white transition-all duration-300 flex items-center gap-2"
            >
              <Trash2 className="w-4 h-4" />
              Remove Selected
            </button>
          </div>
        </div>
      )}

      {/* Desktop Table */}
      <DesktopTable />

      {/* Mobile Card View */}
      <MobileCardView />

      {/* Empty State */}
      {wishlistItems.length === 0 && (
        <div className="empty-wishlist text-center py-16">
          <div className="w-24 h-24 bg-bg2 rounded-full flex items-center justify-center mx-auto mb-6">
            <Package className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-title font-epilogue text-2xl font-bold mb-2">Your wishlist is empty</h3>
          <p className="text-text text-base mb-6">Start adding items to your wishlist!</p>
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3 bg-theme text-white font-roboto text-base font-semibold rounded-xl hover:bg-theme2 transition-all duration-300 shadow-md hover:shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Continue Shopping
          </Link>
        </div>
      )}
    </div>
  );
}

