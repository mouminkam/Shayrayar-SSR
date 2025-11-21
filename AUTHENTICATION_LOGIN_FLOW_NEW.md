# 🔄 Authentication Login Flow - الجديد (بعد التحديثات)

## 📋 نظرة عامة

تم تحديث Google OAuth Login من **popup window** إلى **redirect في نفس الصفحة**، مع معالجة validation في callback page بناءً على وجود `phone`.

---

## 🔐 Google Login Flow (تسجيل الدخول)

### الخطوات الكاملة:

```
1. User يضغط "Continue with Google" في LoginForm
   ↓
2. LoginForm.handleGoogleLogin():
   a. authStore.getGoogleAuthUrl()
   b. GET /api/v1/auth/google
   c. window.location.href = redirectUrl (نفس الصفحة - لا popup)
   ↓
3. User يكمل Google OAuth في نفس الصفحة
   ↓
4. Google redirects إلى /auth/google/callback?code=XXX&state=YYY
   ↓
5. GoogleCallbackPage.handleCallback():
   a. قراءة code و state من URL
   b. api.auth.googleCallback(code, state)
   c. GET /api/v1/auth/google/callback?code=XXX&state=YYY
   ↓
6. Backend Response:
   {
     "success": true,
     "data": {
       "user": {
         "id": 62,
         "name": "mo2min alkamshe",
         "email": "mo2min.2001@gmail.com",
         "phone": "+963933310888",  // موجود دائماً في Login
         "google_id": "102105088026526978578",
         ...
       },
       "token": "155|rSebrgeGLxG9USkMVfuFUdY1368US9718h3Lbg0Ib7126514",
       "token_type": "Bearer"
     }
   }
   ↓
7. GoogleCallbackPage:
   a. حفظ user + token في sessionStorage:
      - sessionStorage.setItem("googleUser", JSON.stringify(user))
      - sessionStorage.setItem("googleToken", token)
      - sessionStorage.setItem("googleFlow", "true")
   b. التحقق من phone:
      * phone !== null (دائماً موجود في Login)
      * api.auth.registerPhone({ phone, password: null, password_confirmation: null })
      * POST /api/v1/auth/register-phone
   c. حفظ phone في sessionStorage:
      - sessionStorage.setItem("registrationPhone", user.phone)
   d. router.push("/enter-otp")
   ↓
8. User يدخل OTP في /enter-otp
   ↓
9. OTPForm.handleSubmit():
   a. verifyPhoneOTP(phone, otpString)
   b. POST /api/v1/auth/verify-phone
      Body: { phone, code }
   ↓
10. Backend Response:
    {
      "success": true,
      "data": {
        "token": "verification_token"
      }
    }
    ↓
11. OTPForm:
    a. جلب Google user data من sessionStorage
    b. حفظ user + token في authStore:
       - authStore.setState({
           user: { ...googleUser, phone, token: googleToken },
           isAuthenticated: true
         })
    c. مسح sessionStorage:
       - removeItem("googleUser")
       - removeItem("googleToken")
       - removeItem("googleFlow")
       - removeItem("registrationPhone")
    d. toastSuccess("Phone verified successfully! Welcome!")
    e. router.push("/")
```

---

## 📝 Google Registration Flow (إنشاء حساب جديد)

### الخطوات الكاملة:

```
1. User يضغط "Continue with Google" في RegisterForm
   ↓
2. RegisterForm.handleGoogleLogin():
   a. authStore.getGoogleAuthUrl()
   b. GET /api/v1/auth/google
   c. window.location.href = redirectUrl (نفس الصفحة)
   ↓
3. User يكمل Google OAuth في نفس الصفحة
   ↓
4. Google redirects إلى /auth/google/callback?code=XXX&state=YYY
   ↓
5. GoogleCallbackPage.handleCallback():
   a. قراءة code و state من URL
   b. api.auth.googleCallback(code, state)
   ↓
6. Backend Response:
   {
     "success": true,
     "data": {
       "user": {
         "id": 62,
         "name": "mo2min alkamshe",
         "email": "mo2min.2001@gmail.com",
         "phone": null,  // غير موجود في Registration
         "google_id": "102105088026526978578",
         ...
       },
       "token": "155|rSebrgeGLxG9USkMVfuFUdY1368US9718h3Lbg0Ib7126514",
       "token_type": "Bearer"
     }
   }
   ↓
7. GoogleCallbackPage:
   a. حفظ user + token في sessionStorage:
      - sessionStorage.setItem("googleUser", JSON.stringify(user))
      - sessionStorage.setItem("googleToken", token)
      - sessionStorage.setItem("googleFlow", "true")
   b. التحقق من phone:
      * phone === null (حساب جديد)
      * router.push("/add-phone")
   ↓
8. User يدخل phone في /add-phone
   ↓
9. PhoneInputForm.handleSubmit():
   a. api.auth.registerPhone({ phone, password: null, password_confirmation: null })
   b. POST /api/v1/auth/register-phone
   c. حفظ phone في sessionStorage:
      - sessionStorage.setItem("registrationPhone", phone)
   d. router.push("/enter-otp")
   ↓
10. User يدخل OTP في /enter-otp
    ↓
11. OTPForm.handleSubmit():
    a. verifyPhoneOTP(phone, otpString)
    b. POST /api/v1/auth/verify-phone
    ↓
12. Backend Response:
    {
      "success": true,
      "data": {
        "token": "verification_token"
      }
    }
    ↓
13. OTPForm:
    a. جلب Google user data من sessionStorage
    b. حفظ user + token في authStore:
       - authStore.setState({
           user: { ...googleUser, phone, token: googleToken },
           isAuthenticated: true
         })
    c. مسح sessionStorage
    d. toastSuccess("Phone verified successfully! Welcome!")
    e. router.push("/")
```

---

## 🔄 Traditional Login Flow (Email + Password)

### الخطوات الكاملة:

```
1. User يفتح /login
   ↓
2. GuestOnly Component:
   - إذا user مسجل دخول → Redirect to /profile
   - إذا user غير مسجل → عرض LoginForm
   ↓
3. User يدخل Email و Password
   ↓
4. LoginForm.handleSubmit():
   a. validateForm() - التحقق من البيانات
   b. authStore.login(email, password)
   c. POST /api/v1/auth/login
      Body: { email, password }
   ↓
5. Backend Response:
   {
     "success": true,
     "data": {
       "user": { id, name, email, phone, address, ... },
       "token": "eyJ0eXAiOiJKV1QiLCJhbGc..."
     }
   }
   ↓
6. authStore.login():
   - حفظ user + token في authStore
   - حفظ في localStorage (Zustand persist)
   - set isAuthenticated = true
   ↓
7. LoginForm:
   - toastSuccess("Login successful! Welcome back!")
   - حفظ email في localStorage (إذا Remember Me)
   - Redirect إلى returnUrl أو "/"
```

---

## ⚠️ Error Handling

### Google OAuth Errors:

**في GoogleCallbackPage:**
- إذا `error` في URL → redirect to `/login?error={error}`
- إذا `code` أو `state` مفقود → redirect to `/login?error=missing_parameters`
- إذا API call فشل → redirect to `/login?error={error_message}`

**في LoginForm:**
- قراءة `error` من query params
- عرض toast error message
- مسح error من URL

---

## 📊 Data Flow Diagrams

### Google Login Flow (الجديد):

```
┌─────────────┐
│ LoginForm   │
│ (Google)    │
└──────┬──────┘
       │
       ├──► getGoogleAuthUrl()
       │
       ▼
┌─────────────┐
│ window.     │
│ location.   │
│ href = URL  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Google OAuth│
│ (Same Page) │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ /auth/google│
│ /callback   │
└──────┬──────┘
       │
       ├──► googleCallback(code, state)
       │
       ▼
┌─────────────┐
│ Check Phone │
└──────┬──────┘
       │
       ├──► phone !== null → send OTP → /enter-otp
       │
       └──► phone === null → /add-phone (Registration only)
```

---

## 🔑 النقاط المهمة

### 1. لا Popup Windows
- Google Login يستخدم `window.location.href` للـ redirect مباشر
- نفس الصفحة - لا نافذة جديدة

### 2. Phone Validation في Callback Page
- **Google Login:** `phone !== null` → إرسال OTP تلقائياً → `/enter-otp`
- **Google Registration:** `phone === null` → `/add-phone` أولاً

### 3. Session Storage Management
- **Google User Data:** `googleUser`, `googleToken`, `googleFlow`
- **Phone:** `registrationPhone`
- **Cleanup:** بعد verify OTP → مسح كل sessionStorage

### 4. Error Handling
- كل الأخطاء → redirect to `/login?error={message}`
- LoginForm يعرض error من query params

### 5. OTP Verification
- Google Login و Registration يستخدمان نفس `/enter-otp` page
- Flow type يتم تحديده من `googleFlow` في sessionStorage

---

## 📝 API Calls Summary

### Google Login Flow:

1. **GET /api/v1/auth/google**
   - Response: `{ redirect_url, state }`

2. **GET /api/v1/auth/google/callback?code=XXX&state=YYY**
   - Response: `{ user, token }`
   - User.phone موجود دائماً

3. **POST /api/v1/auth/register-phone**
   - Body: `{ phone, password: null, password_confirmation: null }`
   - Response: `{ success: true, message: "OTP sent" }`

4. **POST /api/v1/auth/verify-phone**
   - Body: `{ phone, code }`
   - Response: `{ success: true, data: { token } }`

### Google Registration Flow:

1. **GET /api/v1/auth/google**
   - Response: `{ redirect_url, state }`

2. **GET /api/v1/auth/google/callback?code=XXX&state=YYY**
   - Response: `{ user, token }`
   - User.phone === null

3. **POST /api/v1/auth/register-phone** (في /add-phone)
   - Body: `{ phone, password: null, password_confirmation: null }`
   - Response: `{ success: true, message: "OTP sent" }`

4. **POST /api/v1/auth/verify-phone**
   - Body: `{ phone, code }`
   - Response: `{ success: true, data: { token } }`

---

## ✅ Checklist للاختبار

### Google Login:
- [ ] User يضغط "Continue with Google" → redirect في نفس الصفحة
- [ ] Google OAuth يعمل بشكل صحيح
- [ ] Callback page يحصل على user data
- [ ] phone موجود → OTP sent → redirect to /enter-otp
- [ ] OTP verification يعمل
- [ ] User data يُحفظ في authStore
- [ ] Redirect to home بعد verify

### Google Registration:
- [ ] User يضغط "Continue with Google" → redirect في نفس الصفحة
- [ ] Google OAuth يعمل بشكل صحيح
- [ ] Callback page يحصل على user data
- [ ] phone === null → redirect to /add-phone
- [ ] User يدخل phone → OTP sent → redirect to /enter-otp
- [ ] OTP verification يعمل
- [ ] User data يُحفظ في authStore
- [ ] Redirect to home بعد verify

### Error Handling:
- [ ] Missing code/state → redirect to /login with error
- [ ] API errors → redirect to /login with error
- [ ] LoginForm يعرض errors من query params
- [ ] Error messages واضحة ومفيدة

### Traditional Login:
- [ ] Email + Password login يعمل بشكل صحيح
- [ ] Remember Me يعمل
- [ ] Redirect to returnUrl بعد login

---

## 🔄 التغييرات الرئيسية

### قبل التحديث:
- Google Login يستخدم popup window
- postMessage communication بين popup و parent
- معقدة وصعبة الصيانة

### بعد التحديث:
- Google Login يستخدم redirect في نفس الصفحة
- لا postMessage - كل logic في callback page
- أبسط وأسهل في الصيانة
- UX أفضل (نفس الصفحة)

---

## 📞 ملاحظات

1. **الباك إند:** يجب أن يعمل redirect إلى `/auth/google/callback?code=XXX&state=YYY` (وليس إرجاع JSON مباشرة)

2. **Google Login:** دائماً `phone !== null` (لأن الحساب موجود مسبقاً)

3. **Google Registration:** `phone === null` → يحتاج `/add-phone` أولاً

4. **Session Storage:** يستخدم للـ state management بين الصفحات

5. **Error Handling:** كل الأخطاء → redirect to `/login?error={message}`

---

**آخر تحديث:** 2025-01-20

