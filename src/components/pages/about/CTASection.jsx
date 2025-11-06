"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 relative px-15 mt-10"
      style={{
        backgroundImage: "url('/img/bg/ctaBG1_1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative  rounded-3xl overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content */}
          <div className="relative z-10 p-8 sm:p-12 lg:p-16 order-2 lg:order-1 ">
            <h6 className="text-theme font-extrabold text-2xl  uppercase mb-5">
              WELCOME FRESHEAT
            </h6>
            <h3 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl  mb-5">
              TODAY SPACIAL FOOD
            </h3>
            <p className="text-theme2 text-2xl font-extrabold font-text-lg mb-10">
              limits Time Offer
            </p>
            <Link
              href="/menu"
              className="inline-block px-6 py-3 bg-theme text-white text-sm font-normal transition-all duration-300 hover:bg-theme2"
            >
              ORDER NOW <ArrowRight className="inline-block w-4 h-4 ml-2" />
            </Link>
          </div>

          {/* Image */}
          <div className="relative z-10 text-center order-1 lg:order-2 p-8 sm:p-12">
            <div className="animate-float-bob-x">
              <Image
                src="/img/cta/ctaThumb1_1.png"
                alt="CTA"
                width={500}
                height={500}
                className="w-full h-auto object-contain"
                unoptimized={true}
                priority={false}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
