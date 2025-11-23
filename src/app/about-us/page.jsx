"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";

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

const MarqueeSection = dynamic(
  () => import("../../components/about/MarqueeSection"),
  {
    loading: () => <div className="h-24 bg-bgimg animate-pulse rounded"></div>,
    ssr: true,
  }
);

const CTASection = dynamic(
  () => import("../../components/about/CTASection"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-48" />,
    ssr: false,
  }
);

const ChefeSection = dynamic(
  () => import("../../components/about/ChefeSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-96" />,
    ssr: false,
  }
);

const TestimonialSection = dynamic(
  () => import("../../components/about/TestimonialSection"),
  {
    loading: () => <SectionSkeleton variant="testimonial" height="h-96" />,
    ssr: false,
  }
);

export default function AboutUsPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <AnimatedSection>
        <Breadcrumb title="About Us" />
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
        <Suspense fallback={<div className="h-24 bg-bgimg animate-pulse rounded"></div>}>
          <AnimatedSection>
            <MarqueeSection />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" showCards={false} height="h-48" />}>
          <AnimatedSection>
            <CTASection />
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
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="testimonial" height="h-96" />}>
          <AnimatedSection>
            <TestimonialSection />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

