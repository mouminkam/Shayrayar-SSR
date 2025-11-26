import { Oswald } from "next/font/google";
import FreshHeatHeader from "../components/layout/Header";
import FreshHeatFooter from "../components/layout/Footer";
import Toast from "../components/ui/Toast";
import BranchInitializer from "../components/layout/BranchInitializer";
import LenisScrollProvider from "../components/layout/LenisScrollProvider";
import "./globals.css";

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
  variable: "--font-oswald",
  display: "swap",
});


export const metadata = {
  title: "shahriar",
  description: "shahriar website",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={oswald.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/img/logo/mainlogo.png" type="image/png" />
      </head>

      <body suppressHydrationWarning className={oswald.className}>
          <LenisScrollProvider>
            <BranchInitializer />
            <FreshHeatHeader />
            <main id="main" role="main" className="pt-15 md:pt-15 lg:pt-0">
              {children}
            </main>
            <FreshHeatFooter />
            <Toast />
          </LenisScrollProvider>
      </body>
    </html>
  );
}
