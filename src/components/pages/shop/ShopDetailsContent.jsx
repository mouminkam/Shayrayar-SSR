"use client";
import { useState, useEffect, useMemo } from "react";
import ProductImage from "./ProductImage";
import ProductAbout from "./ProductAbout";
import PageSEO from "../../seo/PageSEO";
import { useLanguage } from "../../../context/LanguageContext";
import { transformMenuItemToProduct } from "../../../lib/utils/productTransform";
import { formatCurrency } from "../../../lib/utils/formatters";

export default function ShopDetailsContent({ rawProductData, lang: serverLang = null }) {
  const { lang: clientLang } = useLanguage();
  const [lang, setLang] = useState(serverLang || clientLang || 'bg');
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && clientLang) {
      setLang(clientLang);
    }
  }, [clientLang, isHydrated]);

  // Transform product based on current language (from localStorage after hydration, or serverLang before)
  const product = useMemo(() => {
    if (!rawProductData || !rawProductData.item) return null;
    return transformMenuItemToProduct(
      rawProductData.item,
      rawProductData.optionGroups,
      lang,
      rawProductData.customizations
    );
  }, [rawProductData, lang]);

  if (!product) return null;

  const productDescription = product.description || product.longDescription || `Order ${product.title} from Shahrayar Restaurant. ${formatCurrency(product.price)}`;
  const productImage = product.image || "/img/logo/mainlogo.png";

  return (
    <>
      <PageSEO
        title={product.title + " - Shahrayar Restaurant"}
        description={productDescription}
        url={`/shop/${product.id}`}
        image={productImage}
        type="product"
        keywords={[product.title, "food", "restaurant", "order online", "delivery", "pickup"]}
      />
      <section className="bg-bg3 py-12 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-8 bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 rounded-3xl p-6 sm:p-8 lg:p-12 border border-white/10 shadow-xl max-w-6xl mx-auto">
            {/* Product Image - Top */}
            <ProductImage product={product} />
            {/* Product Content - Below Image */}
            <ProductAbout product={product} />
          </div>
        </div>
      </section>
    </>
  );
}
