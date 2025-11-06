"use client";
import TopBar from "../components/layout/footer/TopBar";
import CompanyInfo from "../components/layout/footer/CompanyInfo";
import QuickLinks from "../components/layout/footer/QuickLinks";
import OurMenu from "../components/layout/footer/OurMenu";
import ContactSection from "../components/layout/footer/ContactSection";
import BottomBar from "../components/layout/footer/BottomBar";
import ScrollToTop from "../components/layout/footer/ScrollToTop";
import BackgroundShapes from "../components/layout/footer/BackgroundShapes";

function FreshHeatFooter() {
  return (
    <footer className="relative w-full bg-[#010F1C] overflow-hidden">
      {/* Main Dark Section */}
      <div className="relative bg-[#010F1C] py-12 sm:py-16 md:py-20 lg:py-24 xl:py-32">
        <BackgroundShapes />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          {/* Top Orange Bar */}
          <TopBar />

          {/* Footer Widgets */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 lg:gap-10 xl:gap-12">
            <CompanyInfo />
            <QuickLinks />
            <OurMenu />
            <ContactSection />
          </div>
        </div>
      </div>

      {/* Bottom Red Bar */}
      <BottomBar />

      {/* Scroll to Top Button */}
      <ScrollToTop />
    </footer>
  );
}

export default FreshHeatFooter;
