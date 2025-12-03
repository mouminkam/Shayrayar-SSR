"use client";
import { use, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AnimatedSection from "../../../components/ui/AnimatedSection";
import ErrorBoundary from "../../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../../components/ui/SectionSkeleton";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";

// Lazy load heavy components
const ShopDetailsContent = dynamic(
  () => import("../../../components/pages/shop/ShopDetailsContent"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: false,
  }
);

const PopularDishes = dynamic(
  () => import("../../../components/pages/shop/PopularDishes"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={5} height="h-96" />,
    ssr: false,
  }
);

export default function ShopDetailsPage({ params }) {
  const router = useRouter();
  const { lang } = useLanguage();
  const resolvedParams = use(params);
  const productId = resolvedParams?.id ? String(resolvedParams.id) : null;

  if (!productId) {
    return (
      <div className="bg-bg3 min-h-screen flex items-center justify-center py-20">
        <div className="text-center">
          <p className="text-text text-lg mb-4">{t(lang, "invalid_product_id")}</p>
          <button
            onClick={() => router.push("/shop")}
            className="px-6 py-2 bg-theme3 text-white rounded-lg hover:bg-theme transition-colors"
          >
            {t(lang, "back_to_shop")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-bg3 min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <AnimatedSection>
            <ShopDetailsContent productId={productId} />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={5} height="h-96" />}>
          <AnimatedSection>
            <PopularDishes />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

