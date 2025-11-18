# API Integration Setup - Complete ✅

## ما تم إنجازه

### 1. تثبيت Dependencies
- ✅ تم تثبيت `axios`

### 2. إنشاء هيكل API
تم إنشاء الهيكل التالي في `src/api/`:

```
src/api/
├── config/
│   └── axios.js          # Axios instance مع interceptors
├── auth.js               # Authentication endpoints
├── branches.js           # Branches management
├── menu.js               # Menu categories & items
├── orders.js             # Orders management
├── customer.js           # Customer addresses, favorites, order history
├── coupons.js            # Coupon validation
├── payments.js           # Stripe & PayPal payments
├── home.js               # Home page data (slides, highlights)
└── index.js              # Central export
```

### 3. تحديث Stores
- ✅ `src/store/authStore.js` - ربط مع API الحقيقي
- ✅ `src/store/wishlistStore.js` - ربط مع `/customer/favorites` API
- ✅ `src/store/cartStore.js` - إزالة dummy data

### 4. تنظيف الكود القديم
- ✅ حذف `src/services/api.js`

### 5. تحديث Components
- ✅ `src/components/pages/register/RegisterForm.jsx` - إضافة password fields

## Configuration

### Environment Variables
يجب إنشاء ملف `.env.local` في جذر المشروع:

```env
NEXT_PUBLIC_API_BASE_URL=https://shahrayar.peaklink.pro/api/v1
```

**ملاحظة**: ملف `.env.local` موجود في `.gitignore` ولن يتم رفعه للـ Git.

## كيفية الاستخدام

### في Components:
```javascript
import api from '@/api';

// Authentication
const response = await api.auth.login(email, password);

// Menu
const menuItems = await api.menu.getMenuItems({ branch_id: 1 });

// Orders
const orders = await api.orders.getUserOrders({ status: 'pending' });
```

### في Stores:
الـ Stores محدثة بالفعل وتستخدم API تلقائياً:
- `useAuthStore` - يستخدم `authAPI`
- `useWishlistStore` - يستخدم `customerAPI` للـ favorites

## API Endpoints المتاحة

### Authentication (`api.auth`)
- `register(userData)` - تسجيل مستخدم جديد
- `login(email, password)` - تسجيل الدخول
- `logout()` - تسجيل الخروج
- `getProfile()` - الحصول على الملف الشخصي
- `updateProfile(updates)` - تحديث الملف الشخصي
- `changePassword(passwordData)` - تغيير كلمة المرور
- `forgotPassword(email)` - طلب إعادة تعيين كلمة المرور
- `resetPassword(resetData)` - إعادة تعيين كلمة المرور

### Branches (`api.branches`)
- `getAllBranches(params)` - الحصول على جميع الفروع
- `getBranchById(branchId)` - الحصول على فرع محدد
- `getNearestBranches(params)` - الحصول على أقرب الفروع
- `checkDeliveryAvailability(branchId, params)` - التحقق من إمكانية التوصيل

### Menu (`api.menu`)
- `getMenuCategories(params)` - الحصول على فئات القائمة
- `getMenuItems(params)` - الحصول على عناصر القائمة
- `getMenuItemById(itemId)` - الحصول على عنصر محدد
- `searchMenuItems(params)` - البحث في القائمة
- `getHighlights(params)` - الحصول على العناصر المميزة

### Orders (`api.orders`)
- `getUserOrders(params)` - الحصول على طلبات المستخدم
- `createOrder(orderData)` - إنشاء طلب جديد
- `getOrderById(orderId)` - الحصول على طلب محدد
- `cancelOrder(orderId, cancelData)` - إلغاء طلب
- `trackOrder(orderId)` - تتبع حالة الطلب

### Customer (`api.customer`)
- `getAddresses()` - الحصول على العناوين
- `saveAddress(addressData)` - حفظ عنوان جديد
- `getFavorites()` - الحصول على المفضلة
- `addToFavorites(menuItemId)` - إضافة للمفضلة
- `removeFromFavorites(menuItemId)` - إزالة من المفضلة
- `getOrderHistory(params)` - الحصول على سجل الطلبات

### Coupons (`api.coupons`)
- `validateCoupon(params)` - التحقق من صحة الكوبون
- `getAvailableCoupons(params)` - الحصول على الكوبونات المتاحة

### Payments (`api.payments`)
- `createStripePaymentIntent(paymentData)` - إنشاء Stripe payment intent
- `confirmStripePayment(confirmData)` - تأكيد دفع Stripe
- `createPayPalOrder(orderData)` - إنشاء طلب PayPal
- `capturePayPalOrder(captureData)` - تأكيد دفع PayPal

### Home (`api.home`)
- `getSlides(params)` - الحصول على الشرائح
- `getHighlights(params)` - الحصول على العناصر المميزة

## Features

### Axios Interceptors
- **Request Interceptor**: يضيف Bearer token تلقائياً من localStorage
- **Response Interceptor**: 
  - يعالج الأخطاء (401, 403, 404, 422, 500+)
  - عند 401: يمسح token ويوجه للصفحة login
  - يستخرج رسائل الخطأ من response

### Error Handling
جميع API calls تعيد errors بشكل موحد:
```javascript
try {
  const response = await api.auth.login(email, password);
  // response.success === true
} catch (error) {
  // error.message contains error message
  // error.status contains HTTP status code
}
```

### Token Management
- Token يتم حفظه في `auth-storage` (Zustand persist)
- يتم قراءته تلقائياً من localStorage في كل request
- عند 401: يتم مسح token وتوجيه المستخدم للـ login

## الخطوات التالية

1. ✅ إنشاء `.env.local` مع `NEXT_PUBLIC_API_BASE_URL`
2. ✅ اختبار Login/Register
3. ⏳ ربط Components الأخرى بالـ API (Shop, Menu, etc.)
4. ⏳ اختبار جميع الـ endpoints

## ملاحظات مهمة

1. **Token Format**: الـ API يستخدم Bearer Token في Authorization header
2. **Response Format**: جميع الـ responses تأتي بصيغة `{ success: true, data: {...} }`
3. **Branch ID**: معظم الـ endpoints تحتاج `branch_id` كـ query parameter
4. **Authentication**: بعض الـ endpoints تحتاج authentication (Bearer token)

---

**تاريخ الإكمال**: $(date)
**الحالة**: ✅ جاهز للاستخدام


