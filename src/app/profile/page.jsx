"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import useAuthStore from "../../store/authStore";
import useWishlistStore from "../../store/wishlistStore";
import api from "../../api";

// Lazy load profile components
const ProfileSidebar = dynamic(
  () => import("../../components/pages/profile/ProfileSidebar"),
  {
    loading: () => <SectionSkeleton variant="default" showCards={false} height="h-64" />,
    ssr: false,
  }
);

const OrdersHistory = dynamic(
  () => import("../../components/pages/profile/OrdersHistory"),
  {
    loading: () => <SectionSkeleton variant="default" cardCount={2} height="h-96" />,
    ssr: false,
  }
);

const WishlistPreview = dynamic(
  () => import("../../components/pages/profile/WishlistPreview"),
  {
    loading: () => <SectionSkeleton variant="grid" cardCount={4} height="h-64" />,
    ssr: false,
  }
);

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const wishlistItems = useWishlistStore((state) => state.items);
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'completed', 'cancelled'

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Transform API order item to match OrderCard expected format
    // order_items structure: { id, item_name, item_price, quantity, menu_item: { image_url, ... } }
    const transformOrderItem = (item) => {
      // Get image from menu_item if available, otherwise use placeholder
      const imageUrl = item.menu_item?.image_url || 
                      item.menu_item?.image || 
                      item.image || 
                      '/img/placeholder.png';
      
      return {
        id: item.id || item.order_item_id || String(item.id || ''),
        name: item.item_name || item.menu_item?.name || item.name || 'Unknown Item',
        image: imageUrl,
        price: parseFloat(item.item_price || item.price || item.menu_item?.price || 0),
        quantity: item.quantity || item.qty || 1,
      };
    };

    // Transform API order to match OrderCard expected format
    const transformOrder = (order) => {
      // Use order_items from the API response
      const items = (order.order_items || order.items || []).map(transformOrderItem);
      
      return {
        id: String(order.id || order.order_id || ''),
        date: order.created_at || order.order_date || order.date || new Date().toISOString(),
        total: parseFloat(order.total_amount || order.total || 0),
        status: order.status || 'pending',
        items: items,
        paymentMethod: order.payment_method || order.paymentMethod || 'cash',
      };
    };

    // Fetch orders from API
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      try {
        // Use /orders endpoint - fetch all orders, we'll filter client-side
        const params = statusFilter !== 'all' ? { status: statusFilter } : {};
        const response = await api.orders.getUserOrders(params);
        
        if (response.success && response.data) {
          // Handle paginated response structure: data.orders.data
          let ordersList = [];
          
          if (response.data.orders && response.data.orders.data && Array.isArray(response.data.orders.data)) {
            // Paginated response: response.data.orders.data
            ordersList = response.data.orders.data;
          } else if (response.data.orders && Array.isArray(response.data.orders)) {
            // Direct orders array
            ordersList = response.data.orders;
          } else if (Array.isArray(response.data)) {
            // Direct array response
            ordersList = response.data;
          } else if (response.data.data && Array.isArray(response.data.data)) {
            // Alternative paginated structure
            ordersList = response.data.data;
          }
          
          // Transform orders to match OrderCard format
          const transformedOrders = Array.isArray(ordersList) 
            ? ordersList.map(transformOrder)
            : [];
          
          setOrders(transformedOrders);
        } else {
          setOrders([]);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router, statusFilter]);

  if (!isAuthenticated || !user) {
    return null;
  }

  return (
    <div className="bg-bg3 min-h-screen">
      <AnimatedSection>
        <Breadcrumb title="My Profile" />
      </AnimatedSection>
      <section className="profile-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-12">
            {/* Profile Info Sidebar */}
            <div className="lg:col-span-1">
              <ErrorBoundary>
                <Suspense fallback={<SectionSkeleton variant="default" showCards={false} height="h-64" />}>
                  <AnimatedSection>
                    <ProfileSidebar user={user} orders={orders} />
                  </AnimatedSection>
                </Suspense>
              </ErrorBoundary>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-2 space-y-8">
              {/* Status Filter Tabs */}
              <AnimatedSection>
                <div className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-2">
                  <div className="flex flex-wrap gap-2">
                    {[
                      { value: 'all', label: 'All Orders' },
                      { value: 'pending', label: 'Pending' },
                      { value: 'processing', label: 'Processing' },
                      { value: 'completed', label: 'Completed' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => setStatusFilter(tab.value)}
                        className={`px-4 py-2 rounded-xl  text-sm font-semibold transition-all duration-300 ${
                          statusFilter === tab.value
                            ? 'bg-theme3 text-white shadow-lg'
                            : 'bg-white/5 text-text hover:bg-white/10'
                        }`}
                      >
                        {tab.label}
                      </button>
                    ))}
                  </div>
                </div>
              </AnimatedSection>

              <ErrorBoundary>
                <Suspense fallback={<SectionSkeleton variant="default" cardCount={2} height="h-96" />}>
                  <AnimatedSection>
                    {isLoadingOrders ? (
                      <div className="flex items-center justify-center py-20 bg-bgimg rounded-2xl">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-theme3"></div>
                      </div>
                    ) : (
                      <OrdersHistory orders={orders} maxDisplay={2}/>
                    )}
                  </AnimatedSection>
                </Suspense>
              </ErrorBoundary>
              <ErrorBoundary>
                <Suspense fallback={<SectionSkeleton variant="grid" cardCount={4} height="h-64" />}>
                  <AnimatedSection>
                    <WishlistPreview wishlistItems={wishlistItems} />
                  </AnimatedSection>
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}

