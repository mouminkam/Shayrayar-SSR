# 📋 Home Page Sections - API Documentation

## 📊 نظرة عامة على جميع الـ Sections في Home Page

هذا المستند يوضح جميع الـ sections الموجودة في Home Page، وما إذا كان لكل section API endpoint متاح أم لا، مع اقتراحات لشكل الـ API المطلوب للـ sections التي لا يوجد لها API.

---

## ✅ Sections مع API متاح

### 1. **BannerSection** ✅
**الملف:** `src/components/home/BannerSection.jsx`

**الحالة:** ❌ **لا يوجد API** (بيانات static حالياً)

**البيانات الحالية (Static):**
```javascript
{
  id: 1,
  subtitle: "WELCOME FRESHEAT",
  title: "SPICY FRIED CHICKEN",
  image: "/img/banner/bannerThumb1_1.png",
  bgImage: "/img/bg/bannerBG1_1.jpg",
  link: "/shop",
  shape4Float: false
}
```

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

**الحالة:** ❌ **لا يوجد API** (بيانات static حالياً)

**البيانات الحالية (Static):**
```javascript
{
  id: 1,
  title: "Chicken Pizza",
  description: "The registration fee",
  price: 26.99,
  image: "/img/food-items/item1_1.png"
}
```

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

**ملاحظات:**
- ✅ هذا الـ section متصل بالـ API بالفعل
- ✅ يعمل بشكل صحيح

---

### 4. **FoodMenuSection** ✅
**الملف:** `src/components/home/FoodMenuSection.jsx`

**الحالة:** ❌ **لا يوجد API** (بيانات static حالياً)

**البيانات الحالية (Static):**
- Tabs: FastFood, DrinkJuice, ChickenPizza, FreshPasta
- Menu Items لكل tab

**API المطلوب:**

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

## ❌ Sections بدون API (تحتاج إنشاء API جديد)

### 5. **OfferCards** ❌
**الملف:** `src/components/about/OfferCards.jsx`

**الحالة:** ❌ **لا يوجد API** (بيانات static حالياً)

**البيانات الحالية (Static):**
```javascript
{
  title: "SPICY FRIED CHICKEN",
  subtitle: "ON THIS WEEK",
  description: "limits Time Offer",
  image: "/img/offer/offerThumb1_1.png",
  shape: "/img/shape/offerShape1_4.png",
  bgImage: "/img/bg/offerBG1_1.jpg",
  buttonStyle: "style4"
}
```

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
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (menu_item_id) REFERENCES menu_items(id)
);
```

---

### 6. **GallerySection** ❌
**الملف:** `src/components/home/GallerySection.jsx`

**الحالة:** ❌ **لا يوجد API** (بيانات static حالياً)

**البيانات الحالية (Static):**
```javascript
{
  id: 1,
  image: "/img/gallery/galleryThumb1_5.jpg"
}
```

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
    order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);
```

**بديل:** يمكن استخدام menu items images كـ gallery إذا لم تريد إنشاء table منفصل

---

### 7. **TestimonialSection** ❌
**الملف:** `src/components/about/TestimonialSection.jsx`

**الحالة:** ❌ **لا يوجد API** (بيانات static حالياً)

**البيانات الحالية (Static):**
```javascript
{
  id: 1,
  name: "Albert Flores",
  role: "Web Designer",
  image: "/img/shape/testimonialProfile1_1.png",
  rating: "/img/icon/star.svg",
  text: "Penatibus magnis dis point..."
}
```

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
    order INT DEFAULT 0,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id),
    FOREIGN KEY (order_id) REFERENCES orders(id),
    FOREIGN KEY (customer_id) REFERENCES users(id)
);
```

**بديل:** يمكن استخدام reviews من orders إذا كان لديك نظام reviews

---

### 8. **ChefeSection** ❌
**الملف:** `src/components/about/ChefeSection.jsx`

**الحالة:** ❌ **لا يوجد API** (بيانات static حالياً)

**البيانات الحالية (Static):**
```javascript
{
  name: "Ralph Edwards",
  role: "Chef Lead",
  image: "/img/chefe/chefeThumb1_1.png"
}
```

**API المطلوب:**
```
GET /api/v1/chefs?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "chefs": [
      {
        "id": 1,
        "branch_id": 1,
        "name": "Ralph Edwards",
        "role": "Chef Lead",
        "image": "https://example.com/chefe/chefeThumb1_1.png",
        "bio": "Experienced chef with 10 years of experience",
        "specialization": "Italian Cuisine",
        "social_media": {
          "facebook": "https://facebook.com/ralph",
          "linkedin": "https://linkedin.com/in/ralph",
          "twitter": "https://twitter.com/ralph"
        },
        "order": 1,
        "is_active": true,
        "created_at": "2024-01-01T00:00:00.000000Z",
        "updated_at": "2024-01-01T00:00:00.000000Z"
      }
    ]
  },
  "message": "Chefs retrieved successfully"
}
```

**Database Schema المقترح:**
```sql
CREATE TABLE chefs (
    id BIGINT UNSIGNED AUTO_INCREMENT PRIMARY KEY,
    branch_id BIGINT UNSIGNED NOT NULL,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255) NOT NULL,
    image VARCHAR(500) NULL,
    bio TEXT NULL,
    specialization VARCHAR(255) NULL,
    facebook_url VARCHAR(500) NULL,
    linkedin_url VARCHAR(500) NULL,
    twitter_url VARCHAR(500) NULL,
    order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    FOREIGN KEY (branch_id) REFERENCES branches(id)
);
```

---

## 📝 Sections Static (لا تحتاج API)

### 9. **AboutUsSection** 📝
**الملف:** `src/components/home/AboutUsSection.jsx`

**الحالة:** 📝 **Static Content** (لا يحتاج API)

**ملاحظات:**
- هذا section يحتوي على محتوى ثابت (نص عن المطعم)
- يمكن إبقاؤه static أو إنشاء API لإدارة المحتوى من Admin Panel

**API اختياري (لإدارة المحتوى):**
```
GET /api/v1/about?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "about": {
      "id": 1,
      "branch_id": 1,
      "subtitle": "About US",
      "title": "Variety of flavours from american cuisine",
      "description": "It is a long established fact that a reader will be distracted the readable content of a page when looking at layout the point established fact that",
      "button_text": "ORDER NOW",
      "button_link": "/shop"
    }
  },
  "message": "About content retrieved successfully"
}
```

---

### 10. **CTASection** 📝
**الملف:** `src/components/about/CTASection.jsx`

**الحالة:** 📝 **Static Content** (لا يحتاج API)

**ملاحظات:**
- هذا section يحتوي على محتوى ثابت (Call to Action)
- يمكن إبقاؤه static أو إنشاء API لإدارة المحتوى من Admin Panel

**API اختياري (لإدارة المحتوى):**
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
      "button_link": "/shop"
    }
  },
  "message": "CTA content retrieved successfully"
}
```

---

### 11. **TimerSection** 📝
**الملف:** `src/components/home/TimerSection.jsx`

**الحالة:** 📝 **Static Content** (لا يحتاج API)

**ملاحظات:**
- هذا section يحتوي على countdown timer
- التاريخ محدد في الكود: `2025-12-31T23:59:59`
- يمكن إبقاؤه static أو إنشاء API لإدارة التاريخ من Admin Panel

**API اختياري (لإدارة التاريخ):**
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
      "is_active": true
    }
  },
  "message": "Special offer retrieved successfully"
}
```

---

### 12. **MarqueeSection** 📝
**الملف:** `src/components/about/MarqueeSection.jsx`

**الحالة:** 📝 **Static Content** (لا يحتاج API)

**ملاحظات:**
- هذا section يحتوي على قائمة من النصوص المتحركة
- يمكن إبقاؤه static أو إنشاء API لإدارة النصوص من Admin Panel

**API اختياري (لإدارة النصوص):**
```
GET /api/v1/marquee-items?branch_id={branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "marquee_items": [
      {
        "id": 1,
        "branch_id": 1,
        "text": "chicken pizza",
        "order": 1,
        "is_active": true
      }
    ]
  },
  "message": "Marquee items retrieved successfully"
}
```

---

## 📊 ملخص

### ✅ Sections مع API متاح (يحتاج ربط فقط):
1. **BannerSection** - `/slides?branch_id={branch_id}`
2. **BestFoodItemsSection** - `/menu-items?featured=true&branch_id={branch_id}`
3. **FoodMenuSection** - `/menu-categories` + `/menu-items?category_id={category_id}`
4. **PopularDishes** - ✅ متصل بالفعل

### ❌ Sections تحتاج إنشاء API جديد:
5. **OfferCards** - `/offers?branch_id={branch_id}`
6. **GallerySection** - `/gallery?branch_id={branch_id}`
7. **TestimonialSection** - `/testimonials?branch_id={branch_id}`
8. **ChefeSection** - `/chefs?branch_id={branch_id}`

### 📝 Sections Static (اختياري):
9. **AboutUsSection** - يمكن إبقاؤه static أو إنشاء API
10. **CTASection** - يمكن إبقاؤه static أو إنشاء API
11. **TimerSection** - يمكن إبقاؤه static أو إنشاء API
12. **MarqueeSection** - يمكن إبقاؤه static أو إنشاء API

---

## 🎯 الأولويات

### المرحلة الأولى (High Priority):
1. ✅ ربط **BannerSection** بالـ API الموجود
2. ✅ ربط **BestFoodItemsSection** بالـ API الموجود
3. ✅ ربط **FoodMenuSection** بالـ API الموجود

### المرحلة الثانية (Medium Priority):
4. ❌ إنشاء API للـ **OfferCards**
5. ❌ إنشاء API للـ **GallerySection**

### المرحلة الثالثة (Low Priority):
6. ❌ إنشاء API للـ **TestimonialSection**
7. ❌ إنشاء API للـ **ChefeSection**

### المرحلة الرابعة (Optional):
8. 📝 إنشاء APIs للـ Static Sections (AboutUs, CTA, Timer, Marquee) إذا أردت إدارتها من Admin Panel

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

