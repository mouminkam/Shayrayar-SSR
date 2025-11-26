"use client";
import { useCallback, useState, useEffect, useContext } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBasket, Star } from "lucide-react";
import OptimizedImage from "../ui/OptimizedImage";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";
import { usePrefetchRoute } from "../../hooks/usePrefetchRoute";
import { HighlightsContext } from "../../context/HighlightsContext";
import api from "../../api";
import useBranchStore from "../../store/branchStore";
import { transformMenuItemsToProducts } from "../../lib/utils/productTransform";
import useCartStore from "../../store/cartStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";
import { formatCurrency } from "../../lib/utils/formatters";
import { useInView } from "react-intersection-observer";

export default function PopularDishes() {
  // Always call useContext first (before any other hooks) to maintain hook order
  const contextData = useContext(HighlightsContext);
  
  const router = useRouter();
  const { prefetchRoute } = usePrefetchRoute();
  const { selectedBranch, getSelectedBranchId } = useBranchStore();
  const { addToCart } = useCartStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  
  const [dishes, setDishes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // If context is available, use it; otherwise fetch directly
  useEffect(() => {
    if (contextData) {
      // Use context data
      setDishes(contextData.popular || []);
      setIsLoading(contextData.isLoading);
      return;
    }

    // Fetch directly if no context
    const fetchDishes = async () => {
      const branchId = getSelectedBranchId();
      if (!branchId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      try {
        const response = await api.menu.getHighlights();
        
        if (!response?.success || !response.data) {
          setDishes([]);
          return;
        }

        const popularItems = response.data.popular || [];
        const transformed = transformMenuItemsToProducts(popularItems);
        setDishes(transformed);
      } catch (error) {
        console.error("Error fetching popular dishes:", error);
        setDishes([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDishes();
  }, [contextData, selectedBranch, getSelectedBranchId]);

  const handleAddToCart = useCallback((e, dish) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to cart");
      router.push("/login", { scroll: false });
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
  }, [addToCart, toastSuccess, toastError, isAuthenticated, router]);


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
            <div className="dishes-card-wrap style1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              <ProductCardSkeleton viewMode="grid" count={3} />
            </div>
          ) : !dishes || dishes.length === 0 ? (
            <div className="flex items-center justify-center py-20">
              <p className="text-text text-lg">No popular dishes available</p>
            </div>
          ) : (
            <div className="dishes-card-wrap style1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {dishes.map((dish, index) => {
                return (
                  <LazyPopularCard
                    key={dish.id}
                    dish={dish}
                    index={index}
                    prefetchRoute={prefetchRoute}
                    handleAddToCart={handleAddToCart}
                  />
                );
              })}
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

// Lazy Popular Card Component - Loads only when in viewport
function LazyPopularCard({ dish, index, prefetchRoute, handleAddToCart }) {
  const shouldLoadImmediately = index < 3; // Load first 3 immediately
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: true,
  });

  const shouldLoad = shouldLoadImmediately || inView;

  if (!shouldLoad) {
    return (
      <div ref={ref} className="dishes-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg min-h-[200px]">
        <ProductCardSkeleton viewMode="grid" count={1} />
      </div>
    );
  }

  return (
    <div
      className="dishes-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl text-center transition-all duration-300 hover:-translate-y-2 relative min-h-[200px] flex flex-col"
    >
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
}
