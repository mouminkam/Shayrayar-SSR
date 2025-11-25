# دليل تكامل Next.js مع API

دليل شامل لمطور Next.js لاستخدام Google OAuth و Stripe Payment مع Laravel Backend API.

---

## جدول المحتويات

1. [Google OAuth Integration](#google-oauth-integration)
2. [Stripe Payment Integration](#stripe-payment-integration)
3. [API Reference](#api-reference)
4. [Environment Variables](#environment-variables)
5. [Examples](#examples)
6. [Troubleshooting](#troubleshooting)

---

## 📚 ملفات API المرجعية

للمرجع السريع، راجع الملفات التالية:

- **[Google OAuth API](./GOOGLE_OAUTH_API.md)** - توثيق كامل لـ Google OAuth endpoints
- **[Stripe Payment API](./STRIPE_PAYMENT_API.md)** - توثيق كامل لـ Stripe Payment endpoints

---

## Google OAuth Integration

### ⚠️ ملاحظة مهمة: Redirect URI

قبل البدء، يجب أن تعرف أن **redirect URI** يجب أن يكون **نفس القيمة** في ثلاثة أماكن:

1. **Google Cloud Console** → Authorized redirect URIs: `http://localhost:3000/auth/google/callback`
2. **Laravel `.env`** → `NEXTJS_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`
3. **Next.js `.env.local`** → `NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback`

إذا كانت القيم مختلفة، ستفشل عملية تسجيل الدخول!

---

### التدفق الكامل مع شرح تفصيلي

```
1. المستخدم يضغط "تسجيل الدخول باستخدام Google"
   ↓
2. Next.js يوجه المستخدم إلى Google OAuth:
   URL: https://accounts.google.com/o/oauth2/v2/auth?
        client_id=xxx&
        redirect_uri=http://localhost:3000/auth/google/callback&
        response_type=code&
        scope=openid email profile
   ↓
3. المستخدم يسجل الدخول في Google ويوافق على الصلاحيات
   ↓
4. Google يعيد التوجيه إلى Next.js callback page:
   URL: http://localhost:3000/auth/google/callback?code=AUTHORIZATION_CODE&state=STATE_VALUE
   
   ⚠️ هنا يأتي authorization_code من Google في query parameter
   ↓
5. صفحة callback في Next.js تقرأ authorization_code من URL:
   const code = searchParams.get('code'); // هذا هو authorization_code
   ↓
6. Next.js callback page يرسل POST request إلى Laravel API:
   POST /api/v1/auth/google/web-login
   Body: {
     "authorization_code": "AUTHORIZATION_CODE", // من query parameter
     "redirect_uri": "http://localhost:3000/auth/google/callback"
   }
   ↓
7. Laravel يتبادل authorization_code مع Google للحصول على access_token
   ↓
8. Laravel يجلب معلومات المستخدم من Google
   ↓
9. Laravel ينشئ/يحدث المستخدم ويعيد token
   ↓
10. Next.js يحفظ token ويوجه المستخدم للصفحة الرئيسية
```

**🔑 النقطة المهمة:**
- `authorization_code` يأتي من Google في query parameter عند إعادة التوجيه
- Google يضيفه تلقائياً في URL: `?code=AUTHORIZATION_CODE`
- صفحة callback في Next.js تقرأه من URL وترسله إلى Laravel API

**ملاحظة مهمة:**
- **Callback في Next.js:** صفحة (`/auth/google/callback`) - ليست API endpoint
- **API Endpoint في Laravel:** `POST /api/v1/auth/google/web-login` - هذا ما تستدعيه صفحة callback

### متطلبات الإعداد

#### 1. Google Cloud Console Setup

1. اذهب إلى [Google Cloud Console](https://console.cloud.google.com/)
2. أنشئ مشروع جديد أو اختر مشروع موجود
3. فعّل Google+ API
4. **أولاً: قم بتكوين OAuth Consent Screen:**
   - اذهب إلى "OAuth consent screen" من القائمة الجانبية
   - اختر "External" (للمستخدمين الخارجيين)
   - املأ المعلومات المطلوبة (App name, Support email, etc.)
   - احفظ التغييرات
5. **ثانياً: أنشئ OAuth 2.0 Client ID:**
   - اذهب إلى "Credentials" → اضغط "+ Create credentials" → "OAuth 2.0 Client ID"
   - اختر "Web application"
   - **أضف Authorized redirect URIs:**
     - `http://localhost:3000/auth/google/callback` (للـ development)
     - `https://yourdomain.com/auth/google/callback` (للـ production)
   - اضغط "Create"
6. انسخ Client ID و Client Secret

**⚠️ مهم جداً:** يجب أن يكون redirect URI **نفس القيمة** في:
- Google Cloud Console (Authorized redirect URIs)
- Laravel `.env` (NEXTJS_GOOGLE_REDIRECT_URI)
- Next.js `.env.local` (NEXT_PUBLIC_GOOGLE_REDIRECT_URI)

#### 2. Environment Variables في Next.js

أضف في ملف `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id_here
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
```

#### 3. Environment Variables في Laravel

أضف في ملف `.env`:

```env
GOOGLE_CLIENT_ID=your_google_client_id_here
GOOGLE_CLIENT_SECRET=your_google_client_secret_here
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
NEXTJS_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

**ملاحظة:** 
- `GOOGLE_REDIRECT_URI` - للاستخدام العام في Laravel
- `NEXTJS_GOOGLE_REDIRECT_URI` - مخصص لموقع Next.js (يستخدمه الكود للتحقق من صحة redirect_uri المرسل من Next.js)
- **يجب أن تكون نفس القيمة** المضافة في Google Cloud Console

### مثال كود كامل

#### 1. صفحة تسجيل الدخول (`app/auth/google/page.tsx`)

```typescript
'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GoogleLoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleGoogleLogin = () => {
    setLoading(true);
    
    // إنشاء state عشوائي للأمان
    const state = Math.random().toString(36).substring(2, 15) + 
                   Math.random().toString(36).substring(2, 15);
    
    // حفظ state في sessionStorage للتحقق لاحقاً
    sessionStorage.setItem('google_oauth_state', state);

    // بناء رابط Google OAuth
    const params = new URLSearchParams({
      client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
      redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
      response_type: 'code',
      scope: 'openid email profile',
      access_type: 'offline',
      prompt: 'consent',
      state: state,
    });

    // إعادة التوجيه إلى Google
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <button
        onClick={handleGoogleLogin}
        disabled={loading}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'جاري التوجيه...' : 'تسجيل الدخول باستخدام Google'}
      </button>
    </div>
  );
}
```

#### 2. صفحة Callback (`app/auth/google/callback/page.tsx`)

**⚠️ ملاحظة:** هذه صفحة Next.js (ليست API endpoint). هذه الصفحة تستدعي API endpoint في Laravel: `POST /api/v1/auth/google/web-login`

```typescript
'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

interface ApiResponse {
  success: boolean;
  data?: {
    user: any;
    token: string;
    token_type: string;
  };
  message?: string;
  error?: string;
}

export default function GoogleCallbackPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 🔑 Google يعيد التوجيه مع authorization_code في query parameter
    // مثال: http://localhost:3000/auth/google/callback?code=AUTHORIZATION_CODE&state=STATE
    // نقرأ authorization_code من URL
    const code = searchParams.get('code'); // ⭐ هذا هو authorization_code من Google
    const state = searchParams.get('state');
    const errorParam = searchParams.get('error');

    if (errorParam) {
      setError('فشل تسجيل الدخول: ' + errorParam);
      setLoading(false);
      return;
    }

    if (!code || !state) {
      setError('معلومات غير كافية من Google');
      setLoading(false);
      return;
    }

    // التحقق من state
    const savedState = sessionStorage.getItem('google_oauth_state');
    if (state !== savedState) {
      setError('طلب غير صالح - State mismatch');
      setLoading(false);
      return;
    }

    // حذف state بعد الاستخدام
    sessionStorage.removeItem('google_oauth_state');

    // إرسال authorization_code إلى Backend API
    handleGoogleCallback(code);
  }, [searchParams]);

  const handleGoogleCallback = async (code: string) => {
    try {
      // ✅ هذا هو API endpoint الذي تستدعيه صفحة callback
      // POST /api/v1/auth/google/web-login
      // نرسل authorization_code الذي حصلنا عليه من Google
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/google/web-login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify({
          authorization_code: code, // ⭐ authorization_code من query parameter
          redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
        }),
      });

      const data: ApiResponse = await response.json();

      if (data.success && data.data) {
        // حفظ token في localStorage
        localStorage.setItem('auth_token', data.data.token);
        localStorage.setItem('user', JSON.stringify(data.data.user));

        // إعادة التوجيه إلى الصفحة الرئيسية
        router.push('/');
      } else {
        setError(data.message || data.error || 'فشل تسجيل الدخول');
        setLoading(false);
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('حدث خطأ أثناء تسجيل الدخول');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4">جاري تسجيل الدخول...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center text-red-500">
          <p className="text-xl font-bold">خطأ</p>
          <p className="mt-2">{error}</p>
          <button
            onClick={() => router.push('/auth/google')}
            className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
          >
            المحاولة مرة أخرى
          </button>
        </div>
      </div>
    );
  }

  return null;
}
```

#### 3. API Client Utility (`lib/api-client.ts`)

```typescript
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api/v1';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
  errors?: Record<string, string[]>;
}

class ApiClient {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem('auth_token');
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    const token = this.getAuthToken();
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      ...options.headers,
    };

    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }

    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API request error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }

  async put<T>(endpoint: string, body?: any): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  }

  async delete<T>(endpoint: string): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { method: 'DELETE' });
  }
}

export const apiClient = new ApiClient();
```

#### 4. Auth Context/Hook (`contexts/AuthContext.tsx`)

```typescript
'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiClient } from '@/lib/api-client';

interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // تحميل المستخدم من localStorage عند التحميل
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');

    if (token && userStr) {
      try {
        setUser(JSON.parse(userStr));
        // يمكنك أيضاً التحقق من صحة token من خلال API call
      } catch (error) {
        console.error('Failed to parse user data:', error);
        localStorage.removeItem('auth_token');
        localStorage.removeItem('user');
      }
    }

    setLoading(false);
  }, []);

  const login = (token: string, userData: User) => {
    localStorage.setItem('auth_token', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    setUser(null);
    router.push('/auth/google');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
```

---

## Stripe Payment Integration

### التدفق الكامل

```
1. المستخدم يضغط "الدفع"
   ↓
2. Next.js يطلب Stripe publishable key من Laravel
   ↓
3. Next.js يطلب إنشاء payment intent من Laravel
   ↓
4. Laravel ينشئ payment intent ويعيد client_secret
   ↓
5. Next.js يستخدم Stripe Elements لإدخال بيانات البطاقة
   ↓
6. Stripe يعالج الدفع (قد يتطلب 3D Secure)
   ↓
7. Next.js يرسل payment_intent_id إلى Laravel للتأكيد
   ↓
8. Laravel يؤكد الدفع ويحدث حالة الطلب
```

### متطلبات الإعداد

#### 1. Stripe Dashboard Setup

1. اذهب إلى [Stripe Dashboard](https://dashboard.stripe.com/)
2. احصل على Publishable Key و Secret Key
3. أضف Webhook endpoint (اختياري): `https://yourdomain.com/webhooks/stripe`

#### 2. تثبيت Stripe في Next.js

```bash
npm install @stripe/stripe-js @stripe/react-stripe-js
```

### مثال كود كامل

#### 1. صفحة Checkout (`app/checkout/page.tsx`)

```typescript
'use client';

import { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { apiClient } from '@/lib/api-client';
import { useAuth } from '@/contexts/AuthContext';

// تحميل Stripe publishable key
let stripePromise: Promise<any> | null = null;

const getStripe = async () => {
  if (!stripePromise) {
    const response = await apiClient.get<{ publishable_key: string }>('/payments/stripe/config');
    if (response.success && response.data) {
      stripePromise = loadStripe(response.data.publishable_key);
    }
  }
  return stripePromise;
};

function CheckoutForm({ orderId }: { orderId: number }) {
  const stripe = useStripe();
  const elements = useElements();
  const { isAuthenticated } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [clientSecret, setClientSecret] = useState<string | null>(null);
  const [paymentIntentId, setPaymentIntentId] = useState<string | null>(null);

  useEffect(() => {
    if (!isAuthenticated) return;

    // إنشاء payment intent
    const createPaymentIntent = async () => {
      try {
        const response = await apiClient.post<{
          client_secret: string;
          payment_intent_id: string;
          publishable_key: string;
          amount: number;
          currency: string;
        }>('/payments/stripe/web/create-intent', {
          order_id: orderId,
        });

        if (response.success && response.data) {
          setClientSecret(response.data.client_secret);
          setPaymentIntentId(response.data.payment_intent_id);
        } else {
          setError(response.error || 'Failed to create payment intent');
        }
      } catch (err) {
        setError('Failed to initialize payment');
        console.error(err);
      }
    };

    createPaymentIntent();
  }, [orderId, isAuthenticated]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements || !clientSecret || !paymentIntentId) {
      return;
    }

    setLoading(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError('Card element not found');
      setLoading(false);
      return;
    }

    // تأكيد الدفع مع Stripe
    const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(
      clientSecret,
      {
        payment_method: {
          card: cardElement,
        },
      }
    );

    if (stripeError) {
      setError(stripeError.message || 'Payment failed');
      setLoading(false);
      return;
    }

    if (paymentIntent?.status === 'succeeded') {
      // إرسال payment_intent_id إلى Laravel للتأكيد
      try {
        const response = await apiClient.post('/payments/stripe/web/confirm', {
          payment_intent_id: paymentIntentId,
          order_id: orderId,
        });

        if (response.success) {
          // نجح الدفع
          window.location.href = '/orders/success';
        } else {
          setError(response.error || 'Failed to confirm payment');
        }
      } catch (err) {
        setError('Failed to confirm payment');
        console.error(err);
      }
    } else if (paymentIntent?.status === 'requires_action') {
      // يحتاج إلى مصادقة إضافية (3D Secure)
      const { error: actionError } = await stripe.handleCardAction(clientSecret);

      if (actionError) {
        setError(actionError.message || 'Authentication failed');
      } else {
        // إعادة محاولة التأكيد
        const response = await apiClient.post('/payments/stripe/web/confirm', {
          payment_intent_id: paymentIntentId,
          order_id: orderId,
        });

        if (response.success) {
          window.location.href = '/orders/success';
        }
      }
    }

    setLoading(false);
  };

  const cardElementOptions = {
    style: {
      base: {
        fontSize: '16px',
        color: '#424770',
        '::placeholder': {
          color: '#aab7c4',
        },
      },
      invalid: {
        color: '#9e2146',
      },
    },
  };

  if (!clientSecret) {
    return <div>Loading payment form...</div>;
  }

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto mt-8">
      <div className="mb-4">
        <CardElement options={cardElementOptions} />
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={!stripe || loading}
        className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Pay Now'}
      </button>
    </form>
  );
}

export default function CheckoutPage({ params }: { params: { orderId: string } }) {
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    getStripe().then(setStripe);
  }, []);

  if (!stripe) {
    return <div>Loading Stripe...</div>;
  }

  return (
    <Elements stripe={stripe}>
      <CheckoutForm orderId={parseInt(params.orderId)} />
    </Elements>
  );
}
```

---

## API Reference

### Google OAuth Endpoints

#### ملخص الـ Endpoints المتاحة:

| Endpoint | Method | الاستخدام | الوصف |
|----------|--------|-----------|-------|
| `/api/v1/auth/google/web-login` | POST | ⭐ **لـ Next.js** | API endpoint تستدعيه صفحة callback في Next.js |
| `/api/v1/auth/google/callback` | GET | للتدفق القديم | Google يعيد التوجيه مباشرة إلى Laravel (لا يستخدم مع Next.js) |
| `/api/v1/auth/google/login` | POST | للموبايل | يستخدم id_token من تطبيق الموبايل |

**لـ Next.js، استخدم فقط:** `POST /api/v1/auth/google/web-login`

---

#### POST `/api/v1/auth/google/web-login` ⭐ (API للـ Next.js Callback)

**هذا هو API endpoint الذي تستدعيه صفحة callback في Next.js.**

تسجيل الدخول عبر Google لموقع Next.js. يتم استدعاء هذا الـ endpoint من صفحة callback في Next.js (`/auth/google/callback`) بعد أن يعيد Google التوجيه مع authorization_code.

**🔑 من أين يأتي authorization_code؟**

1. المستخدم يضغط "تسجيل الدخول" → Next.js يوجهه إلى Google
2. Google يعيد التوجيه إلى: `http://localhost:3000/auth/google/callback?code=AUTHORIZATION_CODE`
3. صفحة callback في Next.js تقرأ `code` من query parameter: `searchParams.get('code')`
4. Next.js يرسل هذا `code` إلى Laravel API في body

**Request Body:**
```json
{
  "authorization_code": "string",  // ⭐ يأتي من Google في query parameter ?code=xxx
  "redirect_uri": "string (URL)"   // نفس redirect_uri المستخدم في Google OAuth
}
```

**مثال على authorization_code:**
```
4/0AeanS2X... (كود طويل من Google)
```

**Response (Success):**
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://...",
      "phone": null
    },
    "token": "1|xxxxxxxxxxxx",
    "token_type": "Bearer"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "Error message",
  "error": "Detailed error"
}
```

### Stripe Payment Endpoints

#### GET `/api/v1/payments/stripe/config`

الحصول على Stripe publishable key (public endpoint).

**Response:**
```json
{
  "success": true,
  "data": {
    "publishable_key": "pk_test_...",
    "currency": "usd"
  }
}
```

#### POST `/api/v1/payments/stripe/web/create-intent`

إنشاء payment intent (يتطلب authentication).

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "order_id": 123
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "client_secret": "pi_xxx_secret_xxx",
    "payment_intent_id": "pi_xxx",
    "publishable_key": "pk_test_...",
    "amount": 100.50,
    "currency": "usd",
    "order_number": "ORD-12345"
  }
}
```

#### POST `/api/v1/payments/stripe/web/confirm`

تأكيد الدفع (يتطلب authentication).

**Request Headers:**
```
Authorization: Bearer {token}
```

**Request Body:**
```json
{
  "payment_intent_id": "pi_xxx",
  "order_id": 123
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "messages.general.success",
  "data": {
    "order": { ... },
    "payment_status": "succeeded"
  }
}
```

**Response (Requires Action - 3D Secure):**
```json
{
  "success": true,
  "data": {
    "requires_action": true,
    "payment_intent_id": "pi_xxx",
    "client_secret": "pi_xxx_secret_xxx",
    "message": "يحتاج الدفع إلى مصادقة إضافية من العميل"
  }
}
```

#### GET `/api/v1/payments/stripe/web/status/{payment_intent_id}`

التحقق من حالة الدفع (يتطلب authentication).

**Response:**
```json
{
  "success": true,
  "data": {
    "payment_intent_id": "pi_xxx",
    "status": "succeeded",
    "amount": 100.50,
    "currency": "usd",
    "requires_action": false,
    "client_secret": "pi_xxx_secret_xxx"
  }
}
```

---

## Environment Variables

### Next.js (.env.local)

```env
# API Configuration
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
```

### Laravel (.env)

```env
# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
NEXTJS_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback

# Stripe
STRIPE_KEY=pk_test_...
STRIPE_SECRET=sk_test_...

# CORS (إضافة Next.js domain)
SANCTUM_STATEFUL_DOMAINS=localhost:3000,127.0.0.1:3000
```

---

## Troubleshooting

### مشاكل شائعة

#### 1. CORS Error

**المشكلة:** `Access to fetch at '...' from origin '...' has been blocked by CORS policy`

**الحل:**
- تأكد من إضافة Next.js domain في `SANCTUM_STATEFUL_DOMAINS` في Laravel `.env`
- تأكد من إعداد CORS بشكل صحيح في `config/cors.php`

#### 2. Invalid Redirect URI

**المشكلة:** `Invalid redirect URI` عند تسجيل الدخول عبر Google

**الحل:**
يجب أن يكون redirect URI **نفس القيمة** في ثلاثة أماكن:

1. **Google Cloud Console:**
   - اذهب إلى Credentials → OAuth 2.0 Client ID
   - تأكد من إضافة: `http://localhost:3000/auth/google/callback` في Authorized redirect URIs

2. **Laravel `.env`:**
   ```env
   NEXTJS_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

3. **Next.js `.env.local`:**
   ```env
   NEXT_PUBLIC_GOOGLE_REDIRECT_URI=http://localhost:3000/auth/google/callback
   ```

**ملاحظة:** إذا كنت تستخدم production domain، استبدل `localhost:3000` بـ domain الخاص بك في الثلاثة أماكن.

**للتحقق:**
- تأكد من عدم وجود مسافات إضافية في القيم
- تأكد من استخدام `http://` للـ development و `https://` للـ production
- تأكد من أن المسار `/auth/google/callback` صحيح

#### 3. Token Expired

**المشكلة:** `401 Unauthorized` عند استخدام API

**الحل:**
- تحقق من أن token موجود في localStorage
- أعد تسجيل الدخول إذا انتهت صلاحية token
- أضف interceptor في API client لإعادة التوجيه عند 401

#### 4. Stripe Payment Failed

**المشكلة:** فشل الدفع مع Stripe

**الحل:**
- تحقق من أن publishable key صحيح
- تأكد من استخدام test cards في development: `4242 4242 4242 4242`
- تحقق من logs في Laravel للتفاصيل

### Debugging Tips

1. **استخدم Browser DevTools:**
   - Network tab لمراقبة API calls
   - Console tab للأخطاء
   - Application tab للتحقق من localStorage

2. **استخدم Laravel Logs:**
   ```bash
   tail -f storage/logs/laravel.log
   ```

3. **اختبر API مباشرة:**
   - استخدم Postman أو curl
   - تحقق من response format

---

## قائمة الملفات الجديدة والمعدلة

### الملفات الجديدة:
1. `docs/NEXTJS_INTEGRATION_GUIDE.md` - هذا الدليل

### الملفات المعدلة:
1. `app/Http/Controllers/Api/AuthController.php` - إضافة `googleLoginWeb()`
2. `app/Http/Controllers/Api/PaymentController.php` - إضافة 4 دوال جديدة:
   - `getStripeConfig()`
   - `createWebPaymentIntent()`
   - `confirmWebPayment()`
   - `checkPaymentStatus()`
3. `app/Services/Payment/StripeService.php` - الدالة `getPublishableKey()` موجودة بالفعل
4. `routes/api.php` - إضافة 5 routes جديدة:
   - `POST /api/v1/auth/google/web-login`
   - `GET /api/v1/payments/stripe/config`
   - `POST /api/v1/payments/stripe/web/create-intent`
   - `POST /api/v1/payments/stripe/web/confirm`
   - `GET /api/v1/payments/stripe/web/status/{payment_intent_id}`

---

## ملاحظات مهمة

⚠️ **لا توجد تغييرات على الـ endpoints القديمة** - جميع الـ endpoints الحالية ستبقى كما هي:
- `GET /api/v1/auth/google` - يبقى كما هو
- `GET /api/v1/auth/google/callback` - يبقى كما هو  
- `POST /api/v1/auth/google/login` - يبقى كما هو (للموبايل)
- `POST /api/v1/payments/stripe/create-payment-intent` - يبقى كما هو
- `POST /api/v1/payments/stripe/confirm-payment` - يبقى كما هو

---

**آخر تحديث:** {{ date }}
**الإصدار:** 1.0.0

