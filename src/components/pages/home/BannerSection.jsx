"use client";
import { useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay, EffectFade } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import "swiper/swiper-bundle.css";

export default function BannerSection() {
  const swiperRef = useRef(null);
  const slides = [
    {
      id: 1,
      subtitle: "WELCOME FRESHEAT",
      title: "SPICY FRIED CHICKEN",
      image: "/img/banner/bannerThumb1_1.png",
      bgImage: "/img/bg/bannerBG1_1.jpg",
      link: "/menu",
      shape4Float: false,
    },
    {
      id: 2,
      subtitle: "WELCOME FRESHEAT",
      title: "Chicago Deep Pizza King",
      image: "/img/banner/bannerThumb1_2.png",
      bgImage: "/img/bg/bannerBG1_1.jpg",
      link: "/menu",
      shape4Float: true,
    },
    {
      id: 3,
      subtitle: "WELCOME FRESHEAT",
      title: "Chicago Deep Burger King",
      image: "/img/banner/bannerThumb1_3.png",
      bgImage: "/img/bg/bannerBG1_1.jpg",
      link: "/menu",
      shape4Float: false,
    },
  ];

  return (
    <section className="banner-section fix mb-8">
      <div className="slider-area">
        <Swiper
          modules={[Navigation, Pagination, Autoplay, EffectFade]}
          spaceBetween={0}
          slidesPerView={1}
          loop={true}
          effect="fade"
          speed={4000}
          autoplay={{
            delay: 5000,
            disableOnInteraction: false,
          }}
          navigation={{
            nextEl: ".arrow-next",
            prevEl: ".arrow-prev",
          }}
          pagination={{
            el: ".pagination-class",
            clickable: true,
            renderBullet: function (index, className) {
              return `<span class="${className}">${index + 1}</span>`;
            },
          }}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          className="banner-slider"
        >
          {slides.map((slide) => (
            <SwiperSlide key={slide.id}>
              <div
                className="banner-wrapper style1 bg-img relative bg-cover bg-center min-h-[600px] lg:min-h-[800px]"
                style={{ backgroundImage: `url(${slide.bgImage})` }}
              >
                {/* Shapes */}
                <div className="shape1_1 hidden xxl:block">
                  <Image
                    src="/img/shape/bannerShape1_1.svg"
                    alt="shape"
                    width={100}
                    height={100}
                    unoptimized={true}
                  />
                </div>
                <div className="shape1_2 hidden xxl:block">
                  <Image
                    src="/img/shape/bannerShape1_2.svg"
                    alt="shape"
                    width={80}
                    height={80}
                    unoptimized={true}
                  />
                </div>
                <div className="shape1_3 hidden xxl:block">
                  <Image
                    src="/img/shape/bannerShape1_3.svg"
                    alt="shape"
                    width={120}
                    height={120}
                    unoptimized={true}
                  />
                </div>
                <div className={`shape1_4 hidden xxl:block ${slide.shape4Float ? "float-bob-x" : ""}`}>
                  <Image
                    src="/img/shape/bannerShape1_4.svg"
                    alt="shape"
                    width={90}
                    height={90}
                    unoptimized={true}
                  />
                </div>
                <div className="shape1_5 hidden xxl:block">
                  <Image
                    src="/img/shape/bannerShape1_5.svg"
                    alt="shape"
                    width={70}
                    height={70}
                    unoptimized={true}
                  />
                </div>
                <div className="shape1_6 hidden xxl:block cir36">
                  <Image
                    src="/img/shape/bannerShape1_6.svg"
                    alt="shape"
                    width={100}
                    height={100}
                    unoptimized={true}
                  />
                </div>

                {/* Overlay */}
                <div className="overlay absolute inset-0 bg-title opacity-30"></div>

                {/* Content */}
                <div className="banner-container relative z-50 py-12 sm:py-16 md:py-20 lg:py-32 xl:py-40 mt-18 sm:mt-20 md:mt-0 lg:mt-0">
                  <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12 items-center">
                      {/* Image - Right Side (Top on Mobile/Tablet) */}
                      <div className="col-span-1 lg:col-span-1 order-1 lg:order-2 flex justify-center lg:justify-end items-center">
                        <div className="banner-thumb-area relative z-50 w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl 2xl:max-w-2xl">
                          <Image
                            src={slide.image}
                            alt="banner"
                            width={600}
                            height={600}
                            className="w-full h-auto object-contain"
                            unoptimized={true}
                            priority={true}
                          />
                        </div>
                      </div>
                      {/* Text Content - Left Side (Bottom on Mobile/Tablet) */}
                      <div className="col-span-1 lg:col-span-1 order-2 lg:order-1 mt-15 sm:mt-0 w-full lg:w-auto">
                        <div className="banner-title-area w-full lg:w-auto">
                          <div className="banner-style1 w-full lg:w-auto">
                            <div className="section-title text-center lg:text-left w-full lg:w-auto">
                              <h6 className="sub-title text-theme2 font-epilogue text-sm sm:text-2xl font-extrabold uppercase mb-3 sm:mb-1">
                                {slide.subtitle}
                              </h6>
                              <h1 className="title text-white font-epilogue text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-8xl font-black leading-tight mb-4 sm:mb-6">
                                {slide.title}
                              </h1>
                              <div className="flex justify-center lg:justify-start">
                                <Link
                                  className="theme-btn px-6 py-2.5 sm:px-8 sm:py-3 bg-theme text-white font-roboto text-sm sm:text-base font-medium hover:bg-theme2 transition-all duration-300 rounded-xl shadow-md hover:shadow-lg inline-flex items-center justify-center gap-2"
                                  href={slide.link}
                                >
                                  ORDER NOW
                                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

      </div>
    </section>
  );
}

