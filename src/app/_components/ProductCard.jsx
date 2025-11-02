import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";

export default function ProductCard({ product }) {
  return (
    <div className="product-card bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      <div className="product-image">
        <Image
          src={product.image}
          alt={product.name}
          width={400}
          height={400}
          className="w-full h-64 object-cover"
        />
      </div>
      <div className="product-info p-6">
        <h3 className="text-xl font-semibold text-black mb-2">{product.name}</h3>
        <div className="flex items-center mb-3">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={16} fill="currentColor" />
            ))}
          </div>
          <span className="text-gray-600 ml-2 text-sm">({product.rating})</span>
        </div>
        <p className="text-gray-600 mb-4">{product.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-black">{product.price}</span>
          <Link
            href="/product-page"
            className="bg-black text-white px-6 py-2 rounded-lg hover:bg-gray-800 transition-colors duration-250 no-underline text-sm"
          >
            View Details
          </Link>
        </div>
      </div>
    </div>
  );
}




