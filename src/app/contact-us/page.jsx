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

// Lazy load ContactSection
const ContactSection = dynamic(
  () => import("../../components/pages/contact-us/ContactSection"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={3} height="h-screen" />,
    ssr: true, // Enable SSR
  }
);

// Data fetching functions
async function getDefaultBranch() {
  const cacheKey = 'default-branch';
  
  // Check cache first
  const cached = getCached(cacheKey);
  if (cached !== null) {
    return cached;
  }
  
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
            const result = branchResponse.data.data.branch;
            setCached(cacheKey, result);
            return result;
          }
        }
      } catch (profileError) {
        // If profile fetch fails, fallback to default branch
        console.warn('Failed to fetch user profile, using default branch:', profileError);
      }
    }
    
    // Fallback to default branch (if no token or profile fetch failed)
    const response = await serverAxios.get('/branches/default');
    const result = response?.data?.success ? response.data.data?.branch : null;
    if (result) {
      setCached(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error('Error fetching default branch:', error);
    return null;
  }
}

async function getBranchDetails(branchId, lang) {
  if (!branchId) return null;
  
  const cacheKey = `branch-details-${branchId}-${lang}`;
  
  // Check cache first
  const cached = getCached(cacheKey);
  if (cached !== null) {
    return cached;
  }
  
  try {
    const serverAxios = await createServerAxios();
    const response = await serverAxios.get(`/branches/${branchId}`);
    
    const result = response?.data?.success ? response.data.data?.branch : null;
    if (result) {
      setCached(cacheKey, result);
    }
    return result;
  } catch (error) {
    console.error('Error fetching branch details:', error);
    return null;
  }
}

// Cache configuration for SSR
export const revalidate = 300; // Revalidate every 5 minutes

export default async function ContactPage() {
  // Get language from Accept-Language header
  const lang = await getLanguage();
  
  // Get default branch
  const defaultBranch = await getDefaultBranch();
  const branchId = defaultBranch?.id || defaultBranch?.branch_id;
  
  // Fetch branch details
  const branchDetails = await getBranchDetails(branchId, lang);
  
  return (
    <div className="bg-bg3 min-h-screen">
      <Breadcrumb title={t(lang, "contact_us")} />
      <PageSEO
        title={t(lang, "contact_us") + " - Shahrayar Restaurant"}
        description="Contact Shahrayar Restaurant"
        url="/contact-us"
        keywords={[t(lang, "contact_us")]}
      />
      <ErrorBoundary>
        <Suspense fallback={<SectionSkeleton variant="grid" cardCount={3} height="h-screen" />}>
          <ContactSection branchDetails={branchDetails} lang={lang} />
        </Suspense>
      </ErrorBoundary>
    </div>
  );
}
