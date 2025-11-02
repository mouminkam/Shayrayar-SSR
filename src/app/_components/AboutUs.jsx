"use client";
import { ArrowBigRight } from "lucide-react";
import Image from "next/image";

export default function CategoryBanner() {
  return (
    <section
      className="relative min-h-[450px] mb-10 flex items-center justify-center lg:mt-20 overflow-hidden bg-[#fbb247] max-lg:min-h-[500px] bg-cover bg-center"
      style={{ backgroundImage: `url(/images/img28.jpg)` }}
    >
      {/* 👇 طبقة التدرج الأسود */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(0,0,0,0)_0%,_rgba(0,0,0,0.5)_20%,_rgba(0,0,0,1)_100%)] z-[5] pointer-events-none"></div>

      {/* المحتوى */}
      <div className="absolute top-1/2 left-4 sm:left-6 md:left-10 lg:left-25 -translate-y-1/2 z-20 max-w-[90%] sm:max-w-[500px] md:max-w-[550px] lg:max-w-[600px] px-4 sm:px-0">
        <h3 className="text-white text-2xl sm:text-3xl md:text-4xl font-bold border-b-2 sm:border-b-3 md:border-b-4 border-white inline-block mb-4 sm:mb-5 md:mb-6">
          ABOUT US
        </h3>
        <p className="text-white text-lg sm:text-xl md:text-2xl font-bold mt-4 sm:mt-5 md:mt-6">
          MAGICAL WEAR
        </p>
        <p className="text-white text-sm sm:text-base md:text-md mt-4 sm:mt-5 md:mt-7 max-w-1/2 sm:max-w-[280px] md:max-w-[400px] leading-relaxed">
          Figma ipsum component variant main layer. Text pen select rectangle
          project star. Mask team export strikethrough rectangle. Text star mask
          bold pen plugin inspect prototype. Mask duplicate thumbnail auto group
          distribute link edit hand boolean. Bold flatten arrange arrow invite.
          Draft list draft slice.
        </p>
        <button className="flex items-center gap-2 group mt-5 text-white border-2 border-white rounded-full px-4 py-2 hover:scale-105 transition-all duration-300">
          read more{" "}
          <ArrowBigRight className="w-5 h-5 ml-2 text-white transition-transform duration-300 group-hover:translate-x-1" />
        </button>
      </div>

      {/* الصورة الجانبية */}
      <span className="block absolute bottom-0 -right-0 sm:-right-0 md:-right-16 lg:right-10 lg:bottom-0 sm:-bottom-0 md:-bottom-0  z-20">
        <Image
          src="/images/img26.png"
          alt="Trends for 2024"
          width={658}
          height={376}
          className="w-70 h-auto sm:w-100 sm:h-60 md:w-120 md:h-70 lg:w-[658px] lg:h-[376px] "
        />
      </span>

      {/* الشارات الجانبية */}
      <span className="block text-[18px] leading-[20px] text-white hidden lg:block absolute rotate-90 lg:right-[-40px] lg:top-1/2 tracking-[3px] [word-spacing:4px] uppercase  z-20">
        TRENDS FOR 2024
      </span>

      <span className="block text-[18px] leading-[20px] text-white hidden lg:block rotate-90 absolute lg:left-[-40px] lg:top-1/2 tracking-[3px] [word-spacing:4px] uppercase  z-20">
        SALE OF 50%
      </span>
    </section>
  );
}
