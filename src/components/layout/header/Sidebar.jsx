"use client";
import Image from "next/image";
import Link from "next/link";
import { X, MapPin, Mail, Clock, Phone, ShoppingCart, Facebook, Twitter, Youtube, Linkedin } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import BranchSelector from "./BranchSelector";

export default function Sidebar({ isOpen, setIsOpen }) {
  const navItems = [
    { href: "/", label: "Home" },
    { href: "/shop", label: "Shop" },
    // { href: "/blog", label: "Blog" }, // Blog section temporarily disabled
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
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm z-9998"
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />

          {/* Sidebar */}
          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3, easeInOut: [0.25, 0.1, 0.25, 1] }}
            className="fix-area fixed right-0 top-0 h-full w-full max-w-md bg-bgimg z-9999 shadow-2xl overflow-y-auto"
          >
            <div className="offcanvas__info h-full">
              <div className="offcanvas__wrapper h-full">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ staggerChildren: 0.1, delayChildren: 0.1 }}
                  className="offcanvas__content p-6"
                >
                  {/* Top Section - Logo and Close Button */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1, duration: 0.4, ease: "easeOut" }}
                    className="offcanvas__top mb-5 flex mx-2 justify-between items-center"
                  >
                    <div className="offcanvas__logo">
                      <Link href="/" onClick={() => setIsOpen(false)}>
                        <Image
                          src="/img/logo/mainlogo.png"
                          alt="logo"
                          width={150}
                          height={60}
                          className="h-25 w-auto object-contain"
                          unoptimized={true}
                        />
                      </Link>
                    </div>
                    <div className="offcanvas__close ">
                      <motion.button
                        onClick={() => setIsOpen(false)}
                        className="w-10 h-10 bg-theme3 text-white rounded-full flex items-center justify-center hover:bg-theme cursor-pointer"
                        aria-label="Close sidebar"
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <X className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </motion.div>

                  {/* Branch Selector - Mobile & Tablet */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                    className="mb-6 lg:hidden"
                  >
                    <h4 className="text-white font-['Epilogue',sans-serif] text-lg font-semibold mb-3">
                      Select Branch
                    </h4>
                    <div className="relative">
                      <BranchSelector isMobile={true} />
                    </div>
                  </motion.div>

                  {/* Description Text - يظهر فقط على الشاشات الكبيرة */}
                  <motion.p
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2, duration: 0.4, ease: "easeOut" }}
                    className="text text-white font-['Roboto',sans-serif] text-base font-normal leading-relaxed mb-6 hidden lg:block"
                  >
                    This involves interactions between a business and its customers. It&apos;s about meeting
                    customers&apos; needs and resolving their problems. Effective customer service is crucial.
                  </motion.p>

                  {/* Gallery Area - يظهر فقط على الشاشات XL */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3, duration: 0.4, ease: "easeOut" }}
                    className="offcanvas-gallery-area hidden xl:block mb-6"
                  >
                    <div className="offcanvas-gallery-items grid grid-cols-3 gap-2 mb-2">
                      {galleryImages.slice(0, 3).map((image, index) => (
                        <Link
                          key={index}
                          href={image}
                          className="offcanvas-image block aspect-square overflow-hidden rounded-lg group"
                        >
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Image
                              src={image}
                              alt={`gallery-img-${index + 1}`}
                              width={120}
                              height={120}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          </motion.div>
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
                          <motion.div
                            whileHover={{ scale: 1.1 }}
                            transition={{ duration: 0.3 }}
                          >
                            <Image
                              src={image}
                              alt={`gallery-img-${index + 4}`}
                              width={120}
                              height={120}
                              className="w-full h-full object-cover"
                              unoptimized={true}
                            />
                          </motion.div>
                        </Link>
                      ))}
                    </div>
                  </motion.div>

                  {/* Mobile Menu - Navigation للأجهزة الصغيرة */}
                  <div className="mobile-menu fix mb-6 lg:hidden">
                    <nav>
                      <ul className="flex flex-col  gap-5 py-4 ">
                        {navItems.map((item, index) => (
                          <motion.li
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.3 + index * 0.05, duration: 0.4, ease: "easeOut" }}
                          >
                            <Link
                              href={item.href}
                              onClick={() => setIsOpen(false)}
                              className="block text-white font-['Roboto',sans-serif] text-lg font-normal hover:text-theme3 transition-colors duration-300 py-2"
                            >
                              {item.label}
                            </Link>
                          </motion.li>
                        ))}
                      </ul>
                    </nav>
                  </div>

                  {/* Contact Info Section */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.6, duration: 0.4, ease: "easeOut" }}
                    className="offcanvas__contact"
                  >
                    <h4 className="text-white font-['Epilogue',sans-serif] text-2xl font-bold mb-6">
                      Contact Info
                    </h4>
                    <ul className="space-y-4 mb-12">
                      {/* Location */}
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7, duration: 0.4, ease: "easeOut" }}
                        className="flex items-center gap-4"
                      >
                        <div className="offcanvas__contact-icon shrink-0">
                          <MapPin className="w-5 h-5 text-theme3" />
                        </div>
                        <div className="offcanvas__contact-text">
                          <Link
                            href="#"
                            target="_blank"
                            className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme3 transition-colors duration-300"
                          >
                            Main Street, Melbourne, Australia
                          </Link>
                        </div>
                      </motion.li>

                      {/* Email */}
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.75, duration: 0.4, ease: "easeOut" }}
                        className="flex items-center gap-4"
                      >
                        <div className="offcanvas__contact-icon shrink-0">
                          <Mail className="w-5 h-5 text-theme3" />
                        </div>
                        <div className="offcanvas__contact-text">
                          <Link
                            href="mailto:info@fresheat.com"
                            className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme3 transition-colors duration-300"
                          >
                            info@fresheat.com
                          </Link>
                        </div>
                      </motion.li>

                      {/* Hours */}
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8, duration: 0.4, ease: "easeOut" }}
                        className="flex items-center gap-4"
                      >
                        <div className="offcanvas__contact-icon shrink-0">
                          <Clock className="w-5 h-5 text-theme3" />
                        </div>
                        <div className="offcanvas__contact-text">
                          <Link
                            href="#"
                            target="_blank"
                            className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme3 transition-colors duration-300"
                          >
                            Mod-friday, 09am -05pm
                          </Link>
                        </div>
                      </motion.li>

                      {/* Phone */}
                      <motion.li
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.85, duration: 0.4, ease: "easeOut" }}
                        className="flex items-center gap-4"
                      >
                        <div className="offcanvas__contact-icon shrink-0">
                          <Phone className="w-5 h-5 text-theme3" />
                        </div>
                        <div className="offcanvas__contact-text">
                          <Link
                            href="tel:+11002345909"
                            className="text-text font-['Roboto',sans-serif] text-base font-normal hover:text-theme3 transition-colors duration-300"
                          >
                            +11002345909
                          </Link>
                        </div>
                      </motion.li>
                    </ul>

                    {/* ORDER NOW Button */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9, duration: 0.4, ease: "easeOut" }}
                      className="header-button  mb-12"
                    >
                      <Link
                        href="/shop"
                        onClick={() => setIsOpen(false)}
                        className="theme-btn px-6 py-3 bg-theme3 text-white font-['Roboto',sans-serif] text-sm font-normal hover:bg-theme transition-colors duration-300 rounded-md flex items-center justify-center gap-2 shadow-lg"
                      >
                        <ShoppingCart className="w-4 h-4" />
                        <span>ORDER NOW</span>
                      </Link>
                    </motion.div>

                    {/* Social Icons */}
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 1.0, duration: 0.4, ease: "easeOut" }}
                      className="social-icon flex items-center justify-center gap-6"
                    >
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href="https://facebook.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-theme3 text-white rounded-full flex items-center justify-center hover:bg-theme transition-colors duration-300"
                          aria-label="Facebook"
                        >
                          <Facebook className="w-4 h-4" />
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href="https://twitter.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-theme3 text-white rounded-full flex items-center justify-center hover:bg-theme transition-colors duration-300"
                          aria-label="Twitter"
                        >
                          <Twitter className="w-4 h-4" />
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href="https://youtube.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-theme3 text-white rounded-full flex items-center justify-center hover:bg-theme transition-colors duration-300"
                          aria-label="YouTube"
                        >
                          <Youtube className="w-4 h-4" />
                        </Link>
                      </motion.div>
                      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
                        <Link
                          href="https://linkedin.com"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-9 h-9 bg-theme3 text-white rounded-full flex items-center justify-center hover:bg-theme transition-colors duration-300"
                          aria-label="LinkedIn"
                        >
                          <Linkedin className="w-4 h-4" />
                        </Link>
                      </motion.div>
                    </motion.div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
