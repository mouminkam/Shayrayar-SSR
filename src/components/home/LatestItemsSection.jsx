"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBasket } from "lucide-react";
import { formatCurrency } from "../../lib/utils/formatters";
import { usePrefetchRoute } from "../../hooks/usePrefetchRoute";
import { useHighlights } from "../../context/HighlightsContext";
import OptimizedImage from "../ui/OptimizedImage";
import ProductCardSkeleton from "../ui/ProductCardSkeleton";
import useCartStore from "../../store/cartStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";
import { useCallback } from "react";
import { useInView } from "react-intersection-observer";
import { useLanguage } from "../../context/LanguageContext";
import { t } from "../../locales/i18n/getTranslation";

export default function LatestItemsSection() {
  const router = useRouter();
  const { prefetchRoute } = usePrefetchRoute();
  const { latest, isLoading } = useHighlights();
  const { addToCart } = useCartStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  const { lang } = useLanguage();

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

  if (isLoading) {
    return (
      <section className="latest-items-section py-10 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="title-area mb-12 sm:mb-14">
            <div className="sub-title text-center text-theme3 text-2xl font-bold uppercase mb-4 flex items-center justify-center gap-2">
              {t(lang, "latest_items")}
            </div>
            <div className="title text-center text-white text-3xl sm:text-5xl font-black capitalize">
              {t(lang, "new_arrivals")}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <ProductCardSkeleton viewMode="grid" count={3} />
          </div>
        </div>
      </section>
    );
  }

  if (!latest || latest.length === 0) {
    return null;
  }

  return (
    <section className="latest-items-section py-10 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="latest-items-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="title-area mb-12 sm:mb-14">
            <div className="sub-title text-center text-theme3 text-2xl font-bold uppercase mb-4 flex items-center justify-center gap-2">
              {t(lang, "latest_items")}
            </div>
            <div className="title text-center text-white text-3xl sm:text-5xl font-black capitalize">
              {t(lang, "new_arrivals")}
            </div>
          </div>

          <div className="latest-items-card-wrap style1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {latest.map((dish, index) => {
              return (
                <LazyCard
                  key={dish.id}
                  dish={dish}
                  index={index}
                  prefetchRoute={prefetchRoute}
                  handleAddToCart={handleAddToCart}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Lazy Card Component - Loads only when in viewport
function LazyCard({ dish, index, prefetchRoute, handleAddToCart }) {
  const { lang } = useLanguage();
  const shouldLoadImmediately = index < 3; // Load first 3 immediately
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: true,
  });

  const shouldLoad = shouldLoadImmediately || inView;

  if (!shouldLoad) {
    return (
      <div ref={ref} className="latest-items-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg min-h-[280px]">
        <ProductCardSkeleton viewMode="grid" count={1} />
      </div>
    );
  }

  return (
    <div
      className="latest-items-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl text-center transition-all duration-300 hover:-translate-y-2 relative min-h-[280px] flex flex-col"
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
            <h3 className="text-white text-lg sm:text-xl font-bold mb-2 hover:text-theme transition-colors duration-300 line-clamp-2">
              {dish.title}
            </h3>
          </Link>
          <p className="text-text text-sm sm:text-base mb-4 line-clamp-2">
            {dish.description || t(lang, "delicious_food_item")}
          </p>
        </div>
        <div className="mt-auto">
          <h6 className="text-theme text-base sm:text-lg font-bold mb-4">
            {formatCurrency(dish.price)}
          </h6>
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/shop/${dish.id}`}
              onMouseEnter={() => prefetchRoute(`/shop/${dish.id}`)}
              className="theme-btn style6 inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-theme2 text-white text-sm font-semibold uppercase rounded-full hover:bg-theme hover:text-white transition-all duration-300 flex-1"
            >
              {t(lang, "order")}
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
