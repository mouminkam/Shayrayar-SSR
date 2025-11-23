"use client";
import Image from "next/image";
import Link from "next/link";
import { Facebook, Share2, Linkedin } from "lucide-react";
import { useState, useEffect } from "react";

export default function ChefeSection() {
  const chefs = [
    {
      name: "Ralph Edwards",
      role: "Chef Lead",
      image: "/img/chefe/chefeThumb1_1.png",
    },
    {
      name: "Leslie Alexander",
      role: "Chef Assistant",
      image: "/img/chefe/chefeThumb1_2.png",
    },
    {
      name: "Ronald Richards",
      role: "Chef Assistant",
      image: "/img/chefe/chefeThumb1_3.png",
    },
  ];

  const logos = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20,
  ];
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerView = 6; // عدد العناصر المعروضة في كل مرة

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => {
        // إذا وصلنا للنهاية، نعود للبداية بشكل سلس
        if (prevIndex >= logos.length - itemsPerView) {
          return 0;
        }
        return prevIndex + 1;
      });
    }, 3000); // كل 3 ثواني

    return () => clearInterval(interval);
  }, [logos.length, itemsPerView]);

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            {/* <Image
              src="/img/icon/titleIcon.svg"
              alt="icon"
              width={20}
              height={20}
            /> */}
            <span className="text-theme3  text-3xl font-bold uppercase">
              OUR CHEFE
            </span>
            {/* <Image
              src="/img/icon/titleIcon.svg"
              alt="icon"
              width={20}
              height={20}
            /> */}
          </div>
          <h2 className="text-white  text-3xl sm:text-4xl lg:text-5xl font-black">
            Meet Our Expert Chefe
          </h2>
        </div>

        {/* Chef Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-15 mb-12 lg:mb-16 px-10 ">
          {chefs.map((chef, index) => (
            <div key={index} className="relative text-center group ">
              <p className="text-white  text-base mb-2 sm:mb-5 sm:text-xl font-bold">
                {chef.role}
              </p>
              <div className="relative mb-5 rounded-3xl ">
                <Image
                  src={chef.image}
                  alt={chef.name}
                  width={400}
                  height={400}
                  className="w-full h-auto  object-cover transition-transform duration-300 group-hover:scale-110"
                  quality={85}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />
                {/* Social Icons */}
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Link
                    href="#"
                    className="w-10 h-10 bg-white text-theme rounded-full flex items-center justify-center hover:bg-theme hover:text-white transition-colors duration-300"
                  >
                    <Facebook className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 bg-white text-theme rounded-full flex items-center justify-center hover:bg-theme hover:text-white transition-colors duration-300"
                  >
                    <Share2 className="w-4 h-4" />
                  </Link>
                  <Link
                    href="#"
                    className="w-10 h-10 bg-white text-theme rounded-full flex items-center justify-center hover:bg-theme hover:text-white transition-colors duration-300"
                  >
                    <Linkedin className="w-4 h-4" />
                  </Link>
                </div>
              </div>
              <Link href="/chef-details">
                <h3 className="text-white  text-2xl font-bold mb-1 hover:text-theme transition-colors duration-300">
                  {chef.name}
                </h3>
              </Link>

            </div>
          ))}
        </div>

        {/* Client Logos Slider */}
        <div className="pt-8 ">
          <div className="relative overflow-hidden">
            <div className="marquee-wrapper">
              <div
                className="marquee-inner flex items-center gap-0 transition-transform duration-700 ease-in-out"
                style={{
                  transform: `translateX(-${currentIndex * (100 / itemsPerView)
                    }%)`,
                }}
              >
                {/* Duplicate logos for infinite seamless loop */}
                {[...logos, ...logos, ...logos].map((item, index) => (
                  <div
                    key={`logo-${index}`}
                    className="shrink-0 py-2 px-7 transition-opacity duration-300"
                    style={{ minWidth: `${100 / itemsPerView}%` }}
                  >
                    <Image
                      src={`/img/logo/clientLogoDark1_1.png`}
                      alt={`Client ${item}`}
                      width={120}
                      height={60}
                      className="w-auto h-25 mx-auto object-contain grayscale hover:grayscale-0 transition-all duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
