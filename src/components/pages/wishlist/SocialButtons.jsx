"use client";
import { motion } from "framer-motion";
import Link from "next/link";
import { Facebook, Twitter, Mail, Clipboard, Share2, MessageCircle, Share } from "lucide-react";

export default function SocialButtons() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleClipboard = (e) => {
    e.preventDefault();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  const buttons = [
    {
      icon: Facebook,
      href: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`,
      label: "Facebook",
      external: true,
    },
    {
      icon: Twitter,
      href: `https://twitter.com/share?url=${encodeURIComponent(shareUrl)}`,
      label: "Twitter",
      external: true,
    },
    {
      icon: Share2,
      href: `http://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`,
      label: "Pinterest",
      external: true,
    },
    {
      icon: MessageCircle,
      href: `https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`,
      label: "WhatsApp",
      external: true,
    },
    {
      icon: Clipboard,
      label: "Copy Link",
      onClick: handleClipboard,
      href: "#",
      external: false,
    },
    {
      icon: Mail,
      href: `mailto:?body=${encodeURIComponent(shareUrl)}`,
      label: "Email",
      external: true,
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="social-buttons-wrapper rounded-xl p-6 bg-white/5 backdrop-blur-sm border border-white/10"
    >
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            className="w-12 h-12 bg-white rounded-xl flex items-center justify-center bg-white/10"
          >
            <Share className="w-6 h-6 text-white" />
          </motion.div>
          <span className="font-epilogue text-white text-lg font-black">
            Share Wishlist
          </span>
        </div>
        <ul className="flex gap-3 list-none p-0 m-0 flex-wrap">
          {buttons.map(({ icon: Icon, href, label, onClick, external }, index) => (
            <li key={index}>
              <motion.div whileHover={{ scale: 1.15, rotate: 5 }} whileTap={{ scale: 0.9 }}>
                {onClick ? (
                  <button
                    onClick={onClick}
                    className="text-white w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center border border-white group bg-transparent"
                    title={label}
                    aria-label={label}
                    type="button"
                  >
                    <Icon className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
                  </button>
                ) : (
                  <Link
                    href={href}
                    target={external ? "_blank" : undefined}
                    rel={external ? "noopener noreferrer" : undefined}
                    className="text-white w-12 h-12 rounded-full transition-all duration-300 flex items-center justify-center border border-white group"
                    title={label}
                    aria-label={label}
                  >
                    <Icon className="w-5 h-5 transform group-hover:scale-110 transition-transform duration-300" />
                  </Link>
                )}
              </motion.div>
            </li>
          ))}
        </ul>
      </div>
    </motion.div>
  );
}
