# Backend Requirement: Forgot Password Email OTP

## المشكلة الحالية

الـ endpoint الحالي `/auth/forgot-password` يرسل OTP **للموبايل فقط** وليس للإيميل.

### الطلب الحالي:
```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com"
}
```

### Response الحالي:
```json
{
  "success": true,
  "data": {},
  "message": "Operation completed successfully"
}
```

**المشكلة**: الـ OTP لا يصل للإيميل، يصل للموبايل فقط.

---

## الحل المطلوب

### الخيار 1: إضافة Endpoint جديد (موصى به)

إضافة endpoint جديد مخصص لإرسال OTP للإيميل:

```http
POST /api/v1/auth/forgot-password-email
Content-Type: application/json

{
  "email": "user@example.com"
}
```

**Response المطلوب:**
```json
{
  "success": true,
  "data": {
    "email": "user@example.com",
    "otp_sent": true
  },
  "message": "OTP sent to your email successfully"
}
```

**الخطوات المطلوبة:**
1. البحث عن User بالإيميل
2. إرسال OTP للإيميل (ليس للموبايل)
3. حفظ OTP في Database مع timestamp
4. إرجاع success response

---

### الخيار 2: تعديل Endpoint الموجود

تعديل `/auth/forgot-password` ليدعم كلاً من الإيميل والموبايل:

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "email": "user@example.com",
  "type": "email"  // أو "phone"
}
```

أو:

```http
POST /api/v1/auth/forgot-password
Content-Type: application/json

{
  "identifier": "user@example.com",  // يمكن أن يكون email أو phone
  "type": "email"  // "email" أو "phone"
}
```

---

## Flow الكامل المطلوب

### 1. User يطلب Reset Password بالإيميل
```
POST /api/v1/auth/forgot-password-email
Body: { "email": "user@example.com" }
```

### 2. Backend:
- يبحث عن User بالإيميل
- يولد OTP (4 أرقام)
- يرسل OTP للإيميل
- يحفظ OTP في Database مع:
  - email
  - otp_code
  - expires_at (مثلاً 10 دقائق)
  - created_at

### 3. Response:
```json
{
  "success": true,
  "data": {
    "email": "user@example.com"
  },
  "message": "OTP sent to your email"
}
```

### 4. User يدخل OTP في Frontend

### 5. Frontend يتحقق من OTP:
```
POST /api/v1/auth/reset-password
Body: {
  "token": "1234",  // OTP code
  "email": "user@example.com",
  "password": "newPassword123",
  "password_confirmation": "newPassword123"
}
```

### 6. Backend:
- يتحقق من OTP
- يتحقق من expiration
- يحدث password
- يحذف OTP من Database

---

## ملاحظات مهمة

1. **OTP Format**: 4 أرقام (مثل: 1234)
2. **OTP Expiration**: 10 دقائق (قابل للتعديل)
3. **OTP Storage**: يجب حفظ OTP في Database مع email و timestamp
4. **Email Service**: يجب استخدام email service لإرسال OTP (مثل: Mailgun, SendGrid, etc.)
5. **Security**: يجب حماية endpoint من brute force attacks

---

## مثال على Email Template

```
Subject: Reset Password OTP

Hello,

Your OTP code for password reset is: 1234

This code will expire in 10 minutes.

If you didn't request this, please ignore this email.
```

---

## Frontend Ready

الـ Frontend جاهز ويستخدم:
- `api.auth.forgotPassword(email)` - لإرسال OTP
- `authStore.resetPasswordRequest(email)` - للـ state management
- `authStore.verifyOTP(email, otp)` - للتحقق من OTP
- `authStore.resetPassword({ token, email, password, password_confirmation })` - لإعادة تعيين Password

**كل ما نحتاجه من Backend**: إضافة endpoint لإرسال OTP للإيميل.

---

## Priority

**High Priority** - هذه الميزة ضرورية لـ Reset Password flow.

