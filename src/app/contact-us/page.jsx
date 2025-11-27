"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

// Lazy load contact components
const ContactBoxes = dynamic(
  () => import("../../components/contact/ContactBoxes"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-64" />,
    ssr: true,
  }
);

const ContactForm = dynamic(
  () => import("../../components/contact/ContactForm"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: false,
  }
);

const Map = dynamic(
  () => import("../../components/contact/Map"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-96" />,
    ssr: false,
  }
);

export default function ContactPage() {
  const { lang } = useLanguage();
  
  return (
    <div className="bg-bg3 min-h-screen">
      <AnimatedSection>
        <Breadcrumb title={t(lang, "contact_us")} />
      </AnimatedSection>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={3} height="h-64" />}>
          <AnimatedSection>
            <ContactBoxes />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <AnimatedSection>
            <ContactForm />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" showCards={false} height="h-96" />}>
          <AnimatedSection>
            <Map />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

