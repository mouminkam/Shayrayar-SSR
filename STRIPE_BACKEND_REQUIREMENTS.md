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

## 🔄 Flow الجديد (كامل)

### الخطوات:

1. **User يضغط "Place Order"**:
   ```
   POST /api/v1/orders
   Body: { branch_id, order_type, items, customer_name, ... }
   Response: { success: true, data: { order: { id: 84, ... } } }
   ```

2. **Create Payment Intent**:
   ```
   POST /api/v1/payments/stripe/create-payment-intent
   Body: { order_id: 84, amount: 2.75, currency: "USD" }
   Response: { 
     success: true, 
     data: { 
       client_secret: "pi_xxx_secret_xxx",
       payment_intent_id: "pi_xxx"
     }
   }
   ```

3. **فتح Popup للدفع**:
   - Frontend يفتح popup: `/checkout/stripe/pay?order_id=84&client_secret=pi_xxx_secret_xxx`
   - User يكمل الدفع في Stripe Elements

4. **بعد نجاح الدفع**:
   - Stripe يعيد توجيه تلقائي إلى: `/checkout/stripe/success?order_id=84&payment_intent_id=pi_xxx`
   - **هنا المشكلة الحالية**: Frontend يستدعي `confirm-payment` لكن Backend لا يحدّث order status

5. **Success Page Logic**:
   - يستدعي `confirm-payment` API
   - يبدأ polling للـ order status كل 2 ثانية (حتى 10 محاولات)
   - إذا `payment_status === 'paid'` → يعرض success message
   - إذا لم يتم التأكيد بعد 20 ثانية → يعرض warning

---

## ⚠️ المشكلة الحالية

### ما يحدث الآن:

1. ✅ Payment Intent يتم إنشاؤه بنجاح
2. ✅ User يكمل الدفع في Stripe بنجاح
3. ✅ Redirect إلى success page يحدث
4. ❌ **Backend لا يحدّث `order.payment_status` و `order.status`**
5. ❌ Order status يبقى `"pending"` حتى بعد confirm payment
6. ❌ Frontend polling لا يجد order confirmed

### الأعراض:

- Payment ناجح في Stripe
- لكن order status في Backend يبقى `"pending"`
- Success page لا يعرض success message
- User لا يعرف إذا تم الدفع بنجاح أم لا

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
   // يجب تحديث:
   $order->payment_status = 'paid';
   $order->status = 'confirmed'; // أو 'processing' حسب business logic
   $order->save();
   ```

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
        
        // Update order status
        $order->payment_status = 'paid';
        $order->status = 'confirmed'; // or 'processing' based on your business logic
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
- ✅ Complete payment in Stripe (use test card: 4242 4242 4242 4242)
- ✅ Call `confirm-payment` API
- ✅ Verify `order.payment_status === 'paid'`
- ✅ Verify `order.status === 'confirmed'` (or 'processing')

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
4. ✅ **Backend يحدّث order status → `'paid'` و `'confirmed'`**
5. ✅ Success page يعرض success message
6. ✅ Cart يتم مسحه تلقائياً
7. ✅ User يرى order details

---

## 📧 للاستفسارات

إذا كان لديك أي أسئلة أو تحتاج توضيحات إضافية، لا تتردد في التواصل.

**ملاحظة:** هذا المستند يشرح التغييرات المطلوبة فقط. الكود الفعلي يعتمد على framework و structure الخاص بك.

