"use client";
import Image from "next/image";

export default function HeroBanner({
  title,
  backgroundImage = "/images/img04.jpg",
  leftBadge = "SALE OF 50%",
  rightBadge = "TRENDS FOR 2024",
}) {
  return (
    <section
      className="relative mt-0 min-h-[450px] flex items-center justify-center bg-fixed bg-cover bg-center bg-no-repeat py-[112px] px-0 overflow-visible"
      style={{ backgroundImage: `url(${backgroundImage})` }}
    >
      <div className="container mx-auto px-4">
        <div className="text-center text-white">
          <h1
            className="
              relative text-[70px] font-bold mb-4 tracking-widest inline-block p-15
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
        </div>
      </div>

      {/* Right Badge */}
      <span
        className="
    block text-[18px] leading-[20px] text-white
    absolute rotate-90
    lg:right-[-40px] lg:top-1/2
    max-lg:top-4 max-lg:right-auto max-lg:left-1/2 max-lg:translate-x-[-50%] max-lg:rotate-0 max-lg:mt-10
    tracking-[3px] [word-spacing:4px] uppercase mr-[10px] opacity-50
  "
      >
        {rightBadge}
      </span>

      {/* Left Badge */}
      <span
        className="
    block text-[18px] leading-[20px] text-white
    rotate-90 absolute
    lg:left-[-40px] lg:top-1/2
    max-lg:bottom-4 max-lg:left-1/2 max-lg:translate-x-[-50%] max-lg:top-auto max-lg:rotate-0 max-lg:mb-10
    tracking-[3px] [word-spacing:4px] uppercase ml-[10px] opacity-50
  "
      >
        {leftBadge}
      </span>
    </section>
  );
}
