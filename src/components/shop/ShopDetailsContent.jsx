"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import ProductImage from "./ProductImage";
import ProductAbout from "./ProductAbout";
import api from "../../api";
import { transformMenuItemToProduct } from "../../lib/utils/productTransform";
import useToastStore from "../../store/toastStore";
import useBranchStore from "../../store/branchStore";

// Helper function to extract product data from API response
const extractProductData = (response) => {
  if (!response) return null;

  if (response.success && response.data) {
    return response.data.item || response.data;
  }
  
  if (response.data) {
    return response.data.item || response.data;
  }
  
  if (typeof response === 'object' && !Array.isArray(response)) {
    if (response.id || response.name || response.menu_item_id) {
      return response;
    }
  }
  
  return null;
};

export default function ShopDetailsContent({ productId }) {
  const router = useRouter();
  const { error: toastError } = useToastStore();
  const { selectedBranch } = useBranchStore();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = async () => {
    if (!productId) {
      setError("Product ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    setProduct(null);

    try {
      const response = await api.menu.getMenuItemById(productId);
      const productData = extractProductData(response);

      if (productData) {
        const transformed = transformMenuItemToProduct(productData);
        setProduct(transformed);
      } else {
        const errorMsg = response?.message || response?.error || "Product not found";
        setError(errorMsg);
        toastError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err.message || err.data?.message || "An error occurred while loading product";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
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

  if (error || !product) {
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
                onClick={fetchProduct}
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

  return (
    <section className="bg-bg3 py-12 relative overflow-hidden">
      <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-30 pointer-events-none"></div>
      
      <div className="shop-details-wrapper style1 relative z-10">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="shop-details rounded-3xl">
            <div className="container mx-auto">
              <div className="grid grid-cols-1 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl p-6 sm:p-8 lg:p-12 xl:p-16 lg:grid-cols-2 gap-8 lg:gap-12 xl:gap-16 mb-12 items-stretch shadow-2xl shadow-theme3/10 border border-white/10 relative overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-theme3/5 via-transparent to-theme/5 opacity-20 pointer-events-none"></div>
                
                <div className="relative z-10">
                  <ProductImage product={product} />
                </div>
                <div className="relative z-10">
                  <ProductAbout product={product} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
