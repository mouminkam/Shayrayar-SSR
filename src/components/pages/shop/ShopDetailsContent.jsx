"use client";
import { useRouter } from "next/navigation";
import { Loader2, AlertCircle } from "lucide-react";
import ProductImage from "./ProductImage";
import ProductAbout from "./ProductAbout";
import PageSEO from "../../seo/PageSEO";
import { useProductDetails } from "../../../hooks/useProductDetails";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";
import { formatCurrency } from "../../../lib/utils/formatters";

export default function ShopDetailsContent({ productId }) {
  const router = useRouter();
  const { lang } = useLanguage();
  
  // Use custom hook for product details
  const { product, isLoading, error, refetch } = useProductDetails(productId);

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
      <>
        <PageSEO
          title="Product Not Found"
          description="The product you are looking for could not be found."
          url={`/shop/${productId}`}
        />
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
                onClick={refetch}
                className="px-6 py-3 bg-transparent border-2 border-theme3 text-theme3 rounded-lg hover:bg-theme3/10 transition-colors  font-semibold"
              >
                {t(lang, "try_again")}
              </button>
            </div>
          </div>
        </div>
      </section>
      </>
    );
  }

  const productDescription = product.description || product.longDescription || `Order ${product.title} from Shahrayar Restaurant. ${formatCurrency(product.price)}`;
  const productImage = product.image || "/img/logo/mainlogo.png";

  return (
    <>
      <PageSEO
        title={product.title}
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
