"use client";
import WishlistTable from "./WishlistTable";
import SocialButtons from "./SocialButtons";
import { Heart } from "lucide-react";

export default function WishlistSection() {
  return (
    <section className="shop-details-section section-padding fix bg-bgimg py-12">
      <div className="shop-details-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="shop-details bg-bgimg rounded-2xl shadow-lg p-6 sm:p-8 lg:p-12">
            <div className="tinv-wishlist woocommerce tinv-wishlist-clear">
              {/* Header */}
              <div className="tinv-header mb-8 pb-6">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 shadow-2xl rounded-xl border-2 border-theme flex items-center justify-center">
                    <Heart className="w-6 h-6 text-theme" />
                  </div>
                  <h2 className="text-white font-epilogue text-3xl lg:text-4xl font-bold">
                    My Wishlist
                  </h2>
                </div>
              </div>

              {/* Wishlist Table */}
              <form action="#" method="post" autoComplete="off">
                <WishlistTable />
              </form>

              {/* Social Buttons */}
              <div className="mt-8 pt-8 border-t border-gray-200">
                <SocialButtons />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

