# 🔧 متطلبات Backend - Google OAuth Integration

## 📋 نظرة عامة

هذا المستند يشرح **بالضبط** ما يجب على Backend عمله لإكمال Google OAuth flow مع Frontend.

---

## 🎯 الملخص التنفيذي (Executive Summary)

### المشكلة:
- ✅ Frontend جاهز 100% ويعمل بشكل صحيح
- ❌ Backend callback endpoint يعيد JSON مباشرة في popup
- ❌ المستخدم يرى JSON response والـ popup لا يغلق

### الحل المطلوب:
Backend callback endpoint (`/api/v1/auth/google/callback`) يجب أن:
1. يعيد **HTML page** بدلاً من JSON فقط
2. HTML page يحتوي على **JavaScript** يرسل `postMessage` إلى `window.opener`
3. JavaScript يغلق popup تلقائياً

### الوقت المطلوب:
- ⏱️ **15-30 دقيقة** للتنفيذ
- 📝 **3 خطوات فقط**: تعديل endpoint → إنشاء HTML template → إضافة JavaScript

### النتيجة:
- ✅ Popup يغلق تلقائياً
- ✅ Frontend يستقبل البيانات بدون مشاكل
- ✅ User experience سلس ومحترف

---

## 📑 جدول المحتويات

1. [المشكلة الحالية](#-المشكلة-الحالية)
2. [ما هو الناقص في Frontend؟](#-ما-هو-الناقص-في-frontend-الذي-يجب-على-backend-إصلاحه)
3. [الحل المطلوب](#-الحل-المطلوب)
4. [الكود المطلوب في Backend](#-الكود-المطلوب-في-backend)
5. [مثال كود مبسط](#-مثال-كود-مبسط-minimal-example)
6. [تفاصيل postMessage Format](#-تفاصيل-postmessage-format)
7. [مخطط Flow الكامل](#-مخطط-flow-الكامل)
8. [Checklist للـ Backend Developer](#-checklist-للـ-backend-developer)
9. [Security Considerations](#-security-considerations)
10. [Testing Steps](#-testing-steps)

---

## ❌ المشكلة الحالية

### الوضع الحالي:
1. ✅ Frontend يفتح popup window مع Google OAuth URL
2. ✅ Google يعيد redirect إلى Backend callback URL: `https://shahrayar.peaklink.pro/api/v1/auth/google/callback?code=XXX&state=YYY`
3. ❌ **Backend يعيد JSON مباشرة في الصفحة** - المستخدم يرى JSON response
4. ❌ **Popup لا يغلق تلقائياً**
5. ❌ **Frontend لا يستطيع قراءة البيانات** بسبب CORS و Cross-Origin-Opener-Policy

### لماذا لا يعمل؟
- Frontend لا يستطيع قراءة `popup.location.href` أو `popup.closed` عندما Popup على domain مختلف (Backend domain)
- Browser security policies تمنع الوصول cross-origin
- الحل الوحيد: **Backend يجب أن يرسل `postMessage` إلى parent window**

---

## 🔍 ما هو الناقص في Frontend الذي يجب على Backend إصلاحه؟

### Frontend جاهز 100% ✅

Frontend **مكتمل** ويعمل بشكل صحيح:
- ✅ يفتح popup window
- ✅ يستمع لـ `postMessage` من popup
- ✅ يتعامل مع البيانات المستلمة
- ✅ يعيد التوجيه حسب حالة `phone`

### المشكلة في Backend ❌

**Backend callback endpoint** (`/api/v1/auth/google/callback`) حالياً:
- ❌ يعيد **JSON response فقط**
- ❌ لا يرسل `postMessage` إلى parent window
- ❌ لا يغلق popup تلقائياً

### ما يجب على Backend إضافته:

1. **إرجاع HTML page بدلاً من JSON** (أو بالإضافة إلى JSON)
2. **JavaScript script في HTML** يرسل `postMessage` إلى `window.opener`
3. **إغلاق popup تلقائياً** بعد إرسال message

**ملاحظة مهمة**: Frontend **لا يحتاج أي تعديلات** - كل شيء جاهز. المشكلة فقط في Backend callback page.

---

## ✅ الحل المطلوب

### ما يجب على Backend عمله:

Backend callback page (`/api/v1/auth/google/callback`) يجب أن:

1. ✅ **يقرأ `code` و `state` من query parameters**
2. ✅ **يستدعي Google API لتبديل code بـ access token**
3. ✅ **يحصل على user data من Google**
4. ✅ **يُنشئ/يُحدّث user في Database**
5. ✅ **يُنشئ JWT token**
6. ✅ **بدلاً من إرجاع JSON فقط، يجب أن يعيد HTML page مع JavaScript**
7. ✅ **JavaScript يجب أن يرسل `postMessage` إلى `window.opener` (parent window)**
8. ✅ **يغلق popup تلقائياً**

---

## 📝 الكود المطلوب في Backend

### الطريقة الموصى بها: إرجاع HTML page مع JavaScript

Backend endpoint `/api/v1/auth/google/callback` يجب أن يعيد **HTML page** بدلاً من JSON فقط.

#### مثال الكود (Laravel/PHP):

```php
<?php
// routes/api.php أو Controller
Route::get('/auth/google/callback', function (Request $request) {
    $code = $request->query('code');
    $state = $request->query('state');
    $error = $request->query('error');

    // Handle error from Google
    if ($error) {
        return view('auth.google-callback', [
            'type' => 'error',
            'error' => $error,
            'message' => 'Google authentication failed: ' . $error
        ]);
    }

    // Validate required parameters
    if (!$code || !$state) {
        return view('auth.google-callback', [
            'type' => 'error',
            'error' => 'missing_parameters',
            'message' => 'Missing required parameters: code or state'
        ]);
    }

    try {
        // Exchange code for access token
        $googleToken = $googleService->getAccessToken($code);
        
        // Get user info from Google
        $googleUser = $googleService->getUserInfo($googleToken);
        
        // Find or create user
        $user = User::firstOrCreate(
            ['email' => $googleUser->email],
            [
                'name' => $googleUser->name,
                'google_id' => $googleUser->id,
                'email_verified_at' => now(),
            ]
        );

        // Update Google ID if needed
        if (!$user->google_id) {
            $user->google_id = $googleUser->id;
            $user->save();
        }

        // Generate JWT token
        $token = $user->createToken('auth-token')->plainTextToken;

        // Return HTML page with postMessage script
        return view('auth.google-callback', [
            'type' => 'success',
            'code' => $code,
            'state' => $state,
            'user' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone, // قد يكون null
                'google_id' => $user->google_id,
            ],
            'token' => $token,
            'token_type' => 'Bearer'
        ]);
    } catch (\Exception $e) {
        return view('auth.google-callback', [
            'type' => 'error',
            'error' => 'authentication_failed',
            'message' => $e->getMessage()
        ]);
    }
});
```

#### View Template: `resources/views/auth/google-callback.blade.php`

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Google Authentication</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
            background: #f5f5f5;
        }
        .container {
            text-align: center;
            padding: 20px;
        }
        .spinner {
            border: 4px solid #f3f3f3;
            border-top: 4px solid #3498db;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 1s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="container">
        @if($type === 'success')
            <div class="spinner"></div>
            <p>Completing authentication...</p>
        @else
            <p style="color: red;">Authentication failed. This window will close automatically.</p>
        @endif
    </div>

    <script>
        (function() {
            // Get frontend origin from environment or config
            // يجب أن يكون نفس origin الذي يستخدمه Frontend
            const FRONTEND_ORIGINS = [
                'http://localhost:3000',
                'https://your-frontend-domain.com',
                // أضف جميع origins المسموحة
            ];

            // Get current origin (Backend domain)
            const BACKEND_ORIGIN = window.location.origin;

            // Function to send message to parent window
            function sendMessage(type, data) {
                if (!window.opener) {
                    console.error('No opener window found');
                    return;
                }

                // Send message to all allowed origins
                // Frontend will verify origin in message handler
                FRONTEND_ORIGINS.forEach(origin => {
                    try {
                        window.opener.postMessage({
                            type: type,
                            ...data
                        }, origin);
                    } catch (e) {
                        console.warn('Failed to send message to', origin, e);
                    }
                });

                // Also try sending to current origin (for same-origin cases)
                try {
                    window.opener.postMessage({
                        type: type,
                        ...data
                    }, '*'); // '*' allows any origin (Frontend will verify)
                } catch (e) {
                    console.warn('Failed to send message:', e);
                }
            }

            @if($type === 'success')
                // Send success message with code and state
                // Frontend will use these to call /api/v1/auth/google/callback endpoint
                sendMessage('GOOGLE_OAUTH_CALLBACK_URL', {
                    url: window.location.href,
                    code: '{{ $code }}',
                    state: '{{ $state }}'
                });

                // Alternative: Send user data directly (better approach)
                // إذا كان Backend يريد إرسال البيانات مباشرة بدلاً من code/state
                sendMessage('GOOGLE_OAUTH_DATA', {
                    code: '{{ $code }}',
                    state: '{{ $state }}',
                    user: @json($user),
                    token: '{{ $token }}',
                    token_type: '{{ $token_type }}'
                });
            @else
                // Send error message
                sendMessage('GOOGLE_OAUTH_CALLBACK_URL', {
                    url: window.location.href,
                    error: '{{ $error }}',
                    message: '{{ $message }}'
                });
            @endif

            // Close popup after sending message
            // Wait a bit to ensure message is sent
            setTimeout(function() {
                try {
                    window.close();
                } catch (e) {
                    console.warn('Could not close window:', e);
                }
            }, 500);
        })();
    </script>
</body>
</html>
```

---

## 🔄 الطريقة البديلة: إرجاع JSON مع redirect header

إذا كان Backend لا يستطيع إرجاع HTML، يمكن استخدام طريقة بديلة:

### Backend يعيد JSON + Frontend callback page

1. Backend يعيد JSON response (كما هو حالياً)
2. Frontend callback page (`/auth/google/callback`) يقرأ JSON من URL hash أو query
3. Frontend callback page يرسل postMessage إلى parent window

**لكن هذه الطريقة معقدة أكثر وتتطلب Frontend callback page.**

**⚠️ ملاحظة**: الطريقة الموصى بها هي إرجاع HTML page مع JavaScript (الطريقة الأولى).

---

## 📊 مخطط Flow الكامل

### المخطط التفصيلي:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         GOOGLE OAUTH FLOW                                │
│                    (تسجيل الدخول عن طريق Google)                         │
└─────────────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 1: User Action                                                      │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ User clicks "Continue with Google" button
         │ (في صفحة Login أو Register)
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 2: Frontend - Get Google Auth URL                                  │
│                                                                          │
│ LoginForm.handleGoogleLogin()                                           │
│   ├─> authStore.getGoogleAuthUrl()                                     │
│   └─> GET /api/v1/auth/google                                           │
│                                                                          │
│ Backend Response:                                                        │
│ {                                                                        │
│   "success": true,                                                      │
│   "data": {                                                              │
│     "redirect_url": "https://accounts.google.com/o/oauth2/v2/auth?..." │
│   }                                                                      │
│ }                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ redirect_url received
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 3: Frontend - Open Popup Window                                     │
│                                                                          │
│ openGoogleOAuthPopup(redirect_url)                                      │
│   ├─> window.open(redirect_url, 'google-oauth', 'width=500,height=600')│
│   └─> Popup window opens                                                │
│                                                                          │
│ Popup navigates to:                                                      │
│ https://accounts.google.com/o/oauth2/v2/auth?...                        │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ Popup window (Google OAuth)
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 4: Google OAuth Server                                             │
│                                                                          │
│   ├─> User enters Google credentials                                   │
│   ├─> Google validates credentials                                     │
│   └─> Google redirects to Backend callback URL                         │
│                                                                          │
│ Redirect URL:                                                            │
│ https://shahrayar.peaklink.pro/api/v1/auth/google/callback?code=XXX&state=YYY│
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ Popup redirects to Backend callback
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 5: Backend - Process Callback ⚠️ (هنا المشكلة الحالية)            │
│                                                                          │
│ GET /api/v1/auth/google/callback?code=XXX&state=YYY                     │
│                                                                          │
│ Backend Logic:                                                          │
│   1. ✅ Read code & state from query parameters                        │
│   2. ✅ Exchange code for Google access token                           │
│   3. ✅ Get user info from Google API                                   │
│   4. ✅ Find or create user in Database                                 │
│   5. ✅ Generate JWT token                                              │
│   6. ❌ CURRENTLY: Returns JSON directly                                │
│      {                                                                   │
│        "user": {...},                                                   │
│        "token": "..."                                                    │
│      }                                                                   │
│                                                                          │
│ ❌ PROBLEM: User sees JSON in popup, popup doesn't close                │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ ⚠️ Backend must return HTML instead of JSON
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 6: Backend - Return HTML Page ✅ (الحل المطلوب)                    │
│                                                                          │
│ Backend should return HTML page with JavaScript:                        │
│                                                                          │
│ <html>                                                                   │
│   <body>                                                                 │
│     <div>Completing authentication...</div>                             │
│     <script>                                                             │
│       // Send postMessage to parent window                               │
│       window.opener.postMessage({                                        │
│         type: 'GOOGLE_OAUTH_CALLBACK_URL',                              │
│         code: 'XXX',                                                     │
│         state: 'YYY'                                                     │
│       }, '*');                                                           │
│                                                                          │
│       // Close popup                                                     │
│       setTimeout(() => window.close(), 500);                           │
│     </script>                                                            │
│   </body>                                                                │
│ </html>                                                                  │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ postMessage sent to parent window
         │ Popup closes automatically
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 7: Frontend - Receive postMessage                                  │
│                                                                          │
│ pollPopupUrl() message handler receives:                                │
│ {                                                                        │
│   type: 'GOOGLE_OAUTH_CALLBACK_URL',                                    │
│   code: 'XXX',                                                           │
│   state: 'YYY'                                                           │
│ }                                                                        │
│                                                                          │
│ Frontend extracts code and state                                        │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ code & state received
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 8: Frontend - Call Backend Callback Endpoint                       │
│                                                                          │
│ api.auth.googleCallback(code, state)                                    │
│   └─> GET /api/v1/auth/google/callback?code=XXX&state=YYY             │
│                                                                          │
│ Backend Response (JSON):                                                │
│ {                                                                        │
│   "success": true,                                                      │
│   "data": {                                                              │
│     "user": {                                                            │
│       "id": 62,                                                          │
│       "name": "User Name",                                               │
│       "email": "user@example.com",                                       │
│       "phone": "+963933310888",  // قد يكون null                        │
│       "google_id": "102105088026526978578"                              │
│     },                                                                   │
│     "token": "155|rSebrgeGLxG9USkMVfuFUdY1368US9718h3Lbg0Ib7126514",    │
│     "token_type": "Bearer"                                              │
│   }                                                                      │
│ }                                                                        │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ user + token received
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 9: Frontend - Handle Callback Data                                 │
│                                                                          │
│ authStore.handleGoogleOAuthCallback({ user, token })                    │
│                                                                          │
│ Logic:                                                                   │
│   ├─> Check if user.phone is null                                       │
│   │                                                                      │
│   ├─> IF phone is null:                                                 │
│   │   ├─> Save user + token to sessionStorage                          │
│   │   └─> Return { redirect: "/add-phone" }                            │
│   │                                                                      │
│   └─> IF phone exists:                                                  │
│       ├─> Call api.auth.registerPhone({ phone: user.phone })           │
│       ├─> Save phone to sessionStorage                                  │
│       └─> Return { redirect: "/enter-otp" }                            │
└─────────────────────────────────────────────────────────────────────────┘
         │
         │ Redirect decision made
         │
         ▼
┌─────────────────────────────────────────────────────────────────────────┐
│ STEP 10: Final Redirect                                                 │
│                                                                          │
│   ├─> IF phone is null:                                                 │
│   │   └─> router.push("/add-phone")                                     │
│   │       └─> User enters phone number                                  │
│   │           └─> OTP sent → router.push("/enter-otp")                  │
│   │                                                                      │
│   └─> IF phone exists:                                                  │
│       └─> router.push("/enter-otp")                                     │
│           └─> User enters OTP                                          │
│               └─> OTP verified → router.push("/")                      │
│                                                                          │
│ Final Destination: Home page (/)                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### المخطط المبسط (Simplified Flow):

```
User Click "Google Login"
    │
    ▼
Frontend: Get redirect_url from Backend
    │
    ▼
Frontend: Open popup with redirect_url
    │
    ▼
Google: User authenticates
    │
    ▼
Google: Redirects to Backend callback
    │
    ▼
Backend: Process OAuth & Return HTML with postMessage
    │
    ▼
Popup: Sends postMessage → Closes
    │
    ▼
Frontend: Receives code & state
    │
    ▼
Frontend: Calls Backend callback API
    │
    ▼
Backend: Returns user + token
    │
    ▼
Frontend: Check phone → Redirect accordingly
    │
    ▼
User: Complete OTP → Home page
```

---

## 💡 مثال كود مبسط (Minimal Example)

إذا كنت تريد مثال أبسط وأكثر مباشرة:

### Backend Callback Endpoint (Simplified):

```php
Route::get('/auth/google/callback', function (Request $request) {
    $code = $request->query('code');
    $state = $request->query('state');
    
    // ... (معالجة OAuth وget user data) ...
    
    // Return HTML page
    return response()->view('auth.google-callback', [
        'code' => $code,
        'state' => $state,
        'user' => $user,
        'token' => $token
    ]);
});
```

### HTML Template (Simplified):

```html
<!DOCTYPE html>
<html>
<head>
    <title>Authenticating...</title>
</head>
<body>
    <p>Please wait...</p>
    <script>
        if (window.opener) {
            // Send message to parent window
            window.opener.postMessage({
                type: 'GOOGLE_OAUTH_CALLBACK_URL',
                code: '{{ $code }}',
                state: '{{ $state }}'
            }, '*');
            
            // Close popup
            setTimeout(() => window.close(), 100);
        }
    </script>
</body>
</html>
```

**هذا كل ما تحتاجه!** Frontend سيتعامل مع الباقي.

---

## 🔍 تفاصيل postMessage Format

### Message Type 1: `GOOGLE_OAUTH_CALLBACK_URL`

يستخدم عندما Backend يريد إرسال callback URL فقط:

```javascript
window.opener.postMessage({
  type: 'GOOGLE_OAUTH_CALLBACK_URL',
  url: 'https://shahrayar.peaklink.pro/api/v1/auth/google/callback?code=XXX&state=YYY',
  code: 'XXX',
  state: 'YYY',
  error: null // أو error message إذا فشل
}, '*');
```

### Message Type 2: `GOOGLE_OAUTH_DATA` (مُوصى به)

يستخدم عندما Backend يريد إرسال البيانات مباشرة:

```javascript
window.opener.postMessage({
  type: 'GOOGLE_OAUTH_DATA',
  code: 'XXX',
  state: 'YYY',
  user: {
    id: 62,
    name: "User Name",
    email: "user@example.com",
    phone: "+963933310888", // قد يكون null
    google_id: "102105088026526978578"
  },
  token: "155|rSebrgeGLxG9USkMVfuFUdY1368US9718h3Lbg0Ib7126514",
  token_type: "Bearer"
}, '*');
```

---

## ✅ Checklist للـ Backend Developer

- [ ] Backend callback endpoint (`/api/v1/auth/google/callback`) يقرأ `code` و `state` من query parameters
- [ ] Backend يستدعي Google API لتبديل `code` بـ access token
- [ ] Backend يحصل على user info من Google
- [ ] Backend يجد أو ينشئ user في Database
- [ ] Backend ينشئ JWT token
- [ ] Backend يعيد **HTML page** بدلاً من JSON فقط
- [ ] HTML page يحتوي على JavaScript script
- [ ] JavaScript يرسل `postMessage` إلى `window.opener` مع:
  - `type: 'GOOGLE_OAUTH_CALLBACK_URL'` أو `'GOOGLE_OAUTH_DATA'`
  - `code` و `state` (أو user data مباشرة)
- [ ] JavaScript يغلق popup بعد إرسال message (`window.close()`)
- [ ] Backend يتعامل مع errors ويُرسل error message في postMessage
- [ ] Backend يتحقق من `state` parameter للـ CSRF protection

---

## 🔒 Security Considerations

1. **Origin Verification**: Frontend يتحقق من `event.origin` في message handler
2. **State Parameter**: يجب استخدام `state` للـ CSRF protection
3. **Token Security**: JWT token يجب أن يكون secure وله expiration
4. **HTTPS**: يجب استخدام HTTPS في production

---

## 🧪 Testing Steps

1. ✅ Test successful flow: user with phone
2. ✅ Test successful flow: user without phone (should redirect to /add-phone)
3. ✅ Test error handling: invalid code
4. ✅ Test error handling: missing parameters
5. ✅ Test popup closing automatically
6. ✅ Test postMessage received by Frontend
7. ✅ Test CORS/Cross-Origin scenarios

---

## 📞 Support

إذا كان لديك أي أسئلة أو تحتاج مساعدة في التنفيذ، يرجى التواصل مع Frontend team.

---

**آخر تحديث**: 2024-01-XX

