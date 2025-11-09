"use client";
import Image from "next/image";

export default function ProductImage() {
  return (
    <div className="bg-bg2 py-25 rounded-xl">
      <div className="relative flex justify-center items-center shrink-0">
        <Image
          src="/img/dishes/dishes3_1.png"
          alt="product"
          width={500}
          height={500}
          className="w-53 h-53  object-cover rounded-full relative z-10"
          unoptimized={true}
        />
        <div className="circle-shape absolute  z-0">
          <Image
            src="/img/food-items/circleShape2.png"
            alt="shape"
            width={500}
            height={500}
            className="w-55 h-55  animate-spin-slow"
            unoptimized={true}
          />
        </div>
      </div>
    </div>
  );
}

