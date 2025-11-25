# 📋 توثيق منطق الـ Wishlist والـ Favorites

## 🔄 نظرة عامة على الـ Flow

### 1. **التهيئة (Initialization)**

الـ wishlist **لا يتم تحميله تلقائياً** عند فتح التطبيق. يتم التحميل فقط في الحالات التالية:

- ✅ عند تسجيل الدخول (`authStore.js` - بعد login)
- ✅ عند التسجيل (`authStore.js` - بعد registration)
- ✅ عند فتح صفحة `/wishlist`
- ✅ عند فتح صفحة `/profile`
- ✅ عند إضافة عنصر جديد للـ wishlist (يتم refresh تلقائياً)

**⚠️ المشكلة المحتملة:** إذا كان المستخدم مسجل دخول وفتح التطبيق مباشرة، الـ wishlist لن يكون محمّل حتى يزور صفحة الـ wishlist أو profile.

---

## 🏗️ البنية (Architecture)

### **Store: `wishlistStore.js`**

```javascript
State:
- items: []              // قائمة العناصر
- isLoading: false       // حالة التحميل
- error: null            // الأخطاء
- lastFetched: null      // آخر وقت تم التحميل فيه

Actions:
- addToWishlist(product)      // إضافة عنصر
- removeFromWishlist(id)       // حذف عنصر
- fetchFavorites(forceRefresh) // جلب القائمة من API
- clearWishlist()             // مسح القائمة
- isInWishlist(id)            // التحقق من وجود عنصر
```

---

## 🔄 الـ Flow الكامل

### **1. إضافة عنصر للـ Wishlist**

```
User clicks Heart Icon
    ↓
handleWishlistToggle()
    ↓
Check Authentication ❌ → Redirect to /login
    ↓
Check if menu_item_id exists ❌ → Show error
    ↓
Check if already in wishlist (isInWishlist)
    ↓
If already exists → Return { success: true, alreadyExists: true }
    ↓
Call API: api.customer.addToFavorites(menuItemId)
    ↓
If success → fetchFavorites(true) to refresh list
    ↓
Update local state with new items
    ↓
Show success toast
```

**الكود في `wishlistStore.js`:**
```javascript
addToWishlist: async (product) => {
  // 1. Check authentication
  // 2. Get menu_item_id
  // 3. Check if already exists
  // 4. Call API
  // 5. Refresh list
  // 6. Return result
}
```

---

### **2. حذف عنصر من الـ Wishlist**

```
User clicks Heart Icon (item is in wishlist)
    ↓
handleWishlistToggle()
    ↓
Check Authentication ❌ → Redirect to /login
    ↓
Get menu_item_id from product
    ↓
Call API: api.customer.removeFromFavorites(menuItemId)
    ↓
If success → Remove from local state immediately
    ↓
Show success toast
```

**الكود في `wishlistStore.js`:**
```javascript
removeFromWishlist: async (id) => {
  // 1. Check authentication
  // 2. Find item in local state
  // 3. Call API
  // 4. Update local state (remove item)
  // 5. Return result
}
```

---

### **3. جلب قائمة الـ Wishlist**

```
fetchFavorites(forceRefresh = false)
    ↓
Check Authentication ❌ → Clear items & return error
    ↓
Check cache (if not forceRefresh and fetched < 30 seconds ago)
    ↓
If cached → Return cached items
    ↓
Call API: api.customer.getFavorites()
    ↓
Transform API response to local structure
    ↓
Update state with items
    ↓
Return success
```

**الكود في `wishlistStore.js`:**
```javascript
fetchFavorites: async (forceRefresh = false) => {
  // 1. Check authentication
  // 2. Check cache (30 seconds)
  // 3. Call API
  // 4. Transform response
  // 5. Update state
}
```

---

## 🔍 التحقق من وجود عنصر في الـ Wishlist

### **الطريقة المستخدمة:**

```javascript
// في Components (مثل PopularDishes, ProductCard, etc.)
const isInWishlistState = wishlistItems.some((item) => {
  const itemId = item.id ? String(item.id) : null;
  const itemMenuItemId = item.menu_item_id ? String(item.menu_item_id) : null;
  const productIdStr = String(menuItemId);
  return itemId === productIdStr || itemMenuItemId === productIdStr;
});
```

### **في Store:**

```javascript
isInWishlist: (id) => {
  const items = get().items;
  if (!id) return false;
  const idStr = String(id);
  return items.some((item) => {
    const itemId = item.id ? String(item.id) : null;
    const itemMenuItemId = item.menu_item_id ? String(item.menu_item_id) : null;
    return itemId === idStr || itemMenuItemId === idStr;
  });
}
```

**⚠️ ملاحظة:** يتم التحقق من `id` و `menu_item_id` لأن بعض العناصر قد تحتوي على واحد فقط.

---

## 🔌 API Endpoints

### **1. Get Favorites**
```
GET /customer/favorites
Response: {
  success: true,
  data: [
    {
      menu_item_id: 123,
      menu_item: {
        id: 123,
        name: "Product Name",
        price: 10.99,
        image_url: "...",
        ...
      }
    }
  ]
}
```

### **2. Add to Favorites**
```
POST /customer/favorites/{menuItemId}
Response: {
  success: true,
  message: "Added to favorites"
}
```

### **3. Remove from Favorites**
```
DELETE /customer/favorites/{menuItemId}
Response: {
  success: true,
  message: "Removed from favorites"
}
```

---

## 🐛 المشاكل المحتملة والأخطاء

### **1. ❌ `isInWishlist is not defined`**
**السبب:** تم استخدام `isInWishlist` في dependency array بدون استيراده.

**الحل:** ✅ تم إصلاحه - استبدال `isInWishlist` بـ `wishlistItems` في dependency arrays.

**الملفات المُصلحة:**
- `src/components/shop/PopularDishes.jsx`
- `src/components/shop/ShopSidebar.jsx`

---

### **2. ⚠️ الـ Wishlist لا يتم تحميله تلقائياً**
**السبب:** لا يوجد `useEffect` في `layout.jsx` أو component عام لتحميل الـ wishlist عند فتح التطبيق.

**الحل المقترح:**
```javascript
// في layout.jsx أو component عام
useEffect(() => {
  if (isAuthenticated) {
    fetchFavorites();
  }
}, [isAuthenticated]);
```

---

### **3. ⚠️ Race Condition عند إضافة عنصر**
**السبب:** عند إضافة عنصر، يتم استدعاء `fetchFavorites(true)` مباشرة بعد `addToFavorites`. إذا كان الـ API بطيء، قد يحدث تضارب.

**الحل الحالي:** ✅ تم التعامل معه - يتم إضافة العنصر optimistically إذا فشل الـ refresh.

---

### **4. ⚠️ عدم تطابق الـ IDs**
**السبب:** بعض المنتجات تستخدم `id` والبعض `menu_item_id`.

**الحل الحالي:** ✅ يتم التحقق من كلا الـ ID في `isInWishlist` و `removeFromWishlist`.

---

### **5. ⚠️ Cache قديم**
**السبب:** الـ cache يستمر 30 ثانية. إذا أضاف المستخدم عنصر من جهاز آخر، لن يظهر حتى انتهاء الـ cache.

**الحل:** استخدام `forceRefresh = true` عند الحاجة.

---

## 📍 الأماكن التي تستخدم الـ Wishlist

### **Components:**
1. `ProductCard.jsx` - بطاقة المنتج
2. `PopularDishes.jsx` - الأطباق الشائعة
3. `ShopSidebar.jsx` - قائمة المتجر
4. `ProductAbout.jsx` - صفحة تفاصيل المنتج
5. `WishlistTable.jsx` - جدول الـ wishlist
6. `UserDropdown.jsx` - قائمة المستخدم (عرض العدد)

### **Pages:**
1. `/wishlist` - صفحة الـ wishlist
2. `/profile` - صفحة الملف الشخصي

---

## 🔧 التحسينات المقترحة

### **1. إضافة Global Initialization**
```javascript
// في layout.jsx أو component جديد
useEffect(() => {
  const { isAuthenticated } = useAuthStore.getState();
  if (isAuthenticated) {
    useWishlistStore.getState().fetchFavorites();
  }
}, []);
```

### **2. إضافة Error Boundary للـ Wishlist**
```javascript
// معالجة أفضل للأخطاء
try {
  await addToWishlist(product);
} catch (error) {
  // Show user-friendly error
}
```

### **3. إضافة Loading States**
```javascript
// عرض حالة التحميل في الـ UI
{isLoading && <Spinner />}
```

### **4. إضافة Retry Logic**
```javascript
// إعادة المحاولة عند فشل الطلب
const retry = async (fn, retries = 3) => {
  try {
    return await fn();
  } catch (error) {
    if (retries > 0) {
      await new Promise(resolve => setTimeout(resolve, 1000));
      return retry(fn, retries - 1);
    }
    throw error;
  }
};
```

---

## 📝 ملاحظات مهمة

1. **الـ Wishlist يعتمد على Authentication:** بدون تسجيل دخول، لا يمكن إضافة/حذف عناصر.

2. **الـ API يستخدم Bearer Token:** يتم إرسال الـ token تلقائياً عبر axios interceptor.

3. **الـ Branch ID لا يُرسل:** الـ favorites endpoints لا تحتاج `branch_id` (مستثناة في axios config).

4. **الـ Transform Function:** يتم تحويل بيانات الـ API إلى بنية موحدة محلياً.

5. **الـ Cache:** يتم حفظ آخر fetch لمدة 30 ثانية لتقليل الطلبات.

---

## 🎯 الخلاصة

الـ wishlist system يعمل بشكل جيد بشكل عام، لكن يحتاج إلى:
- ✅ إصلاح dependency arrays (تم)
- ⚠️ إضافة global initialization
- ⚠️ تحسين error handling
- ⚠️ إضافة loading states أفضل

