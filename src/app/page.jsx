"use client";
import BannerSection from "../components/pages/home/BannerSection";
import BestFoodItemsSection from "../components/pages/home/BestFoodItemsSection";
import OfferCards from "../components/pages/about/OfferCards";
import AboutUsSection from "../components/pages/home/AboutUsSection";
import PopularDishes from "../components/pages/shop-details/PopularDishes";
import CTASection from "../components/pages/about/CTASection";
import FoodMenuSection from "../components/pages/home/FoodMenuSection";
import TimerSection from "../components/pages/home/TimerSection";
import ChefeSection from "../components/pages/about/ChefeSection";
import TestimonialSection from "../components/pages/about/TestimonialSection";
import BlogSection from "../components/pages/about/BlogSection";
import GallerySection from "../components/pages/home/GallerySection";
import MarqueeSection from "../components/pages/about/MarqueeSection";

export default function HomePage() {
  return (
    <div className="bg-bg2 min-h-screen">

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
      <BlogSection />
      <GallerySection />
    </div>
  );
}
