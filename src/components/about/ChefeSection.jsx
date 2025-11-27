"use client";
import Image from "next/image";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

export default function ChefeSection() {
  const { lang } = useLanguage();
  
  const chefs = [
    {
      name: "Ralph Edwards",
      role: t(lang, "chef_lead"),
      image: "/img/chefe/chefeThumb1_1.png",
    },
    {
      name: "Leslie Alexander",
      role: t(lang, "chef_assistant"),
      image: "/img/chefe/chefeThumb1_2.png",
    },
    {
      name: "Ronald Richards",
      role: t(lang, "chef_assistant"),
      image: "/img/chefe/chefeThumb1_3.png",
    },
  ];


  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 relative">
      <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
        {/* Title */}
        <div className="text-center mb-12 lg:mb-16">
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="text-theme3  text-3xl font-bold uppercase">
              {t(lang, "our_chefe")}
            </span>
          </div>
          <h2 className="text-white  text-3xl sm:text-4xl lg:text-5xl font-black">
            {t(lang, "meet_our_expert_chefe")}
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
                  className="w-full h-auto  object-cover transition-transform duration-300 group-hover:scale-105"
                  quality={85}
                  loading="lazy"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 400px"
                />

              </div>
                <h3 className="text-white cursor-default text-2xl font-bold mb-1 hover:text-theme transition-colors duration-300">
                  {chef.name}
                </h3>
                
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
