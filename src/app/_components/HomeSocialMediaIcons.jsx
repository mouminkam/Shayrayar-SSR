"use client";
import { Twitter, Facebook, Youtube } from "lucide-react";
import { FaPinterest } from "react-icons/fa";

export default function SocialMediaIcons({
  variant = "default",
  size = "md",
  className = "",
  showLabels = false,
}) {
  // Size variants
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  // Color variants
  const colorClasses = {
    default: "bg-gray-500 hover:bg-gray-600",
    light: "bg-gray-50 border-2 border-gray-600 text-gray-700 hover:bg-gray-200",
    dark: "bg-gray-900 hover:bg-gray-800",
  };

  const iconSize = {  
    sm: 16,
    md: 20,
    lg: 24,
  };

  const socialLinks = [
    {
      name: "pinterest",
      label: "Pinterest",
      icon: <FaPinterest className="text-white" size={iconSize[size]} />,
      href: "#",
    },
    {
      name: "twitter",
      label: "Twitter",
      icon: <Twitter className="text-white" size={iconSize[size]} />,
      href: "#",
    },
    {
      name: "facebook",
      label: "Facebook",
      icon: <Facebook className="text-white" size={iconSize[size]} />,
      href: "#",
    },
    {
      name: "google-plus",
      label: "Google Plus",
      icon: <Youtube className="text-white" size={iconSize[size]} />,
      href: "#",
    },
  ];

  return (
    <ul className={`social-network flex flex-col gap-5 space-x-4 ${className}`}>
      {socialLinks.map((social) => (
        <li key={social.name}>
          <a
            href={social.href}
            aria-label={social.label}
            className={`${sizeClasses[size]} ${colorClasses[variant]} rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-250`}
          >
            {social.icon}
            {showLabels && (
              <span className="ml-2 text-sm">{social.label}</span>
            )}
          </a>
        </li>
      ))}
    </ul>
  );
}

