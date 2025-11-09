"use client";
import Link from "next/link";
import { Facebook, Twitter, Mail, Clipboard, Share2, MessageCircle, Share } from "lucide-react";

export default function SocialButtons() {
  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  const handleClipboard = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(shareUrl);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div className="social-buttons-wrapper  rounded-xl p-6 ">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-theme/10 rounded-lg flex items-center justify-center">
            <Share className="w-5 h-5 text-theme" />
          </div>
          <span className="font-epilogue text-title text-lg font-bold">
            Share Wishlist
          </span>
        </div>
        <ul className="flex gap-2 list-none p-0 m-0 flex-wrap">
          <li>
            <Link
              href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-theme text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-theme2 hover:scale-110 flex items-center justify-center shadow-md hover:shadow-lg"
              title="Facebook"
              aria-label="Share on Facebook"
            >
              <Facebook className="w-5 h-5" />
            </Link>
          </li>
          <li>
            <Link
              href={`https://twitter.com/share?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-theme text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-theme2 hover:scale-110 flex items-center justify-center shadow-md hover:shadow-lg"
              title="Twitter"
              aria-label="Share on Twitter"
            >
              <Twitter className="w-5 h-5" />
            </Link>
          </li>
          <li>
            <Link
              href={`http://pinterest.com/pin/create/button/?url=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-theme text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-theme2 hover:scale-110 flex items-center justify-center shadow-md hover:shadow-lg"
              title="Pinterest"
              aria-label="Share on Pinterest"
            >
              <Share2 className="w-5 h-5" />
            </Link>
          </li>
          <li>
            <Link
              href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareUrl)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="bg-theme text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-theme2 hover:scale-110 flex items-center justify-center shadow-md hover:shadow-lg"
              title="WhatsApp"
              aria-label="Share on WhatsApp"
            >
              <MessageCircle className="w-5 h-5" />
            </Link>
          </li>
          <li>
            <button
              onClick={handleClipboard}
              className="bg-theme text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-theme2 hover:scale-110 flex items-center justify-center border-none cursor-pointer shadow-md hover:shadow-lg"
              title="Copy Link"
              aria-label="Copy link to clipboard"
            >
              <Clipboard className="w-5 h-5" />
            </button>
          </li>
          <li>
            <Link
              href={`mailto:?body=${encodeURIComponent(shareUrl)}`}
              className="bg-theme text-white w-10 h-10 rounded-full transition-all duration-300 hover:bg-theme2 hover:scale-110 flex items-center justify-center shadow-md hover:shadow-lg"
              title="Email"
              aria-label="Share via Email"
            >
              <Mail className="w-5 h-5" />
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
