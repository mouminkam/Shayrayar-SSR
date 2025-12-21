# دليل استخدام إعادة تعيين كلمة المرور

دليل سريع وشامل لاستخدام نظام إعادة تعيين كلمة المرور في التطبيق الموبايل وتطبيق Next.js.

---

## 📋 جدول المحتويات

1. [الإعداد الأولي](#الإعداد-الأولي)
2. [للتطبيق الموبايل](#للتطبيق-الموبايل)
3. [لتطبيق Next.js](#لتطبيق-nextjs)
4. [أمثلة كاملة](#أمثلة-كاملة)
5. [حل المشاكل](#حل-المشاكل)

---

## 🔧 الإعداد الأولي

### 1. إعدادات `.env`

أضف هذه الإعدادات في ملف `.env`:

```env
# رابط الواجهة الأمامية (Next.js)
FRONTEND_URL=https://shahrayar.peaklink.pro

# Deep Link Scheme للتطبيق الموبايل
MOBILE_DEEP_LINK_SCHEME=shahrayar://
```

### 2. مسح الكاش

بعد التحديثات، قم بمسح الكاش:

```bash
php artisan config:clear
php artisan cache:clear
php artisan route:clear
```

---

## 📱 للتطبيق الموبايل

### الخطوة 1: طلب إعادة تعيين كلمة المرور

```javascript
// React Native / Flutter Example
const forgotPassword = async (email) => {
  try {
    const response = await fetch('https://shahrayar.peaklink.pro/api/v1/auth/forgot-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        app_type: 'mobile' // مهم: تحديد نوع التطبيق
      }),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log('تم إرسال رابط إعادة التعيين إلى البريد الإلكتروني');
      // الرابط في البريد سيكون: shahrayar://reset-password?token=xxx&email=xxx
    }
  } catch (error) {
    console.error('Error:', error);
  }
};
```

### الخطوة 2: معالجة Deep Link

#### React Native (Expo)

```javascript
// app.json
{
  "expo": {
    "scheme": "shahrayar",
    // ...
  }
}

// App.js
import * as Linking from 'expo-linking';

useEffect(() => {
  // معالجة Deep Link عند فتح التطبيق
  const handleDeepLink = (event) => {
    const { url } = event;
    if (url.includes('reset-password')) {
      const params = Linking.parse(url);
      const token = params.queryParams?.token;
      const email = params.queryParams?.email;
      
      if (token && email) {
        // الانتقال إلى صفحة إعادة تعيين كلمة المرور
        navigation.navigate('ResetPassword', { token, email });
      }
    }
  };

  Linking.addEventListener('url', handleDeepLink);
  
  // التحقق من Deep Link عند فتح التطبيق
  Linking.getInitialURL().then((url) => {
    if (url) handleDeepLink({ url });
  });

  return () => {
    Linking.removeEventListener('url', handleDeepLink);
  };
}, []);
```

#### React Native (React Navigation)

```javascript
// navigation.js
import { NavigationContainer } from '@react-navigation/native';
import * as Linking from 'expo-linking';

const linking = {
  prefixes: ['shahrayar://'],
  config: {
    screens: {
      ResetPassword: {
        path: 'reset-password',
        parse: {
          token: (token) => token,
          email: (email) => email,
        },
      },
    },
  },
};

export default function App() {
  return (
    <NavigationContainer linking={linking}>
      {/* Your app */}
    </NavigationContainer>
  );
}
```

#### Flutter

```dart
// pubspec.yaml
dependencies:
  uni_links: ^0.5.1

// main.dart
import 'package:uni_links/uni_links.dart';

void initDeepLinks() {
  // معالجة Deep Link عند فتح التطبيق
  getInitialLink().then((String? link) {
    if (link != null) {
      handleDeepLink(link);
    }
  });

  // معالجة Deep Link أثناء تشغيل التطبيق
  linkStream.listen((String? link) {
    if (link != null) {
      handleDeepLink(link);
    }
  });
}

void handleDeepLink(String link) {
  if (link.contains('reset-password')) {
    final uri = Uri.parse(link);
    final token = uri.queryParameters['token'];
    final email = uri.queryParameters['email'];
    
    if (token != null && email != null) {
      // الانتقال إلى صفحة إعادة تعيين كلمة المرور
      Navigator.pushNamed(
        context,
        '/reset-password',
        arguments: {'token': token, 'email': email},
      );
    }
  }
}
```

### الخطوة 3: صفحة إعادة تعيين كلمة المرور

```javascript
// ResetPasswordScreen.js
const ResetPasswordScreen = ({ route }) => {
  const { token, email } = route.params;
  const [password, setPassword] = useState('');
  const [passwordConfirmation, setPasswordConfirmation] = useState('');

  const handleReset = async () => {
    try {
      const response = await fetch('https://shahrayar.peaklink.pro/api/v1/auth/reset-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token: token,
          email: email,
          password: password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();
      
      if (data.success) {
        // نجاح - الانتقال إلى صفحة تسجيل الدخول
        navigation.navigate('Login');
      } else {
        // عرض رسالة خطأ
        Alert.alert('خطأ', data.message || 'فشل في إعادة تعيين كلمة المرور');
      }
    } catch (error) {
      Alert.alert('خطأ', 'حدث خطأ أثناء الاتصال بالخادم');
    }
  };

  return (
    <View>
      <TextInput
        placeholder="كلمة المرور الجديدة"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      <TextInput
        placeholder="تأكيد كلمة المرور"
        secureTextEntry
        value={passwordConfirmation}
        onChangeText={setPasswordConfirmation}
      />
      <Button title="إعادة تعيين" onPress={handleReset} />
    </View>
  );
};
```

---

## 🌐 لتطبيق Next.js

### الخطوة 1: طلب إعادة تعيين كلمة المرور

```typescript
// app/forgot-password/page.tsx
'use client';

import { useState } from 'react';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          app_type: 'web' // أو بدون هذا الحقل (افتراضي: web)
        }),
      });

      const data = await response.json();

      if (data.success) {
        setMessage('تم إرسال رابط إعادة التعيين إلى بريدك الإلكتروني');
      } else {
        setMessage(data.message || 'حدث خطأ');
      }
    } catch (error) {
      setMessage('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="البريد الإلكتروني"
        required
      />
      <button type="submit" disabled={loading}>
        {loading ? 'جاري الإرسال...' : 'إرسال رابط إعادة التعيين'}
      </button>
      {message && <p>{message}</p>}
    </form>
  );
}
```

### الخطوة 2: صفحة إعادة تعيين كلمة المرور

```typescript
// app/reset-password/page.tsx
'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const [token, setToken] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordConfirmation, setPasswordConfirmation] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<boolean>(false);

  useEffect(() => {
    const tokenParam = searchParams.get('token');
    const emailParam = searchParams.get('email');
    
    if (tokenParam && emailParam) {
      setToken(tokenParam);
      setEmail(emailParam);
    } else {
      setError('رابط غير صحيح أو منتهي الصلاحية');
    }
  }, [searchParams]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (password !== passwordConfirmation) {
      setError('كلمات المرور غير متطابقة');
      setLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('كلمة المرور يجب أن تكون 8 أحرف على الأقل');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          token,
          email,
          password,
          password_confirmation: passwordConfirmation,
        }),
      });

      const data = await response.json();

      if (data.success) {
        setSuccess(true);
        setTimeout(() => {
          router.push('/login?password_reset=success');
        }, 2000);
      } else {
        setError(data.message || 'حدث خطأ أثناء إعادة تعيين كلمة المرور');
      }
    } catch (err) {
      setError('حدث خطأ أثناء الاتصال بالخادم');
    } finally {
      setLoading(false);
    }
  };

  if (!token || !email) {
    return (
      <div className="container">
        <h1>رابط غير صحيح</h1>
        <p>الرابط الذي استخدمته غير صحيح أو منتهي الصلاحية.</p>
        <a href="/forgot-password">طلب رابط جديد</a>
      </div>
    );
  }

  if (success) {
    return (
      <div className="container">
        <h1>تم بنجاح!</h1>
        <p>تم إعادة تعيين كلمة المرور بنجاح. سيتم إعادة توجيهك إلى صفحة تسجيل الدخول...</p>
      </div>
    );
  }

  return (
    <div className="container">
      <h1>إعادة تعيين كلمة المرور</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>البريد الإلكتروني</label>
          <input
            type="email"
            value={email}
            disabled
            className="disabled"
          />
        </div>
        
        <div>
          <label>كلمة المرور الجديدة</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="كلمة المرور الجديدة"
            required
            minLength={8}
          />
        </div>
        
        <div>
          <label>تأكيد كلمة المرور</label>
          <input
            type="password"
            value={passwordConfirmation}
            onChange={(e) => setPasswordConfirmation(e.target.value)}
            placeholder="تأكيد كلمة المرور"
            required
            minLength={8}
          />
        </div>
        
        {error && <div className="error">{error}</div>}
        
        <button type="submit" disabled={loading}>
          {loading ? 'جاري الحفظ...' : 'إعادة تعيين كلمة المرور'}
        </button>
      </form>
    </div>
  );
}
```

---

## 📝 أمثلة كاملة

### مثال كامل - React Native

```javascript
// services/auth.js
const API_URL = 'https://shahrayar.peaklink.pro/api/v1';

export const forgotPassword = async (email) => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      app_type: 'mobile',
    }),
  });
  return response.json();
};

export const resetPassword = async (token, email, password, passwordConfirmation) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  return response.json();
};
```

### مثال كامل - Next.js

```typescript
// lib/api.ts
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://shahrayar.peaklink.pro/api/v1';

export const forgotPassword = async (email: string, appType: 'mobile' | 'web' = 'web') => {
  const response = await fetch(`${API_URL}/auth/forgot-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      email,
      app_type: appType,
    }),
  });
  return response.json();
};

export const resetPassword = async (
  token: string,
  email: string,
  password: string,
  passwordConfirmation: string
) => {
  const response = await fetch(`${API_URL}/auth/reset-password`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      token,
      email,
      password,
      password_confirmation: passwordConfirmation,
    }),
  });
  return response.json();
};
```

---

## 🔍 حل المشاكل

### المشكلة 1: الرابط لا يفتح التطبيق الموبايل

**الحل:**
- تأكد من إعداد Deep Link Scheme بشكل صحيح في التطبيق
- تحقق من أن `MOBILE_DEEP_LINK_SCHEME` في `.env` مطابق للـ Scheme في التطبيق
- تأكد من إرسال `app_type: 'mobile'` في الطلب

### المشكلة 2: 404 في Next.js

**الحل:**
- تأكد من إنشاء صفحة `/reset-password` في Next.js
- تحقق من أن `FRONTEND_URL` في `.env` صحيح
- تأكد من أن Route في `web.php` يعمل بشكل صحيح

### المشكلة 3: Token غير صحيح

**الحل:**
- Token صالح لمدة 60 دقيقة فقط (افتراضي)
- تأكد من نسخ الرابط كاملاً من البريد
- تحقق من أن email مطابق للبريد المستخدم في الطلب

### المشكلة 4: البريد لا يصل

**الحل:**
- تحقق من إعدادات البريد في `.env`
- تأكد من أن `MAIL_MAILER=smtp`
- راجع سجلات Laravel: `storage/logs/laravel.log`

---

## 📚 API Endpoints

### POST `/api/v1/auth/forgot-password`

**Request:**
```json
{
  "email": "user@example.com",
  "app_type": "mobile" // أو "web" أو بدون (افتراضي: "web")
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "messages.general.success",
  "data": {
    "message": "تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني"
  }
}
```

### POST `/api/v1/auth/reset-password`

**Request:**
```json
{
  "token": "reset_token_from_email",
  "email": "user@example.com",
  "password": "newpassword123",
  "password_confirmation": "newpassword123"
}
```

**Response (Success):**
```json
{
  "success": true,
  "message": "messages.general.success",
  "data": {
    "message": "تم إعادة تعيين كلمة المرور بنجاح"
  }
}
```

**Response (Error):**
```json
{
  "success": false,
  "message": "messages.validation.failed",
  "errors": {
    "token": ["رمز إعادة التعيين غير صحيح أو منتهي الصلاحية"]
  }
}
```

---

## ✅ Checklist

- [ ] إضافة `FRONTEND_URL` في `.env`
- [ ] إضافة `MOBILE_DEEP_LINK_SCHEME` في `.env`
- [ ] مسح الكاش: `php artisan config:clear`
- [ ] إعداد Deep Link في التطبيق الموبايل
- [ ] إنشاء صفحة `/reset-password` في Next.js
- [ ] اختبار إرسال البريد
- [ ] اختبار Deep Link في التطبيق الموبايل
- [ ] اختبار رابط Next.js

---

## 📞 الدعم

إذا واجهت أي مشاكل، راجع:
- سجلات Laravel: `storage/logs/laravel.log`
- سجلات Next.js: Console في المتصفح
- سجلات التطبيق الموبايل: Console في IDE

---

**آخر تحديث:** 2024
