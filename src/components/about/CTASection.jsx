// Removed "use client" - This component only uses static JSX, Image, and Link components which are SSR-compatible
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function CTASection() {
  return (
    <section
      className="py-12 sm:py-16 md:py-20 lg:py-24 relative px-4 sm:px-6 lg:px-15 mt-10"
      style={{
        backgroundImage: "url('/img/bg/ctaBG1_1.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="relative rounded-3xl ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-12 items-center">
          {/* Image - Top on Mobile/Tablet */}
          <div className="relative z-10 order-1 lg:order-2 w-full lg:w-auto  lg:py-12">
            <div className="animate-float-bob-x">
              <Image
                src="/img/cta/ctaThumb1_1.png"
                alt="CTA"
                width={500}
                height={500}
                className="w-full h-auto object-contain"
                quality={85}
                loading="lazy"
                sizes="(max-width: 1024px) 100vw, 500px"
              />
            </div>
          </div>

          {/* Content - Bottom on Mobile/Tablet */}
          <div className="relative z-10 order-2 lg:order-1 p-8 sm:p-12 lg:p-16 text-center lg:text-left w-full">
            <h6 className="text-theme font-extrabold text-2xl uppercase mb-5">
              WELCOME FRESHEAT
            </h6>
            <h3 className="text-white font-extrabold text-3xl sm:text-4xl lg:text-5xl mb-5">
              TODAY SPACIAL FOOD
            </h3>
            <p className="text-theme2 text-2xl font-extrabold font-text-lg mb-10">
              limits Time Offer
            </p>
            <div className="flex justify-center lg:justify-start">
              <Link
                href="/shop"
                className="inline-flex items-center px-6 py-3 bg-theme3 text-white text-sm font-normal transition-all duration-300 hover:bg-theme rounded-xl"
              >
                ORDER NOW <ArrowRight className="inline-block w-4 h-4 ml-2" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
