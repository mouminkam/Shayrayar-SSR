import { Urbanist } from "next/font/google";
import FreshHeatHeader from "../components/layout/Header";
import FreshHeatFooter from "../components/layout/Footer";
import Toast from "../components/ui/Toast";
import BranchInitializer from "../components/layout/BranchInitializer";
import LenisScrollProvider from "../components/layout/LenisScrollProvider";
import "./globals.css";


const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  variable: "--font-urbanist",
  display: "swap",
});


export const metadata = {
  title: "shahriar",
  description: "shahriar website",
};


export default function RootLayout({ children }) {
  return (
    <html lang="en" className={urbanist.variable}>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/img/logo/mainlogo.png" type="image/png" />
      </head>

      <body suppressHydrationWarning className={urbanist.className}>
          <LenisScrollProvider>
            <BranchInitializer />
            <FreshHeatHeader />
            <main id="main" role="main">
              {children}
            </main>
            <FreshHeatFooter />
            <Toast />
          </LenisScrollProvider>
      </body>
    </html>
  );
}
