"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

// Lazy load AboutUsSection - Heavy component with multiple sub-components
const AboutUsSection = dynamic(
  () => import("../../components/pages/about-us/AboutUsSection"),
  {
    loading: () => <SectionSkeleton variant="default" cardCount={3} height="h-screen" />,
    ssr: false,
  }
);

export default function AboutUsPage() {
  const { lang } = useLanguage();
  
  return (
    <div className="bg-bg3 min-h-screen">
      <AnimatedSection>
        <Breadcrumb title={t(lang, "about_us")} />
      </AnimatedSection>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" cardCount={3} height="h-screen" />}>
          <AboutUsSection />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

