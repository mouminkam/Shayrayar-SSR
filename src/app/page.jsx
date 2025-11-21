"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useBranchStore from "../store/branchStore";
import BannerSection from "../components/home/BannerSection";
import BestFoodItemsSection from "../components/home/BestFoodItemsSection";
import OfferCards from "../components/about/OfferCards";
import AboutUsSection from "../components/home/AboutUsSection";
import PopularDishes from "../components/shop/PopularDishes";
import CTASection from "../components/about/CTASection";
import FoodMenuSection from "../components/home/FoodMenuSection";
import TimerSection from "../components/home/TimerSection";
import ChefeSection from "../components/about/ChefeSection";
import TestimonialSection from "../components/about/TestimonialSection";
// import BlogSection from "../components/about/BlogSection"; // Blog section temporarily disabled
import GallerySection from "../components/home/GallerySection";
import MarqueeSection from "../components/about/MarqueeSection";

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
      // Force re-render of components that use API data
      router.refresh();
    }
  }, [selectedBranch?.id, router]);

  return (
    <div className="bg-bg3 min-h-screen">
      <BannerSection />
      <BestFoodItemsSection />
      <OfferCards />
      <AboutUsSection />
      <PopularDishes />
      <CTASection />
      <FoodMenuSection />
      <MarqueeSection />
      <TimerSection />
      <ChefeSection />
      <TestimonialSection />
      {/* <BlogSection /> */} {/* Blog section temporarily disabled */}
      <GallerySection />
    </div>
  );
}
