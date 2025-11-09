"use client";
import Image from "next/image";

export default function ContactBoxes() {
  const contactBoxes = [
    {
      icon: "/img/icon/location.png",
      title: "Our Address",
      description: "4517 Washington Ave. Manchester, Kentucky 39495",
    },
    {
      icon: "/img/icon/gmail.png",
      title: "info@exmple.com",
      description: "Email us anytime for any kind ofquety.",
    },
    {
      icon: "/img/icon/phone.png",
      title: "Hot: +208-666-01112",
      description: "24/7/365 priority Live Chat and ticketing support.",
    },
    {
      icon: "/img/icon/clock.png",
      title: "Opening Hour",
      description: "Sunday-Fri: 9 AM – 6 PM Saturday: 9 AM – 4 PM",
    },
  ];

  return (
    <section className="py-12 sm:py-16 md:py-20 lg:py-24">
      <div className="container mx-auto mr-20">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {contactBoxes.map((box, index) => (
            <div
              key={index}
              className="bg-white border border-theme/25 rounded-lg p-6 sm:p-8 lg:p-10 text-center h-full transition-all duration-300 hover:-translate-y-2 hover:shadow-lg group"
            >
              <div className="mb-6">
                <div className="inline-flex items-center justify-center p-4 sm:p-5 rounded-lg border border-theme/25 bg-bg2 group-hover:border-theme transition-colors duration-300">
                  <Image
                    src={box.icon}
                    alt={box.title}
                    width={48}
                    height={48}
                    className="w-10 h-10 sm:w-12 sm:h-12 object-contain"
                  />
                </div>
              </div>
              <h3 className="text-title font-['Epilogue',sans-serif] text-xl sm:text-2xl font-bold mb-3 capitalize">
                {box.title}
              </h3>
              <p className="text-text font-['Roboto',sans-serif] text-sm sm:text-base leading-relaxed">
                {box.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

