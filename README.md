# Magic Show Project - Next.js

هذا مشروع Next.js جاهز للنشر على Vercel.

## البدء السريع

لتشغيل المشروع محلياً:

```bash
npm install
npm run dev
```

افتح [http://localhost:3000](http://localhost:3000) في المتصفح لعرض المشروع.

## النشر على Vercel

### الطريقة الأولى: من خلال واجهة Vercel (موصى بها)

1. **الذهاب إلى صفحة Vercel:**
   - افتح الرابط: https://vercel.com/new?teamSlug=mo2min2001-2274s-projects

2. **ربط المشروع:**
   - اختر "Import Git Repository" (استيراد مستودع Git)
   - اختر المستودع: `mouminkam/Magic-Show`
   - اضغط "Import"

3. **إعدادات النشر:**
   - Vercel سيكتشف تلقائياً أنه مشروع Next.js
   - اضغط "Deploy" (نشر)

### الطريقة الثانية: من خلال Vercel CLI

```bash
# تثبيت Vercel CLI
npm i -g vercel

# النشر
vercel

# أو النشر للإنتاج مباشرة
vercel --prod
```

## متطلبات المشروع

- Node.js 18 أو أحدث
- npm أو yarn أو pnpm

## البناء والإنتاج

```bash
# بناء المشروع
npm run build

# تشغيل نسخة الإنتاج
npm start
```

## معلومات إضافية

- Framework: Next.js 16
- React: 19.2.0
- Styling: Tailwind CSS 4
- Package Manager: npm
