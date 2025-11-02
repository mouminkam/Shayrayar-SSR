import { ArrowBigRight } from "lucide-react";

export default function FeaturedHeaderSection({ headerData }) {
  const {
    title = "FEATURED PRODUCTS",
    subtitle = "MAGIC SHOE STILETTO",
    description = "Figma ipsum component variant main layer. Prototype distribute plugin vertical scale union. Connection fill component variant connection selection project team. Layer variant vertical union frame.",
    buttonText = "See more",
    buttonLink = "#",
  } = headerData || {};

  return (
    <div className="flex flex-col gap-0 justify-start items-center text-center w-full col-span-1 md:col-span-2 lg:col-span-2">
      <h3 className="text-[#a9a9a9] text-lg md:text-xl lg:text-2xl xl:text-3xl w-1/2 font-normal tracking-wide mb-4 md:mb-5 uppercase relative">
        {title}
        <span className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-full h-[3px] bg-gray-500 rounded-4xl"></span>
      </h3>
      <h2 className="text-xl md:text-2xl lg:text-3xl xl:text-[2.25rem] font-light text-[#fbb247] tracking-wider mb-3 md:mb-4 mt-1">
        {subtitle}
      </h2>
      <p className="text-[#969696] text-sm md:text-base font-normal leading-snug max-w-lg mb-6 md:mb-2">
        {description}
      </p>
      <div className="mb-3">
        <a
          href={buttonLink}
          className="inline-flex items-center gap-2 group mt-4 md:mt-5 border-2 border-black rounded-full px-4 py-2 hover:scale-105 transition-all duration-300"
        >
          {buttonText}
          <ArrowBigRight className="w-5 h-5 ml-2 transition-transform duration-300 group-hover:translate-x-1 group-hover:animate-[moveRight_0.6s_ease-in-out_infinite]" />
        </a>
      </div>
    </div>
  );
}

