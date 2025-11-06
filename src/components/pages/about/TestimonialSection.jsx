"use client";
import Image from "next/image";
import Link from "next/link";
import MarqueeSection from "./MarqueeSection";

export default function TestimonialSection() {
  return (
    <section className="bg-bg3 relative overflow-hidden">
      {/* Testimonial Wrapper */}
      <div className="py-12 sm:py-16 md:py-20 lg:py-24 relative">
        {/* Shape - Background Image on Left */}
        <div className="absolute top-0 left-0 w-full lg:w-1/2 h-full z-0">
          <Image
            src="/img/testimonial/testimonialThumb1_1.png"
            alt="thumb"
            fill
            className="object-cover"
            priority={false}
            unoptimized={true}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-12">
            {/* Video Section - Left Side (xl-5) */}
            <div className="w-full lg:w-5/12 xl:w-5/12 flex items-center justify-center order-2 lg:order-1">
              <div className="flex items-center justify-center">
                <Link
                  href="https://www.youtube.com/watch?v=f2Gzr8sAGB8"
                  className="inline-block transition-transform duration-300 hover:scale-110"
                >
                  <Image
                    src="/img/shape/player.svg"
                    alt="icon"
                    width={80}
                    height={80}
                className="w-16 h-16 sm:w-40 sm:h-40 animate-rotate"
                  />
                </Link>
              </div>
            </div>

            {/* Content Section - Right Side (xl-7) */}
            <div className="w-full lg:w-7/12 xl:w-7/12 order-1 lg:order-2">
              {/* Title Area */}
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  <Image
                    src="/img/icon/titleIcon.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                  <span className="text-theme2 font-['Epilogue',sans-serif] text-sm sm:text-base font-bold uppercase">
                    Testimonials
                  </span>
                  <Image
                    src="/img/icon/titleIcon.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  />
                </div>
                <h2 className="text-white font-['Epilogue',sans-serif] text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center">
                  What our Clients Say
                </h2>
              </div>

              {/* Slider Area - Testimonial Card */}
              <div>
                <div className="bg-white rounded-2xl p-6 sm:p-8 md:p-10 lg:p-12 border-t-4 border-theme2 shadow-lg">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-5 mb-6 relative">
                    {/* Profile Image */}
                    <div className="shrink-0">
                      <Image
                        src="/img/shape/testimonialProfile1_1.png"
                        alt="thumb"
                        width={70}
                        height={70}
                        className="rounded-full w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 object-cover"
                      />
                    </div>

                    {/* User Info */}
                    <div className="flex-1">
                      <h6 className="text-title font-['Epilogue',sans-serif] text-lg sm:text-xl md:text-2xl font-bold mb-1">
                        Albert Flores
                      </h6>
                      <p className="text-text font-['Roboto',sans-serif] text-sm sm:text-base mb-2">
                        Web Designer
                      </p>
                      <div className="mt-2">
                        <Image
                          src="/img/icon/star.svg"
                          alt="icon"
                          width={100}
                          height={20}
                          className="w-auto h-3 sm:h-4"
                        />
                      </div>
                    </div>

                    {/* Quote Icon */}
                    <div className="absolute top-0 right-0">
                      <Image
                        src="/img/icon/quote.svg"
                        alt="icon"
                        width={40}
                        height={40}
                        className="w-8 h-8 sm:w-10 sm:h-10"
                      />
                    </div>
                  </div>
                  <p className="text-text font-['Roboto',sans-serif] text-base sm:text-lg md:text-xl lg:text-2xl leading-relaxed">
                    Penatibus magnis dis point parturient montes nascetur
                    ridiculus mus Ut id lorem ac enim the vestibulum blandit nec
                    sit amet felis. Fusce quis diam odio Cras mattis mi quis
                    tincidunt
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Marquee Section */}
      <div className="py-8 sm:py-10 lg:py-12">
        <MarqueeSection />
      </div>
    </section>
  );
}
