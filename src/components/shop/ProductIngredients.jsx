"use client";
import { memo, useMemo } from "react";
import { Check, Plus } from "lucide-react";
import { formatCurrency } from "../../lib/utils/formatters";

/**
 * ProductIngredients Component
 * Displays available ingredients/add-ons as checkboxes
 * @param {Object} props
 * @param {Array} props.ingredients - Array of ingredient objects
 * @param {Array} props.selectedIngredientIds - Array of selected ingredient IDs
 * @param {Function} props.onIngredientToggle - Callback when ingredient is toggled
 */
const ProductIngredients = memo(({ ingredients = [], selectedIngredientIds = [], onIngredientToggle }) => {
  if (!ingredients || ingredients.length === 0) {
    return null;
  }

  // Group ingredients by category if available
  const groupedIngredients = useMemo(() => {
    const grouped = {};
    const uncategorized = [];

    ingredients.forEach((ingredient) => {
      const category = ingredient.category || ingredient.category_name || null;
      if (category) {
        if (!grouped[category]) {
          grouped[category] = [];
        }
        grouped[category].push(ingredient);
      } else {
        uncategorized.push(ingredient);
      }
    });

    return { grouped, uncategorized };
  }, [ingredients]);

  const renderIngredient = (ingredient) => {
    const isSelected = selectedIngredientIds.includes(ingredient.id);
    const ingredientPrice = parseFloat(ingredient.price || 0);
    const hasPrice = ingredientPrice !== 0;

    return (
      <div
        key={ingredient.id}
        className="mb-3"
      >
        <button
          type="button"
          onClick={() => onIngredientToggle(ingredient.id)}
          className={`
            w-full flex items-center justify-between p-4 rounded-xl border-2 transition-all duration-300
            ${
              isSelected
                ? "bg-theme3/20 border-theme3 text-white"
                : "bg-white/5 border-white/10 text-white hover:border-theme3/50 hover:bg-white/10"
            }
          `}
          aria-label={`${isSelected ? "Remove" : "Add"} ${ingredient.name}`}
          aria-pressed={isSelected}
        >
          <div className="flex items-center gap-3 flex-1">
            <div
              className={`
                w-5 h-5 rounded border-2 flex items-center justify-center transition-all duration-300
                ${
                  isSelected
                    ? "bg-theme3 border-theme3"
                    : "bg-transparent border-white/30"
                }
              `}
            >
              {isSelected && (
                <div>
                  <Check className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
            <div className="flex-1 text-left">
              <span className=" text-base font-semibold block">
                {ingredient.name}
              </span>
              {ingredient.is_required && (
                <span className="text-xs text-theme3 mt-1 block">Required</span>
              )}
            </div>
          </div>
          {hasPrice && (
            <div className="ml-4">
              <span className="text-theme3  text-sm font-bold">
                +{formatCurrency(ingredientPrice)}
              </span>
            </div>
          )}
        </button>
      </div>
    );
  };

  return (
    <div className="product-ingredients mb-6">
      <h4 className="text-white  text-lg font-semibold mb-4">
        Add-ons & Extras
      </h4>
      <div className="space-y-4">
        {/* Render grouped ingredients */}
        {Object.keys(groupedIngredients.grouped).length > 0 &&
          Object.entries(groupedIngredients.grouped).map(([category, categoryIngredients]) => (
            <div key={category} className="mb-4">
              <h5 className="text-theme3  text-sm font-semibold mb-3 uppercase tracking-wide">
                {category}
              </h5>
              <div className="space-y-2">
                {categoryIngredients.map(renderIngredient)}
              </div>
            </div>
          ))}

        {/* Render uncategorized ingredients */}
        {groupedIngredients.uncategorized.length > 0 && (
          <div>
            {Object.keys(groupedIngredients.grouped).length > 0 && (
              <h5 className="text-theme3  text-sm font-semibold mb-3 uppercase tracking-wide">
                Other
              </h5>
            )}
            <div className="space-y-2">
              {groupedIngredients.uncategorized.map(renderIngredient)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
});

ProductIngredients.displayName = "ProductIngredients";

export default ProductIngredients;

