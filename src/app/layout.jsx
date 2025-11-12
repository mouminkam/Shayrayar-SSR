import FreshHeatHeader from "../layout/Header";
import FreshHeatFooter from "../layout/Footer";
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
      </body>
    </html>
  );
}
