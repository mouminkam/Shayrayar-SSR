"use client";
import { Suspense, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import GuestOnly from "../../components/auth/GuestOnly";

// Lazy load ResetPasswordSection - Heavy component with API calls
const ResetPasswordSection = dynamic(
  () => import("../../components/pages/reset-password/ResetPasswordSection"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: false,
  }
);

function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    // If token or email is missing, redirect to forgot-password
    if (!token || !email) {
      router.replace("/forgot-password");
    }
  }, [token, email, router]);

  // Show loading while checking params or redirecting
  if (!token || !email) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme3 mx-auto mb-4"></div>
        <p className="text-text text-lg">Redirecting...</p>
      </div>
    );
  }

  return <ResetPasswordSection token={token} email={email} />;
}

export default function ResetPasswordPage() {
  return (
    <GuestOnly>
      <div className="bg-bg3 min-h-screen">
        <section className="reset-password-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-2xl mx-auto">
              <ErrorBoundary>
                <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
                  <AnimatedSection>
                    <ResetPasswordContent />
                  </AnimatedSection>
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </section>
      </div>
    </GuestOnly>
  );
}
