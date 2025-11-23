"use client";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect fill='%23ddd' width='500' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProductImage({ product }) {
  const imageUrl = product?.image || PLACEHOLDER_IMAGE;
  
  return (
    <div className="flex items-center justify-center p-8">
      <div className="relative">
        <Image
          src={imageUrl}
          alt={product?.title || "Product"}
          width={384}
          height={384}
          className="w-60 h-60 sm:w-80 sm:h-80 lg:w-96 lg:h-96 object-cover rounded-full shadow-xl"
          quality={85}
          loading="eager"
          priority
          sizes="(max-width: 640px) 240px, (max-width: 1024px) 320px, 384px"
        />
      </div>
    </div>
  );
}
