"use client";
import Link from "next/link";
import HeroBanner from "../../components/HeroBanner";
import SocialMediaIcons from "../../components/SocialMediaIcons";

export default function StoresPage() {
  const stores = [
    {
      id: 1,
      name: "JEWELRY BOUTIQUE",
      manager: "Store Manager",
      address: "Syria, Damascus",
      phone: "+963 123 456 789",
      email: "support@jewelry.com",
      hours: "9:00 AM – 7:00 PM",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106665.08854068762!2d36.18933845985117!3d33.51041295263611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9f66ebd1e394f2!2sDamascus%2C%20Syria!5e0!3m2!1sen!2s!4v1695678901234!5m2!1sen!2s",
    },
    {
      id: 2,
      name: "JEWELRY SHOWROOM",
      manager: "Store Manager",
      address: "Syria, Damascus",
      phone: "+963 123 456 789",
      email: "support@jewelry.com",
      hours: "9:00 AM – 7:00 PM",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106665.08854068762!2d36.18933845985117!3d33.51041295263611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9f66ebd1e394f2!2sDamascus%2C%20Syria!5e0!3m2!1sen!2s!4v1695678901234!5m2!1sen!2s",
    },
    {
      id: 3,
      name: "JEWELRY STUDIO",
      manager: "Store Manager",
      address: "Syria, Damascus",
      phone: "+963 123 456 789",
      email: "support@jewelry.com",
      hours: "9:00 AM – 7:00 PM",
      mapUrl:
        "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d106665.08854068762!2d36.18933845985117!3d33.51041295263611!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1518e6dc413cc6a7%3A0x6b9f66ebd1e394f2!2sDamascus%2C%20Syria!5e0!3m2!1sen!2s!4v1695678901234!5m2!1sen!2s",
    },
  ];

  return (
    <>
      <HeroBanner
        title="WHERE TO FIND US"
        backgroundImage="/images/img04.jpg"
        leftBadge="SALE OF 50%"
        rightBadge="TRENDS FOR 2024"
      />

      <section className="py-20 bg-white">
        <div className="container mx-auto px-4 ">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              Our Stores
            </h2>
            <p className="text-gray-600 text-lg leading-8 max-w-9/10 mx-auto">
              Figma ipsum component variant main layer. Community layout fill
              bold selection vector figjam opacity. Bold project image component
              selection object variant. Arrow subtract horizontal background
              share image stroke overflow bullet. Library vertical align bold
              pen flows ellipse boolean pencil undo. Device main line draft
              align ipsum. Scale create draft fill inspect. Underline follower
              list line group layout text slice horizontal. Figma effect select
              group arrange font opacity. Scrolling layout scale background pen
              component. Pencil follower scrolling variant layout. Library
              select auto object library bullet. Arrow pencil hand layer opacity
              inspect. Select thumbnail layer draft variant rotate follower
            </p>
          </div>

          <div className="flex justify-center items-center overflow-hidden">
            <div className=" md:w-9/10 flex flex-col  gap-6">
              {stores.map((store, index) => (
                <div
                  key={store.id}
                  className="flex flex-col lg:flex-row lg:justify-between  shadow-xl hover:scale-95 transition-all duration-300 rounded-lg border-orange-400 overflow-hidden h-auto "
                >
                  {/* Details Section */}
                  <div className="lg:w-2/5 xl:w-1/2 bg-gray-50 p-6 md:p-8 lg:px-6 lg:py-5 xl:px-8 xl:py-6 flex flex-col">
                    <div className="flex-1 space-y-4 md:space-y-5">
                      {/* Store Info */}
                      <div className="space-y-3 md:space-y-4">
                        <h3 className="text-xl md:text-2xl max-lg:text-center font-bold text-gray-900 leading-tight">
                          {store.name}
                        </h3>
                        <p className="text-gray-900 max-lg:text-center max-lg:mb-10 text-lg md:text-xl font-bold">
                          {store.manager}
                        </p>
                      </div>

                      {/* Contact Details */}
                      <div className="max-lg:flex max-lg:justify-between ">
                        <div className="flex flex-col gap-5 mb-5 ">
                          <div className="">
                            <strong className="text-center  max-lg:text-xs max-lg:font-bold mr-2 text-gray-900 text-sm md:text-base min-w-[120px] md:min-w-[140px] mb-1 sm:mb-0">
                              Address : <br className="sm:hidden" />
                            </strong>
                            <span className="max-lg:text-xs max-lg:font-bold text-gray-600 text-sm md:text-base leading-6 flex-1">
                              {store.address}
                            </span>
                          </div>
                          <div className="">
                            <strong className="text-center max-lg:text-xs max-lg:font-bold mr-2 text-gray-900 text-sm md:text-base min-w-[120px] md:min-w-[140px] mb-1 sm:mb-0">
                              Phone Number : <br className="sm:hidden" />
                            </strong>
                            <Link
                              href={`tel:${store.phone}`}
                              className="max-lg:text-xs max-lg:font-bold text-blue-600 hover:text-blue-800 underline transition-colors text-sm md:text-base"
                            >
                              {store.phone}
                            </Link>
                          </div>
                        </div>

                        <div className="flex flex-col gap-5">
                          <div className="">
                            <strong className="max-lg:text-xs max-lg:font-bold mr-2 text-gray-900 text-sm md:text-base min-w-[120px] md:min-w-[140px] mb-1 sm:mb-0">
                              E-mail Address : <br className="sm:hidden" />
                            </strong>
                            <Link
                              href={`mailto:${store.email}`}
                              className="text-blue-600 hover:text-blue-800 underline transition-colors text-sm md:text-base break-all"
                            >
                              {store.email}
                            </Link>
                          </div>
                          <div className="">
                            <strong className="max-lg:text-xs max-lg:font-bold mr-2 text-gray-900 text-sm md:text-base min-w-[120px] md:min-w-[140px] mb-1 sm:mb-0">
                              Open Time : <br className="sm:hidden" />
                            </strong>
                            <span className="max-lg:text-xs max-lg:font-bold text-gray-600 text-sm md:text-base leading-6 flex-1">
                              {store.hours}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Social Media Icons */}
                    <div className="mt-6 md:mt-8">
                      <SocialMediaIcons
                        variant="default"
                        size="md"
                        className="justify-center lg:justify-start"
                      />
                    </div>
                  </div>

                  {/* Map Section */}
                  <div className="lg:w-3/5 xl:w-1/2 relative min-h-[300px] md:min-h-[350px] lg:min-h-full">
                    <div className="relative w-full h-full">
                      <iframe
                        src={store.mapUrl}
                        width="100%"
                        height="100%"
                        className="absolute inset-0 border-0 min-h-[300px] md:min-h-[350px] lg:min-h-full"
                        allowFullScreen
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                      />
                      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
                        <div
                          className="w-5 h-7 md:w-6 md:h-8"
                          style={{
                            filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.3))",
                          }}
                        >
                          <svg
                            width="100%"
                            height="100%"
                            viewBox="0 0 24 32"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M12 0C5.373 0 0 5.373 0 12C0 19 12 32 12 32C12 32 24 19 24 12C24 5.373 18.627 0 12 0Z"
                              fill="#FFA500"
                            />
                            <circle cx="12" cy="12" r="4" fill="#2C2C2C" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
