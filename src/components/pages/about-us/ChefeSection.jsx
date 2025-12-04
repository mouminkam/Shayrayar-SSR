"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useLanguage } from "../../../context/LanguageContext";
import { t } from "../../../locales/i18n/getTranslation";
import useBranchStore from "../../../store/branchStore";
import api from "../../../api";
import OptimizedImage from "../../ui/OptimizedImage";
import ProductCardSkeleton from "../../ui/ProductCardSkeleton";
import { useInView } from "react-intersection-observer";

export default function ChefeSection() {
  const { lang } = useLanguage();
  const { getSelectedBranchId } = useBranchStore();
  const [chefs, setChefs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Get base URL for images
  const getImageUrl = (imageUrl) => {
    if (!imageUrl) return "/img/chefe/chefeThumb1_1.png";
    if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
      return imageUrl;
    }
    if (imageUrl.startsWith("/storage")) {
      const baseURL = process.env.NEXT_PUBLIC_API_BASE_URL || "https://shahrayar.peaklink.pro/api/v1";
      const cleanBaseURL = baseURL.replace(/\/api\/v1$/, "");
      return `${cleanBaseURL}${imageUrl}`;
    }
    return imageUrl;
  };

  useEffect(() => {
    const fetchChefs = async () => {
      const branchId = getSelectedBranchId();
      if (!branchId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);

      try {
        const response = await api.branches.getChefs(branchId);
        
        if (response?.success && response?.data?.chefs) {
          setChefs(response.data.chefs);
        } else {
          setChefs([]);
        }
      } catch (err) {
        console.error("Error fetching chefs:", err);
        setChefs([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchChefs();
  }, [getSelectedBranchId]);

  if (isLoading) {
    return (
      <section className="chef-section py-10 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="title-area mb-12 sm:mb-14">
            <div className="sub-title text-center text-theme3 text-2xl font-bold uppercase mb-4 flex items-center justify-center gap-2">
              {t(lang, "our_chefe")}
            </div>
            <div className="title text-center text-white text-3xl sm:text-5xl font-black capitalize">
              {t(lang, "meet_our_expert_chefe")}
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <ProductCardSkeleton viewMode="grid" count={3} />
          </div>
        </div>
      </section>
    );
  }

  if (!chefs || chefs.length === 0) {
    return null;
  }

  return (
    <section className="chef-section py-10 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
      <div className="chef-wrapper style1">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="title-area mb-12 sm:mb-14">
            <div className="sub-title text-center text-theme3 text-2xl font-bold uppercase mb-4 flex items-center justify-center gap-2">
              {t(lang, "our_chefe")}
            </div>
            <div className="title text-center text-white text-3xl sm:text-5xl font-black capitalize">
              {t(lang, "meet_our_expert_chefe")}
            </div>
          </div>

          <div className="chef-card-wrap style1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 ">
            {chefs.map((chef, index) => {
              return (
                <LazyChefCard
                  key={chef.id}
                  chef={chef}
                  index={index}
                  getImageUrl={getImageUrl}
                />
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// Lazy Chef Card Component - Loads only when in viewport
function LazyChefCard({ chef, index, getImageUrl }) {
  const shouldLoadImmediately = index < 3;
  const { ref, inView } = useInView({
    threshold: 0.1,
    rootMargin: "100px",
    triggerOnce: true,
  });

  const shouldLoad = shouldLoadImmediately || inView;

  if (!shouldLoad) {
    return (
      <div ref={ref} className="chef-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg min-h-[280px]">
        <ProductCardSkeleton viewMode="grid" count={1} />
      </div>
    );
  }

  return (
    <div
      className="chef-card style2 p-6 sm:p-7 mt-38 rounded-2xl bg-bgimg shadow-lg hover:shadow-xl text-center transition-all duration-300 hover:-translate-y-2 relative min-h-[10px] flex flex-col"
    >
      {/* Chef Image */}
      <div 
        className="absolute -top-38 left-1/2 -translate-x-1/2 flex justify-center items-center gap-10 shrink-0 w-full"
      >
     
        <OptimizedImage
          src={getImageUrl(chef.image_url)}
          alt={chef.name}
          width={192}
          height={192}
          className="w-70 h-70 object-cover  -top-10 relative z-10"
          quality={75}
          loading="lazy"
          sizes="192px"
        />
      </div>

      {/* Content */}
      <div className="item-content mt-20 flex flex-col grow justify-between">
        <div>
          <h2 className="text-white text-lg sm:text-xl font-bold mb-2 hover:text-theme transition-colors duration-300 line-clamp-2">
            {chef.name}
          </h2>
          {chef.bio && (
            <p className="text-text text-sm sm:text-base mb-4 line-clamp-2">
              {chef.bio}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
