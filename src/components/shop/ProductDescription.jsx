"use client";
"use client";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

export default function ProductDescription({ product }) {
  const { lang } = useLanguage();
  const description = product?.longDescription || product?.description || t(lang, "no_description_available");
  
  return (
    <div className="product-description py-12 sm:py-14 border-b border-gray-200 mb-12">
      <h3 className="text-white  text-3xl font-black mb-6 capitalize">
        {t(lang, "product_description")}
      </h3>
      <div className="desc">
        <p className="text-text  text-base font-normal leading-relaxed whitespace-pre-line">
          {description}
        </p>
      </div>
    </div>
  );
}

