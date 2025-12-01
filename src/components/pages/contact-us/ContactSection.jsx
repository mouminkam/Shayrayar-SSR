"use client";
import dynamic from "next/dynamic";
import AnimatedSection from "../../ui/AnimatedSection";
import ErrorBoundary from "../../ui/ErrorBoundary";
import SectionSkeleton from "../../ui/SectionSkeleton";

// Lazy load contact components
const ContactBoxes = dynamic(
  () => import("../../contact/ContactBoxes"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-64" />,
    ssr: true,
  }
);

const ContactForm = dynamic(
  () => import("../../contact/ContactForm"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: false,
  }
);

const Map = dynamic(
  () => import("../../contact/Map"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-96" />,
    ssr: false,
  }
);

export default function ContactSection() {
  return (
    <>
      <ErrorBoundary>
        <AnimatedSection>
          <ContactBoxes />
        </AnimatedSection>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedSection>
          <ContactForm />
        </AnimatedSection>
      </ErrorBoundary>
      <ErrorBoundary>
        <AnimatedSection>
          <Map />
        </AnimatedSection>
      </ErrorBoundary>
    </>
  );
}

