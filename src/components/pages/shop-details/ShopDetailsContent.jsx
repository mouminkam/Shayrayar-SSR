"use client";
import ProductImage from "./ProductImage";
import ProductAbout from "./ProductAbout";
import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";
import ReviewForm from "./ReviewForm";

export default function ShopDetailsContent() {
  return (
    <section className="bg-bg3 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="shop-details-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 ">
          <div className="shop-details  rounded-2xl p-6 sm:p-8 lg:p-12">
            <div className="container mx-auto">
              {/* Product Image and About */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16 mb-12 items-stretch">
                <ProductImage />
                <ProductAbout />
              </div>

              {/* Product Description */}
              <ProductDescription />

              {/* Product Reviews */}
              <ProductReviews />

              {/* Review Form */}
              <ReviewForm />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

