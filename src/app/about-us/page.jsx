import Breadcrumb from "../../components/ui/Breadcrumb";
import OfferCards from "../../components/about/OfferCards";
import AboutSection from "../../components/about/AboutSection";
import MarqueeSection from "../../components/about/MarqueeSection";
import CTASection from "../../components/about/CTASection";
import ChefeSection from "../../components/about/ChefeSection";
import TestimonialSection from "../../components/about/TestimonialSection";
import BlogSection from "../../components/about/BlogSection";

export default function AboutUsPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="About Us" />
      <OfferCards />
      <AboutSection />
      <MarqueeSection />
      <CTASection />
      <ChefeSection />
      <TestimonialSection />
      <BlogSection />
    </div>
  );
}

