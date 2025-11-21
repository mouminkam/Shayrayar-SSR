<!-- be520c68-cc54-4a39-ba1b-226f628215a4 e1966a08-c578-4db1-b86e-192b2de58352 -->
# Stripe Payment Integration - Backend-Based Solution

## 🔍 تحليل المشكلة الحالية (Problem Analysis)

### المشكلة الأساسية:

1. **Order ID Type Mismatch**:

   - `orderId` في `BillingForm.jsx` هو `number` (84)
   - `orderId` في `pay/page.jsx` يأتي من `searchParams.get('order_id')` وهو `string` ("84")
   - المقارنة `messageOrderId !== orderId` تفشل بسبب type mismatch
   - النتيجة: الرسالة تصل لكن لا يتم معالجتها

2. **postMessage Reliability Issues**:

   - postMessage يعتمد على timing و origin matching
   - قد تفشل في بعض المتصفحات أو مع popup blockers
   - معقد للـ debugging والصيانة

3. **Backend Status Update Missing**:

   - Backend لا يحدّث `order.payment_status` بعد confirm payment
   - Order status يبقى "pending" حتى بعد confirm
   - Fallback mechanism لا يعمل لأن order لم يتم تحديثه

### الحل المقترح (Backend-Based):

استخدام **Redirect URLs** بدلاً من postMessage:

- بعد نجاح الدفع في Stripe → Redirect إلى success URL
- Backend يحدّث order status تلقائياً عند confirm payment
- Frontend يتحقق من order status عند الوصول لصفحة success
- أكثر موثوقية وأسهل للصيانة

---

## 🎯 الهدف الجديد

تعديل التكامل ليستخدم **Backend-Based Redirect Flow** بدلاً من postMessage:

1. Stripe redirects إلى success/failed URLs بعد الدفع
2. Backend يحدّث order status عند confirm payment
3. Frontend يتحقق من order status ويحدّث UI تلقائياً

---

## A — Pre-checks (ضرورية قبل التنفيذ)

### 1. التحقق من Amount Format

- **التحقق:** هل API يتوقع `amount` كـ decimal (2.75) أم cents (275)?
- **الحل الحالي:** نرسل `amount: 2.75` (decimal) - يجب التأكد من Backend
- **ملاحظة:** Stripe يتوقع cents، لكن Backend قد يحولها

### 2. Backend Stripe Secret Key

- **التحقق:** Backend يستخدم `sk_test_...` لإنشاء PaymentIntent
- **التحقق:** Backend يضبط `return_url` في PaymentIntent (اختياري للـ Elements)

### 3. Confirm Payment Endpoint

- **التحقق:** `/payments/stripe/confirm-payment` يقوم بـ:
  - Retrieve PaymentIntent من Stripe
  - التحقق من `status === "succeeded"`
  - تحديث `order.payment_status` في Database
  - إرجاع `requires_payment_method` إذا فشل

### 4. CORS Configuration

- **التحقق:** Backend يدعم CORS للـ Next.js frontend
- **التحقق:** Headers: `Access-Control-Allow-Origin`, `Access-Control-Allow-Methods`

---

## B — Files To Create (Client-Side)

### 1. `src/lib/getStripe.js`

**الوظيفة:** تحميل Stripe client-side فقط

**المحتوى:**

- `import { loadStripe } from '@stripe/stripe-js'`
- Singleton pattern (stripePromise)
- Check `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`
- Return stripe promise (null if SSR)

### 2. `src/lib/utils/paymentProcessor.js`

**الوظيفة:** معالجة Stripe payments

**Functions:**

- `createStripePaymentIntent(orderId, amount)` - استدعاء API `/payments/stripe/create-payment-intent`
- `openStripePaymentPopup(orderId, clientSecret)` - فتح popup window
- `listenForPaymentResult(popup, orderId, callbacks)` - استماع postMessage من popup
- `processStripePayment(orderId, amount)` - Main function يجمع كل الخطوات

**Popup Handling:**

- `window.open()` لفتح `/checkout/stripe/pay?order_id=X&client_secret=Y`
- معالجة popup blocked
- Fallback: فتح في tab جديد إذا popup blocked

### 3. `src/app/checkout/stripe/pay/page.jsx`

**الوظيفة:** صفحة Payment داخل Popup

**المحتوى:**

- `"use client"` directive
- `<Elements stripe={stripePromise} options={{ clientSecret }}>`
- `<PaymentElement />` من `@stripe/react-stripe-js`
- `stripe.confirmPayment({ elements, confirmParams: { return_url } })`
- عند النجاح:
  - استدعاء `/payments/stripe/confirm-payment` API
  - `window.opener.postMessage({ type: 'STRIPE_PAYMENT_SUCCESS', orderId }, window.location.origin)`
  - `window.close()`
- عند الفشل:
  - `window.opener.postMessage({ type: 'STRIPE_PAYMENT_ERROR', error }, window.location.origin)`
  - عرض error message

### 4. `src/app/checkout/stripe/success/page.jsx`

**الوظيفة:** صفحة Success بعد الدفع

**المحتوى:**

- استقبال `order_id` من query params
- عرض order details
- Clear cart (إذا لم يتم clear)
- Redirect options (View Order, Continue Shopping)

### 5. `src/app/checkout/stripe/cancel/page.jsx`

**الوظيفة:** صفحة Cancel

**المحتوى:**

- رسالة cancel
- Retry payment button
- Back to checkout

---

## C — Modify BillingForm.jsx

### في `handlePlaceOrder()` بعد `createOrder()`:

**التعديلات:**

1. بعد إنشاء Order بنجاح → الحصول على `orderId`
2. إذا `paymentMethod === "stripe"`:

   - استدعاء `processStripePayment(orderId, totalAmount)`
   - فتح popup
   - استماع لـ postMessage
   - عند success → clearCart → redirect to success
   - عند error → show error → allow retry

3. إذا `paymentMethod === "cash"`:

   - clearCart → Success (الـ flow الحالي)

**Code Structure:**

```javascript
const orderId = createdOrder.id;

if (formData.paymentMethod === "stripe") {
  const paymentResult = await processStripePayment(orderId, totalAmount);
  if (!paymentResult.success) {
    // Error handling
    return;
  }
  
  const popup = openStripePaymentPopup(orderId, paymentResult.client_secret);
  if (!popup) {
    // Popup blocked handling
    return;
  }
  
  listenForPaymentResult(popup, orderId, {
    onSuccess: () => {
      clearCart();
      router.push(`/checkout/stripe/success?order_id=${orderId}`);
    },
    onError: (error) => {
      toastError(error);
      setIsProcessing(false);
    }
  });
} else {
  // Cash flow
  clearCart();
  router.push(`/orders/${orderId}/success`);
}
```

---

## D — Backend Requirements (شرح واضح)

### 1. `POST /payments/stripe/create-payment-intent`

**المطلوب:**

- استقبال: `{ order_id, amount, currency: "USD" }`
- استخدام Stripe Secret Key لإنشاء PaymentIntent:
  ```javascript
  stripe.paymentIntents.create({
    amount: amount * 100, // Convert to cents
    currency: 'usd',
    metadata: { order_id }
  })
  ```

- إرجاع: `{ success: true, data: { client_secret, payment_intent_id } }`

**Idempotency:**

- استخدام `idempotency_key` بناءً على `order_id`
- منع إنشاء PaymentIntent جديد لنفس Order
- Example: `idempotency_key: "order_${order_id}_${timestamp}"`

### 2. `POST /payments/stripe/confirm-payment`

**المطلوب:**

- استقبال: `{ payment_intent_id, order_id }`
- Retrieve PaymentIntent من Stripe:
  ```javascript
  const paymentIntent = await stripe.paymentIntents.retrieve(payment_intent_id);
  ```

- التحقق من `paymentIntent.status === "succeeded"`
- تحديث `order.payment_status = "paid"` في Database
- إرجاع: `{ success: true, data: { requires_payment_method, payment_intent_id, message } }`

**Webhook (مُفضّل):**

- إضافة webhook endpoint: `/webhooks/stripe`
- Listen for `payment_intent.succeeded` event
- تحديث `order.payment_status` تلقائياً
- أكثر موثوقية من client-side confirmation
- Handles edge cases (network failures, etc.)

### 3. Error Handling في Backend

- معالجة Stripe API errors
- إرجاع رسائل خطأ واضحة
- Logging للأخطاء للـ debugging

---

## E — Error Handling

### 1. Popup Blocked

**الحل:**

```javascript
if (!popup || popup.closed) {
  toastError("Popup blocked. Please allow popups for this site.");
  // Fallback: فتح في tab جديد
  window.open(paymentUrl, '_blank');
}
```

### 2. requires_payment_method === true

**الحل:**

```javascript
if (confirmResult.data?.requires_payment_method === tre) {
  toastError(confirmResult.data?.message || "Payment failed. Please try another payment method.");
  // Allow retry
  setIsProcessing(false);
  // Don't clear cart
}
```

### 3. Network Errors

**الحل:**

- Retry mechanism (3 attempts with exponential backoff)
- Show user-friendly error messages
- Don't clear cart on error
- Log errors for debugging

### 4. Payment Intent Creation Failed

**الحل:**

- Show error toast with specific message
- Don't clear cart
- Allow user to retry
- Log error details

### 5. Cart Management

**القاعدة:** لا يتم clearCart إلا بعد:

- ✅ Payment confirmation successful
- ✅ `requires_payment_method === false`
- ✅ Order status updated
- ✅ Success message shown

---

## F — Testing Scenarios

### 1. Cash Order Flow

- [ ] Create order with cash payment
- [ ] Order created successfully
- [ ] Cart cleared immediately
- [ ] Redirect to success page
- [ ] Order visible in orders list

### 2. Stripe Order Flow (Success)

- [ ] Create order with stripe payment
- [ ] Payment Intent created successfully
- [ ] Popup opens correctly (600x700, centered)
- [ ] Payment form displayed (PaymentElement)
- [ ] Enter test card: `4242 4242 4242 4242`
- [ ] Payment completed successfully
- [ ] postMessage sent to parent window
- [ ] Payment confirmed via API
- [ ] Cart cleared
- [ ] Redirect to success page
- [ ] Order payment_status = "paid"

### 3. Payment Failure

- [ ] Use decline card: `4000 0000 0000 0002`
- [ ] Error message displayed in popup
- [ ] postMessage sent with error
- [ ] Error toast shown in parent
- [ ] Cart NOT cleared
- [ ] Retry option available
- [ ] Popup can be closed and reopened

### 4. 3D Secure Test

- [ ] Use 3DS card: `4000 0025 0000 3155`
- [ ] 3DS authentication flow appears
- [ ] Complete authentication
- [ ] Payment completed after auth
- [ ] Success flow continues
- [ ] Order confirmed

### 5. Popup Blocked Test

- [ ] Block popups in browser settings
- [ ] Error message shown: "Popup blocked"
- [ ] Fallback: payment page opens in new tab
- [ ] Payment flow continues in tab
- [ ] postMessage still works (same origin)

### 6. Webhook Confirmation

- [ ] Complete payment successfully
- [ ] Webhook received at backend
- [ ] Order payment_status updated automatically
- [ ] Database consistent
- [ ] No duplicate confirmations

### 7. Network Failure

- [ ] Simulate network error during payment
- [ ] Error handling works correctly
- [ ] Retry mechanism available
- [ ] User can retry payment
- [ ] No cart clearing on error

### 8. Idempotency Test

- [ ] Create PaymentIntent twice for same order
- [ ] Same PaymentIntent returned (no duplicate)
- [ ] No duplicate charges
- [ ] Order linked correctly

### 9. Multiple Payment Attempts

- [ ] First payment fails
- [ ] Retry payment for same order
- [ ] New PaymentIntent created (or reused)
- [ ] Second payment succeeds
- [ ] Order updated correctly

---

## Implementation Order

1. ✅ Create `src/lib/getStripe.js`
2. ✅ Create `src/lib/utils/paymentProcessor.js`
3. ✅ Create `src/app/checkout/stripe/pay/page.jsx` (Popup page)
4. ✅ Create `src/app/checkout/stripe/success/page.jsx`
5. ✅ Create `src/app/checkout/stripe/cancel/page.jsx`
6. ✅ Modify `src/components/pages/checkout/BillingForm.jsx`
7. ✅ Add `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` to `.env.local`
8. ✅ Test all scenarios

---

## Environment Variables

**File: `.env.local`**

```env
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_51SFA2MBPbQdTKlXtJanoX2tJwRfm1mHmx7TegIssQhKJvjTkhqGL3oCHm5ToVMaBApFmCA7wLX6TzWBfKxXvKNO900Hl48FRtg
```

---

## Technical Notes

- **لا استخدام Stripe Checkout Session** - فقط PaymentIntent + Elements
- **Popup Window** - أفضل UX من redirect (يبقى المستخدم في نفس السياق)
- **postMessage** - للتواصل بين popup و parent window (same origin)
- **Backend Verification** - confirm-payment يتحقق من Stripe server-side
- **Webhook Recommended** - لموثوقية أعلى وتحديث تلقائي
- **Idempotency** - مهم لمنع duplicate charges
- **Error Recovery** - معالجة شاملة للأخطاء مع retry options