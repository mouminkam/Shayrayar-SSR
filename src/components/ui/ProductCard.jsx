"use client";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBasket, Heart, Star } from "lucide-react";
import { formatCurrency } from "../../lib/utils/formatters";
import useCartStore from "../../store/cartStore";
import useWishlistStore from "../../store/wishlistStore";
import useToastStore from "../../store/toastStore";
import useAuthStore from "../../store/authStore";

export default function ProductCard({ product, viewMode = "grid" }) {
  const router = useRouter();
  const { addToCart } = useCartStore();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlistStore();
  const { success: toastSuccess, error: toastError } = useToastStore();
  const { isAuthenticated } = useAuthStore();
  
  const isInWishlistState = isInWishlist(product.id);

  // Handle add to cart
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to cart");
      router.push("/login");
      return;
    }
    
    try {
      // Calculate default values for sizes and ingredients
      const defaultSizeId = product?.default_size_id || (product?.sizes?.[0]?.id || null);
      const defaultSize = product?.sizes?.find(s => s.id === defaultSizeId) || null;
      
      // Calculate final price with default size
      let finalPrice = product.base_price || product.price || 0;
      if (defaultSize) {
        finalPrice += parseFloat(defaultSize.price || 0);
      }
      
      // Prepare cart item with default values
      const cartItem = {
        id: product.id,
        name: product.title,
        price: finalPrice,
        base_price: product.base_price || product.price,
        image: product.image,
        title: product.title,
        final_price: finalPrice,
        // Default size (if available)
        size_id: defaultSizeId,
        size_name: defaultSize?.name || null,
        // No ingredients by default
        ingredients: [],
        ingredients_data: [],
      };
      
      addToCart(cartItem);
      
      // Show success message with customization info if applicable
      const customizationText = defaultSize?.name ? ` (${defaultSize.name})` : "";
      toastSuccess(`${product.title}${customizationText} added to cart`);
    } catch {
      toastError("Failed to add product to cart");
    }
  };

  // Handle wishlist toggle
  const handleWishlistToggle = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Check authentication first
    if (!isAuthenticated) {
      toastError("Please login to add items to wishlist");
      router.push("/login");
      return;
    }
    
    try {
      if (isInWishlistState) {
        const result = await removeFromWishlist(product.id);
        if (result.success) {
          toastSuccess(`${product.title} removed from wishlist`);
        } else {
          if (result.requiresAuth) {
            router.push("/login");
          }
          toastError(result.error || "Failed to remove from wishlist");
        }
      } else {
        const result = await addToWishlist({
          id: product.id,
          name: product.title,
          price: product.price,
          image: product.image,
          title: product.title,
        });
        if (result.success) {
          toastSuccess(`${product.title} added to wishlist`);
        } else {
          if (result.requiresAuth) {
            router.push("/login");
          }
          toastError(result.error || "Failed to add to wishlist");
        }
      }
    } catch {
      toastError("Failed to update wishlist");
    }
  };
  if (viewMode === "list") {
    return (
      <div className="relative flex flex-col sm:flex-row mt-0 items-start sm:items-center gap-6 sm:gap-8 p-5 sm:p-6 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
        <div className="dishes-thumb relative shrink-0">
          <Image
            src={product.image}
            alt={product.title}
            width={150}
            height={150}
            className="w-32 h-32 sm:w-48 sm:h-48 object-cover rounded-full relative z-10"
            unoptimized={true}
          />
          <div className="circle-shape absolute -top-[4.2px] w-[calc(100%+10px)] h-[calc(100%+10px)] left-1/2  transform  -translate-x-1/2 z-0">
            <Image
              src="/img/food-items/circleShape.png"
              alt="shape"
              width={150}
              height={150}
              className="w-full h-full animate-spin-slow"
              unoptimized={true}
            />
          </div>
        </div>
        <div className="dishes-content flex-1 ">
          <Link href={`/shop/${product.id}`}>
            <h3 className="text-white font-['Epilogue',sans-serif] text-2xl font-bold mb-3 hover:text-theme transition-colors duration-300">
              {product.title}
            </h3>
          </Link>
          <div className="icon absolute top-4 right-4">
            <button
              onClick={handleWishlistToggle}
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                isInWishlistState
                  ? "bg-theme3 text-white"
                  : "bg-theme2 text-white hover:bg-theme"
              }`}
            >
              <Heart className={`w-4 h-4 ${isInWishlistState ? "fill-current" : ""}`} />
            </button>
          </div>
          <div className="star mb-3 flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className="w-4 h-4 fill-theme3 text-theme3"
              />
            ))}
          </div>
          <div className="text text-text font-['Roboto',sans-serif] text-base font-normal leading-relaxed mb-5">
            {product.longDescription || "Neque porro est qui dolorem ipsum quia quaed inventor veritatis et quasi architecto beatae vitae dicta sunt explicabo. Aelltes port lacus quis enim var sed efficitur turpis gilla sed sit amet finibus eros. Lorem Ipsum is simply dummy text of the printing and typesetting industry.When an unknown printer took a galley of type"}
          </div>
        <div className="flex items-center justify-between gap-3">
          <h6 className="text-theme font-['Epilogue',sans-serif] text-lg font-bold">
            {formatCurrency(product.price)}
          </h6>
          <div className="flex items-center gap-2">
            <Link
              href={`/shop/${product.id}`}
              className="theme-btn style6 inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-theme2 text-white font-['Epilogue',sans-serif] text-sm font-semibold uppercase rounded-full hover:bg-theme hover:text-white transition-all duration-300"
            >
              Order
            </Link>
            <button
              onClick={handleAddToCart}
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

  // Grid View
  return (
    <div className="dishes-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl text-center transition-all duration-300 hover:-translate-y-2 relative min-h-[200px] flex flex-col">
      {/* Heart Button - Top Right */}
      <div className="absolute top-4 right-4 z-20">
        <button
          onClick={handleWishlistToggle}
          className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
            isInWishlistState
              ? "bg-theme3 text-white"
              : "bg-theme2 text-white hover:bg-theme"
          }`}
        >
          <Heart className={`w-4 h-4 ${isInWishlistState ? "fill-current" : ""}`} />
        </button>
      </div>

      <div className="absolute -top-20 left-1/2 -translate-x-1/2 flex justify-center items-center shrink-0 w-full">
        {/* Circle Shape - Behind the food image */}
        <Image
          src="/img/food-items/circleShape.png"
          alt="shape"
          width={150}
          height={150}
          className="w-51 h-51 -top-[46px] absolute z-0 animate-spin-slow"
          unoptimized={true}
        />

        {/* Food Image - On top */}
        <Image
          src={product.image}
          alt={product.title}
          width={150}
          height={150}
          className="w-48 h-48 object-cover rounded-full -top-10 relative z-10"
          unoptimized={true}
        />
      </div>
      <div className="item-content mt-20 flex flex-col grow justify-between">
        <div>
          <Link href={`/shop/${product.id}`}>
            <h3 className="text-white font-['Epilogue',sans-serif] text-lg sm:text-xl font-bold mb-2 hover:text-theme transition-colors duration-300 line-clamp-2">
              {product.title}
            </h3>
          </Link>
          <p className="text-text font-['Roboto',sans-serif] text-sm sm:text-base mb-4 line-clamp-2">
            {product.description}
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
          <h6 className="text-theme font-['Epilogue',sans-serif] text-base sm:text-lg font-bold mb-4">
            {formatCurrency(product.price)}
          </h6>
          <div className="flex items-center justify-center gap-2">
            <Link
              href={`/shop/${product.id}`}
              className="theme-btn style6 inline-flex items-center justify-center px-6 sm:px-8 py-3 bg-theme2 text-white font-['Epilogue',sans-serif] text-sm font-semibold uppercase rounded-full hover:bg-theme hover:text-white transition-all duration-300 flex-1"
            >
              Order
            </Link>
            <button
              onClick={handleAddToCart}
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

