# توثيق شامل - Forget Password Flow

## نظرة عامة

هذا المستند يشرح بالتفصيل الكامل flow إعادة تعيين كلمة المرور في التطبيق، من البداية حتى النهاية.

---

## البنية العامة

```
┌─────────────────┐
│  Login Page     │
│  "Forgot Pass?" │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Forgot Password │
│   Page (Step 1)  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API    │
│  Send Email     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  User Email     │
│  Click Link     │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Verify Token  │
│   Page (Step 2) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API   │
│  Verify Token  │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Reset Password │
│   Page (Step 3) │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│  Backend API   │
│  Reset Password │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│   Login Page    │
│   (Success)     │
└─────────────────┘
```

---

## الخطوة 1: صفحة Forgot Password

### الملف: `src/app/forgot-password/page.jsx`

**الوصف:**
صفحة Next.js التي تسمح للمستخدم بإدخال بريده الإلكتروني لطلب إعادة تعيين كلمة المرور.

**البنية:**
- تستخدم `GuestOnly` للتحقق من أن المستخدم غير مسجل دخول
- تستخدم `Suspense` و `ErrorBoundary` للتعامل مع الأخطاء
- تستخدم `dynamic import` لتحميل `ForgotPasswordSection` بشكل lazy

**الكود:**
```javascript
"use client";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import AnimatedSection from "../../components/ui/AnimatedSection";
import ErrorBoundary from "../../components/ui/ErrorBoundary";
import SectionSkeleton from "../../components/ui/SectionSkeleton";
import GuestOnly from "../../components/auth/GuestOnly";

const ForgotPasswordSection = dynamic(
  () => import("../../components/pages/forgot-password/ForgotPasswordSection"),
  {
    loading: () => <SectionSkeleton variant="default" height="h-96" />,
    ssr: false,
  }
);

export default function ForgotPasswordPage() {
  return (
    <GuestOnly>
      <div className="bg-bg3 min-h-screen">
        <section className="forgot-password-section section-padding fix bg-bg3 py-12 px-1 sm:px-5 sm:py-16 md:py-20 lg:py-24 relative overflow-hidden">
          <div className="container mx-auto px-4 sm:px-6 md:px-8 lg:px-12">
            <div className="max-w-2xl mx-auto">
              <ErrorBoundary>
                <Suspense fallback={<SectionSkeleton variant="default" height="h-96" />}>
                  <AnimatedSection>
                    <ForgotPasswordSection />
                  </AnimatedSection>
                </Suspense>
              </ErrorBoundary>
            </div>
          </div>
        </section>
      </div>
    </GuestOnly>
  );
}
```

---

### Component: `ForgotPasswordSection`

**الملف:** `src/components/pages/forgot-password/ForgotPasswordSection.jsx`

**الوصف:**
Container component يجمع Header, Form, و Footer.

**الكود:**
```javascript
"use client";
import { motion } from "framer-motion";
import ForgotPasswordHeader from "./ForgotPasswordHeader";
import ForgotPasswordForm from "./ForgotPasswordForm";
import ForgotPasswordFooter from "./ForgotPasswordFooter";

export default function ForgotPasswordSection() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-linear-to-br from-bgimg/90 via-bgimg to-bgimg/95 backdrop-blur-sm rounded-3xl shadow-2xl shadow-theme3/10 border border-white/10 p-8 lg:p-10"
    >
      <ForgotPasswordHeader />
      <ForgotPasswordForm />
      <ForgotPasswordFooter />
    </motion.div>
  );
}
```

---

### Component: `ForgotPasswordForm`

**الملف:** `src/components/pages/forgot-password/ForgotPasswordForm.jsx`

**الوصف:**
الفورم الذي يجمع البريد الإلكتروني ويرسله إلى API.

**الحالات (States):**
- `email`: البريد الإلكتروني المدخل
- `errors`: أخطاء التحقق
- `isSuccess`: حالة النجاح بعد إرسال الطلب

**العمليات:**

1. **handleInputChange:**
   - تحديث `email` state
   - مسح الأخطاء عند البدء بالكتابة

2. **validateForm:**
   - التحقق من وجود البريد
   - التحقق من صحة صيغة البريد (regex)

3. **handleSubmit:**
   - منع default form submission
   - التحقق من صحة البيانات
   - استدعاء `resetPasswordRequest(email)` من authStore
   - إذا نجح: عرض رسالة نجاح
   - إذا فشل: عرض رسالة خطأ

**الكود المهم:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  const result = await resetPasswordRequest(email);

  if (result.success) {
    setIsSuccess(true);
    toastSuccess("Password reset link has been sent to your email. Please check your inbox.");
  } else {
    toastError(result.error || "Failed to send reset link. Please try again.");
  }
};
```

**عند النجاح:**
- يعرض رسالة "Check Your Email" مع البريد الإلكتروني
- لا يتم إعادة التوجيه (المستخدم يبقى في نفس الصفحة)

---

### Store Function: `resetPasswordRequest`

**الملف:** `src/store/authStore.js`

**الوصف:**
دالة في Zustand store تستدعي API لإرسال رابط إعادة التعيين.

**الكود:**
```javascript
resetPasswordRequest: async (email) => {
  set({ isLoading: true });
  try {
    const response = await api.auth.forgotPassword(email);
    set({ isLoading: false });
    
    if (response.success) {
      return { 
        success: true, 
        message: response.message || "Password reset link has been sent to your email" 
      };
    } else {
      return { 
        success: false, 
        error: response.message || "Failed to send reset link" 
      };
    }
  } catch (error) {
    set({ isLoading: false });
    const errorMessage = error.message || "An error occurred";
    
    return { 
      success: false, 
      error: errorMessage
    };
  }
}
```

---

### API Function: `forgotPassword`

**الملف:** `src/api/auth.js`

**الوصف:**
دالة API التي تستدعي Backend لإرسال رابط إعادة التعيين.

**الكود:**
```javascript
export const forgotPassword = async (email) => {
  const response = await axiosInstance.post('/auth/forgot-password', { 
    email,
    app_type: 'web' 
  });
  return response;
};
```

**الطلب (Request):**
- Method: `POST`
- Endpoint: `/auth/forgot-password`
- Body:
  ```json
  {
    "email": "user@example.com",
    "app_type": "web"
  }
  ```

**الاستجابة (Response):**
```json
{
  "success": true,
  "data": {},
  "message": "Password reset link has been sent to your email."
}
```

---

### Backend (Laravel) - ما يحدث في الخادم

**الملف:** `app/Http/Controllers/AuthController.php` (مثال)

**العمليات:**
1. التحقق من وجود البريد في قاعدة البيانات
2. إنشاء token عشوائي (64 حرف)
3. حفظ token في جدول `password_reset_tokens`
4. بناء رابط الإيميل:
   ```
   http://localhost:3000/verify-reset-token?token=XXX
   ```
5. إرسال الإيميل مع الرابط

**مثال الكود (Laravel):**
```php
public function forgotPassword(Request $request)
{
    $request->validate([
        'email' => 'required|email|exists:users,email',
        'app_type' => 'nullable|in:web,mobile'
    ]);

    $email = $request->email;
    $appType = $request->app_type ?? 'web';

    // إنشاء token
    $token = Str::random(64);
    
    // حفظ token
    DB::table('password_reset_tokens')->updateOrInsert(
        ['email' => $email],
        [
            'token' => Hash::make($token),
            'created_at' => now()
        ]
    );

    // بناء الرابط
    $frontendUrl = config('app.frontend_url'); // من .env
    $resetUrl = $frontendUrl . '/verify-reset-token?token=' . $token;

    // إرسال الإيميل
    Mail::send('emails.reset-password', [
        'resetUrl' => $resetUrl,
        'email' => $email
    ], function ($message) use ($email) {
        $message->to($email)
                ->subject('Reset Your Password');
    });

    return response()->json([
        'success' => true,
        'message' => 'Password reset link has been sent to your email.'
    ]);
}
```

---

## الخطوة 2: صفحة Verify Reset Token

### الملف: `src/app/verify-reset-token/page.jsx`

**الوصف:**
صفحة تقرأ token من URL، تتحقق منه مع Backend، ثم تعيد التوجيه إلى صفحة إدخال كلمة المرور.

**كيف يصل المستخدم هنا:**
- يضغط على رابط من الإيميل: `http://localhost:3000/verify-reset-token?token=XXX`

**البنية:**
- تستخدم `useSearchParams` لقراءة token من URL
- تستخدم `useRef` لمنع multiple API calls (infinite loop prevention)
- تستخدم `useEffect` للتحقق من token عند تحميل الصفحة

**الكود المهم:**
```javascript
function VerifyResetTokenContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { error: toastError } = useToastStore();
  const token = searchParams.get("token");
  
  const [isVerifying, setIsVerifying] = useState(true);
  const [error, setError] = useState(null);
  const hasVerifiedRef = useRef(false);

  useEffect(() => {
    // Prevent multiple calls
    if (hasVerifiedRef.current) return;

    const verifyToken = async () => {
      if (!token) {
        setError("Invalid reset link. Please request a new one.");
        setIsVerifying(false);
        setTimeout(() => {
          router.replace("/forgot-password");
        }, 2000);
        return;
      }

      try {
        setIsVerifying(true);
        setError(null);
        hasVerifiedRef.current = true;

        // Call API to verify token
        const response = await api.auth.verifyResetToken(token);

        if (response.success && response.data) {
          const { token: verifiedToken, email, valid } = response.data;

          if (valid && verifiedToken && email) {
            // Token is valid, redirect to reset-password
            const params = new URLSearchParams({
              token: verifiedToken,
              email: email
            });
            router.replace(`/reset-password?${params.toString()}`);
          } else {
            setError("This reset link is invalid or has expired.");
            setIsVerifying(false);
            hasVerifiedRef.current = false;
          }
        } else {
          setError(response.message || "Failed to verify reset token.");
          setIsVerifying(false);
          hasVerifiedRef.current = false;
        }
      } catch (err) {
        const errorMessage = err.message || "An error occurred.";
        setError(errorMessage);
        setIsVerifying(false);
        toastError(errorMessage);
        hasVerifiedRef.current = false;
      }
    };

    verifyToken();
  }, [token, router]);
}
```

**الحالات (States):**
1. **isVerifying = true**: عرض loading spinner
2. **error !== null**: عرض رسالة خطأ مع رابط لطلب reset جديد
3. **valid === true**: إعادة توجيه تلقائية إلى `/reset-password`

**ملاحظات مهمة:**
- `hasVerifiedRef` يمنع multiple API calls (حل مشكلة infinite loop)
- `toastError` غير موجود في dependencies array (منع infinite loop)
- استخدام `URLSearchParams` لضمان encoding صحيح

---

### API Function: `verifyResetToken`

**الملف:** `src/api/auth.js`

**الكود:**
```javascript
export const verifyResetToken = async (token) => {
  const response = await axiosInstance.get('/auth/verify-reset-token', {
    params: { token }
  });
  return response;
};
```

**الطلب (Request):**
- Method: `GET`
- Endpoint: `/auth/verify-reset-token?token=XXX`
- Headers: (default axios headers)

**الاستجابة (Response - Success):**
```json
{
  "success": true,
  "data": {
    "token": "25acba5de37ff3999e814df86c4d3088719e7db03354969ab2b657664385bc5c",
    "email": "mo2min.2001@gmail.com",
    "valid": true
  }
}
```

**الاستجابة (Response - Error):**
```json
{
  "success": false,
  "message": "Token is invalid or expired"
}
```

---

### Backend (Laravel) - Verify Token

**العمليات:**
1. قراءة token من query parameter
2. البحث عن token في جدول `password_reset_tokens`
3. التحقق من أن token لم ينتهِ صلاحيته (عادة 60 دقيقة)
4. التحقق من أن token يطابق البريد
5. إرجاع token, email, و valid status

**مثال الكود (Laravel):**
```php
public function verifyResetToken(Request $request)
{
    $token = $request->query('token');
    
    // البحث عن token
    $resetRecord = DB::table('password_reset_tokens')
        ->where('email', function($query) use ($token) {
            // البحث عن البريد المرتبط بالـ token
        })
        ->first();
    
    if (!$resetRecord) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid token'
        ], 404);
    }
    
    // التحقق من صلاحية token
    if (!Hash::check($token, $resetRecord->token)) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid token'
        ], 400);
    }
    
    // التحقق من انتهاء الصلاحية (60 دقيقة)
    $expired = now()->diffInMinutes($resetRecord->created_at) > 60;
    
    if ($expired) {
        return response()->json([
            'success' => false,
            'message' => 'Token expired'
        ], 400);
    }
    
    return response()->json([
        'success' => true,
        'data' => [
            'token' => $token,
            'email' => $resetRecord->email,
            'valid' => true
        ]
    ]);
}
```

---

## الخطوة 3: صفحة Reset Password

### الملف: `src/app/reset-password/page.jsx`

**الوصف:**
صفحة تسمح للمستخدم بإدخال كلمة المرور الجديدة.

**كيف يصل المستخدم هنا:**
- بعد التحقق الناجح من token، يتم إعادة التوجيه تلقائياً من `/verify-reset-token`
- الرابط: `http://localhost:3000/reset-password?token=XXX&email=YYY`

**البنية:**
- تقرأ `token` و `email` من URL query parameters
- إذا كان أحدهما مفقود، تعيد التوجيه إلى `/forgot-password`
- تعرض `ResetPasswordSection` component مع token و email

**الكود:**
```javascript
function ResetPasswordContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  useEffect(() => {
    // If token or email is missing, redirect to forgot-password
    if (!token || !email) {
      router.replace("/forgot-password");
    }
  }, [token, email, router]);

  // Show loading while checking params or redirecting
  if (!token || !email) {
    return (
      <div className="text-center py-8">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-theme3 mx-auto mb-4"></div>
        <p className="text-text text-lg">Redirecting...</p>
      </div>
    );
  }

  return <ResetPasswordSection token={token} email={email} />;
}
```

---

### Component: `ResetPasswordForm`

**الملف:** `src/components/pages/reset-password/ResetPasswordForm.jsx`

**الوصف:**
الفورم الذي يجمع كلمة المرور الجديدة ويرسلها إلى API.

**الحالات (States):**
- `formData.password`: كلمة المرور الجديدة
- `formData.password_confirmation`: تأكيد كلمة المرور
- `showPassword`: إظهار/إخفاء كلمة المرور
- `showConfirmPassword`: إظهار/إخفاء تأكيد كلمة المرور
- `errors`: أخطاء التحقق

**العمليات:**

1. **handleInputChange:**
   - تحديث `formData` state
   - مسح الأخطاء عند البدء بالكتابة

2. **validateForm:**
   - التحقق من وجود كلمة المرور
   - التحقق من أن كلمة المرور 8 أحرف على الأقل
   - التحقق من تطابق كلمة المرور مع التأكيد

3. **handleSubmit:**
   - منع default form submission
   - التحقق من صحة البيانات
   - التحقق من وجود token و email
   - استدعاء `resetPassword` من authStore
   - إذا نجح: عرض رسالة نجاح وإعادة توجيه إلى `/login` بعد 1.5 ثانية
   - إذا فشل: عرض رسالة خطأ

**الكود المهم:**
```javascript
const handleSubmit = async (e) => {
  e.preventDefault();

  if (!validateForm()) {
    return;
  }

  if (!token || !email) {
    toastError("Invalid reset link. Please request a new one.");
    router.push("/forgot-password");
    return;
  }

  const result = await resetPassword({
    token,
    email,
    password: formData.password,
    password_confirmation: formData.password_confirmation,
  });

  if (result.success) {
    toastSuccess("Password reset successfully! Please login with your new password.");
    setTimeout(() => {
      router.push("/login");
    }, 1500);
  } else {
    if (result.errors) {
      setErrors(result.errors);
    } else {
      toastError(result.error || "Failed to reset password. Please try again.");
    }
  }
};
```

**الحقول في الفورم:**
1. **Email (Read-only)**: يعرض البريد الإلكتروني (غير قابل للتعديل)
2. **New Password**: حقل إدخال كلمة المرور الجديدة مع زر إظهار/إخفاء
3. **Confirm Password**: حقل تأكيد كلمة المرور مع زر إظهار/إخفاء
4. **Submit Button**: زر إرسال مع loading state

---

### Store Function: `resetPassword`

**الملف:** `src/store/authStore.js`

**الكود:**
```javascript
resetPassword: async (resetData) => {
  set({ isLoading: true });
  try {
    const response = await api.auth.resetPassword(resetData);
    set({ isLoading: false });
    
    if (response.success) {
      return { 
        success: true, 
        message: response.message || "Password reset successfully" 
      };
    } else {
      return { 
        success: false, 
        error: response.message || "Failed to reset password" 
      };
    }
  } catch (error) {
    set({ isLoading: false });
    const errorMessage = error.message || "An error occurred while resetting password";
    const apiErrors = error.data?.errors || null;
    
    return { 
      success: false, 
      error: errorMessage,
      errors: apiErrors
    };
  }
}
```

---

### API Function: `resetPassword`

**الملف:** `src/api/auth.js`

**الكود:**
```javascript
export const resetPassword = async (resetData) => {
  const response = await axiosInstance.post('/auth/reset-password', resetData);
  return response;
};
```

**الطلب (Request):**
- Method: `POST`
- Endpoint: `/auth/reset-password`
- Body:
  ```json
  {
    "token": "25acba5de37ff3999e814df86c4d3088719e7db03354969ab2b657664385bc5c",
    "email": "mo2min.2001@gmail.com",
    "password": "newpassword123",
    "password_confirmation": "newpassword123"
  }
  ```

**الاستجابة (Response - Success):**
```json
{
  "success": true,
  "message": "تم إعادة تعيين كلمة المرور بنجاح",
  "data": {
    "message": "Password reset successfully"
  }
}
```

**الاستجابة (Response - Error):**
```json
{
  "success": false,
  "message": "messages.validation.failed",
  "errors": {
    "token": ["رمز إعادة التعيين غير صحيح أو منتهي الصلاحية"],
    "password": ["كلمة المرور يجب أن تكون 8 أحرف على الأقل"]
  }
}
```

---

### Backend (Laravel) - Reset Password

**العمليات:**
1. التحقق من صحة البيانات (validation)
2. البحث عن token في جدول `password_reset_tokens`
3. التحقق من أن token صحيح ولم ينتهِ صلاحيته
4. تحديث كلمة المرور للمستخدم في جدول `users`
5. حذف token من جدول `password_reset_tokens` (لا يمكن استخدامه مرة أخرى)
6. إرجاع رسالة نجاح

**مثال الكود (Laravel):**
```php
public function resetPassword(Request $request)
{
    $request->validate([
        'token' => 'required|string',
        'email' => 'required|email',
        'password' => 'required|string|min:8|confirmed',
    ]);

    // البحث عن token
    $resetRecord = DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->first();

    if (!$resetRecord) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid token'
        ], 400);
    }

    // التحقق من صلاحية token
    if (!Hash::check($request->token, $resetRecord->token)) {
        return response()->json([
            'success' => false,
            'message' => 'Invalid token'
        ], 400);
    }

    // التحقق من انتهاء الصلاحية
    $expired = now()->diffInMinutes($resetRecord->created_at) > 60;
    if ($expired) {
        return response()->json([
            'success' => false,
            'message' => 'Token expired'
        ], 400);
    }

    // تحديث كلمة المرور
    $user = User::where('email', $request->email)->first();
    $user->password = Hash::make($request->password);
    $user->save();

    // حذف token (لا يمكن استخدامه مرة أخرى)
    DB::table('password_reset_tokens')
        ->where('email', $request->email)
        ->delete();

    return response()->json([
        'success' => true,
        'message' => 'Password reset successfully'
    ]);
}
```

---

## Flow الكامل خطوة بخطوة

### 1. المستخدم يضغط "Forgot Password?" في Login Page

**الملف:** `src/components/pages/login/LoginForm.jsx`

**الكود:**
```javascript
<a
  href="/forgot-password"
  className="text-theme3 hover:text-theme text-sm font-medium transition-colors"
>
  Forgot password?
</a>
```

**النتيجة:** الانتقال إلى `/forgot-password`

---

### 2. المستخدم يدخل البريد الإلكتروني

**الصفحة:** `/forgot-password`

**العملية:**
- المستخدم يدخل البريد في `ForgotPasswordForm`
- يضغط "Send Reset Link"
- يتم التحقق من صحة البريد (regex)
- يتم استدعاء `resetPasswordRequest(email)`

**API Call:**
```
POST /api/v1/auth/forgot-password
Body: { email: "user@example.com", app_type: "web" }
```

**Backend Response:**
```json
{
  "success": true,
  "message": "Password reset link has been sent to your email."
}
```

**Frontend Response:**
- عرض رسالة نجاح: "Check Your Email"
- عرض البريد الإلكتروني
- لا يتم إعادة التوجيه

---

### 3. Backend يرسل الإيميل

**الرابط في الإيميل:**
```
http://localhost:3000/verify-reset-token?token=14e05fa30f9e3d3b03c7a1ee41e16291b54bc4b28c4cf7b935d5db6ff89c891a
```

**ملاحظة:** الرابط يحتوي على token فقط (لا email)

---

### 4. المستخدم يضغط على الرابط من الإيميل

**الصفحة:** `/verify-reset-token?token=XXX`

**العملية:**
- الصفحة تقرأ token من URL
- تستدعي `verifyResetToken(token)` API
- تعرض loading spinner أثناء التحقق

**API Call:**
```
GET /api/v1/auth/verify-reset-token?token=XXX
```

**Backend Response (Success):**
```json
{
  "success": true,
  "data": {
    "token": "XXX",
    "email": "user@example.com",
    "valid": true
  }
}
```

**Frontend Response:**
- إذا `valid === true`: إعادة توجيه تلقائية إلى `/reset-password?token=XXX&email=YYY`
- إذا `valid === false`: عرض رسالة خطأ مع رابط لطلب reset جديد

---

### 5. صفحة Reset Password

**الصفحة:** `/reset-password?token=XXX&email=YYY`

**العملية:**
- الصفحة تقرأ token و email من URL
- إذا كان أحدهما مفقود: إعادة توجيه إلى `/forgot-password`
- إذا كانا موجودين: عرض فورم إدخال كلمة المرور

**الفورم يحتوي على:**
- Email (read-only): يعرض البريد
- New Password: حقل إدخال مع زر إظهار/إخفاء
- Confirm Password: حقل تأكيد مع زر إظهار/إخفاء
- Submit Button: زر إرسال

---

### 6. المستخدم يدخل كلمة المرور الجديدة

**العملية:**
- المستخدم يدخل كلمة المرور الجديدة
- يضغط "Reset Password"
- يتم التحقق من:
  - كلمة المرور موجودة
  - كلمة المرور 8 أحرف على الأقل
  - كلمة المرور تطابق التأكيد
- يتم استدعاء `resetPassword(resetData)` من authStore

**API Call:**
```
POST /api/v1/auth/reset-password
Body: {
  "token": "XXX",
  "email": "user@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Backend Response (Success):**
```json
{
  "success": true,
  "message": "تم إعادة تعيين كلمة المرور بنجاح"
}
```

**Frontend Response:**
- عرض رسالة نجاح: "Password reset successfully!"
- إعادة توجيه تلقائية إلى `/login` بعد 1.5 ثانية

---

### 7. المستخدم يسجل الدخول بكلمة المرور الجديدة

**الصفحة:** `/login`

**العملية:**
- المستخدم يدخل البريد وكلمة المرور الجديدة
- يضغط "Login"
- يتم تسجيل الدخول بنجاح

---

## الملفات المشاركة في الـ Flow

### Frontend Files

1. **Pages:**
   - `src/app/forgot-password/page.jsx`
   - `src/app/verify-reset-token/page.jsx`
   - `src/app/reset-password/page.jsx`

2. **Components:**
   - `src/components/pages/forgot-password/ForgotPasswordSection.jsx`
   - `src/components/pages/forgot-password/ForgotPasswordHeader.jsx`
   - `src/components/pages/forgot-password/ForgotPasswordForm.jsx`
   - `src/components/pages/forgot-password/ForgotPasswordFooter.jsx`
   - `src/components/pages/reset-password/ResetPasswordSection.jsx`
   - `src/components/pages/reset-password/ResetPasswordHeader.jsx`
   - `src/components/pages/reset-password/ResetPasswordForm.jsx`
   - `src/components/pages/reset-password/ResetPasswordFooter.jsx`

3. **API:**
   - `src/api/auth.js` (forgotPassword, verifyResetToken, resetPassword)

4. **Store:**
   - `src/store/authStore.js` (resetPasswordRequest, resetPassword)

5. **Login:**
   - `src/components/pages/login/LoginForm.jsx` (رابط Forgot Password)

---

### Backend Endpoints

1. **POST `/api/v1/auth/forgot-password`**
   - Input: `{ email, app_type: "web" }`
   - Output: `{ success: true, message: "..." }`
   - Action: إرسال رابط في الإيميل

2. **GET `/api/v1/auth/verify-reset-token?token=XXX`**
   - Input: `token` (query parameter)
   - Output: `{ success: true, data: { token, email, valid: true } }`
   - Action: التحقق من صحة token

3. **POST `/api/v1/auth/reset-password`**
   - Input: `{ token, email, password, password_confirmation }`
   - Output: `{ success: true, message: "..." }`
   - Action: تحديث كلمة المرور

---

## حالات الخطأ ومعالجتها

### 1. البريد غير موجود

**السيناريو:** المستخدم يدخل بريد غير مسجل

**Backend Response:**
```json
{
  "success": false,
  "message": "The email does not exist"
}
```

**Frontend Handling:**
- عرض رسالة خطأ: "Failed to send reset link"
- المستخدم يبقى في نفس الصفحة

---

### 2. Token غير صحيح أو منتهي الصلاحية

**السيناريو:** المستخدم يضغط على رابط منتهي الصلاحية

**Backend Response:**
```json
{
  "success": false,
  "message": "Token is invalid or expired"
}
```

**Frontend Handling:**
- عرض رسالة خطأ: "This reset link is invalid or has expired"
- عرض رابط: "Request New Reset Link" → `/forgot-password`

---

### 3. كلمة المرور غير متطابقة

**السيناريو:** المستخدم يدخل كلمة مرور مختلفة في التأكيد

**Frontend Validation:**
- التحقق قبل إرسال الطلب
- عرض خطأ: "Passwords do not match"
- منع إرسال الطلب

---

### 4. كلمة المرور قصيرة

**السيناريو:** المستخدم يدخل كلمة مرور أقل من 8 أحرف

**Frontend Validation:**
- التحقق قبل إرسال الطلب
- عرض خطأ: "Password must be at least 8 characters"
- منع إرسال الطلب

---

### 5. Token مستخدم مسبقاً

**السيناريو:** المستخدم يستخدم نفس الرابط مرتين

**Backend Response:**
```json
{
  "success": false,
  "message": "Token has already been used"
}
```

**Frontend Handling:**
- عرض رسالة خطأ
- عرض رابط لطلب reset جديد

---

## Security Considerations

### 1. Token Expiration
- Token صالح لمدة 60 دقيقة فقط
- بعد انتهاء الصلاحية، يجب طلب reset جديد

### 2. One-Time Use
- Token يُحذف بعد استخدامه بنجاح
- لا يمكن استخدام نفس الرابط مرتين

### 3. Email Verification
- Token مرتبط بالبريد الإلكتروني
- لا يمكن استخدام token مع بريد مختلف

### 4. Rate Limiting
- يجب تطبيق rate limiting في Backend
- منع spam requests

### 5. HTTPS
- يجب استخدام HTTPS في Production
- حماية البيانات أثناء النقل

---

## Environment Variables

### Frontend (.env.local)
```env
NEXT_PUBLIC_API_BASE_URL=https://shahrayar.peaklink.pro/api/v1
```

### Backend (.env)
```env
FRONTEND_URL=http://localhost:3000
# أو في Production:
# FRONTEND_URL=https://shahrayar.peaklink.pro
```

---

## Testing Checklist

- [ ] طلب reset password بإيميل صحيح
- [ ] طلب reset password بإيميل غير موجود
- [ ] فتح رابط من الإيميل
- [ ] التحقق من token صحيح
- [ ] التحقق من token منتهي الصلاحية
- [ ] إدخال كلمة مرور جديدة
- [ ] التحقق من تطابق كلمة المرور
- [ ] إعادة تعيين كلمة المرور بنجاح
- [ ] تسجيل الدخول بكلمة المرور الجديدة
- [ ] محاولة استخدام نفس الرابط مرتين

---

## ملاحظات نهائية

1. **لا يتم حفظ token في localStorage أو sessionStorage** - يتم تمريره فقط عبر URL
2. **الصفحات محمية بـ GuestOnly** - لا يمكن الوصول إليها إذا كان المستخدم مسجل دخول
3. **استخدام Suspense** - لتحسين performance و handling loading states
4. **Error Boundaries** - للتعامل مع الأخطاء بشكل graceful
5. **URLSearchParams** - لضمان encoding صحيح للـ token و email في URL

---

**آخر تحديث:** 2024
