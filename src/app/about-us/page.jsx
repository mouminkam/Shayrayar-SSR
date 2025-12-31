import { Suspense } from "react";
import dynamic from "next/dynamic";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import PageSEO from "../../components/seo/PageSEO";
import Breadcrumb from "../../components/ui/Breadcrumb";
import { getLanguage } from "../../lib/getLanguage";
import { getAuthToken } from "../../lib/getAuthToken";
import { t } from "../../locales/i18n/getTranslation";
import { createServerAxios } from "../../api/config/serverAxios";

// Lazy load AboutUsSection
const AboutUsSection = dynamic(
  () => import("../../components/pages/about-us/AboutUsSection"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-screen" />,
    ssr: true, // Enable SSR
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

export default async function AboutUsPage() {
  // Get language from Accept-Language header
  const lang = await getLanguage();
  
  // Get default branch
  const defaultBranch = await getDefaultBranch();
  const branchId = defaultBranch?.id || defaultBranch?.branch_id;
  
  // Fetch all data in parallel
  const [chefs, slides] = await Promise.all([
    getChefs(branchId),
    getWebsiteSlides(branchId),
  ]);
  
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title={t(lang, "about_us")} />
      <PageSEO
        title={t(lang, "about_us") + " - Shahrayar Restaurant"}
        description="Learn more about Shahrayar Restaurant"
        url="/about-us"
        keywords={[t(lang, "about_us")]}
      />
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="default" height="h-screen" />}>
          <AboutUsSection
            chefs={chefs}
            slides={slides}
            lang={lang}
            className="overflow-hidden"
          />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
