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
import BlogSection from "../components/about/BlogSection";
import GallerySection from "../components/home/GallerySection";
import MarqueeSection from "../components/about/MarqueeSection";

export default function HomePage() {
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
      <BlogSection />
      <GallerySection />
    </div>
  );
}
