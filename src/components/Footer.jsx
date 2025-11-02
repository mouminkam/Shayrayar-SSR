"use client";
import Link from "next/link";
import Image from "next/image";
import { MapPin, Mail, Phone, Printer, ChevronUp } from "lucide-react";
import { useState, useEffect } from "react";

export default function Footer() {
  const [showBackTop, setShowBackTop] = useState(false);

  // Back to top functionality
  useEffect(() => {
    const handleScroll = () => {
      setShowBackTop(window.scrollY > 100);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Instagram images data
  const instagramImages = [
    { src: "/images/img12.jpg", alt: "Jewelry item 1" },
    { src: "/images/img13.jpg", alt: "Jewelry item 2" },
    { src: "/images/img14.jpg", alt: "Jewelry item 3" },
    { src: "/images/img15.jpg", alt: "Jewelry item 4" },
    { src: "/images/img16.jpg", alt: "Jewelry item 5" },
    { src: "/images/img17.jpg", alt: "Jewelry item 6" },
    { src: "/images/img18.jpg", alt: "Jewelry item 7" },
    { src: "/images/img19.jpg", alt: "Jewelry item 8" },
  ];

  return (
    <>
      {/* Footer Section */}
      <footer className="bg-white relative py-16 px-8 lg:px-0 border-t border-gray-200">
        {/* Side Labels */}
        <span className="hidden lg:block absolute left-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-900 text-lg opacity-50 tracking-widest whitespace-nowrap">
          FREE SHIPPING
        </span>

        <span className="hidden lg:block absolute right-0 top-1/2 transform -translate-y-1/2 -rotate-90 text-gray-900 text-lg opacity-50 tracking-widest whitespace-nowrap">
          24H SUPPORT
        </span>

        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Column - Brand */}
            <div className="text-gray-900">
              <h1 className="text-4xl font-bold tracking-widest mb-6 uppercase">
                JEWELRY
              </h1>
              <p className="text-lg leading-8 text-gray-700">
                Pharetra, erat sed fermentum
                <br />
                feugiat, velit mauris egestas
                <br />
                quam.
              </p>
            </div>

            {/* Middle Column - Contact */}
            <div className="text-gray-900">
              <h3 className="text-2xl font-normal mb-6 uppercase tracking-wide">
                CONTACT US
              </h3>
              <ul className="space-y-4">
                <li className="flex items-start">
                  <MapPin className="w-5 h-5 mr-4 mt-1 shrink-0 text-gray-900" />
                  <span className="text-gray-700">Limited: 222-UTC, EU.</span>
                </li>
                <li className="flex items-start">
                  <Mail className="w-5 h-5 mr-4 mt-1 shrink-0 text-gray-900" />
                  <a
                    href="mailto:Support@emttheme.com"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Support@emttheme.com
                  </a>
                </li>
                <li className="flex items-start">
                  <Phone className="w-5 h-5 mr-4 mt-1 shrink-0 text-gray-900" />
                  <a
                    href="tel:0002131234567"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    (00) -213 1234567
                  </a>
                </li>
                <li className="flex items-start">
                  <Printer className="w-5 h-5 mr-4 mt-1 shrink-0 text-gray-900" />
                  <a
                    href="tel:0002131879017"
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    (00) -213 1879017
                  </a>
                </li>
              </ul>
            </div>

            {/* Right Column - Instagram */}
            <div className="text-gray-900">
              <h3 className="text-2xl font-normal mb-6 uppercase tracking-wide">
                INSTAGRAM FEED
              </h3>
              <div className="grid grid-cols-4 gap-2">
                {instagramImages.map((image, index) => (
                  <Link
                    key={index}
                    href="/product-page"
                    className="block relative group overflow-hidden rounded border border-gray-200 transition-all duration-300 hover:scale-105 hover:shadow-lg aspect-square"
                  >
                    <div className="w-full h-full flex items-center justify-center overflow-hidden">
                      <Image
                        src={image.src || "/images/img03.jpg"}
                        alt={image.alt}
                        width={100}
                        height={100}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    {/* Overlay with animation */}
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center pb-2">
                      <span className="text-white text-xs font-medium transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        View
                      </span>
                    </div>
                    {/* Dark overlay on hover */}
                    <div className="absolute inset-0 bg-black opacity-0 group-hover:opacity-30 transition-opacity duration-300" />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <button
        onClick={scrollToTop}
        className={`fixed bottom-8 right-8 w-12 h-12 bg-gray-900 text-white rounded-full flex items-center justify-center transition-all duration-300 z-50 ${
          showBackTop
            ? "opacity-100 translate-y-0"
            : "opacity-0 translate-y-10 pointer-events-none"
        }`}
      >
        <ChevronUp className="w-6 h-6" />
      </button>
    </>
  );
}
