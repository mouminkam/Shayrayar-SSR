"use client";
import { Suspense, useEffect, useState, useRef } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import GuestOnly from "../../components/auth/GuestOnly";
import api from "../../api";
import useToastStore from "../../store/toastStore";

function VerifyResetTokenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { error: toastError } = useToastStore();
  const token = searchParams.get("token");
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasVerifiedRef.current) return;

    const verifyToken = async () => {
      // If token is missing, redirect to forgot-password
      if (!token) {
        setError("Invalid reset link. Please request a new one.");
        setIsVerifying(false);
        // Use setTimeout to show error before redirect
        setTimeout(() => {
          router.replace("/forgot-password");
        }, 2000);
        return;
      }

      try {
        setIsVerifying(true);
        setError(null);
        hasVerifiedRef.current = true;

        // Call API to verify token
        const response = await api.auth.verifyResetToken(token);

        if (response.success && response.data) {
          const { token: verifiedToken, email, valid } = response.data;

          if (valid && verifiedToken && email) {
            // Token is valid, redirect to reset-password with token and email
            // Use URLSearchParams for proper encoding
            const params = new URLSearchParams({
              token: verifiedToken,
              email: email
            });
            router.replace(`/reset-password?${params.toString()}`);
          } else {
            // Token is invalid or expired
            setError("This reset link is invalid or has expired. Please request a new one.");
            setIsVerifying(false);
            hasVerifiedRef.current = false; // Allow retry
          }
        } else {
          // API returned error
          setError(response.message || "Failed to verify reset token. Please request a new one.");
          setIsVerifying(false);
          hasVerifiedRef.current = false; // Allow retry
        }
      } catch (err) {
        // Handle API errors
        const errorMessage = err.message || "An error occurred while verifying the reset token. Please try again.";
        setError(errorMessage);
        setIsVerifying(false);
        toastError(errorMessage);
        hasVerifiedRef.current = false; // Allow retry
      }
    };

    verifyToken();

    // Cleanup function
    return () => {
      // Optional cleanup if needed
    };
  }, [token, router]); // Removed toastError from dependencies to prevent infinite loop

  // Show loading while verifying
  if (isVerifying) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme3 mx-auto mb-4"></div>
        <p className="text-text text-lg">Verifying reset token...</p>
      </div>
    );
  }

  // Show error if verification failed
  if (error) {
    return (
      <div className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-8 lg:p-10 text-center">
        <div className="mb-6">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </div>
          <h2 className="text-red-400 text-2xl font-bold mb-2">Verification Failed</h2>
          <p className="text-text text-base mb-6">{error}</p>
        </div>
        <Link
          href="/forgot-password"
          className="inline-block bg-linear-to-r from-theme to-theme3 hover:from-theme3 hover:to-theme text-white py-3 px-6 rounded-xl font-semibold transition-all duration-300"
        >
          Request New Reset Link
        </Link>
      </div>
    );
  }

  return null;
}

export default function VerifyResetTokenPage() {
  return (
    <GuestOnly>
      <div className="bg-bg3 min-h-screen">
        <section className="verify-reset-token-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-2xl mx-auto">
              <ErrorBoundary>
                <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
                  <AnimatedSection>
                    <VerifyResetTokenContent />
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
