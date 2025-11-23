"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import MarqueeSection from "./MarqueeSection";

import "swiper/swiper-bundle.css";

export default function TestimonialSection() {
  const testimonials = [
    {
      id: 1,
      name: "Albert Flores",
      role: "Web Designer",
      image: "/img/shape/testimonialProfile1_1.png",
      rating: "/img/icon/star.svg",
      text: "Penatibus magnis dis point parturient montes nascetur ridiculus mus Ut id lorem ac enim the vestibulum blandit nec sit amet felis. Fusce quis diam odio Cras mattis mi quis tincidunt",
    },
    {
      id: 2,
      name: "Sarah Johnson",
      role: "Marketing Manager",
      image: "/img/shape/testimonialProfile1_1.png",
      rating: "/img/icon/star.svg",
      text: "Excellent service and amazing food quality! The team is professional and always delivers on time. Highly recommended for anyone looking for great food.",
    },
    {
      id: 3,
      name: "Michael Chen",
      role: "Business Owner",
      image: "/img/shape/testimonialProfile1_1.png",
      rating: "/img/icon/star.svg",
      text: "Outstanding experience from start to finish. The food is fresh, delicious, and the customer service is top-notch. Will definitely order again!",
    },
    {
      id: 4,
      name: "Emily Davis",
      role: "Food Blogger",
      image: "/img/shape/testimonialProfile1_1.png",
      rating: "/img/icon/star.svg",
      text: "I've tried many restaurants, but this one stands out. The flavors are incredible and the presentation is beautiful. A true culinary delight!",
    },
  ];
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
            quality={85}
            loading="lazy"
            sizes="(max-width: 1024px) 100vw, 50vw"
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
                    className="w-26 h-26 sm:w-40 sm:h-40 animate-rotate"
                  />
                </Link>
              </div>
            </div>

            {/* Content Section - Right Side (xl-7) */}
            <div className="w-full lg:w-7/12 xl:w-7/12 order-1 lg:order-2">
              {/* Title Area */}
              <div className="mb-8 sm:mb-10 lg:mb-12">
                <div className="flex items-center justify-center gap-2 mb-4">
                  {/* <Image
                    src="/img/icon/titleIcon.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  /> */}
                  <span className="text-theme3  text-2xl font-bold uppercase">
                    Testimonials
                  </span>
                  {/* <Image
                    src="/img/icon/titleIcon.svg"
                    alt="icon"
                    width={20}
                    height={20}
                    className="w-4 h-4 sm:w-5 sm:h-5"
                  /> */}
                </div>
                <h2 className="text-white  text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-center">
                  What our Clients Say
                </h2>
              </div>

              {/* Slider Area - Testimonial Cards */}
              <div className="slider-area">
                <Swiper
                  modules={[Autoplay]}
                  spaceBetween={30}
                  slidesPerView={1}
                  loop={true}
                  autoplay={{
                    delay: 3000,
                    disableOnInteraction: false,
                  }}
                  className="testimonialSlider"
                >
                  {testimonials.map((testimonial) => (
                    <SwiperSlide key={testimonial.id}>
                      <div className="bg-white rounded-2xl p-4 sm:p-5 md:p-6 border-t-4 border-theme2 shadow-lg h-[250px] md:h-[250px] lg:h-[250px] flex flex-col overflow-hidden">
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-3 sm:mb-4 relative shrink-0">
                          {/* Profile Image */}
                          <div className="shrink-0">
                            <Image
                              src={testimonial.image}
                              alt={testimonial.name}
                              width={70}
                              height={70}
                              className="rounded-full w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 object-cover"
                              quality={80}
                              loading="lazy"
                              sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                            />
                          </div>

                          {/* User Info */}
                          <div className="flex-1 min-w-0">
                            <h6 className="text-title  text-base sm:text-lg md:text-xl font-bold mb-0.5 truncate">
                              {testimonial.name}
                            </h6>
                            <p className="text-text  text-xs sm:text-sm mb-1.5 truncate">
                              {testimonial.role}
                            </p>
                            <div className="mt-1">
                              <Image
                                src={testimonial.rating}
                                alt="rating"
                                width={100}
                                height={20}
                                className="w-auto h-2.5 sm:h-3"
                                unoptimized={true}
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
                              className="w-6 h-6 sm:w-7 sm:h-7"
                              unoptimized={true}
                            />
                          </div>
                        </div>
                        <div className="flex-1 overflow-y-auto pr-1">
                          <p className="text-text  text-sm sm:text-base md:text-lg leading-relaxed">
                            {testimonial.text}
                          </p>
                        </div>
                      </div>
                    </SwiperSlide>
                  ))}
                </Swiper>
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
