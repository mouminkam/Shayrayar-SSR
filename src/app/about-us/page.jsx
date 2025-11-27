"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

// Lazy load all about sections
const OfferCards = dynamic(
  () => import("../../components/about/OfferCards"),
  {
    loading: () => <SectionSkeleton variant="default" cardCount={3} height="h-80" />,
    ssr: false,
  }
);

const AboutSection = dynamic(
  () => import("../../components/about/AboutSection"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-64" />,
    ssr: true,
  }
);

const ChefeSection = dynamic(
  () => import("../../components/about/ChefeSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-96" />,
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
        <Suspense fallback={<SectionSkeleton variant="default" cardCount={3} height="h-80" />}>
          <AnimatedSection>
            <OfferCards />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" showCards={false} height="h-64" />}>
          <AnimatedSection>
            <AboutSection />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={3} height="h-96" />}>
          <AnimatedSection>
            <ChefeSection />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

