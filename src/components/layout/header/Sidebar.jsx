"use client";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, Mail, Clock, Phone, ShoppingCart, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    { href: "/blog", label: "Blog" },
    { href: "/contact-us", label: "ContactUs" },
    { href: "/about-us", label: "AboutUs" },
  ];

  const galleryImages = [
    "/img/header/01.jpg",
    "/img/header/02.jpg",
    "/img/header/03.jpg",
    "/img/header/04.jpg",
    "/img/header/05.jpg",
    "/img/header/06.jpg",
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-[9998] transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="fix-area fixed right-0 top-0 h-full w-full max-w-md bg-white z-[9999] shadow-2xl transform transition-all duration-300 ease-in-out overflow-y-auto">
        <div className="offcanvas__info h-full">
          <div className="offcanvas__wrapper h-full">
            <div className="offcanvas__content p-6">
              {/* Top Section - Logo and Close Button */}
              <div className="offcanvas__top mb-5 flex justify-between items-center">
                <div className="offcanvas__logo">
                  <Link href="/">
                    <Image
                      src="/img/logo/logo.svg"
                      alt="logo"
                      width={150}
                      height={60}
                      className="h-auto w-auto object-contain"
                      unoptimized={true}
                    />
                  </Link>
                </div>
                <div className="offcanvas__close">
                  <button
                    onClick={() => setIsOpen(false)}
                    className="w-10 h-10 bg-theme text-white rounded-full flex items-center justify-center hover:bg-theme2 transition-colors duration-300"
                    aria-label="Close sidebar"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Description Text - يظهر فقط على الشاشات الكبيرة */}
              <p className="text text-text font-['Roboto',sans-serif] text-base font-normal leading-relaxed mb-6 hidden lg:block">
                This involves interactions between a business and its customers. It&apos;s about meeting
                customers&apos; needs and resolving their problems. Effective customer service is crucial.
              </p>

              {/* Gallery Area - يظهر فقط على الشاشات XL */}
              <div className="offcanvas-gallery-area hidden xl:block mb-6">
                <div className="offcanvas-gallery-items grid grid-cols-3 gap-2 mb-2">
                  {galleryImages.slice(0, 3).map((image, index) => (
                    <Link
                      key={index}
                      href={image}
                      className="offcanvas-image block aspect-square overflow-hidden rounded-lg group"
                    >
                      <Image
                        src={image}
                        alt={`gallery-img-${index + 1}`}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized={true}
                      />
                    </Link>
                  ))}
                </div>
                <div className="offcanvas-gallery-items grid grid-cols-3 gap-2">
                  {galleryImages.slice(3, 6).map((image, index) => (
                    <Link
                      key={index + 3}
                      href={image}
                      className="offcanvas-image block aspect-square overflow-hidden rounded-lg group"
                    >
                      <Image
                        src={image}
                        alt={`gallery-img-${index + 4}`}
                        width={120}
                        height={120}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized={true}
                      />
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Menu - Navigation للأجهزة الصغيرة */}
              <div className="mobile-menu fix mb-6 lg:hidden">
                <nav>
                  <ul className="space-y-3">
                    {navItems.map((item, index) => (
                      <li key={index}>
                        <Link
                          href={item.href}
                          onClick={() => setIsOpen(false)}
                          className="block text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme transition-colors duration-300 py-2"
                        >
                          {item.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </nav>
              </div>

              {/* Contact Info Section */}
              <div className="offcanvas__contact">
                <h4 className="text-title font-['Epilogue',sans-serif] text-xl font-bold mb-4">
                  Contact Info
                </h4>
                <ul className="space-y-4 mb-6">
                  {/* Location */}
                  <li className="flex items-center gap-4">
                    <div className="offcanvas__contact-icon shrink-0">
                      <MapPin className="w-5 h-5 text-theme" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link
                        href="#"
                        target="_blank"
                        className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme transition-colors duration-300"
                      >
                        Main Street, Melbourne, Australia
                      </Link>
                    </div>
                  </li>

                  {/* Email */}
                  <li className="flex items-center gap-4">
                    <div className="offcanvas__contact-icon shrink-0">
                      <Mail className="w-5 h-5 text-theme" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link
                        href="mailto:info@fresheat.com"
                        className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme transition-colors duration-300"
                      >
                        info@fresheat.com
                      </Link>
                    </div>
                  </li>

                  {/* Hours */}
                  <li className="flex items-center gap-4">
                    <div className="offcanvas__contact-icon shrink-0">
                      <Clock className="w-5 h-5 text-theme" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link
                        href="#"
                        target="_blank"
                        className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme transition-colors duration-300"
                      >
                        Mod-friday, 09am -05pm
                      </Link>
                    </div>
                  </li>

                  {/* Phone */}
                  <li className="flex items-center gap-4">
                    <div className="offcanvas__contact-icon shrink-0">
                      <Phone className="w-5 h-5 text-theme" />
                    </div>
                    <div className="offcanvas__contact-text">
                      <Link
                        href="tel:+11002345909"
                        className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme transition-colors duration-300"
                      >
                        +11002345909
                      </Link>
                    </div>
                  </li>
                </ul>

                {/* ORDER NOW Button */}
                <div className="header-button mt-6 mb-6">
                  <Link
                    href="/shop"
                    onClick={() => setIsOpen(false)}
                    className="theme-btn px-6 py-3 bg-theme text-white font-['Roboto',sans-serif] text-sm font-normal hover:bg-theme2 transition-all duration-300 rounded-md flex items-center justify-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>ORDER NOW</span>
                  </Link>
                </div>

                {/* Social Icons */}
                <div className="social-icon flex items-center gap-3">
                  <Link
                    href="https://facebook.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-theme text-white rounded-full flex items-center justify-center hover:bg-title transition-all duration-300"
                    aria-label="Facebook"
                  >
                    <Facebook className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://twitter.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-theme text-white rounded-full flex items-center justify-center hover:bg-title transition-all duration-300"
                    aria-label="Twitter"
                  >
                    <Twitter className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://youtube.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-theme text-white rounded-full flex items-center justify-center hover:bg-title transition-all duration-300"
                    aria-label="YouTube"
                  >
                    <Youtube className="w-4 h-4" />
                  </Link>
                  <Link
                    href="https://linkedin.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 bg-theme text-white rounded-full flex items-center justify-center hover:bg-title transition-all duration-300"
                    aria-label="LinkedIn"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
