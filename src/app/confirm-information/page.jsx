import ConfirmPasswordSection from "../../components/pages/confirm-information/ConfirmPasswordSection";

export default function ConfirmInformationPage() {
  return (
    <div className="bg-bg3 min-h-screen">
      <section className="confirm-information-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="max-w-2xl mx-auto">
            <ConfirmPasswordSection />
          </div>
        </div>
      </section>
    </div>
  );
}

