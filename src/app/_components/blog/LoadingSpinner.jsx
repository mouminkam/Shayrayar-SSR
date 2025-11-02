"use client";
import React from "react";

/**
 * LoadingSpinner Component
 * Reusable loading spinner component
 */
export default function LoadingSpinner() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
  );
}
