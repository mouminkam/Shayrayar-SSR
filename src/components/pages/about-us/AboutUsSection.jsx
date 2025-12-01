"use client";
import dynamic from "next/dynamic";
import AnimatedSection from "../../ui/AnimatedSection";
import ErrorBoundary from "../../ui/ErrorBoundary";
import SectionSkeleton from "../../ui/SectionSkeleton";

// Lazy load all about sections
const OfferCards = dynamic(
  () => import("../../about/OfferCards"),
  {
    loading: () => <SectionSkeleton variant="default" cardCount={3} height="h-80" />,
    ssr: false,
  }
);

const AboutSection = dynamic(
  () => import("../../about/AboutSection"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-64" />,
    ssr: true,
  }
);

const ChefeSection = dynamic(
  () => import("../../about/ChefeSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-96" />,
    ssr: false,
  }
);

export default function AboutUsSection() {
  return (
    <>
      <ErrorBoundary>
        <AnimatedSection>
          <OfferCards />
        </AnimatedSection>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedSection>
          <AboutSection />
        </AnimatedSection>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedSection>
          <ChefeSection />
        </AnimatedSection>
      </ErrorBoundary>
    </>
  );
}

