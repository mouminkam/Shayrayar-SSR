# Missing/Required Backend APIs

---

## **Authentication APIs**

### **1. Forgot Password - Email OTP**

**المشكلة:** `/auth/forgot-password` يرسل OTP للموبايل فقط، يجب إرساله للإيميل.

**API:**
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com"
  },
  "message": "OTP sent to your email successfully"
}
```

---

### **2. Google OAuth Callback - HTML Response**

**المشكلة:** `/auth/google/callback` يعيد JSON مباشرة. يجب أن يعيد HTML page مع JavaScript يرسل postMessage.

**API:**
```http
GET /api/v1/auth/google/callback?code=XXX&state=YYY
```

**Response المطلوب:** HTML page (وليس JSON) مع JavaScript:

```html
<!DOCTYPE html>
<html>
<head>
    <meta charset="UTF-8">
    <title>Authenticating...</title>
</head>
<body>
    <div style="text-align: center; padding: 50px;">
        <p>Completing authentication...</p>
    </div>
    <script>
        if (window.opener) {
            window.opener.postMessage({
                type: 'GOOGLE_OAUTH_DATA',
                code: '{{ $code }}',
                state: '{{ $state }}',
                user: {
                    id: {{ $user->id }},
                    name: "{{ $user->name }}",
                    email: "{{ $user->email }}",
                    phone: {{ $user->phone ? '"' . $user->phone . '"' : 'null' }},
                    google_id: "{{ $user->google_id }}"
                },
                token: "{{ $token }}",
                token_type: "Bearer"
            }, '*');
        }
        setTimeout(() => window.close(), 500);
    </script>
</body>
</html>
```

**Error Response:**
```html
<!DOCTYPE html>
<html>
<body>
    <p style="color: red;">Authentication failed. Closing window...</p>
    <script>
        if (window.opener) {
            window.opener.postMessage({
                type: 'GOOGLE_OAUTH_ERROR',
                error: '{{ $error }}',
                message: '{{ $message }}'
            }, '*');
        }
        setTimeout(() => window.close(), 500);
    </script>
</body>
</html>
```

---

## **Payment APIs**

### **3. Stripe Confirm Payment - Order Status**

**المشكلة:** `/payments/stripe/confirm-payment` يحدّث `payment_status = "paid"` فقط، لكن لا يحدّث `status = "confirmed"`.

**API:**
```http
POST /api/v1/payments/stripe/confirm-payment
Content-Type: application/json

{
  "payment_intent_id": "pi_xxx",
  "order_id": 114
}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 114,
      "payment_status": "paid",
      "status": "confirmed",
      "payment_intent_id": "pi_xxx",
      "paid_at": "2025-11-24T13:09:59Z"
    }
  }
}
```

**المطلوب:**
في endpoint `confirm-payment`، يجب تحديث:
```php
$order->payment_status = 'paid';        // ✅ يعمل حالياً
$order->status = 'confirmed';            // ❌ ناقص! (أو 'processing')
$order->payment_intent_id = $paymentIntent->id;
$order->paid_at = now();
$order->save();
```

---

## **Home Page Sections APIs**

### **4. BannerSection**

**المشكلة:** بيانات static حالياً، يحتاج API.

**API:**
```http
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
        "is_active": true
      }
    ]
  },
  "message": "Slides retrieved successfully"
}
```

---

### **5. BestFoodItemsSection**

**المشكلة:** بيانات static حالياً، يحتاج API.

**API:**
```http
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
  "message": "Featured menu items retrieved successfully"
}
```

---

### **6. FoodMenuSection**

**المشكلة:** بيانات static حالياً، يحتاج APIs.

**APIs:**

**1. Categories:**
```http
GET /api/v1/menu-categories?branch_id={branch_id}
```

**2. Menu Items:**
```http
GET /api/v1/menu-items?branch_id={branch_id}&category_id={category_id}&limit=10
```

**Response المتوقع:**

**Categories:**
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
      }
    ]
  },
  "message": "Menu categories retrieved successfully"
}
```

**Menu Items:**
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

---

### **7. OfferCards**

**المشكلة:** لا يوجد API، يحتاج إنشاء API جديد.

**API:**
```http
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

---

### **8. CTASection**

**المشكلة:** لا يوجد API، يحتاج إنشاء API جديد.

**API:**
```http
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

---

### **9. TimerSection**

**المشكلة:** لا يوجد API، يحتاج إنشاء API جديد.

**API:**
```http
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

---

### **10. TestimonialSection**

**المشكلة:** لا يوجد API، يحتاج إنشاء API جديد.

**API:**
```http
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

---

### **11. GallerySection**

**المشكلة:** لا يوجد API، يحتاج إنشاء API جديد.

**API:**
```http
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

---

## **Sidebar APIs**

### **12. Sidebar Contact Info**

**الحالة:** ✅ **موجود API ومتصل**

**API:**
```http
GET /api/v1/branches/{branch_id}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "branch": {
      "id": 4,
      "address": "Pette Kyosheta, Vitosha Blvd 81, 1463 Sofia, Bulgaria",
      "email": "sofia@shahryarrestaurant.com",
      "phone": "+359 2 123 4567",
      "working_hours": []
    }
  }
}
```

**ملاحظات:**
- ✅ هذا الـ API موجود ومتصل بالفعل
- ✅ يتم استخدام `address`, `email`, `phone` من branch API
- ⚠️ `working_hours` قد تكون array فارغة، في هذه الحالة يتم عرض "Mon-Friday, 09am - 05pm" كقيمة افتراضية

---

### **13. Sidebar Gallery Images**

**المشكلة:** لا يوجد API، يحتاج إنشاء API جديد.

**API:**
```http
GET /api/v1/gallery?branch_id={branch_id}&limit=6
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
        "image": "https://example.com/gallery/header/01.jpg",
        "title": "Gallery Image 1",
        "order": 1,
        "is_active": true
      }
    ]
  },
  "message": "Gallery items retrieved successfully"
}
```

**ملاحظات:**
- ❌ هذا الـ API ناقص (نفس API للـ GallerySection)
- يمكن استخدام نفس Gallery API للـ Sidebar والـ GallerySection

---

## **Favorites (Wishlist) APIs**

### **14. Get Customer Favorites**

**الحالة:** ✅ **موجود API ومتصل**

**API:**
```http
GET /api/v1/customer/favorites
Authorization: Bearer {token}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {
    "favorites": [
      {
        "menu_item_id": 10,
        "order_count": 1,
        "total_quantity": "1",
        "menu_item": {
          "id": 10,
          "category_id": 2,
          "name": "Chicken Wings",
          "description": "Chicken wings marinated in buffalo or honey mustard sauce",
          "price": "20.00",
          "image": "menu-items/mGi0xNheI0BuZzrN1UkGOkPk3sL8DEzRGihxNlNb.jpg",
          "is_available": true,
          "is_featured": true,
          "preparation_time_minutes": 19,
          "sort_order": 0,
          "created_at": "2025-10-21T09:35:43.000000Z",
          "updated_at": "2025-10-22T07:14:44.000000Z",
          "branch_id": 4,
          "special_chief": false,
          "popular": false,
          "tag": null,
          "image_url": "https://shahrayar.peaklink.pro/storage/menu-items/mGi0xNheI0BuZzrN1UkGOkPk3sL8DEzRGihxNlNb.jpg",
          "default_price": "20.00"
        }
      }
    ]
  },
  "message": "Favorites retrieved successfully"
}
```

**ملاحظات:**
- ✅ هذا الـ API موجود ومتصل بالفعل
- ✅ الـ response structure مطابق لما يتوقعه الـ frontend
- ✅ الـ frontend يدعم `response.data.favorites` array structure
- ⚠️ يجب التأكد من أن `menu_item` object موجود في كل favorite item

---

### **15. Add Item to Favorites**

**الحالة:** ✅ **موجود API ومتصل**

**API:**
```http
POST /api/v1/customer/favorites/{menu_item_id}
Authorization: Bearer {token}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

**ملاحظات:**
- ✅ هذا الـ API موجود ومتصل بالفعل
- ✅ الـ response structure مطابق لما يتوقعه الـ frontend
- ✅ الـ frontend يتحقق من `response.success` فقط
- ⚠️ بعد إضافة العنصر، الـ frontend يستدعي `GET /customer/favorites` تلقائياً لتحديث القائمة

---

### **16. Remove Item from Favorites**

**الحالة:** ✅ **موجود API ومتصل**

**API:**
```http
DELETE /api/v1/customer/favorites/{menu_item_id}
Authorization: Bearer {token}
```

**Response المتوقع:**
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

**ملاحظات:**
- ✅ هذا الـ API موجود ومتصل بالفعل
- ✅ الـ response structure مطابق لما يتوقعه الـ frontend
- ✅ الـ frontend يتحقق من `response.success` فقط
- ✅ بعد حذف العنصر، الـ frontend يحدّث الـ local state مباشرة (لا يحتاج refresh)

---

### **ملاحظات عامة على Favorites APIs:**

1. **Authentication:** جميع الـ endpoints تتطلب Bearer token
2. **Response Structure:** جميع الـ responses تستخدم نفس الـ structure:
   ```json
   {
     "success": true/false,
     "data": {},
     "message": "Operation message"
   }
   ```
3. **Error Handling:** الـ frontend يتعامل مع:
   - `success: false` → يعرض error message
   - `requiresAuth: true` → يوجه المستخدم لصفحة login
   - Network errors → يعرض generic error message
4. **Data Transformation:** الـ frontend يحول `menu_item` object إلى structure موحد محلياً
5. **Caching:** الـ frontend يستخدم cache لمدة 30 ثانية لتقليل الطلبات

---

## **ملخص**

| # | API | المشكلة | المطلوب |
|---|-----|---------|---------|
| **1** | `POST /auth/forgot-password` | يرسل OTP للموبايل | تعديل ليرسل OTP للإيميل |
| **2** | `GET /auth/google/callback` | يعيد JSON | تعديل ليعيد HTML مع postMessage |
| **3** | `POST /payments/stripe/confirm-payment` | لا يحدّث `status` | تعديل لتحديث `status = "confirmed"` |
| **4** | `GET /slides` | بيانات static | ربط بالـ API الموجود |
| **5** | `GET /menu-items?featured=true` | بيانات static | ربط بالـ API الموجود |
| **6** | `GET /menu-categories` + `/menu-items` | بيانات static | ربط بالـ API الموجود |
| **7** | `GET /offers` | لا يوجد API | إنشاء API جديد |
| **8** | `GET /cta` | لا يوجد API | إنشاء API جديد |
| **9** | `GET /special-offer` | لا يوجد API | إنشاء API جديد |
| **10** | `GET /testimonials` | لا يوجد API | إنشاء API جديد |
| **11** | `GET /gallery` | لا يوجد API | إنشاء API جديد |
| **12** | `GET /branches/{branch_id}` | ✅ موجود ومتصل | ✅ لا يحتاج تعديل |
| **13** | `GET /gallery?limit=6` | لا يوجد API | إنشاء API جديد (للـ Sidebar) |
| **14** | `GET /customer/favorites` | ✅ موجود ومتصل | ✅ لا يحتاج تعديل |
| **15** | `POST /customer/favorites/{id}` | ✅ موجود ومتصل | ✅ لا يحتاج تعديل |
| **16** | `DELETE /customer/favorites/{id}` | ✅ موجود ومتصل | ✅ لا يحتاج تعديل |

---

## **Priority**

**High Priority:**
- APIs #1, #2 (Authentication)
- API #3 (Payment - Stripe)
- APIs #4, #5, #6 (Home Page - موجودة تحتاج ربط)

**Medium Priority:**
- APIs #7, #8, #9, #11, #13 (Offers, CTA, Timer, Gallery, Sidebar Gallery)

**Low Priority:**
- API #10 (Testimonials)

✅ **Frontend جاهز 100%** - لا يحتاج تعديلات.
