"use client";
import Image from "next/image";

export default function ProductImage() {
  return (
    <div className="bg-bgimg py-25 rounded-xl h-full flex items-center justify-center">
      <div className="relative flex justify-center items-center shrink-0 w-full">
        <Image
          src="/img/dishes/dishes3_1.png"
          alt="product"
          width={500}
          height={500}
          className="w-53 h-53 sm:w-80 sm:h-80 object-cover rounded-full relative z-10"
          unoptimized={true}
        />
        <div className="circle-shape absolute  z-0">
          <Image
            src="/img/food-items/circleShape2.png"
            alt="shape"
            width={500}
            height={500}
            className="w-55 h-55 sm:w-85 sm:h-85  animate-spin-slow"
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  );
}

