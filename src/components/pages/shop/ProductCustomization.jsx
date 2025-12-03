"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import ProductSizes from "./ProductSizes";
import ProductIngredients from "./ProductIngredients";
import { formatCurrency } from "../../../lib/utils/formatters";
import { useProductCustomization } from "../../../hooks/useProductCustomization";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

/**
 * ProductCustomization Component
 * Container component that manages size and ingredient selection
 * @param {Object} props
 * @param {Object} product - Product object with sizes and ingredients
 * @param {Function} props.onCustomizationChange - Callback when customization changes
 */
const ProductCustomization = memo(function ProductCustomization({ product, onCustomizationChange }) {
  const { lang } = useLanguage();
  
  // Use custom hook for customization management
  const {
    selectedSizeId,
    selectedIngredientIds,
    finalPrice,
    handleSizeChange,
    handleIngredientToggle,
  } = useProductCustomization(product, onCustomizationChange);

  // Don't render if product has no sizes or ingredients
  if (!product?.has_sizes && !product?.has_ingredients) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="product-customization mb-8 pb-8 border-b border-white/10"
    >
      {/* Sizes Section */}
      {product?.has_sizes && (
        <ProductSizes
          sizes={product.sizes || []}
          selectedSizeId={selectedSizeId}
          onSizeChange={handleSizeChange}
        />
      )}

      {/* Ingredients Section */}
      {product?.has_ingredients && (
        <ProductIngredients
          ingredients={product.ingredients || []}
          selectedIngredientIds={selectedIngredientIds}
          onIngredientToggle={handleIngredientToggle}
        />
      )}

      {/* Price Summary */}
      {(product?.has_sizes || product?.has_ingredients) && (
        <div className="mt-6 p-4 bg-theme3/10 rounded-xl border border-theme3/30">
          <div className="flex items-center justify-between">
            <span className="text-white  text-base font-semibold">
              {t(lang, "total_price")}
            </span>
            <span className="text-theme3  text-2xl font-black">
              {formatCurrency(finalPrice)}
            </span>
          </div>
        </div>
      )}
    </motion.div>
  );
});

ProductCustomization.displayName = "ProductCustomization";

export default ProductCustomization;

