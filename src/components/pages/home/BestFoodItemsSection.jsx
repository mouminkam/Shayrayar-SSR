"use client";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper/modules";
import Image from "next/image";
import Link from "next/link";

import "swiper/swiper-bundle.css";

export default function BestFoodItemsSection() {
  const foodItems = [
    {
      id: 1,
      title: "Chicken Pizza",
      description: "The registration fee",
      price: 26.99,
      image: "/img/food-items/item1_1.png",
    },
    {
      id: 2,
      title: "Egg and Cucumber",
      description: "The registration fee",
      price: 28.0,
      image: "/img/food-items/item1_2.png",
    },
    {
      id: 3,
      title: "Chicken Fried Rice",
      description: "The registration fee",
      price: 100.99,
      image: "/img/food-items/item1_3.png",
    },
    {
      id: 4,
      title: "Chicken Leg Piece",
      description: "The registration fee",
      price: 20.99,
      image: "/img/food-items/item1_4.png",
    },
    {
      id: 5,
      title: "Chicken Leg Piece",
      description: "The registration fee",
      price: 20.99,
      image: "/img/food-items/item1_4.png",
    },
    {
      id: 6,
      title: "Chicken Leg Piece",
      description: "The registration fee",
      price: 20.99,
      image: "/img/food-items/item1_4.png",
    },
  ];

  return (
    <section className="best-food-items-section fix section-padding bg-bg2 pb-12  relative overflow-hidden">
      <div className="best-food-wrapper">
        {/* Shapes */}
        <div className="shape1 float-bob-y hidden xxl:block absolute bottom-10 left-0 z-10">
          <Image
            src="/img/shape/bestFoodItemsShape1_1.png"
            alt="shape"
            width={100}
            height={100}
            unoptimized={true}
          />
        </div>
        <div className="shape2 float-bob-x hidden xxl:block absolute top-10 right-0 z-10">
          <Image
            src="/img/shape/bestFoodItemsShape1_2.png"
            alt="shape"
            width={100}
            height={100}
            unoptimized={true}
          />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 xl:px-12">
          {/* Title Area */}
          <div className="title-area text-center mb-12 lg:mb-16">
            <div className="sub-title text-theme2 font-epilogue text-base font-bold uppercase mb-4 flex items-center justify-center gap-2">
              <Image
                className="me-1"
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
                unoptimized={true}
              />
              Best Food
              <Image
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
                unoptimized={true}
              />
            </div>
            <h2 className="title text-title font-epilogue text-3xl sm:text-4xl lg:text-5xl font-black">
              Popular Food Items
            </h2>
          </div>

          {/* Slider Area */}
          <div className="slider-area mb-n40">
            <Swiper
              modules={[Pagination, Autoplay]}
              spaceBetween={30}
              slidesPerView={1}
              loop={true}
              speed={2000}
              autoplay={{
                delay: 3000,
                disableOnInteraction: false,
              }}
              breakpoints={{
                575: {
                  slidesPerView: 1,
                },
                767: {
                  slidesPerView: 3,
                },
                991: {
                  slidesPerView: 4,
                },
                1199: {
                  slidesPerView: 4,
                },
                1399: {
                  slidesPerView: 4,
                },
                1499: {
                  slidesPerView: 4,
                },
              }}
              pagination={{
                el: ".bestFoodItems-pagination",
                clickable: true,
              }}
              className="bestFoodItems-slider"
            >
              {foodItems.map((item) => (
                <SwiperSlide key={item.id}>
                  <div className="single-food-items bg-white rounded-2xl p-6 text-center mt-18 relative h-full min-h-[320px] sm:min-h-[340px] md:min-h-[360px] lg:min-h-[380px] flex flex-col">
                    <div className="relative flex justify-center items-center shrink-0 mb-4">
                      <Image
                        src={item.image}
                        alt="thumb"
                        width={150}
                        height={150}
                        className="w-32 h-32 sm:w-36 sm:h-36 object-cover rounded-full relative z-10"
                        unoptimized={true}
                      />
                      <div className="circle-shape absolute transform z-0">
                        <Image
                          src="/img/food-items/circleShape.png"
                          alt="shape"
                          width={150}
                          height={150}
                          className="w-34 h-34 sm:w-39 sm:h-39 animate-spin-slow"
                          unoptimized={true}
                        />
                      </div>
                    </div>
                    <div className="item-content mt-4 flex flex-col grow justify-between">
                      <div>
                        <Link href="/menu">
                          <h3 className="text-title font-epilogue text-lg sm:text-xl font-bold mb-2 hover:text-theme transition-colors duration-300 line-clamp-2">
                            {item.title}
                          </h3>
                        </Link>
                        <p className="text-text font-roboto text-sm sm:text-base mb-4 line-clamp-2">{item.description}</p>
                      </div>
                      <h6 className="text-theme font-epilogue text-base sm:text-lg font-bold mt-auto">${item.price.toFixed(2)}</h6>
                    </div>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Pagination */}
            <div className="bestFoodItems-pagination mt-12 flex justify-center"></div>
          </div>
        </div>
      </div>
    </section>
  );
}

