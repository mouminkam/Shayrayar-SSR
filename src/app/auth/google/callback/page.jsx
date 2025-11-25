"use client";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import api from "../../../../api/auth";
import useAuthStore from "../../../../store/authStore";
import useToastStore from "../../../../store/toastStore";

function GoogleCallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { handleGoogleOAuthCallback } = useAuthStore();
  const { error: toastError } = useToastStore();
  const [status, setStatus] = useState("processing");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Read code and state from URL
        const code = searchParams?.get("code");
        const state = searchParams?.get("state");
        const error = searchParams?.get("error");

        // Handle error from Google
        if (error) {
          setStatus("error");
          const errorMsg = `Google authentication failed: ${error}`;
          setErrorMessage(errorMsg);
          toastError(errorMsg);
          setTimeout(() => {
            router.push(`/login?error=${encodeURIComponent(error)}`);
          }, 2000);
          return;
        }

        // Validate required parameters
        if (!code || !state) {
          setStatus("error");
          const errorMsg = "Missing required parameters: code or state";
          setErrorMessage(errorMsg);
          toastError(errorMsg);
          setTimeout(() => {
            router.push("/login?error=missing_parameters");
          }, 2000);
          return;
        }

        // Verify state (CSRF protection)
        const storedState = sessionStorage.getItem("googleOAuthState");
        if (storedState !== state) {
          setStatus("error");
          const errorMsg = "Invalid state parameter. Please try again.";
          setErrorMessage(errorMsg);
          toastError(errorMsg);
          setTimeout(() => {
            router.push("/login?error=invalid_state");
          }, 2000);
          return;
        }

        // Get redirect URI from sessionStorage (stored during OAuth initiation)
        // This ensures we use the exact same redirect_uri that was used in the OAuth request
        let redirectUri = null;
        if (typeof window !== "undefined") {
          redirectUri = sessionStorage.getItem("googleOAuthRedirectUri");
        }
        
        // Fallback to environment variable if not in sessionStorage
        if (!redirectUri) {
          redirectUri = process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI;
        }
        
        // Last resort: construct from current origin
        if (!redirectUri && typeof window !== "undefined") {
          redirectUri = `${window.location.origin}/auth/google/callback`;
        }
        
        if (!redirectUri) {
          setStatus("error");
          const errorMsg = "Redirect URI is not configured";
          setErrorMessage(errorMsg);
          toastError(errorMsg);
          setTimeout(() => {
            router.push("/login?error=configuration_error");
          }, 2000);
          return;
        }
        
        // Clear state and redirect_uri from sessionStorage after use
        if (typeof window !== "undefined") {
          sessionStorage.removeItem("googleOAuthState");
          sessionStorage.removeItem("googleOAuthRedirectUri");
        }

        // Call new API endpoint
        console.log("Calling googleWebLogin with:", { 
          code: code?.substring(0, 20) + "...", 
          redirectUri,
          state,
          fullCode: code
        });
        
        const response = await api.googleWebLogin(code, redirectUri);
        console.log("Google web login response:", response);

        if (response.success && response.data) {
          const { user, token } = response.data;

          // Handle callback with user and token
          const result = await handleGoogleOAuthCallback({ user, token });

          if (result.success) {
            setStatus("success");
            // Redirect based on result
            setTimeout(() => {
              if (result.redirect) {
                router.push(result.redirect);
              } else {
                router.push("/");
              }
            }, 1000);
          } else {
            setStatus("error");
            const errorMsg = result.error || "Failed to process authentication";
            setErrorMessage(errorMsg);
            toastError(errorMsg);
            setTimeout(() => {
              router.push(`/login?error=${encodeURIComponent(errorMsg)}`);
            }, 2000);
          }
        } else {
          setStatus("error");
          // Extract error message from different possible locations
          let errorMsg = "Authentication failed";
          if (response.errors?.error) {
            errorMsg = response.errors.error;
          } else if (response.error) {
            errorMsg = response.error;
          } else if (response.message) {
            errorMsg = response.message;
          }
          setErrorMessage(errorMsg);
          toastError(errorMsg);
          console.error("Google login API error:", response);
          setTimeout(() => {
            router.push(`/login?error=${encodeURIComponent(errorMsg)}`);
          }, 2000);
        }
      } catch (error) {
        // Log full error object with JSON.stringify to see all properties
        console.error("Google callback error (full):", JSON.stringify(error, null, 2));
        console.error("Google callback error (object):", error);
        console.error("Error type:", typeof error);
        console.error("Error keys:", Object.keys(error || {}));
        
        // Try to extract error details
        let errorData = null;
        let errorMsg = "An error occurred during authentication";
        let errorStatus = null;
        
        // Check different possible error structures
        if (error?.response?.data) {
          errorData = error.response.data;
          errorStatus = error.response.status;
        } else if (error?.data) {
          errorData = error.data;
          errorStatus = error.status;
        } else if (error) {
          errorData = error;
          errorStatus = error.status;
        }
        
        console.error("Extracted error data:", errorData);
        console.error("Extracted error status:", errorStatus);
        
        // Extract error message from different possible locations
        if (errorData) {
          if (errorData.errors?.error) {
            errorMsg = errorData.errors.error;
          } else if (errorData.error) {
            errorMsg = errorData.error;
          } else if (errorData.message) {
            errorMsg = errorData.message;
          } else if (typeof errorData === 'string') {
            errorMsg = errorData;
          }
        }
        
        // If we have status but no message, include it
        if (errorStatus && errorMsg === "An error occurred during authentication") {
          errorMsg = `Authentication failed (Status: ${errorStatus})`;
        }
        
        // If still no message, try error.message
        if (errorMsg === "An error occurred during authentication" && error?.message) {
          errorMsg = error.message;
        }
        
        setStatus("error");
        setErrorMessage(errorMsg);
        toastError(errorMsg);
        
        setTimeout(() => {
          router.push(`/login?error=${encodeURIComponent(errorMsg)}`);
        }, 2000);
      }
    };

    handleCallback();
  }, [searchParams, router, handleGoogleOAuthCallback]);

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
            <p className="text-text text-sm mt-2">{errorMessage || "Redirecting to login..."}</p>
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

