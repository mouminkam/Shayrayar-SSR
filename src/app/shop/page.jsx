"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import PageSEO from "../../components/seo/PageSEO";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

// Lazy load ShopSection - Heavy component with API calls
const ShopSection = dynamic(
  () => import("../../components/pages/shop/ShopSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={12} height="h-screen" />,
    ssr: false,
  }
);

export default function ShopPage() {
  const { lang } = useLanguage();
  
  return (
    <div className="bg-bg3 min-h-screen">
      <PageSEO
        title="Shop - Browse Our Menu"
        description="Browse our delicious menu of authentic Middle Eastern dishes. Order your favorite meals online for delivery or pickup."
        url="/shop"
        keywords={["menu", "food", "order online", "delivery", "pickup", "Middle Eastern cuisine"]}
      />
      <AnimatedSection>
        <Breadcrumb title={t(lang, "shop")} />
      </AnimatedSection>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={12} height="h-screen" />}>
          <ShopSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

