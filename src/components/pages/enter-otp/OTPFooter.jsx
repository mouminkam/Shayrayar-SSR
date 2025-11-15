"use client";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function OTPFooter() {
  const router = useRouter();

  return (
    <div className="mt-6 text-center">
      <button
        onClick={() => router.push("/reset-password")}
        className="text-theme3 hover:text-theme text-sm font-medium transition-colors inline-flex items-center gap-1"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Reset Password
      </button>
    </div>
  );
}

