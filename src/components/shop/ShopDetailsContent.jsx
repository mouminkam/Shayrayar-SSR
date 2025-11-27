"use client";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import ProductImage from "./ProductImage";
import ProductAbout from "./ProductAbout";
import api from "../../api";
import { transformMenuItemToProduct } from "../../lib/utils/productTransform";
import useToastStore from "../../store/toastStore";
import useBranchStore from "../../store/branchStore";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

// Simplified extractor - API always returns { success: true, data: { item: {...} } }
const extractProductData = (response) => {
  return response?.data?.item || response?.data || null;
};

export default function ShopDetailsContent({ productId }) {
  const router = useRouter();
  const { error: toastError } = useToastStore();
  const { selectedBranch } = useBranchStore();
  const { lang } = useLanguage();
  const [product, setProduct] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProduct = useCallback(async () => {
    if (!productId) {
      setError("Product ID is required");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const response = await api.menu.getMenuItemById(productId);
      const productData = extractProductData(response);

      if (productData) {
        setProduct(transformMenuItemToProduct(productData));
      } else {
        const errorMsg = "Product not found";
        setError(errorMsg);
        toastError(errorMsg);
      }
    } catch (err) {
      const errorMessage = err?.message || err?.data?.message || "Failed to load product";
      setError(errorMessage);
      toastError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [productId, toastError]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct, selectedBranch?.id]);

  if (isLoading) {
    return (
      <section className="bg-bg3 py-12 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-8 h-8 text-theme3 animate-spin" />
            <p className="text-text text-base">{t(lang, "loading_product_details")}</p>
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
              <h3 className="text-white  text-2xl font-bold">
                {t(lang, "product_not_found")}
              </h3>
            </div>
            <p className="text-text text-lg text-center max-w-md">
              {error || t(lang, "product_not_found_description")}
            </p>
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/shop")}
                className="px-6 py-3 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors  font-semibold"
              >
                {t(lang, "back_to_shop")}
              </button>
              <button
                onClick={fetchProduct}
                className="px-6 py-3 bg-transparent border-2 border-theme3 text-theme3 rounded-lg hover:bg-theme3/10 transition-colors  font-semibold"
              >
                {t(lang, "try_again")}
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-bg3 py-12 relative">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 shadow-xl">
          <ProductImage product={product} />
          <ProductAbout product={product} />
        </div>
      </div>
    </section>
  );
}
