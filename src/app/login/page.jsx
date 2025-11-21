"use client";
import { Suspense } from "react";
import LoginSection from "../../components/pages/login/LoginSection";
import GuestOnly from "../../components/auth/GuestOnly";

export default function LoginPage() {
  return (
    <GuestOnly>
      <div className="bg-bg3 min-h-screen"> 
        <section className="login-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-2xl mx-auto">
              <Suspense fallback={
                <div className="flex items-center justify-center py-12 bg-bgimg">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme3"></div>
                </div>
              }>
                <LoginSection />
              </Suspense>
            </div>
          </div>
        </section>
      </div>
    </GuestOnly>
  );
}

