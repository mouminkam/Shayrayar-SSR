import FreshHeatHeader from "../components/layout/Header";
import FreshHeatFooter from "../components/layout/Footer";
import Toast from "../components/ui/Toast";
import "./globals.css";

export const metadata = {
  title: "shahriar",
  description: "shahriar website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/img/logo/mainlogo.png" type="image/png" />
      </head>

      <body>
      
          <FreshHeatHeader />
          <main id="main" role="main">
            {children}
          </main>
          <FreshHeatFooter />
          <Toast />
       
      </body>
    </html>
  );
}
