"use client";
import { memo } from "react";
import { motion } from "framer-motion";
import ProductSizes from "./ProductSizes";
import ProductIngredients from "./ProductIngredients";
import OptionGroup from "./OptionGroup";
import CustomizationGroup from "./CustomizationGroup";
import { formatCurrency } from "../../../lib/utils/formatters";
import { useProductCustomization } from "../../../hooks/useProductCustomization";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

/**
 * ProductCustomization Component
 * Container component that manages size, ingredient, and option group selection
 * @param {Object} props
 * @param {Object} product - Product object with sizes, ingredients, and option_groups
 * @param {Function} props.onCustomizationChange - Callback when customization changes
 */
const ProductCustomization = memo(function ProductCustomization({ product, onCustomizationChange }) {
  const { lang } = useLanguage();
  
  // Use custom hook for customization management
  const {
    selectedSizeId,
    selectedIngredientIds,
    selectedOptions,
    selectedCustomizations,
    finalPrice,
    isValid,
    missingRequiredGroups,
    handleSizeChange,
    handleIngredientToggle,
    handleOptionGroupChange,
    handleCustomizationChange,
  } = useProductCustomization(product, onCustomizationChange);

  // Check if product has any customization options
  const hasOptionGroups = product?.has_option_groups && Array.isArray(product.option_groups) && product.option_groups.length > 0;
  const hasLegacySizes = product?.has_sizes; // Show sizes even if option_groups exist
  const hasLegacyIngredients = product?.has_ingredients; // Show ingredients even if option_groups exist
  const hasCustomizations = product?.has_customizations;
  const customizations = product?.customizations;
  const hasAnyCustomization = hasOptionGroups || hasLegacySizes || hasLegacyIngredients || hasCustomizations;

  // Don't render if product has no customization options
  if (!hasAnyCustomization) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="product-customization mb-8 pb-8 border-b border-white/10"
    >
      {/* New Option Groups System */}
      {hasOptionGroups && (
        <div className="option-groups mb-6">
          {product.option_groups
            .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
            .map((group) => {
              const isMissing = missingRequiredGroups?.some(mg => mg.id === group.id);
              return (
                <div
                  key={group.id}
                  id={`option-group-${group.id}`}
                  className={isMissing ? 'scroll-mt-4' : ''}
                >
                  <OptionGroup
                    group={group}
                    selectedItemIds={selectedOptions[group.id] || []}
                    onSelectionChange={(itemIds) => handleOptionGroupChange(group.id, itemIds)}
                  />
                </div>
              );
            })}
        </div>
      )}

      {/* Legacy Sizes Section (for backward compatibility) */}
      {hasLegacySizes && (
        <ProductSizes
          sizes={product.sizes || []}
          selectedSizeId={selectedSizeId}
          onSizeChange={handleSizeChange}
        />
      )}

      {/* Legacy Ingredients Section (for backward compatibility) */}
      {hasLegacyIngredients && (
        <ProductIngredients
          ingredients={product.ingredients || []}
          selectedIngredientIds={selectedIngredientIds}
          onIngredientToggle={handleIngredientToggle}
        />
      )}

      {/* Customizations Section (allergens, drinks, toppings, sauces) */}
      {hasCustomizations && customizations && (
        <div className="customizations mb-6">
          {customizations.allergens && (
            <CustomizationGroup
              group={customizations.allergens}
              groupName="allergens"
              selectedItemIds={selectedCustomizations?.allergens || []}
              onSelectionChange={(itemIds) => handleCustomizationChange('allergens', itemIds)}
            />
          )}
          {customizations.drinks && (
            <CustomizationGroup
              group={customizations.drinks}
              groupName="drinks"
              selectedItemIds={selectedCustomizations?.drinks || []}
              onSelectionChange={(itemIds) => handleCustomizationChange('drinks', itemIds)}
            />
          )}
          {customizations.toppings && (
            <CustomizationGroup
              group={customizations.toppings}
              groupName="toppings"
              selectedItemIds={selectedCustomizations?.toppings || []}
              onSelectionChange={(itemIds) => handleCustomizationChange('toppings', itemIds)}
            />
          )}
          {customizations.sauces && (
            <CustomizationGroup
              group={customizations.sauces}
              groupName="sauces"
              selectedItemIds={selectedCustomizations?.sauces || []}
              onSelectionChange={(itemIds) => handleCustomizationChange('sauces', itemIds)}
            />
          )}
        </div>
      )}

      {/* Validation Message */}
      {!isValid && missingRequiredGroups && missingRequiredGroups.length > 0 && (
        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
          <p className="text-red-300 text-sm font-medium mb-2">
            {t(lang, "please_select_required_options")}
          </p>
          <ul className="list-disc list-inside space-y-1">
            {missingRequiredGroups.map((group) => {
              const minValue = group.minSelection || 1;
              const message = t(lang, "required_choose_minimum").replace("{min}", minValue);
              return (
                <li key={group.id} className="text-red-200 text-xs">
                  {group.name}: {message}
                </li>
              );
            })}
          </ul>
        </div>
      )}

      {/* Price Summary */}
      {hasAnyCustomization && (
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

