"use client";
import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { Heart, ShoppingBasket, Star } from "lucide-react";
import OptimizedImage from "../ui/OptimizedImage";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";
import { usePrefetchRoute } from "../../hooks/usePrefetchRoute";
import api from "../../api";
import useBranchStore from "../../store/branchStore";
import { transformMenuItemsToProducts } from "../../lib/utils/productTransform";
import { extractMenuItemsFromResponse } from "../../lib/utils/responseExtractor";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";
import { formatCurrency } from "../../lib/utils/formatters";

export default function PopularDishes() {
  const { navigate, prefetchRoute } = usePrefetchRoute();
  const { selectedBranch } = useBranchStore();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDishes = async () => {
      if (!selectedBranch) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.menu.getHighlights({ limit: 5 });
        const { menuItems } = extractMenuItemsFromResponse(response);
        
        if (Array.isArray(menuItems) && menuItems.length > 0) {
          const transformed = transformMenuItemsToProducts(menuItems);
          setDishes(transformed);
        } else {
          setDishes([]);
        }
      } catch {
        setDishes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, [selectedBranch]);

  const handleAddToCart = useCallback((e, dish) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to cart");
      navigate("/login");
      return;
    }
    
    try {
      addToCart({
        id: dish.id,
        name: dish.title,
        price: dish.price,
        image: dish.image,
        title: dish.title,
      });
      toastSuccess(`${dish.title} added to cart`);
    } catch {
      toastError("Failed to add product to cart");
    }
  }, [addToCart, toastSuccess, toastError, isAuthenticated, navigate]);

  const handleWishlistToggle = useCallback(async (e, dish) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to wishlist");
      navigate("/login");
      return;
    }
    
    try {
      if (isInWishlist(dish.id)) {
        const result = await removeFromWishlist(dish.id);
        if (result.success) {
          toastSuccess(`${dish.title} removed from wishlist`);
        } else {
          if (result.requiresAuth) {
            navigate("/login");
          }
          toastError(result.error || "Failed to remove from wishlist");
        }
      } else {
        const result = await addToWishlist({
          id: dish.id,
          name: dish.title,
          price: dish.price,
          image: dish.image,
          title: dish.title,
        });
        if (result.success) {
          toastSuccess(`${dish.title} added to wishlist`);
        } else {
          if (result.requiresAuth) {
            navigate("/login");
          }
          toastError(result.error || "Failed to add to wishlist");
        }
      }
    } catch {
      toastError("Failed to update wishlist");
    }
  }, [addToWishlist, removeFromWishlist, isInWishlist, toastSuccess, toastError, isAuthenticated, navigate]);

  return (
    <section className="popular-dishes-section py-10 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="popular-dishes-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="title-area mb-12 sm:mb-14">
            <div className="sub-title text-center text-theme3  text-2xl font-bold uppercase mb-4 flex items-center justify-center gap-2">
              {/* <Image
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
                className="w-5 h-5"
                unoptimized={true}
              /> */}
              POPULAR DISHES
              {/* <Image
                src="/img/icon/titleIcon.svg"
                alt="icon"
                width={20}
                height={20}
                className="w-5 h-5"
                unoptimized={true}
              /> */}
            </div>
            <div className="title text-center text-white  text-3xl sm:text-5xl font-black capitalize">
              Best selling Dishes
            </div>
          </div>

          {isLoading ? (
            <div className="dishes-card-wrap style1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
              <ProductCardSkeleton viewMode="grid" count={5} />
            </div>
          ) : dishes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-text text-lg">No popular dishes available</p>
            </div>
          ) : (
            <div className="dishes-card-wrap style1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 sm:gap-8">
              {dishes.map((dish) => {
                const isInWishlistState = isInWishlist(dish.id);
                return (
                  <div
                    key={dish.id}
                    className="dishes-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl text-center transition-all duration-300 hover:-translate-y-2 relative min-h-[200px] flex flex-col"
                  >
                    {/* Heart Button - Top Right */}
                    <button
                      onClick={(e) => handleWishlistToggle(e, dish)}
                      className={`absolute top-4 right-4 z-20 w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                        isInWishlistState
                          ? "bg-theme3 text-white"
                          : "bg-theme2 text-white hover:bg-theme"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${isInWishlistState ? "fill-current" : ""}`} />
                    </button>

                    {/* Product Image */}
                    <div 
                      className="absolute -top-20 left-1/2 -translate-x-1/2 flex justify-center items-center shrink-0 w-full"
                      onMouseEnter={() => prefetchRoute(`/shop/${dish.id}`)}
                    >
                      <Image
                        src="/img/food-items/circleShape.png"
                        alt="shape"
                        width={150}
                        height={150}
                        className="w-51 h-51 -top-[46px] absolute z-0 animate-spin-slow"
                        unoptimized={true}
                      />
                      <OptimizedImage
                        src={dish.image}
                        alt={dish.title}
                        width={192}
                        height={192}
                        className="w-48 h-48 object-cover rounded-full -top-10 relative z-10"
                        quality={85}
                        loading="lazy"
                        sizes="192px"
                      />
                    </div>

                    {/* Content */}
                    <div className="item-content mt-20 flex flex-col grow justify-between">
                      <div>
                        <Link 
                          href={`/shop/${dish.id}`}
                          onMouseEnter={() => prefetchRoute(`/shop/${dish.id}`)}
                        >
                          <h3 className="text-white  text-lg sm:text-xl font-bold mb-2 hover:text-theme transition-colors duration-300 line-clamp-2">
                            {dish.title}
                          </h3>
                        </Link>
                        <p className="text-text  text-sm sm:text-base mb-4 line-clamp-2">
                          {dish.description}
                        </p>
                      </div>
                      <div className="mt-auto">
                        <div className="star mb-3 flex items-center justify-center gap-0.5">
                          {[...Array(5)].map((_, i) => (
                            <Star
                              key={i}
                              className="w-4 h-4 fill-theme3 text-theme3"
                            />
                          ))}
                        </div>
                        <h6 className="text-theme  text-base sm:text-lg font-bold mb-4">
                          {formatCurrency(dish.price)}
                        </h6>
                        <div className="flex items-center justify-center gap-2">
                          <Link
                            href={`/shop/${dish.id}`}
                            onMouseEnter={() => prefetchRoute(`/shop/${dish.id}`)}
                            className="theme-btn style6 inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-theme2 text-white  text-sm font-semibold uppercase rounded-full hover:bg-theme hover:text-white transition-all duration-300 flex-1"
                          >
                            Order
                          </Link>
                          <button
                            onClick={(e) => handleAddToCart(e, dish)}
                            className="w-12 h-12 flex items-center justify-center rounded-full bg-theme3 text-white hover:bg-theme transition-all duration-300"
                            title="Add to Cart"
                          >
                            <ShoppingBasket className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

