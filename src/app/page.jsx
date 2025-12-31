import { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import SectionSkeleton from "../components/ui/SectionSkeleton";
import PageSEO from "../components/seo/PageSEO";
import { getLanguage } from "../lib/getLanguage";
import { getAuthToken } from "../lib/getAuthToken";
import { createServerAxios } from "../api/config/serverAxios";

// Lazy load HomeSection
const HomeSection = dynamic(
  () => import("../components/pages/home/HomeSection"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-screen" />,
    ssr: true,
  }
);

// Data fetching functions
async function getDefaultBranch() {
  try {
    const token = await getAuthToken();
    const serverAxios = await createServerAxios();
    
    // If user is authenticated, try to get branch from user profile
    if (token) {
      try {
        const profileResponse = await serverAxios.get('/auth/profile');
        if (profileResponse?.data?.success && profileResponse.data.data?.user?.branch_id) {
          const userBranchId = profileResponse.data.data.user.branch_id;
          // Fetch branch details using branch_id
          const branchResponse = await serverAxios.get(`/branches/${userBranchId}`);
          if (branchResponse?.data?.success && branchResponse.data.data?.branch) {
            return branchResponse.data.data.branch;
          }
        }
      } catch (profileError) {
        // If profile fetch fails, fallback to default branch
        console.warn('Failed to fetch user profile, using default branch:', profileError);
      }
    }
    
    // Fallback to default branch (if no token or profile fetch failed)
    const response = await serverAxios.get('/branches/default');
    return response?.data?.success ? response.data.data?.branch : null;
  } catch (error) {
    console.error('Error fetching default branch:', error);
    return null;
  }
}

async function getWebsiteSlides(branchId) {
  if (!branchId) return [];
  
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get('/website-slides', {
      params: { branch_id: branchId },
    });
    
    return response?.data?.success ? response.data.data?.slides || [] : [];
  } catch (error) {
    console.error('Error fetching website slides:', error);
    return [];
  }
}

async function getHighlights(branchId) {
  if (!branchId) {
    return {
      popular: [],
      latest: [],
      chefSpecial: [],
    };
  }
  
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get('/menu-items/highlights', {
      params: { branch_id: branchId },
    });
    
    if (!response?.data?.success || !response.data.data) {
      return {
        popular: [],
        latest: [],
        chefSpecial: [],
      };
    }

    const data = response.data.data;
    
    // Return raw data (not transformed) - transformation will happen on client side
    return {
      popular: data.popular || [],
      latest: data.latest || [],
      chefSpecial: data.chef_special || [],
    };
  } catch (error) {
    console.error('Error fetching highlights:', error);
    return {
      popular: [],
      latest: [],
      chefSpecial: [],
    };
  }
}

async function getChefs(branchId) {
  if (!branchId) return [];
  
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get('/chefs', {
      params: { branch_id: branchId },
    });
    
    return response?.data?.success ? response.data.data?.chefs || [] : [];
  } catch (error) {
    console.error('Error fetching chefs:', error);
    return [];
  }
}

export default async function HomePage() {
  // Get language from Accept-Language header
  const lang = await getLanguage();
  
  // Get default branch
  const defaultBranch = await getDefaultBranch();
  const branchId = defaultBranch?.id || defaultBranch?.branch_id;
  
  // Fetch all data in parallel
  const [slides, highlights, chefs] = await Promise.all([
    getWebsiteSlides(branchId),
    getHighlights(branchId),
    getChefs(branchId),
  ]);

  return (
    <div className="bg-bg3 min-h-screen">
      <PageSEO
        title="Shahrayar Restaurant - Authentic Middle Eastern Cuisine"
        description="Experience authentic Middle Eastern flavors at Shahrayar Restaurant. Fresh ingredients, traditional recipes, and genuine hospitality. Order online for delivery or pickup."
        url="/"
        keywords={["Middle Eastern food", "restaurant", "delivery", "pickup", "authentic cuisine", "Shahrayar"]}
      />
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
          <HomeSection
            slides={slides}
            rawPopularData={highlights.popular}
            rawLatestData={highlights.latest}
            rawChefSpecialData={highlights.chefSpecial}
            chefs={chefs}
            lang={lang}
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
