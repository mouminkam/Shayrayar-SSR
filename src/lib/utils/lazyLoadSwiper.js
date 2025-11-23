/**
 * Lazy load Swiper CSS and modules
 * This ensures Swiper CSS is only loaded when needed
 */
export const loadSwiperCSS = () => {
  if (typeof window !== "undefined") {
    // Check if Swiper CSS is already loaded
    const existingLink = document.querySelector('link[href*="swiper"]');
    if (existingLink) {
      return Promise.resolve();
    }

    // Dynamically import Swiper CSS
    return import("swiper/swiper-bundle.css").catch((error) => {
      console.warn("Failed to load Swiper CSS:", error);
    });
  }
  return Promise.resolve();
};

/**
 * Lazy load Swiper components
 */
export const loadSwiper = async () => {
  if (typeof window === "undefined") {
    return null;
  }

  try {
    // Load CSS first
    await loadSwiperCSS();

    // Then load Swiper components
    const { Swiper, SwiperSlide } = await import("swiper/react");
    const modules = await import("swiper/modules");

    return {
      Swiper,
      SwiperSlide,
      modules,
    };
  } catch (error) {
    console.error("Failed to load Swiper:", error);
    return null;
  }
};

