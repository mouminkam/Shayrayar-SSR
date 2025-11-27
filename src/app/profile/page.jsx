"use client";
import { useEffect, useState, Suspense } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import Breadcrumb from "../../components/ui/Breadcrumb";
import useAuthStore from "../../store/authStore";
import api from "../../api";
import { IMAGE_PATHS } from "../../data/constants";

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

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [isLoadingOrders, setIsLoadingOrders] = useState(true);
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    // Transform API order item to match OrderCard expected format
    // order_items structure: { id, item_name, item_price, quantity, menu_item: { image_url, ... } }
    const transformOrderItem = (item) => {
      // Use menu_item.image_url directly from API response
      const imageUrl = item.menu_item?.image_url || IMAGE_PATHS.placeholder;
      
      return {
        id: String(item.id || ''),
        name: item.item_name || item.menu_item?.name || 'Unknown Item',
        image: imageUrl,
        price: parseFloat(item.item_price || 0),
        quantity: item.quantity || 1,
      };
    };

    // Transform API order to match OrderCard expected format
    const transformOrder = (order) => {
      // Use order_items from the API response
      const items = (order.order_items || []).map(transformOrderItem);
      
      return {
        id: String(order.id || ''),
        orderNumber: order.order_number || `ORD-${order.id}`,
        date: order.created_at || new Date().toISOString(),
        total: parseFloat(order.total_amount || 0),
        status: order.status || 'pending',
        paymentStatus: order.payment_status || 'pending',
        items: items,
        paymentMethod: order.payment_method || 'cash',
      };
    };

    // Fetch orders from API
    const fetchOrders = async () => {
      setIsLoadingOrders(true);
      try {
        const params = {
          page: currentPage,
          ...(statusFilter !== 'all' ? { status: statusFilter } : {}),
        };
        const response = await api.orders.getUserOrders(params);
        
        if (response.success && response.data) {
          // Handle paginated response structure: data.orders.data
          let ordersList = [];
          let paginationData = null;
          
          if (response.data.orders && response.data.orders.data && Array.isArray(response.data.orders.data)) {
            // Paginated response: response.data.orders.data
            ordersList = response.data.orders.data;
            paginationData = {
              current_page: response.data.orders.current_page,
              last_page: response.data.orders.last_page,
              per_page: response.data.orders.per_page,
              total: response.data.orders.total,
            };
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
          setPagination(paginationData);
        } else {
          setOrders([]);
          setPagination(null);
        }
      } catch (error) {
        console.error("Error fetching orders:", error);
        setOrders([]);
        setPagination(null);
      } finally {
        setIsLoadingOrders(false);
      }
    };

    fetchOrders();
  }, [isAuthenticated, router, statusFilter, currentPage]);

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
                    <ProfileSidebar user={user} totalOrders={pagination?.total} />
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
                      { value: 'confirmed', label: 'Confirmed' },
                      { value: 'preparing', label: 'Preparing' },
                      { value: 'ready', label: 'Ready' },
                      { value: 'out_for_delivery', label: 'Out for Delivery' },
                      { value: 'delivered', label: 'Delivered' },
                      { value: 'cancelled', label: 'Cancelled' },
                    ].map((tab) => (
                      <button
                        key={tab.value}
                        onClick={() => {
                          setStatusFilter(tab.value);
                          setCurrentPage(1);
                        }}
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
                      <>
                        <OrdersHistory orders={orders} maxDisplay={2} totalOrders={pagination?.total}/>
                        
                        {/* Pagination */}
                        {pagination && pagination.last_page > 1 && (
                          <div className="mt-8 flex items-center justify-center gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                              
                                setCurrentPage(prev => Math.max(1, prev - 1));
                              }}
                              disabled={currentPage === 1}
                              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              Previous
                            </button>
                            
                            <div className="flex items-center gap-2">
                              {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                                let pageNum;
                                if (pagination.last_page <= 5) {
                                  pageNum = i + 1;
                                } else if (currentPage <= 3) {
                                  pageNum = i + 1;
                                } else if (currentPage >= pagination.last_page - 2) {
                                  pageNum = pagination.last_page - 4 + i;
                                } else {
                                  pageNum = currentPage - 2 + i;
                                }
                                
                                return (
                                  <button
                                    key={pageNum}
                                    onClick={(e) => {
                                      e.preventDefault();
                                      setCurrentPage(pageNum);
                                    }}
                                    className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                                      currentPage === pageNum
                                        ? 'bg-theme3 text-white'
                                        : 'bg-white/5 text-text hover:bg-white/10'
                                    }`}
                                  >
                                    {pageNum}
                                  </button>
                                );
                              })}
                            </div>
                            
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                setCurrentPage(prev => Math.min(pagination.last_page, prev + 1));
                              }}
                              disabled={currentPage === pagination.last_page}
                              className="px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                            >
                              Next
                            </button>
                          </div>
                        )}
                      </>
                    )}
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

