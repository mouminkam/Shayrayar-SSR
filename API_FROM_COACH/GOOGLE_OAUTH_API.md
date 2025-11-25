# Google OAuth API - Next.js Integration

## Base URL
```
http://localhost:8000/api/v1
```

---

## POST `/auth/google/web-login`

تسجيل الدخول عبر Google لموقع Next.js باستخدام authorization code.

### Endpoint
```
POST /api/v1/auth/google/web-login
```

### Authentication
❌ **لا يتطلب authentication** - Public endpoint

### Request Headers
```http
Content-Type: application/json
Accept: application/json
```

### Request Body
```json
{
  "authorization_code": "string (required)",
  "redirect_uri": "string (URL, required)"
}
```

### Request Example
```json
{
  "authorization_code": "4/0AeanS2Xabcdefghijklmnopqrstuvwxyz",
  "redirect_uri": "http://localhost:3000/auth/google/callback"
}
```

### Response (Success - 200)
```json
{
  "success": true,
  "data": {
    "user": {
      "id": 1,
      "name": "John Doe",
      "email": "john@example.com",
      "avatar": "https://lh3.googleusercontent.com/...",
      "phone": null,
      "google_id": "123456789",
      "is_active": true,
      "branch": null
    },
    "token": "1|abcdefghijklmnopqrstuvwxyz123456789",
    "token_type": "Bearer"
  }
}
```

### Response (Error - 400)
```json
{
  "success": false,
  "message": "messages.general.error",
  "error": "Invalid redirect URI"
}
```

### Response (Error - 400) - Failed to exchange code
```json
{
  "success": false,
  "message": "messages.general.error",
  "error": "Failed to authenticate with Google"
}
```

### Response (Error - 500)
```json
{
  "success": false,
  "message": "messages.general.error",
  "error": "Internal server error message"
}
```

### Validation Errors
```json
{
  "success": false,
  "message": "Validation error",
  "errors": {
    "authorization_code": ["The authorization code field is required."],
    "redirect_uri": ["The redirect uri must be a valid URL."]
  }
}
```

---

## التدفق الكامل

### 1. في Next.js - صفحة تسجيل الدخول
```typescript
// توجيه المستخدم إلى Google
const params = new URLSearchParams({
  client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!,
  redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI!,
  response_type: 'code',
  scope: 'openid email profile',
  access_type: 'offline',
  prompt: 'consent',
  state: state,
});

window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
```

### 2. Google يعيد التوجيه إلى Callback
```
http://localhost:3000/auth/google/callback?code=AUTHORIZATION_CODE&state=STATE_VALUE
```

### 3. في Next.js - صفحة Callback
```typescript
const code = searchParams.get('code'); // authorization_code من Google

const response = await fetch('http://localhost:8000/api/v1/auth/google/web-login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  body: JSON.stringify({
    authorization_code: code,
    redirect_uri: process.env.NEXT_PUBLIC_GOOGLE_REDIRECT_URI,
  }),
});

const data = await response.json();

if (data.success) {
  // حفظ token
  localStorage.setItem('auth_token', data.data.token);
  localStorage.setItem('user', JSON.stringify(data.data.user));
}
```

---

## Error Codes

| HTTP Status | Error | الوصف |
|-------------|-------|-------|
| 400 | Invalid redirect URI | redirect_uri غير مسموح به |
| 400 | Failed to authenticate with Google | فشل تبادل authorization_code مع Google |
| 400 | Failed to get user information | فشل جلب معلومات المستخدم من Google |
| 400 | Validation error | خطأ في البيانات المرسلة |
| 500 | Internal server error | خطأ في السيرفر |

---

## ملاحظات مهمة

1. **redirect_uri يجب أن يكون مطابقاً في:**
   - Google Cloud Console (Authorized redirect URIs)
   - Laravel `.env` (`NEXTJS_GOOGLE_REDIRECT_URI`)
   - Next.js `.env.local` (`NEXT_PUBLIC_GOOGLE_REDIRECT_URI`)

2. **authorization_code:**
   - يأتي من Google في query parameter `?code=xxx`
   - صالح لاستخدام واحد فقط
   - ينتهي صلاحيته بعد بضع دقائق

3. **Token:**
   - Laravel Sanctum token
   - استخدمه في header: `Authorization: Bearer {token}`
   - صالح للاستخدام في جميع الـ endpoints المحمية

---

## مثال كامل (cURL)

```bash
curl -X POST http://localhost:8000/api/v1/auth/google/web-login \
  -H "Content-Type: application/json" \
  -H "Accept: application/json" \
  -d '{
    "authorization_code": "4/0AeanS2Xabcdefghijklmnopqrstuvwxyz",
    "redirect_uri": "http://localhost:3000/auth/google/callback"
  }'
```

---

## مثال كامل (JavaScript/TypeScript)

```typescript
async function googleLogin(authorizationCode: string, redirectUri: string) {
  try {
    const response = await fetch('http://localhost:8000/api/v1/auth/google/web-login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        authorization_code: authorizationCode,
        redirect_uri: redirectUri,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || data.message || 'Login failed');
    }

    if (data.success) {
      return {
        token: data.data.token,
        user: data.data.user,
      };
    }

    throw new Error('Login failed');
  } catch (error) {
    console.error('Google login error:', error);
    throw error;
  }
}

// الاستخدام
const { token, user } = await googleLogin(
  '4/0AeanS2Xabcdefghijklmnopqrstuvwxyz',
  'http://localhost:3000/auth/google/callback'
);
```

---

**آخر تحديث:** 2024
**الإصدار:** 1.0.0

