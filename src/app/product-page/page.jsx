"use client";

import Image from "next/image";
import { useState } from "react";
import { Heart, Star, Twitter, Facebook, Youtube, Scale } from "lucide-react";
import { FaPinterest } from "react-icons/fa";
import HeroBanner from "../../components/HeroBanner";
import RelatedProductsSlider from "./_components/RelatedProductsSlider";
import Button from "../../components/Button";

export default function ProductPage() {
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState("xl");
  const [selectedColor, setSelectedColor] = useState("gold");
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [rating] = useState(4);

  const product = {
    id: 1,
    name: "KENNETH JAY LANE",
    description: "Gold-plated necklace",
    price: 160.0,
    originalPrice: 320.0,
    discount: 50,
    code: "698309",
    images: [
      "/images/img20.jpg",
      "/images/img04.jpg",
      "/images/img04.jpg",
      "/images/img04.jpg",
    ],
    sizes: ["s", "m", "l", "xl"],
    colors: ["gold"],
    descriptionText:
      "Pharetra, erat sed fermentum feugiat, velit mauris egestas quam, ut aliquam massa nisl quis neque. Suspendisse in orci enim pharetra. Ut aliquam massa nisl quis neque. Suspendisse in orci enim pharetra.ut aliquam massa nisl quis neque.",
  };

  const relatedProducts = [
    {
      id: 1,
      name: "Goldtone Bib",
      price: 200,
      likes: 45,
      image: "/images/img04.jpg",
    },
    {
      id: 2,
      name: "Goldtone Bib",
      price: 120,
      likes: 23,
      image: "/images/img04.jpg",
    },
    {
      id: 3,
      name: "Goldtone Bib",
      price: 120,
      likes: 23,
      image: "/images/img04.jpg",
    },
    {
      id: 4,
      name: "Goldtone Bib",
      price: 120,
      likes: 23,
      image: "/images/img04.jpg",
    },
    {
      id: 5,
      name: "Goldtone Bib",
      price: 120,
      likes: 23,
      image: "/images/img04.jpg",
    },
    {
      id: 6,
      name: "Goldtone Bib",
      price: 120,
      likes: 23,
      image: "/images/img04.jpg",
    },
  ];

  const handleIncrement = () => {
    setQuantity((prev) => prev + 1);
  };

  const handleDecrement = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (!isNaN(value) && value >= 1) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    // Add to cart logic
    console.log("Added to cart:", {
      productId: product.id,
      quantity,
      size: selectedSize,
      color: selectedColor,
    });
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
  };

  const handleShare = (platform) => {
    // Share logic
    console.log("Sharing on:", platform);
  };

  // Social links matching blog-detail page
  const socialLinks = [
    {
      name: "pinterest",
      icon: <FaPinterest className="text-white" size={20} />,
      color: "bg-gray-500",
    },
    {
      name: "twitter",
      icon: <Twitter className="text-white" size={20} />,
      color: "bg-gray-500",
    },
    {
      name: "facebook",
      icon: <Facebook className="text-white" size={20} />,
      color: "bg-gray-500",
    },
    {
      name: "youtube",
      icon: <Youtube className="text-white" size={20} />,
      color: "bg-gray-500",
    },
  ];

  return (
    <div className="min-h-screen bg-white">
      <HeroBanner
        title="Product Detail"
        backgroundImage="/images/img04.jpg"
        leftBadge="SALE OF 50%"
        rightBadge="TRENDS FOR 2024"
      />

      {/* Product Detail Section */}
      <section className="py-8 md:my-5">
        <div className="mx-auto px-1">
          <div className="flex flex-col lg:flex-row gap-8 lg:gap-12">
            {/* Product Images */}
            <div className="lg:w-2/3 mr-4">
              {/* الصورة الرئيسية - أبعاد ثابتة تماماً */}
              <div className="mb-4 rounded-lg overflow-hidden bg-gray-100">
                <div className="w-full h-[500px] md:h-[800px] flex items-center justify-center">
                  <Image
                    src={product.images[activeImage]}
                    alt={product.name}
                    width={600}
                    height={600}
                    className="w-full h-full object-cover"
                    priority={activeImage === 0}
                  />
                </div>
              </div>

              {/* الصور المصغرة - أبعاد ثابتة تماماً */}
              <div className="grid grid-cols-4 gap-2">
                {product.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setActiveImage(index)}
                    className={`relative h-24 border-2 rounded-lg overflow-hidden transition-all bg-gray-100 ${
                      activeImage === index
                        ? "border-gray-800"
                        : "border-gray-300"
                    }`}
                  >
                    <Image
                      src={image}
                      alt={`${product.name} ${index + 1}`}
                      width={100}
                      height={100}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Product Info */}
            <div className="lg:w-1/2 mt-5 max-lg:m-5">
              <h1 className="text-3xl md:text-4xl font-light text-gray-800 mb-3">
                {product.name}
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                {product.description}
              </p>

              {/* Price and Rating */}
              <div className="mb-12">
                <div className="flex items-center gap-4 mb-2">
                  <span className="text-6xl mb-4 font-semibold text-gray-900">
                    ${product.price.toFixed(2)}
                  </span>
                </div>
                <div className="flex items-center gap-5 ">
                  {[...Array(5)].map((_, index) => (
                    <Star
                      key={index}
                      className={`w-5 h-5 ${
                        index < rating
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-gray-300"
                      }`}
                    />
                  ))}
                </div>
              </div>

              {/* Description */}
              <p className="text-gray-600 mb-10 leading-8 max-w-2/3">
                {product.descriptionText}
              </p>

              {/* Product Code */}
              <div className="mb-10">
                <span className="text-gray-600 uppercase text-md">
                  Product code
                </span>
                <strong className="text-xl text-gray-800 ml-6 tracking-widest">
                  {product.code}
                </strong>
              </div>

              {/* Size Selection */}
              <div className="mb-6 flex items-center justify-between gap-4 mr-30 ">
                <span className="text-gray-600 uppercase text-2xl block ">
                  Size
                </span>
                <div className="flex gap-4">
                  {product.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-6 py-3 border-2 text-sm rounded-md uppercase hover:bg-gray-800 hover:text-white font-medium transition-all ${
                        selectedSize === size
                          ? "border-gray-800 bg-gray-800 text-white"
                          : "border-gray-300 text-gray-600 hover:border-gray-400"
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity and Color */}
              <div className="flex justify-between flex-wrap gap-6 my-12 mr-30 ">
                <div className="flex items-center gap-4">
                  <span className="text-gray-600 uppercase text-lg">
                    Quantity
                  </span>
                  <div className="flex">
                    <button
                      onClick={handleDecrement}
                      disabled={quantity <= 1}
                      className="px-4 py-2 text-gray-600 text-2xl  disabled:cursor-not-allowed rounded-sm hover:bg-gray-800 hover:text-white  transition-all"
                    >
                      <span className="text-2xl">-</span>
                    </button>
                    <input
                      type="text"
                      value={quantity.toString().padStart(2, "0")}
                      onChange={handleQuantityChange}
                      className="w-16 text-center text-2xl  py-2 text-gray-800 font-bold outline-none"
                    />
                    <button
                      onClick={handleIncrement}
                      className="px-4 py-2 text-gray-600 rounded-sm hover:bg-gray-800 hover:text-white  transition-all"
                    >
                      <span className="text-2xl">+</span>
                    </button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-gray-600 uppercase p-2 text-lg font-medium">
                    Color
                  </span>
                  <select
                    value={selectedColor}
                    onChange={(e) => setSelectedColor(e.target.value)}
                    className="border-2 border-gray-400 rounded-sm px-5 py-2  text-gray-800 font-bold outline-none"
                  >
                    {product.colors.map((color) => (
                      <option key={color} value={color} className="">
                        {color}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-between gap-4 mb-12 mr-30">
                <Button
                  onClick={handleAddToCart}
                  variant="secondary"
                  size="lg"
                  className=""
                >
                  Add to Cart
                </Button>

                <div className="flex gap-4">
                  <button
                    onClick={handleWishlist}
                    className={`p-4 border-2 transition-colors ${
                      isWishlisted
                        ? "border-red-500 text-red-500"
                        : "border-gray-300 text-gray-600 hover:border-gray-400"
                    }`}
                  >
                    <Heart
                      className={`w-7 h-7 ${
                        isWishlisted ? "fill-red-500" : ""
                      }`}
                    />
                  </button>
                  <button className="p-4 border-2 border-gray-300 text-gray-600 hover:border-gray-400 transition-colors">
                    <Scale className="w-7 h-7" />
                  </button>
                </div>
              </div>

              {/* Social Share */}
              <div className="flex justify-center items-center mr-30 gap-4">
                <ul className="social-network flex space-x-4">
                  {socialLinks.map((social) => (
                    <li key={social.name}>
                      <button
                        onClick={() => handleShare(social.name)}
                        className={`${social.color} w-10 h-10 rounded-full flex items-center justify-center hover:scale-110 transition-transform duration-250`}
                      >
                        {social.icon}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products Slider */}
      <RelatedProductsSlider products={relatedProducts} />
    </div>
  );
}
