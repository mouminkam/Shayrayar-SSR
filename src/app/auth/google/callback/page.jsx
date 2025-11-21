"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import api from "../../../../api";

function GoogleCallbackContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState("processing");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get code and state from URL
        const code = searchParams.get("code");
        const state = searchParams.get("state");
        const error = searchParams.get("error");

        // Handle error from Google
        if (error) {
          setStatus("error");
          router.push(`/login?error=${encodeURIComponent(`Google authentication failed: ${error}`)}`);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setStatus("error");
          router.push('/login?error=missing_parameters');
          return;
        }

        // Call Backend callback endpoint to get user data and token
        setStatus("processing");
        const response = await api.auth.googleCallback(code, state);

        if (response.success && response.data) {
          const { user, token } = response.data;
          
          // Save user + token in sessionStorage
          if (typeof window !== "undefined") {
            sessionStorage.setItem("googleUser", JSON.stringify(user));
            sessionStorage.setItem("googleToken", token);
            sessionStorage.setItem("googleFlow", "true");
          }

          // Check phone
          if (!user.phone) {
            // Google Registration - redirect to add phone
            setStatus("success");
            router.push("/add-phone");
          } else {
            // Google Login - send OTP and redirect to enter-otp
            try {
              const otpResult = await api.auth.registerPhone({
                phone: user.phone,
                password: null,
                password_confirmation: null,
              });

              if (otpResult.success) {
                if (typeof window !== "undefined") {
                  sessionStorage.setItem("registrationPhone", user.phone);
                }
                setStatus("success");
                router.push("/enter-otp");
              } else {
                setStatus("error");
                router.push(`/login?error=${encodeURIComponent(otpResult.message || 'Failed to send OTP')}`);
              }
            } catch (otpError) {
              setStatus("error");
              router.push(`/login?error=${encodeURIComponent(otpError.message || 'Failed to send OTP')}`);
            }
          }
        } else {
          setStatus("error");
          router.push(`/login?error=${encodeURIComponent(response.message || 'Authentication failed')}`);
        }
      } catch (error) {
        console.error("Google callback error:", error);
        setStatus("error");
        router.push(`/login?error=${encodeURIComponent(error.message || 'Authentication error')}`);
      }
    };

    handleCallback();
  }, [searchParams, router]);

  return (
    <div className="bg-bgimg min-h-screen flex items-center justify-center">
      <div className="text-center">
        {status === "processing" && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme3 mx-auto mb-4"></div>
            <p className="text-white text-lg">Processing Google authentication...</p>
            <p className="text-text text-sm mt-2">Please wait...</p>
          </>
        )}
        {status === "success" && (
          <>
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <p className="text-white text-lg">Authentication successful!</p>
            <p className="text-text text-sm mt-2">Redirecting...</p>
          </>
        )}
        {status === "error" && (
          <>
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <p className="text-white text-lg">Authentication failed</p>
            <p className="text-text text-sm mt-2">Redirecting to login...</p>
          </>
        )}
      </div>
    </div>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="bg-bgimg min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme3 mx-auto mb-4"></div>
            <p className="text-white text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}

