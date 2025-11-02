"use client";
import React from "react";

/**
 * BlogBanner Component
 * Displays the blog page banner with title and badges
 */
export default function BlogBanner() {
  const { backgroundImage, title, leftBadge, rightBadge } = {
    backgroundImage: "/images/img31.jpg",
    title: "BLOGS",
    leftBadge: "SALE OF 50%",
    rightBadge: "TRENDS FOR 2024",
  };

  return (
    <section
      className="relative min-h-[550px] mb-10 flex items-center justify-center overflow-hidden  max-lg:min-h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.5)_20%,_rgba(0,0,0,1)_100%)] z-[5] pointer-events-none"></div>

      {/* Right Badge */}
      <span className="block text-[18px] leading-[20px] text-white hidden lg:block absolute rotate-90 lg:right-[-40px] lg:top-1/2 tracking-[3px] [word-spacing:4px] uppercase z-20">
        {rightBadge}
      </span>

      {/* Title */}
      <h1
        className="
          relative text-[70px] font-bold mb-4 tracking-widest inline-block p-15 text-white z-20
          before:content-[''] before:absolute before:z-1
          before:left-15 before:top-2 before:right-15
          before:border-t-[9px] before:border-x-[9px] before:border-white before:border-solid
          before:h-[50px]
          after:content-[''] after:absolute after:z-1
          after:left-15 after:bottom-0 after:right-15
          after:border-b-[9px] after:border-x-[9px] after:border-white after:border-solid
          after:h-[50px]"
      >
        {title}
      </h1>

      {/* Left Badge */}
      <span className="block text-[18px] leading-[20px] text-white hidden lg:block rotate-90 absolute lg:left-[-40px] lg:top-1/2 tracking-[3px] [word-spacing:4px] uppercase z-20">
        {leftBadge}
      </span>
    </section>
  );
}
