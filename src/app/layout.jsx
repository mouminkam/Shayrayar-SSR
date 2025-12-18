import { Oswald } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import FreshHeatHeader from "../components/layout/Header";
import FreshHeatFooter from "../components/layout/Footer";
import Toast from "../components/ui/Toast";
import BranchInitializer from "../components/layout/BranchInitializer";
import LenisScrollProvider from "../components/layout/LenisScrollProvider";
import HtmlLangUpdater from "../components/layout/HtmlLangUpdater";
import { LanguageProvider } from "../context/LanguageContext";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});


export const metadata = {
  title: {
    default: "Shahrayar Restaurant - Authentic Middle Eastern Cuisine",
    template: "%s | Shahrayar Restaurant",
  },
  description: "Experience authentic Middle Eastern flavors at Shahrayar Restaurant. Fresh ingredients, traditional recipes, and genuine hospitality. Order online for delivery or pickup.",
  keywords: ["Middle Eastern food", "restaurant", "delivery", "pickup", "authentic cuisine", "Shahrayar"],
  authors: [{ name: "Shahrayar Restaurant" }],
  creator: "Shahrayar Restaurant",
  publisher: "Shahrayar Restaurant",
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://shahrayar.peaklink.pro"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Shahrayar Restaurant",
    title: "Shahrayar Restaurant - Authentic Middle Eastern Cuisine",
    description: "Experience authentic Middle Eastern flavors at Shahrayar Restaurant. Fresh ingredients, traditional recipes, and genuine hospitality.",
    images: [
      {
        url: "/img/logo/mainlogo.png",
        width: 1200,
        height: 630,
        alt: "Shahrayar Restaurant",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Shahrayar Restaurant - Authentic Middle Eastern Cuisine",
    description: "Experience authentic Middle Eastern flavors at Shahrayar Restaurant.",
    images: ["/img/logo/mainlogo.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={oswald.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/img/logo/mainlogo.png" type="image/png" />
        {/* Preconnect to external domains for faster resource loading */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        {/* API endpoint preconnect for banner slides - high priority */}
        <link rel="preconnect" href="https://shahrayar.peaklink.pro" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://shahrayar.peaklink.pro" />
        
        {/* Preload LCP images for faster initial render */}
        <link
          rel="preload"
          as="image"
          href="/img/bg/bannerBG1_1.jpg"
          fetchPriority="high"
        />
        <link
          rel="preload"
          as="image"
          href="/img/banner/bannerThumb1_1.png"
          fetchPriority="high"
        />
      </head>

      <body suppressHydrationWarning className={oswald.className}>
        <LanguageProvider>
            <HtmlLangUpdater />
            <LenisScrollProvider>
              <BranchInitializer />
              <FreshHeatHeader />
              <main id="main" role="main" className="pt-15 md:pt-15 lg:pt-0">
                {children}
              </main>
              <FreshHeatFooter />
              <Toast />
            </LenisScrollProvider>
        </LanguageProvider>
        <SpeedInsights />
      </body>
    </html>
  );
}
