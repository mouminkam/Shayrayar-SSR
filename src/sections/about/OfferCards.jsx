"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function OfferCards() {
  const offers = [
    {
      title: "SPICY FRIED CHICKEN",
      subtitle: "ON THIS WEEK",
      description: "limits Time Offer",
      image: "/img/offer/offerThumb1_1.png",
      shape: "/img/shape/offerShape1_4.png",
      bgImage: "/img/bg/offerBG1_1.jpg",
      buttonStyle: "style4", // orange
    },
    {
      title: "TODAY SPACIAL FOOD",
      subtitle: "WELCOME FRESHEAT",
      description: "limits Time Offer",
      image: "/img/offer/offerThumb1_2.png",
      shape: "/img/shape/offerShape1_4.png",
      bgImage: "/img/bg/offerBG1_1.jpg",
      buttonStyle: "style5", // white
    },
    {
      title: "SPECIAL CHICKEN ROLL",
      subtitle: "ON THIS WEEK",
      description: "limits Time Offer",
      image: "/img/offer/offerThumb1_3.png",
      shape: "/img/shape/offerShape1_4.png",
      bgImage: "/img/bg/offerBG1_1.jpg",
      buttonStyle: "style4", // orange
    },
  ];

  return (
    <section className="py-12 mb-12 sm:mb-0 sm:py-16 bg-bg3 ">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
          {offers.map((offer, index) => (
            <div
              key={index}
              className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center p-8 sm:p-10 border-2 border-bgimg hover:translate-y-2 transition-all duration-300"
              style={{
                backgroundImage: `url(${offer.bgImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            >
              {/* Content */}
              <div className="relative z-10 w-1/2">
                <h6 className="text-theme text-sm font-extrabold uppercase mb-2">
                  {offer.subtitle}
                </h6>
                <h3 className="text-white text-2xl sm:text-3xl font-black mb-2">
                  {offer.title}
                </h3>
                <p className="text-theme3 font-extrabold mb-5">{offer.description}</p>
                <Link
                  href="/menu"
                  className={`inline-block px-4 py-3 text-xs sm:text-sm font-normal rounded-md transition-all duration-300 bg-theme3 text-white hover:bg-theme`}
                >
                  ORDER NOW <ArrowRight className="inline-block w-4 h-4 ml-2" />
                </Link>
              </div>

              {/* Image */}
              <div className="absolute right-0 bottom-10 z-0">
                <div className="relative">
                  <Image
                    key={`${offer.image}-${index}`}
                    src={offer.image}
                    alt={offer.title}
                    width={200}
                    height={200}
                    className="object-contain"
                    unoptimized={true}
                    priority={false}
                  />
                  <div className="absolute inset-0 -top-15 right-0 animate-float-bob-x">
                    <Image
                      key={`${offer.shape}-${index}`}
                      src={offer.shape}
                      alt="shape"
                      width={100}
                      height={100}
                      className="object-contain"
                      unoptimized={true}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
