"use client";
import { useEffect, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import useBranchStore from "../store/branchStore";
import { HighlightsProvider } from "../context/HighlightsContext";
import AnimatedSection from "../components/ui/AnimatedSection";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import SectionSkeleton from "../components/ui/SectionSkeleton";

// Above the fold - Load immediately (no lazy loading)
import BannerSection from "../components/home/BannerSection";

// Priority 1: High Priority - Lazy load with SSR disabled (client-only)
const PopularDishes = dynamic(
  () => import("../components/shop/PopularDishes"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={5} height="h-96" />,
    ssr: false,
  }
);

const FoodMenuSection = dynamic(
  () => import("../components/home/FoodMenuSection"),
  {
    loading: () => <SectionSkeleton variant="default" cardCount={10} height="h-96" />,
    ssr: false,
  }
);

// Priority 3: Medium Priority - Lazy load
const LatestItemsSection = dynamic(
  () => import("../components/home/LatestItemsSection"),
  {
    loading: () => <SectionSkeleton variant="slider" cardCount={4} height="h-80" />,
    ssr: false,
  }
);

const ChefSpecialSection = dynamic(
  () => import("../components/home/ChefSpecialSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-96" />,
    ssr: false,
  }
);

const ChefeSection = dynamic(
  () => import("../components/about/ChefeSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-96" />,
    ssr: false,
  }
);

const OfferCards = dynamic(
  () => import("../components/about/OfferCards"),
  {
    loading: () => <SectionSkeleton variant="default" cardCount={3} height="h-80" />,
    ssr: false,
  }
);

// Lightweight sections - Can be lazy loaded but low impact
const AboutUsSection = dynamic(
  () => import("../components/home/AboutUsSection"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-64" />,
    ssr: true, // Can be SSR as it's lightweight
  }
);

export default function HomePage() {
  const router = useRouter();
  const { selectedBranch, initialize } = useBranchStore();

  // Initialize branch store on mount
  useEffect(() => {
    initialize();
  }, [initialize]);

  // Reload page data when branch changes
  useEffect(() => {
    if (selectedBranch) {
      router.refresh();
    }
  }, [selectedBranch, router]);

  return (
    <HighlightsProvider>
      <div className="bg-bg3 min-h-screen">
        {/* Banner Section - Above the fold, load immediately */}
        <AnimatedSection>
          <BannerSection />
        </AnimatedSection>

        {/* Latest Items Section - Priority 3 */}
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="slider" cardCount={4} height="h-80" />}>
            <AnimatedSection>
              <LatestItemsSection />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>

        {/* Offer Cards Section - Priority 3 */}
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" cardCount={3} height="h-80" />}>
            <AnimatedSection>
              <OfferCards />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>

        {/* About Us Section - Lightweight */}
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" showCards={false} height="h-64" />}>
            <AnimatedSection>
              <AboutUsSection />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>

        {/* Popular Dishes Section - Priority 1 (High) */}
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="grid" cardCount={5} height="h-96" />}>
            <AnimatedSection>
              <PopularDishes />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>



        {/* Food Menu Section - Priority 1 (High) */}
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="default" cardCount={10} height="h-96" />}>
            <AnimatedSection>
              <FoodMenuSection />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>

        {/* Chef Special Section - Priority 1 (High) */}
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="grid" cardCount={3} height="h-96" />}>
            <AnimatedSection>
              <ChefSpecialSection />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>

        {/* Chef Section - Priority 3 */}
        <ErrorBoundary>
          <Suspense fallback={<SectionSkeleton variant="grid" cardCount={3} height="h-96" />}>
            <AnimatedSection>
              <ChefeSection />
            </AnimatedSection>
          </Suspense>
        </ErrorBoundary>

        {/* Testimonial Section - Priority 2 (High) */}
        {/* <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="testimonial" height="h-96" />}>
          <AnimatedSection>
            <TestimonialSection />
          </AnimatedSection>
        </Suspense>
      </ErrorBoundary> */}

      </div>
    </HighlightsProvider>
  );
}
