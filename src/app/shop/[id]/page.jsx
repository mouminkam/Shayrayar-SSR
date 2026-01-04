import { Suspense } from "react";
import { notFound } from "next/navigation";
import dynamic from "next/dynamic";
import ErrorBoundary from "../../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../../components/ui/SectionSkeleton";
import { getLanguage } from "../../../lib/getLanguage";
import { getAuthToken } from "../../../lib/getAuthToken";
import { createServerAxios } from "../../../api/config/serverAxios";

// Server-side cache for SSR functions
const cache = new Map();
const CACHE_TTL = 300000; // 5 minutes in milliseconds

function getCached(key) {
  const cached = cache.get(key);
  if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
    return cached.data;
  }
  cache.delete(key);
  return null;
}

function setCached(key, data) {
  cache.set(key, { data, timestamp: Date.now() });
}

const ShopDetailsContent = dynamic(
  () => import("../../../components/pages/shop/ShopDetailsContent"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: true,
  }
);

const PopularDishes = dynamic(
  () => import("../../../components/pages/shop/PopularDishes"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={5} height="h-96" />,
    ssr: true,
  }
);

async function getProductDetails(productId, lang) {
  if (!productId) return null;
  
  const cacheKey = `product-details-${productId}-${lang}`;
  
  // Check cache first
  const cached = getCached(cacheKey);
  if (cached !== null) {
    return cached;
  }
  
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(`/menu-items/${productId}`);
    if (!response?.data?.success || !response.data.data) return null;
    const data = response.data.data;
    const result = {
      item: data.item || data,
      optionGroups: data.option_groups || [],
      customizations: data.customizations || null,
    };
    setCached(cacheKey, result);
    return result;
  } catch (error) {
    console.error('Error fetching product details:', error);
    return null;
  }
}

async function getPopularDishes(lang) {
  try {
    const token = await getAuthToken();
    const serverAxios = await createServerAxios();
    let branchId = null;
    
    // If user is authenticated, try to get branch from user profile
    if (token) {
      try {
        const profileResponse = await serverAxios.get('/auth/profile');
        if (profileResponse?.data?.success && profileResponse.data.data?.user?.branch_id) {
          branchId = profileResponse.data.data.user.branch_id;
        }
      } catch (profileError) {
        // If profile fetch fails, fallback to default branch
        console.warn('Failed to fetch user profile, using default branch:', profileError);
      }
    }
    
    // If no branch from profile, get default branch
    if (!branchId) {
      const defaultBranch = await serverAxios.get('/branches/default');
      branchId = defaultBranch?.data?.success 
        ? defaultBranch.data.data?.branch?.id || defaultBranch.data.data?.branch?.branch_id 
        : null;
    }
    
    if (!branchId) return [];
    
    const cacheKey = `popular-dishes-${branchId}-${lang}`;
    
    // Check cache first
    const cached = getCached(cacheKey);
    if (cached !== null) {
      return cached;
    }
    
    const response = await serverAxios.get('/menu-items/highlights', {
      params: { branch_id: branchId },
    });
    
    const result = response?.data?.success ? response.data.data?.popular || [] : [];
    if (result.length > 0) {
      setCached(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error('Error fetching popular dishes:', error);
    return [];
  }
}

export default async function ShopDetailsPage({ params }) {
  const lang = await getLanguage();
  const resolvedParams = params instanceof Promise ? await params : params;
  const productId = resolvedParams?.id ? String(resolvedParams.id) : null;

  if (!productId) notFound();

  const [productData, popularRawData] = await Promise.all([
    getProductDetails(productId, lang),
    getPopularDishes(lang),
  ]);

  if (!productData?.item) notFound();

  return (
    <div className="bg-bg3 min-h-screen">
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
          <ShopDetailsContent rawProductData={productData} lang={lang} />
        </Suspense>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={5} height="h-96" />}>
          <PopularDishes rawPopularData={popularRawData} lang={lang} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}

