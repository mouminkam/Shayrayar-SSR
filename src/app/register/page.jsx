"use client";
import AnimatedSection from "../../components/ui/AnimatedSection";
import RegisterSection from "../../components/pages/register/RegisterSection";
import GuestOnly from "../../components/auth/GuestOnly";

export default function RegisterPage() {
  return (
    <GuestOnly>
      <div className="bg-bg3 min-h-screen">
        <section className="register-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-2xl mx-auto">
              <AnimatedSection>
                <RegisterSection />
              </AnimatedSection>
            </div>
          </div>
        </section>
      </div>
    </GuestOnly>
  );
}

