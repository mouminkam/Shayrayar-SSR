import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "htmlbeans.com",
        port: "",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "shahrayar.peaklink.pro",
        port: "",
        pathname: "/**",
      },
    ],
    // Image optimization settings - Improved for better performance
    formats: ["image/avif", "image/webp"],
    // Optimized deviceSizes for mobile-first approach
    deviceSizes: [320, 375, 414, 640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    // Configure allowed quality values used in Image components
    qualities: [75, 80, 85, 90],
    // Enable content-based image sizing
    dangerouslyAllowSVG: true,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  // Compiler options for production
  compiler: {
    // Remove console logs in production
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  // Experimental features for better performance
  // Note: Turbopack (Next.js 16 default) handles bundle optimization automatically
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion"],
  },
  // Turbopack configuration (empty config to silence the warning)
  // Turbopack handles bundle splitting and optimization automatically
  turbopack: {},
};

export default nextConfig;
