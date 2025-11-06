"use client";
import Image from "next/image";
import Link from "next/link";

export default function AboutSection() {
  const features = [
    {
      icon: "/img/icon/aboutIcon1_1.svg",
      title: "super quality food",
      description: "Served our Testy Food & good food by friendly",
    },
    {
      icon: "/img/icon/aboutIcon1_2.svg",
      title: "Qualified Chef",
      description: "Served our Testy Food & good food by friendly",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24 pt-0 relative">
      <div className="container mx-auto  ">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Image */}
          <div className="relative">
            <Image
              src="/img/about/aboutThumb2_1.png"
              alt="About Us"
              width={600}
              height={600}
              className="w-full h-auto object-contain"
              unoptimized={true}
              priority={false}
            />
            {/* Video Play Button */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ">
              <Link
                href="https://www.youtube.com/watch?v=f2Gzr8sAGB8"
                className="inline-block"
              >
                <Image
                  src="/img/shape/player.svg"
                  alt="Play Video"
                  width={80}
                  height={80}
                  className="w-16 h-16 sm:w-40 sm:h-40 animate-rotate"
                />
              </Link>
            </div>
          </div>

          {/* Content */}
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-4">
              <Image
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
              />
              <span className="text-[#FC791A] font-['Epilogue',sans-serif] text-base font-bold uppercase">
                About US
              </span>
              <Image
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
              />
            </div>
            <h2 className="text-[#010F1C] font-['Epilogue',sans-serif] text-3xl sm:text-4xl lg:text-5xl font-black leading-tight mb-4">
              Variety of flavours from american cuisine
            </h2>
            <p className="text-[#5C6574] font-['Roboto',sans-serif] text-base leading-relaxed mb-12">
              Every dish is not just prepared it's a crafted with a savor the a
              utmost precision and a deep understanding sdf of flavor harmony.
              The experienced hands of our chefs
            </p>

            {/* Features */}
            <div className="flex flex-col gap-5">
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-5">
                  <div className="shrink-0">
                    <Image
                      src={feature.icon}
                      alt={feature.title}
                      width={60}
                      height={60}
                      className="w-12 h-12 sm:w-15 sm:h-15"
                    />
                  </div>
                  <div>
                    <h6 className="text-[#010F1C] font-['Epilogue',sans-serif] text-lg font-bold mb-1 capitalize">
                      {feature.title}
                    </h6>
                    <p className="text-[#5C6574] font-['Roboto',sans-serif] text-base">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
