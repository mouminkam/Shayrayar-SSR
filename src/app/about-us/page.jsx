"use client";
import Breadcrumb from "../../components/ui/Breadcrumb";
import OfferCards from "../../sections/about/OfferCards";
import AboutSection from "../../sections/about/AboutSection";
import MarqueeSection from "../../sections/about/MarqueeSection";
import CTASection from "../../sections/about/CTASection";
import ChefeSection from "../../sections/about/ChefeSection";
import TestimonialSection from "../../sections/about/TestimonialSection";
import BlogSection from "../../sections/about/BlogSection";

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

