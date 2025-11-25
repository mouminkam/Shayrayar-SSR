# 📋 Home Page Sections - API Documentation

## 📊 نظرة عامة على جميع الـ Sections في Home Page

هذا المستند يوضح جميع الـ sections الموجودة في Home Page، وما إذا كان لكل section API endpoint متاح أم لا، مع اقتراحات لشكل الـ API المطلوب للـ sections التي لا يوجد لها API.

---

## ✅ Sections مع API متاح (مربوطة)

### 1. **BannerSection** ✅
**الملف:** `src/components/home/BannerSection.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج ربط فقط)

**API المطلوب:**
```
GET /api/v1/slides?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "slides": [
      {
        "id": 1,
        "branch_id": 1,
        "subtitle": "WELCOME FRESHEAT",
        "title": "SPICY FRIED CHICKEN",
        "image": "https://example.com/banner/bannerThumb1_1.png",
        "bg_image": "https://example.com/bg/bannerBG1_1.jpg",
        "link": "/shop",
        "shape_float": false,
        "order": 1,
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ]
  },
  "message": "Slides retrieved successfully"
}
```

**ملاحظات:**
- الـ API موجود في Postman collection: `/slides?branch_id=1`
- يحتاج فقط ربط الـ component بالـ API

---

### 2. **BestFoodItemsSection** ✅
**الملف:** `src/components/home/BestFoodItemsSection.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج ربط فقط)

**API المطلوب:**
```
GET /api/v1/menu-items?branch_id={branch_id}&featured=true&limit=6
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "menu_items": [
      {
        "id": 1,
        "name": "Chicken Pizza",
        "description": "Delicious chicken pizza with fresh ingredients",
        "price": 26.99,
        "image": "https://example.com/food-items/item1_1.png",
        "category_id": 1,
        "category_name": "Fast Food",
        "is_featured": true,
        "is_available": true
      }
    ]
  },
  "message": "Featured menu items retrieved successfully"
}
```

**ملاحظات:**
- يمكن استخدام نفس endpoint الموجود: `/menu-items?featured=true&branch_id=1`
- يحتاج فقط ربط الـ component بالـ API

---

### 3. **PopularDishes** ✅
**الملف:** `src/components/shop/PopularDishes.jsx`

**الحالة:** ✅ **موجود API ومتصل**

**API المستخدم:**
```
GET /api/v1/menu-items/highlights?branch_id={branch_id}&limit=5
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "menu_items": [
      {
        "id": 1,
        "name": "Chicken Pizza",
        "description": "Delicious chicken pizza",
        "price": 26.99,
        "image": "https://example.com/food-items/item1_1.png",
        "category_id": 1,
        "category_name": "Fast Food",
        "is_featured": true,
        "is_available": true
      }
    ]
  },
  "message": "Highlights retrieved successfully"
}
```

**ملاحظات:**
- ✅ هذا الـ section متصل بالـ API بالفعل
- ✅ يعمل بشكل صحيح

---

### 4. **FoodMenuSection** ✅
**الملف:** `src/components/home/FoodMenuSection.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج ربط فقط)

**APIs المطلوبة:**

**1. للحصول على Categories (Tabs):**
```
GET /api/v1/menu-categories?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "categories": [
      {
        "id": 1,
        "name": "Fast Food",
        "name_ar": "وجبات سريعة",
        "icon": "https://example.com/menu/menuIcon1_1.png",
        "order": 1,
        "is_active": true
      },
      {
        "id": 2,
        "name": "Drink & Juice",
        "name_ar": "مشروبات وعصائر",
        "icon": "https://example.com/menu/menuIcon1_2.png",
        "order": 2,
        "is_active": true
      }
    ]
  },
  "message": "Menu categories retrieved successfully"
}
```

**2. للحصول على Menu Items حسب Category:**
```
GET /api/v1/menu-items?branch_id={branch_id}&category_id={category_id}&limit=10
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "menu_items": [
      {
        "id": 1,
        "name": "Chinese Pasta",
        "description": "It's a testament to our.",
        "price": 15.99,
        "image": "https://example.com/menu/menuThumb1_1.png",
        "category_id": 1,
        "category_name": "Fast Food",
        "is_available": true
      }
    ]
  },
  "message": "Menu items retrieved successfully"
}
```

**ملاحظات:**
- الـ API موجود في Postman collection: `/menu-categories` و `/menu-items`
- يحتاج فقط ربط الـ component بالـ API

---

### 5. **OfferCards** ✅
**الملف:** `src/components/about/OfferCards.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج إنشاء API جديد)

**API المطلوب:**
```
GET /api/v1/offers?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "offers": [
      {
        "id": 1,
        "branch_id": 1,
        "title": "SPICY FRIED CHICKEN",
        "subtitle": "ON THIS WEEK",
        "description": "limits Time Offer",
        "image": "https://example.com/offer/offerThumb1_1.png",
        "shape_image": "https://example.com/shape/offerShape1_4.png",
        "bg_image": "https://example.com/bg/offerBG1_1.jpg",
        "button_style": "style4",
        "link": "/shop",
        "menu_item_id": null,
        "discount_percentage": null,
        "start_date": "2024-01-01",
        "end_date": "2024-12-31",
        "is_active": true,
        "order": 1,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ]
  },
  "message": "Offers retrieved successfully"
}
```

**Database Schema المقترح:**
```sql
CREATE TABLE offers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED NOT NULL,
    title VARCHAR(255) NOT NULL,
    subtitle VARCHAR(255) NULL,
    description TEXT NULL,
    image VARCHAR(500) NULL,
    shape_image VARCHAR(500) NULL,
    bg_image VARCHAR(500) NULL,
    button_style VARCHAR(50) DEFAULT 'style4',
    link VARCHAR(255) NULL,
    menu_item_id BIGINT UNSIGNED NULL,
    discount_percentage DECIMAL(5,2) NULL,
    start_date DATE NULL,
    end_date DATE NULL,
    is_active BOOLEAN DEFAULT true,
    `order` INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

---

### 6. **CTASection** ✅
**الملف:** `src/components/about/CTASection.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج إنشاء API جديد)

**API المطلوب:**
```
GET /api/v1/cta?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "cta": {
      "id": 1,
      "branch_id": 1,
      "subtitle": "WELCOME FRESHEAT",
      "title": "TODAY SPACIAL FOOD",
      "description": "limits Time Offer",
      "image": "https://example.com/cta/ctaThumb1_1.png",
      "bg_image": "https://example.com/bg/ctaBG1_1.jpg",
      "button_text": "ORDER NOW",
      "button_link": "/shop",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  },
  "message": "CTA content retrieved successfully"
}
```

**Database Schema المقترح:**
```sql
CREATE TABLE cta_sections (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED NOT NULL,
    subtitle VARCHAR(255) NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    image VARCHAR(500) NULL,
    bg_image VARCHAR(500) NULL,
    button_text VARCHAR(100) DEFAULT 'ORDER NOW',
    button_link VARCHAR(255) DEFAULT '/shop',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);
```

---

### 7. **TimerSection** ✅
**الملف:** `src/components/home/TimerSection.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج إنشاء API جديد)

**API المطلوب:**
```
GET /api/v1/special-offer?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "special_offer": {
      "id": 1,
      "branch_id": 1,
      "subtitle": "Special Offer",
      "title": "Get 30% Discount Every Item",
      "discount_percentage": 30,
      "end_date": "2025-12-31T23:59:59",
      "image": "https://example.com/timer/timerThumb1_1.png",
      "button_text": "ORDER NOW",
      "button_link": "/shop",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00.000000Z",
      "updated_at": "2024-01-01T00:00:00.000000Z"
    }
  },
  "message": "Special offer retrieved successfully"
}
```

**Database Schema المقترح:**
```sql
CREATE TABLE special_offers (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED NOT NULL,
    subtitle VARCHAR(255) NULL,
    title VARCHAR(255) NOT NULL,
    discount_percentage DECIMAL(5,2) NULL,
    end_date DATETIME NOT NULL,
    image VARCHAR(500) NULL,
    button_text VARCHAR(100) DEFAULT 'ORDER NOW',
    button_link VARCHAR(255) DEFAULT '/shop',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);
```

---

### 8. **TestimonialSection** ✅
**الملف:** `src/components/about/TestimonialSection.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج إنشاء API جديد)

**API المطلوب:**
```
GET /api/v1/testimonials?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "testimonials": [
      {
        "id": 1,
        "branch_id": 1,
        "customer_name": "Albert Flores",
        "customer_role": "Web Designer",
        "customer_image": "https://example.com/shape/testimonialProfile1_1.png",
        "rating": 5,
        "rating_image": "https://example.com/icon/star.svg",
        "text": "Penatibus magnis dis point parturient montes nascetur ridiculus mus Ut id lorem ac enim the vestibulum blandit nec sit amet felis. Fusce quis diam odio Cras mattis mi quis tincidunt",
        "order_id": 123,
        "is_approved": true,
        "is_featured": true,
        "order": 1,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ]
  },
  "message": "Testimonials retrieved successfully"
}
```

**Database Schema المقترح:**
```sql
CREATE TABLE testimonials (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_role VARCHAR(255) NULL,
    customer_image VARCHAR(500) NULL,
    rating INT DEFAULT 5,
    rating_image VARCHAR(500) NULL,
    text TEXT NOT NULL,
    order_id BIGINT UNSIGNED NULL,
    customer_id BIGINT UNSIGNED NULL,
    is_approved BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    `order` INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);
```

---

### 9. **GallerySection** ✅
**الملف:** `src/components/home/GallerySection.jsx`

**الحالة:** ✅ **مربوط بالـ API** (يحتاج إنشاء API جديد)

**API المطلوب:**
```
GET /api/v1/gallery?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "gallery_items": [
      {
        "id": 1,
        "branch_id": 1,
        "image": "https://example.com/gallery/galleryThumb1_5.jpg",
        "title": "Gallery Image 1",
        "description": "Description of gallery image",
        "link": "/shop",
        "order": 1,
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ]
  },
  "message": "Gallery items retrieved successfully"
}
```

**Database Schema المقترح:**
```sql
CREATE TABLE gallery_items (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED NOT NULL,
    image VARCHAR(500) NOT NULL,
    title VARCHAR(255) NULL,
    description TEXT NULL,
    link VARCHAR(255) NULL,
    `order` INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);
```

---

## 📝 Sections Static (لا تحتاج API)

### 10. **AboutUsSection** 📝
**الملف:** `src/components/home/AboutUsSection.jsx`

**الحالة:** 📝 **Static Content** (لا يحتاج API)

**ملاحظات:**
- هذا section يحتوي على محتوى ثابت (نص عن المطعم)
- سيتم إبقاؤه static كما هو

---

### 11. **ChefeSection** 📝
**الملف:** `src/components/about/ChefeSection.jsx`

**الحالة:** 📝 **Static Content** (لا يحتاج API)

**ملاحظات:**
- هذا section يحتوي على بيانات static للشيفات
- سيتم إبقاؤه static كما هو

---

## 📊 ملخص

### ✅ Sections مربوطة بالـ API (موجودة أو تحتاج ربط):
1. **BannerSection** - `/slides?branch_id={branch_id}` ✅ موجود
2. **BestFoodItemsSection** - `/menu-items?featured=true&branch_id={branch_id}` ✅ موجود
3. **PopularDishes** - `/menu-items/highlights?branch_id={branch_id}` ✅ متصل بالفعل
4. **FoodMenuSection** - `/menu-categories` + `/menu-items?category_id={category_id}` ✅ موجود
5. **OfferCards** - `/offers?branch_id={branch_id}` ❌ يحتاج إنشاء
6. **CTASection** - `/cta?branch_id={branch_id}` ❌ يحتاج إنشاء
7. **TimerSection** - `/special-offer?branch_id={branch_id}` ❌ يحتاج إنشاء
8. **TestimonialSection** - `/testimonials?branch_id={branch_id}` ❌ يحتاج إنشاء
9. **GallerySection** - `/gallery?branch_id={branch_id}` ❌ يحتاج إنشاء

### 📝 Sections Static (لا تحتاج API):
10. **AboutUsSection** - static
11. **ChefeSection** - static

---

## 🎯 الأولويات

### المرحلة الأولى (High Priority - APIs موجودة تحتاج ربط):
1. ✅ ربط **BannerSection** بالـ API الموجود
2. ✅ ربط **BestFoodItemsSection** بالـ API الموجود
3. ✅ ربط **FoodMenuSection** بالـ API الموجود

### المرحلة الثانية (Medium Priority - APIs تحتاج إنشاء):
4. ❌ إنشاء API للـ **OfferCards**
5. ❌ إنشاء API للـ **CTASection**
6. ❌ إنشاء API للـ **TimerSection**
7. ❌ إنشاء API للـ **GallerySection**

### المرحلة الثالثة (Low Priority - APIs تحتاج إنشاء):
8. ❌ إنشاء API للـ **TestimonialSection**

---

## 📌 ملاحظات مهمة

1. **Branch ID:** جميع الـ APIs يجب أن تدعم `branch_id` parameter
2. **Images:** جميع الـ image URLs يجب أن تكون full URLs (https://example.com/...)
3. **Ordering:** جميع الـ APIs يجب أن تدعم `order` field للترتيب
4. **Active Status:** جميع الـ APIs يجب أن تدعم `is_active` field للتفعيل/الإلغاء
5. **Pagination:** للـ APIs التي قد تعيد عدد كبير من النتائج، يجب دعم pagination
6. **Error Handling:** جميع الـ APIs يجب أن تعيد error messages واضحة

---

## 🔗 روابط مفيدة

- Postman Collection: `Shahryar Restaurant API - Merged.postman_collection.json`
- API Base URL: يجب تحديده في `.env`
- API Documentation: يجب إنشاء Swagger/OpenAPI documentation

---

**تاريخ الإنشاء:** 2024-01-XX  
**آخر تحديث:** 2024-01-XX
