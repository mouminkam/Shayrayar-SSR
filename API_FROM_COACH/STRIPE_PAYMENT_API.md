# Stripe Payment API - Next.js Integration

## Base URL
```
http://localhost:8000/api/v1
```

---

## 1. GET `/payments/stripe/config`

الحصول على Stripe Publishable Key (Public endpoint).

### Endpoint
```
GET /api/v1/payments/stripe/config
```

### Authentication
❌ **لا يتطلب authentication** - Public endpoint

### Request Headers
```http
Accept: application/json
```

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "publishable_key": "pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
    "currency": "usd"
  }
}
```

### Response (Error - 500)
```json
{
  "success": false,
  "message": "messages.general.error",
  "error": "Stripe configuration not found"
}
```

---

## 2. POST `/payments/stripe/web/create-intent`

إنشاء Payment Intent للدفع.

### Endpoint
```
POST /api/v1/payments/stripe/web/create-intent
```

### Authentication
✅ **يتطلب authentication** - Bearer token

### Request Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

### Request Body
```json
{
  "order_id": "integer (required)"
}
```

### Request Example
```json
{
  "order_id": 123
}
```

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "client_secret": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz_secret_abcdefghijklmnopqrstuvwxyz",
    "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
    "publishable_key": "pk_test_51AbCdEfGhIjKlMnOpQrStUvWxYz1234567890",
    "amount": 100.50,
    "currency": "usd",
    "order_number": "ORD-12345"
  }
}
```

### Response (Error - 403)
```json
{
  "success": false,
  "message": "messages.general.error",
  "error": "Order does not belong to this user"
}
```

### Response (Error - 400)
```json
{
  "success": false,
  "message": "messages.general.error",
  "error": "Order is already paid"
}
```

---

## 3. POST `/payments/stripe/web/confirm`

تأكيد الدفع بعد معالجة Stripe.

### Endpoint
```
POST /api/v1/payments/stripe/web/confirm
```

### Authentication
✅ **يتطلب authentication** - Bearer token

### Request Headers
```http
Content-Type: application/json
Accept: application/json
Authorization: Bearer {token}
```

### Request Body
```json
{
  "payment_intent_id": "string (required)",
  "order_id": "integer (required)"
}
```

### Request Example
```json
{
  "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
  "order_id": 123
}
```

### Response (Success - 200) - Payment Succeeded
```json
{
  "success": true,
  "message": "messages.general.success",
  "data": {
    "order": {
      "id": 123,
      "order_number": "ORD-12345",
      "payment_status": "paid",
      "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
      "paid_at": "2024-01-15T10:30:00.000000Z",
      ...
    },
    "payment_status": "succeeded"
  }
}
```

### Response (Success - 200) - Requires Action (3D Secure)
```json
{
  "success": true,
  "data": {
    "requires_action": true,
    "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
    "client_secret": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz_secret_xxx",
    "message": "يحتاج الدفع إلى مصادقة إضافية من العميل"
  }
}
```

### Response (Success - 200) - Requires Payment Method
```json
{
  "success": true,
  "data": {
    "requires_payment_method": true,
    "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
    "client_secret": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz_secret_xxx",
    "message": "فشلت طريقة الدفع، يرجى تقديم طريقة دفع أخرى"
  }
}
```

### Response (Success - 200) - Processing
```json
{
  "success": true,
  "data": {
    "processing": true,
    "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
    "message": "الدفع قيد المعالجة، يرجى الانتظار"
  }
}
```

---

## 4. GET `/payments/stripe/web/status/{payment_intent_id}`

التحقق من حالة الدفع.

### Endpoint
```
GET /api/v1/payments/stripe/web/status/{payment_intent_id}
```

### Authentication
✅ **يتطلب authentication** - Bearer token

### Request Headers
```http
Accept: application/json
Authorization: Bearer {token}
```

### URL Parameters
- `payment_intent_id` (string, required) - Payment Intent ID

### Request Example
```
GET /api/v1/payments/stripe/web/status/pi_3AbCdEfGhIjKlMnOpQrStUvWxYz
```

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
    "status": "succeeded",
    "amount": 100.50,
    "currency": "usd",
    "requires_action": false,
    "client_secret": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz_secret_xxx"
  }
}
```

### Response (Success - 200) - Requires Action
```json
{
  "success": true,
  "data": {
    "payment_intent_id": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz",
    "status": "requires_action",
    "requires_action": true,
    "client_secret": "pi_3AbCdEfGhIjKlMnOpQrStUvWxYz_secret_xxx"
  }
}
```

---

## التدفق الكامل للدفع

### 1. الحصول على Publishable Key
```typescript
const configResponse = await fetch('http://localhost:8000/api/v1/payments/stripe/config');
const config = await configResponse.json();
const publishableKey = config.data.publishable_key;
```

### 2. تحميل Stripe.js
```typescript
import { loadStripe } from '@stripe/stripe-js';
const stripe = await loadStripe(publishableKey);
```

### 3. إنشاء Payment Intent
```typescript
const response = await fetch('http://localhost:8000/api/v1/payments/stripe/web/create-intent', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    order_id: 123,
  }),
});

const data = await response.json();
const clientSecret = data.data.client_secret;
```

### 4. معالجة الدفع مع Stripe Elements
```typescript
const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
  payment_method: {
    card: cardElement,
  },
});

if (paymentIntent.status === 'succeeded') {
  // تأكيد الدفع في Laravel
  await confirmPayment(paymentIntent.id, orderId);
}
```

### 5. تأكيد الدفع في Laravel
```typescript
const confirmResponse = await fetch('http://localhost:8000/api/v1/payments/stripe/web/confirm', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify({
    payment_intent_id: paymentIntent.id,
    order_id: 123,
  }),
});
```

---

## Payment Status Values

| Status | الوصف |
|--------|-------|
| `succeeded` | الدفع نجح |
| `requires_action` | يحتاج مصادقة إضافية (3D Secure) |
| `requires_payment_method` | فشلت طريقة الدفع |
| `processing` | الدفع قيد المعالجة |
| `canceled` | تم إلغاء الدفع |

---

## Error Codes

| HTTP Status | Error | الوصف |
|-------------|-------|-------|
| 400 | Order is already paid | الطلب مدفوع بالفعل |
| 400 | Payment not completed | الدفع لم يكتمل |
| 403 | Order does not belong to this user | الطلب لا يخص هذا المستخدم |
| 422 | Failed to create payment intent | فشل إنشاء payment intent |
| 500 | Internal server error | خطأ في السيرفر |

---

## ملاحظات مهمة

### 1. Publishable Key vs Secret Key

**✅ مطور Next.js يحتاج فقط:**
- **Publishable Key** (`pk_test_...` أو `pk_live_...`)
  - هذا مفتاح عام (public)
  - آمن للاستخدام في frontend
  - يمكن إضافته في `.env.local` أو جلبها من API

**❌ مطور Next.js لا يحتاج:**
- **Secret Key** (`sk_test_...` أو `sk_live_...`)
  - هذا مفتاح سري (secret)
  - يجب أن يبقى في Backend فقط
  - لا ترفعه أبداً إلى frontend

### 2. كيفية الحصول على Publishable Key

**الطريقة 1: من API (موصى بها)**
```typescript
const response = await fetch('http://localhost:8000/api/v1/payments/stripe/config');
const { publishable_key } = await response.json();
```

**الطريقة 2: من Environment Variable**
```env
# .env.local
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
```

### 3. Test Cards (للـ Development)

| Card Number | CVC | Date | النتيجة |
|-------------|-----|------|---------|
| `4242 4242 4242 4242` | أي 3 أرقام | أي تاريخ مستقبلي | نجاح |
| `4000 0000 0000 0002` | أي 3 أرقام | أي تاريخ مستقبلي | Card declined |
| `4000 0025 0000 3155` | أي 3 أرقام | أي تاريخ مستقبلي | Requires 3D Secure |

---

## مثال كامل (JavaScript/TypeScript)

```typescript
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

// 1. الحصول على Publishable Key
async function getStripeConfig() {
  const response = await fetch('http://localhost:8000/api/v1/payments/stripe/config');
  const data = await response.json();
  return data.data.publishable_key;
}

// 2. إنشاء Payment Intent
async function createPaymentIntent(orderId: number, token: string) {
  const response = await fetch('http://localhost:8000/api/v1/payments/stripe/web/create-intent', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({ order_id: orderId }),
  });
  
  const data = await response.json();
  return data.data;
}

// 3. تأكيد الدفع
async function confirmPayment(paymentIntentId: string, orderId: number, token: string) {
  const response = await fetch('http://localhost:8000/api/v1/payments/stripe/web/confirm', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    },
    body: JSON.stringify({
      payment_intent_id: paymentIntentId,
      order_id: orderId,
    }),
  });
  
  return await response.json();
}

// 4. التحقق من حالة الدفع
async function checkPaymentStatus(paymentIntentId: string, token: string) {
  const response = await fetch(
    `http://localhost:8000/api/v1/payments/stripe/web/status/${paymentIntentId}`,
    {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    }
  );
  
  return await response.json();
}
```

---

## مثال كامل (cURL)

### 1. الحصول على Config
```bash
curl http://localhost:8000/api/v1/payments/stripe/config
```

### 2. إنشاء Payment Intent
```bash
curl -X POST http://localhost:8000/api/v1/payments/stripe/web/create-intent \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{"order_id": 123}'
```

### 3. تأكيد الدفع
```bash
curl -X POST http://localhost:8000/api/v1/payments/stripe/web/confirm \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer {token}" \
  -d '{
    "payment_intent_id": "pi_xxx",
    "order_id": 123
  }'
```

### 4. التحقق من الحالة
```bash
curl http://localhost:8000/api/v1/payments/stripe/web/status/pi_xxx \
  -H "Authorization: Bearer {token}"
```

---

**آخر تحديث:** 2024
**الإصدار:** 1.0.0

