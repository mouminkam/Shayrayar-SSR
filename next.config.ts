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
    // Image optimization settings
    formats: ["image/avif", "image/webp"],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    minimumCacheTTL: 60,
    qualities: [75, 80, 85, 90],
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
