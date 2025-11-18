"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import ProductImage from "./ProductImage";
import ProductAbout from "./ProductAbout";
import ProductDescription from "./ProductDescription";
import ProductReviews from "./ProductReviews";
import ReviewForm from "./ReviewForm";
import api from "../../api";
import { transformMenuItemToProduct } from "../../lib/utils/productTransform";
import useToastStore from "../../store/toastStore";
import useBranchStore from "../../store/branchStore";

export default function ShopDetailsContent({ productId }) {
  const router = useRouter();
  const { error: toastError } = useToastStore();
  const { selectedBranch } = useBranchStore();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Debug: Log current state
  useEffect(() => {
    console.log("🔄 Component State:", {
      isLoading,
      hasError: !!error,
      hasProduct: !!product,
      productId,
      productKeys: product ? Object.keys(product) : null,
      productTitle: product?.title,
      productPrice: product?.price,
      productImage: product?.image,
    });
  }, [isLoading, error, product, productId]);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) {
        setError("Product ID is required");
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      setProduct(null); // Reset product before fetching

      try {
        console.log("🔍 Fetching product with ID:", productId);
        console.log("📍 Selected branch:", selectedBranch?.id);

        const response = await api.menu.getMenuItemById(productId);

        console.log("📦 API Response:", response);
        console.log("📦 API Response Type:", typeof response);
        console.log("📦 API Response Keys:", response ? Object.keys(response) : "null");

        // Handle response structure - API returns {success: true, data: {item: {...}}}
        let productData = null;
        if (response && response.success && response.data) {
          // Check if data has 'item' property (nested structure)
          if (response.data.item) {
            productData = response.data.item;
            console.log("✅ Found product in response.data.item");
          } else {
            productData = response.data;
            console.log("✅ Found product in response.data");
          }
        } else if (response && response.data) {
          if (response.data.item) {
            productData = response.data.item;
          } else {
            productData = response.data;
          }
        } else if (response && typeof response === 'object' && !Array.isArray(response)) {
          // Check if response itself is the product data
          if (response.id || response.name || response.menu_item_id) {
            productData = response;
          }
        }

        console.log("📋 Product Data:", productData);
        console.log("📋 Product Data Type:", typeof productData);
        console.log("📋 Product Data Keys:", productData ? Object.keys(productData) : "null");
        console.log("📋 Product Data Sample:", productData ? {
          id: productData.id,
          name: productData.name,
          title: productData.title,
          price: productData.price,
          image: productData.image,
          image_url: productData.image_url,
        } : "null");

        if (productData) {
          const transformed = transformMenuItemToProduct(productData);
          console.log("✨ Transformed Product:", transformed);
          console.log("✨ Transformed Product Keys:", transformed ? Object.keys(transformed) : "null");
          console.log("✨ Setting product state...");
          setProduct(transformed);
          console.log("✅ Product state set successfully");
        } else {
          const errorMsg = response?.message || response?.error || "Product not found";
          console.error("❌ Error - No product data:", errorMsg);
          setError(errorMsg);
          toastError(errorMsg);
        }
      } catch (err) {
        console.error("💥 Fetch Error:", err);
        console.error("💥 Error Details:", {
          message: err.message,
          status: err.status,
          data: err.data,
        });
        const errorMessage = err.message || err.data?.message || "An error occurred while loading product";
        setError(errorMessage);
        toastError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productId, selectedBranch?.id]);

  if (isLoading) {
    return (
      <section className="bg-bg3 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-theme3 animate-spin" />
            <p className="text-text text-base">Loading product details...</p>
          </div>
        </div>
      </section>
    );
  }

  // Additional debug check before render
  console.log("🎯 Render Check - isLoading:", isLoading, "error:", error, "product:", product);
  console.log("🎯 Render Check - product exists:", !!product);
  console.log("🎯 Render Check - product title:", product?.title);
  console.log("🎯 Render Check - product price:", product?.price);
  console.log("🎯 Render Check - product image:", product?.image);

  if (error || !product) {
    console.log("⚠️ Showing error/empty state - error:", error, "product:", product);
    
    const handleRetry = async () => {
      if (!productId) return;
      
      setIsLoading(true);
      setError(null);

      try {
        console.log("🔄 Retrying fetch product with ID:", productId);
        const response = await api.menu.getMenuItemById(productId);
        console.log("📦 Retry API Response:", response);

        let productData = null;
        if (response && response.success && response.data) {
          // Check if data has 'item' property (nested structure)
          if (response.data.item) {
            productData = response.data.item;
          } else {
            productData = response.data;
          }
        } else if (response && response.data) {
          if (response.data.item) {
            productData = response.data.item;
          } else {
            productData = response.data;
          }
        } else if (response && typeof response === 'object' && !Array.isArray(response)) {
          if (response.id || response.name || response.menu_item_id) {
            productData = response;
          }
        }

        if (productData) {
          const transformed = transformMenuItemToProduct(productData);
          console.log("✨ Retry Transformed Product:", transformed);
          setProduct(transformed);
        } else {
          const errorMsg = response?.message || response?.error || "Product not found";
          setError(errorMsg);
          toastError(errorMsg);
        }
      } catch (err) {
        console.error("💥 Retry Fetch Error:", err);
        const errorMessage = err.message || err.data?.message || "An error occurred while loading product";
        setError(errorMessage);
        toastError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    return (
      <section className="bg-bg3 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 gap-6">
            <div className="flex items-center gap-3 text-theme3">
              <AlertCircle className="w-8 h-8" />
              <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-bold">
                Product Not Found
              </h3>
            </div>
            <p className="text-text text-lg text-center max-w-md">
              {error || "The product you're looking for doesn't exist or has been removed."}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/shop")}
                className="px-6 py-3 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors font-['Epilogue',sans-serif] font-semibold"
              >
                Back to Shop
              </button>
              <button
                onClick={handleRetry}
                className="px-6 py-3 bg-transparent border-2 border-theme3 text-theme3 rounded-lg hover:bg-theme3/10 transition-colors font-['Epilogue',sans-serif] font-semibold"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  console.log("✅ Rendering product details - product:", product);
  console.log("✅ Product title:", product?.title);
  console.log("✅ Product price:", product?.price);
  console.log("✅ Product image:", product?.image);

  return (
    <section className="bg-bg3 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-30 pointer-events-none"></div>
      
      <div className="shop-details-wrapper style1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shop-details rounded-3xl ">
            <div className="container mx-auto">
              {/* Product Image and About */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="grid grid-cols-1 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-12 items-stretch shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden"
              >
                {/* Subtle gradient overlay */}
                <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <ProductImage product={product} />
                </div>
                <div className="relative z-10">
                  <ProductAbout product={product} />
                </div>
              </motion.div>

              {/* Product Description */}
              <ProductDescription product={product} />

              {/* Product Reviews */}
              <ProductReviews productId={productId} />

              {/* Review Form */}
              <ReviewForm productId={productId} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

