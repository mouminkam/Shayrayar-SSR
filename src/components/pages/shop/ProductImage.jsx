"use client";
import OptimizedImage from "../../ui/OptimizedImage";
import { IMAGE_PATHS } from "../../../data/constants";

export default function ProductImage({ product }) {
  const imageUrl = product?.image || IMAGE_PATHS.placeholder;
  
  return (
    <div className="flex items-center justify-center p-4 sm:p-6 lg:p-8">
      <div className="relative w-full max-w-md">
        <OptimizedImage
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
