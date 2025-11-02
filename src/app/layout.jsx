import Header from "../components/Header";
import Footer from "../components/Footer";

import "./globals.css";

export const metadata = {
  title: "JEWELRY",
  description: "Jewelry E-commerce Website",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Google Fonts */}
        {/* <link
          href="https://fonts.googleapis.com/css?family=Montserrat:400,700&display=optional"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css?family=Open+Sans:700&display=optional"
          rel="stylesheet"
        /> */}
      </head>

      <body>
        <Header />
        <main id="main" role="main">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
