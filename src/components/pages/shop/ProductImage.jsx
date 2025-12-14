"use client";
import Image from "next/image";

const PLACEHOLDER_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='500' height='500'%3E%3Crect fill='%23ddd' width='500' height='500'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' fill='%23999' font-size='20'%3ENo Image%3C/text%3E%3C/svg%3E";

export default function ProductImage({ product }) {
  const imageUrl = product?.image || PLACEHOLDER_IMAGE;
  
  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-md">
        <Image
          src={imageUrl}
          alt={product?.title || "Product"}
          width={500}
          height={500}
          className="w-full h-80 aspect-square shadow-2xl"
          quality={90}
          loading="eager"
          priority
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 500px"
        />
      </div>
    </div>
  );
}
