# متطلبات Backend - Stripe Payment Integration

## 📋 نظرة عامة

تم تحديث تكامل Stripe في Frontend لاستخدام **Redirect URLs** بدلاً من `postMessage` لتحسين الموثوقية وحل مشاكل Order ID type mismatch.

---

## 🔄 التغييرات في Frontend

### ما تم تغييره:

1. **إزالة postMessage Logic**:
   - تم حذف كل كود `postMessage` بين popup والـ parent window
   - تم حذف `listenForPaymentResult` function بالكامل

2. **استخدام Redirect URLs**:
   - بعد نجاح الدفع في Stripe → Redirect تلقائي إلى `/checkout/stripe/success`
   - في حالة الفشل → Redirect إلى `/checkout/stripe/failed`

3. **Confirm Payment في Success Page**:
   - عند وصول المستخدم لصفحة success، يتم استدعاء `confirm-payment` API تلقائياً
   - يتم عمل polling للـ order status إذا لم يتم التأكيد فوراً

---

## 🔄 Flow الكامل - خطوة بخطوة

### 📊 Flow Diagram:

```
┌─────────────────────────────────────────────────────────────────┐
│                    STRIPE PAYMENT FLOW                          │
└─────────────────────────────────────────────────────────────────┘

[1] User clicks "Place Order" button
        |
        v
[2] Frontend: POST /api/v1/orders
        |
        Body: {
          branch_id: 1,
          order_type: "pickup",
          items: [...],
          payment_method: "stripe",
          total_amount: 49.50,
          ...
        }
        |
        v
[3] Response: { success: true, data: { order: { id: 114, status: "pending", payment_status: "pending" } } }
        |
        ✅ Order created successfully
        |
        v
[4] Frontend: POST /api/v1/payments/stripe/create-payment-intent
        |
        Body: {
          order_id: 114,
          amount: 49.5,
          currency: "USD",
          branch_id: 1
        }
        |
        v
[5] Response: {
        success: true,
        data: {
          client_secret: "pi_xxx_secret_xxx",
          payment_intent_id: "pi_xxx"
        }
      }
        |
        ✅ Payment Intent created in Stripe
        |
        v
[6] Frontend opens Stripe Payment Page
        |
        URL: /checkout/stripe/pay?order_id=114&client_secret=pi_xxx_secret_xxx
        |
        v
[7] User enters card details in Stripe Elements
        |
        Test Card: 4242 4242 4242 4242
        Expiry: Any future date
        CVC: Any 3 digits
        |
        v
[8] User clicks "Pay Now"
        |
        v
[9] Frontend: stripe.confirmPayment()
        |
        Stripe processes payment
        |
        v
[10] Stripe redirects automatically
        |
        Success URL: /checkout/stripe/success?order_id=114&payment_intent=pi_xxx
        |
        ✅ Payment succeeded in Stripe
        |
        v
[11] Success Page loads
        |
        - Clears cart immediately
        - Calls confirm-payment API
        |
        v
[12] Frontend: POST /api/v1/payments/stripe/confirm-payment
        |
        Body: {
          payment_intent_id: "pi_xxx",
          order_id: 114,
          branch_id: 1
        }
        |
        v
[13] Backend: Verify payment with Stripe API
        |
        - Retrieve payment_intent from Stripe
        - Check if status === "succeeded"
        |
        v
[14] Backend: Update Order Status ⚠️ **هنا المشكلة الحالية**
        |
        ❌ Currently: Only updates payment_status = "paid"
        ✅ Should also: Update status = "confirmed" (or "processing")
        |
        Code needed:
        $order->payment_status = 'paid';
        $order->status = 'confirmed';  // ← هذا ناقص!
        $order->payment_intent_id = $paymentIntent->id;
        $order->paid_at = now();
        $order->save();
        |
        v
[15] Response: {
        success: true,
        data: {
          order: {
            id: 114,
            payment_status: "paid",      // ✅ Updated
            status: "confirmed",         // ❌ Still "pending" (should be "confirmed")
            payment_intent_id: "pi_xxx",
            paid_at: "2025-11-24T13:09:59Z"
          }
        }
      }
        |
        v
[16] Frontend: Check order status
        |
        if (order.payment_status === 'paid' && order.status === 'confirmed') {
          ✅ Show success message
        } else {
          ⚠️ Start polling...
        }
        |
        v
[17] Frontend: Poll GET /api/v1/orders/114 (if needed)
        |
        - Poll every 2 seconds
        - Max 10 attempts (20 seconds)
        - Check: payment_status === 'paid' && status === 'confirmed'
        |
        v
[18] Show Success Page
        |
        ✅ Payment successful message
        ✅ Order details displayed
        ✅ Cart cleared
        ✅ Links to view order / continue shopping
```

---

### 📝 تفاصيل كل خطوة:

#### **الخطوة 1-3: إنشاء Order**
- User يملأ بيانات الطلب ويختار Stripe كطريقة دفع
- Frontend يرسل Order إلى Backend
- Backend ينشئ Order مع `status: "pending"` و `payment_status: "pending"`

#### **الخطوة 4-5: إنشاء Payment Intent**
- Frontend يطلب إنشاء Payment Intent من Stripe
- Backend يستدعي Stripe API لإنشاء Payment Intent
- Stripe يرجع `client_secret` و `payment_intent_id`

#### **الخطوة 6-9: معالجة الدفع**
- Frontend يفتح صفحة Stripe Payment
- User يدخل بيانات البطاقة (في Test Mode: `4242 4242 4242 4242`)
- Stripe يعالج الدفع

#### **الخطوة 10-12: Redirect و Confirm Payment**
- Stripe يعيد التوجيه تلقائياً إلى Success Page
- Success Page تستدعي `confirm-payment` API فوراً

#### **الخطوة 13-15: تحديث Order Status** ⚠️ **المشكلة هنا**
- Backend يجب أن:
  1. ✅ يتحقق من Payment Intent مع Stripe
  2. ✅ يحدّث `payment_status = "paid"` ← **هذا يعمل**
  3. ❌ يحدّث `status = "confirmed"` ← **هذا ناقص!**
  4. ✅ يحفظ `payment_intent_id` و `paid_at`

#### **الخطوة 16-18: عرض النتيجة**
- Frontend يتحقق من Order Status
- إذا تم التأكيد → يعرض Success Message
- إذا لم يتم → يبدأ Polling (كل 2 ثانية، حتى 10 محاولات)

---

## ⚠️ المشكلة الحالية

### ما يحدث الآن:

1. ✅ Payment Intent يتم إنشاؤه بنجاح
2. ✅ User يكمل الدفع في Stripe بنجاح
3. ✅ Redirect إلى success page يحدث
4. ✅ Frontend يستدعي `confirm-payment` API
5. ✅ Backend يحدّث `payment_status = "paid"` ✅
6. ❌ **Backend لا يحدّث `status = "confirmed"`** ❌
7. ❌ Order `status` يبقى `"pending"` حتى بعد confirm payment
8. ⚠️ Frontend polling يجد `payment_status = "paid"` لكن `status = "pending"`

### الأعراض:

- ✅ Payment ناجح في Stripe
- ✅ `payment_status` يتم تحديثه إلى `"paid"`
- ❌ `status` يبقى `"pending"` بدلاً من `"confirmed"`
- ⚠️ Success page قد تعمل بشكل جزئي (تعتمد على `payment_status` فقط)
- ⚠️ لكن Order لا يعتبر "confirmed" بشكل كامل

### مثال على Response الحالي:

```json
{
  "success": true,
  "data": {
    "order": {
      "id": 114,
      "payment_status": "paid",      // ✅ تم التحديث
      "status": "pending",            // ❌ لم يتم التحديث (يجب أن يكون "confirmed")
      "payment_intent_id": "pi_xxx",  // ✅ تم الحفظ
      "paid_at": "2025-11-24T13:09:59Z" // ✅ تم الحفظ
    }
  }
}
```

### Response المطلوب:

```json
{
  "success": true,
  "data": {
    "order": {
      "id": 114,
      "payment_status": "paid",      // ✅
      "status": "confirmed",          // ✅ يجب تحديثه
      "payment_intent_id": "pi_xxx",  // ✅
      "paid_at": "2025-11-24T13:09:59Z" // ✅
    }
  }
}
```

---

## ✅ الحل المطلوب من Backend

### 1. تعديل `/payments/stripe/confirm-payment` Endpoint

**Endpoint:** `POST /api/v1/payments/stripe/confirm-payment`

**Request Body:**
```json
{
  "payment_intent_id": "pi_3SVUyYBPbQdTKlXt2zqjAOBc",
  "order_id": 84
}
```

**المطلوب:**

1. **التحقق من Payment Intent Status**:
   - استدعاء Stripe API للتحقق من `payment_intent.status`
   - إذا `status === "succeeded"` → المتابعة
   - إذا `status !== "succeeded"` → إرجاع error

2. **تحديث Order Status**:
   ```php
   // يجب تحديث جميع الحقول التالية:
   $order->payment_status = 'paid';              // ✅ هذا يعمل حالياً
   $order->status = 'confirmed';                // ❌ هذا ناقص! (أو 'processing' حسب business logic)
   $order->payment_intent_id = $paymentIntent->id; // ✅ هذا يعمل حالياً
   $order->paid_at = now();                     // ✅ هذا يعمل حالياً
   $order->save();
   ```
   
   **ملاحظة مهمة**: حالياً Backend يحدّث `payment_status` فقط، لكن لا يحدّث `status`. يجب إضافة `$order->status = 'confirmed';`

3. **Idempotency**:
   - يجب أن يكون الـ endpoint **idempotent** (آمن للاستدعاء أكثر من مرة)
   - إذا تم confirm من قبل، يجب إرجاع success بدون تحديثات إضافية

4. **Response Format**:
   ```json
   {
     "success": true,
     "data": {
       "order": {
         "id": 84,
         "payment_status": "paid",
         "status": "confirmed",
         "payment_method": "stripe",
         "total_amount": "2.75",
         // ... باقي order fields
       }
     }
   }
   ```

**Error Response (إذا payment requires payment method):**
```json
{
  "success": false,
  "data": {
    "requires_payment_method": true,
    "payment_intent_id": "pi_xxx",
    "client_secret": "pi_xxx_secret_xxx",
    "message": "فشلت طريقة الدفع، يرجى تقديم طريقة دفع أخرى"
  }
}
```

**Error Response (إذا payment failed):**
```json
{
  "success": false,
  "message": "Payment confirmation failed. Payment intent status: requires_payment_method"
}
```

---

### 2. التحقق من Order Status Endpoint

**Endpoint:** `GET /api/v1/orders/{id}`

**المطلوب:**

- يجب أن يعيد **updated status فوراً** بعد confirm payment
- لا حاجة لتعديلات إذا كان موجود ويعمل بشكل صحيح

**Expected Response:**
```json
{
  "success": true,
  "data": {
    "order": {
      "id": 84,
      "payment_status": "paid",  // ← يجب أن يكون updated
      "status": "confirmed",      // ← يجب أن يكون updated
      // ... باقي fields
    }
  }
}
```

---

## 📝 مثال على Implementation (Laravel)

```php
public function confirmStripePayment(Request $request)
{
    $request->validate([
        'payment_intent_id' => 'required|string',
        'order_id' => 'required|integer|exists:orders,id',
    ]);

    $order = Order::findOrFail($request->order_id);
    
    // Verify payment intent with Stripe
    try {
        $paymentIntent = \Stripe\PaymentIntent::retrieve($request->payment_intent_id);
        
        if ($paymentIntent->status !== 'succeeded') {
            return response()->json([
                'success' => false,
                'data' => [
                    'requires_payment_method' => $paymentIntent->status === 'requires_payment_method',
                    'payment_intent_id' => $paymentIntent->id,
                    'client_secret' => $paymentIntent->client_secret,
                    'message' => 'فشلت طريقة الدفع، يرجى تقديم طريقة دفع أخرى'
                ]
            ], 400);
        }
        
        // Check if already confirmed (idempotency)
        if ($order->payment_status === 'paid') {
            return response()->json([
                'success' => true,
                'data' => [
                    'order' => $order->fresh()
                ]
            ]);
        }
        
        // Update order status - ⚠️ تأكد من تحديث جميع الحقول
        $order->payment_status = 'paid';              // ✅ تحديث payment status
        $order->status = 'confirmed';                // ⚠️ هذا مهم جداً! (أو 'processing' حسب business logic)
        $order->payment_intent_id = $paymentIntent->id; // ✅ حفظ payment intent ID
        $order->paid_at = now();                     // ✅ حفظ وقت الدفع
        $order->save();
        
        // Reload order with relationships
        $order->refresh();
        
        return response()->json([
            'success' => true,
            'data' => [
                'order' => $order
            ]
        ]);
        
    } catch (\Stripe\Exception\ApiErrorException $e) {
        return response()->json([
            'success' => false,
            'message' => 'Payment confirmation failed: ' . $e->getMessage()
        ], 400);
    }
}
```

---

## 🧪 Testing Checklist

### 1. Test Confirm Payment Success:
- ✅ Create order
- ✅ Create payment intent
- ✅ Complete payment in Stripe (use test card: **4242 4242 4242 4242**)
- ✅ Call `confirm-payment` API
- ✅ Verify `order.payment_status === 'paid'` ← **هذا يعمل حالياً**
- ❌ Verify `order.status === 'confirmed'` ← **هذا لا يعمل (يجب إصلاحه)**
- ✅ Verify `order.payment_intent_id` is saved
- ✅ Verify `order.paid_at` is set

### 2. Test Idempotency:
- ✅ Call `confirm-payment` twice
- ✅ Verify no errors on second call
- ✅ Verify order status remains correct

### 3. Test Failed Payment:
- ✅ Create payment intent
- ✅ Cancel payment in Stripe
- ✅ Call `confirm-payment` API
- ✅ Verify error response with `requires_payment_method: true`

### 4. Test Order Status Endpoint:
- ✅ After confirm payment, call `GET /orders/{id}`
- ✅ Verify `payment_status` and `status` are updated

---

## 📞 ملاحظات مهمة

1. **Idempotency مهم جداً**:
   - Frontend قد يستدعي `confirm-payment` أكثر من مرة (من pay page و success page)
   - يجب أن يكون آمن للاستدعاء المتكرر

2. **Order Status Values**:
   - `payment_status`: `'pending'` → `'paid'`
   - `status`: `'pending'` → `'confirmed'` أو `'processing'` (حسب business logic)

3. **Error Handling**:
   - إذا `payment_intent.status !== 'succeeded'` → إرجاع error
   - إذا order غير موجود → إرجاع 404
   - إذا payment_intent غير موجود في Stripe → إرجاع error

4. **Security**:
   - التحقق من أن `order_id` يخص المستخدم الحالي (إذا كان لديك user authentication)
   - التحقق من أن `payment_intent` مرتبط بالـ order الصحيح

---

## 🎯 النتيجة المتوقعة

بعد تطبيق التحديثات:

1. ✅ User يكمل الدفع في Stripe
2. ✅ Redirect إلى success page
3. ✅ Frontend يستدعي `confirm-payment`
4. ✅ **Backend يحدّث order status → `payment_status: 'paid'` و `status: 'confirmed'`**
5. ✅ Success page يعرض success message
6. ✅ Cart يتم مسحه تلقائياً
7. ✅ User يرى order details

---

## 📊 ملخص الحالة الحالية

### ✅ ما يعمل حالياً:

1. ✅ إنشاء Order بنجاح
2. ✅ إنشاء Payment Intent في Stripe
3. ✅ معالجة الدفع في Stripe
4. ✅ Redirect إلى Success Page
5. ✅ استدعاء `confirm-payment` API
6. ✅ تحديث `payment_status = "paid"`
7. ✅ حفظ `payment_intent_id` و `paid_at`

### ❌ ما يحتاج إصلاح:

1. ❌ **تحديث `order.status` من `"pending"` إلى `"confirmed"`**

### 🔧 الحل المطلوب:

في endpoint `confirm-payment`، أضف هذا السطر:

```php
$order->status = 'confirmed'; // أو 'processing' حسب business logic
```

قبل `$order->save();`

---

## 🧪 بطاقات الاختبار (Test Cards)

### بطاقة نجاح الدفع (الأساسية):
```
Card Number: 4242 4242 4242 4242
Expiry Date: أي تاريخ في المستقبل (مثلاً: 12/25)
CVC: أي 3 أرقام (مثلاً: 123)
ZIP: أي 5 أرقام (مثلاً: 12345)
```

### بطاقات اختبار أخرى:

**بطاقة تتطلب 3D Secure:**
```
Card Number: 4000 0025 0000 3155
```

**بطاقة فشل الدفع:**
```
Card Number: 4000 0000 0000 0002
```

**بطاقة رفض الدفع:**
```
Card Number: 4000 0000 0000 9995
```

---

## 📧 للاستفسارات

إذا كان لديك أي أسئلة أو تحتاج توضيحات إضافية، لا تتردد في التواصل.

**ملاحظة:** هذا المستند يشرح التغييرات المطلوبة فقط. الكود الفعلي يعتمد على framework و structure الخاص بك.

