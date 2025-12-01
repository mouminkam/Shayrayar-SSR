# شرح شامل: Flow صفحة المتجر (Shop Page) من 0 إلى 100

## 📋 جدول المحتويات
1. [نظرة عامة على الـ Flow](#نظرة-عامة)
2. [شرح مجلد `lib` بالتفصيل](#شرح-مجلد-lib)
3. [الـ Flow الكامل خطوة بخطوة](#الflow-الكامل)
4. [شرح كل ملف في `lib` حرف حرف](#شرح-الملفات-حرف-حرف)

---

## 🎯 نظرة عامة على الـ Flow

### المسار الكامل للبيانات:
```
المستخدم يفتح صفحة /shop
    ↓
ShopPage Component (src/app/shop/page.jsx)
    ↓
ShopSection Component (src/components/shop/ShopSection.jsx)
    ↓
API Call: api.menu.getMenuItems()
    ↓
Axios Instance (src/api/config/axios.js)
    ↓
Backend API Response
    ↓
extractMenuItemsFromResponse() - استخراج البيانات
    ↓
transformMenuItemsToProducts() - تحويل البيانات
    ↓
Display Products في ShopSection
```

---

## 📁 شرح مجلد `lib`

مجلد `lib` يحتوي على **مكتبات مساعدة (Utility Libraries)** التي تستخدم في جميع أنحاء التطبيق.

### هيكل المجلد:
```
src/lib/
├── getStripe.js                    # إعداد Stripe للدفع
└── utils/
    ├── formatters.js               # تنسيق الأرقام والعملات
    ├── imageUtils.js               # معالجة الصور والـ placeholders
    ├── lazyLoadSwiper.js          # تحميل Swiper بشكل lazy
    ├── navigation.js               # مساعدات التنقل والـ routing
    ├── paymentProcessor.js        # معالجة المدفوعات Stripe
    ├── productTransform.js         # تحويل بيانات API إلى منتجات
    └── responseExtractor.js        # استخراج البيانات من API response
```

---

## 🔄 الـ Flow الكامل خطوة بخطوة

### المرحلة 1: تحميل الصفحة (Page Load)

#### 1.1: المستخدم يفتح `/shop`
```javascript
// src/app/shop/page.jsx
export default function ShopPage() {
  // يتم تحميل ShopSection بشكل ديناميكي (lazy loading)
  const ShopSection = dynamic(() => import("../../components/shop/ShopSection"), {
    loading: () => <SectionSkeleton />,  // عرض skeleton أثناء التحميل
    ssr: false,  // لا يتم التحميل في الـ server-side
  });
}
```

**لماذا lazy loading؟**
- `ShopSection` مكون ثقيل يحتوي على API calls
- تحسين أداء الصفحة الأولى
- تقليل bundle size الأولي

---

### المرحلة 2: تهيئة ShopSection

#### 2.1: قراءة Query Parameters
```javascript
// src/components/shop/ShopSection.jsx
const searchParams = useSearchParams();
const categoryId = searchParams.get("category");      // تصنيف المنتج
const searchQuery = searchParams.get("search") || ""; // كلمة البحث
const sortBy = searchParams.get("sort") || "menu_order"; // طريقة الترتيب
```

#### 2.2: الحصول على Branch المحدد
```javascript
const { selectedBranch, initialize } = useBranchStore();

// التأكد من وجود branch
useEffect(() => {
  if (!selectedBranch) {
    initialize(); // جلب branch من localStorage أو API
  }
}, [selectedBranch, initialize]);
```

**لماذا Branch مهم؟**
- كل branch له قائمة منتجات مختلفة
- API يحتاج `branch_id` في كل request

---

### المرحلة 3: جلب البيانات من API

#### 3.1: إعداد Parameters للـ API
```javascript
const fetchProducts = useCallback(async () => {
  // إعداد parameters الأساسية
  const params = {
    page: 1,
    limit: itemsPerPage,  // 12 للـ grid، 5 للـ list
  };

  // إضافة filters
  if (categoryId) {
    params.category_id = categoryId;
  }
  if (searchQuery) {
    params.search = searchQuery;
  }
  if (sortBy && sortBy !== "menu_order") {
    params.sort_by = sortBy;
  }
```

#### 3.2: استدعاء API
```javascript
// src/api/menu.js
const response = await api.menu.getMenuItems(params);
```

**ما يحدث في الخلفية:**

1. **API Call يمر عبر Axios Instance:**
```javascript
// src/api/config/axios.js
axiosInstance.get('/menu-items', { params })
```

2. **Request Interceptor يضيف:**
   - `Authorization: Bearer <token>` (إذا كان المستخدم مسجل دخول)
   - `branch_id` تلقائياً (من localStorage)

3. **Request يذهب إلى:**
```
GET https://shahrayar.peaklink.pro/api/v1/menu-items?page=1&limit=12&branch_id=1&category_id=5
```

4. **Response Interceptor يعالج:**
   - يتحقق من `response.data.success`
   - يعيد `response.data` مباشرة
   - يعالج الأخطاء (401, 403, 404, etc.)

---

### المرحلة 4: استخراج البيانات من Response

#### 4.1: استخراج Menu Items
```javascript
// src/lib/utils/responseExtractor.js
const { menuItems, totalCount } = extractMenuItemsFromResponse(response);
```

**هيكل Response من API:**
```json
{
  "success": true,
  "data": {
    "items": {
      "data": [
        {
          "id": 1,
          "name": "Pizza Margherita",
          "description": "...",
          "price": 15.99,
          "image_url": "https://...",
          "sizes": [...],
          "ingredients": [...],
          "category": {...}
        }
      ],
      "total": 50,
      "per_page": 12
    }
  }
}
```

**كيف يعمل `extractMenuItemsFromResponse`؟**

```javascript
export function extractMenuItemsFromResponse(response) {
  // الحالة 1: Response قياسي
  if (response?.success && response.data?.items?.data) {
    const menuItems = Array.isArray(response.data.items.data) 
      ? response.data.items.data 
      : [];
    const totalCount = response.data.items.total || menuItems.length;
    return { menuItems, totalCount };
  }

  // الحالة 2: Response مباشر (array)
  if (Array.isArray(response)) {
    return { menuItems: response, totalCount: response.length };
  }

  // الحالة 3: لا توجد بيانات
  return { menuItems: [], totalCount: 0 };
}
```

---

### المرحلة 5: تحويل البيانات (Transformation)

#### 5.1: تحويل Menu Items إلى Products
```javascript
// src/lib/utils/productTransform.js
const transformedProducts = transformMenuItemsToProducts(menuItems);
```

**لماذا التحويل؟**
- API يعيد بيانات بصيغة مختلفة عن ما يحتاجه Frontend
- توحيد هيكل البيانات في التطبيق
- إضافة حقول محسوبة (مثل `displayPrice`, `has_sizes`)

**مثال على التحويل:**

**قبل التحويل (من API):**
```javascript
{
  id: 1,
  name: "Pizza Margherita",
  default_price: 15.99,
  image_url: "https://...",
  sizes: [
    { id: 1, name: "Small", price: 12.99, is_default: false },
    { id: 2, name: "Large", price: 18.99, is_default: true }
  ]
}
```

**بعد التحويل (لـ Frontend):**
```javascript
{
  id: 1,
  menu_item_id: 1,
  title: "Pizza Margherita",
  price: 18.99,  // سعر الـ default size
  base_price: 15.99,
  image: "https://...",
  sizes: [
    { id: 1, name: "Small", price: 12.99, is_default: false },
    { id: 2, name: "Large", price: 18.99, is_default: true }
  ],
  default_size_id: 2,
  has_sizes: true,
  has_ingredients: false
}
```

**كيف يعمل `transformMenuItemToProduct`؟**

```javascript
export const transformMenuItemToProduct = (menuItem) => {
  // 1. استخراج sizes و ingredients
  const sizesArray = Array.isArray(menuItem.sizes) ? menuItem.sizes : [];
  const ingredientsArray = Array.isArray(menuItem.ingredients) ? menuItem.ingredients : [];

  // 2. الحصول على السعر الأساسي
  const basePrice = parseFloat(menuItem.default_price || menuItem.price || 0);

  // 3. إيجاد الـ default size
  const defaultSize = sizesArray.find(s => s.is_default) || sizesArray[0] || null;
  const defaultSizePrice = defaultSize?.price ? parseFloat(defaultSize.price) : basePrice;

  // 4. السعر المعروض = سعر الـ default size أو السعر الأساسي
  const displayPrice = defaultSizePrice || basePrice;

  // 5. بناء كائن المنتج
  return {
    id: menuItem.id,
    title: menuItem.name || "",
    price: displayPrice,
    base_price: basePrice,
    image: getImageUrl(menuItem),  // معالجة URL الصورة
    sizes: sizesArray.map(size => ({
      id: size.id,
      name: size.name || "",
      price: parseFloat(size.price || 0),
      is_default: size.is_default || false,
    })),
    // ... باقي الحقول
  };
};
```

**معالجة URL الصورة:**
```javascript
const getImageUrl = (menuItem) => {
  // الحالة 1: API يعطي URL كامل
  if (menuItem.image_url) {
    return menuItem.image_url;
  }
  
  // الحالة 2: بناء URL من path نسبي
  if (menuItem.image) {
    const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL;
    const storageBaseUrl = API_BASE_URL.replace("/api/v1", "");
    const cleanPath = menuItem.image.startsWith("/") 
      ? menuItem.image.slice(1) 
      : menuItem.image;
    return `${storageBaseUrl}/storage/${cleanPath}`;
  }
  
  // الحالة 3: استخدام placeholder
  return IMAGE_PATHS.placeholder;
};
```

---

### المرحلة 6: Pagination (التصفح)

#### 6.1: Hybrid Pagination System

النظام يستخدم **نظام pagination هجين**:

**أ) Server-Side Pagination (الأفضل):**
```javascript
if (apiRespectsLimit) {
  // ✅ API يحترم limit parameter
  setUseClientPagination(false);
  setProducts(transformedProducts);
  setTotalItems(totalCount);
}
```

**ب) Client-Side Pagination (Fallback):**
```javascript
else {
  // ❌ API لا يحترم limit - نستخدم client-side
  setUseClientPagination(true);
  
  // جلب كل المنتجات
  const allParams = { ...params, limit: 1000 };
  const allResponse = await api.menu.getMenuItems(allParams);
  const allTransformed = transformMenuItemsToProducts(allMenuItems);
  
  // حفظ كل المنتجات
  setAllProducts(allTransformed);
  
  // عرض أول itemsPerPage فقط
  setProducts(allTransformed.slice(0, itemsPerPage));
}
```

**كيف يعرف النظام أي نوع يستخدم؟**
```javascript
const apiPerPage = response?.data?.items?.per_page;
const apiRespectsLimit = apiPerPage && apiPerPage === itemsPerPage;

// إذا كان per_page من API = itemsPerPage المطلوب
// يعني API يحترم limit ✅
```

#### 6.2: Show More Button
```javascript
const handleShowMore = () => {
  const currentCount = products.length;
  const nextCount = currentCount + itemsPerPage;
  setProducts(allProducts.slice(0, nextCount));  // إضافة itemsPerPage أخرى
};
```

---

### المرحلة 7: عرض المنتجات

#### 7.1: View Modes (Grid / List)
```javascript
const [viewMode, setViewMode] = useState("grid");
const itemsPerPage = viewMode === "grid" 
  ? ITEMS_PER_PAGE_GRID  // 12
  : ITEMS_PER_PAGE_LIST; // 5
```

#### 7.2: Grid View
```javascript
{viewMode === "grid" ? (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4">
    {products.map((product, index) => (
      <LazyProductCard 
        key={product.id} 
        product={product} 
        viewMode="grid"
        // أول 4 بطاقات تحمل فوراً (above the fold)
        options={index < 4 ? { rootMargin: "0px" } : {}}
      />
    ))}
  </div>
) : (
  // List View
)}
```

**Lazy Loading:**
- أول 4 بطاقات في Grid تحمل فوراً
- باقي البطاقات تحمل عند الوصول إليها (Intersection Observer)
- يحسن أداء الصفحة

---

## 📚 شرح كل ملف في `lib` حرف حرف

---

### 1. `getStripe.js` - إعداد Stripe للدفع

**الغرض:** إعداد Stripe SDK للدفع الإلكتروني

**كيف يعمل:**

#### أ) Singleton Pattern
```javascript
let cachedPublishableKey = null;      // تخزين الـ key
let publishableKeyPromise = null;    // promise واحد فقط
let stripePromise = null;             // instance واحد فقط
```

**لماذا Singleton؟**
- تجنب تحميل Stripe عدة مرات
- توفير الذاكرة والأداء
- ضمان instance واحد فقط

#### ب) جلب Publishable Key
```javascript
const fetchStripePublishableKey = async () => {
  // 1. إذا كان موجود في cache، أرجعها
  if (cachedPublishableKey) {
    return cachedPublishableKey;
  }

  // 2. إذا كان هناك promise قيد التنفيذ، أرجعها
  if (publishableKeyPromise) {
    return publishableKeyPromise;  // تجنب multiple API calls
  }

  // 3. إنشاء promise جديد
  publishableKeyPromise = (async () => {
    const response = await api.payments.getStripeConfig();
    if (response.success && response.data?.publishable_key) {
      cachedPublishableKey = response.data.publishable_key;
      return cachedPublishableKey;
    }
  })();

  return publishableKeyPromise;
};
```

**لماذا Promise Caching؟**
- إذا استدعى 10 components `getStripe()` في نفس الوقت
- سيتم جلب الـ key مرة واحدة فقط
- الباقي ينتظر نفس الـ promise

#### ج) تحميل Stripe SDK
```javascript
const getStripe = async () => {
  // فقط في client-side
  if (typeof window === 'undefined') {
    return null;  // في server-side، أرجع null
  }

  // إذا كان موجود، أرجع الـ promise الموجود
  if (stripePromise) {
    return stripePromise;
  }

  // جلب الـ key
  const publishableKey = await fetchStripePublishableKey();
  
  // تحميل Stripe SDK
  stripePromise = loadStripe(publishableKey);
  return stripePromise;
};
```

**استخدام:**
```javascript
import getStripe from '@/lib/getStripe';

const stripe = await getStripe();
await stripe.redirectToCheckout({ ... });
```

---

### 2. `utils/formatters.js` - تنسيق الأرقام والعملات

**الغرض:** تنسيق الأسعار والعملات بشكل موحد

**الدوال:**

#### أ) `formatPrice(price)`
```javascript
export const formatPrice = (price) => {
  return Number(price).toFixed(2);  // دائماً رقمين عشريين
};

// أمثلة:
formatPrice(15)      // "15.00"
formatPrice(15.5)   // "15.50"
formatPrice(15.999) // "16.00"
```

#### ب) `formatCurrency(price, symbol)`
```javascript
export const formatCurrency = (price, symbol = 'BGN') => {
  return `${symbol} ${formatPrice(price)}`;
};

// أمثلة:
formatCurrency(15.99)        // "BGN 15.99"
formatCurrency(15.99, 'USD') // "USD 15.99"
```

**استخدام:**
```javascript
import { formatCurrency } from '@/lib/utils/formatters';

<span>{formatCurrency(product.price)}</span>
// Output: "BGN 18.99"
```

---

### 3. `utils/imageUtils.js` - معالجة الصور

**الغرض:** إنشاء blur placeholders وتحسين الصور

#### أ) `generateBlurDataURL(imageUrl)`
```javascript
export async function generateBlurDataURL(imageUrl, width = 10, height = 10) {
  // إذا كان URL موجود أو data URL، أرجع SVG placeholder
  if (!imageUrl || imageUrl.startsWith('data:')) {
    return generateSVGPlaceholder(width, height);
  }

  // إنشاء لون ثابت بناءً على URL (hash)
  const hash = imageUrl.split('').reduce((acc, char) => {
    return char.charCodeAt(0) + ((acc << 5) - acc);
  }, 0);
  
  const hue = Math.abs(hash) % 360;
  const saturation = 20 + (Math.abs(hash) % 30);
  const lightness = 15 + (Math.abs(hash) % 20);
  
  return generateSVGPlaceholder(width, height, `hsl(${hue}, ${saturation}%, ${lightness}%)`);
}
```

**لماذا hash للون؟**
- نفس الصورة = نفس اللون دائماً
- تجنب flickering عند التحميل
- تجربة مستخدم أفضل

#### ب) `generateSVGPlaceholder(width, height, color)`
```javascript
export function generateSVGPlaceholder(width = 10, height = 10, color = "#1a1a1a") {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${color}"/>
    </svg>
  `.trim();
  
  // تحويل إلى base64
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}
```

**استخدام في Next.js Image:**
```javascript
import { getBlurPlaceholder } from '@/lib/utils/imageUtils';

<Image
  src={product.image}
  placeholder="blur"
  blurDataURL={getBlurPlaceholder(product.image)}
/>
```

#### ج) `preloadImage(imageUrl)`
```javascript
export function preloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');  // ⚠️ لا تستخدم new Image()
    img.onload = () => resolve();
    img.onerror = () => reject(new Error(`Failed to load image: ${imageUrl}`));
    img.src = imageUrl;
  });
}
```

**⚠️ مهم:** لا تستخدم `new Image()` لأن Next.js لديه `Image` component
- استخدم `document.createElement('img')` بدلاً منه

---

### 4. `utils/lazyLoadSwiper.js` - تحميل Swiper

**الغرض:** تحميل Swiper CSS و components فقط عند الحاجة

**لماذا Lazy Loading؟**
- Swiper bundle كبير (~100KB)
- لا نحتاجه في كل الصفحات
- تحسين أداء الصفحة الأولى

**كيف يعمل:**

#### أ) `loadSwiperCSS()`
```javascript
export const loadSwiperCSS = () => {
  // التحقق إذا كان CSS محمّل مسبقاً
  const existingLink = document.querySelector('link[href*="swiper"]');
  if (existingLink) {
    return Promise.resolve();  // موجود، لا حاجة لتحميل
  }

  // تحميل CSS ديناميكياً
  return import("swiper/swiper-bundle.css");
};
```

#### ب) `loadSwiper()`
```javascript
export const loadSwiper = async () => {
  // 1. تحميل CSS أولاً
  await loadSwiperCSS();

  // 2. تحميل Components
  const { Swiper, SwiperSlide } = await import("swiper/react");
  const modules = await import("swiper/modules");

  return { Swiper, SwiperSlide, modules };
};
```

**استخدام:**
```javascript
import { loadSwiper } from '@/lib/utils/lazyLoadSwiper';

const { Swiper, SwiperSlide } = await loadSwiper();
```

---

### 5. `utils/navigation.js` - مساعدات التنقل

**الغرض:** تبسيط التعامل مع query parameters والتنقل

#### أ) `buildQuery(params)`
```javascript
export const buildQuery = (params) => {
  if (!params || Object.keys(params).length === 0) return "";
  
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== null && value !== undefined && value !== "") {
      searchParams.set(key, String(value));
    }
  });
  
  const query = searchParams.toString();
  return query ? `?${query}` : "";
};

// أمثلة:
buildQuery({ category: 5, search: "pizza" })
// "?category=5&search=pizza"

buildQuery({ category: null, search: "" })
// ""
```

#### ب) `setQueryParams(router, pathname, params, options)`
```javascript
export const setQueryParams = (router, pathname, params = {}, options = {}) => {
  const { replace = false } = options;
  const query = buildQuery(params);
  const url = `${pathname}${query}`;
  
  if (replace) {
    router.replace(url, { scroll: false });  // لا scroll للصفحة
  } else {
    router.push(url, { scroll: false });
  }
};
```

**استخدام:**
```javascript
import { setQueryParams } from '@/lib/utils/navigation';

// تغيير category
setQueryParams(router, '/shop', { category: 5 });

// إزالة category
setQueryParams(router, '/shop', { category: null });
```

#### ج) `useUnifiedRouter()`
```javascript
export const useUnifiedRouter = () => {
  const router = useRouter();
  
  const pushNoScroll = (url) => {
    router.push(url, { scroll: false });
  };
  
  const replaceNoScroll = (url) => {
    router.replace(url, { scroll: false });
  };
  
  return { router, pushNoScroll, replaceNoScroll };
};
```

**استخدام:**
```javascript
const { pushNoScroll } = useUnifiedRouter();
pushNoScroll('/shop?category=5');  // لا scroll تلقائي
```

---

### 6. `utils/paymentProcessor.js` - معالجة المدفوعات

**الغرض:** معالجة دفع Stripe (إنشاء payment intent وفتح popup)

#### أ) `createStripePaymentIntent(orderId, amount, currency)`
```javascript
export const createStripePaymentIntent = async (orderId, amount, currency = 'BGN') => {
  try {
    // استدعاء API لإنشاء payment intent
    const response = await api.payments.createStripePaymentIntentWeb(orderId);

    if (response.success && response.data) {
      return {
        success: true,
        client_secret: response.data.client_secret,  // للتحقق من الدفع
        payment_intent_id: response.data.payment_intent_id,
        amount: response.data.amount,  // من backend
        currency: response.data.currency,
      };
    }

    return {
      success: false,
      error: response.message || 'Failed to create payment intent',
    };
  } catch (error) {
    return {
      success: false,
      error: error.message || 'Failed to create payment intent',
    };
  }
};
```

**ما هو Payment Intent؟**
- Stripe يحتاج payment intent قبل الدفع
- يحتوي على معلومات الدفع (المبلغ، العملة، etc.)
- `client_secret` يستخدم للتحقق من الدفع

#### ب) `openStripePaymentPopup(orderId, clientSecret)`
```javascript
export const openStripePaymentPopup = (orderId, clientSecret) => {
  // بناء URL الدفع
  const paymentUrl = `/checkout/stripe/pay?order_id=${orderId}&client_secret=${encodeURIComponent(clientSecret)}`;

  // حساب موقع الـ popup في وسط الشاشة
  const width = 600;
  const height = 700;
  const left = (window.screen.width - width) / 2;
  const top = (window.screen.height - height) / 2;

  // فتح popup
  const popup = window.open(
    paymentUrl,
    'StripePayment',
    `width=${width},height=${height},left=${left},top=${top},resizable=yes,scrollbars=yes`
  );

  // التحقق إذا كان popup محظور
  if (!popup || popup.closed) {
    return null;
  }

  return popup;
};
```

#### ج) `processStripePayment(orderId, amount)` - الدالة الرئيسية
```javascript
export const processStripePayment = async (orderId, amount) => {
  // 1. إنشاء payment intent
  const intentResult = await createStripePaymentIntent(orderId, amount);

  if (!intentResult.success) {
    return {
      success: false,
      error: intentResult.error,
    };
  }

  // 2. فتح popup
  const popup = openStripePaymentPopup(orderId, intentResult.client_secret);

  if (!popup) {
    // Popup محظور - فتح في tab جديد
    const paymentUrl = `/checkout/stripe/pay?order_id=${orderId}&client_secret=${encodeURIComponent(intentResult.client_secret)}`;
    window.open(paymentUrl, '_blank');
    return {
      success: false,
      error: 'Popup blocked. Payment page opened in new tab.',
    };
  }

  return {
    success: true,
    popup: popup,
    client_secret: intentResult.client_secret,
  };
};
```

**استخدام:**
```javascript
import { processStripePayment } from '@/lib/utils/paymentProcessor';

const result = await processStripePayment(orderId, 50.99);
if (result.success) {
  // Popup مفتوح، انتظار إتمام الدفع
}
```

---

### 7. `utils/productTransform.js` - تحويل المنتجات

**الغرض:** تحويل بيانات API إلى هيكل موحد للـ Frontend

#### أ) `transformMenuItemToProduct(menuItem)`

**الخطوات:**

**1. استخراج البيانات الأساسية:**
```javascript
const sizesArray = Array.isArray(menuItem.sizes) ? menuItem.sizes : [];
const ingredientsArray = Array.isArray(menuItem.ingredients) ? menuItem.ingredients : [];
const basePrice = parseFloat(menuItem.default_price || menuItem.price || 0);
```

**2. إيجاد Default Size:**
```javascript
// البحث عن size بـ is_default = true
const defaultSize = sizesArray.find(s => s.is_default) 
  || sizesArray[0]  // أو أول size
  || null;  // أو null

const defaultSizeId = defaultSize?.id || null;
const defaultSizePrice = defaultSize?.price 
  ? parseFloat(defaultSize.price) 
  : basePrice;
```

**3. حساب Display Price:**
```javascript
// السعر المعروض = سعر الـ default size أو السعر الأساسي
const displayPrice = defaultSizePrice || basePrice;
```

**4. تحويل Sizes:**
```javascript
sizes: sizesArray.map(size => ({
  id: size.id,
  name: size.name || "",
  price: parseFloat(size.price || 0),
  is_default: size.is_default || false,
  original: size,  // حفظ البيانات الأصلية
}))
```

**5. تحويل Ingredients:**
```javascript
ingredients: ingredientsArray.map(ingredient => ({
  id: ingredient.id,
  name: ingredient.name || "",
  price: parseFloat(ingredient.price || 0),
  category: null,
  is_required: ingredient.pivot?.is_required === 1 || false,
  original: ingredient,
}))
```

**6. بناء كائن المنتج النهائي:**
```javascript
return {
  id: menuItem.id,
  menu_item_id: menuItem.id,
  title: menuItem.name || "",
  price: displayPrice,
  base_price: basePrice,
  image: getImageUrl(menuItem),
  description: menuItem.description || "",
  longDescription: menuItem.description || "",
  category: menuItem.category?.name || "",
  category_id: menuItem.category_id || menuItem.category?.id || null,
  rating: menuItem.rating || 0,
  featured: menuItem.is_featured || false,
  sizes: [...],
  ingredients: [...],
  default_size_id: defaultSizeId,
  has_sizes: sizesArray.length > 0,
  has_ingredients: ingredientsArray.length > 0,
  original: menuItem,  // حفظ البيانات الأصلية للرجوع إليها
};
```

#### ب) `transformMenuItemsToProducts(menuItems)`
```javascript
export const transformMenuItemsToProducts = (menuItems) => {
  if (!Array.isArray(menuItems)) return [];
  return menuItems
    .map(transformMenuItemToProduct)
    .filter(Boolean);  // إزالة null/undefined
};
```

#### ج) `transformCategory(category)`
```javascript
export const transformCategory = (category) => {
  if (!category) return null;

  return {
    id: category.id || category.category_id,
    name: category.name || category.title || "",
    slug: category.slug || category.name?.toLowerCase().replace(/\s+/g, "-") || "",
    image: category.image || category.image_url || null,
    description: category.description || "",
    product_count: category.product_count || category.items_count || 0,
    original: category,
  };
};
```

---

### 8. `utils/responseExtractor.js` - استخراج البيانات

**الغرض:** استخراج menu items من API response بغض النظر عن هيكل Response

**لماذا نحتاج هذا الملف؟**
- API قد يعيد response بأشكال مختلفة
- نحتاج دالة واحدة تعمل مع كل الأشكال
- تجنب errors عند تغيير هيكل API

**الهياكل المدعومة:**

#### الحالة 1: Response قياسي
```json
{
  "success": true,
  "data": {
    "items": {
      "data": [...],
      "total": 50,
      "per_page": 12
    }
  }
}
```

```javascript
if (response?.success && response.data?.items?.data) {
  const menuItems = Array.isArray(response.data.items.data) 
    ? response.data.items.data 
    : [];
  const totalCount = response.data.items.total || menuItems.length;
  return { menuItems, totalCount };
}
```

#### الحالة 2: Response مباشر (array)
```json
[
  { "id": 1, "name": "..." },
  { "id": 2, "name": "..." }
]
```

```javascript
if (Array.isArray(response)) {
  return { menuItems: response, totalCount: response.length };
}
```

#### الحالة 3: Single Item Response
```json
{
  "success": true,
  "data": {
    "id": 1,
    "name": "Pizza",
    ...
  }
}
```

```javascript
if (response?.success && response.data) {
  if (response.data.id || response.data.menu_item_id) {
    return { menuItems: [response.data], totalCount: 1 };
  }
}
```

#### الحالة 4: Fallback
```javascript
// إذا لم يطابق أي شكل، أرجع empty
return { menuItems: [], totalCount: 0 };
```

**استخدام:**
```javascript
import { extractMenuItemsFromResponse } from '@/lib/utils/responseExtractor';

const response = await api.menu.getMenuItems(params);
const { menuItems, totalCount } = extractMenuItemsFromResponse(response);
```

---

## 🎯 ملخص الـ Flow الكامل

### الخطوات بالترتيب:

1. **المستخدم يفتح `/shop`**
   - `ShopPage` component يتحمّل
   - `ShopSection` يتحمّل بشكل lazy

2. **ShopSection يتهيأ**
   - قراءة query parameters (category, search, sort)
   - التأكد من وجود branch

3. **جلب البيانات**
   - `fetchProducts()` يستدعي `api.menu.getMenuItems(params)`
   - Axios interceptor يضيف token و branch_id
   - Request يذهب إلى Backend

4. **استخراج البيانات**
   - `extractMenuItemsFromResponse()` يستخرج menuItems من response
   - يحصل على totalCount

5. **تحويل البيانات**
   - `transformMenuItemsToProducts()` يحول menuItems إلى products
   - معالجة الصور والأسعار والأحجام

6. **Pagination**
   - التحقق إذا كان API يحترم limit
   - استخدام server-side أو client-side pagination

7. **عرض المنتجات**
   - Grid أو List view
   - Lazy loading للبطاقات
   - Show More button إذا لزم

---

## 🔑 نقاط مهمة

### 1. Branch ID
- **مهم جداً:** كل API call يحتاج `branch_id`
- يتم إضافته تلقائياً من Axios interceptor
- يأتي من `branchStore` (localStorage)

### 2. Error Handling
- كل API call محاط بـ try/catch
- الأخطاء تظهر في toast notifications
- Fallback للبيانات الفارغة

### 3. Performance
- Lazy loading للـ components الثقيلة
- Lazy loading للصور (Intersection Observer)
- Pagination لتقليل البيانات المحمّلة

### 4. Data Transformation
- **مهم:** API data ≠ Frontend data
- `productTransform.js` يوحد الهيكل
- يضيف حقول محسوبة (has_sizes, default_size_id, etc.)

### 5. Image Handling
- معالجة URLs كاملة ونسبية
- Blur placeholders لتحسين UX
- Fallback للـ placeholder images

---

## 📝 خاتمة

هذا الـ flow يضمن:
- ✅ فصل الاهتمامات (Separation of Concerns)
- ✅ إعادة الاستخدام (Reusability)
- ✅ سهولة الصيانة (Maintainability)
- ✅ الأداء الجيد (Performance)
- ✅ تجربة مستخدم ممتازة (UX)

كل ملف في `lib` له دور محدد وواضح، مما يجعل الكود:
- سهل الفهم
- سهل التعديل
- سهل الاختبار
- سهل التوسع

---

**تم إنشاء هذا الملف بواسطة AI Assistant**
**تاريخ الإنشاء:** 2024
**النسخة:** 1.0

