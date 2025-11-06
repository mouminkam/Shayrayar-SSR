"use client";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, Mail, Clock, Phone } from "lucide-react";

export default function Sidebar({ isOpen, setIsOpen }) {
  if (!isOpen) return null;

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/about", label: "AboutUs" },
    { href: "/shop", label: "Shop" },
    { href: "/pages", label: "Pages" },
    { href: "/blog", label: "Blog" },
    { href: "/contact", label: "ContactUs" },
  ];

  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/70 z-[9998] transition-opacity duration-300"
        onClick={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[9999] shadow-2xl transform transition-all duration-300 ease-in-out overflow-y-auto border-l-2 border-orange-500">
        {/* Header with Logo and Close Button */}
        <div className="p-6">
          <div className="flex justify-between">
            {/* Logo Section */}
            <div className="mb-3">
              <div className="px-5">
                <Image
                  src="/img/logo/logo.svg"
                  alt="logo"
                  width={100}
                  height={100}
                  className="w-full h-full object-contain"
                />
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="ml-4 w-10 h-10 bg-red-600 rounded-full flex items-center justify-center hover:bg-red-700 transition-colors shrink-0"
              aria-label="Close sidebar"
            >
              <X className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {/* Description Text */}
          <p className="text-gray-700 text-sm leading-relaxed mb-6">
            This involves interactions between a business and its customers.
            It's about meeting customers needs and resolving their problems.
            Effective customer service is crucial.
          </p>

          {/* Navigation Links - للأجهزة المتوسطة والصغيرة */}
          <div className="lg:hidden mb-8">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Navigation</h2>
            <nav>
              <ul className="space-y-3">
                {navItems.map((item, index) => (
                  <li key={index}>
                    <Link
                      href={item.href}
                      onClick={() => setIsOpen(false)}
                      className="block text-gray-700 hover:text-orange-500 transition-colors cursor-pointer py-2"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Image Grid (2x3) - للشاشات الكبيرة فقط */}
          <div className="hidden lg:grid grid-cols-3 gap-4 mb-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <div
                key={index}
                className="aspect-square bg-gray-200 rounded-lg flex items-center justify-center"
              >
                <span className="text-gray-500 text-xs">120X120</span>
              </div>
            ))}
          </div>

          {/* Contact Info Section */}
          <div>
            <h2 className="text-lg font-bold text-gray-900 mb-4">
              Contact Info
            </h2>
            <div className="space-y-4">
              {/* Location */}
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-gray-700 text-sm">
                  Main Street, Melbourne, Australia
                </p>
              </div>

              {/* Email */}
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-gray-700 text-sm">info@fresheat.com</p>
              </div>

              {/* Hours */}
              <div className="flex items-start gap-3">
                <Clock className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-gray-700 text-sm">Mod-Friday, 09am -05pm</p>
              </div>

              {/* Phone */}
              <div className="flex items-start gap-3">
                <Phone className="w-5 h-5 text-red-600 mt-0.5 shrink-0" />
                <p className="text-gray-700 text-sm">+11002345909</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

