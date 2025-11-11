"use client";
import Breadcrumb from "../../components/pages/about/Breadcrumb";
import OfferCards from "../../components/pages/about/OfferCards";
import AboutSection from "../../components/pages/about/AboutSection";
import MarqueeSection from "../../components/pages/about/MarqueeSection";
import CTASection from "../../components/pages/about/CTASection";
import ChefeSection from "../../components/pages/about/ChefeSection";
import TestimonialSection from "../../components/pages/about/TestimonialSection";
import BlogSection from "../../components/pages/about/BlogSection";

export default function AboutUsPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title="About Us 02" />
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

