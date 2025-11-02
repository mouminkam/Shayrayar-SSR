import HeroSection from "./_components/HeroSection";
import FeaturedProducts from "./_components/FeaturedProducts";
import AboutUs from "./_components/AboutUs";
import NewsletterSection from "./_components/BlogSection";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <AboutUs
        title="ABOUT US"
        backgroundImage="/images/img04.jpg"
        leftBadge="SALE OF 50%"
        rightBadge="TRENDS FOR 2024"
      />
      <FeaturedProducts />
      <NewsletterSection />
    </>
  );
}
