"use client";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

export default function OfferCards() {
  const { lang } = useLanguage();
  
  const offers = [
    {
      title: "SPICY FRIED CHICKEN",
      subtitle: t(lang, "on_this_week"),
      description: t(lang, "limited_time_offer"),
      image: "/img/offer/offerThumb1_1.png",
      shape: "/img/shape/offerShape1_4.png",
      bgImage: "/img/bg/offerBG1_1.jpg",
      buttonStyle: "style4", // orange
    },
    {
      title: "TODAY SPACIAL FOOD",
      subtitle: t(lang, "welcome_fresheat"),
      description: t(lang, "limited_time_offer"),
      image: "/img/offer/offerThumb1_2.png",
      shape: "/img/shape/offerShape1_4.png",
      bgImage: "/img/bg/offerBG1_1.jpg",
      buttonStyle: "style5", // white
    },
    {
      title: "SPECIAL CHICKEN ROLL",
      subtitle: t(lang, "on_this_week"),
      description: t(lang, "limited_time_offer"),
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
            <motion.div
              key={index}
              className="relative rounded-3xl overflow-hidden min-h-[300px] flex items-center p-8 sm:p-10 border-2 border-bgimg hover:translate-y-2 transition-all duration-300 bg-cover bg-center"
              style={{
                backgroundImage: `url(${offer.bgImage})`,
              }}
              variants={{
                hidden: { y: -50, opacity: 0 },
                visible: {
                  y: 0,
                  opacity: 1,
                  transition: {
                    duration: 0.6,
                    ease: "easeOut"
                  }
                },
                exit: {
                  y: -30,
                  opacity: 0,
                  transition: {
                    duration: 0.4,
                    ease: "easeIn"
                  }
                }
              }}
            >
              {/* Content */}
              <div className="relative z-10 w-1/2">
                <p className="text-theme text-sm font-extrabold uppercase mb-2">
                  {offer.subtitle}
                </p>
                <h3 className="text-white text-2xl sm:text-3xl font-black mb-2">
                  {offer.title}
                </h3>
                <p className="text-theme3 font-extrabold mb-5">{offer.description}</p>
                <Link
                  href="/shop"
                  className={`inline-block px-4 py-3 text-xs sm:text-sm font-normal rounded-md transition-all duration-300 bg-theme3 text-gray-900 hover:bg-theme hover:text-white`}
                >
                  {t(lang, "order_now")} <ArrowRight className="inline-block w-4 h-4 ml-2" />
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
                    className="object-contain w-auto h-auto sm:w-40 md:w-48 lg:w-42 xl:w-52 2xl:w-55"
                    quality={75}
                    loading="lazy"
                    sizes="(max-width: 640px) 160px, (max-width: 1024px) 192px, (max-width: 1280px) 168px, (max-width: 1536px) 208px, 220px"
                  />
                  <div className="absolute inset-0 -top-15 right-0 animate-float-bob-x">
                    {/* <Image
                      key={`${offer.shape}-${index}`}
                      src={offer.shape}
                      alt="shape"
                      width={100}
                      height={100}
                      className="object-contain w-auto h-auto"
                      unoptimized={true}
                    /> */}
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
