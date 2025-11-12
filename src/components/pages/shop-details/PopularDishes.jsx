"use client";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBasket, Eye } from "lucide-react";

export default function PopularDishes() {
  const dishes = [
    {
      id: 1,
      title: "Chicken Fried Rice",
      image: "/img/dishes/dishes1_1.png",
      description: "The registration fee",
      price: 100.99,
    },
    {
      id: 2,
      title: "Chinese Pasta",
      image: "/img/dishes/dishes1_2.png",
      description: "The registration fee",
      price: 15.99,
    },
    {
      id: 3,
      title: "Chicken Pizza",
      image: "/img/dishes/dishes1_3.png",
      description: "The registration fee",
      price: 26.99,
    },
    {
      id: 4,
      title: "Chicken Noodles",
      image: "/img/dishes/dishes1_4.png",
      description: "The registration fee",
      price: 39.0,
    },
    {
      id: 5,
      title: "Grilled Chicken",
      image: "/img/dishes/dishes1_5.png",
      description: "The registration fee",
      price: 20.99,
    },
  ];

  return (
    <section className="popular-dishes-section py-0 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="popular-dishes-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="title-area mb-12 sm:mb-14">
            <div className="sub-title text-center text-theme3 font-['Epilogue',sans-serif] text-2xl font-bold uppercase mb-4 flex items-center justify-center gap-2">
              {/* <Image
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
                className="w-5 h-5"
                unoptimized={true}
              /> */}
              POPULAR DISHES
              {/* <Image
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
                className="w-5 h-5"
                unoptimized={true}
              /> */}
            </div>
            <div className="title text-center text-white font-['Epilogue',sans-serif] text-3xl sm:text-5xl font-black capitalize">
              Best selling Dishes
            </div>
          </div>

          <div className="dishes-card-wrap style1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8 cursor-pointer">
            {dishes.map((dish) => (
              <div
                key={dish.id}
                className="dishes-card style1 group relative p-6 rounded-2xl mt-8 border-2 border-bgimg text-center transition-all duration-300 hover:shadow-xl hover:-translate-y-2 overflow-hidden"
              >
                {/* Background Image Overlay */}
                <div className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0 bg-[url('/img/bg/dishesThumbBG.png')]" />
                <span className="w-8 h-8 absolute top-5 right-5 flex items-center justify-center bg-theme text-white rounded-full hover:bg-theme2 transition-all duration-300 cursor-pointer">
                  <Link href="#">
                    <Heart className="w-4 h-4" />
                  </Link>
                </span>
                <ul className="mt-2 opacity-0 absolute top-12 z-20 right-5 invisible translate-y-24 group-hover:opacity-100 group-hover:visible group-hover:translate-y-2 transition-all duration-300">
                  <li className="mb-2">
                    <Link
                      href="/cart"
                      className="w-8 h-8 flex items-center justify-center bg-white text-title rounded-full hover:bg-theme hover:text-white transition-all duration-300"
                    >
                      <ShoppingBasket className="w-4 h-4" />
                    </Link>
                  </li>
                  <li>
                    <Link
                      href="#"
                      className="w-8 h-8 flex items-center justify-center bg-white text-title rounded-full hover:bg-theme hover:text-white transition-all duration-300"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                  </li>
                </ul>
                {/* Content */}
                <div className="relative z-10">
                  <div className="social-profile absolute right-4 top-4 z-20">
                  </div>

                  <div className="dishes-thumb mb-8 mt-5 flex items-center justify-center">
                    <Image
                      src={dish.image}
                      alt={dish.title}
                      width={200}
                      height={200}
                      className="w-40h-auto object-contain"
                      unoptimized={true}
                    />
                  </div>

                  <Link href="/menu">
                    <h3 className="text-theme3  font-['Epilogue',sans-serif] text-xl font-bold mb-4 transition-colors duration-300">
                      {dish.title}
                    </h3>
                  </Link>
                  <p className="text-text  text-center font-['Roboto',sans-serif] text-base font-normal mb-4 transition-colors duration-300">
                    {dish.description}
                  </p>
                  <h6 className="text-theme  text-center font-['Epilogue',sans-serif] text-lg font-bold transition-colors duration-300">
                    ${dish.price}
                  </h6>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

