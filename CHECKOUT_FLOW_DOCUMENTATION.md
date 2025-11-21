# 📚 Checkout Flow - Documentation كاملة

## 📋 جدول المحتويات

1. [نظرة عامة](#نظرة-عامة)
2. [البنية الأساسية](#البنية-الأساسية)
3. [الصفحات والمكونات](#الصفحات-والمكونات)
4. [Flow كامل خطوة بخطوة](#flow-كامل-خطوة-بخطوة)
5. [Stores المستخدمة](#stores-المستخدمة)
6. [APIs المستخدمة](#apis-المستخدمة)
7. [Payment Flows](#payment-flows)
8. [Error Handling](#error-handling)

---

## 🎯 نظرة عامة

نظام Checkout في التطبيق يتكون من:
- **صفحة رئيسية** (`/checkout`) - نموذج إدخال البيانات
- **صفحات Stripe** - للدفع الإلكتروني (`/checkout/stripe/pay`, `/checkout/stripe/success`, `/checkout/stripe/failed`)
- **مكونات متعددة** - لإدارة العنوان، طريقة الدفع، الكوبونات، إلخ
- **State Management** - باستخدام Zustand stores

---

## 🏗️ البنية الأساسية

### هيكل الملفات:

```
src/
├── app/
│   └── checkout/
│       ├── page.jsx                    # الصفحة الرئيسية
│       └── stripe/
│           ├── pay/page.jsx            # صفحة الدفع Stripe
│           ├── success/page.jsx        # صفحة نجاح الدفع
│           └── failed/page.jsx          # صفحة فشل الدفع
├── components/
│   └── pages/
│       └── checkout/
│           ├── BillingForm.jsx         # النموذج الرئيسي
│           ├── ShippingAddressSection.jsx
│           ├── PaymentMethodSection.jsx
│           ├── CouponSection.jsx
│           ├── PlaceOrderButton.jsx
│           ├── CheckoutSummary.jsx
│           ├── AddressSelector.jsx
│           └── OrderTypeSelector.jsx
├── store/
│   ├── cartStore.js                   # Cart state
│   ├── authStore.js                   # User state
│   ├── branchStore.js                 # Branch state
│   └── toastStore.js                  # Toast notifications
└── api/
    ├── orders.js                      # Orders API
    └── payments.js                    # Payments API
```

---

## 📄 الصفحات والمكونات

### 1. `/checkout` - الصفحة الرئيسية

**الملف:** `src/app/checkout/page.jsx`

**الوظيفة:**
- صفحة Checkout الرئيسية
- التحقق من authentication (يجب أن يكون المستخدم مسجل دخول)
- التحقق من أن Cart غير فارغ
- عرض `BillingForm` و `CheckoutSummary`

**التحققات:**
```javascript
// Redirect to login if not authenticated
if (!isAuthenticated) {
  router.push("/login");
  return;
}

// Redirect to cart if cart is empty
if (items.length === 0) {
  router.push("/cart");
}
```

**التخطيط:**
- Grid layout: 2 columns على desktop (BillingForm + CheckoutSummary)
- 1 column على mobile

---

### 2. `BillingForm` - النموذج الرئيسي

**الملف:** `src/components/pages/checkout/BillingForm.jsx`

**الوظيفة:**
- النموذج الرئيسي لإنشاء الطلب
- يجمع بيانات العنوان، طريقة الدفع، الكوبونات، الملاحظات
- ينفذ `handlePlaceOrder` عند الضغط على "Place Order"

**State:**
```javascript
const [formData, setFormData] = useState({
  // Shipping address fields (only for delivery)
  address: user?.address?.street || "",
  city: user?.address?.city || "",
  state: user?.address?.state || "",
  zipCode: user?.address?.zipCode || "",
  country: user?.address?.country || "",
  latitude: null,
  longitude: null,
  address_id: null,
  // Payment and order fields
  paymentMethod: "cash", // Default to cash
  scheduled_at: "",
  notes: "",
});
```

**المكونات الفرعية:**
1. `ShippingAddressSection` - العنوان و Order Type
2. `CouponSection` - الكوبونات
3. `PaymentMethodSection` - طريقة الدفع
4. `PlaceOrderButton` - زر إنشاء الطلب

**Validation:**
```javascript
const validateForm = () => {
  // 1. Validate user data (name, email, phone)
  // 2. Validate address (if delivery)
  // 3. Validate payment method
  return true/false;
};
```

---

### 3. `ShippingAddressSection` - قسم العنوان

**الملف:** `src/components/pages/checkout/ShippingAddressSection.jsx`

**الوظيفة:**
- عرض/تعديل عنوان التوصيل (للـ delivery)
- اختيار Order Type (pickup/delivery)
- اختيار عنوان محفوظ أو إدخال عنوان جديد
- جدولة الطلب (اختياري)

**المكونات الفرعية:**
- `OrderTypeSelector` - اختيار pickup/delivery
- `AddressSelector` - اختيار عنوان محفوظ

**الحقول:**
- `address` (required for delivery)
- `city` (required for delivery)
- `state` (required for delivery)
- `zipCode` (required for delivery)
- `country` (required for delivery)
- `latitude`, `longitude` (optional)
- `address_id` (if using saved address)
- `scheduled_at` (optional datetime)

---

### 4. `PaymentMethodSection` - قسم طريقة الدفع

**الملف:** `src/components/pages/checkout/PaymentMethodSection.jsx`

**الوظيفة:**
- اختيار طريقة الدفع (Cash أو Stripe)
- عرض رسالة توضيحية حسب طريقة الدفع

**الخيارات:**
- **Cash**: "You will pay in cash when the order is picked up/delivered"
- **Stripe**: "Stripe payment method selected"

---

### 5. `CouponSection` - قسم الكوبونات

**الملف:** `src/components/pages/checkout/CouponSection.jsx`

**الوظيفة:**
- إدخال كود كوبون
- التحقق من صحة الكوبون
- عرض الكوبونات المتاحة
- إزالة الكوبون المطبق

**APIs المستخدمة:**
- `api.coupons.validateCoupon()` - التحقق من الكوبون
- `api.orders.getAvailableCoupons()` - جلب الكوبونات المتاحة

**State Management:**
- يستخدم `cartStore` لتطبيق/إزالة الكوبون
- `applyCoupon()` - تطبيق الكوبون
- `removeCoupon()` - إزالة الكوبون

---

### 6. `/checkout/stripe/pay` - صفحة الدفع Stripe

**الملف:** `src/app/checkout/stripe/pay/page.jsx`

**الوظيفة:**
- عرض Stripe Payment Element
- معالجة الدفع
- Redirect إلى success/failed page

**Query Parameters:**
- `order_id` - Order ID
- `client_secret` - Stripe Payment Intent client secret

**Flow:**
1. قراءة `order_id` و `client_secret` من URL
2. تهيئة Stripe Elements
3. عرض Payment Element
4. عند submit:
   - استدعاء `stripe.confirmPayment()`
   - إذا نجح → Redirect إلى `/checkout/stripe/success`
   - إذا فشل → Redirect إلى `/checkout/stripe/failed`

**الكود الرئيسي:**
```javascript
const { error: stripeError, paymentIntent } = await stripe.confirmPayment({
  elements,
  confirmParams: {
    return_url: `${window.location.origin}/checkout/stripe/success?order_id=${orderId}`,
  },
  redirect: 'always', // Always redirect after payment
});
```

---

### 7. `/checkout/stripe/success` - صفحة نجاح الدفع

**الملف:** `src/app/checkout/stripe/success/page.jsx`

**الوظيفة:**
- تأكيد الدفع مع Backend
- جلب تفاصيل الطلب
- عرض رسالة النجاح
- مسح Cart

**Query Parameters:**
- `order_id` - Order ID
- `payment_intent` - Stripe Payment Intent ID (يضيفه Stripe تلقائياً)

**Flow:**
1. قراءة `order_id` و `payment_intent` من URL
2. مسح Cart فوراً
3. استدعاء `api.payments.confirmStripePayment()` لتأكيد الدفع
4. جلب تفاصيل الطلب من `api.orders.getOrderById()`
5. إذا لم يتم التأكيد → Polling كل 2 ثانية (حتى 10 محاولات)
6. عرض success message مع تفاصيل الطلب

**Polling Mechanism:**
```javascript
const startPolling = () => {
  const pollInterval = setInterval(async () => {
    // Poll order status every 2 seconds
    const isConfirmed = await fetchOrderDetails();
    if (isConfirmed || pollingCount >= maxPollingAttempts) {
      clearInterval(pollInterval);
    }
  }, 2000);
};
```

---

### 8. `/checkout/stripe/failed` - صفحة فشل الدفع

**الملف:** `src/app/checkout/stripe/failed/page.jsx`

**الوظيفة:**
- عرض رسالة خطأ
- خيارات: Retry Payment, Back to Checkout, Go Home

**Query Parameters:**
- `order_id` - Order ID (optional)
- `error` - Error message (URL encoded)

---

## 🔄 Flow كامل خطوة بخطوة

### Flow 1: Cash Payment (الدفع نقداً)

```
1. User في صفحة /checkout
   ↓
2. User يملأ النموذج:
   - العنوان (إذا delivery)
   - طريقة الدفع: Cash
   - الكوبون (اختياري)
   - الملاحظات (اختياري)
   ↓
3. User يضغط "Place Order"
   ↓
4. BillingForm.handlePlaceOrder():
   a. التحقق من البيانات (validateForm)
   b. حساب Totals (subtotal, tax, delivery, total)
   c. إعداد orderData
   d. POST /api/v1/orders (Create Order)
   ↓
5. إذا نجح:
   - clearCart() - مسح Cart
   - toastSuccess("Order placed successfully!")
   - Redirect إلى /orders/{orderId}/success
   ↓
6. صفحة Success تعرض تفاصيل الطلب
```

**API Calls:**
- `POST /api/v1/orders` - Create Order

---

### Flow 2: Stripe Payment (الدفع الإلكتروني)

```
1. User في صفحة /checkout
   ↓
2. User يملأ النموذج:
   - العنوان (إذا delivery)
   - طريقة الدفع: Stripe
   - الكوبون (اختياري)
   - الملاحظات (اختياري)
   ↓
3. User يضغط "Place Order"
   ↓
4. BillingForm.handlePlaceOrder():
   a. التحقق من البيانات (validateForm)
   b. حساب Totals
   c. إعداد orderData
   d. POST /api/v1/orders (Create Order)
   ↓
5. إذا نجح Create Order:
   - POST /api/v1/payments/stripe/create-payment-intent
   - Get client_secret و payment_intent_id
   ↓
6. Redirect إلى /checkout/stripe/pay?order_id=X&client_secret=Y
   ↓
7. صفحة Stripe Payment:
   - عرض Stripe Payment Element
   - User يدخل بيانات البطاقة
   - User يضغط "Pay Now"
   ↓
8. stripe.confirmPayment():
   - Stripe يعالج الدفع
   - إذا نجح → Redirect إلى /checkout/stripe/success?order_id=X&payment_intent=Y
   - إذا فشل → Redirect إلى /checkout/stripe/failed?order_id=X&error=Y
   ↓
9. صفحة Success:
   a. clearCart() - مسح Cart
   b. POST /api/v1/payments/stripe/confirm-payment (Confirm Payment)
   c. GET /api/v1/orders/{id} (Fetch Order Details)
   d. إذا لم يتم التأكيد → Polling كل 2 ثانية
   e. عرض success message
   ↓
10. User يرى تفاصيل الطلب ويمكنه:
    - View Order
    - Continue Shopping
    - Go Home
```

**API Calls:**
- `POST /api/v1/orders` - Create Order
- `POST /api/v1/payments/stripe/create-payment-intent` - Create Payment Intent
- `POST /api/v1/payments/stripe/confirm-payment` - Confirm Payment
- `GET /api/v1/orders/{id}` - Get Order Details (للـ polling)

---

## 🗄️ Stores المستخدمة

### 1. `cartStore` (Zustand)

**الملف:** `src/store/cartStore.js`

**State:**
```javascript
{
  items: [],              // Cart items
  coupon: null,          // Applied coupon
  deliveryCharge: 0,     // Delivery charge
  orderType: 'delivery', // 'pickup' or 'delivery'
}
```

**Actions المستخدمة في Checkout:**
- `items` - Cart items
- `getSubtotal()` - حساب Subtotal
- `getTax()` - حساب Tax
- `getDiscount()` - حساب Discount
- `getDeliveryCharge()` - حساب Delivery Charge
- `getTotal()` - حساب Total
- `orderType` - Order Type (pickup/delivery)
- `clearCart()` - مسح Cart (يتم في success page)

---

### 2. `authStore` (Zustand)

**الملف:** `src/store/authStore.js`

**State المستخدم:**
- `user` - User object (name, email, phone, address)
- `isAuthenticated` - Authentication status

**الاستخدام:**
- جلب بيانات المستخدم (name, email, phone) لإرسالها مع Order
- جلب عنوان المستخدم الافتراضي

---

### 3. `branchStore` (Zustand)

**الملف:** `src/store/branchStore.js`

**Actions المستخدمة:**
- `getSelectedBranchId()` - جلب Branch ID المختار

**الاستخدام:**
- إرسال `branch_id` مع Order

---

### 4. `toastStore` (Zustand)

**الملف:** `src/store/toastStore.js`

**Actions:**
- `success(message)` - عرض success toast
- `error(message)` - عرض error toast

---

## 🔌 APIs المستخدمة

### 1. Orders API

**الملف:** `src/api/orders.js`

#### `createOrder(orderData)`
**Endpoint:** `POST /api/v1/orders`

**Request Body:**
```javascript
{
  branch_id: 1,
  order_type: "pickup" | "delivery",
  items: [
    {
      menu_item_id: 12,
      size_id: null,
      quantity: 1,
      ingredients: [],
      special_instructions: ""
    }
  ],
  subtotal: 2.5,
  delivery_charge: 0.0,
  tax_amount: 0.25,
  discount_amount: 0.0,
  total_amount: 2.75,
  customer_name: "John Doe",
  customer_phone: "1234567890",
  customer_email: "john@example.com",
  payment_method: "cash" | "stripe",
  delivery_address: "123 Main St, City, State 12345",
  latitude: 0.0,
  longitude: 0.0,
  notes: "",
  address_id: null,        // Optional
  scheduled_at: null       // Optional (YYYY-MM-DD HH:mm:ss)
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    order: {
      id: 84,
      order_number: "ORD-03582A-20251120",
      status: "pending",
      payment_status: "pending",
      // ... other fields
    }
  }
}
```

#### `getOrderById(orderId)`
**Endpoint:** `GET /api/v1/orders/{id}`

**Response:**
```javascript
{
  success: true,
  data: {
    order: {
      id: 84,
      status: "confirmed",
      payment_status: "paid",
      // ... other fields
    }
  }
}
```

---

### 2. Payments API

**الملف:** `src/api/payments.js`

#### `createStripePaymentIntent(paymentData)`
**Endpoint:** `POST /api/v1/payments/stripe/create-payment-intent`

**Request Body:**
```javascript
{
  order_id: 84,
  amount: 2.75,
  currency: "USD"
}
```

**Response:**
```javascript
{
  success: true,
  data: {
    client_secret: "pi_xxx_secret_xxx",
    payment_intent_id: "pi_xxx"
  }
}
```

#### `confirmStripePayment(confirmData)`
**Endpoint:** `POST /api/v1/payments/stripe/confirm-payment`

**Request Body:**
```javascript
{
  payment_intent_id: "pi_xxx",
  order_id: 84
}
```

**Response (Success):**
```javascript
{
  success: true,
  data: {
    order: {
      id: 84,
      payment_status: "paid",
      status: "confirmed",
      // ... other fields
    }
  }
}
```

**Response (Error):**
```javascript
{
  success: false,
  data: {
    requires_payment_method: true,
    payment_intent_id: "pi_xxx",
    client_secret: "pi_xxx_secret_xxx",
    message: "فشلت طريقة الدفع، يرجى تقديم طريقة دفع أخرى"
  }
}
```

---

### 3. Coupons API

**الملف:** `src/api/coupons.js` (مفترض)

#### `validateCoupon(couponData)`
**Endpoint:** `POST /api/v1/coupons/validate`

**Request Body:**
```javascript
{
  code: "SAVE10",
  order_amount: 50.0,
  branch_id: 1
}
```

#### `getAvailableCoupons(orderData)`
**Endpoint:** `POST /api/v1/orders/available-coupons`

**Request Body:**
```javascript
{
  order_amount: 50.0,
  branch_id: 1,
  items: [
    { menu_item_id: 12, quantity: 1 }
  ]
}
```

---

## 💳 Payment Flows

### Cash Payment Flow

```
User → Place Order → Create Order → Clear Cart → Success Page
```

**الخطوات:**
1. User يختار "Cash" كطريقة دفع
2. عند "Place Order":
   - Create Order مع `payment_method: "cash"`
   - Order status: `"pending"`, payment_status: `"pending"`
3. Clear Cart فوراً
4. Redirect إلى `/orders/{orderId}/success`
5. Backend يتعامل مع الدفع لاحقاً

---

### Stripe Payment Flow

```
User → Place Order → Create Order → Create Payment Intent → 
Redirect to Payment Page → Stripe Payment → Redirect to Success → 
Confirm Payment → Polling → Success Message
```

**الخطوات:**
1. User يختار "Stripe" كطريقة دفع
2. عند "Place Order":
   - Create Order مع `payment_method: "stripe"`
   - Create Payment Intent → Get `client_secret`
   - Redirect إلى `/checkout/stripe/pay`
3. في Payment Page:
   - User يدخل بيانات البطاقة
   - Stripe يعالج الدفع
   - Redirect تلقائي إلى success/failed
4. في Success Page:
   - Clear Cart
   - Confirm Payment مع Backend
   - Polling للـ order status
   - عرض success message

---

## ⚠️ Error Handling

### 1. Validation Errors

**في `BillingForm.validateForm()`:**
- User غير مسجل دخول → Redirect to `/login`
- User data missing → Toast error
- Address incomplete (delivery) → Toast error
- Payment method invalid → Toast error

---

### 2. Order Creation Errors

**في `BillingForm.handlePlaceOrder()`:**
```javascript
try {
  const orderResponse = await api.orders.createOrder(orderData);
  if (!orderResponse.success) {
    throw new Error(orderResponse.message);
  }
} catch (error) {
  toastError(error.message || "Failed to place order");
  setIsProcessing(false);
}
```

---

### 3. Payment Intent Creation Errors

**في `BillingForm.handlePlaceOrder()`:**
```javascript
const intentResult = await createStripePaymentIntent(orderId, totalAmount);
if (!intentResult.success) {
  toastError(intentResult.error);
  setIsProcessing(false);
  return;
}
```

---

### 4. Stripe Payment Errors

**في `pay/page.jsx`:**
```javascript
if (stripeError) {
  setError(stripeError.message);
  // Redirect to failed page after 2 seconds
  setTimeout(() => {
    window.location.href = `/checkout/stripe/failed?order_id=${orderId}&error=${error}`;
  }, 2000);
}
```

---

### 5. Payment Confirmation Errors

**في `success/page.jsx`:**
```javascript
const confirmResult = await confirmPayment();
if (!confirmResult.success) {
  if (confirmResult.data?.requires_payment_method === true) {
    toastError("Payment failed. Please try another payment method.");
  } else {
    // Continue to polling
    console.warn("Payment confirmation error, but checking order status anyway");
  }
}
```

---

## 📊 Data Flow Diagram

```
┌─────────────┐
│   Cart      │
│   Store     │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│  Checkout   │
│   Page      │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ BillingForm │
└──────┬──────┘
       │
       ├──► ShippingAddressSection
       ├──► PaymentMethodSection
       ├──► CouponSection
       └──► PlaceOrderButton
       │
       ▼
┌─────────────┐
│ Place Order │
└──────┬──────┘
       │
       ├──► Create Order API
       │
       ├──► Cash Payment
       │    └──► Clear Cart → Success Page
       │
       └──► Stripe Payment
            ├──► Create Payment Intent
            ├──► Redirect to /checkout/stripe/pay
            ├──► Stripe Payment Processing
            ├──► Redirect to /checkout/stripe/success
            ├──► Confirm Payment API
            ├──► Polling Order Status
            └──► Clear Cart → Success Message
```

---

## 🔑 النقاط المهمة

### 1. Customer Data Source
- بيانات المستخدم (name, email, phone) تأتي من `authStore.user`
- لا يوجد نموذج منفصل لإدخال بيانات المستخدم
- العنوان يأتي من `user.address` أو يتم إدخاله يدوياً

### 2. Cart Management
- Cart لا يتم مسحه إلا بعد:
  - **Cash Payment**: بعد Create Order مباشرة
  - **Stripe Payment**: في Success Page بعد Confirm Payment

### 3. Order Status
- عند Create Order: `status: "pending"`, `payment_status: "pending"`
- بعد Stripe Payment Confirm: `status: "confirmed"`, `payment_status: "paid"`

### 4. Polling Mechanism
- في Success Page، إذا لم يتم Confirm Payment فوراً:
  - Polling كل 2 ثانية
  - حتى 10 محاولات (20 ثانية)
  - إذا لم يتم التأكيد → Warning message

### 5. Redirect Flow
- **Cash**: `/checkout` → `/orders/{orderId}/success`
- **Stripe**: `/checkout` → `/checkout/stripe/pay` → `/checkout/stripe/success`

---

## 📝 ملاحظات إضافية

### 1. Order Type
- **Pickup**: لا حاجة لعنوان، فقط branch location
- **Delivery**: يتطلب عنوان كامل (address, city, state, zipCode, country)

### 2. Scheduled Orders
- يمكن جدولة الطلب عبر `scheduled_at` field
- Format: `YYYY-MM-DD HH:mm:ss`
- Optional field

### 3. Address Management
- يمكن اختيار عنوان محفوظ من `AddressSelector`
- أو إدخال عنوان جديد
- إذا تم اختيار عنوان محفوظ → `address_id` يُرسل مع Order

### 4. Coupon Application
- الكوبونات تُطبق على Cart قبل Create Order
- Discount يُحسب في `cartStore.getDiscount()`
- `discount_amount` يُرسل مع Order

---

## ✅ Checklist للاختبار

### Cash Payment:
- [ ] User يمكنه إنشاء طلب بـ Cash
- [ ] Cart يتم مسحه بعد Create Order
- [ ] Redirect إلى Success Page
- [ ] Order يتم إنشاؤه في Backend

### Stripe Payment:
- [ ] User يمكنه إنشاء طلب بـ Stripe
- [ ] Payment Intent يتم إنشاؤه
- [ ] Redirect إلى Payment Page
- [ ] User يمكنه إدخال بيانات البطاقة
- [ ] Payment يتم معالجته
- [ ] Redirect إلى Success Page
- [ ] Payment يتم تأكيده مع Backend
- [ ] Cart يتم مسحه في Success Page
- [ ] Order status يتم تحديثه

### Error Cases:
- [ ] Validation errors تعمل بشكل صحيح
- [ ] Order creation errors يتم عرضها
- [ ] Payment errors يتم معالجتها
- [ ] Failed page تعرض error message

---

## 📞 للاستفسارات

إذا كان لديك أي أسئلة أو تحتاج توضيحات إضافية، لا تتردد في التواصل.

**آخر تحديث:** 2025-01-20

