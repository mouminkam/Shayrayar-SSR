import BannerSection from "../sections/home/BannerSection";
import BestFoodItemsSection from "../sections/home/BestFoodItemsSection";
import OfferCards from "../sections/about/OfferCards";
import AboutUsSection from "../sections/home/AboutUsSection";
import PopularDishes from "../sections/shop/PopularDishes";
import CTASection from "../sections/about/CTASection";
import FoodMenuSection from "../sections/home/FoodMenuSection";
import TimerSection from "../sections/home/TimerSection";
import ChefeSection from "../sections/about/ChefeSection";
import TestimonialSection from "../sections/about/TestimonialSection";
import BlogSection from "../sections/about/BlogSection";
import GallerySection from "../sections/home/GallerySection";
import MarqueeSection from "../sections/about/MarqueeSection";

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
