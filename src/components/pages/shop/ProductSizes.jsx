"use client";
import { memo } from "react";
import { Check } from "lucide-react";
import { formatCurrency } from "../../../lib/utils/formatters";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

/**
 * ProductSizes Component
 * Displays available sizes for a product as radio buttons
 * @param {Object} props
 * @param {Array} props.sizes - Array of size objects
 * @param {number|null} props.selectedSizeId - Currently selected size ID
 * @param {Function} props.onSizeChange - Callback when size is selected
 */
const ProductSizes = memo(({ sizes = [], selectedSizeId = null, onSizeChange }) => {
  const { lang } = useLanguage();
  
  if (!sizes || sizes.length === 0) {
    return null;
  }

  return (
    <div className="product-sizes mb-6">
      <h4 className="text-white  text-lg font-semibold mb-4">
        {t(lang, "select_size")}
      </h4>
      <div className="flex flex-wrap gap-3">
        {sizes.map((size) => {
          const isSelected = selectedSizeId === size.id;
          const sizePrice = parseFloat(size.price || 0);
          const hasPriceDifference = sizePrice !== 0;

          return (
            <button
              key={size.id}
              type="button"
              onClick={() => onSizeChange(size.id)}
              className={`
                relative px-4 py-3 rounded-xl border-2 transition-all duration-300
 text-sm font-semibold
                ${
                  isSelected
                    ? "bg-theme3 border-theme3 text-white shadow-lg shadow-theme3/30"
                    : "bg-white/10 border-white/20 text-white hover:border-theme3/50 hover:bg-white/15"
                }
              `}
              aria-label={`Select size ${size.name}`}
              aria-pressed={isSelected}
            >
              <div className="flex items-center gap-2">
                <span>{size.name}</span>
                {hasPriceDifference && (
                  <span className={`text-xs ${isSelected ? "text-white/90" : "text-theme3"}`}>
                    ({sizePrice > 0 ? "+" : ""}{formatCurrency(sizePrice)})
                  </span>
                )}
              </div>
              {isSelected && (
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-theme rounded-full flex items-center justify-center border-2 border-white">
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
});

ProductSizes.displayName = "ProductSizes";

export default ProductSizes;

