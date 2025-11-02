"use client";
import Image from "next/image";

export default function CategoryBanner() {
  return (
    <section className="relative min-h-[450px] flex items-center justify-center mt-0 overflow-hidden bg-[#fbb247] max-lg:min-h-[500px]">
      <div className="absolute inset-0 flex items-center justify-center z-0">
        <div className="absolute inset-0 flex items-center justify-center z-0">
          <div className="absolute inset-0 -top-50 flex items-center justify-center z-0">
            <h2 className="text-[200px] font-black text-white/40 tracking-[0.7em]  max-lg:text-[100px] animate-swing ">
              SALE
            </h2>
          </div>
        </div>
      </div>
      <div className=" mx-auto px-4 ">
        <div className="absolute top-0 left-1/2 z-10  -translate-x-1/2 text-center mt-10 text-white max-lg:mt-20">
          <h1
            className="
              relative text-[50px] font-bold mb-4 tracking-widest inline-block p-10 max-lg:text-4xl max-lg:p-10
              before:content-[''] before:absolute before:z-1
              before:left-[2px] before:top-2 before:right-[2px]
              before:border-t-[9px] before:border-x-[9px] before:border-white before:border-solid
              before:h-[50px]
              after:content-[''] after:absolute after:z-1
              after:left-[2px] after:bottom-0 after:right-[2px]
              after:border-b-[9px] after:border-x-[9px] after:border-white after:border-solid
              after:h-[50px]"
          >
            SAVE UP TO
            <br />
            <span className="text-[80px] p-10  max-lg:text-5xl ">30%</span>
          </h1>
        </div>
      </div>

      {/* Right Badge */}
      <span
        className="
    block text-[18px] leading-[20px] 
    absolute 
       -right-10 sm:-right-10 md:-right-16 lg:-right-10 
          -bottom-0 sm:-bottom-5 md:-bottom-10 lg:-bottom-20
   
  "
      >
        <Image
          src="/images/img26.png"
          alt="Trends for 2024"
          width={658}
          height={376}
          className="w-70 h-auto sm:w-100 sm:h-60 md:w-120 md:h-70 lg:w-[658px] lg:h-[376px]"
        />
      </span>

      {/* Left Badge */}
      <span
        className="
       block text-[18px] leading-[20px] 
       absolute 
           -left-10 sm:-left-12 md:-left-16 lg:-left-30 
          -bottom-7 sm:-bottom-13 md:-bottom-18 lg:-bottom-25
     "
      >
        <Image
          src="/images/img27.png"
          alt="Trends for 2024"
          width={658}
          height={376}
          className="w-70 h-auto sm:w-100 sm:h-60 md:w-120 md:h-70 lg:w-[658px] lg:h-[376px]"
        />
      </span>
    </section>
  );
}
