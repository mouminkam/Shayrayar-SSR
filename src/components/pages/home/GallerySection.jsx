"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";
import { Camera } from "lucide-react";

import "swiper/swiper-bundle.css";

export default function GallerySection() {
  const galleryItems = [
    { id: 1, image: "/img/gallery/galleryThumb1_5.jpg" },
    { id: 2, image: "/img/gallery/galleryThumb1_1.jpg" },
    { id: 3, image: "/img/gallery/galleryThumb1_2.jpg" },
    { id: 4, image: "/img/gallery/galleryThumb1_3.jpg" },
    { id: 5, image: "/img/gallery/galleryThumb1_4.jpg" },
    { id: 6, image: "/img/gallery/galleryThumb1_5.jpg" },
    { id: 7, image: "/img/gallery/galleryThumb1_1.jpg" },
    { id: 8, image: "/img/gallery/galleryThumb1_2.jpg" },
  ];

  return (
    <div className="gallery-section py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="gallery-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          <div className="slider-area">
            <Swiper
              modules={[Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              centeredSlides={true}
              autoplay={{
                delay: 2000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                575: {
                  slidesPerView: 2,
                },
                767: {
                  slidesPerView: 3,
                },
                992: {
                  slidesPerView: 4,
                },
              }}
              className="gallerySliderOne"
            >
              {galleryItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="gallery-thumb relative group overflow-hidden rounded-2xl">
                    <Link href="/menu">
                      <Image
                        src={item.image}
                        alt="gallery"
                        width={400}
                        height={300}
                        className="w-full h-64 object-cover transition-transform duration-300 group-hover:scale-110"
                        unoptimized={true}
                      />
                      <div className="icon absolute inset-0 bg-theme/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Camera className="w-12 h-12 text-white" />
                      </div>
                    </Link>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>
          </div>
        </div>
      </div>
    </div>
  );
}

